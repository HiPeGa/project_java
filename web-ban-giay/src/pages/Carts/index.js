import React, { useEffect, useState } from 'react';
import { Table, Image, Typography, Modal, notification, Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './Cart.scss';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
  const [productsInCart, setProductsInCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  const userId = sessionStorage.getItem('id');

  const getProductsInCart = async () => {
    const response = await fetch(`http://localhost:3002/carts?userId=${userId}`);
    const tmp = await response.json();
    setProductsInCart(tmp.reverse());
    return tmp;
  }

  const getProducts = async () => {
    const response = await fetch(`http://localhost:3002/products`);
    const tmp = await response.json();
    setProducts(tmp);
    return tmp;
  }

  const getUser = async () => {
    const response = await fetch(`http://localhost:3002/users/${userId}`);
    const tmp = await response.json();
    setUser(tmp);
    return tmp;
  }

  const getProductIsDeleted = async (id) => {
    const response = await fetch(`http://localhost:3002/products/${id}`);
    const tmp = await response.json();
    return tmp;
  }

  const patchProductIsDeleted = async (productIsDeleted) => {
    const response = await fetch(`http://localhost:3002/products/${productIsDeleted.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productIsDeleted),
    });
    return await response.json();
  }

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{margin: "0", padding: "0"}}>{message}</h3>,
      description: description,
      duration: 1,
    });
  };

  useEffect(() => {
    getProductsInCart();
    getProducts();
    getUser();
  }, []);

  const deleteProductsInCart = async (id) => {
    const response = await fetch(`http://localhost:3002/carts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  const postProductsOnHistory = async (product) => {
    const now = new Date();
  // Lấy ra các thông tin cần thiết
    const dayOfWeek = now.toLocaleString('vi-VN', { weekday: 'long' }); // Thứ
    const day = now.getDate(); // Ngày
    const month = now.getMonth() + 1; // Tháng (getMonth() trả về 0-11, nên cần +1)
    const year = now.getFullYear(); // Năm
    const hours = now.getHours(); // Giờ
    const minutes = now.getMinutes(); // Phút
    // Định dạng thành chuỗi
    console.log(dayOfWeek);
    const formattedDateTime = dayOfWeek === 'Chủ Nhật' ? `${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}` : `Thứ ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}`;

    const response = await fetch(`http://localhost:3002/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...product, status: "Đã thanh toán", time: formattedDateTime}),
    });
    return await response.json();
  }

  // Hàm để xóa sản phẩm
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        const responseDeleteProductsInCart = await deleteProductsInCart(id);
        if(responseDeleteProductsInCart){
          openNotification('Thành công', 'Xóa sản phẩm thành công', 'success');
          // Thêm sản phẩm đã xóa về lại products

          // const responseProductIsDeleted = await getProductIsDeleted(responseDeleteProductsInCart.productId);
          // responseProductIsDeleted.size.forEach((item) => {
          //   if(item.size === responseDeleteProductsInCart.productSize){
          //     item.stock += responseDeleteProductsInCart.productQuantity;
          //   }
          // })
          // await patchProductIsDeleted(responseProductIsDeleted);
        }
        else{
          openNotification('Thất bại', 'Xóa sản phẩm thất bại', 'error');
        }
        setTimeout(() => {
          getProductsInCart();
        }, 1000)
      }
    });
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 60,
      align: 'center',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (text) => <Image src={text} width={80} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Mô tả',
      dataIndex: 'productDescription',
      key: 'productDescription'
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'productBrand',
      key: 'productBrand'
    },
    {
      title: 'Loại',
      dataIndex: 'productCategory',
      key: 'productCategory'
    },
    {
      title: 'Size',
      dataIndex: 'productSize',
      key: 'productSize'
    },
    {
      title: 'Giá',
      dataIndex: 'productPrice',
      key: 'productPrice',
      render: (price) => `${price}`
    },
    {
      title: 'Số lượng',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
    },
    {
      title: 'Tổng tiền',
      key: 'totalPrice',
      render: (_, record) => (
        <Typography.Text strong>
          {record.productPrice * record.productQuantity}
        </Typography.Text>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const product = products.filter(item => {
          return item.id === record.productId;
        })

        const quantity = product[0]?.size.filter(item => {
          return item.size === record.productSize;
        })

        return (
          <>
            {
              record.productQuantity <= quantity[0]?.stock && <Tag color="#87d068">Còn hàng</Tag>
            }
            {
              record.productQuantity > quantity[0]?.stock && quantity[0]?.stock === 0 &&  <Tag color="#f50">Hết hàng</Tag>
            }
            {
              record.productQuantity > quantity[0]?.stock && quantity[0]?.stock !== 0 && <Tag color="#F6EC00">Không đủ số lượng</Tag>
            }
          </>
        )
      }
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleDelete(record.id)}
          style={{ color: 'red', cursor: 'pointer', fontSize: '18px' }}
        />
      ),
      align: 'center',
      width: 80,
    }
  ];

  const total = productsInCart.reduce((sum, itemProductInCart) => {
    const product = products.filter(item => {
      return item.id === itemProductInCart.productId;
    })

    const quantity = product[0]?.size.filter(item => {
      return item.size === itemProductInCart.productSize;
    })

    if(quantity[0]?.stock >= itemProductInCart.productQuantity){
      return sum + itemProductInCart.productPrice*itemProductInCart.productQuantity;
    }
    return sum;
  }, 0)

  const handleContinueBuyProducts = () => {
    navigate('/');
  }

  const handleClearProductsInCart = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        for (const item of productsInCart) {
          try {
            // Xóa sản phẩm khỏi giỏ hàng
            const responseDeleteProductsInCart = await deleteProductsInCart(item.id);
            // const responseProductIsDeleted = await getProductIsDeleted(responseDeleteProductsInCart.productId);
            // responseProductIsDeleted.size.forEach((item) => {
            //   if(item.size === responseDeleteProductsInCart.productSize){
            //     item.stock += responseDeleteProductsInCart.productQuantity;
            //   }
            // })
            // await patchProductIsDeleted(responseProductIsDeleted);
          } catch (error) {
            openNotification('Thất bại', 'Đã xảy ra lỗi khi xóa sản phẩm', 'error');
          }
        }
        openNotification('Thành công', 'Đã xóa toàn bộ sản phẩm', 'success');
  
        // Cập nhật lại giỏ hàng sau khi hoàn tất xóa
        setTimeout(() => {
          getProductsInCart();
        }, 1000);
      },
    });
  };

  const handlePayProductsInCart = () => {
    if(user.address === null){
      openNotification('Thất bại', 'Vui lòng cập nhật địa chỉ của bạn', 'error');
    }
    else{
      Modal.confirm({
        title: 'Xác nhận thanh toán',
        content: 'Bạn có chắc chắn muốn thanh toán tất cả sản phẩm trong giỏ hàng không?',
        okText: 'Thanh toán',
        cancelText: 'Hủy',
        onOk: async () => {
          let flag = false;
          for (const itemProductInCart of productsInCart) {

            const product = products.filter(item => {
              return item.id === itemProductInCart.productId;
            })
        
            const quantity = product[0]?.size.filter(item => {
              return item.size === itemProductInCart.productSize;
            })
  
            if(quantity[0]?.stock >= itemProductInCart.productQuantity){
              try {
                // Xóa sản phẩm khỏi giỏ hàng
                const responseDeleteProductsInCart = await deleteProductsInCart(itemProductInCart.id);
                await postProductsOnHistory(responseDeleteProductsInCart);
    
                // Sản phẩm đã mua -> Trừ số lượng ở trang Home
    
                const responseProductIsDeleted = await getProductIsDeleted(responseDeleteProductsInCart.productId);
                responseProductIsDeleted.size.forEach((item) => {
                  if(item.size === responseDeleteProductsInCart.productSize){
                    item.stock -= responseDeleteProductsInCart.productQuantity;
                  }
                })
                await patchProductIsDeleted(responseProductIsDeleted);
                flag = true;
                
              } catch (error) {
                openNotification('Thất bại', 'Thanh toán thất bại', 'error');
              }
            }
  
          }
          if(flag){
            openNotification('Thành công', 'Đã thanh toán toàn bộ sản phẩm', 'success');
          }
          else{
            openNotification('Thất bại', 'Sản phẩm đã hết hoặc không đủ số lượng', 'error');
          }
    
          // Cập nhật lại giỏ hàng sau khi hoàn tất xóa
          setTimeout(() => {
            getProductsInCart();
          }, 1000);
        },
      });
    }
  }
  

  return (
    <>
      { contextHolder }
      <div className="custom-table-container">
        <h1 style={{marginTop: "0px"}}>Giỏ hàng</h1>
        <Table
          columns={columns}
          dataSource={productsInCart}
          rowKey="id"
          className="custom-table"
          pagination={false}
        />
        <div className='total'>Tổng tiền: {total}</div>
        <div className='action'>
          <Button className='clearProductsInCart' onClick={handleClearProductsInCart}>Xóa toàn bộ giỏ hàng</Button>
          <Button className='continueBuyProducts' onClick={handleContinueBuyProducts}>Tiếp tục mua hàng</Button>
          <Button className='payProductsInCart' onClick={handlePayProductsInCart}>Thanh toán</Button>
        </div>
      </div>
    </>
  );
};

export default ProductTable;
