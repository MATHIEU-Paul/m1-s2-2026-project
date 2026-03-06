import {
  ArrowLeftOutlined,
  BookOutlined,
  EditOutlined,
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
  Modal,
  Select,
  Skeleton,
  Space,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import { getInitials, hasImagePath } from '../../components/avatarFallback'
import { API_BASE_URL } from '../../config/api'
import { PurchaseBookModal } from '../../purchases/components/PurchaseBookModal'
import { Route as booksRoute } from '../../routes/books'
import { useBookAuthorsProviders } from '../providers/useBookAuthorsProviders'
import { useBookDetailsProvider } from '../providers/useBookDetailsProvider'

interface BookDetailsProps {
  id: string
}

export const BookDetails = ({ id }: BookDetailsProps) => {
  const { isLoading, book, loadBook, updateBook } = useBookDetailsProvider(id)
  const { authors, loadAuthors } = useBookAuthorsProviders()
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadBook()
  }, [id, loadBook])

  // Open modal and pre-fill fields with current book data
  const showEditModal = () => {
    loadAuthors()
    if (book) {
      form.setFieldsValue({
        title: book.title,
        authorId: book.author.id,
        yearPublished: book.yearPublished,
        numberPages: book.numberPages,
        booktypeId: book.bookType?.id,
        genreId: book.genre?.id,
      })
      setIsModalOpen(true)
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await updateBook(values)

      // Reload details after update
      await loadBook()

      setIsModalOpen(false)
      message.success('Book updated successfully!')
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  if (isLoading) return <Skeleton active />

  return (
    <Space direction="vertical" style={{ textAlign: 'left', width: '95%' }}>
      <AppBreadcrumb
        items={[
          { title: 'Books', href: '/books', icon: <BookOutlined /> },
          { title: book?.title || 'Book Details' },
        ]}
      />

      <Link to={booksRoute.to}>
        <ArrowLeftOutlined /> Back to list
      </Link>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={1}>Book Details</Typography.Title>

        <Space>
          <PurchaseBookModal bookId={id} />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={showEditModal}
          >
            Edit Info
          </Button>
        </Space>
      </div>

      <Typography.Title level={2}>{book?.title}</Typography.Title>

      <Typography.Title level={3} type="secondary">
        By {book?.author?.firstName} {book?.author?.lastName}
      </Typography.Title>

      <Typography.Text strong>Published Year: </Typography.Text>
      <Typography.Text>{book?.yearPublished}</Typography.Text>

      {book?.coverPath && (
        <img
          src={API_BASE_URL + book.coverPath}
          alt={`${book.title} cover`}
          style={{ marginTop: '1rem', maxWidth: '200px', borderRadius: '5px' }}
        />
      )}

      <Typography.Title level={4} style={{ marginTop: '1rem' }}>
        Clients ({book?.purchases?.length ?? 0})
      </Typography.Title>

      {!book?.purchases?.length ? (
        <Typography.Text type="secondary">No clients yet</Typography.Text>
      ) : (
        <List
          style={{ width: '100%' }}
          dataSource={book.purchases}
          renderItem={purchase => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  hasImagePath(purchase.clientImagePath) ? (
                    <Avatar
                      src={API_BASE_URL + purchase.clientImagePath!.trim()}
                    />
                  ) : (
                    <Avatar>
                      {getInitials(
                        purchase.clientFirstName,
                        purchase.clientLastName,
                      )}
                    </Avatar>
                  )
                }
                title={`${purchase.clientFirstName} ${purchase.clientLastName}`}
                description={`Purchase date: ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Edit Book Information"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Save Changes"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="edit_book_form">
          <Form.Item
            name="title"
            label="Book Title"
            rules={[{ required: true, message: 'Please enter the title' }]}
          >
            <Input placeholder="Enter book title" />
          </Form.Item>

          <Form.Item
            name="authorId"
            label="Author"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select an author"
              options={authors.map(a => ({
                label: `${a.firstName} ${a.lastName}`,
                value: a.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="yearPublished"
            label="Publication Year"
            rules={[{ required: true, message: 'Please enter the year' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="YYYY" />
          </Form.Item>

          <Form.Item
            name="numberpages"
            label="Number of Pages"
            rules={[
              { required: false, message: 'Please enter the number of pages' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter number of pages"
            />
          </Form.Item>

          {/* <Form.Item
            name="bookType" label="Book Type"
            rules={[{ required: false, message: 'Please select a book type' }]}
          >
            <Select 
              placeholder="Select a book type"
              options={bookTypes.map(bt => ({
                label: bt.name,
                value: bt.id
              }))}
            />
          </Form.Item> */}
        </Form>
      </Modal>
    </Space>
  )
}
