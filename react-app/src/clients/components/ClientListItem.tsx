import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import { Avatar, Badge, Button, Col, Modal, Row } from 'antd'
import { useState } from 'react'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import type {
  ClientWithPurchaseCountModel,
  UpdateClientModel,
} from '../ClientModel'

interface ClientListItemProps {
  client: ClientWithPurchaseCountModel
  onDelete: (id: string) => void
  onUpdate: (id: string, input: UpdateClientModel) => void
}

export function ClientListItem({
  client,
  onDelete,
  onUpdate,
}: ClientListItemProps) {
  const [firstName, setFirstName] = useState(client.firstName)
  const [lastName, setLastName] = useState(client.lastName)
  const [isEditing, setIsEditing] = useState(false)

  const onCancelEdit = () => {
    setIsEditing(false)
    setFirstName(client.firstName)
    setLastName(client.lastName)
  }

  const onValidateEdit = () => {
    onUpdate(client.id, { firstName, lastName })
    setIsEditing(false)
  }

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this client?',
      icon: <ExclamationCircleOutlined />,
      content: `${client.firstName} ${client.lastName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDelete(client.id)
      },
    })
  }

  return (
    <Row
      style={{
        width: '100%',
        height: '50px',
        borderRadius: '10px',
        backgroundColor: 'var(--app-surface-muted)',
        color: 'var(--app-text)',
        margin: '1rem 0',
        padding: '.25rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Col span={12} style={{ margin: 'auto 0' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.75rem',
            }}
          >
            {hasImagePath(client.imagePath) ? (
              <Avatar src={API_BASE_URL + client.imagePath.trim()} />
            ) : (
              <Avatar style={{ backgroundColor: 'var(--app-brand-600)' }}>
                {getInitials(client.firstName, client.lastName)}
              </Avatar>
            )}
            <Link
              to={`/clients/$clientId`}
              params={{ clientId: client.id }}
              style={{
                margin: 'auto 0',
                textAlign: 'left',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{client.firstName}</span>{' '}
              <span style={{ fontWeight: 'bold' }}>{client.lastName}</span>
            </Link>
          </div>
        )}
      </Col>
      <Col span={9} style={{ margin: 'auto 0' }}>
        <Badge
          count={client.purchaseCount || 0}
          showZero
          color="var(--app-brand-600)"
          style={{ marginRight: '1rem' }}
        />
        {(client.purchaseCount || 0) <= 1
          ? 'book purchased'
          : 'books purchased'}
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
