import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const columns = [
  {
    title: 'Botiga',
    links: [
      { label: 'Tots els productes', to: '/catalog' },
      { label: 'Cistella setmanal', to: '/#contacte' },
    ],
  },
  {
    title: 'Cooperativa',
    links: [
      { label: 'La nostra història', to: '/#cooperativa' },
      { label: 'Els productors', to: '/#cooperativa' },
      { label: 'Sostenibilitat', to: '/#cooperativa' },
      { label: 'Treballa amb nosaltres', to: '/#contacte' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest-950 text-cream/65">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/55">
              Una cooperativa agrícola de la Comunitat Valenciana que porta el producte de
              proximitat directament a la teva taula, amb un preu just per a qui el cultiva.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Link
                to="/#contacte"
                aria-label="Instagram d'AgroBotiga"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-cream/35 hover:text-cream"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                to="/#contacte"
                aria-label="Facebook d'AgroBotiga"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-cream/35 hover:text-cream"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <a
                href="mailto:hola@agrobotiga.coop"
                aria-label="Enviar un correu a AgroBotiga"
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition hover:border-cream/35 hover:text-cream"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/40">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/40">
              Contacte
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-wheat" />
                <span>
                  Camí de la Mar, s/n
                  <br />
                  12004 Castelló de la Plana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-wheat" />
                <a href="tel:+34964123456" className="transition hover:text-cream">
                  964 12 34 56
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-wheat" />
                <a href="mailto:hola@agrobotiga.coop" className="transition hover:text-cream">
                  hola@agrobotiga.coop
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <Link to="/login" className="transition hover:text-cream">
                Inicia sessió
              </Link>
              <Link to="/register" className="transition hover:text-cream">
                Fes-te soci de la cooperativa
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/10 pt-7 text-xs text-cream/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AgroBotiga Cooperativa V. · Tots els drets reservats.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/#contacte" className="transition hover:text-cream/70">
              Avís legal
            </Link>
            <Link to="/#contacte" className="transition hover:text-cream/70">
              Privacitat
            </Link>
            <Link to="/#contacte" className="transition hover:text-cream/70">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
