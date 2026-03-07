import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Avatar, Button, Col, Modal, Row } from 'antd'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import type { AuthorWithBookCountModel } from '../AuthorModel'

interface AuthorListItemProps {
  author: AuthorWithBookCountModel
  onDelete: (id: string) => void
}

export function AuthorListItem({ author, onDelete }: AuthorListItemProps) {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this author?',
      icon: <ExclamationCircleOutlined />,
      content: `${author.firstName} ${author.lastName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(author.id)
      },
    })
  }

  return (
    <Row
      style={{
        width: '100%',
        height: '60px',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface-muted)',
        color: 'var(--app-text)',
        margin: '1rem 0',
        padding: '.25rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Col
        span={18}
        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
      >
        {hasImagePath(author.imagePath) ? (
          <Avatar src={API_BASE_URL + author.imagePath.trim()} />
        ) : (
          <Avatar style={{ backgroundColor: 'var(--app-brand-600)' }}>
            {getInitials(author.firstName, author.lastName)}
          </Avatar>
        )}
        <Link to={`/authors/$authorId`} params={{ authorId: author.id }}>
          <span style={{ fontWeight: 'bold' }}>
            {author.firstName} {author.lastName}
          </span>{' '}
          - {author.bookCount} book{author.bookCount > 1 ? 's' : ''}
        </Link>
      </Col>
      <Col span={6} style={{ textAlign: 'right' }}>
        <Button type="primary" danger onClick={showDeleteConfirm}>
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  )
}
