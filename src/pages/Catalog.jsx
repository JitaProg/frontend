import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useOutletContext, useSearchParams } from 'react-router-dom'
import { LayoutGrid, Leaf, Tag } from 'lucide-react'
import ProductCard from '../components/ProductCard'

const productLimit = 12
const categoryLimit = 50
const maxCategoryPages = 100
const maxNameLength = 100
const searchDelay = 300
const minProductLoadingTime = 600
const maxProductPage = Math.floor(Number.MAX_SAFE_INTEGER / productLimit)
const productUnits = new Set(['kg', 'l', 'unitat'])
const loading = { status: 'loading' }
const allCategory = { id: '', label: 'Tots' }
const text = (value) => (typeof value === 'string' ? value.trim() : '')
const searchTerm = (value) => text(value.slice(0, maxNameLength).replace(/\0/g, ''))
const isObjectId = (value) =>
  typeof value === 'string' && value.length === 24 && /^[0-9a-f]+$/.test(value)

function toCardProduct(dto) {
  const id = dto?._id
  const name = text(dto?.nom)
  if (
    !isObjectId(id) ||
    !name ||
    !Number.isFinite(dto.preu) ||
    dto.preu <= 0 ||
    !productUnits.has(dto.unitat) ||
    !Number.isFinite(dto.stock) ||
    dto.stock < 0
  ) {
    return null
  }

  return {
    id,
    name,
    description: text(dto.descripcio),
    price: dto.preu,
    unit: dto.unitat,
    stock: dto.stock,
    categoryLabel: text(dto.categoria_id?.name),
    image: `/images/products/${id}.webp`,
  }
}

async function getJson(url, signal) {
  const response = await fetch(url, { method: 'GET', credentials: 'omit', signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

function readPagination(payload, page, limit) {
  const pagination = payload?.pagination
  if (
    !Array.isArray(payload?.data) ||
    payload.data.length > limit ||
    pagination?.page !== page ||
    pagination.limit !== limit ||
    !Number.isSafeInteger(pagination.total) ||
    pagination.total < 0 ||
    pagination.totalPages !== Math.ceil(pagination.total / limit)
  ) {
    throw new Error('Resposta paginada no vàlida')
  }
  return pagination
}

async function loadProducts({ url, page }, signal) {
  const payload = await getJson(url, signal)
  if (payload?.status !== 'success') throw new Error('Resposta de productes no vàlida')
  const result = payload.data
  const { total, totalPages } = readPagination(result, page, productLimit)
  const lastPage = Math.max(1, totalPages)
  if (page > lastPage) return { lastPage }

  const productsById = new Map()
  if (total > 0) {
    for (const dto of result.data) {
      const product = toCardProduct(dto)
      if (product && !productsById.has(product.id)) productsById.set(product.id, product)
    }
    if (!productsById.size) throw new Error('Dades de productes no vàlides')
  }

  return {
    products: [...productsById.values()],
    total,
    lastPage,
    incomplete: total > 0 && productsById.size < result.data.length,
  }
}

async function loadCategories(_request, signal) {
  const categories = new Map()
  let expectedTotal = 0
  let expectedPages = 1
  for (let page = 1; page <= Math.max(1, expectedPages); page += 1) {
    signal.throwIfAborted()
    const params = new URLSearchParams({ active: 'true', sort: '_id', limit: categoryLimit, page })
    const payload = await getJson(`/api/categories?${params}`, signal)
    if (payload?.success !== true) throw new Error('Resposta de categories no vàlida')
    const { total, totalPages } = readPagination(payload, page, categoryLimit)
    if (page === 1) {
      // Fixem les metadades del recorregut, no una instantània de les dades.
      expectedTotal = total
      expectedPages = totalPages
    }
    if (
      expectedPages > maxCategoryPages ||
      total !== expectedTotal ||
      totalPages !== expectedPages ||
      payload.data.length !== Math.min(categoryLimit, Math.max(0, expectedTotal - (page - 1) * categoryLimit))
    ) {
      throw new Error('No s’han pogut completar les categories')
    }
    for (const dto of payload.data) {
      const id = dto?._id
      const label = text(dto?.name)
      if (!isObjectId(id) || !label || categories.has(id)) {
        throw new Error('Dades de categories no vàlides')
      }
      categories.set(id, { id, label })
    }
  }
  if (categories.size !== expectedTotal) throw new Error('La llista de categories ha canviat')
  return [...categories.values()].sort((a, b) => a.label.localeCompare(b.label, 'ca'))
}

function useCatalogRequest(request, load) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    const timeout = window.setTimeout(() => {
      controller.abort()
      setResult({ request, status: 'error' })
    }, 15_000)

    load(request, signal).then(
      (data) => {
        if (!signal.aborted) setResult({ request, status: 'success', data })
      },
      () => {
        if (!signal.aborted) setResult({ request, status: 'error' })
      },
    ).finally(() => window.clearTimeout(timeout))

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [request, load])

  return result?.request === request ? result : loading
}

function useProductLoadingWindow(request, status) {
  const [elapsedFor, setElapsedFor] = useState(null)
  const failed = status === 'error'

  useLayoutEffect(() => {
    if (failed) return
    // Start when the indicator is committed, independently of the fetch.
    const timeout = window.setTimeout(() => setElapsedFor(request), minProductLoadingTime)
    return () => window.clearTimeout(timeout)
  }, [request, failed])

  return status === 'loading' || (status === 'success' && elapsedFor !== request)
}

function readFilters(params) {
  const inputPage = params.get('page') ?? ''
  const inputCategory = params.get('categoryId')
  const inputName = params.get('name') ?? ''
  return {
    page: /^[0-9]+$/.test(inputPage) ? Math.max(1, Math.min(Number(inputPage), maxProductPage)) : 1,
    name: searchTerm(inputName),
    categoryId: isObjectId(inputCategory) ? inputCategory : '',
  }
}

function queryWithFilters(params, { page, name, categoryId }) {
  const query = new URLSearchParams(params)
  query.delete('page')
  query.delete('name')
  query.delete('categoryId')
  if (page > 1) query.set('page', page)
  if (name) query.set('name', name)
  if (categoryId) query.set('categoryId', categoryId)
  return query
}

function paginationItems(page, lastPage) {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, index) => index + 1)
  if (page <= 4) return [1, 2, 3, 4, 5, 'end-gap', lastPage]
  if (page >= lastPage - 3) {
    return [1, 'start-gap', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage]
  }
  return [1, 'start-gap', page - 1, page, page + 1, 'end-gap', lastPage]
}

