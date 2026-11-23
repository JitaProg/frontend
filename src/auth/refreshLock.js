const LOCK = 'agrobotiga.web-auth.v1'
const SIGNAL = `${LOCK}.state`
const initial = { epoch: '', phase: 'signed-out', generation: null }
const generationPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const inFlightPhases = new Set(['rotating', 'signing-in', 'signing-out'])
const phases = new Set(['active', 'signed-out', 'uncertain', 'logout-unconfirmed', 'interrupted', ...inFlightPhases])
const WAIT_EXPIRED = Symbol('auth lock wait expired')
const LOCK_WAIT_MS = 10000
const POST_NOTICE_MS = 15000
const CLOCK_DRIFT_MS = 2000
const definitive = new Set([
  'NO_WEB_SESSION', 'INVALID_REFRESH_TOKEN', 'REFRESH_TOKEN_EXPIRED',
  'REFRESH_TOKEN_REUSED', 'REFRESH_TOKEN_REVOKED', 'USER_INACTIVE',
])
const loginErrors = {
  INVALID_CREDENTIALS: [401, 'El correu o la contrasenya no són correctes.'],
  ACCOUNT_DISABLED: [403, 'El compte està desactivat.'],
  VALIDATION_ERROR: [400, 'Revisa el correu i la contrasenya.'],
  WEB_AUTH_FORBIDDEN: [403, 'La sessió web local no està habilitada en aquest origen.'],
  AMBIGUOUS_SESSION_COOKIE: [400, 'No es pot identificar la galeta de sessió.'],
}
const incompatible = 'La sessió necessita un navegador amb Web Locks i emmagatzematge disponible. Obre la botiga a localhost o 127.0.0.1:5173.'
const unconfirmedLogout = 'No s’ha pogut confirmar el tancament al servidor. Torna-ho a provar.'
const waitingForPost = 'El servidor encara no ha confirmat l’operació de sessió. Mantén oberta aquesta pestanya i espera la resposta.'
const waitingForLogout = 'El tancament encara no està confirmat. Espera la resposta a la pestanya que l’ha iniciat. Si ja és tancada, torna a activar aquesta pestanya per comprovar l’estat.'
const waitExpired = 'Aquesta sol·licitud no s’ha enviat: una altra operació de sessió ocupa el bloqueig. Espera que acabi abans de tornar-ho a provar.'
const interrupted = 'No s’ha confirmat el tancament de la sessió anterior. Pots iniciar-ne una de nova aquí; l’anterior caducarà si encara és activa.'
const staleLogout = 'No s’ha tancat cap sessió: la sessió ha canviat en una altra pestanya.'
const unavailableProfile = 'No s’ha pogut recuperar el perfil. Torna-ho a provar.'
const webUnavailable = loginErrors.WEB_AUTH_FORBIDDEN[1]

