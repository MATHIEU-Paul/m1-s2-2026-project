import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Avatar, Button, Col, Modal, Row } from 'antd'
import { useState } from 'react'
import { hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import type { BookWithPurchaseCountModel, UpdateBookModel } from '../BookModel'

interface BookListItemProps {
  book: BookWithPurchaseCountModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateBookModel) => void
}

export function BookListItem({ book, onDelete, onUpdate }: BookListItemProps) {
  const [title, setTitle] = useState(book.title)
  const [isEditing, setIsEditing] = useState(false)

  const onCancelEdit = () => {
    setIsEditing(false)
    setTitle(book.title)
  }

  const onValidateEdit = () => {
    onUpdate(book.id, { title })
    setIsEditing(false)
  }

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
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface-muted)',
        color: 'var(--app-text)',
        margin: '1rem 0',
        padding: '.5rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col span={12} style={{ margin: 'auto 0' }}>
        {isEditing ? (
          <input value={title} onChange={e => setTitle(e.target.value)} />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.75rem',
            }}
          >
            {hasImagePath(book.coverPath) && (
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
        )}
      </Col>
      <Col span={9} style={{ margin: 'auto 0', color: 'var(--app-brand-600)' }}>
        by <span style={{ fontWeight: 'bold' }}>{book.author.firstName}</span>{' '}
        <span style={{ fontWeight: 'bold' }}>{book.author.lastName}</span>
      </Col>
      <Col
        span={3}
        style={{
          alignItems: 'right',
          display: 'flex',
          gap: '.25rem',
          margin: 'auto 0',
        }}
      >
        {isEditing ? (
          <>
            <Button type="primary" onClick={onValidateEdit}>
              <CheckOutlined />
            </Button>
            <Button onClick={onCancelEdit}>
              <CloseOutlined />
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            <EditOutlined />
          </Button>
        )}
        <Button type="primary" danger onClick={showDeleteConfirm}>
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  )
}
