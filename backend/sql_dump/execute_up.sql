
-- Drop existing tables if they exist (for a fresh start)
DROP TABLE IF EXISTS im_admin_users,
im_items,
im_item_size,
im_item_size_type,
im_keywords,
im_item_keywords,
im_attachments,
im_item_history,
im_brands,
im_categories,
im_category_hierarchy,
im_orders,
im_customers,
im_expenses,
im_expense_type;

DROP TRIGGER IF EXISTS trg_update_item_code;
DROP TRIGGER IF EXISTS trg_generate_order_invoice;


-- Create fs_admin_users table
CREATE TABLE im_admin_users(
    `au_id` INT NOT NULL AUTO_INCREMENT,
    `au_name` VARCHAR(150) NOT NULL,
    `au_email` VARCHAR(255) NOT NULL,
    `au_password_hash` TEXT NOT NULL,
    `au_role` VARCHAR(50) NOT NULL DEFAULT 'admin',
    `au_status` TINYINT NOT NULL,
    `au_last_login` TIMESTAMP NOT NULL,
    `au_created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `au_updated_on` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`au_id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/* 123456*/
INSERT INTO `im_admin_users` (`au_name`, `au_email`, `au_password_hash`, `au_role`, `au_status`, `au_last_login`, `au_created_on`, `au_updated_on`)
VALUES('Admin', 'admin@im.com', 'e10adc3949ba59abbe56e057f20f883e', 'superadmin', '1', NOW(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE TABLE im_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY, 
    item_code VARCHAR(50) UNIQUE NOT NULL, 
    item_name VARCHAR(255) NOT NULL, 
    item_description TEXT, 
    item_brand_id INT NOT NULL COMMENT 'Reference to im_brands', 
    item_category_id INT NOT NULL COMMENT 'Reference to im_categories', 
    item_size_id INT NOT NULL COMMENT 'Reference to im_item_size', 
    item_size_type_id INT NOT NULL COMMENT 'Reference to im_item_size_type', 
    item_stock INT DEFAULT 0, 
    item_cost_price DECIMAL(10,2) NOT NULL, 
    item_discount_in DECIMAL(10,2) DEFAULT 0.00, 
    item_selling_price DECIMAL(10,2) NOT NULL COMMENT 'MRP (Maximum Retail Price)', 
    item_discount_out DECIMAL(10,2) DEFAULT 0.00, 
    item_including_taxes TINYINT(1) DEFAULT 0, 
    item_tax_paid_value DECIMAL(10,2) DEFAULT 0.00, 
    item_status TINYINT(1) DEFAULT 1 COMMENT '1 = Active, 0 = Inactive', 
    item_added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    item_updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create trigger to update item code if not added after insertion
DELIMITER //

CREATE TRIGGER trg_update_item_code
AFTER INSERT ON im_items
FOR EACH ROW
BEGIN
    IF NEW.item_code IS NULL OR NEW.item_code = '' THEN
        UPDATE im_items 
        SET item_code = LPAD(NEW.item_id, 6, '0') 
        WHERE item_id = NEW.item_id;
    END IF;
END;
//

DELIMITER ;


CREATE TABLE im_item_size (
    size_id INT AUTO_INCREMENT PRIMARY KEY,
    size_name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Size name (e.g., XL, Gram, Litre)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO im_item_size (size_name) VALUES
('X'),
('L'),
('XL'),
('XXL'),
('Kilogram'),
('Gram'),
('Litre'),
('Millilitre'),
('Centimeter'),
('Meter'),
('Inch'),
('Foot'),
('Piece'),
('Pack'),
('Dozen');

CREATE TABLE im_item_size_type (
    size_type_id INT AUTO_INCREMENT PRIMARY KEY,
    size_type_name VARCHAR(50) UNIQUE NOT NULL COMMENT 'Size type name (e.g., Weight, Clothing Sizes, Number Sizes)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO im_item_size_type (size_type_name) VALUES
('Weight'),
('Clothing Sizes'),
('Clothing Number Sizes'),
('Volume'),
('Length'),
('Pack Size');

CREATE TABLE im_keywords (
    keyword_id INT AUTO_INCREMENT PRIMARY KEY,
    keyword_name VARCHAR(255) UNIQUE NOT NULL COMMENT 'Keyword name (e.g., fashion, electronics, organic)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_item_keywords (
    item_id INT NOT NULL COMMENT 'Reference to im_Items',
    keyword_id INT NOT NULL COMMENT 'Reference to im_keywords',
    PRIMARY KEY (item_id, keyword_id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_attachments (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY,
    attachment_record_id INT NOT NULL COMMENT 'ID of the related record',
    attachment_path VARCHAR(500) NOT NULL COMMENT 'File path or URL',
    attachment_type VARCHAR(50) NOT NULL COMMENT 'Type of attachment (e.g., image, document, video)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_item_history (
    itemhistory_id INT AUTO_INCREMENT PRIMARY KEY,
    itemhistory_item_id INT NOT NULL COMMENT 'Reference to im_Items',
    itemhistory_purchase_qty INT NOT NULL COMMENT 'Quantity purchased',
    itemhistory_total_cost_price DECIMAL(10,2) NOT NULL COMMENT 'Total cost price of the purchased items',
    itemhistory_including_taxes TINYINT(1) DEFAULT 0 COMMENT '1 = Includes taxes, 0 = Excludes taxes',
    itemhistory_tax_paid_value DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Total tax amount paid',
    itemhistory_added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when the history record was added'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) UNIQUE NOT NULL
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_parent_id INT DEFAULT 0 COMMENT 'Parent category reference (0 if top-level)',
    category_name VARCHAR(100) NOT NULL COMMENT 'Category name (e.g., Electronics, Clothing, Footwear)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_category_hierarchy (
    ch_category_id INT NOT NULL COMMENT 'Category ID (Reference to im_categories)',
    ch_parent_category_id INT DEFAULT 0 COMMENT 'Parent category ID (0 if top-level)',
    ch_level INT NOT NULL COMMENT 'Hierarchy level (e.g., 0 for top-level, 1 for sub-category)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_invoice_id VARCHAR(10) UNIQUE COMMENT 'Auto-generated invoice ID (Format: O000001)',
    order_customer_id INT NOT NULL COMMENT 'Reference to im_customers',
    order_item_id INT NOT NULL COMMENT 'Reference to im_Items',
    order_item_name VARCHAR(255) NOT NULL COMMENT 'Item name at time of purchase',
    order_item_qty INT NOT NULL COMMENT 'Quantity purchased',
    order_cost_price DECIMAL(10,2) NOT NULL COMMENT 'Cost price per item',
    order_selling_price DECIMAL(10,2) NOT NULL COMMENT 'Original selling price (MRP)',
    order_discount_value DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Discount applied',
    order_sold_price DECIMAL(10,2) NOT NULL COMMENT 'Final price after discount',
    order_shipping_cost DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Shipping cost',
    order_is_paid TINYINT(1) DEFAULT 0 COMMENT '0 = Unpaid, 1 = Paid',
    order_payment_mode TINYINT(1) NOT NULL COMMENT '0 = Cash, 1 = GPay, 2 = Cheque',
    order_delivery_type TINYINT(1) NOT NULL COMMENT '0 = Pickup, 1 = Home Delivery',
    order_added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Order creation timestamp'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DELIMITER $$

CREATE TRIGGER trg_generate_order_invoice
AFTER INSERT ON im_orders
FOR EACH ROW
BEGIN
    DECLARE formatted_id VARCHAR(10);
    
    -- Generate the invoice ID (Format: O000001)
    SET formatted_id = CONCAT('O', LPAD(NEW.order_id, 6, '0'));
    
    -- Update the inserted row with the generated invoice ID
    UPDATE im_orders 
    SET order_invoice_id = formatted_id 
    WHERE order_id = NEW.order_id;
END $$

DELIMITER ;


CREATE TABLE im_customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL COMMENT 'Full name of the customer',
    customer_phone_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'Customer contact number',
    customer_address TEXT COMMENT 'Customer address details'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_type_id INT NOT NULL COMMENT 'Reference to im_expense_type',
    expense_cost DECIMAL(10,2) NOT NULL COMMENT 'Expense amount',
    expense_payment_type TINYINT(1) NOT NULL COMMENT '0 = Cash, 1 = GPay, 2 = Cheque',
    expense_is_paid TINYINT(1) DEFAULT 0 COMMENT '0 = Unpaid, 1 = Paid',
    expense_date DATE NOT NULL COMMENT 'Date of the expense'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE im_expense_type (
    expensetype_id INT AUTO_INCREMENT PRIMARY KEY,
    expensetype_name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Expense type (e.g., Electricity, Salaries, Utilities)'
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
