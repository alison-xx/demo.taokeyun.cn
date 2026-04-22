# 灵策智算 - AI智能员工平台 产品设计文档

> **版本**: v1.0  
> **日期**: 2026-04-22  
> **状态**: 正式发布  
> **域名**: demo.taokeyun.cn  

---

## 一、产品概述

### 1.1 产品定位
**灵策智算** 是一款面向企业/个人的 **AI智能员工协作平台**，通过多角色AI专家团队，为用户提供从流量获取到销售转化的全链路数字化解决方案。

### 1.2 核心价值主张
- 🤖 **AI团队即服务** - 40+位专业AI员工，覆盖8大业务部门
- 🔗 **全链路闭环** - 引流→营销→销售→转化→客服→分析
- 🎨 **多模态能力** - 文本对话 + AI绘画 + 数据分析
- 👥 **协作模式** - 多AI员工协同工作，输出综合方案

### 1.3 目标用户
| 用户类型 | 核心需求 | 典型场景 |
|---------|---------|---------|
| 内容创作者 | 流量获取、内容优化 | B站/抖音/小红书运营 |
| 电商卖家 | 转化提升、店铺运营 | 淘宝/抖音电商运营 |
| 销售团队 | 成交率提升、话术优化 | ToB/ToC销售场景 |
| 教育机构 | 在线教育辅导 | K12/职业教育 |
| 企业主 | 数字化转型咨询 | 全流程业务支持 |

---

## 二、产品名称体系

### 2.1 主品牌名

| 方案 | 中文名 | 英文名 | Slogan | 推荐度 |
|------|--------|--------|--------|-------|
| **A (当前)** | **灵策智算** | **LingCe AI** | "让每个企业拥有AI智囊团" | ⭐⭐⭐⭐⭐ |
| B | 智工坊 | SmartWork Studio | "您的AI办公团队" | ⭐⭐⭐⭐ |
| C | 元脑云 | MetaBrain Cloud | "连接智慧，驱动增长" | ⭐⭐⭐ |
| D | 灵犀企服 | LingXi Enterprise | "懂业务的AI助手" | ⭐⭐⭐ |

### 2.2 品牌命名解析 (推荐: 灵策智算)

```
┌─────────────────────────────────────────────┐
│              灵 策 智 算                      │
│              │ │ │ │                        │
│   ┌──────────┘ │ │ └──────────┐            │
│   ▼            ▼ ▼            ▼             │
│  灵动    策略    智能     计算               │
│  敏捷    战略    AI      数据               │
│                                             │
│  含义: 用智能计算驱动敏捷策略                 │
└─────────────────────────────────────────────┘
```

| 字 | 寓意 | 关联词 |
|---|------|--------|
| **灵** | 灵动、灵活、灵感 | 灵感、灵动、灵敏 |
| **策** | 策略、策划、决策 | 策划、策略、决策 |
| **智** | 智能、智慧、AI | 智能体、智慧、大脑 |
| **算** | 计算、数据、算法 | 算力、数据、分析 |

### 2.3 子产品线命名

| 子产品 | 英文名 | 定位 | 图标色 |
|--------|--------|------|--------|
| 灵策·引流 | LingCe Traffic | 流量获取与内容运营 | 🟢 #3DDC84 |
| 灵策·销售 | LingCe Sales | 销售转化与客户管理 | 🔵 #00A1D6 |
| 灵策·创作 | LingCe Create | 内容创作与AI绘画 | 🟣 #7B5EA7 |
| 灵策·教育 | LingCe Edu | 教育辅导与知识服务 | 🟠 #FF9C24 |
| 灵策·分析 | LingCe Data | 数据洞察与竞品分析 | 🟡 #FFD93D |

---

## 三、技术架构设计

