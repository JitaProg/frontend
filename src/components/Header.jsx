import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  LogIn,
  LogOut,
  Menu,
  ShoppingBasket,
  Truck,
  UserPlus,
  X,
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../auth/AuthContext'

const navItems = [
  { label: 'Inici', to: '/#inici' },
  { label: 'Productes', to: '/catalog' },
  { label: 'La cooperativa', to: '/#cooperativa' },
  { label: 'Contacte', to: '/#contacte' },
]

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, status, busy, message, recovery, logout, retrySession, sessionEpoch } = useAuth()
  const showGuest = status === 'anonymous'
  const logoutTitleId = useId()
  const logoutDialog = useRef(null)
  const cancelLogoutButton = useRef(null)
  const logoutConfirmation = useRef(null)
  const logoutPending = useRef(false)
  const menuButton = useRef(null)
  const cartButton = useRef(null)

  const openLogoutDialog = (event, fromMobile = false) => {
    const dialog = logoutDialog.current
    if (dialog.open || logoutPending.current) return

    // Keep the epoch-bound callback even if another tab changes the session before React sees it.
    logoutConfirmation.current = { button: event.currentTarget, fromMobile, logout, epoch: sessionEpoch }
    dialog.showModal()
    cancelLogoutButton.current.focus()
  }

  const closeLogoutDialog = useCallback((confirmed = false) => {
    const confirmation = logoutConfirmation.current
    const closeMenu = confirmed && confirmation?.fromMobile
    logoutConfirmation.current = null
    logoutDialog.current.close()

    if (closeMenu) setMenuOpen(false)
    const preferred = closeMenu ? menuButton.current : confirmation?.button
    const target = [preferred, menuButton.current, cartButton.current]
      .find((element) => element?.getClientRects().length)
    target?.focus()
  }, [])

  useLayoutEffect(() => {
    const confirmation = logoutConfirmation.current
    if (confirmation && confirmation.epoch !== sessionEpoch) closeLogoutDialog()
  }, [closeLogoutDialog, sessionEpoch])

  const confirmLogout = async () => {
    const confirmation = logoutConfirmation.current
    if (!confirmation || !logoutDialog.current.open || logoutPending.current) return
    if (confirmation.epoch !== sessionEpoch) {
      closeLogoutDialog()
      return
    }

    logoutPending.current = true
    try {
      closeLogoutDialog(true)
      await confirmation.logout()
    } finally {
      logoutPending.current = false
    }
  }

  return (
    <>
      <div className="bg-forest-950 text-cream/75">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[10px] font-medium tracking-wide sm:text-xs">
          <Truck className="h-3.5 w-3.5 shrink-0 text-wheat" />
          <span>
            Lliurament gratuït a partir de 35 € · Les comandes abans de les 13 h surten avui mateix
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegació principal">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-forest-950/65 transition hover:bg-white/60 hover:text-forest-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              ref={cartButton}
              type="button"
              aria-label={`Cistella, ${cartCount} productes`}
              title="La cistella estarà disponible en la propera sessió"
              className="relative grid h-11 w-11 place-items-center rounded-full border border-forest-900/15 bg-white/40 text-forest-900 transition hover:bg-white"
            >
              <ShoppingBasket className="h-5 w-5" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[10px] font-bold text-cream">
                  {cartCount}
                </span>
              )}
            </button>

            {user && (
              <div className="hidden items-center gap-2 lg:flex">
                <span className="max-w-28 truncate text-sm font-semibold text-forest-950">{user.nom}</span>
                <button type="button" aria-haspopup="dialog" onClick={openLogoutDialog} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-forest-950 hover:bg-white/60">
                  <LogOut className="h-4 w-4" />
                  Tanca la sessió
                </button>
              </div>
            )}
            {showGuest && (
              <>
                <Link
                  to="/login"
                  className="hidden h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-forest-950 transition hover:bg-white/60 lg:inline-flex"
                >
                  <LogIn className="h-4 w-4" />
                  Inicia sessió
                </Link>

                <Link
                  to="/register"
                  className="hidden h-11 items-center gap-2 rounded-full bg-forest-800 px-4 text-sm font-semibold text-cream transition hover:bg-forest-700 sm:inline-flex"
                >
                  <UserPlus className="h-4 w-4" />
                  Fes-te soci
                </Link>
              </>
            )}

            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-forest-900/15 bg-white/40 text-forest-900 transition hover:bg-white lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {(message || busy) && (
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pb-3 text-sm text-forest-950 sm:px-6 lg:px-8">
            <span role={message ? 'alert' : 'status'}>{message || 'Processant la sessió…'}</span>
            {recovery && (
              <button type="button" className="auth-link" onClick={recovery === 'logout' ? logout : retrySession}>
                {recovery === 'logout' ? 'Tanca la sessió al servidor' : 'Torna a recuperar la sessió'}
              </button>
            )}
            {recovery === 'refresh' && (
              <button type="button" className="auth-link" onClick={logout}>Tanca la sessió</button>
            )}
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-forest-900/10 bg-cream px-4 py-5 lg:hidden">
            <nav className="flex flex-col" aria-label="Navegació mòbil">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setMenuOpen(false)
                    menuButton.current?.focus()
                  }}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-forest-950/75 transition hover:bg-white/70 hover:text-forest-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user && (
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-forest-900/10 pt-4">
                <span className="max-w-full break-all text-sm font-semibold text-forest-950">{user.nom}</span>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(event) => openLogoutDialog(event, true)}
                  className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-4 py-3 text-sm font-semibold text-forest-950"
                >
                  <LogOut className="h-4 w-4" />
                  Tanca la sessió
                </button>
              </div>
            )}
            {showGuest && (
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-forest-900/10 pt-4">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-forest-900/15 px-4 py-3 text-sm font-semibold text-forest-950"
                >
                  <LogIn className="h-4 w-4" />
                  Inicia sessió
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-3 text-sm font-semibold text-cream"
                >
                  Fes-te soci
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
      <dialog
        ref={logoutDialog}
        aria-labelledby={logoutTitleId}
        onCancel={(event) => {
          event.preventDefault()
          closeLogoutDialog()
        }}
        className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl border border-forest-900/15 bg-cream p-6 text-forest-950 shadow-xl backdrop:bg-forest-950/50"
      >
        <h2 id={logoutTitleId} className="text-lg font-semibold">
          Estàs segur que vols tancar la sessió?
        </h2>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelLogoutButton}
            type="button"
            onClick={() => closeLogoutDialog()}
            className="rounded-full border border-forest-900/15 px-4 py-3 text-sm font-semibold hover:bg-white/60"
          >
            Cancel·la
          </button>
          <button
            type="button"
            onClick={confirmLogout}
            className="rounded-full bg-forest-800 px-4 py-3 text-sm font-semibold text-cream hover:bg-forest-700"
          >
            Tanca la sessió
          </button>
        </div>
      </dialog>
    </>
  )
}
