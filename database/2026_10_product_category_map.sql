-- Migration: products can belong to several categories.
-- products.category_id remains the main category (shown in the store); this table holds all of them.
-- Applied automatically by ensure_product_category_map() (app/bootstrap.php).

CREATE TABLE IF NOT EXISTS product_category_map (
  product_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, category_id),
  INDEX idx_pcm_category (category_id),
  CONSTRAINT fk_pcm_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_pcm_category FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO product_category_map (product_id, category_id, sort_order)
SELECT id, category_id, 0 FROM products WHERE category_id IS NOT NULL;
