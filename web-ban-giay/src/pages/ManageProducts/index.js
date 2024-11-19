import { Button, Col, Form, Image, Input, message, Modal, Row, Select, Table, Tag, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [selectedSizeIndices, setSelectedSizeIndices] = useState({}); // Lưu chỉ số size của từng sản phẩm
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Sản phẩm đang chỉnh sửa
  const [form] = Form.useForm();
  const [currentStock, setCurrentStock] = useState(0); // Thêm state để lưu stock khi chọn size

  const getProducts = async () => {
    const response = await fetch(`http://localhost:3002/products`);
    const tmp = await response.json();
    setProducts(tmp.reverse());
    return tmp;
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChangeSize = (value, productId) => {
    // Cập nhật lại chỉ số size của sản phẩm theo productId
    setSelectedSizeIndices(prevState => ({
      ...prevState,
      [productId]: value, // Lưu giá trị index size theo productId
    }));
  
    // Cập nhật stock khi chọn size
    const selectedSize = products.find(product => product.id === productId)?.size[value];
    if (selectedSize) {
      setCurrentStock(selectedSize.stock); // Cập nhật stock tương ứng
    }
  };  
  // Hàm xử lý khi nhấn chỉnh sửa
  const onEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record, // Điền thông tin sản phẩm vào form
      size: record.size[0]?.size, // Điền size đầu tiên vào select
    });
    setCurrentStock(record.size[0]?.stock || 0); // Lấy stock của size đầu tiên khi mở modal
    setIsEditModalVisible(true); // Hiển thị Modal
  };

  // Hàm xử lý khi lưu thông tin sản phẩm đã chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      const values = form.getFieldsValue();
      const updatedProduct = { 
        ...editingProduct, 
        name: values.name,
        image: values.image,
        description: values.description,
        brand: values.brand,
        category: values.category,
        price: values.price,
        size: editingProduct.size.map((size, index) => ({
          ...size,
          stock: index === selectedSizeIndices[editingProduct.id] ? currentStock : size.stock, // Cập nhật stock cho size được chọn
        }))
      };

      await fetch(`http://localhost:3002/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      message.success("Cập nhật sản phẩm thành công!");
      setProducts(products.map((product) => (product.id === editingProduct.id ? updatedProduct : product)));
      setIsEditModalVisible(false); // Đóng Modal
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
    }
  };

  // Hàm xử lý xóa
  const onDelete = (record) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await fetch(`http://localhost:3002/products/${record.id}`, { method: "DELETE" });
          message.success("Xóa sản phẩm thành công!");
          setProducts(products.filter(product => product.id !== record.id));
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa sản phẩm!");
        }
      },
    });
  };

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
      dataIndex: 'image',
      key: 'productImage',
      render: (text) => <Image src={text} width={80} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'productName'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'productDescription',
      width: 200,
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'productBrand'
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'productCategory'
    },
    {
      title: 'Size',
      key: 'size',
      render: (text, record) => {
        const optionsSize = record.size.map((item, index) => ({
          value: index,
          label: item.size
        }));

        const currentSizeIndex = selectedSizeIndices[record.id] || 0;

        return (
          <Select
            value={record.size[currentSizeIndex]?.size} // Hiển thị size hiện tại
            onChange={(value) => handleChangeSize(value, record.id)} // Cập nhật size khi người dùng thay đổi
            options={optionsSize}
          />
        );
      }
    },
    {
      title: 'Số lượng',
      key: 'stock',
      render: (text, record) => {
        const currentSizeIndex = selectedSizeIndices[record.id] || 0;
        return <>{record.size[currentSizeIndex]?.stock}</>;
      }
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'productPrice',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const currentSizeIndex = selectedSizeIndices[record.id] || 0;
        return record.size[currentSizeIndex]?.stock ? (
          <Tag color="#87d068">Còn hàng</Tag>
        ) : (
          <Tag color="#f50">Hết hàng</Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            <EditOutlined onClick={() => onEdit(record)} style={{ color: "#1890ff", fontSize: "18px", marginRight: "10px", cursor: "pointer" }} />
            <DeleteOutlined onClick={() => onDelete(record)} style={{ color: "#ff4d4f", fontSize: "18px", cursor: "pointer" }} />
          </>
        );
      }      
    }
  ];

  const handleSearchProducts = async (e) => {

    const data = await getProducts();

    const newProducts = data.filter(item => {
      return item.name.toLowerCase().includes(e.nameProducts.toLowerCase());
    })
    setProducts(newProducts);
  };

  return (
    <>
      <div className="custom-table-container" style={{ marginTop: "0px", background: "none", padding: "0px" }}>
        <h1>Quản lý sản phẩm</h1>
        <Row gutter={[0, 20]} style={{ width: "100%" }}>
          <Col xl={24}>
            <Button type="primary">Thêm sản phẩm</Button>
          </Col>
          <Col xl={24}>
            <Form onFinish={handleSearchProducts}>
              <Row gutter={[20, 20]}>
                <Col xl={5}>
                  <Form.Item name='nameProducts'>
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col xl={12}>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">Tìm kiếm</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          className="custom-table"
          pagination={{ pageSize: 5 }}
          style={{ minWidth: "100%" }}
        />

        {/* Modal chỉnh sửa sản phẩm */}
        <Modal
          title="Chỉnh sửa sản phẩm"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onOk={handleSaveEdit}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item 
              name="name" 
              label="Tên sản phẩm" 
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              name="image" 
              label="Link ảnh" 
              rules={[{ required: true, message: "Vui lòng nhập link ảnh!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="brand" label="Thương hiệu">
              <Input />
            </Form.Item>
            <Form.Item name="category" label="Loại">
              <Input />
            </Form.Item>

            {/* Chọn size trong Modal */}
            <Form.Item name="size" label="Size" rules={[{ required: true, message: "Vui lòng chọn size!" }]}>
              <Select
                value={editingProduct?.size[selectedSizeIndices[editingProduct.id]]?.size} // Lấy size hiện tại
                options={editingProduct?.size?.map((item, index) => ({
                  value: index,
                  label: item.size,
                }))} 
                onChange={(value) => handleChangeSize(value, editingProduct.id)} // Cập nhật stock khi chọn size
              />
            </Form.Item>

            {/* Số lượng stock tương ứng với size đã chọn */}
            <Form.Item name="stock" label="Số lượng">
              <InputNumber 
                value={currentStock} 
                onChange={setCurrentStock} 
                min={0} 
                max={10000} // Tùy chỉnh giới hạn stock nếu cần
              />
            </Form.Item>

            <Form.Item 
              name="price" 
              label="Giá" 
              rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm!" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default ManageProducts;