export function createWebSession(env) {
  let view = { status: 'checking', user: null, busy: false, message: '', recovery: null }
  let session, timer, refreshFlight, changeFlight, holderProbe
  let running = false
  let disabled = false
  let needsRestore = true
  let epoch
  let observedPhase
  let intent = 0
  const listeners = new Set()
  const checks = new Set()
  const now = () => env.performance.now()
  const civilNow = () => (env.Date ?? Date).now()

  function publish(status, { user = null, busy = false, message = '', recovery = null } = {}) {
    view = { status, user, busy, message, recovery, sessionEpoch: epoch }
    listeners.forEach((listener) => listener())
  }

  function forget() {
    session = undefined
    env.clearTimeout(timer)
  }

  function failClosed() {
    disabled = true
    ++intent
    forget()
    publish('blocked', { message: incompatible })
  }

  // Only a non-sensitive journal/notification. Mutual exclusion is exclusively Web Locks.
  function read() {
    const raw = env.localStorage.getItem(SIGNAL)
    if (raw === null) return initial
    const value = JSON.parse(raw)
    if (!value || typeof value.epoch !== 'string' || !phases.has(value.phase)) throw new Error()
    // Do not reuse the shared-path cookie from the previous local web protocol.
    if (!Object.hasOwn(value, 'generation')) {
      return {
        epoch: value.epoch, generation: null,
        phase: value.phase === 'signed-out' ? 'signed-out' : 'interrupted',
      }
    }
    if (value.generation === null) {
      if (!['signed-out', 'interrupted'].includes(value.phase)) throw new Error()
    } else if (typeof value.generation !== 'string' || !generationPattern.test(value.generation)) {
      throw new Error()
    }
    return value
  }

  function write(phase, revision, generation) {
    const marker = { phase, epoch: revision, generation }
    env.localStorage.setItem(SIGNAL, JSON.stringify(marker))
    epoch = revision
    observedPhase = phase
    return marker
  }

  function isCurrent(marker) {
    const current = read()
    return current.epoch === marker.epoch && current.generation === marker.generation && current.phase === marker.phase
  }

  async function request(endpoint, { body, accessToken, generation } = {}) {
    const started = now()
    const wallStarted = civilNow()
    const path = accessToken ? '/api/users/me' : `/api/users/session/${generation}/${endpoint}`
    const response = await env.fetch(path, {
      method: accessToken ? 'GET' : 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
      redirect: 'error',
      cache: 'no-store',
      headers: {
        'X-Agrobotiga-Auth': 'web',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : { 'Content-Type': 'application/json' }),
      },
      ...(accessToken
        ? { signal: AbortSignal.timeout(15000) }
        : { body: JSON.stringify(body ?? {}) }),
    })
    const payload = await response.json()
    return { status: response.status, ok: response.ok && payload?.success === true, data: payload?.data, code: payload?.error?.code, started, wallStarted }
  }

  function tokenSession(result) {
    const { accessToken, expiresIn } = result.data ?? {}
    if (typeof accessToken !== 'string' || !accessToken || !Number.isFinite(expiresIn) || expiresIn < 0) {
      throw new Error()
    }
    const ttl = expiresIn * 1000
    return {
      accessToken,
      monoSample: result.started,
      wallSample: result.wallStarted,
      expiresAt: result.started + ttl,
      refreshAt: Math.max(now() + 2000, result.started + ttl - Math.min(ttl / 2, 30000)),
    }
  }

  function validUser(user) {
    return typeof user?._id === 'string' && user._id && typeof user.nom === 'string'
  }

  function arm() {
    env.clearTimeout(timer)
    if (running && session?.user && view.status === 'authenticated') {
      const target = Math.min(session.refreshAt, session.expiresAt)
      timer = env.setTimeout(onDue, Math.max(0, Math.min(2 ** 31 - 1, target - now())))
    }
  }

  function expiredAfterClockCheck(candidate, time = now()) {
    const wall = civilNow()
    const drift = (wall - candidate.wallSample) - (time - candidate.monoSample)
    // perf.now can pause in system sleep. Charge the uncounted time once, even
    // if the access token still has time left. Rebase on civil rollback without
    // giving any time back; the shortened deadlines remain monotonic.
    if (Math.abs(drift) >= CLOCK_DRIFT_MS) {
      candidate.monoSample = time
      candidate.wallSample = wall
      if (drift > 0) {
        candidate.expiresAt -= drift
        candidate.refreshAt -= drift
      }
    }
    return time >= candidate.expiresAt
  }

  function onDue(recheckSuspension = false) {
    if (!session?.user || view.status !== 'authenticated') return
    const time = now()
    const expired = recheckSuspension === true ? expiredAfterClockCheck(session, time) : time >= session.expiresAt
    if (session.refreshAt >= session.expiresAt && expired) profileProblem()
    else if (expired || time >= session.refreshAt) refresh()
    else arm()
  }

  function showSession() {
    if (disabled) {
      forget()
      return false
    }
    if (expiredAfterClockCheck(session)) {
      profileProblem()
      return false
    }
    publish('authenticated', { user: session.user })
    arm()
    return true
  }

  function profileProblem() {
    env.clearTimeout(timer)
    publish('recoverable', { message: unavailableProfile, recovery: 'refresh' })
  }

  function showJournal(state, message) {
    forget()
    if (state.phase === 'logout-unconfirmed') {
      publish('blocked', {
        message: message || unconfirmedLogout,
        recovery: 'logout',
      })
    } else if (state.phase === 'signing-out') {
      publish('blocked', { message: waitingForLogout })
    } else if (state.phase === 'interrupted' || state.phase === 'uncertain') {
      publish('anonymous', { message: interrupted })
    } else {
      publish('anonymous', { message })
    }
  }

  function observe(checkAbandoned = false) {
    if (disabled || !running || changeFlight) return
    try {
      const current = read()
      const changed = epoch !== current.epoch
      const phaseChanged = observedPhase !== current.phase
      epoch = current.epoch
      observedPhase = current.phase
      if (inFlightPhases.has(current.phase) && (phaseChanged || checkAbandoned)) probeInterrupted()
      if (['signed-out', 'uncertain', 'signing-out', 'logout-unconfirmed', 'interrupted'].includes(current.phase)) {
        needsRestore = false
        const expectedStatus = ['signed-out', 'uncertain', 'interrupted'].includes(current.phase) ? 'anonymous' : 'blocked'
        if (view.busy || changed || phaseChanged || view.status !== expectedStatus) showJournal(current)
        return
      }
      if (changed) {
        forget()
        needsRestore = true
        publish('checking')
      }
      if (needsRestore && !refreshFlight) {
        needsRestore = false
        refresh()
      }
    } catch {
      failClosed()
    }
  }

  function watchdog(delay, expire) {
    const deadline = now() + delay
    let timeout
    const stop = () => {
      checks.delete(check)
      env.clearTimeout(timeout)
    }
    function check() {
      if (!checks.has(check)) return
      const remaining = deadline - now()
      env.clearTimeout(timeout)
      if (remaining <= 0) {
        stop()
        expire()
      } else {
        timeout = env.setTimeout(check, remaining)
      }
    }
    checks.add(check)
    check()
    return { check, stop }
  }

  async function locked(operation) {
    const controller = new AbortController()
    const waiting = watchdog(LOCK_WAIT_MS, () => controller.abort())
    try {
      return await env.navigator.locks.request(LOCK, {
        mode: 'exclusive', signal: controller.signal,
      }, () => {
        waiting.check()
        waiting.stop()
        // Cancelling a waiter is safe. Once owned, never use this signal for HTTP.
        if (controller.signal.aborted) return WAIT_EXPIRED
        return operation()
      })
    } catch (error) {
      if (controller.signal.aborted) return WAIT_EXPIRED
      throw error
    } finally {
      waiting.stop()
    }
  }

  async function post(endpoint, marker, expectedIntent, body) {
    const pending = watchdog(POST_NOTICE_MS, () => {
      if (disabled || intent !== expectedIntent) return
      try {
        if (isCurrent(marker)) publish('blocked', { message: waitingForPost })
      } catch {
        failClosed()
      }
    })
    try {
      // The deadline only changes the UI. Hold the lock until fetch and its body settle.
      return await request(endpoint, { body, generation: marker.generation })
    } finally {
      pending.stop()
    }
  }

  function interruptedHolder(current) {
    if (inFlightPhases.has(current.phase)) {
      // We own the lock, so the previous holder vanished without recording settlement.
      // Its server request might still commit. Only a new, disjoint login may replace it.
      write('interrupted', current.epoch, current.generation)
      showJournal({ phase: 'interrupted' })
      return true
    }
    return false
  }

  function probeInterrupted() {
    if (holderProbe) return
    // A passive check cannot enqueue a request or interfere with a live owner.
    holderProbe = Promise.resolve().then(() => env.navigator.locks.request(LOCK, {
      mode: 'exclusive', ifAvailable: true,
    }, (lock) => {
      if (!lock || changeFlight || disabled) return
      interruptedHolder(read())
    })).catch(failClosed).finally(() => {
      holderProbe = undefined
    })
  }

  function noLogout(current) {
    epoch = current.epoch
    observedPhase = current.phase
    needsRestore = false
    if (['active', 'rotating', 'signing-in'].includes(current.phase)) {
      publish('recoverable', { message: staleLogout, recovery: 'refresh' })
    } else {
      showJournal(current, staleLogout)
    }
    return false
  }

  function waitProblem(kind, targetEpoch) {
    const current = read()
    if (kind === 'logout' && current.epoch !== targetEpoch) return noLogout(current)
    if (epoch !== current.epoch) forget()
    epoch = current.epoch
    observedPhase = current.phase
    needsRestore = false
    if (['signing-out', 'interrupted', 'logout-unconfirmed', 'uncertain'].includes(current.phase)) {
      showJournal(current, waitExpired)
    } else if (kind === 'login') {
      publish('anonymous', { message: waitExpired })
    } else {
      publish(kind === 'logout' ? 'blocked' : 'recoverable', { message: waitExpired, recovery: kind })
    }
    return false
  }

  function refresh() {
    if (refreshFlight || changeFlight || disabled) return refreshFlight
    const revision = epoch
    const expectedIntent = intent
    env.clearTimeout(timer)
    publish('checking')
    refreshFlight = Promise.resolve().then(() => locked(async () => {
      const current = read()
      if (expectedIntent !== intent || revision !== current.epoch || disabled) return
      if (interruptedHolder(current)) return
      if (current.phase !== 'active') return showJournal(current)

      let profileMarker = current
      if (!session || session.user || expiredAfterClockCheck(session)) {
        const marker = write('rotating', current.epoch, current.generation)
        let result, candidate
        try {
          result = await post('refresh', marker, expectedIntent)
          if (result.ok) candidate = tokenSession(result)
        } catch {
          // The response might have been lost after the old refresh cookie was consumed.
        }
        if (!isCurrent(marker)) return
        if (!candidate) {
          if (result?.status === 403 && result.code === 'WEB_AUTH_FORBIDDEN') {
            write('active', current.epoch, current.generation)
            if (expectedIntent === intent) {
              forget()
              publish('blocked', { message: webUnavailable })
            }
            return
          }
          const phase = result?.status === 401 && definitive.has(result.code) ? 'signed-out' : 'interrupted'
          write(phase, current.epoch, phase === 'signed-out' ? null : current.generation)
          if (expectedIntent === intent) showJournal({ phase })
          return
        }
        profileMarker = write('active', current.epoch, current.generation)
        if (expectedIntent !== intent) return
        session = candidate
      }
      const candidate = session
      if (expiredAfterClockCheck(candidate)) return profileProblem()

      let user
      try {
        const me = await request('me', { accessToken: candidate.accessToken })
        if (me.ok && validUser(me.data)) user = me.data
        // Retrying a read is safe; an unauthorized Bearer instead needs a new refresh.
        if (me.status === 401 && expectedIntent === intent && isCurrent(profileMarker)) forget()
      } catch {
        // Keep the confirmed in-memory access candidate for an explicit profile retry.
      }
      if (expectedIntent !== intent || !isCurrent(profileMarker)) return
      if (!user) return profileProblem()
      if (session !== candidate) return
      candidate.user = user
      showSession()
    })).then((result) => {
      if (result === WAIT_EXPIRED && expectedIntent === intent && !disabled) waitProblem('refresh', revision)
    }).catch(failClosed).finally(() => {
      refreshFlight = undefined
      observe()
    })
    return refreshFlight
  }

  function login(credentials) {
    if (changeFlight || disabled) return Promise.resolve({ ok: false, message: view.message })
    const revision = epoch
    const expectedIntent = ++intent
    forget()
    publish('checking', { busy: true })
    changeFlight = Promise.resolve().then(() => locked(async () => {
      const current = read()
      if (disabled) return { ok: false, message: incompatible }
      if (interruptedHolder(current)) return { ok: false, message: interrupted }
      if (current.phase === 'logout-unconfirmed' || current.epoch !== revision) {
        const message = current.phase === 'logout-unconfirmed' ? unconfirmedLogout :
          'La sessió ha canviat en una altra pestanya. Torna-ho a provar.'
        if (current.phase === 'active' && current.epoch !== revision) {
          epoch = current.epoch
          needsRestore = true
        }
        showJournal(current, message)
        return { ok: false, message }
      }
      const replacing = current.phase !== 'active'
      const marker = write('signing-in',
        replacing ? env.crypto.randomUUID() : current.epoch,
        replacing ? env.crypto.randomUUID() : current.generation)
      let result, candidate
      try {
        result = await post('login', marker, expectedIntent, credentials)
        if (result.ok && validUser(result.data?.user)) candidate = tokenSession(result)
      } catch {
        // A lost response can also leave a login cookie whose status is unknown.
      }
      if (!isCurrent(marker)) return { ok: false, message: interrupted }
      if (candidate) {
        write('active', env.crypto.randomUUID(), marker.generation)
        session = { ...candidate, user: result.data.user }
        const ok = showSession()
        return { ok, message: ok ? '' : unavailableProfile }
      }
      const known = Object.hasOwn(loginErrors, result?.code) && loginErrors[result.code]
      if (known && result.status === known[0]) {
        write(current.phase, marker.epoch, current.generation)
        if (current.phase === 'active') needsRestore = true
        showJournal(current, known[1])
        return { ok: false, message: known[1] }
      }
      write('interrupted', marker.epoch, marker.generation)
      showJournal({ phase: 'interrupted' })
      return { ok: false, message: interrupted }
    })).then((result) => {
      if (result !== WAIT_EXPIRED) return result
      if (!disabled) waitProblem('login', revision)
      return { ok: false, message: view.message }
    }).catch(() => {
      failClosed()
      return { ok: false, message: incompatible }
    }).finally(() => {
      changeFlight = undefined
      observe()
    })
    return changeFlight
  }

  function logout(targetEpoch = epoch) {
    if (changeFlight || disabled) return changeFlight
    const expectedIntent = ++intent
    forget()
    publish('checking', { busy: true })
    changeFlight = Promise.resolve().then(() => locked(async () => {
      if (disabled) return false
      const current = read()
      if (current.epoch !== targetEpoch || current.phase === 'signed-out') return noLogout(current)
      if (interruptedHolder(current) || ['interrupted', 'uncertain'].includes(current.phase)) {
        showJournal({ phase: 'interrupted' })
        return false
      }
      const revision = env.crypto.randomUUID()
      const marker = write('signing-out', revision, current.generation)
      let result
      try {
        result = await post('logout', marker, expectedIntent)
      } catch {
        // Preserve the journal and do not restore a possibly still active cookie.
      }
      if (!isCurrent(marker)) return false
      const confirmed = result?.ok === true
      const phase = confirmed ? 'signed-out' : result ? 'logout-unconfirmed' : 'interrupted'
      write(phase, revision, confirmed ? null : current.generation)
      showJournal({ phase })
      return confirmed
    })).then((result) => {
      if (result !== WAIT_EXPIRED) return result
      return disabled ? false : waitProblem('logout', targetEpoch)
    }).catch(() => {
      failClosed()
      return false
    }).finally(() => {
      changeFlight = undefined
      observe()
    })
    return changeFlight
  }

  function onStorage(event) {
    if (event.key === SIGNAL || event.key === null) observe()
  }

  function onVisible() {
    if (env.document.visibilityState !== 'visible') return
    for (const check of [...checks]) check()
    observe(true)
    onDue(true)
  }

  function start() {
    running = true
    if (!env.navigator.locks?.request || !env.crypto?.randomUUID || !env.performance?.now) {
      failClosed()
      return
    }
    env.addEventListener('storage', onStorage)
    env.addEventListener('focus', onVisible)
    env.addEventListener('pageshow', onVisible)
    env.document.addEventListener('visibilitychange', onVisible)
    observe()
    arm()
    return () => {
      running = false
      env.clearTimeout(timer)
      env.removeEventListener('storage', onStorage)
      env.removeEventListener('focus', onVisible)
      env.removeEventListener('pageshow', onVisible)
      env.document.removeEventListener('visibilitychange', onVisible)
    }
  }

  return {
    start, login, logout, refresh,
    getSnapshot: () => view,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