### 3.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Web App  │  │ H5移动端 │  │ 小程序   │  │ 桌面客户端│   │
│  │ Vue3/React│  │ 响应式   │  │ 微信/支付宝│ │ Electron  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └──────────────┴──────────────┴──────────────┘        │
│                              │                              │
│                    API Gateway / CDN                         │
├─────────────────────────────────────────────────────────────┤
│                       服务端层                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   业务网关                           │   │
│  │         认证鉴权 │ 限流熔断 │ 日志追踪                │   │
│  └─────────────────────┬───────────────────────────────┘   │
│                        │                                    │
│  ┌─────────────────────┼───────────────────────────────┐   │
│  │          微服务集群                                  │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │用户服务  │ │对话服务  │ │绘画服务  │ │分析服务  │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │员工服务  │ │文件服务  │ │分享服务  │ │通知服务  │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                       AI引擎层                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  DeepSeek API  │  │  Minimax API   │  │SiliconFlow   │  │
│  │  (文本对话)     │  │  (文本对话)     │  │(图像生成)    │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                       数据层                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ MySQL    │  │ Redis    │  │ MongoDB  │  │ OSS/S3   │   │
│  │ 主数据库  │  │ 缓存/会话 │  │ 对话存储  │  │ 文件存储  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 前端技术栈

```yaml
核心框架: Vue 3 + TypeScript + Vite
UI组件库:
  - PC端: Element Plus / Ant Design Vue
  - 移动端: Vant 4 / NutUI
状态管理: Pinia
路由: Vue Router 4
HTTP请求: Axios + 请求拦截器
实时通信: WebSocket (SSE流式响应)
图表可视化: ECharts / Chart.js
富文本编辑: TipTap / Tiptap
图片处理: Compressor.js (压缩)
国际化: Vue I18n
构建工具: Vite 5
CSS方案: 
  - Tailwind CSS (原子类)
  - SCSS变量系统 (主题)
```

### 3.3 后端技术栈

```yaml
语言: Go 1.21+ / Node.js (TypeScript)
框架:
  - Go: Gin / Fiber
  - Node: NestJS / Fastify
API规范: RESTful + GraphQL (可选)
认证: JWT + OAuth2.0
数据库:
  - 主库: MySQL 8.0 / PostgreSQL
  - 缓存: Redis 7.0
  - 文档: MongoDB / Elasticsearch
消息队列: RabbitMQ / Kafka (异步任务)
对象存储: 阿里云OSS / MinIO
容器化: Docker + Kubernetes
监控: Prometheus + Grafana
日志: ELK Stack (Elasticsearch+Logstash+Kibana)
CI/CD: GitHub Actions / GitLab CI
```

### 3.4 项目目录结构

```
taokeyun/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 公共组件
│   │   │   ├── chat/          # 聊天相关组件
│   │   │   ├── employee/      # 员工选择组件
│   │   │   ├── painting/      # 绘画相关组件
│   │   │   └── common/        # 通用组件
│   │   ├── views/             # 页面视图
│   │   ├── stores/            # Pinia状态管理
│   │   ├── composables/       # 组合式函数
│   │   ├── api/               # API接口
│   │   ├── utils/             # 工具函数
│   │   ├── styles/            # 全局样式
│   │   │   ├── variables.css  # CSS变量
│   │   │   ├── themes/        # 主题配置
│   │   │   └── components/    # 组件样式
│   │   ├── types/             # TypeScript类型定义
│   │   └── App.vue
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # 后端项目
│   ├── cmd/                    # 入口文件
│   ├── internal/
│   │   ├── config/            # 配置管理
│   │   ├── handler/           # HTTP处理器
│   │   ├── service/           # 业务逻辑
│   │   ├── model/             # 数据模型
│   │   ├── repository/        # 数据访问
│   │   ├── middleware/        # 中间件
│   │   └── ai/                # AI引擎封装
│   │       ├── deepseek/      # DeepSeek SDK
│   │       ├── minimax/       # Minimax SDK
│   │       └── siliconflow/   # SiliconFlow SDK
│   ├── pkg/                   # 公共包
│   ├── api/                   # API定义
│   ├── docs/                  # API文档
│   ├── scripts/               # 脚本工具
│   ├── docker-compose.yml
│   └── go.mod
│
├── shared/                     # 共享代码
│   ├── types/                 # 共享类型
│   ├── constants/             # 常量定义
│   └── utils/                 # 工具函数
│
├── deploy/                     # 部署配置
│   ├── nginx.conf
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.prod.yml
│
└── docs/                       # 项目文档
    ├── README.md
    ├── API.md
    └── ARCHITECTURE.md
```

