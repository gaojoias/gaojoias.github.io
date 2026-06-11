-- Migration: add shipping_cents, dimensions, notes to products
-- Run this in phpMyAdmin after selecting the gaoapp database

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS shipping_cents INT UNSIGNED NULL DEFAULT NULL
    COMMENT 'Custo de frete em centavos' AFTER cost_cents,
  ADD COLUMN IF NOT EXISTS dimensions VARCHAR(100) NULL DEFAULT NULL
    COMMENT 'Ex: 3x2x1 cm' AFTER weight_grams,
  ADD COLUMN IF NOT EXISTS notes TEXT NULL DEFAULT NULL
    COMMENT 'Observacoes internas' AFTER seo_description;
