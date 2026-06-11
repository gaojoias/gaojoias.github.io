-- Migration: suppliers table + product supplier_id column
-- Run this in phpMyAdmin if the 'suppliers' table doesn't exist

CREATE TABLE IF NOT EXISTS suppliers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  email VARCHAR(190) NULL,
  phone VARCHAR(30) NULL,
  document VARCHAR(30) NULL COMMENT 'CNPJ ou CPF',
  contact_person VARCHAR(120) NULL,
  notes TEXT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  logo_url VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_suppliers_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_id BIGINT UNSIGNED NULL AFTER category_id;

ALTER TABLE products
  ADD CONSTRAINT IF NOT EXISTS fk_products_supplier
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;
