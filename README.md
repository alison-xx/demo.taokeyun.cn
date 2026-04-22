# 语翼 - AI 智能对话平台

一个基于 Vue 3 + Express 的 AI 智能对话平台，为用户提供多样化的 AI 员工选择和流畅的对话体验。

## 功能特性

### 核心功能
- 🤖 **AI 员工市场** - 提供多位专业的 AI 员工，每个员工拥有独特的角色定位和专业知识
- 💬 **智能对话** - 支持流式输出，实时展示 AI 回复
- 📝 **Markdown 支持** - 对话内容支持 Markdown 渲染，包括代码高亮
- 🔐 **用户认证** - 完整的注册、登录、Token 认证体系
- ⚡ **速率限制** - API 层实现速率限制，防止滥用

### 技术亮点
- 前端：Vue 3 + TypeScript + Composition API + Pinia 状态管理
- 后端：Express + TypeScript + MySQL + JWT 认证
- 样式：Tailwind CSS 现代化样式方案
- 实时通信：Server-Sent Events (SSE) 流式响应
- 安全：bcryptjs 密码加密 + express-rate-limit 速率限制

## 技术栈

### 前端
- **框架**: Vue 3.4 + Composition API
- **构建工具**: Vite 5
- **路由**: Vue Router 4
- **状态管理**: Pinia 3
- **样式**: Tailwind CSS 3.4
- **HTTP 客户端**: Axios
- **Markdown**: marked + highlight.js

### 后端
- **运行时**: Node.js + TypeScript
- **框架**: Express 4
- **数据库**: MySQL + mysql2
- **认证**: JWT + bcryptjs
- **邮件**: Nodemailer
- **开发工具**: nodemon + tsx

## 项目结构

```
demo.taokeyun.cn/
├── api/                          # 后端 API
│   ├── routes/                    # 路由
│   │   ├── auth.ts              # 认证相关接口
│   │   ├── chat.ts              # 对话相关接口
│   │   └── painting.ts          # 绘画相关接口
│   ├── middleware/               # 中间件
│   │   └── rateLimit.ts         # 速率限制
│   ├── migrations/               # 数据库迁移
│   │   └── 001_p1_auth.sql      # 认证表结构
│   ├── app.ts                   # Express 应用入口
│   ├── db.ts                    # 数据库连接
│   ├── index.ts                 # API 路由导出
│   └── server.ts                # 服务器启动
├── src/                          # 前端源码
│   ├── components/              # Vue 组件
│   │   ├── AgentMarket.vue      # AI 员工市场
│   │   ├── AuthModal.vue        # 认证弹窗
│   │   ├── MarkdownMessage.vue  # Markdown 渲染
│   │   ├── SettingsModal.vue    # 设置弹窗
│   │   └── Sidebar.vue          # 侧边栏
│   ├── pages/
│   │   └── HomePage.vue         # 主页
│   ├── stores/                   # Pinia 状态管理
│   │   ├── auth.ts              # 认证状态
│   │   └── chat.ts              # 聊天状态
│   ├── composables/              # 组合式函数
│   │   └── useTheme.ts          # 主题管理
│   ├── utils/                    # 工具函数
│   │   └── request.ts          # HTTP 请求封装
│   ├── data/
│   │   └── employees.ts         # AI 员工数据
│   ├── router/
│   │   └── index.ts             # 路由配置
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 前端入口
├── public/                       # 静态资源
├── dist/                         # 构建输出
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env                         # 环境变量
```

## 快速开始

### 环境要求
- Node.js >= 18
- MySQL >= 8.0

### 安装

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库和 API 密钥
```

### 配置环境变量

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=demo_taokeyun

# JWT 密钥
JWT_SECRET=your_secret_key

# DeepSeek API（AI 对话）
DEEPSEEK_API_KEY=your_api_key

# 邮件服务（找回密码）
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password

# 服务端口
PORT=3001
```

### 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev

# 仅前端
npm run client:dev

# 仅后端
npm run server:dev
```

### 构建生产版本

```bash
npm run build
npm start
```

## API 接口

### 认证接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户信息 |

### 对话接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/chat/stream | 发送消息（流式响应） |
| GET | /api/chat/sessions | 获取会话列表 |
| POST | /api/chat/sessions | 创建新会话 |
| DELETE | /api/chat/sessions/:id | 删除会话 |

## 开发指南

### 代码规范
- 使用 ESLint + TypeScript 检查代码
- 遵循 Vue 3 Composition API 风格
- 组件文件使用 `<script setup lang="ts">` 语法

### 常用命令

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 类型检查
npm run check
```

## License

MIT License
