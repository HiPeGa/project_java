import { Button, Form, Input, notification } from "antd";
import './Login.scss';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginAccount } from "../../actions/login";

function LoginAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const checkInfomation = async (email, password) => {
    const response = await fetch(`http://localhost:3002/users?email=${email}&password=${password}`);
    const data = await response.json();
    return data[0];
  }

  const handleSubmit = async (e) => {
    const response = await checkInfomation(e.email, e.password);
    if(response){
      if(response.role === 'admin'){
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('id', response.id);
        sessionStorage.setItem('role', 'admin');
        dispatch(loginAccount());
        openNotification('Thành công', 'Đăng nhập thành công', 'success')
        setTimeout(() => {
          navigate('/admin/manage-shop');
        }, 500)
      }
      else{
        openNotification('Thất bại', 'Bạn không phải Admin', 'error');
      }
    }
    else{
      openNotification('Thất bại', 'Tài khoản hoặc mật khẩu không chính xác', 'error');
    }
  }

  return (
    <>
      {contextHolder}
      <div className="login-admin">
        <h1>Login</h1>
        <p>Bạn chưa có tài khoản? <NavLink to='#'>Đăng ký</NavLink></p>
        <Form onFinish={handleSubmit}>
          <Form.Item name='email' rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]} >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" style={{color: "white"}} type="primary">Login</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
export default LoginAdmin;