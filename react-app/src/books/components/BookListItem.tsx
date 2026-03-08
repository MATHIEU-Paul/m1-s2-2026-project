import {
  BookOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Avatar, Button, Col, Modal, Row } from 'antd'
import { hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import type { BookWithPurchaseCountModel } from '../BookModel'

interface BookListItemProps {
  book: BookWithPurchaseCountModel
  onDelete: (id: string) => void
}

export function BookListItem({ book, onDelete }: BookListItemProps) {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this book?',
      icon: <ExclamationCircleOutlined />,
      content: `${book.title} by ${book.author.firstName} ${book.author.lastName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(book.id)
      },
    })
  }

  return (
    <Row
      style={{
        width: '100%',
        minHeight: '60px',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface-muted)',
        color: 'var(--app-text)',
        margin: '1rem 0',
        padding: '.25rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col span={12} style={{ margin: 'auto 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '.75rem',
          }}
        >
          {hasImagePath(book.coverPath) ? (
            <Avatar
              shape="square"
              src={API_BASE_URL + book.coverPath!.trim()}
              style={{
                width: '34px',
                height: '48px',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            />
          ) : (
            <Avatar
              shape="square"
              style={{
                width: '34px',
                height: '48px',
                borderRadius: '6px',
                backgroundColor: 'var(--app-brand-600)',
                flexShrink: 0,
              }}
            >
              <BookOutlined
                style={{ fontSize: '18px', color: 'var(--app-surface)' }}
              />
            </Avatar>
          )}
          <Link
            to={`/books/$bookId`}
            params={{ bookId: book.id }}
            style={{
              margin: 'auto 0',
              textAlign: 'left',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>{book.title}</span> -{' '}
            {book.yearPublished} ({book.purchaseCount} purchase
            {book.purchaseCount > 1 ? 's' : ''})
          </Link>
        </div>
      </Col>
      <Col span={9} style={{ margin: 'auto 0', color: 'var(--app-brand-600)' }}>
        by <span style={{ fontWeight: 'bold' }}>{book.author.firstName}</span>{' '}
        <span style={{ fontWeight: 'bold' }}>{book.author.lastName}</span>
      </Col>
      <Col span={3} style={{ textAlign: 'right', margin: 'auto 0' }}>
        <Button type="primary" danger onClick={showDeleteConfirm}>
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  )
}
