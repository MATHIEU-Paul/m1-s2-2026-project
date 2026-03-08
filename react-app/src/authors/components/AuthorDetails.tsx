import {
  ArrowLeftOutlined,
  BarChartOutlined,
  BookOutlined,
  EditOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  message,
  Row,
  Skeleton,
  Space,
  Statistic,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import { ImageInput } from '../../components/ImageInput'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import { Route as authorsRoute } from '../../routes/authors'
import type { UpdateAuthorModel } from '../AuthorModel'
import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'

const { Title, Text } = Typography

interface AuthorDetailsProps {
  id: string
}

export const AuthorDetails = ({ id }: AuthorDetailsProps) => {
  const { isLoading, author, loadAuthor, updateAuthor } =
    useAuthorDetailsProvider(id)
  const [isEditing, setIsEditing] = useState(false)
  const [pendingImage, setPendingImage] = useState<string | null | undefined>(
    undefined,
  )
  const [form] = Form.useForm()

  const authorTitle = [author?.firstName, author?.lastName]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    loadAuthor()
  }, [id, loadAuthor])

  useEffect(() => {
    if (author) {
      form.setFieldsValue({
        firstName: author.firstName,
        lastName: author.lastName,
      })
      setPendingImage(undefined)
    }
  }, [author, form])

  const saveChanges = async () => {
    try {
      const values = await form.validateFields()
      const updates: UpdateAuthorModel = values
      if (pendingImage !== undefined) {
        updates.image = pendingImage
      }

      await updateAuthor(updates)
      await loadAuthor()
      setIsEditing(false)
      message.success('Author updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (isLoading) return <Skeleton active avatar paragraph={{ rows: 10 }} />

  const displayedImage =
    pendingImage === undefined
      ? author?.imagePath
      : pendingImage === null
        ? undefined
        : pendingImage

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <AppBreadcrumb
            items={[
              { title: 'Authors', href: '/authors', icon: <TeamOutlined /> },
              { title: authorTitle || 'Author Details' },
            ]}
          />
          <Link
            to={authorsRoute.to}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <ArrowLeftOutlined style={{ marginRight: 8 }} /> Back to authors
          </Link>
        </Col>
        <Col>
          <Space>
            {isEditing ? (
              <>
                <Button
                  onClick={() => {
                    setPendingImage(undefined)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" onClick={saveChanges}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
              >
                Edit Author
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={8} lg={7}>
          <Card
            bordered={false}
            style={{ textAlign: 'center', borderRadius: '12px' }}
          >
            {hasImagePath(displayedImage) ? (
              <Avatar
                size={160}
                src={
                  displayedImage.startsWith('data:')
                    ? displayedImage
                    : API_BASE_URL + displayedImage.trim()
                }
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            ) : (
              <Avatar
                size={160}
                style={{
                  backgroundColor: 'var(--app-brand-600)',
                  fontSize: '64px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {getInitials(author?.firstName, author?.lastName)}
              </Avatar>
            )}

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Books"
                  value={author?.books?.length ?? 0}
                  prefix={<BookOutlined style={{ fontSize: '14px' }} />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg. Sales"
                  value={author?.purchasesAverage ?? 0}
                  precision={2}
                  prefix={<BarChartOutlined style={{ fontSize: '14px' }} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={16} lg={17}>
          {isEditing ? (
            <Card title="Edit Personal Information">
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstName"
                      label="First Name"
                      rules={[{ required: true }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastName"
                      label="Last Name"
                      rules={[{ required: true }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Profile picture">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <ImageInput
                      onImageChange={newImage => setPendingImage(newImage)}
                    />
                    <Button
                      danger
                      onClick={() => setPendingImage(null)}
                      disabled={
                        !hasImagePath(author?.imagePath) &&
                        pendingImage !== null
                      }
                    >
                      Remove current picture
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <Title level={1} style={{ margin: 0 }}>
                  {author?.firstName} {author?.lastName}
                </Title>
                <Text type="secondary">Author Profile</Text>
              </div>

              <Title level={4}>
                <BookOutlined /> Bibliography
              </Title>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2 }}
                dataSource={author?.books}
                renderItem={book => (
                  <List.Item>
                    <Link to="/books/$bookId" params={{ bookId: book.id }}>
                      <Card
                        hoverable
                        size="small"
                        styles={{
                          body: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                          },
                        }}
                      >
                        <Avatar
                          shape="square"
                          size={48}
                          src={
                            book.coverPath
                              ? API_BASE_URL + book.coverPath
                              : undefined
                          }
                          icon={!book.coverPath && <BookOutlined />}
                          style={{
                            marginRight: 16,
                            borderRadius: '4px',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <Text
                            strong
                            style={{
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {book.title}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            View Details
                          </Text>
                        </div>
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}
