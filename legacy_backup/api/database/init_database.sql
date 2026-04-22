-- ============================================================
-- 灵策智算 (Lingce AI) 数据库初始化脚本
-- 使用方法: mysql -u root -p < init_database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lingce_ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lingce_ai`;

-- -----------------------------------------------------------
-- 1. 用户表
-- -----------------------------------------------------------
DROP TABLE IF EXISTS `admin_logs`;
DROP TABLE IF EXISTS `system_configs`;
DROP TABLE IF EXISTS `user_api_keys`;
DROP TABLE IF EXISTS `paintings`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `chat_sessions`;
DROP TABLE IF EXISTS `verification_codes`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `nickname` VARCHAR(50) DEFAULT '' COMMENT '昵称',
    `avatar` VARCHAR(500) DEFAULT '' COMMENT '头像URL',
    `role` ENUM('user', 'admin') DEFAULT 'user' COMMENT '角色',
    `status` TINYINT DEFAULT 1 COMMENT '状态 1正常 0禁用',
    `quota_messages` INT DEFAULT 1000 COMMENT '对话配额',
    `quota_paintings` INT DEFAULT 50 COMMENT '绘画配额',
    `used_messages` INT DEFAULT 0 COMMENT '已用对话次数',
    `used_paintings` INT DEFAULT 0 COMMENT '已用绘画次数',
    `expire_at` DATETIME DEFAULT NULL COMMENT '到期时间',
    `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(45) DEFAULT '' COMMENT '最后登录IP',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -----------------------------------------------------------
-- 2. 验证码表
-- -----------------------------------------------------------
CREATE TABLE `verification_codes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
    `code` VARCHAR(10) NOT NULL COMMENT '验证码',
    `type` ENUM('register', 'login', 'reset_password', 'change_email') NOT NULL COMMENT '类型',
    `used` TINYINT DEFAULT 0 COMMENT '是否已使用 0未使用 1已使用',
    `ip` VARCHAR(45) DEFAULT '' COMMENT '请求IP',
    `expires_at` DATETIME NOT NULL COMMENT '过期时间',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_email_type` (`email`, `type`),
    INDEX `idx_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='验证码表';

-- -----------------------------------------------------------
-- 3. 对话会话表
-- -----------------------------------------------------------
CREATE TABLE `chat_sessions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
    `employee_id` VARCHAR(50) NOT NULL DEFAULT '' COMMENT 'AI员工ID',
    `employee_name` VARCHAR(100) DEFAULT '' COMMENT 'AI员工名称',
    `title` VARCHAR(200) DEFAULT '' COMMENT '会话标题',
    `collaboration_mode` TINYINT DEFAULT 0 COMMENT '协作模式 0单聊 1协作',
    `selected_employees` JSON COMMENT '协作员工列表',
    `message_count` INT DEFAULT 0 COMMENT '消息数量',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_user_employee` (`user_id`, `employee_id`),
    INDEX `idx_updated` (`updated_at` DESC),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='对话会话表';

-- -----------------------------------------------------------
-- 4. 消息表
-- -----------------------------------------------------------
CREATE TABLE `messages` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
    `role` ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
    `content` LONGTEXT NOT NULL COMMENT '消息内容',
    `model_used` VARCHAR(50) DEFAULT '' COMMENT '使用的模型',
    `token_count` INT DEFAULT 0 COMMENT 'Token消耗',
    `metadata` JSON COMMENT '扩展数据',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_session_created` (`session_id`, `created_at` ASC),
    FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- -----------------------------------------------------------
-- 5. 绘画记录表
-- -----------------------------------------------------------
CREATE TABLE `paintings` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
    `prompt` TEXT NOT NULL COMMENT '绘画提示词',
    `negative_prompt` TEXT COMMENT '负面提示词',
    `style` VARCHAR(50) DEFAULT '' COMMENT '风格',
    `size` VARCHAR(20) DEFAULT '1024x1024' COMMENT '尺寸',
    `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
    `reference_image_url` VARCHAR(500) DEFAULT NULL COMMENT '参考图URL',
    `seed` INT DEFAULT NULL COMMENT '随机种子',
    `model` VARCHAR(50) DEFAULT '' COMMENT '模型',
    `generation_time_ms` INT DEFAULT 0 COMMENT '生成耗时(ms)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_user_created` (`user_id`, `created_at` DESC),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='绘画记录表';

