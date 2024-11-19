import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, message, Tooltip } from 'antd';
import './ManageContacts.scss';

function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getContacts = async () => {
    const response = await fetch(`http://localhost:3002/contacts`);
    const data = await response.json();
    setContacts(data.reverse());
  };

  const patchContact = async (updatedContact) => {
    const response = await fetch(`http://localhost:3002/contacts/${updatedContact.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedContact),
    })
    return await response.json();
  }

  useEffect(() => {
    getContacts();
  }, []);

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setIsModalVisible(true);

    if (!contact.isRead) {
      const updatedContacts = contact;
      updatedContacts.isRead = true;
      await patchContact(updatedContacts);
      message.success(`Liên hệ của ${contact.fullName} đã được đánh dấu là đã đọc`);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedContact(null);
  };

  const columns = [
    {
      title: 'STT',
      key: 'STT',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'isRead',
      align: 'center',
      render: (_, record) => (
        record.isRead ? <Tag color="green">Đã đọc</Tag> : <Tag color="red">Chưa đọc</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewContact(record)}>
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="manage-contacts" style={{ width: '90%', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Quản lý liên hệ</h1>
      <Table dataSource={contacts} columns={columns} rowKey="id" />

      {/* Modal hiển thị chi tiết liên hệ */}
      <Modal
        title="Chi tiết liên hệ"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
      >
        {selectedContact && (
          <div>
            <p><strong>Họ và tên:</strong> {selectedContact.fullName}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Số điện thoại:</strong> {selectedContact.phone}</p>
            <p><strong>Nội dung:</strong> {selectedContact.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ManageContacts;