---

## 四、功能模块设计

### 4.1 核心功能矩阵

| 模块 | 功能点 | 优先级 | 状态 |
|------|--------|--------|------|
| **AI员工中心** | | P0 | ✅ |
| | 员工列表展示 | P0 | ✅ |
| | 部门分类筛选 | P0 | ✅ |
| | 搜索与推荐 | P0 | ✅ |
| | 员工详情预览 | P1 | 🔄 |
| **智能对话** | | P0 | ✅ |
| | 单人对话模式 | P0 | ✅ |
| | 多人协作模式 | P0 | ✅ |
| | 流式输出(SSE) | P0 | ✅ |
| | 历史记录管理 | P0 | ✅ |
| | 追问建议 | P1 | ✅ |
| | 消息润色 | P1 | ✅ |
| **AI绘画** | | P1 | ✅ |
| | 文生图生成 | P1 | ✅ |
| | 图片风格选择 | P1 | ✅ |
| | 尺寸规格选择 | P1 | ✅ |
| | 图生图(参考图) | P2 | 🔄 |
| | 创作广场模板 | P2 | 🔄 |
| **API管理** | | P0 | ✅ |
| | DeepSeek配置 | P0 | ✅ |
| | Minimax配置 | P0 | ✅ |
| | 绘画API配置 | P0 | ✅ |
| | Key加密存储 | P1 | 🔄 |
| **分享功能** | | P1 | ✅ |
| | 对话分享链接 | P1 | ✅ |
| | 二维码生成 | P1 | ✅ |
| | 分享页面展示 | P1 | ✅ |
| **用户系统** | | P1 | 🔄 |
| | 注册/登录 | P1 | 🔄 |
| | 个人设置 | P2 | 📋 |
| | 使用统计 | P2 | 📋 |
| | 会员订阅 | P2 | 📋 |

### 4.2 AI员工组织架构

```
                    ┌─────────────────┐
                    │   灵策智算总部   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │  引流部  │         │  销售部  │         │  营销部  │
   ├─────────┤         ├─────────┤         ├─────────┤
   │B站策略师│         │Discovery│         │播客策略师│
   │抖音策略师│        │Outbound │         │短视频指导│
   │快手策略师│        │Pipeline │         │跨境电商  │
   │百度SEO  │         │客户拓展  │         │品牌策划  │
   │小红书   │         │销售话术  │         │活动运营  │
   │微信公号  │         │CRM专员  │         │社群运营  │
   │视频号   │         │谈判专家  │         │内容营销  │
   │知乎运营  │         │数据分析  │         │          │
   │网站SEO  │         │          │         │          │
   │私域运营  │         │          │         │          │
   └─────────┘         └─────────┘         └─────────┘
        │                    │                    
   ┌────┴────┐         ┌────┴────┐              
   │  转化部  │         │  客服部  │             
   ├─────────┤         ├─────────┤             
   │电商运营师│         │客服响应者│             
   └─────────┘         │投诉处理  │             
                        │售后顾问  │             
                        └─────────┘             

        ┌────────────────────┬────────────────────┐
        │                    │                    │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │  创作部  │         │  分析部  │         │  教育部  │
   ├─────────┤         ├─────────┤         ├─────────┤
   │AI绘画师  │         │数据分析师│         │幼儿园老师│
   │文案创意师│         │竞品分析  │         │小学老师  │
   │视频脚本  │         │用户研究  │         │初中老师  │
   │小说助手  │         │          │         │高中老师  │
   └─────────┘         └─────────┘         │大学老师  │
                                           └─────────┘
```

---

## 五、API接口设计

