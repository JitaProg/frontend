import { useState } from 'react'
import { Check, Heart, ShoppingBasket, Star } from 'lucide-react'
import { formatPrice } from '../data/products'

const tagStyles = {
  Temporada: 'bg-leaf-100 text-forest-800',
  Ecològic: 'bg-leaf-600 text-white',
  'Top vendes': 'bg-clay text-cream',
  Nou: 'bg-wheat text-forest-950',
}

export default function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAdd()
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest-900/10 bg-white/65 shadow-[0_14px_32px_-26px_rgba(31,58,38,0.5)] transition duration-300 hover:-translate-y-1 hover:border-forest-900/20 hover:shadow-card">
      <div className="relative overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
            tagStyles[product.tag] ?? 'bg-forest-800 text-cream'
          }`}
        >
          {product.tag}
        </span>
        <button
          type="button"
          onClick={() => setLiked((value) => !value)}
          aria-label={
            liked
              ? `Treure ${product.name} dels preferits`
              : `Afegir ${product.name} als preferits`
          }
          aria-pressed={liked}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-cream/85 shadow-sm backdrop-blur transition hover:bg-cream"
        >
          <Heart
            className={`h-4 w-4 transition ${
              liked ? 'fill-clay text-clay' : 'text-forest-900/70'
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-leaf-700">
            {product.categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink/60">
            <Star className="h-3.5 w-3.5 fill-wheat text-wheat" />
            {product.rating.toFixed(1).replace('.', ',')}
            <span className="text-ink/35">({product.reviews})</span>
          </span>
        </div>

        <h3 className="mt-2 font-display text-xl leading-snug text-forest-950">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/55">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="font-display text-2xl text-forest-950">
            {formatPrice(product.price)}
            <span className="ml-1 font-sans text-[11px] font-medium text-ink/45">
              / {product.unit}
            </span>
          </p>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Afegir ${product.name} a la cistella`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition duration-200 ${
              added
                ? 'bg-leaf-600 text-white'
                : 'bg-forest-800 text-cream hover:bg-forest-700'
            }`}
          >
            {added ? (
              <Check className="h-5 w-5" strokeWidth={2.4} />
            ) : (
              <ShoppingBasket className="h-5 w-5" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
