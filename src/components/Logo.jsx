import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Logo({ variant = 'dark', className = '' }) {
  const light = variant === 'light'

  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-3 ${className}`}
      aria-label="AgroBotiga, anar a l'inici"
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl shadow-sm transition duration-300 group-hover:-rotate-6 ${
          light ? 'bg-cream text-forest-800' : 'bg-forest-800 text-cream'
        }`}
      >
        <Sprout className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-[1.35rem] font-semibold tracking-tight ${
            light ? 'text-cream' : 'text-forest-950'
          }`}
        >
          AgroBotiga
        </span>
        <span
          className={`mt-1.5 block text-[9px] font-bold uppercase tracking-[0.27em] ${
            light ? 'text-cream/55' : 'text-forest-800/55'
          }`}
        >
          Cooperativa agrícola
        </span>
      </span>
    </Link>
  )
}