### 5.1 接口规范

```typescript
// 基础响应结构
interface ApiResponse<T> {
  code: number;          // 状态码 200=成功
  message: string;       // 提示信息
  data: T;               // 数据
  timestamp: number;     // 时间戳
}

// 分页请求
interface PageRequest {
  page: number;
  pageSize: number;
  keyword?: string;
}

// 分页响应
interface PageResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

### 5.2 核心API列表

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| **员工模块** ||||
| GET | /api/v1/employees | 获取员工列表 | No |
| GET | /api/v1/employees/:id | 获取员工详情 | No |
| GET | /api/v1/departments | 获取部门列表 | No |
| **对话模块** ||||
| POST | /api/v1/chat/send | 发送消息 | Yes |
| GET | /api/v1/chat/history | 获取历史记录 | Yes |
| DELETE | /api/v1/chat/session/:id | 删除会话 | Yes |
| POST | /api/v1/chat/collaborate | 协作对话 | Yes |
| **绘画模块** ||||
| POST | /api/v1/painting/generate | 生成图片 | Yes |
| GET | /api/v1/painting/styles | 获取风格列表 | No |
| POST | /api/v1/painting/upload | 上传参考图 | Yes |
| **用户模块** ||||
| POST | /api/v1/auth/login | 登录 | No |
| POST | /api/v1/auth/register | 注册 | No |
| GET | /api/v1/user/profile | 获取个人信息 | Yes |
| PUT | /api/v1/user/api-keys | 更新API密钥 | Yes |
| **分享模块** ||||
| POST | /api/v1/share/create | 创建分享链接 | Yes |
| GET | /api/v1/share/:id | 获取分享内容 | No |

### 5.3 SSE流式响应示例

```http
GET /api/v1/chat/stream HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "帮我分析抖音爆款视频",
  "employeeId": "douyin-strategist",
  "model": "deepseek"
}
```

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache

data: {"type": "start", "sessionId": "xxx"}

data: {"type": "content", "delta": "根据"}

data: {"type": "content", "delta": "最新"}

data: {"type": "content", "delta": "的"}

...

data: {"type": "followup", "questions": ["如何优化标题?", "..."]}

data: {"type": "done", "usage": {"tokens": 1234}}
```

---

## 六、数据库设计

### 6.1 ER关系图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  employees  │       │ departments │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ username    │       │ name        │       │ name        │
│ email       │       │ dept_id(FK) │──────▶│ icon        │
│ password    │       │ icon        │       │ sort_order  │
│ avatar      │       │ desc        │       └─────────────┘
│ created_at  │       │ skills(JSON)│
│ updated_at  │       │ system_prompt│
└──────┬──────┘       │ is_painter  │
       │              │ status      │
       │              └──────┬──────┘
       │                     │
       │              ┌──────┴──────┐
       │              │chat_sessions│
       │              ├─────────────┤
       │◀─────────────│ id (PK)     │
       │              │ user_id(FK) │
       │              │ employee_id │
       │              │ title       │
       │              │ created_at  │
       │              └──────┬──────┘
       │                     │
       │              ┌──────┴──────┐
       │              │  messages   │
       │              ├─────────────┤
       │              │ id (PK)     │
       │              │ session_id  │
       │              │ role        │
       │              │ content     │
       │              │ model_used  │
       │              │ created_at  │
       │              └─────────────┘
       │
       │       ┌─────────────┐
       │       │ user_api_keys│
       │◀──────├─────────────┤
       │       │ id (PK)     │
       │       │ user_id(FK) │
       │       │ provider    │
       │       │ key_encrypted│
       │       │ created_at  │
       │       └─────────────┘
       
       ┌──────┴──────┐
       │   shares    │
       ├─────────────┤
       │ id (PK)     │
       │ user_id(FK) │
       │ session_id  │
       │ share_code  │
       │ view_count  │
       │ expires_at  │
       └─────────────┘
