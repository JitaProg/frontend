import { Leaf } from 'lucide-react'
import Logo from './Logo'

export default function AuthSide({ badge, quote, author, role, stats }) {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-forest-900 px-12 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full border border-cream/10" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-cream/10" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-leaf-500/10 blur-3xl" />

      <div className="relative z-10">
        <Logo variant="light" />
      </div>

      <div className="relative z-10 max-w-lg py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-wheat">
          <Leaf className="h-3.5 w-3.5" />
          {badge}
        </span>

        <blockquote className="mt-7 font-display text-3xl leading-[1.22] text-cream xl:text-[2.6rem]">
          “{quote}”
        </blockquote>

        <div className="mt-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-wheat/30 bg-wheat/15 font-display text-lg text-wheat">
            {author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-cream">{author}</p>
            <p className="mt-0.5 text-xs text-cream/50">{role}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-5 border-t border-cream/15 pt-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-2xl text-cream">{stat.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <img
        src="/images/auth-landscape.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 w-full object-cover opacity-55"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-forest-900 via-forest-900/35 to-transparent" />
    </aside>
  )
}
