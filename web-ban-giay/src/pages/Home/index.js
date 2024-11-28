import { Button, Carousel, Col, Form, Image, Input, Modal, notification, Row, Select, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import './Home.scss';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import image1 from '../../images/image1.jpg';
import image2 from '../../images/image2.webp';
import image3 from '../../images/image3.webp';
import image4 from '../../images/image4.webp';

function Home() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [stocks, setStocks] = useState(productDetail?.size[0].stock);
  const [indexSize, setIndexSize] = useState(0);
  const [user, setUser] = useState({});
  const [carts, setCarts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);


  const isLogin = useSelector(state => state.loginReducer);
  const token = sessionStorage.getItem('token');
  const id = sessionStorage.getItem('id');

  const navigate = useNavigate();

  const showModal = (productDetail) => {
    setProductDetail(productDetail);
    setIsModalOpen(true);
    setStocks(productDetail?.size[0].stock);
    setIndexSize(0);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getBrands = async () => {
    const response = await fetch('/brand/get/all');
    const data = await response.json();
    setBrands(data.data);
    return data.data;
  }

  const getCategories = async () => {
    const response = await fetch('/category/get/all');
    const data = await response.json();
    setCategories(data.data);
    return data.data;
  }

  const getProducts = async () => {
    const response = await fetch('/product/user/all');
    const data = await response.json();
    setProducts(data.data);
    return data.data;
  }

  const getUser = async () => {
    const response = await fetch(`/users/user/me?id=${id}`);
    const data = await response.json();
    setUser(data.data);
    return data.data;
  }

  // const getCarts = async () => {
  //   const response = await fetch(`http://localhost:3002/carts`);
  //   const tmp = await response.json();
  //   setCarts(tmp);
  //   return tmp;
  // }

  // const getProductInCarts = async (userId, productId, productSize) => {
  //   const response = await fetch(`http://localhost:3002/carts?userId=${userId}&productId=${productId}&productSize=${productSize}`)
  //   const tmp = await response.json();
  //   return tmp[0];
  // }

  const postCarts = async (productIsChoose) => {
    const response = await fetch(`/cart/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        productId: productIsChoose.id,
        size: productIsChoose.size,
      })
    })
    return await response.json();
  }

  // const patchProductInCart = async (productInCart) => {
  //   const response = await fetch(`http://localhost:3002/carts/${productInCart.id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(productInCart)
  //   })
  //   return await response.json();
  // }

  // const patchProducts = async (newProduct) => {
  //   const response = await fetch(`http://localhost:3002/products/${newProduct.id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(newProduct)
  //   })
  //   return await response.json();
  // }

  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts); // Gán vào danh sách gốc
      setFilteredProducts(allProducts); // Hiển thị toàn bộ ban đầu
    };
    fetchData();
    getBrands();
    getCategories();
    getProducts();
    if(isLogin || token){
      getUser();
    }
  }, [isLogin]);

  let optionBrands = brands.map(item => {
    return {
      value: item.name,
      label: item.name,
    }
  })
  optionBrands = [{value: "Tất cả", name: "Tất cả"}, ...optionBrands];

  let optionCategories = categories.map(item => {
    return {
      value: item.name,
      label: item.name,
    }
  })
  optionCategories = [{value: "Tất cả", name: "Tất cả"}, ...optionCategories];

  let optionsPrices = [
    {
      value: 1,
      label: "Dưới 1 triệu"
    },
    {
      value: 2,
      label: "Từ 1 - 5 triệu"
    },
    {
      value: 3,
      label: "Từ 5 - 10 triệu"
    },
    {
      value: 4,
      label: "Trên 10 triệu"
    }
  ]
  optionsPrices = [{value: "Tất cả", name: "Tất cả"}, ...optionsPrices];

  const handleChangeSize = (e) => {
    setIndexSize(e);
    setStocks(productDetail?.size[e].stock);
  }

  const handleAddToCart = async () => {
    const productIsChoose = {...productDetail, size: productDetail.size[indexSize].size} // POST carts
    // const newProduct = products.filter(item => {  // PATCH products
    //   return item.id === productDetail.id;
    // })
    // newProduct[0].size[indexSize].stock -= 1;


    if(!(isLogin || token)){
      navigate('/login');
    }
    else{
      // let check = false; // Check xem đã tồn tại sản phẩm trong Carts hay chưa
      // carts.forEach(item => {
      //   if(item.userId === user.id && item.productId === productIsChoose.id && item.productSize === productIsChoose.size){
      //     check = true;
      //   }
      // })

      // if(check){
      //   const productInCart = await getProductInCarts(user.id, productIsChoose.id, productIsChoose.size);
      //   productInCart.productQuantity += 1;
      //   console.log(productInCart);
      //   const reponsePatchCart = await patchProductInCart(productInCart);
      //   if(reponsePatchCart){
      //     openNotification('Thành công', 'Đã thêm vào giỏ hàng', 'success');
      //     setIsModalOpen(false);
      //   }
      //   else{
      //     openNotification('Thất bại', 'Thêm sản phẩm thất bại', 'error')
      //   }
      // }
      // else{
      //   const responsePostCart = await postCarts(productIsChoose);
      //   if(responsePostCart){
      //     openNotification('Thành công', 'Đã thêm vào giỏ hàng', 'success')
      //     setIsModalOpen(false);
      //   }
      //   else{
      //     openNotification('Thất bại', 'Thêm sản phẩm thất bại', 'error')
      //   }
      // }
      // await patchProducts(newProduct[0]);
      const responsePostCart = await postCarts(productIsChoose);
        if(responsePostCart){
          openNotification('Thành công', 'Đã thêm vào giỏ hàng', 'success')
          setIsModalOpen(false);
        }
        else{
          openNotification('Thất bại', 'Thêm sản phẩm thất bại', 'error')
        }
    }
  }

  const handleFilter = async (values) => {
    const { brand, category, price } = values;

    const data = await getProducts();
  
    let filtered = [...data];
  
    // Lọc theo thương hiệu
    if (brand && brand !== "Tất cả") {
      filtered = filtered.filter((item) => item.brand === brand);
    }
  
    // Lọc theo loại giày
    if (category && category !== "Tất cả") {
      filtered = filtered.filter((item) => item.category === category);
    }
  
    // Lọc theo giá tiền
    if (price && price !== "Tất cả") {
      filtered = filtered.filter((item) => {
        if (price === 1) return item.price < 1000000; // Dưới 1 triệu
        if (price === 2) return item.price >= 1000000 && item.price <= 5000000; // 1-5 triệu
        if (price === 3) return item.price > 5000000 && item.price <= 10000000; // 5-10 triệu
        if (price === 4) return item.price > 10000000; // Trên 10 triệu
        return true;
      });
    }
  
    setProducts(filtered);
  };

  const contentStyle = {
    marginTop: "50",
    height: 'auto',
    width: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const handleSearch = async (e) => {
    if(e.length === 0) {
      const data = await getProducts();
      setProducts(data);
    }
    else {
      const data = await getProducts();

      const newProducts = data.filter((item) => {
        return item.name.toLowerCase().includes(e.name.toLowerCase());
      });
      console.log(newProducts)
      setProducts(newProducts);
    }
  }

  return (
    <>
      {contextHolder}
      <div className="home">
        <Carousel autoplay autoplaySpeed={3000}>
          <div>
            <Image preview={false} style={contentStyle} src={image1} />
          </div>
          <div>
            <Image preview={false} style={contentStyle} src={image2} />
          </div>
          <div>
            <Image preview={false} style={contentStyle} src={image3} />
          </div>
          <div>
            <Image preview={false} style={contentStyle} src={image4} />
          </div>
        </Carousel>
        <div className="container">
          <div className="home__wrap">
            <h2 className="home__title animate__animated animate__fadeInDown" style={{marginTop: "0px"}}>Sản phẩm</h2>
            <Form onFinish={handleSearch}>
              <Form.Item name='name'>
                <Input className="area-focus" placeholder="Tên sản phẩm" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Tìm kiếm</Button>
              </Form.Item>
            </Form>
            <Form onFinish={handleFilter}>
              <Form.Item name='brand'>
                <Select placeholder='Thương hiệu' options={optionBrands} />
              </Form.Item>
              <Form.Item name='category'>
                <Select placeholder='Loại giày' options={optionCategories} />
              </Form.Item>
              <Form.Item name='price'>
                <Select placeholder='Giá tiền' options={optionsPrices} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" style={{fontSize: "18px", fontWeight: "bold"}}>Lọc</Button>
              </Form.Item>
            </Form>
            <div className="product__list">
              <Row gutter={[20, 20]}>
                {products.map((item) => (
                  <Col xl={6} onClick={() => showModal(item)} key={item.id}>
                    <div className="product__item">
                      <div className="product__image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="product__info">
                        <h3 className="product__name">{item.name}</h3>
                        <p className="product__description">{item.description}</p>
                        <p className="product__price">Giá: {item.price} VNĐ</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </div>
        <Modal title="Chi tiết sản phẩm" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} style={{top: "5px"}} width={1000}>
          <Row gutter={[20, 20]} className="product__detail">
            <Col xl={12} className="product__detail-image">
              <img src={productDetail?.image} alt={productDetail?.name} />
            </Col>
            <Col xl={12} className="product__detail-info">
              <h3 className="product__detail-name">Tên sản phẩm: {productDetail?.name}</h3>
              <p className="product__detail-description"><strong>Mô tả:</strong> {productDetail?.description}</p>
              <p className="product__detail-brand"><strong>Thương hiệu:</strong> {productDetail?.brand}</p>
              <p className="product__detail-category"><strong>Loại giày:</strong> {productDetail?.category}</p>
              <Space direction="horizontal">
                <label htmlFor='chooseSize'><strong style={{color: "#fff", fontSize: "16px"}}>Chọn size: </strong></label>
                <Select id="chooseSize" onChange={(e) => {handleChangeSize(e)}} value={productDetail?.size[indexSize].size} className="product__detail-size">
                  {
                    productDetail?.size.map((item, index) => {
                      return (
                        <Select.Option value={index} key={index}>{item.size}</Select.Option>
                      )
                    })
                  }
                </Select>
              </Space>
              <p className="product__detail-stock"><strong>Số lượng:</strong> {stocks}</p>
              <p className="product__detail-status"><strong>Trạng thái:</strong> 
                {
                  stocks === 0 ? <Tag style={{marginLeft: "10px"}} color="red">Hết hàng</Tag> : <Tag   style={{marginLeft: "10px"}} color="green">Còn hàng</Tag>
                }
              </p>
              <p className="product__detail-price">Giá: {productDetail?.price} VNĐ</p>
            </Col>
            <Col xl={24} style={{textAlign: "center"}}>
              <Button onClick={handleAddToCart} disabled={stocks === 0 ? true : false}>Thêm vào giỏ hàng</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    </>
  )
}
export default Home;