import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

const authRoutes = ['/login', '/register']

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAuthPage = authRoutes.includes(pathname)
  const [cartCount, setCartCount] = useState(0)

  const addToCart = () => setCartCount((count) => count + 1)

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {isAuthPage ? (
        <Outlet />
      ) : (
        <>
          <Header cartCount={cartCount} />
          <main className="flex-1">
            <Outlet context={{ cartCount, addToCart }} />
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
