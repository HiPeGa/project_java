create database snaker;
use snaker;
create table users(
	id int auto_increment primary key,
    phone varchar(20),
    password varchar(100),
    role_id int,
    token varchar(100),
    email varchar(100),
    fullname varchar(100),
    address varchar(200),
    active int(1),
    created_at timestamp default current_timestamp
);

INSERT INTO users (phone, password, role_id, token, email, fullname, address, active) VALUES
('0987654321', '$2a$12$.kVtirf6yz7m7Z6sYaFTru.dH7J7UsXi9Z7H60OPNUaTcfwAPiWR.', 2, '383ha812hf93hf93hfq3', 'nguyenhoanghiep@gmail.com', 'Nguyễn Hoàng Hiệp', '789 Quan Hoa, Cầu Giấy, Hà Nội', 1),
('0123456789', '$2a$12$.kVtirf6yz7m7Z6sYaFTru.dH7J7UsXi9Z7H60OPNUaTcfwAPiWR.', 1, 'IsFkzbOhZ63R1xj6cKr7', 'nguyenvana@gmail.com', 'Nguyễn Văn A', 'PTIT', 1);

create table roles(
	id int auto_increment primary key,
    role_name varchar(20)
);

insert into roles(role_name) values('ADMIN');
insert into roles(role_name) values('USER');

