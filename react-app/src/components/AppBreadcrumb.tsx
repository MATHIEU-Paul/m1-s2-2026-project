import { HomeOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Breadcrumb } from 'antd'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: ReactNode
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[]
  showHome?: boolean
}

export function AppBreadcrumb({ items, showHome = true }: AppBreadcrumbProps) {
  const breadcrumbItems = [
    ...(showHome
      ? [
          {
            title: (
              <Link to="/">
                <HomeOutlined style={{ marginRight: '4px' }} />
                Home
              </Link>
            ),
          },
        ]
      : []),
    ...items.map(item => ({
      title: item.href ? (
        <Link to={item.href}>
          {item.icon && <span style={{ marginRight: '4px' }}>{item.icon}</span>}
          {item.title}
        </Link>
      ) : (
        <>
          {item.icon && <span style={{ marginRight: '4px' }}>{item.icon}</span>}
          {item.title}
        </>
      ),
    })),
  ]

  return (
    <Breadcrumb
      style={{
        padding: '16px 24px',
        backgroundColor: 'var(--app-surface-muted)',
        borderRadius: '4px',
        marginBottom: '16px',
      }}
      items={breadcrumbItems}
    />
  )
}
