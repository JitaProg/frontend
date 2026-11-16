import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  LogIn,
  Menu,
  Search,
  ShoppingBasket,
  Truck,
  UserPlus,
  X,
} from 'lucide-react'
import Logo from './Logo'

const navItems = [
  { label: 'Inici', href: '#inici' },
  { label: 'Productes', href: '#productes' },
  { label: 'La cooperativa', href: '#cooperativa' },
  { label: 'Contacte', href: '#contacte' },
]

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const scrollToProducts = (event) => {
    event.preventDefault()
    document.getElementById('productes')?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
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
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-forest-950/65 transition hover:bg-white/60 hover:text-forest-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <form onSubmit={scrollToProducts} className="relative hidden xl:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca productes..."
                aria-label="Cercar productes"
                className="h-11 w-52 rounded-full border border-forest-900/10 bg-white/50 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-forest-500 focus:bg-white focus:ring-4 focus:ring-forest-500/10"
              />
            </form>

            <button
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

            <button
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

        {menuOpen && (
          <div className="border-t border-forest-900/10 bg-cream px-4 py-5 lg:hidden">
            <form onSubmit={scrollToProducts} className="relative mb-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-900/35" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca productes..."
                aria-label="Cercar productes"
                className="h-11 w-full rounded-full border border-forest-900/10 bg-white/70 pl-10 pr-4 text-sm outline-none focus:border-forest-500"
              />
            </form>

            <nav className="flex flex-col" aria-label="Navegació mòbil">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-forest-950/75 transition hover:bg-white/70 hover:text-forest-950"
                >
                  {item.label}
                </a>
              ))}
            </nav>

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
          </div>
        )}
      </header>
    </>
  )
}
