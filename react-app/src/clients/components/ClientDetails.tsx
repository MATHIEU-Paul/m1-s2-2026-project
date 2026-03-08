import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import {
  Avatar,
  Button,
  Card,
  Col,
  Image,
  Input,
  List,
  message,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import { useClientDetailsProvider } from '../providers/useClientDetailsProvider'

interface ClientDetailsProps {
  id: string
}

export const ClientDetails = ({ id }: ClientDetailsProps) => {
  const { isLoading, client, purchases, loadClient, updateClient } =
    useClientDetailsProvider(id)
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const clientTitle = [client?.firstName, client?.lastName]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    loadClient()
  }, [id, loadClient])

  useEffect(() => {
    if (client) {
      setFirstName(client.firstName)
      setLastName(client.lastName)
      setEmail(client.email || '')
    }
  }, [client])

  useEffect(() => {
    if (client) {
      setHasChanges(
        firstName !== client.firstName ||
          lastName !== client.lastName ||
          email !== (client.email || ''),
      )
    }
  }, [firstName, lastName, email, client])

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (client) {
      setFirstName(client.firstName)
      setLastName(client.lastName)
      setEmail(client.email || '')
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      await updateClient({
        firstName,
        lastName,
        email: email || undefined,
      })
      await loadClient()
      setHasChanges(false)
      setIsEditing(false)
      message.success('Client updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (isLoading) {
    return <Skeleton active />
  }

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '100%' }}>
      <AppBreadcrumb
        items={[
          { title: 'Clients', href: '/clients', icon: <UserOutlined /> },
          {
            title: clientTitle || 'Client Details',
          },
        ]}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <Link to="/clients">
          <ArrowLeftOutlined /> Back to clients
        </Link>

        <Space>
          {isEditing ? (
            <>
              <Button
                type="primary"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                Save
              </Button>
              <Button onClick={cancelEditing}>Cancel</Button>
            </>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={startEditing}
              disabled={!client}
            >
              Edit Info
            </Button>
          )}
        </Space>
      </div>

      <Card title="Client Information" style={{ marginTop: '1rem' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '0.5rem',
            }}
          >
            {hasImagePath(client?.imagePath) ? (
              <Avatar size={84} src={API_BASE_URL + client.imagePath.trim()} />
            ) : (
              <Avatar
                size={84}
                style={{ backgroundColor: 'var(--app-brand-600)' }}
              >
                {getInitials(client?.firstName, client?.lastName)}
              </Avatar>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>First Name:</label>
            {isEditing ? (
              <Input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
            ) : (
              <Typography.Text
                style={{ marginTop: '0.5rem', display: 'block' }}
              >
                {firstName}
              </Typography.Text>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Last Name:</label>
            {isEditing ? (
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                style={{ marginTop: '0.5rem' }}
              />
            ) : (
              <Typography.Text
                style={{ marginTop: '0.5rem', display: 'block' }}
              >
                {lastName}
              </Typography.Text>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Email:</label>
            {isEditing ? (
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Optional"
                style={{ marginTop: '0.5rem' }}
              />
            ) : (
              <Typography.Text
                style={{ marginTop: '0.5rem', display: 'block' }}
              >
                {email || '-'}
              </Typography.Text>
            )}
          </div>
        </Space>
      </Card>

      <Card
        title={`Purchased Books (${purchases.length})`}
        style={{ marginTop: '1rem' }}
      >
        {purchases.length === 0 ? (
          <Typography.Text type="secondary">
            No books purchased yet
          </Typography.Text>
        ) : (
          <List
            dataSource={purchases}
            renderItem={purchase => (
              <List.Item
                style={{
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--app-border-subtle)',
                }}
              >
                <Row gutter={16} style={{ width: '100%' }}>
                  {purchase.bookCoverPath && (
                    <Col span={4}>
                      <Image
                        src={API_BASE_URL + purchase.bookCoverPath}
                        alt={purchase.bookTitle + ' cover'}
                        style={{ maxWidth: '100px', borderRadius: '4px' }}
                        preview={false}
                      />
                    </Col>
                  )}
                  <Col span={purchase.bookCoverPath ? 20 : 24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Typography.Text strong>Book Title:</Typography.Text>
                        <Typography.Text style={{ marginLeft: '0.5rem' }}>
                          {purchase.bookTitle}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text strong>Author:</Typography.Text>
                        <Typography.Text style={{ marginLeft: '0.5rem' }}>
                          {purchase.bookAuthor}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text strong>Purchase Date:</Typography.Text>
                        <Typography.Text style={{ marginLeft: '0.5rem' }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </Typography.Text>
                      </div>
                      <div>
                        <Link
                          to="/books/$bookId"
                          params={{ bookId: purchase.bookId }}
                        >
                          See Book Details
                        </Link>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        )}
      </Card>
    </Space>
  )
}