-- -----------------------------------------------------------
-- 6. 用户API密钥表
-- -----------------------------------------------------------
CREATE TABLE `user_api_keys` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
    `provider` ENUM('deepseek', 'minimax', 'siliconflow') NOT NULL COMMENT '服务商',
    `key_encrypted` TEXT NOT NULL COMMENT '加密后的API Key',
    `key_hint` VARCHAR(20) DEFAULT '' COMMENT 'Key提示(前4后4)',
    `is_valid` TINYINT DEFAULT 1 COMMENT '是否有效',
    `last_used_at` DATETIME DEFAULT NULL COMMENT '最后使用时间',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_provider` (`user_id`, `provider`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户API密钥表';

-- -----------------------------------------------------------
-- 7. 系统配置表 (含默认数据)
-- -----------------------------------------------------------
CREATE TABLE `system_configs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `config_key` VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    `config_value` TEXT NOT NULL COMMENT '配置值',
    `config_group` VARCHAR(50) DEFAULT 'general' COMMENT '配置分组',
    `description` VARCHAR(255) DEFAULT '' COMMENT '描述',
    `type` ENUM('string', 'int', 'bool', 'json') DEFAULT 'string' COMMENT '值类型',
    `is_public` TINYINT DEFAULT 0 COMMENT '是否公开(前端可读)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_group` (`config_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

INSERT INTO `system_configs` (`config_key`, `config_value`, `config_group`, `description`, `type`, `is_public`) VALUES
('site_name', '灵策智算', 'basic', '站点名称', 'string', 1),
('default_quota_messages', '1000', 'quota', '默认对话配额', 'int', 1),
('default_quota_paintings', '50', 'quota', '默认绘画配额', 'int', 1),
('trial_days', '7', 'quota', '试用天数', 'int', 1),
('smtp_host', '', 'email', 'SMTP服务器', 'string', 0),
('smtp_port', '465', 'email', 'SMTP端口', 'int', 0),
('smtp_user', '', 'email', 'SMTP账号', 'string', 0),
('smtp_pass', '', 'email', 'SMTP密码', 'string', 0),
('register_enabled', '1', 'system', '允许注册', 'bool', 1),
('maintenance_mode', '0', 'system', '维护模式', 'bool', 1);

-- -----------------------------------------------------------
-- 8. 管理员日志表
-- -----------------------------------------------------------
CREATE TABLE `admin_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `admin_id` INT UNSIGNED NOT NULL COMMENT '管理员ID',
    `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
    `target_type` VARCHAR(50) DEFAULT '' COMMENT '目标类型',
    `target_id` INT UNSIGNED DEFAULT 0 COMMENT '目标ID',
    `content` TEXT COMMENT '操作内容',
    `ip` VARCHAR(45) DEFAULT '' COMMENT '操作IP',
    `user_agent` VARCHAR(500) DEFAULT '' COMMENT '浏览器UA',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_admin_action` (`admin_id`, `action`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员日志表';

-- -----------------------------------------------------------
-- 9. 创建默认管理员账号
-- 密码: Admin@2026! (请立即修改!)
-- -----------------------------------------------------------
INSERT INTO `users` (`email`, `password_hash`, `nickname`, `role`, `status`, `quota_messages`, `quota_paintings`) VALUES
('admin@taokeyun.cn', '$2y$10$sUy02JDhBwlFdivSAlqPZuFk4HBFxEYD/g/k1v3GGXWlBBVtrmt/.', '系统管理员', 'admin', 1, -1, -1);

SELECT '✅ 数据库初始化完成!' AS result;
SELECT '✅ 默认管理员: admin@taokeyun.cn / Admin@2026!' AS info;
