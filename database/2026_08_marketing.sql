-- Marketing module: campaigns, posts, metrics
-- Run once on production via phpMyAdmin or CLI

CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    goal        ENUM('awareness','engagement','conversion','followers','traffic') DEFAULT 'engagement',
    status      ENUM('draft','active','paused','completed','cancelled') DEFAULT 'draft',
    start_date  DATE,
    end_date    DATE,
    budget_cents INT DEFAULT 0,
    created_by  INT,
    created_at  DATETIME NOT NULL DEFAULT NOW(),
    updated_at  DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketing_posts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    title       VARCHAR(200),
    caption     TEXT,
    platform    ENUM('instagram','facebook','tiktok','youtube','pinterest','threads','whatsapp') DEFAULT 'instagram',
    post_type   ENUM('feed','story','reel','carousel','video') DEFAULT 'feed',
    status      ENUM('draft','scheduled','published','cancelled') DEFAULT 'draft',
    scheduled_at DATETIME,
    published_at DATETIME,
    image_urls  TEXT,
    tags        VARCHAR(500),
    notes       TEXT,
    created_by  INT,
    created_at  DATETIME NOT NULL DEFAULT NOW(),
    updated_at  DATETIME NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_mkt_post_campaign FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS marketing_metrics (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    post_id                 INT NOT NULL,
    reach                   INT DEFAULT 0,
    impressions             INT DEFAULT 0,
    likes                   INT DEFAULT 0,
    comments_count          INT DEFAULT 0,
    saves                   INT DEFAULT 0,
    shares                  INT DEFAULT 0,
    clicks                  INT DEFAULT 0,
    profile_visits          INT DEFAULT 0,
    new_followers           INT DEFAULT 0,
    revenue_attributed_cents INT DEFAULT 0,
    recorded_at             DATETIME NOT NULL DEFAULT NOW(),
    notes                   TEXT,
    CONSTRAINT fk_mkt_metrics_post FOREIGN KEY (post_id) REFERENCES marketing_posts(id) ON DELETE CASCADE
);