function useCatalogSearch(locationKey, params, setParams, name) {
  const [draft, setDraft] = useState(name)
  const route = useRef(null)
  const timer = useRef(null)
  const ownReplacement = useRef(null)

  const cancelTimer = useCallback(() => {
    window.clearTimeout(timer.current)
    timer.current = null
  }, [])

  useLayoutEffect(() => {
    route.current = { params, setParams }
    const preserveDraft = ownReplacement.current === params.toString()
    ownReplacement.current = null
    if (!preserveDraft) {
      cancelTimer()
      setDraft(name)
    }
  }, [locationKey, params, setParams, name, cancelTimer])

  const cancelSearch = useCallback(() => {
    cancelTimer()
    ownReplacement.current = null
  }, [cancelTimer])

  useLayoutEffect(() => {
    // Cancel at popstate, even if React has not committed the restored location yet.
    window.addEventListener('popstate', cancelSearch)
    return () => {
      window.removeEventListener('popstate', cancelSearch)
      cancelSearch()
    }
  }, [cancelSearch])

  const replacePreservingDraft = useCallback((next) => {
    const target = next.toString()
    if (target === (ownReplacement.current ?? route.current.params.toString())) return
    ownReplacement.current = target
    route.current.setParams(next, { replace: true })
  }, [])

  const apply = (term, forceFirstPage) => {
    // Search navigations only change name/page. Other navigations cancel the timer.
    const current = route.current.params
    const base = ownReplacement.current === null ? current : new URLSearchParams(ownReplacement.current)
    const filters = readFilters(base)
    if (!forceFirstPage && term === filters.name) return
    replacePreservingDraft(queryWithFilters(base, { ...filters, name: term, page: 1 }))
  }

  const changeDraft = (value) => {
    cancelTimer()
    setDraft(value)
    const term = searchTerm(value)
    if (!term) {
      apply('', true)
    } else {
      timer.current = window.setTimeout(() => {
        timer.current = null
        apply(term, false)
      }, searchDelay)
    }
  }

  const submit = (event) => {
    event.preventDefault()
    cancelTimer()
    apply(searchTerm(draft), true)
  }

  return { draft, changeDraft, submit, cancelSearch, replacePreservingDraft, ownReplacement }
}

