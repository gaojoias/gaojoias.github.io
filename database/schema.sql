CREATE DATABASE IF NOT EXISTS gaoapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gaoapp;

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','operator') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_users_role (role, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS access_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_user_id BIGINT UNSIGNED NULL,
  user_name VARCHAR(120) NOT NULL,
  role_label VARCHAR(40) NOT NULL,
  system_info VARCHAR(190) NULL,
  browser VARCHAR(190) NULL,
  ip_address VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_access_logs_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_access_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  short_description VARCHAR(255) NULL,
  description TEXT NULL,
  status ENUM('draft','active','archived') NOT NULL DEFAULT 'draft',
  product_type ENUM('physical','service','custom') NOT NULL DEFAULT 'physical',
  price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  compare_at_cents INT UNSIGNED NULL,
  cost_cents INT UNSIGNED NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  track_stock TINYINT(1) NOT NULL DEFAULT 1,
  allow_backorder TINYINT(1) NOT NULL DEFAULT 0,
  stock_qty INT NOT NULL DEFAULT 0,
  reserved_qty INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 2,
  weight_grams INT UNSIGNED NULL,
  image_url VARCHAR(500) NULL,
  stripe_price_id VARCHAR(120) NULL,
  seo_title VARCHAR(190) NULL,
  seo_description VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  INDEX idx_products_status (status),
  INDEX idx_products_stock (track_stock, stock_qty, reserved_qty),
  INDEX idx_products_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(190) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  movement_type ENUM('initial','purchase','adjustment','sale','return','reservation','release') NOT NULL,
  quantity INT NOT NULL,
  before_qty INT NULL,
  after_qty INT NULL,
  unit_cost_cents INT UNSIGNED NULL,
  reason VARCHAR(255) NULL,
  reference_type VARCHAR(80) NULL,
  reference_id BIGINT UNSIGNED NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_inventory_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_inventory_product_date (product_id, created_at),
  INDEX idx_inventory_reference (reference_type, reference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(40) NULL,
  company VARCHAR(160) NULL,
  document VARCHAR(40) NULL,
  notes TEXT NULL,
  stripe_customer_id VARCHAR(120) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_name (name),
  INDEX idx_customers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quotes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quote_number VARCHAR(40) NULL UNIQUE,
  customer_id BIGINT UNSIGNED NULL,
  customer_name VARCHAR(160) NOT NULL,
  status ENUM('Em negociacao','Enviado','Aprovado','Perdido','Confirmado') NOT NULL DEFAULT 'Em negociacao',
  valid_until DATE NULL,
  public_notes TEXT NULL,
  private_notes TEXT NULL,
  subtotal_cents INT UNSIGNED NOT NULL DEFAULT 0,
  items_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  extra_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  profit_cents INT NOT NULL DEFAULT 0,
  margin_percent DECIMAL(7,2) NOT NULL DEFAULT 0,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_quotes_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_quotes_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_quotes_status_date (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quote_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quote_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  item_type ENUM('Produto','Servico') NOT NULL DEFAULT 'Produto',
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  unit_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cents INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quote_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sales (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_number VARCHAR(40) NULL UNIQUE,
  customer_id BIGINT UNSIGNED NULL,
  customer_name VARCHAR(160) NOT NULL,
  source_quote_id BIGINT UNSIGNED NULL,
  payment_status ENUM('Pendente','Parcial','Pago') NOT NULL DEFAULT 'Pendente',
  payment_summary VARCHAR(80) NULL,
  due_at DATE NULL,
  subtotal_cents INT UNSIGNED NOT NULL DEFAULT 0,
  received_cents INT UNSIGNED NOT NULL DEFAULT 0,
  balance_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  profit_cents INT NOT NULL DEFAULT 0,
  margin_percent DECIMAL(7,2) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  CONSTRAINT fk_sales_quote FOREIGN KEY (source_quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
  CONSTRAINT fk_sales_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_sales_status_date (payment_status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sale_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  item_type ENUM('Produto','Servico') NOT NULL DEFAULT 'Produto',
  title VARCHAR(180) NOT NULL,
  description TEXT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  unit_cost_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cents INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sale_payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sale_id BIGINT UNSIGNED NOT NULL,
  description VARCHAR(190) NOT NULL,
  method VARCHAR(60) NOT NULL DEFAULT 'Pix',
  status ENUM('Pago','Pendente') NOT NULL DEFAULT 'Pendente',
  amount_cents INT UNSIGNED NOT NULL DEFAULT 0,
  due_at DATE NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_payments_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  INDEX idx_sale_payments_status (status, due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS financial_entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entry_number VARCHAR(40) NULL UNIQUE,
  type ENUM('Entrada','Saida') NOT NULL,
  category VARCHAR(120) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount_cents INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('Pago','A pagar') NOT NULL DEFAULT 'Pago',
  due_at DATE NULL,
  source VARCHAR(80) NOT NULL DEFAULT 'Manual',
  reference VARCHAR(120) NULL,
  notes TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_financial_entries_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_financial_status_due (status, due_at),
  INDEX idx_financial_source (source, reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reminders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reminder_number VARCHAR(40) NULL UNIQUE,
  title VARCHAR(190) NOT NULL,
  description TEXT NOT NULL,
  due_at DATE NOT NULL,
  status ENUM('Pendente','Concluido') NOT NULL DEFAULT 'Pendente',
  source VARCHAR(80) NOT NULL DEFAULT 'Manual',
  notes TEXT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reminders_admin FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_reminders_status_due (status, due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NULL,
  status ENUM('draft','checkout_created','paid','processing','fulfilled','cancelled','refunded') NOT NULL DEFAULT 'draft',
  payment_status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  fulfillment_status ENUM('unfulfilled','partial','fulfilled') NOT NULL DEFAULT 'unfulfilled',
  inventory_status ENUM('none','reserved','deducted','released') NOT NULL DEFAULT 'none',
  subtotal_cents INT UNSIGNED NOT NULL DEFAULT 0,
  shipping_cents INT UNSIGNED NOT NULL DEFAULT 0,
  discount_cents INT UNSIGNED NOT NULL DEFAULT 0,
  total_cents INT UNSIGNED NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  stripe_session_id VARCHAR(180) NULL,
  stripe_payment_intent_id VARCHAR(180) NULL,
  checkout_url VARCHAR(600) NULL,
  customer_email VARCHAR(190) NULL,
  customer_name VARCHAR(160) NULL,
  customer_phone VARCHAR(40) NULL,
  shipping_address JSON NULL,
  notes TEXT NULL,
  reservation_expires_at DATETIME NULL,
  paid_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_orders_status (status, payment_status),
  INDEX idx_orders_stripe_session (stripe_session_id),
  INDEX idx_orders_customer_email (customer_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  sku VARCHAR(80) NOT NULL,
  name VARCHAR(180) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price_cents INT UNSIGNED NOT NULL,
  unit_cost_cents INT UNSIGNED NULL,
  total_cents INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'stripe',
  provider_payment_id VARCHAR(180) NULL,
  amount_cents INT UNSIGNED NOT NULL,
  status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  paid_at DATETIME NULL,
  raw_payload JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stripe_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(190) NOT NULL UNIQUE,
  event_type VARCHAR(120) NOT NULL,
  processed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admin_users (name, email, password_hash, role)
SELECT 'Administrador', 'admin@gao.local', '$2y$10$dYU3VBsd.mBKrTEvUNy.YOyK5YH0vN0QSvW7D5FZFm0Eko97DPEua', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@gao.local');

INSERT INTO product_categories (name, slug, description, sort_order)
SELECT 'Joias', 'joias', 'Produtos principais da loja', 10
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'joias');

INSERT INTO product_categories (name, slug, description, sort_order)
SELECT 'Servicos', 'servicos', 'Servicos e itens personalizados', 20
WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE slug = 'servicos');
