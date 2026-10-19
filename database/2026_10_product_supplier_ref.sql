-- Migration: supplier's own product code (reference used when reordering)
-- Applied automatically by ensure_products_supplier_ref() (app/bootstrap.php) on the first product save.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS supplier_ref VARCHAR(100) NULL DEFAULT NULL
    COMMENT 'Codigo da peca no fornecedor' AFTER sku;