function Retry({ message, onRetry }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink/75">
      <p role="alert">{message}</p>
      <button type="button" className="btn-secondary" onClick={onRetry}>
        Torna-ho a provar
      </button>
    </div>
  )
}

function CatalogPagination({ page, lastPage, pending, onPage }) {
  return (
    <nav aria-label="Paginació del catàleg" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button type="button" className="btn-secondary disabled:opacity-50" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Anterior
      </button>
      {paginationItems(page, lastPage).map((item) =>
        typeof item !== 'number' ? (
          <span key={item} aria-hidden="true" className="px-1 text-forest-900/70">…</span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Pàgina ${item}`}
            aria-current={!pending && item === page ? 'page' : undefined}
            onClick={() => onPage(item)}
            className={`min-h-10 min-w-10 rounded-full border px-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 ${
              item === page
                ? 'border-forest-800 bg-forest-800 text-cream'
                : 'border-forest-900/15 bg-white/50 text-forest-950 hover:bg-white'
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" className="btn-secondary disabled:opacity-50" disabled={page >= lastPage} onClick={() => onPage(page + 1)}>
        Següent
      </button>
    </nav>
  )
}

export default function Catalog() {
  const { addToCart } = useOutletContext()
  const { key: locationKey } = useLocation()
  const [params, setParams] = useSearchParams()
  const { page, name, categoryId } = readFilters(params)
  const { draft, changeDraft, submit, cancelSearch, replacePreservingDraft, ownReplacement } =
    useCatalogSearch(locationKey, params, setParams, name)
  const [productAttempt, setProductAttempt] = useState(0)
  const [categoryAttempt, setCategoryAttempt] = useState(0)
  const [previousResults, setPreviousResults] = useState(null)
  const title = useRef(null)
  const categoriesTitle = useRef(null)
  const resultsTitle = useRef(null)
  const resultsContent = useRef(null)

  const productRequest = useMemo(() => {
    const query = new URLSearchParams({ page, limit: productLimit })
    if (name) query.set('name', name)
    if (categoryId) query.set('categoryId', categoryId)
    return { url: `/api/products?${query}`, page, attempt: productAttempt }
  }, [page, name, categoryId, productAttempt])
  const productState = useCatalogRequest(productRequest, loadProducts)
  const showProductLoading = useProductLoadingWindow(productRequest, productState.status)
  const categoryState = useCatalogRequest(categoryAttempt, loadCategories)
  const result = productState.data
  const lastPage = result?.lastPage
  const filters = [allCategory, ...(categoryState.data ?? [])]
  const pending = showProductLoading || (lastPage !== undefined && page > lastPage)
  const displayedResult = pending ? previousResults?.result : result
  const displayedPage = pending ? previousResults?.page : page
  const loadingMessage = previousResults
    ? 'S’estan actualitzant els productes…'
    : 'S’estan carregant els productes…'

  useLayoutEffect(() => {
    if (pending) {
      if (resultsContent.current?.contains(document.activeElement)) {
        resultsTitle.current?.focus({ preventScroll: true })
      }
    } else {
      // Keep only a settled, visible grid; never resurrect it after an error or empty result.
      setPreviousResults(result?.products?.length ? { result, page } : null)
    }
  }, [pending, result, page])

  useEffect(() => {
    title.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (lastPage === undefined || page <= lastPage || ownReplacement.current !== null) return
    replacePreservingDraft(queryWithFilters(params, { page: lastPage, name, categoryId }))
  }, [lastPage, page, name, categoryId, params, replacePreservingDraft, ownReplacement])

  const update = (changes) => {
    const next = queryWithFilters(params, { page, name, categoryId, ...changes })
    if (next.toString() !== params.toString()) {
      cancelSearch()
      setParams(next)
    }
  }

  const movePage = (nextPage) => {
    if (nextPage === page) return
    resultsTitle.current?.focus()
    update({ page: nextPage })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <span className="eyebrow">La botiga</span>
      <h1 ref={title} tabIndex={-1} className="mt-3 font-display text-4xl tracking-tight text-forest-950 focus:outline-none sm:text-5xl">
        Catàleg de productes
      </h1>
      <p className="mt-3 text-ink/65">Descobreix els productes de temporada de la cooperativa.</p>

      <form role="search" className="mt-7" onSubmit={submit}>
        <label htmlFor="catalog-name" className="block text-sm font-semibold text-forest-950">
          Nom del producte
        </label>
        <input
          id="catalog-name"
          type="search"
          enterKeyHint="search"
          maxLength={maxNameLength}
          value={draft}
          onChange={(event) => changeDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) submit(event)
          }}
          className="mt-2 block w-full rounded-full border border-forest-900/15 bg-white/70 px-4 py-3 text-sm focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-500 sm:max-w-sm"
        />
      </form>

      <section aria-labelledby="catalog-categories" className="mt-8">
        <h2 id="catalog-categories" ref={categoriesTitle} tabIndex={-1} className="scroll-mt-24 text-sm font-semibold text-forest-950">
          Categories
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {filters.map(({ id, label }) => {
            const Icon = id ? Tag : LayoutGrid
            const selected = categoryId === id
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (!selected) update({ categoryId: id, page: 1 })
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 ${
                  selected
                    ? 'border-forest-800 bg-forest-800 text-cream shadow-sm'
                    : 'border-forest-900/10 bg-white/50 text-forest-900/75 hover:border-forest-900/25 hover:bg-white'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                {label}
              </button>
            )
          })}
        </div>
        <div role="status" className="mt-3 text-sm text-ink/65">
          {categoryState.status === 'loading' && 'S’estan carregant les categories…'}
          {categoryState.status === 'success' && !categoryState.data.length && 'No hi ha categories actives.'}
          {categoryId && !filters.some(({ id }) => id === categoryId) && (
            <p>Hi ha una categoria seleccionada a l’enllaç. Tria «Tots» per treure el filtre.</p>
          )}
        </div>
        {categoryState.status === 'error' && (
          <Retry
            message="No s’han pogut carregar les categories."
            onRetry={() => {
              categoriesTitle.current?.focus()
              setCategoryAttempt((n) => n + 1)
            }}
          />
        )}
      </section>

      <section aria-labelledby="catalog-results" className="mt-9">
        <h2 id="catalog-results" ref={resultsTitle} tabIndex={-1} className="scroll-mt-24 font-display text-3xl text-forest-950">
          Productes
        </h2>
        <div role="status" className="mt-2 min-h-5 text-sm text-ink/65">
          {pending && <p className="sr-only">{loadingMessage}</p>}
          {!pending && result && (
            result.total === 0 ? (
              <p>{name || categoryId ? 'No s’ha trobat cap producte amb aquests filtres.' : 'Ara mateix no hi ha productes disponibles.'}</p>
            ) : (
              <>
                <p>Pàgina {page} de {lastPage} · {result.total} {result.total === 1 ? 'producte' : 'productes'}</p>
                {result.incomplete && <p>Alguns productes d’aquesta pàgina no s’han pogut mostrar.</p>}
              </>
            )
          )}
        </div>
        {productState.status === 'error' && (
          <Retry
            message="No s’han pogut carregar els productes."
            onRetry={() => {
              resultsTitle.current?.focus()
              setProductAttempt((n) => n + 1)
            }}
          />
        )}
        <div aria-busy={pending} className="relative">
          {displayedResult?.products?.length > 0 && (
            <div
              ref={resultsContent}
              inert={pending}
              className={pending ? 'blur-[2px] opacity-60 motion-safe:transition-[filter,opacity]' : undefined}
            >
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {displayedResult.products.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
              </div>
              <CatalogPagination
                page={displayedPage}
                lastPage={displayedResult.lastPage}
                pending={pending}
                onPage={movePage}
              />
            </div>
          )}
          {pending && (
            <div
              aria-hidden="true"
              className={displayedResult
                ? 'pointer-events-none absolute inset-x-0 top-6 flex justify-center px-3'
                : 'mt-6 grid min-h-28 place-items-center rounded-3xl bg-forest-900/5 px-3'}
            >
              <div className="inline-flex max-w-full items-center gap-2.5 rounded-2xl border border-forest-900/10 bg-cream px-3 py-2 text-sm font-semibold text-forest-950 shadow-card">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-700 motion-safe:animate-pulse">
                  <Leaf className="h-4 w-4" />
                </span>
                {loadingMessage}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