create table product(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand_id int,
    price int,
    description TEXT,
    category_id int,
    gender ENUM('Men', 'Women', 'Unisex') NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO product (name, brand_id, price, description, category_id, gender, image) VALUES
('Nike Air Max', 1, 150, 'Nike Air Max thiết kế hiện đại và phong cách, phù hợp cho mọi hoạt động.', 1, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Adidas Ultraboost', 2, 180, 'Adidas Ultraboost mang đến sự êm ái và thoải mái vượt trội.', 2, 'Women', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Puma Suede Classic', 3, 90, 'Puma Suede Classic với thiết kế cổ điển, dễ phối đồ.', 3, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Converse Chuck Taylor', 4, 70, 'Converse Chuck Taylor, một sản phẩm biểu tượng của thương hiệu Converse.', 1, 'Unisex', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Vans Old Skool', 5, 60, 'Vans Old Skool mang phong cách cổ điển, phù hợp cho mọi dịp.', 4, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Reebok Classic Leather', 6, 85, 'Reebok Classic Leather có thiết kế cổ điển và tinh tế.', 3, 'Women', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('New Balance 574', 7, 100, 'New Balance 574 mang đến sự thoải mái và phong cách đơn giản.', 1, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Asics Gel-Kayano', 8, 160, 'Asics Gel-Kayano hỗ trợ hoàn hảo cho việc chạy bộ với độ êm ái cao.', 2, 'Women', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Fila Disruptor', 9, 95, 'Fila Disruptor với thiết kế chunky độc đáo, đang là xu hướng.', 1, 'Unisex', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Under Armour Charged', 10, 120, 'Under Armour Charged đem lại sự hỗ trợ tuyệt vời cho các vận động viên.', 2, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Jordan 1 Retro High', 1, 200, 'Jordan 1 Retro High là biểu tượng của phong cách và cá tính.', 1, 'Unisex', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Nike Blazer Mid', 1, 105, 'Nike Blazer Mid mang lại vẻ ngoài cổ điển và mạnh mẽ.', 3, 'Women', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Skechers D\'Lites', 12, 85, 'Skechers D\'Lites thiết kế thoải mái, nhẹ nhàng cho ngày dài.', 3, 'Women', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Timberland 6-Inch Boots', 13, 180, 'Timberland 6-Inch Boots chống thấm nước, bền bỉ và phong cách.', 6, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Merrell Moab 2', 14, 140, 'Merrell Moab 2 là đôi giày hoàn hảo cho các chuyến dã ngoại và leo núi.', 5, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Nike Air Force 1', 1, 110, 'Nike Air Force 1 nổi bật với thiết kế cổ điển và phong cách.', 1, 'Unisex', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Adidas NMD R1', 2, 170, 'Adidas NMD R1 mang phong cách hiện đại và thoải mái.', 2, 'Men', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg'),
('Puma RS-X', 3, 130, 'Puma RS-X với thiết kế năng động và hiện đại.', 1, 'Unisex', 'https://sneakerhs.com/wp-content/uploads/2023/08/giay-nike-air-force-1-low-07-lv8-panda-dx3115-100-rep-11-gia-re.jpg');


CREATE TABLE product_size (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    size INT NOT NULL,
    stock INT NOT NULL
);

INSERT INTO product_size (product_id, size, stock) VALUES
(1, 40, 0), (1, 41, 0), (1, 42, 1), (1, 43, 0),
(2, 38, 4), (2, 39, 5), (2, 40, 5), (2, 41, 5), (2, 42, 5),
(3, 39, 6), (3, 40, 5), (3, 41, 5), (3, 42, 5),
(4, 36, 5), (4, 37, 5), (4, 38, 5), (4, 39, 5), (4, 40, 5), (4, 41, 5), (4, 42, 5),
(5, 39, 5), (5, 40, 5), (5, 41, 7), (5, 42, 5), (5, 43, 5),
(6, 40, 3), (6, 41, 4), (6, 42, 4),
(7, 39, 2), (7, 40, 2), (7, 41, 2), (7, 42, 1), (7, 43, 1),
(8, 40, 2), (8, 41, 1), (8, 42, 1), (8, 43, 1), (8, 44, 1),
(9, 36, 4), (9, 37, 4), (9, 38, 4), (9, 39, 3), (9, 40, 3),
(10, 40, 3), (10, 41, 2), (10, 42, 2),
(11, 40, 0), (11, 41, 1), (11, 42, 1), (11, 43, 1), (11, 44, 1),
(12,38,0), (12,39,1), (12,40,1), (12,41,1),
(13,37,5), (13,38,5), (13,39,5), (13,40,5),
(14,39,2), (14,40,2), (14,41,2), (14,42,2), (14,43,2),
(15,40,3), (15,41,2), (15,42,2), (15,43,2),
(16,40,2), (16,41,3), (16,42,3), (16,43,3),
(17,41,3), (17,42,3), (17,43,2),
(18,39,4), (18,40,4), (18,41,3), (18,42,3);

create table brand(
	id int auto_increment primary key,
    name varchar(255),
    created_at timestamp default current_timestamp
);

INSERT INTO brand (name) VALUES 
('Nike'),
('Adidas'),
('Puma'),
('Converse'),
('Vans'),
('Reebok'),
('New Balance'),
('Asics'),
('Fila'),
('Under Armour'),
('Jordan'),
('Skechers'),
('Timberland'),
('Merrell'),
('Hoka One One'),
('Salomon'),
('On');

create table category(
	id int auto_increment primary key,
    cate_name varchar(50),
    created_at timestamp default current_timestamp
);

INSERT INTO category (cate_name) VALUES 
('Sneakers'),
('Running'),
('Casual'),
('Skateboarding'),
('Hiking'),
('Boots');

create table orders(
	id int auto_increment primary key,
    user_id int,
    status varchar(100),
    total_amount int,
    full_name varchar(255),
    phone_number varchar(255),
    email varchar(255),
    shipping_method varchar(255),
    address text,
    delivery_time varchar(50),
    note varchar(255),
    created_at timestamp default current_timestamp
);

INSERT INTO orders (user_id, status, total_amount, full_name, phone_number, email, shipping_method, address, delivery_time, note) VALUES
(1, 1, 150, 'Nguyễn Văn A', '0987654321', 'nguyena@gmail.com', 'Hỏa tốc', '123 Example Street', '08:00 - 09:00', 'Không có ghi chú'),
(2, 1, 150, 'Nguyễn Hoàng Hiệp', '0123456789', 'nguyenhoanghiep@gmail.com', 'Hỏa tốc', '456 Another Street', '08:00 - 09:00', 'Không có ghi chú'),
(2, 1, 150, 'Nguyễn Hoàng Hiệp', '0123456789', 'nguyenhoanghiep@gmail.com', 'Hỏa tốc', '789 Third Street', '08:00 - 09:00', 'Không có ghi chú'),
(1, 1, 180, 'Nguyễn Văn A', '0987654321', 'nguyena@gmail.com', 'Hỏa tốc', '101 Example Ave', '08:00 - 09:00', 'Không có ghi chú');

create table order_item(
	order_id int,
    product_id int,
    quantity int,
    price int,
    size int,
    created_at timestamp default current_timestamp,
    primary key(order_id,product_id)
);

INSERT INTO order_item (order_id, product_id, quantity, price, size) VALUES
(1, 1, 1, 150, 41),
(2, 1, 1, 150, 42),
(3, 1, 1, 150, 43),
(4, 2, 1, 180, 40);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amout INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cart (user_id, total_amout)
VALUES (2, 150);

CREATE TABLE cart_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT,
    price int,
    size int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cart_item (cart_id, product_id, quantity, price, size)
VALUES (1, 1, 1, 150, 41);

CREATE TABLE contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contact (full_name, email, phone, content, is_read) VALUES
('Nguyễn Hoàng Hiệp', 'hiep2804@gmail.com', '0123654987', 'alo alo', TRUE);

alter table users add constraint fk_users_role_id foreign key(role_id) references roles(id);
alter table product add constraint fk_product_category_id foreign key(category_id) references category(id);
alter table product_size add constraint fk_product_size_product_id foreign key(product_id) references product(id);
alter table orders add constraint fk_order_user_id foreign key(user_id) references users(id);
alter table product add constraint fk_order_brand_id foreign key(brand_id) references brand(id);
alter table order_item add constraint fk_order_item_order_id foreign key(order_id) references orders(id);
alter table order_item add constraint fk_order_item_product_id foreign key(product_id) references product(id);
alter table cart add constraint fk_cart_user_id foreign key(user_id) references users(id);
alter table cart_item add constraint fk_cart_item_cart_id foreign key(cart_id) references cart(id);
alter table cart_item add constraint fk_cart_item_product_id foreign key(product_id) references product(id);