import {
  BookOutlined,
  HomeOutlined,
  InfoOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Space, Switch, type MenuProps } from 'antd'
import Menu from 'antd/es/menu/menu'
import { useTheme } from './providers/useTheme'
import { Route as aboutRoute } from './routes/about'
import { Route as authorsRoute } from './routes/authors'
import { Route as booksRoute } from './routes/books'
import { Route as clientsRoute } from './routes/clients'
import { Route as indexRoute } from './routes/index'
import './styles/navbar.css'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const items: Required<MenuProps>['items'] = [
    {
      label: <Link to={indexRoute.to}>Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to={booksRoute.to}>Books</Link>,
      key: 'books',
      icon: <BookOutlined />,
    },
    {
      label: <Link to={authorsRoute.to}>Authors</Link>,
      key: 'authors',
      icon: <TeamOutlined />,
    },
    {
      label: <Link to={clientsRoute.to}>Clients</Link>,
      key: 'clients',
      icon: <UserOutlined />,
    },
    {
      label: <Link to={aboutRoute.to}>About</Link>,
      key: 'about',
      icon: <InfoOutlined />,
    },
  ]

  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
          width: '100%',
          backgroundColor: 'var(--app-header-bg)',
          color: 'var(--app-header-text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Link
            to={indexRoute.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '0 1rem',
              padding: '0.75rem 1rem',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src="/babel.png"
              alt="Babel logo"
              style={{ width: '32px', height: '32px', objectFit: 'contain' }}
            />
            <h2 style={{ margin: 0 }}>Babel&apos;s Library</h2>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            className="main-nav"
            style={{
              backgroundColor: 'transparent',
              flexGrow: 1,
              borderBottom: 'none',
            }}
          />
        </div>

        <div style={{ marginRight: '3rem' }}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren="🌙"
            unCheckedChildren="☀️"
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          overflowY: 'scroll',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </Space>
  )
}
