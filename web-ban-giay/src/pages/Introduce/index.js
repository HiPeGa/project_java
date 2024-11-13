import React from "react";
import { Typography, Row, Col, Image, Card } from "antd";

const { Title, Paragraph } = Typography;

function Introduce() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto", marginTop: "30px" }}>
      <Title level={1} style={{ textAlign: "center", marginBottom: "40px" }}>
        Giới thiệu về Shop Giày của chúng tôi
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Image
            src="https://wsu.vn/wp-content/uploads/2023/06/mauwesitebanhang-3.png" // Đổi URL thành ảnh đại diện cho cửa hàng
            alt="Giới thiệu về cửa hàng"
            style={{ borderRadius: "8px" }}
          />
        </Col>

        <Col xs={24} md={12}>
          <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Chào mừng bạn đến với cửa hàng giày của chúng tôi! Chúng tôi tự hào
            mang đến cho bạn những đôi giày chất lượng, phong cách và đa dạng,
            phù hợp cho mọi lứa tuổi và sở thích. Với sự tận tâm và lòng yêu
            nghề, chúng tôi cam kết cung cấp cho khách hàng những sản phẩm tốt
            nhất và dịch vụ chăm sóc khách hàng tận tình.
          </Paragraph>
          <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Tại cửa hàng của chúng tôi, bạn có thể tìm thấy các mẫu giày mới
            nhất, từ giày thể thao, giày dạo phố đến giày công sở. Mỗi sản phẩm
            đều được chọn lọc kỹ càng nhằm mang lại trải nghiệm thoải mái và phong
            cách cho từng khách hàng. Hãy khám phá bộ sưu tập của chúng tôi và
            tìm cho mình đôi giày ưng ý nhất!
          </Paragraph>
        </Col>
      </Row>

      <Title level={2} style={{ marginTop: "40px", textAlign: "center" }}>
        Tại sao chọn chúng tôi?
      </Title>

      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Chất lượng hàng đầu"
            style={{ borderRadius: "8px", textAlign: "center", height: "100%" }}
          >
            <Paragraph>Giày của chúng tôi được sản xuất từ những chất liệu bền bỉ, đảm bảo chất lượng cao nhất cho từng sản phẩm.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Đa dạng mẫu mã"
            style={{ borderRadius: "8px", textAlign: "center", height: "100%" }}
          >
            <Paragraph>Chúng tôi cung cấp nhiều mẫu mã giày đa dạng, từ cổ điển đến hiện đại, phục vụ mọi phong cách.</Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            title="Dịch vụ khách hàng tận tâm"
            style={{ borderRadius: "8px", textAlign: "center", height: "100%" }}
          >
            <Paragraph>Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn, đảm bảo trải nghiệm mua sắm tốt nhất.</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Introduce;
