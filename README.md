# 灵策 AI - 智能企业员工协作平台

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.4-42b883?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**灵策 AI** 是一款基于大语言模型的智能对话平台，为企业提供多样化的 AI 员工选择。用户可以根据需求选择不同部门的专业 AI 员工，获得精准的运营策略、销售技巧、内容创作等全方位支持。

🚀 **在线体验**: https://demo.taokeyun.cn

</div>

---

## 🎯 产品简介

在当今数字化时代，企业需要应对多平台、多场景的运营挑战。**灵策 AI** 应运而生——我们将 AI 能力封装成专业的"数字员工"，覆盖引流获客、销售转化、内容创作、客户服务等核心业务场景。

每个 AI 员工都经过专项训练，具备该领域的专业知识和实战经验，能够为用户提供切实可行的建议和方案。

---

## ✨ 核心功能

### 🤖 AI 员工市场

平台汇聚了多个部门的专业 AI 员工，用户可以根据需求自由选择：

| 部门 | AI 员工 | 专长领域 |
|------|---------|---------|
| **引流部** | 📺 B站内容策略师 | B站数据分析、爆款标题、热点预测、内容矩阵 |
| **引流部** | 🎵 抖音策略师 | 抖音算法、短视频策划、带货转化、DOU+投放 |
| **引流部** | 📕 小红书策略师 | 种草笔记、KOL合作、话题运营、素人矩阵 |
| **销售部** | 🎯 Discovery教练 | 需求挖掘、提问技巧、痛点分析、方案呈现 |
| **销售部** | 📊 Pipeline分析师 | 漏斗优化、阶段定义、转化提升、预测模型 |
| **创作部** | 🎨 AI绘画师 | 文生图、多风格生成、多尺寸输出、高清呈现 |
| **营销部** | 🎙️ 播客内容策略师 | 选题策划、脚本创作、嘉宾邀约、运营增长 |
| **客服部** | 💬 客服响应者 | 话术设计、投诉处理、好评引导、流程优化 |

### 💬 智能对话

- **流式输出**：实时展示 AI 回复，打字机效果
- **Markdown 渲染**：支持代码高亮、表格、列表等格式
- **追问建议**：AI 自动生成追问建议，快速深入话题
- **会话管理**：支持创建、切换、删除多个对话会话

### 👥 群聊协作模式

创新性的多 AI 员工协作模式：
- 选择多个 AI 员工同时参与讨论
- 各 AI 从不同专业视角给出建议
- 获取更全面、立体的解决方案

### 🎨 AI 绘画

强大的文生图能力：
- 输入文字描述即可生成精美图片
- 支持多种艺术风格
- 多种输出尺寸可选

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 说明 |
|------|------|
| **Vue 3.4** | 渐进式 JavaScript 框架，采用 Composition API |
| **TypeScript** | 类型安全的 JavaScript 超集 |
| **Vite 5** | 下一代前端构建工具，快速热更新 |
| **Pinia** | Vue 3 官方推荐的状态管理库 |
| **Vue Router 4** | Vue.js 官方路由管理器 |
| **Tailwind CSS** | 原子化 CSS 框架，快速构建现代化 UI |
| **Axios** | Promise-based HTTP 客户端 |
| **marked + highlight.js** | Markdown 解析与代码高亮 |

### 后端技术栈

| 技术 | 说明 |
|------|------|
| **Express 4** | 简洁灵活的 Node.js Web 应用框架 |
| **TypeScript** | 后端同样采用 TypeScript 开发 |
| **MySQL** | 关系型数据库，存储用户和会话数据 |
| **JWT** | JSON Web Token 用户身份认证 |
| **bcryptjs** | 密码加密存储 |
| **express-rate-limit** | API 速率限制，防止滥用 |

### AI 能力集成

| 服务 | 用途 |
|------|------|
| **DeepSeek** | 主 AI 模型，强大的中文理解和生成能力 |
| **MiniMax** | 备用 AI 模型，支持多种场景 |
| **SiliconFlow** | AI 绘画服务，支持 Stable Diffusion |

---

## 📁 项目结构

