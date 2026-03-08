import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Typography } from 'antd'
import { useState } from 'react'
import { ImageInput } from '../../components/ImageInput'
import type { CreateClientModel } from '../ClientModel'

interface CreateClientModalProps {
  onCreate: (client: CreateClientModel) => void
}

export function CreateClientModal({ onCreate }: CreateClientModalProps) {
  const { Text } = Typography
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)

  const onClose = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setImage(undefined)
    setIsOpen(false)
  }

  const handleCreate = () => {
    onCreate({
      firstName,
      lastName,
      email: email || undefined,
      image,
    })
    onClose()
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
          Create Client
        </Button>
      </div>
      <Modal
        open={isOpen}
        onCancel={onClose}
        onOk={handleCreate}
        okButtonProps={{
          disabled: !firstName?.length || !lastName?.length,
        }}
        title="Create New Client"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            <Text type="danger">*</Text> First name
          </Text>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <Text>
            <Text type="danger">*</Text> Last name
          </Text>
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
          <Text>Email</Text>
          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Space>
        <Text>Profile picture</Text>
        <ImageInput onImageChange={newImage => setImage(newImage)} />
      </Modal>
    </>
  )
}
