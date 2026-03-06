import {
  ArrowLeftOutlined,
  EditOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Link } from '@tanstack/react-router'
import {
  Avatar,
  Button,
  Form,
  Input,
  List,
  message,
  Modal,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import { Route as authorsRoute } from '../../routes/authors'
import { useAuthorDetailsProvider } from '../providers/useAuthorDetailsProvider'

interface AuthorDetailsProps {
  id: string
}

export const AuthorDetails = ({ id }: AuthorDetailsProps) => {
  const { isLoading, author, loadAuthor, updateAuthor } =
    useAuthorDetailsProvider(id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const authorTitle = [author?.firstName, author?.lastName]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    loadAuthor()
  }, [id, loadAuthor])

  const showEditModal = () => {
    if (author) {
      form.setFieldsValue({
        firstName: author.firstName,
        lastName: author.lastName,
      })
      setIsModalOpen(true)
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await updateAuthor(values)
      await loadAuthor()
      setIsModalOpen(false)
      message.success('Author updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (isLoading) return <Skeleton active />

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '95%' }}>
      <AppBreadcrumb
        items={[
          { title: 'Authors', href: '/authors', icon: <TeamOutlined /> },
          {
            title: authorTitle || 'Author Details',
          },
        ]}
      />

      <Link to={authorsRoute.to}>
        <ArrowLeftOutlined /> Back to list
      </Link>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={1}>Author Details</Typography.Title>
        <Button type="primary" icon={<EditOutlined />} onClick={showEditModal}>
          Edit Info
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {hasImagePath(author?.imagePath) ? (
          <Avatar size={100} src={API_BASE_URL + author.imagePath.trim()} />
        ) : (
          <Avatar size={100} style={{ backgroundColor: '#395E66' }}>
            {getInitials(author?.firstName, author?.lastName)}
          </Avatar>
        )}
        <div>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {author?.firstName} {author?.lastName}
          </Typography.Title>
          <Typography.Text type="secondary" strong>
            Average Purchases per book: {author?.purchasesAverage.toFixed(2)}
          </Typography.Text>
        </div>
      </div>

      <Typography.Title level={4} style={{ marginTop: '2rem' }}>
        Books ({author?.books?.length ?? 0})
      </Typography.Title>

      {!author?.books?.length ? (
        <Typography.Text type="secondary">No books yet</Typography.Text>
      ) : (
        <List
          style={{ width: '100%' }}
          dataSource={author.books}
          renderItem={book => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  book.coverPath ? (
                    <Avatar
                      shape="square"
                      src={API_BASE_URL + book.coverPath}
                    />
                  ) : undefined
                }
                title={
                  <Link to="/books/$bookId" params={{ bookId: book.id }}>
                    {book.title}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Edit Author Information"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Save Changes"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="edit_author_form">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter the first name' }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter the last name' }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