```
demo.taokeyun.cn/
├── api/                          # Express 后端
│   ├── routes/                   # API 路由
│   │   ├── auth.ts              # 认证接口（注册/登录/登出）
│   │   ├── chat.ts             # 对话接口（发送消息/会话管理）
│   │   └── painting.ts         # 绘画接口
│   ├── middleware/
│   │   └── rateLimit.ts        # 速率限制中间件
│   ├── migrations/
│   │   └── 001_p1_auth.sql     # 数据库初始化脚本
│   ├── app.ts                   # Express 应用配置
│   ├── db.ts                    # MySQL 数据库连接
│   ├── index.ts                 # 路由统一导出
│   └── server.ts                # 服务器启动入口
│
├── src/                          # Vue 前端源码
│   ├── components/              # UI 组件
│   │   ├── AgentMarket.vue     # AI 员工市场（部门分类展示）
│   │   ├── AuthModal.vue       # 登录/注册弹窗
│   │   ├── MarkdownMessage.vue # Markdown 内容渲染
│   │   ├── SettingsModal.vue   # 设置弹窗
│   │   └── Sidebar.vue         # 侧边栏（会话列表）
│   ├── pages/
│   │   └── HomePage.vue        # 主页（对话界面）
│   ├── stores/                  # Pinia 状态管理
│   │   ├── auth.ts             # 用户认证状态
│   │   └── chat.ts             # 聊天会话状态
│   ├── composables/
│   │   └── useTheme.ts         # 主题切换逻辑
│   ├── utils/
│   │   └── request.ts          # Axios 请求封装
│   ├── data/
│   │   └── employees.ts        # AI 员工配置数据
│   ├── router/
│   │   └── index.ts            # 路由配置
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 前端入口文件
│
├── public/                       # 静态资源
├── .env                         # 环境变量配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.x
- **MySQL**: >= 8.0
- **npm**: >= 9.x

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/z785976928/demo.taokeyun.cn.git
cd demo.taokeyun.cn

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env .env.local
# 编辑 .env.local，填写必要的配置信息
```

### 环境变量配置

```env
# ===================
# 数据库配置
# ===================
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=lingce_ai

# ===================
# JWT 认证
# ===================
JWT_SECRET=your_super_secret_jwt_key_here

# ===================
# AI 模型 API Keys
# ===================
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
MINIMAX_API_KEY=xxxxxxxxxxxxxxxx

# ===================
# AI 绘画服务（可选）
# ===================
SILICONFLOW_API_KEY=sk-xxxxxxxxxxxxxxxx

# ===================
# 邮件服务（可选，用于找回密码）
# ===================
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password

# ===================
# 服务配置
# ===================
PORT=3001
```

### 启动开发服务器

```bash
# 启动前端 + 后端（推荐）
npm run dev

# 单独启动
npm run client:dev   # 前端开发模式
npm run server:dev   # 后端开发模式（nodemon 热重载）
```

### 构建生产版本

```bash
# 构建前端资源
npm run build

# 启动生产服务器
npm start
```

---

## 📡 API 接口

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| `POST` | `/api/auth/register` | 用户注册 |
| `POST` | `/api/auth/login` | 用户登录 |
| `POST` | `/api/auth/logout` | 用户登出 |
| `GET` | `/api/auth/me` | 获取当前用户信息 |

### 对话接口

| 方法 | 路径 | 描述 |
|------|------|------|
| `GET` | `/api/chat/sessions` | 获取会话列表（分页） |
| `POST` | `/api/chat/session/create` | 创建新会话 |
| `GET` | `/api/chat/messages` | 获取指定会话的消息 |
| `POST` | `/api/chat/session/delete` | 删除会话 |
| `POST` | `/api/chat/stream` | **流式对话**（SSE） |

### 绘画接口

| 方法 | 路径 | 描述 |
|------|------|------|
| `POST` | `/api/painting/generate` | 生成 AI 绘画 |

---

## 🎨 界面预览

### AI 员工市场

在首页可以浏览所有 AI 员工，按照部门分类展示。每个 AI 员工卡片包含：
- 🎭 角色图标
- 📝 角色名称和描述
- 🛠️ 专长技能标签
- ▶️ 开始对话按钮

### 智能对话

- 左侧边栏：会话列表管理
- 中间区域：消息展示（支持 Markdown）
- 底部输入框：发送消息

### 协作模式

在设置中开启协作模式，可以选择多个 AI 员工同时参与对话，获取多角度的分析和建议。

---

## 🛠️ 开发指南

### 代码规范

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# TypeScript 类型检查
npm run check
```

### 数据库迁移

首次部署需要执行数据库迁移脚本：

```bash
mysql -u your_user -p your_database < api/migrations/001_p1_auth.sql
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 License

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🔗 相关链接

- 🌐 **在线体验**: https://demo.taokeyun.cn
- 📚 **项目文档**: https://github.com/z785976928/demo.taokeyun.cn
- 🐛 **问题反馈**: https://github.com/z785976928/demo.taokeyun.cn/issues

---

<div align="center">

**Made with ❤️ by 灵策AI团队**

</div>
