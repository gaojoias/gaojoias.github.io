-- Ordens de Serviço — reparos e confecções para o ourives
-- Run once in phpMyAdmin or via CLI

CREATE TABLE IF NOT EXISTS service_orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  os_number        VARCHAR(20)  NOT NULL DEFAULT '',
  customer_id      INT,
  customer_name    VARCHAR(200) NOT NULL,
  customer_phone   VARCHAR(50)  NOT NULL DEFAULT '',
  item_description TEXT         NOT NULL COMMENT 'Descrição do item recebido',
  service_description TEXT      NOT NULL COMMENT 'Serviço a ser realizado',
  status           ENUM('Recebido','Em andamento','Aguardando peca','Concluido','Entregue','Cancelado') NOT NULL DEFAULT 'Recebido',
  promised_at      DATE,
  price_cents      INT          NOT NULL DEFAULT 0 COMMENT 'Valor cobrado do cliente',
  deposit_cents    INT          NOT NULL DEFAULT 0 COMMENT 'Sinal recebido',
  notes            TEXT                  COMMENT 'Observações internas — NÃO aparece na nota do ourives com valores',
  created_by       INT,
  created_at       DATETIME     NOT NULL DEFAULT NOW(),
  updated_at       DATETIME     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_so_status      ON service_orders (status);
CREATE INDEX IF NOT EXISTS idx_so_customer    ON service_orders (customer_name);
CREATE INDEX IF NOT EXISTS idx_so_created_at  ON service_orders (created_at DESC);
