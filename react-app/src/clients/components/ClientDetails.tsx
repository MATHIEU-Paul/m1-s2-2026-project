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
import { ImageInput } from '../../components/ImageInput'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import type { UpdateClientModel } from '../ClientModel'
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
  const [pendingImage, setPendingImage] = useState<string | null | undefined>(
    undefined,
  )
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
      setPendingImage(undefined)
    }
  }, [client])

  useEffect(() => {
    if (client) {
      setHasChanges(
        firstName !== client.firstName ||
          lastName !== client.lastName ||
          email !== (client.email || '') ||
          pendingImage !== undefined,
      )
    }
  }, [firstName, lastName, email, pendingImage, client])

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (client) {
      setFirstName(client.firstName)
      setLastName(client.lastName)
      setEmail(client.email || '')
      setPendingImage(undefined)
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      const updates: UpdateClientModel = {
        firstName,
        lastName,
        email: email || undefined,
      }

      if (pendingImage !== undefined) {
        updates.image = pendingImage
      }

      await updateClient(updates)
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

  const displayedImage =
    pendingImage === undefined
      ? client?.imagePath
      : pendingImage === null
        ? undefined
        : pendingImage

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
            {hasImagePath(displayedImage) ? (
              <Avatar
                size={84}
                src={
                  displayedImage.startsWith('data:')
                    ? displayedImage
                    : API_BASE_URL + displayedImage.trim()
                }
              />
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
            <label style={{ fontWeight: 'bold' }}>
              {isEditing ? (
                <Typography.Text type="danger">*</Typography.Text>
              ) : null}{' '}
              First Name:
            </label>
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
            <label style={{ fontWeight: 'bold' }}>
              {isEditing ? (
                <Typography.Text type="danger">*</Typography.Text>
              ) : null}{' '}
              Last Name:
            </label>
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
          {isEditing ? (
            <div>
              <label style={{ fontWeight: 'bold' }}>Profile picture:</label>
              <Space direction="vertical" style={{ marginTop: '0.5rem' }}>
                <ImageInput
                  onImageChange={newImage => setPendingImage(newImage)}
                />
                <Button
                  danger
                  onClick={() => setPendingImage(null)}
                  disabled={
                    !hasImagePath(client?.imagePath) && pendingImage !== null
                  }
                >
                  Remove current picture
                </Button>
              </Space>
            </div>
          ) : null}
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
