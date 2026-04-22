-- P2: 新手引导 + AI员工标签 + 推荐系统
-- 执行前请先备份数据库: mysqldump lingce_ai > backup_p2.sql

-- ── 1. onboarding_answers（引导问卷）───────────────────────────────
CREATE TABLE IF NOT EXISTS onboarding_answers (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  industry    VARCHAR(128) DEFAULT NULL COMMENT '所在行业',
  use_case    VARCHAR(256) DEFAULT NULL COMMENT '主要使用场景',
  language    VARCHAR(32)  DEFAULT NULL COMMENT '偏好语言',
  style       VARCHAR(64)  DEFAULT NULL COMMENT '内容风格偏好',
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 2. ai_agents 扩展 ───────────────────────────────────────────
ALTER TABLE ai_agents
  ADD COLUMN tags           JSON  DEFAULT NULL COMMENT '["行业:B站内容","语言:中文","风格:专业","价格:free"]',
  ADD COLUMN skills        JSON  DEFAULT NULL COMMENT '["视频数据分析","标题文案优化","内容矩阵规划"]',
  ADD COLUMN is_recommended TINYINT DEFAULT 0 COMMENT '首页强推',
  ADD COLUMN sort_order    INT   DEFAULT 0,
  ADD COLUMN is_active     TINYINT DEFAULT 1;

-- ── 3. recommendation_feedback（推荐反馈）──────────────────────
CREATE TABLE IF NOT EXISTS recommendation_feedback (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  agent_id   VARCHAR(64)  NOT NULL,
  action     ENUM('shown','clicked','started','completed','dismissed') NOT NULL,
  score      DECIMAL(5,4) DEFAULT NULL COMMENT '0~1 满意度',
  session_id BIGINT UNSIGNED DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id),
  KEY idx_agent_id (agent_id),
  KEY idx_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── 4. 初始化示例AI员工标签数据 ─────────────────────────────────
INSERT INTO ai_agents (id, name, icon, dept, description, system_prompt, tags, skills, is_recommended, sort_order, is_active)
VALUES
('bilibili-strategist', 'B站内容策略师', '📺', '内容运营', '专注B站内容策略，帮你分析视频数据、优化标题文案、规划内容矩阵、预测热点趋势',
 '你是一位专业的B站内容策略师，...',
 '["行业:B站内容","语言:中文","风格:专业","价格:free"]',
 '["视频数据分析","标题文案优化","内容矩阵规划","热点预测"]',
 1, 1, 1)
ON DUPLICATE KEY UPDATE
  tags = VALUES(tags),
  skills = VALUES(skills),
  is_recommended = VALUES(is_recommended),
  sort_order = VALUES(sort_order),
  is_active = VALUES(is_active);
