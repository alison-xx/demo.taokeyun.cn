-- P3: 后台管理系统
-- 执行前请先备份数据库: mysqldump lingce_ai > backup_p3.sql

-- ── 1. admin_roles（管理员角色）────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_roles (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(64)  NOT NULL UNIQUE COMMENT 'super_admin / ops_admin / content_reviewer / support / analyst',
  description VARCHAR(256) DEFAULT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admin_roles (name, description) VALUES
  ('super_admin',      '超级管理员，拥有所有权限'),
  ('ops_admin',        '运营管理员，用户+AI员工+数据管理'),
  ('content_reviewer', '内容审核员，仅审核和敏感词管理'),
  ('support',          '客服，仅查看用户和操作日志'),
  ('analyst',          '分析师，仅查看统计数据')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ── 2. admin_permissions（权限定义）──────────────────────────────
CREATE TABLE IF NOT EXISTS admin_permissions (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(128) NOT NULL UNIQUE COMMENT '如 user:edit / agent:create / audit:view',
  name        VARCHAR(128) NOT NULL,
  category    VARCHAR(64)  DEFAULT NULL COMMENT 'user / agent / audit / system / stats',
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admin_permissions (code, name, category) VALUES
  ('user:view',      '查看用户',        'user'),
  ('user:edit',      '编辑用户',        'user'),
  ('user:delete',    '删除用户',        'user'),
  ('user:quota',     '管理用户配额',     'user'),
  ('agent:view',     '查看AI员工',      'agent'),
  ('agent:create',   '创建AI员工',      'agent'),
  ('agent:edit',     '编辑AI员工',      'agent'),
  ('agent:delete',   '删除AI员工',      'agent'),
  ('agent:clone',    '克隆AI员工',      'agent'),
  ('agent:rollback', '回滚AI员工版本',  'agent'),
  ('audit:view',     '查看操作日志',     'audit'),
  ('system:settings','系统设置',         'system'),
  ('stats:view',     '查看统计数据',    'stats'),
  ('stats:realtime', '查看实时数据',    'stats'),
  ('moderation:view','查看审核队列',     'audit'),
  ('moderation:action','审核操作',        'audit'),
  ('sensitive:manage','敏感词管理',       'audit'),
  ('announcement:manage','公告管理',     'system'),
  ('help:manage',    '帮助文章管理',     'system')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ── 3. admin_role_permissions（角色-权限关联）─────────────────
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id  BIGINT UNSIGNED NOT NULL,
  perm_id  BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_role_perm (role_id, perm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- super_admin 拥有所有权限
INSERT IGNORE INTO admin_role_permissions (role_id, perm_id)
SELECT r.id, p.id FROM admin_roles r, admin_permissions p;

-- ops_admin: 用户管理 + AI员工 + 审核 + 统计数据
INSERT IGNORE INTO admin_role_permissions (role_id, perm_id)
SELECT r.id, p.id FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'ops_admin'
  AND p.code IN ('user:view','user:edit','user:delete','user:quota',
                 'agent:view','agent:create','agent:edit','agent:delete','agent:clone',
                 'audit:view','stats:view','stats:realtime',
                 'moderation:view','moderation:action','sensitive:manage',
                 'announcement:manage','help:manage');

-- content_reviewer: 审核 + 敏感词
INSERT IGNORE INTO admin_role_permissions (role_id, perm_id)
SELECT r.id, p.id FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'content_reviewer'
  AND p.code IN ('moderation:view','moderation:action','sensitive:manage');

-- support: 查看用户 + 操作日志
INSERT IGNORE INTO admin_role_permissions (role_id, perm_id)
SELECT r.id, p.id FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'support'
  AND p.code IN ('user:view','audit:view');

-- analyst: 统计数据
INSERT IGNORE INTO admin_role_permissions (role_id, perm_id)
SELECT r.id, p.id FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'analyst'
  AND p.code IN ('stats:view','stats:realtime');

-- ── 4. admin_users（管理员用户）─────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  role_id       BIGINT UNSIGNED NOT NULL,
  status        TINYINT      DEFAULT 1 COMMENT '1正常 0禁用',
  last_login    DATETIME      DEFAULT NULL,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  KEY idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 默认超管: admin / admin123（请在部署后立即修改密码！）
-- 密码哈希: bcrypt cost=12 of 'admin123'
INSERT INTO admin_users (username, password_hash, email, role_id) VALUES
  ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4grwcuhVHhphVhOS', 'admin@example.com',
   (SELECT id FROM admin_roles WHERE name = 'super_admin'))
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- ── 5. admin_operation_logs（操作日志）─────────────────────────
CREATE TABLE IF NOT EXISTS admin_operation_logs (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id      BIGINT UNSIGNED NOT NULL,
  admin_name    VARCHAR(64)  NOT NULL,
  action        VARCHAR(128) NOT NULL COMMENT 'user:disable / quota:edit / agent:delete ...',
  target_type   VARCHAR(64)  DEFAULT NULL COMMENT 'users / user_quotas / ai_agents ...',
  target_id     VARCHAR(64)  DEFAULT NULL,
  before_value  JSON         DEFAULT NULL COMMENT '修改前快照',
  after_value   JSON         DEFAULT NULL COMMENT '修改后快照',
  ip            VARCHAR(45)  DEFAULT NULL,
  user_agent    VARCHAR(512) DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  KEY idx_admin_id (admin_id),
  KEY idx_action (action),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 6. content_moderation_queue（内容审核队列表）────────────
CREATE TABLE IF NOT EXISTS content_moderation_queue (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  message_id  BIGINT UNSIGNED NOT NULL,
  session_id  BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  content     TEXT,
  status      ENUM('pending','approved','rejected','ignored') DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED DEFAULT NULL,
  reviewed_at DATETIME        DEFAULT NULL,
  created_at  DATETIME        DEFAULT CURRENT_TIMESTAMP,
  KEY idx_status (status),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 7. sensitive_words（敏感词库）─────────────────────────────
CREATE TABLE IF NOT EXISTS sensitive_words (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  word        VARCHAR(128) NOT NULL,
  level       ENUM('strict','normal','loose') DEFAULT 'normal',
  replace_to  VARCHAR(64)  DEFAULT '*',
  created_by  BIGINT UNSIGNED DEFAULT NULL,
  created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
  is_active   TINYINT        DEFAULT 1,
  KEY idx_word (word)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 8. announcements（公告）───────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(256) NOT NULL,
  content_md   TEXT,
  content_html  TEXT,
  type          ENUM('notice','update','maintenance') DEFAULT 'notice',
  is_popup      TINYINT      DEFAULT 0 COMMENT '登录后弹窗',
  is_active     TINYINT      DEFAULT 1,
  published_at  DATETIME     DEFAULT NULL,
  created_by    BIGINT UNSIGNED DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 9. help_articles（帮助文章）───────────────────────────────
CREATE TABLE IF NOT EXISTS help_articles (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category     VARCHAR(64)  NOT NULL COMMENT 'getting-started / account / billing / faq',
  title        VARCHAR(256) NOT NULL,
  content_md   TEXT,
  content_html  TEXT,
  slug         VARCHAR(128) NOT NULL UNIQUE,
  sort_order   INT          DEFAULT 0,
  is_published TINYINT      DEFAULT 0,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 10. ai_agent_versions（AI员工版本历史）────────────────────
CREATE TABLE IF NOT EXISTS ai_agent_versions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agent_id     VARCHAR(64)  NOT NULL,
  version      INT          NOT NULL,
  system_prompt TEXT,
  model         VARCHAR(64),
  max_tokens    INT,
  temperature   DECIMAL(3,2),
  top_p         DECIMAL(3,2),
  changed_by    VARCHAR(128)  DEFAULT NULL,
  change_desc   VARCHAR(512) DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  KEY idx_agent_id (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
