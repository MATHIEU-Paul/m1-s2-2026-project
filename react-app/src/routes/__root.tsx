import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Layout } from '../Layout'
import { ThemeProvider } from '../providers/ThemeProvider'

function getPageTitle(pathname: string): string {
  if (pathname === '/') {
    return 'Babel - Home'
  }

  if (pathname === '/about') {
    return 'Babel - About'
  }

  if (pathname === '/authors' || pathname === '/authors/') {
    return 'Babel - Authors'
  }

  if (pathname === '/books' || pathname === '/books/') {
    return 'Babel - Books'
  }

  if (pathname === '/clients' || pathname === '/clients/') {
    return 'Babel - Clients'
  }

  if (/^\/authors\/[^/]+$/.test(pathname)) {
    return 'Babel - Author Details'
  }

  if (/^\/books\/[^/]+$/.test(pathname)) {
    return 'Babel - Book Details'
  }

  if (/^\/clients\/[^/]+$/.test(pathname)) {
    return 'Babel - Client Details'
  }

  return 'Babel'
}

function PageMetadata() {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  return null
}

const RootLayout = () => {
  return (
    <ThemeProvider>
      <PageMetadata />
      <Layout>
        <Outlet />
      </Layout>
    </ThemeProvider>
  )
}

export const Route = createRootRoute({ component: RootLayout })
