import React, { useEffect, useState } from "react";
import {
  Table,
  Image,
  Typography,
  Modal,
  notification,
  Button,
  Tag,
  Row,
  Col,
  Divider,
  Select,
  Card,
  Input,
  Form,
} from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;

const ProductTable = () => {
  const [productsInCart, setProductsInCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý trạng thái modal
  const [selectedProducts, setSelectedProducts] = useState([]); // Quản lý sản phẩm đã chọn
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState(30000);
  const id = sessionStorage.getItem('id');

  const handleSelect = (id, isChecked) => {
    setSelectedRowKeys((prev) =>
      isChecked ? [...prev, id] : prev.filter((key) => key !== id)
    );
  };

  const userId = sessionStorage.getItem("id");

  const getProductsInCart = async () => {
    const response = await fetch(`/cart/get?userId=${userId}`);
    const data = await response.json();
    setProductsInCart(data.data.reverse());
    return data.data;
  };

  const getProducts = async () => {
    const response = await fetch(`/product/user/all`);
    const data = await response.json();
    setProducts(data.data);
    return data.data;
  };

  const getUser = async () => {
    const response = await fetch(`/users/user/me?id=${id}`);
    const data = await response.json();
    setUser(data.data);
    return data.data;
  };

  // const getProductIsDeleted = async (id) => {
  //   const response = await fetch(`http://localhost:3002/products/${id}`);
  //   const tmp = await response.json();
  //   return tmp;
  // };

  // const patchProductIsDeleted = async (productIsDeleted) => {
  //   const response = await fetch(
  //     `http://localhost:3002/products/${productIsDeleted.id}`,
  //     {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(productIsDeleted),
  //     }
  //   );
  //   return await response.json();
  // };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message, description, type) => {
    api[type]({
      message: <h3 style={{ margin: "0", padding: "0" }}>{message}</h3>,
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
    const response = await fetch(`/cart/delete/item?cartItemId=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  };

  // const postProductsOnHistory = async (product, values) => {
  //   const now = new Date();
  //   // Lấy ra các thông tin cần thiết
  //   const dayOfWeek = now.toLocaleString("vi-VN", { weekday: "long" }); // Thứ
  //   const day = now.getDate(); // Ngày
  //   const month = now.getMonth() + 1; // Tháng (getMonth() trả về 0-11, nên cần +1)
  //   const year = now.getFullYear(); // Năm
  //   const hours = now.getHours(); // Giờ
  //   const minutes = now.getMinutes(); // Phút
  //   // Định dạng thành chuỗi
  //   console.log(dayOfWeek);
  //   const formattedDateTime =
  //     dayOfWeek === "Chủ Nhật"
  //       ? `${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}`
  //       : `Thứ ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}, ${hours}:${minutes}`;

  //   const response = await fetch(`http://localhost:3002/history`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       ...product, ...values,
  //       status: "Chờ xử lý",
  //       time: formattedDateTime,
  //     }),
  //   });
  //   return await response.json();
  // };

  // Hàm để xóa sản phẩm
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        const responseDeleteProductsInCart = await deleteProductsInCart(id);
        console.log(responseDeleteProductsInCart);
        if (responseDeleteProductsInCart) {
          openNotification("Thành công", "Xóa sản phẩm thành công", "success");
          // Thêm sản phẩm đã xóa về lại products

          // const responseProductIsDeleted = await getProductIsDeleted(responseDeleteProductsInCart.productId);
          // responseProductIsDeleted.size.forEach((item) => {
          //   if(item.size === responseDeleteProductsInCart.productSize){
          //     item.stock += responseDeleteProductsInCart.productQuantity;
          //   }
          // })
          // await patchProductIsDeleted(responseProductIsDeleted);
        } else {
          openNotification("Thất bại", "Xóa sản phẩm thất bại", "error");
        }
        setTimeout(() => {
          getProductsInCart();
        }, 1000);
      },
    });
  };

  const handleShippingChange = (value) => {
    console.log(value);
    if (value === "Giao tận nơi") {
      setShippingFee(30000); // Phí giao tận nơi là 30,000 đ
    } else {
      setShippingFee(0); // Phí tự đến lấy là 0 đ
    }
  };

  const clearProductsInCart = async () => {
    const response = await fetch(`/cart/delete/all?userId=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  }

  // Cột cho bảng
  const columns = [
    {
      title: "Chọn",
      key: "select",
      render: (_, record) => {
        const product = products.find((item) => item.id === record.productId);
        const quantity = product?.size.find(
          (item) => item.size === record.productSize
        );
        const isOutOfStock =
          record.productQuantity > quantity?.stock && quantity?.stock === 0;
        const isNotEnoughStock =
          record.productQuantity > quantity?.stock && quantity?.stock > 0;

        return (
          <input
            disabled={isOutOfStock || isNotEnoughStock}
            type="checkbox"
            checked={selectedRowKeys.includes(record.cartItemId)}
            onChange={(e) => handleSelect(record.cartItemId, e.target.checked)}
          />
        );
      },
      width: 60,
      align: "center",
    },
    {
      title: "Hình ảnh",
      dataIndex: "productImage",
      key: "productImage",
      render: (text) => <Image src={text} width={80} />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Mô tả",
      dataIndex: "productDescription",
      key: "productDescription",
    },
    {
      title: "Thương hiệu",
      dataIndex: "productBrand",
      key: "productBrand",
    },
    {
      title: "Loại",
      dataIndex: "productCategory",
      key: "productCategory",
    },
    {
      title: "Size",
      dataIndex: "productSize",
      key: "productSize",
    },
    {
      title: "Giá",
      dataIndex: "productPrice",
      key: "productPrice",
      render: (price) => `${price}`,
    },
    {
      title: "Số lượng",
      dataIndex: "productQuantity",
      key: "productQuantity",
    },
    {
      title: "Tổng tiền",
      key: "totalPrice",
      render: (_, record) => (
        <Typography.Text strong>
          {record.productPrice * record.productQuantity}
        </Typography.Text>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const product = products.find((item) => {
          return item.id === record.productId;
        });

        const quantity = product?.size.find((item) => {
          return item.size === record.productSize;
        });

        return (
          <>
            {record.productQuantity <= quantity?.stock && (
              <Tag color="#87d068">Còn hàng</Tag>
            )}
            {record.productQuantity > quantity?.stock &&
              quantity?.stock === 0 && <Tag color="#f50">Hết hàng</Tag>}
            {record.productQuantity > quantity?.stock &&
              quantity?.stock !== 0 && (
                <Tag color="#F6EC00">Không đủ số lượng</Tag>
              )}
          </>
        );
      },
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleDelete(record.cartItemId)}
          style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
        />
      ),
      align: "center",
      width: 80,
    },
  ];

  const total = productsInCart.reduce((sum, itemProductInCart) => {
    const product = products.find((item) => {
      return item.id === itemProductInCart.productId;
    });

    const quantity = product?.size.find((item) => {
      return item.size === itemProductInCart.productSize;
    });

    if (quantity?.stock >= itemProductInCart.productQuantity) {
      return (
        sum + itemProductInCart.productPrice * itemProductInCart.productQuantity
      );
    }
    return sum;
  }, 0);

  const handleContinueBuyProducts = () => {
    navigate("/");
  };

  const handleClearProductsInCart = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tất cả sản phẩm không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        // for (const item of productsInCart) {
        //   try {
        //     // Xóa sản phẩm khỏi giỏ hàng
        //     const responseDeleteProductsInCart = await deleteProductsInCart(
        //       item.id
        //     );
        //     // const responseProductIsDeleted = await getProductIsDeleted(responseDeleteProductsInCart.productId);
        //     // responseProductIsDeleted.size.forEach((item) => {
        //     //   if(item.size === responseDeleteProductsInCart.productSize){
        //     //     item.stock += responseDeleteProductsInCart.productQuantity;
        //     //   }
        //     // })
        //     // await patchProductIsDeleted(responseProductIsDeleted);
        //   } catch (error) {
        //     openNotification(
        //       "Thất bại",
        //       "Đã xảy ra lỗi khi xóa sản phẩm",
        //       "error"
        //     );
        //   }
        // }
        const responseDeleteProductsInCart = await clearProductsInCart();
        if(responseDeleteProductsInCart.description === 'Success') {
          openNotification("Thành công", "Đã xóa toàn bộ sản phẩm", "success");
        }
        else if(responseDeleteProductsInCart.description === 'Cart is empty') {
          openNotification("Thất bại", "Giỏ hàng đang trống", "error");
        }

        // Cập nhật lại giỏ hàng sau khi hoàn tất xóa
        setTimeout(() => {
          getProductsInCart();
        }, 1000);
      },
    });
  };

  const handlePayProductsInCart = () => {
    const selected = productsInCart.filter((product) =>
      selectedRowKeys.includes(product.cartItemId)
    );

    if (selected.length === 0) {
      openNotification(
        "Thất bại",
        "Vui lòng chọn ít nhất một sản phẩm để đặt hàng",
        "error"
      );
      return;
    } else {
      setSelectedProducts(selected); // Cập nhật danh sách sản phẩm đã chọn
      setIsModalOpen(true); // Mở modal
    }
  };

  // const handleConfirmOrder = async () => {
  //   let flag = false;

  //   for (const itemProductInCart of selectedProducts) {
  //     const product = products.find(
  //       (item) => item.id === itemProductInCart.productId
  //     );

  //     const quantity = product?.size.find(
  //       (item) => item.size === itemProductInCart.productSize
  //     );

  //     if (quantity?.stock >= itemProductInCart.productQuantity) {
  //       try {
  //         // Xóa sản phẩm khỏi giỏ hàng
  //         const responseDeleteProductsInCart = await deleteProductsInCart(
  //           itemProductInCart.id
  //         );
  //         await postProductsOnHistory(responseDeleteProductsInCart);

  //         // Trừ số lượng sản phẩm trong trang Home
  //         const responseProductIsDeleted = await getProductIsDeleted(
  //           responseDeleteProductsInCart.productId
  //         );
  //         responseProductIsDeleted.size.forEach((item) => {
  //           if (item.size === responseDeleteProductsInCart.productSize) {
  //             item.stock -= responseDeleteProductsInCart.productQuantity;
  //           }
  //         });
  //         await patchProductIsDeleted(responseProductIsDeleted);
  //         flag = true;
  //       } catch (error) {
  //         openNotification("Thất bại", "Đặt hàng thất bại", "error");
  //       }
  //     }
  //   }

  //   if (flag) {
  //     openNotification(
  //       "Thành công",
  //       "Đã đặt hàng các sản phẩm đã chọn",
  //       "success"
  //     );
  //   } else {
  //     openNotification(
  //       "Thất bại",
  //       "Sản phẩm đã hết hoặc không đủ số lượng",
  //       "error"
  //     );
  //   }

  //   setIsModalOpen(false); // Đóng modal
  //   setTimeout(() => {
  //     getProductsInCart();
  //   }, 1000);
  // };

  const handleSolveOrders = async (values) => {
    const selected = productsInCart.filter((product) =>
      selectedRowKeys.includes(product.cartItemId)
    );

    const orderItemRequests = selected.map(item => {
      return {
        productId: item.productId,
        size: item.productSize,
        quantity: item.productQuantity
      }
    });

    const orderProducts = {
      ...values,
      orderItemRequests,
      userId: id
    }

    const response = await fetch(`/order/user/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderProducts)
    })
    const data = await response.json();
    if (data.success) {
      for (const item of selected) {
        await deleteProductsInCart(item.cartItemId);
      }
    }

    return data;
  }

  return (
    <>
      {contextHolder}
      <div className="custom-table-container">
        <h1 className="title animate__animated animate__bounce">Giỏ hàng</h1>
        <Table
          columns={columns}
          dataSource={productsInCart}
          rowKey="cartItemId"
          className="custom-table"
          pagination={false}
        />
        <div className="total">Tổng tiền: {total}</div>
        <div className="action">
          <Button
            className="clearProductsInCart"
            onClick={handleClearProductsInCart}
          >
            Xóa toàn bộ giỏ hàng
          </Button>
          <Button
            className="continueBuyProducts"
            onClick={handleContinueBuyProducts}
          >
            Tiếp tục mua hàng
          </Button>
          <Button
            className="payProductsInCart"
            onClick={handlePayProductsInCart}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "28px",
            }}
          >
            Đặt hàng
          </div>
        }
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width="80%"
        okButtonProps={{ form: "orderForm", htmlType: "submit" }} // Liên kết với form
        okText="Đặt hàng"
        cancelText="Hủy"
        style={{ top: 10 }}
      >
        <Form
          id="orderForm"
          layout="vertical"
          onFinish={async (values) => {
            Modal.confirm({
              title: "Xác nhận đặt hàng",
              icon: <ExclamationCircleOutlined />,
              content:
                "Bạn có chắc chắn muốn đặt hàng các sản phẩm đã chọn không?",
              okText: "Xác nhận",
              okType: "primary",
              cancelText: "Hủy",
              onOk: async () => {
                // let flag = false;

                // for (const itemProductInCart of selectedProducts) {
                //   const product = products.find(
                //     (item) => item.id === itemProductInCart.productId
                //   );

                //   const quantity = product?.size.find(
                //     (item) => item.size === itemProductInCart.productSize
                //   );

                //   if (quantity?.stock >= itemProductInCart.productQuantity) {
                //     try {
                //       // Xóa sản phẩm khỏi giỏ hàng
                //       const responseDeleteProductsInCart =
                //         await deleteProductsInCart(itemProductInCart.id);
                //       await postProductsOnHistory(responseDeleteProductsInCart, values);

                //       // Sản phẩm đã mua -> Trừ số lượng ở trang Home
                //       const responseProductIsDeleted =
                //         await getProductIsDeleted(
                //           responseDeleteProductsInCart.productId
                //         );
                //       responseProductIsDeleted.size.forEach((item) => {
                //         if (
                //           item.size === responseDeleteProductsInCart.productSize
                //         ) {
                //           item.stock -=
                //             responseDeleteProductsInCart.productQuantity;
                //         }
                //       });
                //       await patchProductIsDeleted(responseProductIsDeleted);
                //       flag = true;
                //     } catch (error) {
                //       openNotification(
                //         "Thất bại",
                //         "Đặt hàng thất bại",
                //         "error"
                //       );
                //     }
                //   }
                // }

                // if (flag) {
                //   openNotification(
                //     "Thành công",
                //     "Đã đặt hàng các sản phẩm đã chọn",
                //     "success"
                //   );
                // } else {
                //   openNotification(
                //     "Thất bại",
                //     "Sản phẩm đã hết hoặc không đủ số lượng",
                //     "error"
                //   );
                // }

                // Xử lý orders
                const response = await handleSolveOrders(values);
                if(response.success) {
                  openNotification(
                    "Thành công",
                    "Đã đặt hàng các sản phẩm đã chọn",
                    "success"
                  );
                }

                // Cập nhật lại giỏ hàng sau khi hoàn tất xóa
                setTimeout(() => {
                  getProductsInCart();
                }, 1000);
              },
            });

            setIsModalOpen(false); // Đóng modal sau khi submit
          }}
          initialValues={{
            shippingMethod: "Giao tận nơi",
            deliveryTime: "08:00 - 09:00",
            note: "",
            fullName: user.fullName,
            phoneNumber: user.phone,
            email: user.email,
            address: user.address,
          }}
        >
          <Row gutter={24}>
            {/* Nửa trái: Thông tin đơn hàng */}
            <Col span={12}>
              <Card
                title="Thông tin đơn hàng"
                bordered={false}
                style={{ backgroundColor: "#fafafa" }}
              >
                <p>
                  <strong>Sản phẩm đã chọn:</strong> {selectedProducts.length}{" "}
                  mặt hàng
                </p>
                <p>
                  <strong>Tổng tiền hàng:</strong>{" "}
                  {selectedProducts
                    .reduce(
                      (sum, item) =>
                        sum + item.productPrice * item.productQuantity,
                      0
                    )
                    .toLocaleString()}{" "}
                  đ
                </p>
                <p>
                  <strong>Phí vận chuyển:</strong> {shippingFee} đ
                </p>
                <p>
                  <strong>Tổng cộng:</strong>{" "}
                  {(
                    selectedProducts.reduce(
                      (sum, item) =>
                        sum + item.productPrice * item.productQuantity,
                      0
                    ) + shippingFee
                  ).toLocaleString()}{" "}
                  đ
                </p>
                <Divider />
                <Form.Item
                  name="shippingMethod"
                  label="Hình thức giao nhận"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hình thức giao nhận!",
                    },
                  ]}
                >
                  <Select onChange={handleShippingChange}>
                    <Option value="Giao tận nơi">Giao tận nơi</Option>
                    <Option value="Tự đến lấy">Tự đến lấy</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="deliveryTime"
                  label="Thời gian lấy hàng"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn thời gian lấy hàng!",
                    },
                  ]}
                >
                  <Select>
                    <Option value="08:00 - 09:00">08:00 - 09:00</Option>
                    <Option value="09:00 - 10:00">09:00 - 10:00</Option>
                    <Option value="10:00 - 11:00">10:00 - 11:00</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="note" label="Ghi chú đơn hàng">
                  <TextArea
                    placeholder="Nhập ghi chú"
                    style={{ width: "100%", height: 50 }}
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* Nửa phải: Thông tin người dùng */}
            <Col span={12}>
              {/* Danh sách sản phẩm đã chọn */}
              <Card
                  title="Sản phẩm đã chọn"
                  bordered={false}
                  style={{ backgroundColor: "#fafafa", marginBottom: 16 }}
                >
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      padding: "8px 0",
                    }}
                  >
                    {selectedProducts.map((product) => (
                      <div
                        key={product.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: 16,
                          border: "1px solid #f0f0f0",
                          borderRadius: 8,
                          padding: 8,
                        }}
                      >
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 4,
                            marginRight: 8,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0 }}>{product.productName}</h4>
                          <p
                            style={{
                              margin: "4px 0",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            {product.productDescription}
                          </p>
                          <p
                            style={{
                              margin: "4px 0",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            <strong>Size: </strong>
                            {product.productSize}
                          </p>
                          <p
                            style={{
                              margin: "4px 0",
                              color: "#666",
                              fontSize: "12px",
                            }}
                          >
                            <strong>Số lượng: </strong>
                            {product.productQuantity}
                          </p>
                          <p style={{ margin: 0, color: "red" }}>
                            <strong>Giá: </strong>
                            {product.productPrice.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>    

              <Card
                title="Thông tin người dùng"
                bordered={false}
                style={{ backgroundColor: "#fafafa" }}
              >
                <Form.Item
                  name="fullName"
                  label="Họ và tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" },
                  ]}
                >
                  <TextArea placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default ProductTable;
