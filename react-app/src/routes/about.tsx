import { InfoOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { AppBreadcrumb } from '../components/AppBreadcrumb'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div style={{ textAlign: 'left' }}>
      <AppBreadcrumb items={[{ title: 'About', icon: <InfoOutlined /> }]} />

      <section
        style={{
          marginTop: '1rem',
          background: 'var(--app-hero-gradient)',
          color: 'var(--app-hero-text)',
          borderRadius: '14px',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem' }}>About Babel</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Babel&apos;s Library is a web application developed for the M1 2025
          Web Application Development course. The goal is to validate all
          concepts covered in class by delivering a clean, modular, full-stack
          project.
        </p>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <article
          style={{
            border: '1px solid var(--app-border)',
            borderRadius: '12px',
            padding: '1rem',
            backgroundColor: 'var(--app-surface-muted)',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Mission</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Deliver a maintainable and user-friendly library management
            application, with clear workflows to manage books, authors, clients,
            and sales records.
          </p>
        </article>

        <article
          style={{
            border: '1px solid var(--app-border)',
            borderRadius: '12px',
            padding: '1rem',
            backgroundColor: 'var(--app-surface-muted)',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Stack</h2>
          <p style={{ margin: 0, lineHeight: 1.6 }}>Frontend:</p>
          <ul
            style={{
              margin: '0.4rem 0 0.8rem',
              paddingLeft: '1rem',
              lineHeight: 1.8,
            }}
          >
            <li>TypeScript</li>
            <li>React</li>
            <li>Vite</li>
            <li>Ant Design</li>
            <li>@tanstack/react-router</li>
          </ul>
          <p style={{ margin: 0, lineHeight: 1.6 }}>Backend:</p>
          <ul
            style={{
              margin: '0.4rem 0 0',
              paddingLeft: '1rem',
              lineHeight: 1.8,
            }}
          >
            <li>TypeScript</li>
            <li>NestJS</li>
            <li>TypeORM</li>
            <li>SQLite</li>
            <li>REST API (no GraphQL)</li>
          </ul>
        </article>

        <article
          style={{
            border: '1px solid var(--app-border)',
            borderRadius: '12px',
            padding: '1rem',
            backgroundColor: 'var(--app-surface-muted)',
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Core Features</h2>
          <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.8 }}>
            <li>Clients management (list, details, update, delete, create)</li>
            <li>Books management with sale tracking per client and date</li>
            <li>Authors management with average sales indicators</li>
            <li>Breadcrumb-based navigation across all domains</li>
            <li>Bonus: dark/light mode toggle with persistent preference</li>
            <li>Bonus: image upload input for entity pictures</li>
            <li>
              Bonus: reusable queryable lists with sorting, order, and
              pagination
            </li>
            <li>Bonus: purchase modal with client selector and date picker</li>
            <li>Bonus: dynamic page titles and custom favicon branding</li>
            <li>Bonus: Home page with stats and recent purchases</li>
          </ul>
        </article>
      </section>

      <section
        style={{
          marginTop: '1rem',
          border: '1px solid var(--app-border)',
          borderRadius: '12px',
          padding: '1rem',
          backgroundColor: 'var(--app-surface)',
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Project Team</h2>
        <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.8 }}>
          <li>Paul CAUCHE</li>
          <li>L&eacute;o COPPIN</li>
          <li>Adrien DELERUE</li>
          <li>Paul MATHIEU</li>
        </ul>
      </section>
    </div>
  )
}
