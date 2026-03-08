import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
  EditOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import {
  Avatar,
  Button,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Select,
  Skeleton,
  Space,
  Typography,
  Row,
  Col,
  Card,
  Divider,
  Tag,
} from 'antd'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import { PurchaseBookModal } from '../../purchases/components/PurchaseBookModal'
import { Route as booksRoute } from '../../routes/books'
import { useBookAuthorsProviders } from '../providers/useBookAuthorsProviders'
import { useBookDetailsProvider } from '../providers/useBookDetailsProvider'
import { useBookMetadataProvider } from '../providers/useBookMetadataProvider' // Utilisation du metadata provider

const { Title, Text } = Typography
interface BookDetailsProps {
  id: string
}

export const BookDetails = ({ id }: BookDetailsProps) => {
  const { isLoading, book, loadBook, updateBook } = useBookDetailsProvider(id)
  const { authors, loadAuthors } = useBookAuthorsProviders()
  
  const { genres, bookTypes, loadGenres, loadBookTypes } = useBookMetadataProvider()

  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadBook()
  }, [id, loadBook])

  useEffect(() => {
    if (book) {
      form.setFieldsValue({
        title: book.title,
        authorId: book.author.id,
        yearPublished: book.yearPublished,
        numberPages: book.numberPages,
        bookTypeId: book.bookType?.id,
        genreId: book.genre?.id,
      })
    }
  }, [book, form])

  const startEditing = async () => {
    try {
      await Promise.all([
        loadAuthors(),
        loadGenres(),
        loadBookTypes()
    ])
    } catch (e) {
    message.error("Failed to load metadata")
    }
    setIsEditing(true)
  }

  const saveChanges = async () => {
    try {
      const values = await form.validateFields()
      await updateBook(values)
      await loadBook()
      setIsEditing(false)
      message.success('Book updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (isLoading) return <Skeleton active avatar paragraph={{ rows: 10 }} />

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <AppBreadcrumb
            items={[
              { title: 'Books', href: '/books', icon: <BookOutlined /> },
              { title: book?.title || 'Book Details' },
            ]}
          />
          <Link to={booksRoute.to} style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}>
            <ArrowLeftOutlined style={{ marginRight: 8 }} /> Back to books
          </Link>
        </Col>
        <Col>
          <Space>
            <PurchaseBookModal bookId={id} />
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="primary" onClick={saveChanges}>Save</Button>
              </>
            ) : (
              <Button type="primary" icon={<EditOutlined />} onClick={startEditing}>
                Edit Info
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={8} lg={6}>
          <div style={{ position: 'sticky', top: 20 }}>
            {book?.coverPath ? (
              <img
                src={API_BASE_URL + book.coverPath}
                alt={book.title}
                style={{ width: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            ) : (
              <div style={{ width: '100%', aspectRatio: '2/3', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <BookOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
              </div>
            )}
            
            <Card size="small" style={{ marginTop: 20, borderRadius: '8px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary"><CalendarOutlined /> Published: <b>{book?.yearPublished}</b></Text>
                <Text type="secondary"><FileTextOutlined /> Pages: <b>{book?.numberPages || 'N/A'}</b></Text>
                <Divider style={{ margin: '8px 0' }} />
                <Space wrap>
                  {book?.bookType && <Tag color="blue">{book.bookType.name}</Tag>}
                  {book?.genre && <Tag color="purple">{book.genre.name}</Tag>}
                </Space>
              </Space>
            </Card>
          </div>
        </Col>

        <Col xs={24} md={16} lg={18}>
          {isEditing ? (
            <Card title="Edit Book Information">
              <Form form={form} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="authorId" label="Author" rules={[{ required: true }]}>
                      <Select 
                        showSearch
                        optionFilterProp="label"
                        options={authors.map(a => ({ label: `${a.firstName} ${a.lastName}`, value: a.id }))} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="yearPublished" label="Year Published">
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="numberPages" label="Pages">
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="bookTypeId" label="Format">
                      <Select 
                        placeholder="Format"
                        options={bookTypes.map(t => ({ label: t.name, value: t.id }))} 
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="genreId" label="Genre">
                      <Select 
                        placeholder="Genre"
                        options={genres.map(g => ({ label: g.name, value: g.id }))} 
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <Title level={1} style={{ margin: 0 }}>{book?.title}</Title>
                <Title level={3} type="secondary" style={{ marginTop: 4, fontWeight: 300 }}>
                  <Link to="/authors/$authorId" params={{ authorId: book?.author.id ?? '' }} style={{ display: 'inline-flex', alignItems: 'center' }}>
                      by {book?.author?.firstName} {book?.author?.lastName}
                  </Link>
                </Title>
              </div>

              <Divider orientation="left"><UserOutlined /> Owners ({book?.purchases?.length ?? 0})</Divider>
              
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, lg: 3 }}
                dataSource={book?.purchases}
                renderItem={purchase => (
                  <List.Item>
                    <Link to="/clients/$clientId" params={{ clientId: purchase.clientId }}>
                      <Card size="small">
                        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                          <div style={{ flexShrink: 0 }}>
                            {hasImagePath(purchase.clientImagePath) ? (
                              <Avatar src={API_BASE_URL + purchase.clientImagePath!.trim()} />
                            ) : (
                              <Avatar>{getInitials(purchase.clientFirstName, purchase.clientLastName)}</Avatar>
                            )}
                          </div>
                          <div style={{ marginLeft: 12, minWidth: 0, flex: 1 }}>
                            <Text strong style={{ 
                              display: 'block', 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}>
                              {purchase.clientFirstName} {purchase.clientLastName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </Text>
                          </div>
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