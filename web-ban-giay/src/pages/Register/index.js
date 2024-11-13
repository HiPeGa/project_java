import { Button, Form, Input, notification } from "antd";
import './Register.scss';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Register() {

  const [user, setUser] = useState();

  const getUser = async () => {
    const response = await fetch('http://localhost:3002/users');
    const user_tmp = await response.json();
    setUser(user_tmp);
    return user_tmp;
  }

  useEffect(() => {
    getUser();
  }, [])

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const navigate = useNavigate();

  const registerAccount = async (fullName, email, password, token, id, address, phone) => {
    const response = await fetch('http://localhost:3002/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password, role: "customer", token, id, address, phone})
    })
    return await response.json();
  }

  const generateRandomString = (length = 20) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
  }

  const handleSubmit = async (e) => {
    const token = generateRandomString();
    const response = await fetch(`http://localhost:3002/users?email=${e.email}`);
    const checkExitsEmail = await response.json();

    if(checkExitsEmail.length > 0){
      openNotification('Thất bại', 'Email đã tồn tại', 'error');
    }
    else{
      const response = await registerAccount(e.fullName, e.email, e.password, token , user.length+1+"", null, null); 
      if(response){
        openNotification('Thành công', 'Đăng ký thành công', 'success')
        setTimeout(() => {
          navigate('/login');
        }, 500)
      }
      else{
        openNotification('Thất bại', 'Đăng ký thất bại', 'error');
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className="register">
        <h2>Register Account</h2>
        <Form onFinish={handleSubmit}>
          <Form.Item name='fullName' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style={{color: "white"}}>Register</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default Register;