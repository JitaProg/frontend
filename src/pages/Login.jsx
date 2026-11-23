import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react'
import AuthSide from '../components/AuthSide'
import Logo from '../components/Logo'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, logout, retrySession, status, message, recovery } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const pending = useRef(false)

  const handleChange = (event) => {
    setError('')
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (pending.current || status === 'checking' || status === 'blocked') return
    pending.current = true
    setSubmitting(true)
    setError('')
    setShowPassword(false)
    setForm((current) => ({ ...current, password: '' }))
    try {
      const result = await login({ email: form.email.trim(), password: form.password })
      if (result.ok) navigate('/', { replace: true })
      else setError(result.message || 'No s’ha pogut iniciar sessió.')
    } finally {
      pending.current = false
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-2">
      <AuthSide
        badge="Socis de la terra"
        quote="Cada cistella explica una història de terra, esforç i temporada."
        author="Marta Ferrer"
        role="Pagesa de la Plana Alta · Sòcia des del 2018"
        stats={[
          { value: '120', label: 'Famílies sòcies' },
          { value: '38', label: 'Productes' },
          { value: '24-48 h', label: 'Lliurament' },
        ]}
      />

      <div className="flex min-h-screen flex-col px-5 py-7 sm:px-10 lg:px-16">
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

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Link
            to="/"
            className="mb-8 hidden w-fit items-center gap-2 text-xs font-semibold text-forest-900/55 transition hover:text-forest-900 lg:inline-flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Torna a la botiga
          </Link>

          {location.state?.registered && (
            <div className="mb-7 flex items-start gap-3 rounded-2xl border border-leaf-600/20 bg-leaf-100/70 p-4 text-sm text-forest-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
              <p>
                <span className="font-semibold">Compte creat correctament.</span> Ja pots
                iniciar sessió amb les teves dades.
              </p>
            </div>
          )}

          <span className="eyebrow">Hola de nou</span>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-forest-950 sm:text-[2.75rem]">
            Inicia sessió
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/55">
            Accedeix al teu compte per gestionar les comandes i la teva cistella setmanal
            de producte fresc.
          </p>

          {(message || error) && (
            <div className="mt-6 space-y-2 rounded-2xl bg-white/60 p-4 text-sm text-forest-950">
              {message && <p role="alert">{message}</p>}
              {error && error !== message && <p role="alert">{error}</p>}
              {recovery && (
                <button type="button" className="auth-link" onClick={recovery === 'logout' ? logout : retrySession}>
                  {recovery === 'logout' ? 'Tanca la sessió al servidor' : 'Torna a recuperar la sessió'}
                </button>
              )}
              {recovery === 'refresh' && (
                <button type="button" className="auth-link ml-3" onClick={logout}>Tanca la sessió</button>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-9 space-y-5" aria-busy={submitting}>
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
                  disabled={submitting}
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="elteu@correu.cat"
                  className="input pl-11"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="password" className="label !mb-0">
                  Contrasenya
                </label>
                <a
                  href="mailto:hola@agrobotiga.coop?subject=Recuperar%20contrasenya"
                  className="mb-2 text-[11px] font-semibold text-clay transition hover:underline"
                >
                  L'has oblidat?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={submitting}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="La teva contrasenya"
                  className="input pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? 'Amagar la contrasenya' : 'Mostrar la contrasenya'
                  }
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-forest-900/40 transition hover:bg-forest-900/5 hover:text-forest-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || status === 'checking' || status === 'blocked'}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Iniciant sessió…' : 'Entrar'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/55">
            Encara no tens compte?{' '}
            <Link to="/register" className="auth-link">
              Crea'n un en un minut
            </Link>
          </p>

        </div>

        <p className="text-center text-[11px] text-ink/35">
          © 2026 AgroBotiga · Castelló de la Plana
        </p>
      </div>
    </div>
  )
}
