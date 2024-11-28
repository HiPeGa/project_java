import { Button, Layout } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './LayoutDefault.scss';
import Profile from '../../pages/Profile';
import { useSelector } from 'react-redux';


const { Header, Footer, Content } = Layout;
function LayoutDefault() {
  const navigate = useNavigate();
  const isLogin = useSelector(state => state.loginReducer);
  const token = sessionStorage.getItem('token');

  const handleToPageCarts = () => {
    if(isLogin || token){
      navigate('/carts');
    }
    else{
      navigate('/login');
    }
  }

  return (
    <Layout>
      <Header className='header'>
        <div className='header__logo animate__animated animate__lightSpeedInRight'>
          <NavLink to='/'>Logo</NavLink>
        </div>
        <div className='header__menu animate__animated animate__fadeInDown'>
          <NavLink to='/'>Trang chủ</NavLink>
          <NavLink to='/introduce'>Giới thiệu</NavLink>
          <NavLink to='/contact'>Liên hệ</NavLink>
        </div>
        <div className='header__action animate__animated animate__fadeInRight'>
          <div className='header__cart'>
          <Button onClick={handleToPageCarts}><ShoppingCartOutlined /></Button>
          </div>
          <div className='header__profile'><Profile /></div>
        </div>
      </Header>
      <Content style={{minHeight: "90vh"}}>
        <Outlet/>
      </Content>
      <Footer style={{textAlign: "center", background: '#001529', color: 'white'}}>Copyright</Footer>
    </Layout>
  )
}
export default LayoutDefault;