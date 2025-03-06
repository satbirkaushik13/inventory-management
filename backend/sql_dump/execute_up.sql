
-- Drop existing tables if they exist (for a fresh start)
DROP TABLE IF EXISTS fs_admin_users, fs_orders, fs_attachments, fs_items, fs_keywords;

-- Create fs_admin_users table
CREATE TABLE fs_admin_users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    status BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

/* 123456*/
INSERT INTO fs_admin_users (full_name, email, password_hash, role, status, created_at, updated_at)
VALUES ('Admin', 'admin@fashion.com', 
        'e10adc3949ba59abbe56e057f20f883e', 
        'superadmin', TRUE, NOW(), NOW());


-- Create fs_keywords table
CREATE TABLE fs_keywords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword_name VARCHAR(255) NOT NULL UNIQUE
);

-- Create fs_items table
CREATE TABLE fs_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_type TINYINT NOT NULL,  -- (0: Pant, 1: Shirt, 2: Shoes, 3: Jackets)
    item_category TINYINT NOT NULL,  -- (0: Men, 1: Women, 2: Children)
    item_size VARCHAR(50),
    item_description TEXT,
    item_cost_price DECIMAL(10,2) NOT NULL,
    item_display_price DECIMAL(10,2) NOT NULL,
    item_sale_price DECIMAL(10,2) NOT NULL,
    item_stock INT NOT NULL DEFAULT 0,
    item_status TINYINT NOT NULL DEFAULT 1
);

ALTER TABLE `fs_items` 
    ADD `item_created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `item_status`,
    ADD `item_udpated_at` DATETIME ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `item_created_at`;

-- Create fs_attachments table
CREATE TABLE fs_attachments (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    attachment_record_id INT NOT NULL,  -- Can be an item_id or another entity
    attachment_name VARCHAR(255) NOT NULL,
    attachment_type TINYINT NOT NULL  -- (0: Image, 1: Video, 2: Document)
);

-- Create fs_orders table
CREATE TABLE fs_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    order_item_qty INT NOT NULL,
    order_type TINYINT NOT NULL,  -- (0: Delivery at home, 1: Pickup from store)
    order_payment_mode TINYINT NOT NULL,  -- (0: Cash, 1: Card, 2: Online)
    order_payment_amount DECIMAL(10,2) NOT NULL,
    order_shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    order_payment_status TINYINT NOT NULL DEFAULT 0,  -- (0: Pending, 1: Paid, 2: Failed)
    order_customer_phone VARCHAR(15) NOT NULL,
    order_customer_address TEXT NOT NULL
);

-- Insert sample data into fs_keywords
INSERT INTO fs_keywords (keyword_name) VALUES ('Casual'), ('Formal'), ('Sportswear');

-- Insert sample data into fs_items
INSERT INTO fs_items (item_name, item_type, item_category, item_size, item_keyword_id, item_description, item_cost_price, item_display_price, item_sale_price, item_stock, item_status) 
VALUES 
('Blue Jeans', 0, 0, 'L', 1, 'Comfortable denim jeans', 20.00, 35.00, 30.00, 50, 1),
('White Shirt', 1, 1, 'M', 2, 'Elegant white shirt', 15.00, 25.00, 20.00, 30, 1);

-- Insert sample data into fs_attachments
INSERT INTO fs_attachments (attachment_record_id, attachment_name, attachment_type) 
VALUES (1, 'jeans.jpg', 0),
       (2, 'shirt.jpg', 0);

-- Insert sample data into fs_orders
INSERT INTO fs_orders (order_item_id, order_item_qty, order_type, order_payment_mode, order_payment_amount, order_shipping_amount, order_payment_status, order_customer_phone, order_customer_address) 
VALUES 
(1, 2, 0, 2, 60.00, 5.00, 1, '9876543210', '123 Street, City'),
(2, 1, 1, 0, 20.00, 0.00, 0, '9123456789', 'Store Pickup');


CREATE TABLE `fs_items_to_keywords` (`item_id` INT NOT NULL , `keyword_id` INT NOT NULL ) ENGINE = InnoDB;
ALTER TABLE `fs_items_to_keywords` ADD UNIQUE(`item_id`, `keyword_id`);
