import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Typography } from 'antd'
import { useState } from 'react'
import { ImageInput } from '../../components/ImageInput'
import type { CreateAuthorModel } from '../AuthorModel'

interface CreateAuthorModalProps {
  onCreate: (author: CreateAuthorModel) => void
}

export function CreateAuthorModal({ onCreate }: CreateAuthorModalProps) {
  const { Text } = Typography
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)

  const onClose = () => {
    setFirstName('')
    setLastName('')
    setImage(undefined)
    setIsOpen(false)
  }

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setIsOpen(true)}
          style={{ minWidth: 220 }}
        >
          Create Author
        </Button>
      </div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={() => {
          onCreate({ firstName, lastName, image })
          onClose()
        }}
        okButtonProps={{ disabled: !firstName?.length || !lastName?.length }}
        title="Create New Author"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <Text type="danger">*</Text> First name
          </Text>
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <Text>
            <Text type="danger">*</Text> Last name
          </Text>
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <Text>Author image</Text>
          <ImageInput onImageChange={newImage => setImage(newImage)} />
        </Space>
      </Modal>
    </>
  )
}
