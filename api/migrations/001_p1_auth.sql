-- P1: 用户认证体系扩展
-- 执行前请先备份数据库: mysqldump lingce_ai > backup_p1.sql

-- ── 1. user_identities（账号统一绑定）───────────────────────────────
CREATE TABLE IF NOT EXISTS user_identities (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '关联 users.id',
  identity_type   ENUM('email','phone','oauth_github','oauth_google','oauth_wechat') NOT NULL,
  identity_value  VARCHAR(255) NOT NULL COMMENT '邮箱/手机号/openid',
  oauth_provider  VARCHAR(64)   DEFAULT NULL,
  oauth_raw      JSON         DEFAULT NULL COMMENT 'OAuth 原始信息',
  verified        TINYINT      DEFAULT 0,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_identity (identity_type, identity_value),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 迁移已有邮箱到 user_identities（已有 users.email 字段保持兼容）
INSERT IGNORE INTO user_identities (user_id, identity_type, identity_value, verified, created_at)
SELECT id, 'email', email, 1, created_at FROM users WHERE email IS NOT NULL AND email != '';

-- ── 2. refresh_tokens（刷新令牌）───────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  device_info  VARCHAR(255)   DEFAULT NULL COMMENT 'UA/设备描述',
  ip           VARCHAR(45)    DEFAULT NULL,
  token_hash   VARCHAR(128)  NOT NULL COMMENT 'bcrypt 存储的 token hash',
  expires_at   DATETIME       NOT NULL,
  revoked      TINYINT        DEFAULT 0,
  created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id),
  KEY idx_token_hash (token_hash),
  KEY idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 3. guest_migration_tokens（游客迁移）──────────────────────────
CREATE TABLE IF NOT EXISTS guest_migration_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  token       VARCHAR(128) NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  guest_sid   VARCHAR(64)  NOT NULL COMMENT '对应游客 session_id',
  used        TINYINT       DEFAULT 0,
  expires_at  DATETIME     NOT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_token (token),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 4. verification_codes 扩展 ──────────────────────────────────
ALTER TABLE verification_codes
  ADD COLUMN attempts   INT      DEFAULT 0 COMMENT '验证尝试次数',
  ADD COLUMN ip         VARCHAR(45) DEFAULT NULL COMMENT '请求IP';

-- ── 5. user_quotas（用户配额）───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_quotas (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL UNIQUE,
  plan_type      ENUM('free','monthly','yearly','custom') DEFAULT 'free',
  chat_limit     INT          DEFAULT 50 COMMENT '每月提问上限',
  paint_limit    INT          DEFAULT 10 COMMENT '每月绘图上限',
  used_chats     INT          DEFAULT 0,
  used_paints    INT          DEFAULT 0,
  quota_reset_at DATETIME      DEFAULT NULL,
  created_at     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 6. users 扩展 ────────────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN phone          VARCHAR(20)   DEFAULT NULL COMMENT '手机号',
  ADD COLUMN onboarded      TINYINT       DEFAULT 0 COMMENT '是否完成新手引导',
  ADD COLUMN last_login_at  DATETIME      DEFAULT NULL,
  ADD COLUMN last_login_ip  VARCHAR(45)    DEFAULT NULL;