```

### 6.2 核心表结构

```sql
-- 用户表
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role ENUM('user', 'admin') DEFAULT 'user',
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI员工表
CREATE TABLE employees (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dept_id INT NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT,
  skills JSON NOT NULL,
  system_prompt TEXT NOT NULL,
  is_painter BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  status TINYINT DEFAULT 1,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 对话会话表
CREATE TABLE chat_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  title VARCHAR(200),
  collaboration_mode BOOLEAN DEFAULT FALSE,
  selected_employees JSON,
  message_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_employee (user_id, employee_id),
  INDEX idx_updated (updated_at DESC),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 消息表
CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content LONGTEXT NOT NULL,
  model_used VARCHAR(50),
  token_count INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_created (session_id, created_at ASC),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 用户API密钥表 (加密存储)
CREATE TABLE user_api_keys (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  provider ENUM('deepseek', 'minimax', 'siliconflow') NOT NULL,
  key_encrypted TEXT NOT NULL,
  key_hint VARCHAR(20),  -- 显示前4后4字符
  is_valid BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_provider (user_id, provider),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 绘画记录表
CREATE TABLE painting_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  style VARCHAR(50),
  size VARCHAR(20) DEFAULT '1024x1024',
  image_url VARCHAR(500) NOT NULL,
  reference_image_url VARCHAR(500),
  seed INT,
  model VARCHAR(50),
  generation_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 七、安全设计

### 7.1 安全措施清单

| 层级 | 措施 | 说明 |
|------|------|------|
| **传输层** | HTTPS/TLS 1.3 | 全站加密传输 |
| **认证层** | JWT + RefreshToken | 无状态认证，双token机制 |
| **授权层** | RBAC权限控制 | 角色基础访问控制 |
| **数据层** | AES-256加密 | API密钥等敏感信息加密存储 |
| **接口层** | Rate Limiting | 防止恶意调用，限制频率 |
| **输入层** | XSS/SQL注入防护 | 参数校验+ORM防注入 |
| **审计层** | 操作日志 | 全量操作可追溯 |

### 7.2 API密钥安全处理

```go
// 加密存储示例
func EncryptAPIKey(rawKey string) (string, error) {
    key := []byte(config.Get("encryption.key"))
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }
    
    gcm, err := cipher.NewGCM(block)
    if err != nil {
        return "", err
    }
    
    nonce := make([]byte, gcm.NonceSize())
    if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
        return "", err
    }
    
    ciphertext := gcm.Seal(nonce, nonce, []byte(rawKey), nil)
    return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// 显示脱敏格式: sk-****abcd
func MaskAPIKey(key string) string {
    if len(key) <= 12 {
        return "****"
    }
    return key[:4] + "****" + key[len(key)-4:]
}
```

---

## 八、部署方案

### 8.1 Docker Compose 开发环境

```yaml
version: '3.8'

services:
  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:8080/api

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - REDIS_HOST=redis
      - JWT_SECRET=${JWT_SECRET}

  # MySQL数据库
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: lingce_ai
    volumes:
      - mysql_data:/var/lib/mysql

  # Redis缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### 8.2 Nginx生产配置

```nginx
server {
    listen 443 ssl http2;
    server_name demo.taokeyun.cn www.taokeyun.cn;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # 前端静态资源
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # API代理
    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # SSE支持
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
        chunked_transfer_encoding on;
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}

# HTTP -> HTTPS 重定向
server {
    listen 80;
    server_name demo.taokeyun.cn www.taokeyun.cn;
    return 301 https://$server_name$request_uri;
}
```

---

## 九、版本规划

### 9.1 Roadmap

```
2026 Q2 (当前)          2026 Q3              2026 Q4              2027 Q1
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   v1.0 MVP      │  │   v1.5 增强     │  │   v2.0 平台化   │  │   v3.0 生态    │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ • 基础对话功能  │  │ • 用户系统      │  │ • 自定义AI员工  │  │ • 插件市场      │
│ • AI绘画功能    │  │ • 团队协作      │  │ • 工作流编排    │  │ • API开放平台   │
│ • 40+AI员工    │  │ • 数据看板      │  │ • 知识库RAG     │  │ • 企业私有部署  │
│ • 分享功能      │  │ • 移动端适配    │  │ • 语音交互      │  │ • 多租户SaaS    │
│ • API密钥管理  │  │ • 国际化支持    │  │ • 视频生成      │  │ • 行业解决方案  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 9.2 当前v1.0功能清单

- [x] AI员工选择面板（8大部门，40+员工）
- [x] 单人/多人协作对话模式
- [x] DeepSeek + Minimax 双模型支持
- [x] AI绘画（文生图）
- [x] 对话历史管理
- [x] API密钥配置
- [x] 分享功能（链接+二维码）
- [x] 响应式设计（PC/平板/手机）
- [x] 深色主题UI

---

## 十、品牌视觉规范

### 10.1 品牌色彩系统

```css
/* 主色调 */
--brand-primary: #FB7299;        /* 灵策粉 - 主品牌色 */
--brand-secondary: #00A1D6;      /* 智算蓝 - 辅助色 */
--brand-accent: #7B5EA7;         /* 策略紫 - 强调色 */

/* 功能色系 */
--color-success: #3DDC84;        /* 成功 - 绿色 */
--color-warning: #FF9C24;        /* 警告 - 橙色 */
--color-error: #FA5A57;          /* 错误 - 红色 */
--color-info: #00D1B2;           /* 信息 - 青色 */

/* 中性色系（深色主题） */
--bg-primary: #0D0D12;
--bg-secondary: #14141A;
--bg-card: #1E1E28;
--text-primary: #FFFFFF;
--text-secondary: #B8B8C0;
```

### 10.2 Logo设计规范

```
┌─────────────────────────────────────┐
│                                     │
│    ╭────────╮                       │
│    │  灵    │  灵策智算             │
│    ╰────────╯  LINGCE.AI           │
│                                     │
│  Logo尺寸规范:                       │
│  - 标准: 40×40px (网页)             │
│  - 小: 24×24px (图标)               │
│  - 大: 120×120px (启动页)           │
│                                     │
│  最小安全距离: Logo高度的1/4          │
└─────────────────────────────────────┘
```

### 10.3 字体规范

```css
/* 品牌字体 */
font-family-brand: 'Orbitron', 'Rajdhani', monospace;

/* 中文界面字体 */
font-family-ui: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;

/* 代码/数据字体 */
font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

/* 字号层级 */
--text-xs: 11px;    /* 辅助说明 */
--text-sm: 13px;    /* 次要文字 */
--text-base: 15px;  /* 正文 */
--text-lg: 17px;    /* 小标题 */
--text-xl: 20px;    /* 大标题 */
--text-2xl: 28px;   /* 页面标题 */
```

---

## 附录

### A. 相关域名建议

| 域名 | 用途 | 建议 |
|------|------|------|
| taokeyun.cn | 主站 | 已有 |
| lingce.ai | 品牌官网 | 建议注册 |
| lingce.com | 国际版 | 可选 |
| app.lingce.ai | 应用入口 | 子域名 |

### B. 第三方服务依赖

| 服务 | 用途 | 费用模式 |
|------|------|---------|
| DeepSeek API | 文本对话 | Token计费 |
| Minimax API | 文本对话 | Token计费 |
| SiliconFlow API | 图像生成 | 按次计费 |
| Google Fonts | 字体加载 | 免费 |
| QRCode.js | 二维码生成 | 免费 |

### C. 参考资源

- [DeepSeek API文档](https://platform.deepseek.com/)
- [Minimax API文档](https://www.minimaxi.com/)
- [SiliconFlow API文档](https://www.siliconflow.cn/)
- [Vue 3官方文档](https://cn.vuejs.org/)
- [Go Web框架对比](https://github.com/avelino/awesome-go#web-frameworks)

---

> **文档维护**: 本文档由产品团队持续更新，如有疑问请联系产品负责人。
> 
> **最后更新**: 2026-04-22
