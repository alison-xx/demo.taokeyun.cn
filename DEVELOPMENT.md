# 灵策智算 - 系统开发方案

> 项目代号：demo.taokeyun.cn
> 当前版本：v0.1.0（规划中）
> 最后更新：2026-04-22

---

## 目录

- [一、技术架构](#一技术架构)
- [二、技术栈选型](#二技术栈选型)
- [三、数据库设计](#三数据库设计)
- [四、API 接口设计](#四api-接口设计)
- [五、前端路由设计](#五前端路由设计)
- [六、排期计划](#六排期计划)
- [七、关键技术决策](#七关键技术决策)
- [八、风险与依赖](#八风险与依赖)

---

## 一、技术架构

```
┌──────────────────────────────────────────────────────┐
│                     用户端（SPA）                      │
│            Vue 3 + Vite + Pinia + Vue Router          │
│                    TailwindCSS                        │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS / WebSocket
┌─────────────────────────▼────────────────────────────┐
│                   Nginx（反向代理）                    │
│        /api/*  →  Express API   /admin/* → Admin    │
│        /socket/* → WebSocket Server                  │
└─────────────────────────┬────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌─────▼─────┐    ┌────▼──────┐
   │ Express │      │   Admin   │    │ WebSocket │
   │   API   │      │  Backend  │    │   Server  │
   └────┬────┘      └─────┬─────┘    └────┬──────┘
        │                 │                │
   ┌────▼────┐      ┌─────▼─────┐    ┌────▼──────┐
   │  MySQL  │      │   Redis   │    │   Redis   │
   │         │      │（缓存/会话）│    │  （实时）  │
   └─────────┘      └───────────┘    └───────────┘
```

### 架构说明

- **用户端**：现有 Vue 3 + Vite 项目扩展，不做技术栈迁移，改造成本最低。
- **Admin 管理端**：独立 SPA，部署为 `/admin` 路径，与主站共享用户体系但使用独立 RBAC 权限域。
- **Redis 用途**：AI 员工配置缓存、推荐结果缓存、SWR 后台刷新、实时统计聚合、WebSocket 会话存储。
- **WebSocket 用途**：管理员实时大屏推送（在线人数、实时对话数、Token 消耗）。
- **对象存储**：对话导出文件（PDF/Markdown）、系统公告图片。

---

## 二、技术栈选型

### 前端

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3（Composition API） | 现有项目，沿用 |
| 构建 | Vite 5 | 现有项目，沿用 |
| 状态 | Pinia | 现有项目，沿用 |
| 路由 | Vue Router 4 | 现有项目，沿用 |
| 样式 | Tailwind CSS | 现有项目，沿用 |
| HTTP | Axios | 现有项目，沿用 |
| Markdown | marked + highlight.js + dompurify | 现有项目，沿用 |
| 图表 | ECharts / ApexCharts | 管理员后台趋势图 |
| 虚拟滚动 | vue-virtual-scroller | 列表性能优化 |
| 国际化 | vue-i18n | 预留后期扩展 |

### 后端

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Express 4 + TypeScript | 现有项目，沿用 |
| 数据库 | MySQL 8 + mysql2/promise | 现有项目，沿用 |
| 缓存 | Redis | 新增，用于配置缓存、会话、实时统计 |
| WebSocket | ws / Socket.io | 管理员实时大屏 |
| 认证 | JWT（双令牌）+ bcrypt | accessToken + refreshToken |
| 邮件 | Nodemailer | 现有项目，沿用 |
| 短信 | 腾讯云/阿里云 SDK | P1 阶段接入 |
| 对象存储 | S3 兼容（ossutil / minio CLI） | 导出文件存储 |
| 监控 | Sentry | 错误追踪与慢请求监控 |
| 限流 | express-rate-limit | 接口限流 |
| 敏感词 | Double-Array Trie（darts.js） | 高效敏感词匹配 |

### DevOps

| 类别 | 技术 | 说明 |
|------|------|------|
| 容器化 | Docker + Docker Compose | 本地开发与生产部署 |
| Web 服务器 | Nginx | 反向代理、静态资源、SSL |
| CI/CD | GitHub Actions / Gitea Runner | 构建、测试、部署流水线 |
| 监控告警 | Sentry + Webhook | 错误率 / 响应时间告警 |
| 日志 | 结构化日志（pino） + ELK（可选） | 后期扩展 |

---

## 三、数据库设计

> 所有新增表在现有 `lingce_ai` 库中创建。
> 生产操作前必须做 `mysqldump` 全量备份。

### 3.1 用户与认证

#### users 表扩展

```sql
ALTER TABLE users
  ADD COLUMN phone          VARCHAR(20)    DEFAULT NULL COMMENT '手机号',
  ADD COLUMN nickname       VARCHAR(64)    DEFAULT NULL,
  ADD COLUMN avatar         VARCHAR(512)   DEFAULT NULL,
  ADD COLUMN role           ENUM('user','vip','admin') DEFAULT 'user',
  ADD COLUMN status         TINYINT        DEFAULT 1 COMMENT '1正常 0禁用',
  ADD COLUMN onboarded      TINYINT        DEFAULT 0 COMMENT '是否完成引导',
  ADD COLUMN last_login_at  DATETIME       DEFAULT NULL,
  ADD COLUMN last_login_ip  VARCHAR(45)     DEFAULT NULL;
```

#### user_identities（账号绑定）

```sql
CREATE TABLE IF NOT EXISTS user_identities (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL COMMENT '关联 users.id',
  identity_type   ENUM('email','phone','oauth_github',
                       'oauth_google','oauth_wechat') NOT NULL,
  identity_value  VARCHAR(255) NOT NULL COMMENT '邮箱/手机号/openid',
  oauth_provider  VARCHAR(64)   DEFAULT NULL,
  oauth_raw       JSON         DEFAULT NULL COMMENT 'OAuth 原始信息',
  verified        TINYINT      DEFAULT 0,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_identity (identity_type, identity_value),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### refresh_tokens（刷新令牌）

```sql
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  device_info  VARCHAR(255)   DEFAULT NULL COMMENT 'UA/设备描述',
  ip           VARCHAR(45)    DEFAULT NULL,
  token_hash   VARCHAR(128)   NOT NULL COMMENT 'bcrypt 存储',
  expires_at   DATETIME       NOT NULL,
  revoked      TINYINT         DEFAULT 0,
  created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_id (user_id),
  KEY idx_token_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### guest_migration_tokens（游客迁移）

```sql
CREATE TABLE IF NOT EXISTS guest_migration_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  token       VARCHAR(128) NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  guest_sid   VARCHAR(64)  NOT NULL,
  used        TINYINT       DEFAULT 0,
  expires_at  DATETIME     NOT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3.2 对话历史与导出

#### chat_sessions 表扩展

```sql
ALTER TABLE chat_sessions
  ADD COLUMN title           VARCHAR(255)  DEFAULT NULL,
  ADD COLUMN message_count   INT           DEFAULT 0,
  ADD COLUMN tags            JSON          DEFAULT NULL COMMENT '["售前","产品咨询"]',
  ADD COLUMN is_public       TINYINT       DEFAULT 0 COMMENT '是否允许分享',
  ADD COLUMN share_token     VARCHAR(64)   DEFAULT NULL UNIQUE,
  ADD COLUMN created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

#### messages 表扩展

```sql
ALTER TABLE messages
  ADD COLUMN model_used   VARCHAR(64)  DEFAULT NULL,
  ADD COLUMN tokens_used  INT          DEFAULT NULL,
  ADD COLUMN latency_ms   INT          DEFAULT NULL,
  ADD COLUMN feedback     ENUM('like','dislike') DEFAULT NULL;
```

#### message_exports（导出任务）

```sql
CREATE TABLE IF NOT EXISTS message_exports (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  session_id   BIGINT UNSIGNED NOT NULL,
  format       ENUM('pdf','markdown') NOT NULL,
  status       ENUM('pending','processing','done','failed') DEFAULT 'pending',
  file_url     VARCHAR(512)  DEFAULT NULL COMMENT '完成后存储地址',
  error_msg    VARCHAR(512)  DEFAULT NULL,
  created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME      DEFAULT NULL,
  KEY idx_user_id (user_id),
  KEY idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### user_favorites（收藏）

```sql
CREATE TABLE IF NOT EXISTS user_favorites (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  target_type ENUM('agent','session') NOT NULL,
  target_id   BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_target (user_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3.3 AI 员工与管理

#### ai_agents（AI 员工主表）

```sql
CREATE TABLE IF NOT EXISTS ai_agents (
  id              VARCHAR(64)  PRIMARY KEY COMMENT '如 bilibili-strategist',
  name            VARCHAR(128) NOT NULL,
  icon            VARCHAR(64)  DEFAULT NULL COMMENT 'emoji 或头像URL',
  dept            VARCHAR(64)  DEFAULT NULL,
  description     TEXT,
  skills          JSON         DEFAULT NULL COMMENT '技能标签数组',
  system_prompt   TEXT,
  model           VARCHAR(64)  DEFAULT 'deepseek',
  max_tokens      INT          DEFAULT 4096,
  temperature     DECIMAL(3,2) DEFAULT 0.70,
  top_p           DECIMAL(3,2) DEFAULT 0.90,
  price_range     ENUM('free','low','medium','high') DEFAULT 'free',
  tags            JSON         DEFAULT NULL COMMENT '行业/语言/风格标签',
  is_active       TINYINT      DEFAULT 1,
  is_recommended  TINYINT      DEFAULT 0 COMMENT '首页强推',
  sort_order      INT          DEFAULT 0,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### ai_agent_versions（提示词版本历史）

```sql
CREATE TABLE IF NOT EXISTS ai_agent_versions (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agent_id      VARCHAR(64)  NOT NULL,
  version       INT          NOT NULL,
  system_prompt TEXT,
  model         VARCHAR(64),
  max_tokens    INT,
  temperature   DECIMAL(3,2),
  top_p         DECIMAL(3,2),
  changed_by    VARCHAR(128)  DEFAULT NULL COMMENT '操作人',
  change_desc   VARCHAR(512) DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  KEY idx_agent_id (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### user_quotas（用户配额）

```sql
CREATE TABLE IF NOT EXISTS user_quotas (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT UNSIGNED NOT NULL UNIQUE,
  plan_type     ENUM('free','monthly','yearly','custom') DEFAULT 'free',
  chat_limit    INT          DEFAULT 50 COMMENT '每月提问次数上限',
  paint_limit   INT          DEFAULT 10 COMMENT '每月绘图次数上限',
  used_chats    INT          DEFAULT 0,
  used_paints   INT          DEFAULT 0,
  quota_reset_at DATETIME     DEFAULT NULL COMMENT '每月底重置时间',
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3.4 推荐系统

#### recommendation_feedback（推荐反馈）

```sql
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
```

#### onboarding_answers（引导问卷）

```sql
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
```

### 3.5 后台管理与安全

#### admin_roles（管理员角色）

```sql
CREATE TABLE IF NOT EXISTS admin_roles (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(64)  NOT NULL UNIQUE COMMENT 'super_admin / ops_admin / content_reviewer / support',
  description VARCHAR(256) DEFAULT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### admin_permissions（权限定义）

```sql
CREATE TABLE IF NOT EXISTS admin_permissions (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(128) NOT NULL UNIQUE COMMENT '如 user:edit / agent:create / audit:view',
  name        VARCHAR(128) NOT NULL,
  category    VARCHAR(64)  DEFAULT NULL COMMENT 'user / agent / audit / system',
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### admin_role_permissions（角色-权限关联）

```sql
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id  BIGINT UNSIGNED NOT NULL,
  perm_id  BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_role_perm (role_id, perm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### admin_users（管理员用户）

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(64)  NOT NULL UNIQUE,
  password_hash VARCHAR(128) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  role_id       BIGINT UNSIGNED NOT NULL,
  status        TINYINT      DEFAULT 1 COMMENT '1正常 0禁用',
  last_login    DATETIME     DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  KEY idx_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### admin_operation_logs（操作日志）

```sql
CREATE TABLE IF NOT EXISTS admin_operation_logs (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id      BIGINT UNSIGNED NOT NULL,
  admin_name    VARCHAR(64)  NOT NULL,
  action        VARCHAR(128) NOT NULL COMMENT 'user:disable / quota:edit ...',
  target_type   VARCHAR(64)  DEFAULT NULL,
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
```

#### content_moderation_queue（内容审核队列）

```sql
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
```

#### sensitive_words（敏感词库）

```sql
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
```

#### announcements（公告）

```sql
CREATE TABLE IF NOT EXISTS announcements (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(256) NOT NULL,
  content_md    TEXT,
  content_html  TEXT,
  type          ENUM('notice','update','maintenance') DEFAULT 'notice',
  is_popup      TINYINT      DEFAULT 0 COMMENT '登录后弹窗',
  is_active     TINYINT      DEFAULT 1,
  published_at  DATETIME     DEFAULT NULL,
  created_by    BIGINT UNSIGNED DEFAULT NULL,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### help_articles（帮助文章）

```sql
CREATE TABLE IF NOT EXISTS help_articles (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category     VARCHAR(64)  NOT NULL COMMENT 'getting-started / account / billing / faq',
  title        VARCHAR(256) NOT NULL,
  content_md   TEXT,
  content_html TEXT,
  slug         VARCHAR(128) NOT NULL UNIQUE,
  sort_order   INT          DEFAULT 0,
  is_published TINYINT      DEFAULT 0,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 四、API 接口设计

### 4.1 用户与认证 `/api/auth/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/auth/register/email` | 邮箱注册 | 否 |
| POST | `/auth/login/email` | 邮箱登录（返回 access + refresh） | 否 |
| POST | `/auth/refresh` | 刷新 accessToken | RefreshToken |
| POST | `/auth/logout` | 注销 refreshToken | accessToken |
| POST | `/auth/oauth/:provider` | OAuth 跳转/回调（GitHub/Google） | 否 |
| POST | `/auth/password-reset/send-code` | 发送重置密码邮件验证码 | 否 |
| POST | `/auth/password-reset/confirm` | 确认重置密码 | 否 |
| GET | `/auth/profile` | 获取个人资料 | accessToken |
| PUT | `/auth/profile` | 修改昵称/头像/手机号 | accessToken |
| POST | `/auth/phone/send-code` | 发送短信验证码 | accessToken |
| POST | `/auth/phone/bind` | 绑定手机号（先验短信码） | accessToken |
| GET | `/auth/sessions` | 查询已登录设备列表 | accessToken |
| DELETE | `/auth/sessions/:id` | 吊销某一设备令牌 | accessToken |
| DELETE | `/auth/sessions` | 吊销所有其他设备令牌 | accessToken |
| POST | `/auth/guest/migrate` | 游客 → 正式账户数据迁移 | MigrationToken |

### 4.2 对话历史 `/api/chat/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/chat/sessions` | 分页查询会话（支持搜索/标签/时间） | accessToken |
| POST | `/chat/session/create` | 创建新会话 | accessToken |
| GET | `/chat/sessions/:id` | 获取单个会话（含消息） | accessToken |
| DELETE | `/chat/sessions/:id` | 删除会话 | accessToken |
| PUT | `/chat/sessions/:id/tags` | 修改会话标签 | accessToken |
| POST | `/chat/sessions/:id/share` | 生成分享链接 | accessToken |
| GET | `/chat/shared/:token` | 通过分享 token 访问 | 否 |
| POST | `/chat/messages/:id/feedback` | 对 AI 回复点赞/点踩 | accessToken |
| GET | `/chat/exports` | 查询导出任务列表 | accessToken |
| POST | `/chat/exports` | 创建导出任务（异步） | accessToken |
| GET | `/chat/exports/:id` | 查询导出任务状态/下载地址 | accessToken |
| GET | `/chat/favorites` | 查询收藏列表 | accessToken |
| POST | `/chat/favorites` | 添加收藏 | accessToken |
| DELETE | `/chat/favorites/:id` | 取消收藏 | accessToken |

### 4.3 AI 员工 `/api/agents/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/agents` | 列表（支持标签/行业/价格筛选） | 否 |
| GET | `/agents/recommended` | 首页推荐 Top-3（含推荐理由） | accessToken |
| GET | `/agents/:id` | 员工详情 | 否 |
| POST | `/agents/recommendation/feedback` | 上报推荐点击/采纳/忽略 | accessToken |

### 4.4 引导与问卷 `/api/onboarding/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/onboarding/status` | 查询引导完成状态 | accessToken |
| POST | `/onboarding/answers` | 提交首次问卷答案 | accessToken |
| POST | `/onboarding/complete` | 标记引导完成 | accessToken |
| GET | `/onboarding/guide-steps` | 获取引导蒙层步骤配置 | accessToken |

### 4.5 配额与计费 `/api/billing/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/billing/quota` | 当前配额使用情况 | accessToken |
| GET | `/billing/plans` | 可购套餐列表 | 否 |
| POST | `/billing/orders` | 创建充值订单（预留） | accessToken |
| GET | `/billing/usage/daily` | 每日用量（最近30天） | accessToken |

### 4.6 管理后台 `/api/admin/*`

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | `/admin/auth/login` | 管理员登录 | 否 |
| GET | `/admin/auth/me` | 当前管理员信息 | AdminToken |
| GET | `/admin/users` | 用户列表（分页+模糊搜索） | admin |
| PUT | `/admin/users/:id` | 编辑用户（状态/配额/角色） | admin |
| DELETE | `/admin/users/:id` | 删除用户 | admin |
| GET | `/admin/users/:id/logs` | 操作日志 | admin |
| GET | `/admin/agents` | AI员工列表 | admin |
| POST | `/admin/agents` | 新增AI员工 | admin |
| PUT | `/admin/agents/:id` | 编辑AI员工 | admin |
| DELETE | `/admin/agents/:id` | 删除AI员工 | admin |
| POST | `/admin/agents/:id/clone` | 克隆AI员工 | admin |
| GET | `/admin/agents/:id/versions` | 版本历史 | admin |
| POST | `/admin/agents/:id/rollback/:vid` | 回滚到指定版本 | admin |
| POST | `/admin/agents/config-cache/refresh` | 手动刷新 Redis 缓存 | admin |
| GET | `/admin/moderation/queue` | 待审核内容列表 | reviewer |
| POST | `/admin/moderation/batch` | 批量审核（通过/拒绝/忽略） | reviewer |
| GET | `/admin/announcements` | 公告列表 | admin |
| POST | `/admin/announcements` | 新增公告 | admin |
| PUT | `/admin/announcements/:id` | 编辑公告 | admin |
| GET | `/admin/help/articles` | 帮助文章列表 | admin |
| POST | `/admin/help/articles` | 新增帮助文章 | admin |
| PUT | `/admin/help/articles/:id` | 编辑帮助文章 | admin |
| GET | `/admin/sensitive-words` | 敏感词列表 | admin |
| POST | `/admin/sensitive-words` | 新增敏感词 | admin |
| DELETE | `/admin/sensitive-words/:id` | 删除敏感词 | admin |
| POST | `/admin/sensitive-words/rebuild-cache` | 重建 Trie 缓存 | admin |
| GET | `/admin/logs/operations` | 操作日志（分页+操作类型筛选） | admin |
| GET | `/admin/stats/overview` | 统计概览（用户/会话/Token） | admin |
| GET | `/admin/stats/trends` | 趋势数据（日/周/月） | admin |
| GET | `/admin/stats/agents` | AI员工使用排行 | admin |
| GET | `/admin/realtime/stats` | 实时统计（WebSocket 优先，HTTP 兜底） | admin |

---

## 五、前端路由设计

### 5.1 用户端（主 SPA）

```
/                            # 首页（AgentMarket + 快捷入口）
/chat                        # 聊天页（选员工 → 对话）
/chat/:sessionId             # 恢复历史会话
/chat/shared/:token           # 分享页（无需登录）
/profile                      # 个人中心（资料/配额/收藏）
/profile/history              # 对话历史（搜索/筛选）
/profile/settings             # 账号设置（安全/通知/主题）
/auth/login                   # 登录（弹窗与URL并存）
/auth/register                # 注册
/auth/forgot-password         # 忘记密码
/help                         # 帮助中心
/help/:slug                   # 帮助文章
/announcement/:id             # 公告详情
```

### 5.2 管理端（独立 SPA，/admin 路径）

```
/admin/login                  # 管理员登录
/admin                        # 管理后台首页（实时大屏）
/admin/users                  # 用户管理
/admin/users/:id/edit         # 编辑用户/配额
/admin/agents                 # AI员工管理
/admin/agents/new             # 新增员工
/admin/agents/:id/edit        # 编辑员工
/admin/agents/:id/versions    # 版本历史
/admin/agents/:id/clone       # 克隆员工
/admin/moderation              # 内容审核
/admin/announcements          # 公告管理
/admin/help                    # 帮助文章管理
/admin/sensitive-words         # 敏感词管理
/admin/logs                    # 操作日志
/admin/stats                  # 统计与分析
/admin/settings               # 系统设置（限流/配额规则/SMTP等）
```

---

## 六、排期计划

### P0：发布门禁与安全治理（1~2 周）

> **上线前必须完成，不完成不能发布。**

| 任务 | 详情 | 预计工时 |
|------|------|---------|
| 移除硬编码密钥 | DB 密码、JWT 默认密钥改为强制环境变量，缺失时进程启动失败 | 1h |
| 添加 ESLint 配置 | 创建 `.eslintrc.js`，配置 Vue + TypeScript，执行 `lint:fix` | 2h |
| 接口限流 | `express-rate-limit`，默认 200 req/min/IP，登录接口单独限制 | 2h |
| 密码安全加固 | 所有注册/修改密码强制 bcrypt，salt rounds = 12 | 1h |
| 操作审计日志中间件 | 所有 admin 接口写入 `admin_operation_logs` | 3h |
| Sentry 接入 | 前后端均接入，设置慢请求标记与错误率告警 | 3h |
| 基础告警 | 错误率 > 5% / 响应 > 2s 触发邮件 + Webhook | 2h |
| 发布流水线 | `check -> lint -> test -> build -> smoke-test -> deploy` | 3h |

### P1：用户闭环（2~3 周）

| 任务 | 详情 |
|------|------|
| 双令牌认证 | accessToken（15min）+ refreshToken（7d），独立 `refresh_tokens` 表，登录设备管理 |
| 手机号绑定 | 新增 `user_identities`、短信验证码（接入腾讯云/阿里云） |
| OAuth 接入 | GitHub + Google，统一 `user_identities` 账号绑定 |
| 游客迁移 | 匿名会话 + `guest_migration_tokens`，注册后一键迁移历史 |
| 历史持久化增强 | 标签、搜索（MySQL FULLTEXT）、时间筛选、分页 |
| 对话导出 | 异步任务生成 PDF/Markdown，完成后站内通知 |
| 收藏功能 | 收藏 AI 员工/会话，增删查 |

### P2：体验与推荐（2~3 周）

| 任务 | 详情 |
|------|------|
| 新手引导 | 蒙层步骤组件 + 进度条，`users.onboarded` 控制，首次登录强制，完成后可重触发 |
| AI 员工推荐 | 标签体系 + 混合推荐（内容 + 协同 + 实时意图），输出 Top-3 + 理由 |
| 移动端适配 | 底部四栏导航，AI 员工卡片响应式 3→2→1 列 |
| Skeleton 组件 | 统一封装局部/全屏两种，错误态标准化 |
| Toast 系统 | 统一 3s 消失，最多堆叠 5 条，支持 success/error/warning/info |
| 打字机效果 | AI 回复可配置 30~80 字/秒，支持关闭 |
| 错误处理卡片 | 4xx / 5xx / 超时 / 额度四类，含插画 + 重试按钮 |
| 主题切换 | CSS 变量 + `localStorage.theme`，SSR 防闪烁注入 |
| 输入框增强 | `/润色 /翻译 /总结` 快捷指令，WebSpeech 语音输入，`Ctrl+Enter` 发送 |

### P3：后台管理系统（3~4 周）

| 模块 | 任务 |
|------|------|
| Admin 认证 | 独立 `admin_users` 表，JWT，角色绑定 |
| RBAC | `admin_roles` + `admin_permissions` + 中间件，权限到按钮级 |
| 用户管理 | 分页、模糊搜索、状态切换、配额编辑（含操作日志） |
| AI 员工管理 | CRUD、克隆、版本历史、回滚，修改后刷新 Redis |
| 实时大屏 | WebSocket 推送在线人数/对话数/Token 消耗，ECharts 图表 |
| 趋势统计 | 日/周/月新增用户、留存率、热门 AI 员工排行 |
| 内容审核 | 三级审核（通过/拒绝/忽略），批量操作，结果回写会话 |
| 敏感词管理 | 后台增删，Trie 树重建缓存，命中后替换并记录 |
| 公告与帮助 | 富文本编辑器，Markdown + 图片上传，版本 Diff |
| 操作日志 | `admin_operation_logs` 分页查看，who/when/what/IP 全记录 |

### P4：性能与质量（持续）

| 任务 | 目标 |
|------|------|
| 代码分包 | 路由级 + 组件级分包，请求数 ≤ 12 |
| 虚拟滚动 | AI 员工列表、历史列表单屏 DOM < 100 |
| 图片优化 | 转 WebP，CDN 分发，`Cache-Control: max-age=31536000, immutable` |
| SWR 缓存 | AI 员工配置/热门问题 5 分钟缓存后台刷新 |
| 单元测试 | 认证流程、推荐算法、敏感词过滤覆盖率 ≥ 80% |
| E2E 测试 | 注册→登录→引导→对话→导出→分享全链路 |
| OWASP 扫描 | 通过 Top10 安全扫描 |
| Lighthouse | FCP < 1.5s、LCP < 2.5s、列表滚动 ≥ 55fps |
| 文档交付 | Swagger API 文档、部署手册、运维手册、FAQ、更新日志模板 |

---

## 七、关键技术决策

| 问题 | 决策 | 理由 |
|------|------|------|
| JWT 刷新方案 | 独立 `refresh_tokens` 表 + 设备管理，不用滑动窗口 | 支持多设备登出、令牌主动吊销，比滑动窗口更安全可控 |
| 推荐算法 | 初期内容过滤（标签匹配），后期迭代协同过滤 | 内容过滤无冷启动，上线快；协同过滤需积累足够行为数据后再上 |
| 移动端导航 | 底部 Tab 4 栏，不做 PWA | 与现有设计一致，改造成本低；PWA 可在 P3 后评估 |
| AI 员工配置缓存 | 修改后写入 Redis TTL=5min，监听 DB 变更主动刷新 | 减轻 MySQL 压力，同时保证配置变更在分钟内生效 |
| 导出方案 | 异步任务 + 对象存储，站内通知 | PDF 生成耗时，不适合同步；对象存储降低服务器磁盘压力 |
| 管理员与用户隔离 | 独立 `admin_users` 表，JWT 独立签发 | 隔离普通用户与管理员身份，安全边界清晰 |
| 敏感词匹配 | Double-Array Trie（darts.js） | O(n) 线性时间复杂度，支持大规模词库实时匹配 |
| WebSocket 实时 | ws 库，Redis Pub/Sub 多实例广播 | 轻量、支持水平扩展，Redis Pub/Sub 保证多实例一致性 |

---

## 八、风险与依赖

| 风险 | 影响 | 缓解方案 |
|------|------|---------|
| 短信/推送供应商依赖 | 高（P1 功能不完整） | 预留接口抽象层，可切换供应商而不改业务代码 |
| 推荐算法效果不确定 | 中（初期标签体系可能不准） | P2 先上基于规则的内容过滤，算法版本迭代到 P3 以后 |
| 历史数据迁移 | 中（已有 sessions 表结构改动） | 写好 ALTER 脚本，先在测试环境验证，保留回滚方案 |
| OAuth 域白名单 | 低（GitHub/Google 无需白名单） | WeChat 需要域名备案，前期可先不做 GitHub/Google 已够用 |
| Redis 故障 | 低（配置缓存降级到 DB，实时统计降级为拉模式） | 降级方案已在架构设计中体现 |
| 生产数据库结构变更 | 高（数据丢失风险） | 所有 ALTER 前必须 `mysqldump` 全量备份，先在测试库验证 |

---

## 附录：环境变量清单

上线前需在服务器配置以下环境变量（或使用 .env 文件由 dotenvx 管理）：

```bash
# 数据库
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=lingce_ai

# JWT（必须设置，不允许硬编码兜底）
JWT_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# AI API Keys
DEEPSEEK_API_KEY=
MINIMAX_API_KEY=
SILICONFLOW_API_KEY=

# SMTP（邮件发送）
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# SMS（短信，P1 阶段）
SMS_PROVIDER=tencent|aliyun
SMS_SECRET_ID=
SMS_SECRET_KEY=
SMS_APP_ID=

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Sentry
SENTRY_DSN_FRONTEND=
SENTRY_DSN_BACKEND=

# 对象存储（P1 阶段导出文件）
OSS_ENDPOINT=
OSS_BUCKET=
OSS_ACCESS_KEY=
OSS_SECRET_KEY=

# Webhook（告警通知）
ALERT_WEBHOOK_URL=
```

---

*本文档由系统自动生成，如有变更请同步更新。*
