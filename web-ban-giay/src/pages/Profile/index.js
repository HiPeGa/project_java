import { UserOutlined  } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, message, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAccount } from '../../actions/login';
import { useEffect, useState } from 'react';
import './Profile.scss';
function Profile() {

  const isLogin = useSelector(state => state.loginReducer);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const id = sessionStorage.getItem("id");
  // Trạng thái điều khiển hiển thị Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openChangepass, setOpenChangePass] = useState(false);
  // Trạng thái điều khiển chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const patchPassword = async (newPassword) => {
    const response = await fetch(`http://localhost:3002/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword
      })
    })
    return await response.json();
  }

  const handleLogin = () => {
    navigate('/login');
  }
  const handleRegister  = () => {
    navigate('/register');
  }
  const handleLogOut = () => {
    sessionStorage.removeItem("token");
    navigate('/');
    dispatch(logoutAccount());
    message.success('Đăng xuất thành công!');
  }
  const handleHistory = () => {
    navigate('/history');
  }

  const handleChangePass = () => {
    setOpenChangePass(true)
  }

  const handleOk = (e) => {
    console.log(e);
  }

  const handleSubmitPass = async (e) => {
    if(e.newPassword !== e.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
    }
    else if(user[0].password !== e.oldPassword) {
      message.error('Mật khẩu không chính xác')
    }
    else {
      const response = await patchPassword(e.newPassword);
      console.log(response);
      if(response) {
        message.success('Đổi mật khẩu thành công!');
        setOpenChangePass(false);
        form.resetFields();
      }
      else {
        message.error('Đổi mật khẩu thất bại!');
      }
    }
  }

  const getUser = async (token) => {
    const response = await fetch(`http://localhost:3002/users?token=${token}`);
    const tmp = await response.json();
    setUser(tmp);
    return tmp;
  }

  const patchUser = async (user) => {
    const response = await fetch(`http://localhost:3002/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    return await response.json();
  }

  useEffect(() => {
    if(isLogin || token){
      getUser(token);
    }
  }, [isLogin]);


  const items = isLogin || token ? [
    {
      key: '1',
      label: <div className='profile__name'>{user[0]?.fullName}</div>
    },
    {
      key: '2',
      label: <Button onClick={() => {showModal()}}>Thông tin tài khoản</Button>
    },
    {
      key: '3',
      label: <Button onClick={handleHistory}>Lịch sử mua hàng</Button>
    },
    {
      key: '4',
      label: <Button onClick={handleChangePass}>Đổi mật khẩu</Button>
    },
    {
      key: '5',
      label: <Button onClick={handleLogOut}>Đăng xuất</Button>
    }
  ] : [
    {
      key: '1',
      label: <Button onClick={handleLogin}>Đăng nhập</Button>
    },
    {
      key: '2',
      label: <Button onClick={handleRegister}>Đăng ký</Button>
    }
  ]

  const showModal = () => {
    setIsModalVisible(true);
  };

  // Đóng Modal và tắt chế độ chỉnh sửa
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setOpenChangePass(false);
  };

  // Chuyển chế độ sang chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Xử lý lưu thông tin
  const handleSubmit = async (e) => {
    // Gửi dữ liệu đến API hoặc xử lý lưu trữ tại đây
    // Giả sử lưu thành công, hiển thị thông báo
    message.success('Thông tin tài khoản đã được cập nhật!');
    setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi lưu

    const new_user = {...user[0], 
      fullName: e.fullName,
      email: e.email,
      phone: e.phone,
      address: e.address
    }
    sessionStorage.setItem('address', new_user.address)

    const response = await patchUser(new_user);
    setIsModalVisible(false);
  };


  return (
    <div className="profile">
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button><UserOutlined /></Button>
      </Dropdown>
      <Modal
        title="Thông tin tài khoản"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={user[0]} form={form}>
          <Form.Item label="Họ tên" name="fullName">
            <Input
              disabled={!isEditing} // Khóa chỉnh sửa khi không ở chế độ chỉnh sửa
              style={{fontWeight: 'bold'}}
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
            />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input
              disabled={!isEditing}
              style={{fontWeight: 'bold'}}
            />
          </Form.Item>
          <Form.Item>
            {
              isEditing ? (
                <Button key="save" type="primary" htmlType='submit'>
                  Lưu
                </Button>
              ) : (
                <Button key="edit" type="primary" onClick={handleEdit}>
                  Cập nhật thông tin
                </Button>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Đổi mật khẩu"
        visible={openChangepass}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          name="change_password"
          onFinish={handleSubmitPass}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>Đổi mật khẩu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default Profile;