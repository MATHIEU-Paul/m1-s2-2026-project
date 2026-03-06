import {
  ArrowLeftOutlined,
  SaveOutlined,
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

  const handleSave = () => {
    updateClient({
      firstName,
      lastName,
      email: email || undefined,
    })
    setHasChanges(false)
  }

  if (isLoading) {
    return <Skeleton active />
  }

  return (
    <Space
      direction="vertical"
      style={{ textAlign: 'left', width: '95%', padding: '1rem' }}
    >
      <AppBreadcrumb
        items={[
          { title: 'Clients', href: '/clients', icon: <UserOutlined /> },
          {
            title: clientTitle || 'Client Details',
          },
        ]}
      />

      <Link to="/clients">
        <ArrowLeftOutlined /> Back to Clients
      </Link>

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
              <Avatar size={84} style={{ backgroundColor: '#395E66' }}>
                {getInitials(client?.firstName, client?.lastName)}
              </Avatar>
            )}
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>First Name:</label>
            <Input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Last Name:</label>
            <Input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Email:</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Optional"
              style={{ marginTop: '0.5rem' }}
            />
          </div>
          {hasChanges && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ marginTop: '1rem' }}
            >
              Save Changes
            </Button>
          )}
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
                  borderBottom: '1px solid #f0f0f0',
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
