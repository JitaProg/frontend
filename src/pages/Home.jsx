import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Clock3,
  Leaf,
  Mail,
  Quote,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Star,
  Truck,
  Users,
} from 'lucide-react'

const stats = [
  { value: '120', label: 'Famílies sòcies' },
  { value: '38', label: 'Productes de temporada' },
  { value: '6', label: 'Comarques' },
  { value: '0', label: 'Intermediaris' },
]

const coopFeatures = [
  {
    icon: ShieldCheck,
    title: 'Preu just per al productor',
    text: "El 82 % del que pagues arriba directament a qui cultiva el producte.",
  },
  {
    icon: Sprout,
    title: 'Cultiu de temporada i proximitat',
    text: 'Només venem el que toca collir, a menys de 100 km de casa teva.',
  },
  {
    icon: Leaf,
    title: 'Envasos retornables i km 0',
    text: 'Reduïm plàstics i emissions amb una logística compartida entre socis.',
  },
]

export default function Home() {
  const { hash, key } = useLocation()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!hash) return
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(hash.slice(1))
      section?.focus({ preventScroll: true })
      section?.scrollIntoView()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hash, key])

  const handleSubscribe = (event) => {
    event.preventDefault()

    if (newsletterEmail.trim()) {
      setSubscribed(true)
      setNewsletterEmail('')
    }
  }

  return (
    <>
      {/* Hero */}
      <section id="inici" tabIndex={-1} className="relative scroll-mt-24 overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-leaf-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-48 h-80 w-80 rounded-full bg-wheat/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white/60 px-4 py-2 text-[11px] font-semibold text-forest-900/75 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-600" />
              </span>
              Collita de proximitat · Temporada 2026
            </span>

            <h1 className="mt-6 text-balance font-display text-[2.9rem] leading-[1.02] tracking-tight text-forest-950 sm:text-6xl xl:text-[4.6rem]">
              Del camp a taula,{' '}
              <span className="italic text-clay">sense intermediaris.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
              Som una cooperativa de 120 famílies productores de la Comunitat Valenciana.
              Cultivem amb cura i t'ho fem arribar fresc, amb un preu just per a tothom.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/catalog" className="btn-primary">
                Explora la botiga
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#cooperativa" className="btn-secondary">
                Coneix la cooperativa
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {[
                    { initials: 'MR', color: 'bg-leaf-300 text-forest-900' },
                    { initials: 'JB', color: 'bg-wheat/70 text-forest-950' },
                    { initials: 'AC', color: 'bg-clay/80 text-cream' },
                  ].map((avatar) => (
                    <span
                      key={avatar.initials}
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 border-cream text-[10px] font-bold ${avatar.color}`}
                    >
                      {avatar.initials}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-wheat">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">4,9/5 · 2.400 valoracions</p>
                </div>
              </div>

              <div className="hidden h-10 w-px bg-forest-900/10 sm:block" />

              <div>
                <p className="font-display text-xl text-forest-950">24-48 h</p>
                <p className="text-xs text-ink/50">Lliurament a domicili</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-leaf-200/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-forest-900/10 bg-sand shadow-soft">
              <img
                src="/images/hero-farm.svg"
                alt="Il·lustració d'un camp de conreu amb horts, sol i una masia al fons"
                className="h-[320px] w-full object-cover sm:h-[430px] lg:h-[540px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/25 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-3 top-8 hidden items-center gap-3 rounded-2xl border border-forest-900/10 bg-cream/95 p-3.5 pr-5 shadow-card backdrop-blur sm:flex">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                <Leaf className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest-900/45">
                  Garantia
                </p>
                <p className="text-sm font-semibold text-forest-950">100 % de proximitat</p>
              </div>
            </div>

            <div className="absolute -bottom-5 right-3 max-w-[15rem] rounded-2xl border border-forest-900/10 bg-forest-900 p-4 text-cream shadow-soft sm:right-5">
              <div className="flex items-center gap-2 text-wheat">
                <ShoppingBasket className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                  Cistella setmanal
                </span>
              </div>
              <p className="mt-2 text-sm leading-snug text-cream/75">
                Producte fresc de temporada per a tota la setmana.
              </p>
              <p className="mt-2 font-display text-2xl">
                24,90 €
                <span className="ml-1 font-sans text-[10px] font-medium text-cream/45">
                  / setmana
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-forest-900/10 bg-forest-900/10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-cream px-5 py-6 text-center">
              <p className="font-display text-3xl text-forest-950">{stat.value}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-forest-900/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keep the old fragment as a landing point for saved links. */}
      <section id="productes" tabIndex={-1} className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-forest-900/10 bg-white/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <span className="eyebrow">La botiga</span>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-forest-950 sm:text-4xl">
              Productes de la cooperativa
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              Descobreix els productes de temporada, cerca pel nom o explora per categoria.
            </p>
          </div>
          <Link to="/catalog" className="btn-primary w-fit shrink-0">
            Ves al catàleg
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest-900/10 bg-white/40 px-5 py-4 text-sm text-ink/55">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-wheat" />
            Descobreix la selecció de la cooperativa.
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-forest-900">
            <Clock3 className="h-4 w-4" />
            Comandes abans de les 13 h surten avui mateix
          </span>
        </div>
      </section>

      {/* Cooperative */}
      <section id="cooperativa" tabIndex={-1} className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-900 px-6 py-12 text-cream sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-cream/10" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-leaf-500/10 blur-2xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="eyebrow-light">La nostra manera de fer</span>
              <h2 className="mt-4 text-balance font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Menys intermediaris.
                <br />
                <span className="italic text-wheat">Més vida al camp.</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-cream/60 sm:text-base">
                Des del 1994 treballem en cooperativa perquè el producte local tingui el
                valor que mereix. Sense presses, respectant el calendari de la terra i
                repartint el benefici entre totes les famílies sòcies.
              </p>

              <ul className="mt-8 space-y-5">
                {coopFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.title} className="flex gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cream/15 bg-cream/5 text-wheat">
                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-cream">{feature.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-cream/50">
                          {feature.text}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <a
                href="#contacte"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-forest-950 transition hover:bg-white"
              >
                Descobreix la cooperativa
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] border border-cream/15 bg-forest-800">
                <img
                  src="/images/farmer.svg"
                  alt="Il·lustració d'una pagesa sostenint una caixa de verdures acabades de collir"
                  className="h-[330px] w-full object-cover sm:h-[420px]"
                />
              </div>

              <div className="mt-4 rounded-2xl bg-cream p-5 text-forest-950 shadow-soft lg:absolute lg:-bottom-6 lg:-left-6 lg:mt-0 lg:max-w-[17rem]">
                <Quote className="h-6 w-6 text-clay/60" />
                <p className="mt-2 font-display text-lg leading-snug">
                  “Cada cistella és una manera de cuidar el territori.”
                </p>
                <div className="mt-4 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-100 text-xs font-bold text-forest-800">
                    MF
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Marta Ferrer</p>
                    <p className="text-[10px] text-ink/45">Pagesa i sòcia fundadora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / contact */}
      <section id="contacte" tabIndex={-1} className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-forest-900/10 bg-sand px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-leaf-200/50 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-wheat/10 blur-2xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white/50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-forest-900/60">
                <Mail className="h-3.5 w-3.5" />
                La carta de la cooperativa
              </span>
              <h2 className="mt-5 text-balance font-display text-3xl leading-tight tracking-tight text-forest-950 sm:text-4xl">
                Rep el que hi ha de temporada, cada setmana.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/55">
                T'enviem un correu amb la collita disponible, receptes de temporada i les
                novetats dels nostres productors. Res més.
              </p>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink/50">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-leaf-600" />
                  Un correu a la setmana
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-leaf-600" />
                  Sense spam
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-leaf-600" />
                  Baixa quan vulguis
                </span>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-forest-900/10 bg-cream/80 p-6 shadow-sm backdrop-blur sm:p-7">
              {subscribed ? (
                <div className="flex flex-col items-start gap-3 py-2">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-leaf-100 text-leaf-700">
                    <Check className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  <h3 className="font-display text-2xl text-forest-950">
                    Ja formes part de la collita!
                  </h3>
                  <p className="text-sm leading-relaxed text-ink/55">
                    Rebràs el proper correu amb el producte de temporada. Gràcies per
                    donar suport al camp local.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubscribed(false)}
                    className="mt-1 text-xs font-semibold text-forest-900 underline-offset-4 hover:underline"
                  >
                    Subscriure un altre correu
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <label htmlFor="newsletter-email" className="label">
                    El teu correu electrònic
                  </label>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(event) => setNewsletterEmail(event.target.value)}
                      placeholder="elteu@correu.cat"
                      className="input flex-1"
                    />
                    <button type="submit" className="btn-primary shrink-0 !px-5">
                      Subscriu-me
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-ink/40">
                    <Users className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Ja som més de 2.400 famílies les que comprem directament del camp.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery strip */}
      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-forest-900/10 bg-white/40 px-6 py-5 text-center text-sm text-ink/55 sm:flex-row sm:gap-10">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-leaf-600" />
            Lliurament en 24-48 h
          </span>
          <span className="hidden h-4 w-px bg-forest-900/10 sm:block" />
          <span className="inline-flex items-center gap-2">
            <Leaf className="h-4 w-4 text-leaf-600" />
            Envasos retornables
          </span>
          <span className="hidden h-4 w-px bg-forest-900/10 sm:block" />
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-leaf-600" />
            Pagament segur
          </span>
        </div>
      </div>
    </>
  )
}
