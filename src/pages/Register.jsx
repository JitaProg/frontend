import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react'
import AuthSide from '../components/AuthSide'
import Logo from '../components/Logo'

const initialForm = {
  nom: '',
  cognoms: '',
  email: '',
  telefon: '',
  password: '',
  confirm: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [accept, setAccept] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const activeSubmission = useRef(null)

  useLayoutEffect(() => {
    return () => {
      const submission = activeSubmission.current
      activeSubmission.current = null
      // Cancel·la l'espera del client, no desfà un registre que el servidor ja hagi rebut.
      submission?.abort()
    }
  }, [])

  const handleChange = (event) => {
    setError('')
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (activeSubmission.current) return

    if (form.password.length < 8) {
      setError('La contrasenya ha de tenir com a mínim 8 caràcters.')
      return
    }

    if (form.password !== form.confirm) {
      setError('Les contrasenyes no coincideixen. Torna-ho a provar.')
      return
    }

    const { nom, cognoms, email, password } = form
    const telefon = form.telefon.replace(/\s/g, '')
    if (telefon && !/^[0-9]{9}$/.test(telefon)) {
      setError('El telèfon ha de tenir 9 dígits. Si no el vols indicar, deixa el camp buit.')
      return
    }
    const payload = { nom, cognoms, email, password, ...(telefon && { telefon }) }

    const submission = new AbortController()
    activeSubmission.current = submission
    const { signal } = submission
    setIsSubmitting(true)
    setError('')

    let registered = false
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'manual',
        signal,
      })
      if (signal.aborted) return

      if (response.status === 409) {
        setError('Ja hi ha un compte amb aquest correu electrònic. Pots iniciar sessió.')
      } else if (response.status === 422) {
        setError('Revisa el nom, els cognoms, el correu i la contrasenya. Si indiques un telèfon, ha de tenir 9 dígits.')
      } else if (response.status === 201) {
        const result = await response.json().catch(() => null)
        if (signal.aborted) return
        const id = result?.data?._id
        registered = result?.success === true && typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)
      }

      if (!registered && response.status !== 409 && response.status !== 422) {
        setError('No hem pogut confirmar el registre. Si el compte no s’ha creat, torna-ho a provar.')
      }
    } catch {
      if (!signal.aborted) {
        setError('No s’ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.')
      }
    } finally {
      if (!signal.aborted && !registered) {
        activeSubmission.current = null
        setIsSubmitting(false)
      }
    }

    if (registered) navigate('/login', { state: { registered: true } })
  }

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-2">
      <div className="order-2 flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:order-1 lg:px-16">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-900/60 transition hover:text-forest-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Inici
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
          <Link
            to="/"
            className="mb-8 hidden w-fit items-center gap-2 text-xs font-semibold text-forest-900/55 transition hover:text-forest-900 lg:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Torna a la botiga
          </Link>

          <span className="eyebrow">Fes-te soci</span>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-forest-950 sm:text-[2.75rem]">
            Crea el teu compte
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/55">
            Uneix-te a les més de 2.400 famílies que ja compren directament del camp, amb
            producte fresc i preu just.
          </p>

          <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nom" className="label">
                  Nom
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="El teu nom"
                    className="input pl-11"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cognoms" className="label">
                  Cognoms
                </label>
                <input
                  id="cognoms"
                  name="cognoms"
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.cognoms}
                  onChange={handleChange}
                  placeholder="Els teus cognoms"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Correu electrònic
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="elteu@correu.cat"
                  className="input pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="telefon" className="label">
                Telèfon <span className="normal-case tracking-normal text-forest-900/35">(opcional)</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  autoComplete="tel"
                  value={form.telefon}
                  onChange={handleChange}
                  placeholder="600 00 00 00"
                  className="input pl-11"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="label">
                  Contrasenya
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínim 8 caràcters"
                    className="input pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? 'Amagar la contrasenya' : 'Mostrar la contrasenya'
                    }
                    className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-forest-900/40 transition hover:bg-forest-900/5 hover:text-forest-900"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="label">
                  Repeteix la contrasenya
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                  <input
                    id="confirm"
                    name="confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Torna-la a escriure"
                    className="input pl-11"
                  />
                </div>
              </div>
            </div>

            <p className="flex items-center gap-2 text-[11px] text-ink/40">
              <Check className="h-3.5 w-3.5 text-leaf-600" />
              Mínim 8 caràcters. Fes servir lletres, números i símbols.
            </p>

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-clay/20 bg-clay/5 px-4 py-3 text-sm text-clay"
              >
                {error}
              </p>
            )}

            <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/55">
              <input
                type="checkbox"
                required
                checked={accept}
                onChange={(event) => setAccept(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest-900/25 accent-forest-800"
              />
              <span>
                Accepto les{' '}
                <a href="/#contacte" className="font-semibold text-forest-900 underline-offset-4 hover:underline">
                  condicions d'ús
                </a>{' '}
                i la{' '}
                <a href="/#contacte" className="font-semibold text-forest-900 underline-offset-4 hover:underline">
                  política de privacitat
                </a>{' '}
                d'AgroBotiga.
              </span>
            </label>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Creant el compte…' : 'Crear el meu compte'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            Ja ets soci?{' '}
            <Link to="/login" className="auth-link">
              Inicia sessió
            </Link>
          </p>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-ink/35">
            Quan es confirmi el registre, et portarem a la pàgina d'inici de sessió.
          </p>
        </div>

        <p className="text-center text-[11px] text-ink/35">
          © 2026 AgroBotiga · Castelló de la Plana
        </p>
      </div>

      <div className="order-1 lg:order-2">
        <AuthSide
          badge="Producte de proximitat"
          quote="Comprar de proximitat és la manera més directa de cuidar el nostre territori."
          author="Pau Beltrán"
          role="Productor d'oli · El Maestrat"
          stats={[
            { value: '2.400', label: 'Clients' },
            { value: '4,9/5', label: 'Valoració' },
            { value: '82 %', label: 'Per al productor' },
          ]}
        />
      </div>
    </div>
  )
}
