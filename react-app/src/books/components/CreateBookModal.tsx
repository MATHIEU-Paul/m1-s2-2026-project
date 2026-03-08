import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { ImageInput } from '../../components/ImageInput'
import type { CreateBookModel } from '../BookModel'
import { useBookAuthorsProviders } from '../providers/useBookAuthorsProviders'
import { useBookMetadataProvider } from '../providers/useBookMetadataProvider'

interface CreateBookModalProps {
  onCreate: (book: CreateBookModel) => void
}

export function CreateBookModal({ onCreate }: CreateBookModalProps) {
  const { Text } = Typography
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [yearPublished, setYearPublished] = useState(2000)
  const [numberPages, setNumberPages] = useState<number | undefined>(undefined)
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined)
  const { authors, loadAuthors } = useBookAuthorsProviders()
  const { genres, bookTypes, loadGenres, loadBookTypes } =
    useBookMetadataProvider()
  const [authorId, setAuthorId] = useState<string | undefined>(undefined)
  const [bookTypeId, setBookTypeId] = useState<string | undefined>(undefined)
  const [genreId, setGenreId] = useState<string | undefined>(undefined)

  const onClose = () => {
    setTitle('')
    setYearPublished(0)
    setNumberPages(undefined)
    setCoverImage(undefined)
    setAuthorId(undefined)
    setBookTypeId(undefined)
    setGenreId(undefined)
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadAuthors()
      loadGenres()
      loadBookTypes()
    }
  }, [isOpen, loadAuthors, loadGenres, loadBookTypes])

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setIsOpen(true)}
          style={{ minWidth: 220 }}
        >
          Create Book
        </Button>
      </div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          onCreate({
            title,
            yearPublished,
            numberPages,
            coverImage,
            authorId: authorId!,
            bookTypeId,
            genreId,
          })
          onClose()
        }}
        okButtonProps={{
          disabled: !authorId || !title?.length || !yearPublished,
        }}
        title="Create New Book"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <Text type="danger">*</Text> Title
          </Text>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Text>Number of pages</Text>
          <Input
            type="number"
            placeholder="Number of pages (optional)"
            value={numberPages}
            onChange={e => setNumberPages(Number(e.target.value))}
          />
          <Text>
            <Text type="danger">*</Text> Year published
          </Text>
          <Input
            type="number"
            placeholder="Year Published"
            value={yearPublished}
            onChange={e => setYearPublished(Number(e.target.value))}
          />
          <Text>
            <Text type="danger">*</Text> Author
          </Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select an author"
            options={authors.map(author => ({
              label: `${author.firstName} ${author.lastName}`,
              value: author.id,
            }))}
            onChange={setAuthorId}
            value={authorId}
          />
          <Text>Genre</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a genre (optional)"
            options={genres.map(g => ({ label: g.name, value: g.id }))}
            onChange={setGenreId}
            value={genreId}
            allowClear
          />
          <Text>Book type</Text>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a book type (optional)"
            options={bookTypes.map(t => ({ label: t.name, value: t.id }))}
            onChange={setBookTypeId}
            value={bookTypeId}
            allowClear
          />
          <Text>Cover image</Text>
          <ImageInput onImageChange={newImage => setCoverImage(newImage)} />
        </Space>
      </Modal>
    </>
  )
}
