import { useEffect, useRef, useState } from 'react'
import { Check, Heart, ImageOff, ShoppingBasket, Star } from 'lucide-react'
import { formatPrice } from '../data/products'

const tagStyles = {
  Temporada: 'bg-leaf-100 text-forest-800',
  Ecològic: 'bg-leaf-600 text-white',
  'Top vendes': 'bg-clay text-cream',
  Nou: 'bg-wheat text-forest-950',
}

function ProductImage({ src, name }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`Imatge no disponible: ${name}`}
        className="grid h-52 w-full place-items-center bg-sand text-forest-900/45"
      >
        <ImageOff aria-hidden="true" className="h-10 w-10" strokeWidth={1.4} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
    />
  )
}

export default function ProductCard({ product, onAdd }) {
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const addTimeout = useRef()
  const hasPrice = Number.isFinite(product.price) && product.price > 0
  const outOfStock = product.stock === 0
  const hasRating = Number.isFinite(product.rating) && product.rating >= 0 && product.rating <= 5
  const hasReviews = Number.isSafeInteger(product.reviews) && product.reviews >= 0
  const canAdd = hasPrice && !outOfStock && typeof onAdd === 'function'

  useEffect(() => () => window.clearTimeout(addTimeout.current), [])

  const handleAdd = () => {
    if (!canAdd) return
    onAdd()
    setAdded(true)
    window.clearTimeout(addTimeout.current)
    addTimeout.current = window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest-900/10 bg-white/65 shadow-[0_14px_32px_-26px_rgba(31,58,38,0.5)] transition duration-300 hover:-translate-y-1 hover:border-forest-900/20 hover:shadow-card">
      <div className="relative overflow-hidden bg-sand">
        <ProductImage key={product.image} src={product.image} name={product.name} />
        {product.tag && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              tagStyles[product.tag] ?? 'bg-forest-800 text-cream'
            }`}
          >
            {product.tag}
          </span>
        )}
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
        {(product.categoryLabel || hasRating) && (
          <div className="flex items-center justify-between gap-2">
            {product.categoryLabel && (
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-leaf-700">
                {product.categoryLabel}
              </span>
            )}
            {hasRating && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-ink/60">
                <Star aria-hidden="true" className="h-3.5 w-3.5 fill-wheat text-wheat" />
                {product.rating.toFixed(1).replace('.', ',')}
                {hasReviews && <span className="text-ink/35">({product.reviews})</span>}
              </span>
            )}
          </div>
        )}

        <h3 className="mt-2 font-display text-xl leading-snug text-forest-950">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/55">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="font-display text-2xl text-forest-950">
              {hasPrice ? formatPrice(product.price) : 'Preu no disponible'}
              {hasPrice && product.unit && (
                <span className="ml-1 font-sans text-[11px] font-medium text-ink/45">
                  / {product.unit}
                </span>
              )}
            </p>
            {outOfStock && <p className="text-xs text-ink/65">Sense estoc</p>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            aria-label={`Afegir ${product.name} a la cistella`}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${
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
