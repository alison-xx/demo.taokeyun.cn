    // ============ AI员工数据 ============
    const AI_EMPLOYEES = [
      // 引流部
      {
        id: 'bilibili-strategist',
        name: 'B站内容策略师',
        dept: '引流部',
        icon: '📺',
        desc: '专注B站内容策略，帮你分析视频数据、优化标题文案、规划内容矩阵、预测热点趋势',
        skills: ['B站数据分析', '爆款标题', '热点预测', '内容矩阵'],
        systemPrompt: `你是一个专业的B站内容策略师，名为"灵策"，专门帮助B站创作者优化内容策略。`
      },
      {
        id: 'douyin-strategist',
        name: '抖音策略师',
        dept: '引流部',
        icon: '🎵',
        desc: '抖音内容运营专家，精通短视频算法推荐机制，助力打造爆款视频内容',
        skills: ['抖音算法', '短视频策划', '带货转化', 'DOU+投放'],
        systemPrompt: `你是一个专业的抖音内容策略师，专注于帮助创作者在抖音平台获得流量和变现。`
      },
      {
        id: 'kuaishou-strategist',
        name: '快手策略师',
        dept: '引流部',
        icon: '🔥',
        desc: '快手平台运营专家，深耕下沉市场，擅长私域流量沉淀和社区运营',
        skills: ['快手算法', '老铁文化', '私域运营', '直播策划'],
        systemPrompt: `你是一个专业的快手内容策略师，专注于帮助创作者在快手平台建立影响力。`
      },
      {
        id: 'baidu-seo-expert',
        name: '百度SEO专家',
        dept: '引流部',
        icon: '🔍',
        desc: '百度搜索引擎优化专家，帮助企业获取精准搜索流量，提升网站排名',
        skills: ['关键词研究', '内容优化', '外链建设', '算法应对'],
        systemPrompt: `你是一个专业的百度SEO专家，专注于帮助企业提升百度搜索排名和获取精准流量。`
      },
      {
        id: 'xiaohongshu-strategist',
        name: '小红书策略师',
        dept: '引流部',
        icon: '📕',
        desc: '小红书内容运营专家，精通红书种草笔记创作，提升品牌曝光和转化',
        skills: ['种草笔记', 'KOL合作', '话题运营', '素人矩阵'],
        systemPrompt: `你是一个专业的小红书内容策略师，专注于帮助品牌和个人在小红书平台建立影响力。`
      },
      // 销售部
      {
        id: 'discovery-coach',
        name: 'Discovery教练',
        dept: '销售部',
        icon: '🎯',
        desc: '销售Discovery阶段专家，帮助团队掌握高效客户需求挖掘技巧，提升成交率',
        skills: ['需求挖掘', '提问技巧', '痛点分析', '方案呈现'],
        systemPrompt: `你是一个专业的销售Discovery教练，专注于帮助销售人员提升客户需求挖掘能力。`
      },
      {
        id: 'outbound-strategist',
        name: 'Outbound策略师',
        dept: '销售部',
        icon: '📞',
        desc: '外呼销售策略专家，优化cold call和客户拓展流程，提升销售效率',
        skills: ['外呼话术', '客户筛选', '时间策略', '转化优化'],
        systemPrompt: `你是一个专业的Outbound销售策略师，专注于帮助团队提升外呼销售效率和转化率。`
      },
      {
        id: 'pipeline-analyst',
        name: 'Pipeline分析师',
        dept: '销售部',
        icon: '📊',
        desc: '销售管道管理专家，帮你优化销售漏斗，预测成交率，提升销售预测准确性',
        skills: ['漏斗优化', '阶段定义', '转化提升', '预测模型'],
        systemPrompt: `你是一个专业的销售Pipeline分析师，专注于帮助销售团队优化管道管理和提升预测准确性。`
      },
      {
        id: 'customer-expand',
        name: '客户拓展策略师',
        dept: '销售部',
        icon: '🚀',
        desc: '客户开发和拓展专家，帮助企业找到目标客户群体，扩大市场份额',
        skills: ['客户画像', '渠道选择', '触达策略', '资源整合'],
        systemPrompt: `你是一个专业的客户拓展策略师，专注于帮助企业开发和拓展新客户群体。`
      },
      // 营销部
      {
        id: 'podcast-strategist',
        name: '播客内容策略师',
        dept: '营销部',
        icon: '🎙️',
        desc: '播客运营专家，帮助打造高质量音频内容，建立品牌影响力',
        skills: ['选题策划', '脚本创作', '嘉宾邀约', '运营增长'],
        systemPrompt: `你是一个专业的播客内容策略师，专注于帮助创作者和品牌打造成功的播客节目。`
      },
      {
        id: 'video-editor',
        name: '短视频剪辑指导师',
        dept: '营销部',
        icon: '✂️',
        desc: '短视频剪辑专家，提供专业剪辑技巧和创意指导，提升视频质量',
        skills: ['剪辑技巧', '节奏把控', '特效包装', '平台适配'],
        systemPrompt: `你是一个专业的短视频剪辑指导师，专注于帮助创作者提升视频剪辑质量和效率。`
      },
      {
        id: 'crossborder-expert',
        name: '跨境电商运营专家',
        dept: '营销部',
        icon: '🌏',
        desc: '跨境电商全链路运营专家，助力品牌出海，覆盖亚马逊、速卖通、TikTok Shop',
        skills: ['平台运营', '选品策略', '物流方案', '本地化'],
        systemPrompt: `你是一个专业的跨境电商运营专家，专注于帮助品牌和卖家拓展海外市场。`
      },
      // 转化部
      {
        id: 'ecommerce-operator',
        name: '电商运营师',
        dept: '转化部',
        icon: '🛒',
        desc: '电商平台运营专家，精通店铺装修、商品优化、活动策划，提升店铺转化率',
        skills: ['店铺装修', '商品优化', '活动策划', '数据分析'],
        systemPrompt: `你是一个专业的电商运营师，专注于帮助卖家提升电商平台的店铺运营能力和转化率。`
      },
      // 客服部
      {
        id: 'customer-service',
        name: '客服响应者',
        dept: '客服部',
        icon: '💬',
        desc: '专业客服话术专家，帮助提升客户满意度，优化售后处理流程',
        skills: ['话术设计', '投诉处理', '好评引导', '流程优化'],
        systemPrompt: `你是一个专业的客服响应专家，专注于帮助企业提升客户服务质量和效率。`
      },
      // 创作部 - AI绘画师
      {
        id: 'ai-painter',
        name: 'AI绘画师',
        dept: '创作部',
        icon: '🎨',
        desc: '输入文字描述即可生成精美图片，支持多种风格和尺寸，让创意无限延伸',
        skills: ['文生图', '多风格', '多尺寸', '高清输出'],
        systemPrompt: `你是一个专业的AI绘画师，帮助用户通过文字描述生成精美图片。请引导用户输入绘画描述，并解释可以生成的图片风格和尺寸选项。`,
        isPainter: true
      },
      // 引流部 - 补充
      {
        id: 'wechat-ops',
        name: '微信公众号运营师',
        dept: '引流部',
        icon: '📱',
        desc: '专注微信公众号内容运营，帮助提升粉丝增长和阅读量',
        skills: ['内容策划', '标题优化', '排版设计', '数据分析'],
        systemPrompt: `你是一个专业的微信公众号运营师，专注于帮助企业或个人提升公众号的影响力和粉丝增长。`
      },
      {
        id: 'video-account-strategist',
        name: '视频号策略师',
        dept: '引流部',
        icon: '🎬',
        desc: '微信视频号运营专家，帮助打造爆款视频内容',
        skills: ['视频号算法', '内容策划', '直播带货', '私域导流'],
        systemPrompt: `你是一个专业的视频号策略师，专注于帮助创作者在视频号平台获得流量和变现。`
      },
      {
        id: 'zhihu-ops',
        name: '知乎内容运营',
        dept: '引流部',
        icon: '💬',
        desc: '知乎问答运营专家，帮助建立专业形象和品牌影响力',
        skills: ['问答技巧', '内容撰写', '账号定位', '涨粉策略'],
        systemPrompt: `你是一个专业的知乎内容运营专家，专注于帮助个人和企业建立知乎影响力。`
      },
      {
        id: 'website-seo-expert',
        name: '网站SEO专家',
        dept: '引流部',
        icon: '🌐',
        desc: '全方位网站SEO优化专家，提升网站在搜索引擎的排名',
        skills: ['技术SEO', '内容优化', '外链建设', '数据分析'],
        systemPrompt: `你是一个专业的网站SEO专家，专注于帮助企业提升网站在搜索引擎的排名和流量。`
      },
      {
        id: 'private-traffic-ops',
        name: '私域流量运营',
        dept: '引流部',
        icon: '🔒',
        desc: '私域流量运营专家，帮助企业建立和运营自有流量池',
        skills: ['微信私域', '社群运营', '用户分层', '变现转化'],
        systemPrompt: `你是一个专业的私域流量运营专家，专注于帮助企业建立和管理私域流量池。`
      },
      // 销售部 - 补充
      {
        id: 'sales-script-coach',
        name: '销售话术教练',
        dept: '销售部',
        icon: '🎤',
        desc: '专业销售话术培训师，帮助提升销售沟通技巧和成交率',
        skills: ['话术设计', '异议处理', '成交技巧', '逼单策略'],
        systemPrompt: `你是一个专业的销售话术教练，专注于帮助销售人员提升沟通技巧和成交能力。`
      },
      {
        id: 'crm-specialist',
        name: '客户关系管理师',
        dept: '销售部',
        icon: '🤝',
        desc: 'CRM系统应用和客户关系管理专家，提升客户满意度和复购率',
        skills: ['CRM系统', '客户分层', '生命周期', '忠诚度管理'],
        systemPrompt: `你是一个专业的客户关系管理师，专注于帮助企业提升客户关系管理和满意度。`
      },
      {
        id: 'negotiation-expert',
        name: '商务谈判专家',
        dept: '销售部',
        icon: '⚖️',
        desc: '商务谈判策略专家，帮助在商业谈判中取得有利结果',
        skills: ['谈判策略', '筹码分析', '让步技巧', '双赢思维'],
        systemPrompt: `你是一个专业的商务谈判专家，专注于帮助企业在商业谈判中获得有利结果。`
      },
      {
        id: 'sales-data-analyst',
        name: '销售数据分析',
        dept: '销售部',
        icon: '📈',
        desc: '销售数据分析师，帮助洞察销售数据并制定改进策略',
        skills: ['数据看板', '趋势分析', '归因分析', '预测模型'],
        systemPrompt: `你是一个专业的销售数据分析专家，专注于帮助企业通过数据洞察提升销售业绩。`
      },
      // 营销部 - 补充
      {
        id: 'brand-planner',
        name: '品牌策划师',
        dept: '营销部',
        icon: '🎯',
        desc: '品牌战略规划专家，帮助企业建立和维护品牌形象',
        skills: ['品牌定位', '视觉识别', '品牌故事', '整合营销'],
        systemPrompt: `你是一个专业的品牌策划师，专注于帮助企业建立和维护品牌形象。`
      },
      {
        id: 'event-ops-expert',
        name: '活动运营专家',
        dept: '营销部',
        icon: '🎪',
        desc: '线上线下活动运营专家，提升活动参与度和转化效果',
        skills: ['活动策划', '执行管理', '效果评估', '资源整合'],
        systemPrompt: `你是一个专业的活动运营专家，专注于帮助企业策划和执行各类营销活动。`
      },
      {
        id: 'community-ops',
        name: '社群运营师',
        dept: '营销部',
        icon: '👥',
        desc: '社群运营专家，帮助建立活跃的社群生态',
        skills: ['社群搭建', '内容运营', '活动策划', '变现转化'],
        systemPrompt: `你是一个专业的社群运营师，专注于帮助企业建立和管理活跃的社群。`
      },
      {
        id: 'content-marketing',
        name: '内容营销策划',
        dept: '营销部',
        icon: '✍️',
        desc: '内容营销策略专家，帮助打造高价值内容营销体系',
        skills: ['内容策略', '选题策划', '分发渠道', '效果追踪'],
        systemPrompt: `你是一个专业的内容营销策划专家，专注于帮助企业建立内容营销体系。`
      },
      // 创作部 - 补充
      {
        id: 'copywriter',
        name: '文案创意师',
        dept: '创作部',
        icon: '✒️',
        desc: '专业文案创作专家，帮助创作各类营销文案',
        skills: ['广告文案', '品牌文案', '社交文案', 'SEO文案'],
        systemPrompt: `你是一个专业的文案创意师，专注于帮助企业创作高质量的营销文案。`
      },
      {
        id: 'video-script-writer',
        name: '视频脚本编写',
        dept: '创作部',
        icon: '📝',
        desc: '视频脚本创作专家，帮助策划和撰写各类视频脚本',
        skills: ['短视频脚本', '宣传片脚本', '分镜头', '口播文案'],
        systemPrompt: `你是一个专业的视频脚本编写专家，专注于帮助创作者策划和撰写视频脚本。`
      },
      {
        id: 'novel-assistant',
        name: '小说创作助手',
        dept: '创作部',
        icon: '📖',
        desc: '小说创作AI助手，帮助构思情节、塑造人物、撰写故事',
        skills: ['情节构思', '人物塑造', '世界观', '文笔优化'],
        systemPrompt: `你是一个专业的小说创作助手，专注于帮助作者创作精彩的小说作品。`
      },
      // 客服部 - 补充
      {
        id: 'complaint-handler',
        name: '投诉处理专家',
        dept: '客服部',
        icon: '🛡️',
        desc: '专业投诉处理专家，帮助化解客户不满，维护品牌声誉',
        skills: ['投诉处理', '情绪管理', '危机公关', '赔偿方案'],
        systemPrompt: `你是一个专业的投诉处理专家，专注于帮助企业妥善处理客户投诉，维护品牌形象。`
      },
      {
        id: 'after-sales-consultant',
        name: '售后服务顾问',
        dept: '客服部',
        icon: '💎',
        desc: '售后服务优化专家，提升客户满意度和复购意愿',
        skills: ['售后流程', '产品使用', '客户关怀', '复购引导'],
        systemPrompt: `你是一个专业的售后服务顾问，专注于帮助企业提升售后服务质量和客户满意度。`
      },
      // 分析部（新增）
      {
        id: 'data-analyst',
        name: '数据分析师',
        dept: '分析部',
        icon: '📊',
        desc: '专业数据分析专家，帮助企业洞察数据、制定决策',
        skills: ['数据分析', '可视化', '趋势预测', '洞察报告'],
        systemPrompt: `你是一个专业的数据分析师，专注于帮助企业进行数据分析和洞察。`
      },
      {
        id: 'competitor-analyst',
        name: '竞品分析专家',
        dept: '分析部',
        icon: '🔬',
        desc: '竞品分析专家，帮助企业了解竞争对手并制定竞争策略',
        skills: ['竞品调研', '功能对比', '定价分析', '策略建议'],
        systemPrompt: `你是一个专业的竞品分析专家，专注于帮助企业进行竞争对手分析和制定竞争策略。`
      },
      {
        id: 'user-researcher',
        name: '用户研究专家',
        dept: '分析部',
        icon: '👤',
        desc: '用户研究专家，帮助企业深入了解目标用户需求和行为',
        skills: ['用户访谈', '问卷调研', '行为分析', '画像构建'],
        systemPrompt: `你是一个专业的用户研究专家，专注于帮助企业深入了解目标用户并优化产品。`
      },
      // ========== 教育部 - 5位老师 ==========
      // 幼儿园老师
      {
        id: 'kindergarten-teacher',
        name: '幼儿园老师',
        dept: '教育部',
        icon: '🧒',
        desc: '专注幼儿启蒙教育，习惯培养，幼小衔接',
        skills: ['启蒙教育', '习惯养成', '幼小衔接', '亲子互动'],
        systemPrompt: `你是一位专业亲切的幼儿园老师，专注于幼儿启蒙教育和幼小衔接。你的职责包括：
- 幼儿习惯培养（生活习惯、学习习惯、社交习惯）
- 幼小衔接准备（知识储备、能力培养、心理适应）
- 亲子互动指导（家园共育、有效陪伴、游戏化学习）
- 启蒙教育方法（数学启蒙、语言发展、艺术培养）

请用温暖、耐心的语气与家长沟通，提供实用、可操作的教育建议。对于每个问题，请先了解孩子的具体情况，再给出针对性建议。`
      },
      // 小学老师
      {
        id: 'primary-teacher',
        name: '小学老师',
        dept: '教育部',
        icon: '📏',
        desc: '小学全科辅导，语数英基础夯实',
        skills: ['语文数学英语', '学习习惯培养', '兴趣启蒙'],
        systemPrompt: `你是一位经验丰富的小学老师，精通小学全科教学，专注于帮助学生夯实基础、培养良好学习习惯。你的职责包括：
- 语文辅导（阅读理解、作文写作、拼音识字、古诗词）
- 数学辅导（计算能力、应用题思维、逻辑训练）
- 英语启蒙（单词记忆、发音矫正、兴趣培养）
- 学习习惯培养（时间管理、专注力、预习复习）
- 兴趣激发（寓教于乐、学习方法分享）

请用生动有趣的方式引导孩子学习，注重方法讲解，帮助孩子找到学习的乐趣。`
      },
      // 初中老师
      {
        id: 'middle-teacher',
        name: '初中老师',
        dept: '教育部',
        icon: '📚',
        desc: '初中全科辅导，中考备考指导',
        skills: ['中考备考', '各科提升', '青春期教育'],
        systemPrompt: `你是一位专业的初中老师，深谙中考备考和各学科提升方法，同时理解青春期学生的心理特点。你的职责包括：
- 中考备考指导（复习计划、考点梳理、真题训练）
- 学科突破辅导（语数英物化重点难点）
- 青春期教育（心理疏导、亲子沟通、时间管理）
- 学习方法指导（记忆技巧、思维导图、错题整理）
- 应试技巧培训（答题策略、时间分配、心态调整）

请根据学生所处的年级和学科情况，提供系统性的学习方案。注重与学生建立信任，理解青春期特点，给予正向鼓励。`
      },
      // 高中老师
      {
        id: 'high-teacher',
        name: '高中老师',
        dept: '教育部',
        icon: '🎓',
        desc: '高考冲刺，志愿填报，生涯规划',
        skills: ['高考备考', '志愿填报', '生涯规划', '学科突破'],
        systemPrompt: `你是一位资深的高中老师，在高考备考、志愿填报和生涯规划方面有丰富经验。你的职责包括：
- 高考备考指导（复习策略、时间规划、冲刺技巧）
- 学科突破辅导（语数英物化生重难点攻克）
- 志愿填报建议（分数分析、院校推荐、专业选择）
- 生涯规划指导（专业匹配、兴趣探索、职业认知）
- 心态调整支持（压力疏导、效率提升、自信培养）

请为高中生提供专业、精准的指导。根据学生的成绩水平、兴趣爱好和目标院校，给出切实可行的建议。`
      },
      // 大学老师
      {
        id: 'university-teacher',
        name: '大学老师',
        dept: '教育部',
        icon: '🏛️',
        desc: '大学规划，考研留学，职业发展',
        skills: ['专业选择', '考研留学', '职业规划', '实习就业'],
        systemPrompt: `你是一位资深的大学导师，在学业规划、考研留学和职业发展方面有深厚经验。你的职责包括：
- 专业选择指导（专业分析、适合性评估、发展前景）
- 考研备考攻略（院校选择、复习规划、复试指导）
- 留学申请指南（国家选择、申请材料、面试准备）
- 职业规划建议（行业分析、岗位匹配、能力提升）
- 实习就业指导（简历优化、面试技巧、职场适应）

请结合大学生的实际情况，提供实用的建议。无论是学业困惑还是职业迷茫，都能给出有价值的指导。`
      }
    ];

    // ============ 默认API Keys（内置） ============
    const DEFAULT_CHAT_API_KEY = 'sk-e1ae4ac5fad44c2f863d45d5117f21c3';
    const DEFAULT_IMAGE_API_KEY = 'sk-buudmvfkyqrohlttbjqswgvrqadktwxaxboqbyqtzioartcg';
    const DEFAULT_MINIMAX_API_KEY = 'sk-api-W8rYCMNFKFivvCiddwEqZdwGNBwgc2OFwVdrzNgrhpT6xRxTeTXYU-NcppoWq_ikkcSdGk_vQD3_nP9HUj_nZen9PP5gn8Lk_bG5xbkeydh7NrKLMAPNg_c';
    const DEFAULT_IMAGE_MODEL = 'Kwai-Kolors/Kolors';

    // ============ 模型配置 ============
    const MODEL_CONFIGS = {
      deepseek: {
        name: 'DeepSeek',
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        apiKeyKey: 'deepseek_api_key'
      },
      minimax: {
        name: 'Minimax',
        endpoint: 'https://api.minimax.chat/v1/chat/completions',
        model: 'abab6.5s-chat',
        apiKeyKey: 'minimax_api_key'
      }
    };

    // ============ 配置常量 ============
    const CHAT_API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';
    const CHAT_MODEL_NAME = 'deepseek-chat';
    const IMAGE_API_ENDPOINT = 'https://api.siliconflow.cn/v1/images/generations';
    const MAX_CONTEXT_MESSAGES = 20;
    
    // ============ 状态管理 ============
    // 获取存储的API Key，如果为空则使用默认值
    function getStoredApiKey(key, defaultValue) {
      const stored = localStorage.getItem(key);
      // 如果存储的值为空、null或undefined，则使用默认值
      if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '') {
        return defaultValue;
      }
      return stored;
    }

    // 从后台加载系统配置（API密钥等）
    async function loadSystemConfigs() {
      try {
        console.log('📡 正在请求后台配置...');
        const response = await fetch('/api/public/configs');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📥 收到后台响应:', result);

        if (result.code === 200 && result.data) {
          const configs = result.data;

          console.log('📥 收到后台配置:', Object.keys(configs));

          // API密钥优先级：后台配置 > 用户本地设置 > 默认值
          // DeepSeek API Key
          if (configs.deepseek_api_key && configs.deepseek_api_key.startsWith('sk-') && !localStorage.getItem('deepseek_api_key_modified')) {
            localStorage.setItem('deepseek_api_key', configs.deepseek_api_key);
            state.chatApiKey = configs.deepseek_api_key;
            console.log('✅ 使用后台 DeepSeek API Key:', configs.deepseek_api_key.substring(0, 15) + '...');
          } else {
            console.log('ℹ️ DeepSeek: 使用本地/默认值 (后台:', configs.deepseek_api_key ? '有值' : '无值', ', 本地修改:', !!localStorage.getItem('deepseek_api_key_modified'), ')');
          }

          // MiniMax API Key
          if (configs.minimax_api_key && configs.minimax_api_key.startsWith('sk-') && !localStorage.getItem('minimax_api_key_modified')) {
            localStorage.setItem('minimax_api_key', configs.minimax_api_key);
            state.minimaxApiKey = configs.minimax_api_key;
            console.log('✅ 使用后台 MiniMax API Key:', configs.minimax_api_key.substring(0, 15) + '...');
          } else {
            console.log('ℹ️ MiniMax: 使用本地/默认值 (后台:', configs.minimax_api_key ? '有值' : '无值', ', 本地修改:', !!localStorage.getItem('minimax_api_key_modified'), ')');
          }

          // SiliconFlow API Key
          if (configs.siliconflow_api_key && configs.siliconflow_api_key.startsWith('sk-') && !localStorage.getItem('siliconflow_api_key_modified')) {
            localStorage.setItem('siliconflow_api_key', configs.siliconflow_api_key);
            state.imageApiKey = configs.siliconflow_api_key;
            console.log('✅ 使用后台 SiliconFlow API Key:', configs.siliconflow_api_key.substring(0, 15) + '...');
          } else {
            console.log('ℹ️ SiliconFlow: 使用本地/默认值 (后台:', configs.siliconflow_api_key ? '有值' : '无值', ', 本地修改:', !!localStorage.getItem('siliconflow_api_key_modified'), ')');
          }

          // 应用其他公开配置
          if (configs.site_name) {
            document.title = configs.site_name + ' - AI智能助手';
          }

          // 更新UI显示
          updateApiStatus();

          console.log('✅ 系统配置已从后台加载完成');
          console.log('📊 当前state中的API Keys:', {
            chatApiKey: state.chatApiKey ? state.chatApiKey.substring(0, 10) + '...' : '❌ 空',
            minimaxApiKey: state.minimaxApiKey ? state.minimaxApiKey.substring(0, 10) + '...' : '❌ 空',
            imageApiKey: state.imageApiKey ? state.imageApiKey.substring(0, 10) + '...' : '❌ 空'
          });
        } else {
          console.warn('⚠️ 后台配置返回格式异常:', result);
        }
      } catch (error) {
        console.warn('⚠️ 加载系统配置失败，使用本地默认配置:', error);
        // 加载失败时使用本地存储或默认值
        state.chatApiKey = getStoredApiKey('deepseek_api_key', DEFAULT_CHAT_API_KEY);
        state.minimaxApiKey = getStoredApiKey('minimax_api_key', DEFAULT_MINIMAX_API_KEY);
        state.imageApiKey = getStoredApiKey('siliconflow_api_key', DEFAULT_IMAGE_API_KEY);
      }
    }

    // 初始化API密钥（先使用本地存储或默认值，等待后台配置加载后可能更新）
    function initApiKeys() {
      // 只有当localStorage中没有值时才设置默认值（避免覆盖后台配置）
      if (!localStorage.getItem('deepseek_api_key') || localStorage.getItem('deepseek_api_key') === 'null' || localStorage.getItem('deepseek_api_key')?.trim() === '') {
        localStorage.setItem('deepseek_api_key', DEFAULT_CHAT_API_KEY);
      }
      if (!localStorage.getItem('minimax_api_key') || localStorage.getItem('minimax_api_key') === 'null' || localStorage.getItem('minimax_api_key')?.trim() === '') {
        localStorage.setItem('minimax_api_key', DEFAULT_MINIMAX_API_KEY);
      }
      if (!localStorage.getItem('siliconflow_api_key') || localStorage.getItem('siliconflow_api_key') === 'null' || localStorage.getItem('siliconflow_api_key')?.trim() === '') {
        localStorage.setItem('siliconflow_api_key', DEFAULT_IMAGE_API_KEY);
      }
      if (!localStorage.getItem('image_model')) {
        localStorage.setItem('image_model', DEFAULT_IMAGE_MODEL);
      }

      console.log('🔧 API Key 初始化完成');
      console.log('   DeepSeek:', getStoredApiKey('deepseek_api_key', DEFAULT_CHAT_API_KEY).substring(0, 10) + '...');
      console.log('   MiniMax:', getStoredApiKey('minimax_api_key', DEFAULT_MINIMAX_API_KEY).substring(0, 10) + '...');
      console.log('   SiliconFlow:', getStoredApiKey('siliconflow_api_key', DEFAULT_IMAGE_API_KEY).substring(0, 10) + '...');
    }

    // 执行初始化（延迟到state定义后）
    // initApiKeys();  // 已移除，改在DOMContentLoaded中统一处理

    // 员工卡片模型选择状态（每个员工卡片的模型选择）
    let employeeCardModelSelection = {}; // { employeeId: 'deepseek' | 'minimax' }

    let state = {
      chatApiKey: getStoredApiKey('deepseek_api_key', DEFAULT_CHAT_API_KEY),
      minimaxApiKey: getStoredApiKey('minimax_api_key', DEFAULT_MINIMAX_API_KEY),
      imageApiKey: getStoredApiKey('siliconflow_api_key', DEFAULT_IMAGE_API_KEY),
      imageModel: localStorage.getItem('image_model') || DEFAULT_IMAGE_MODEL,
      currentChatId: null,
      currentEmployee: null,
      currentEmployeeModel: 'deepseek', // 当前员工使用的模型
      messages: [],
      isGenerating: false,
      abortController: null,
      conversationHistory: JSON.parse(localStorage.getItem('conversation_history') || '{}'),
      currentFilter: '全部',
      searchKeyword: '',
      generatedImages: [],
      // 多员工协作模式
      collaborationMode: false,
      selectedEmployees: [], // [{ employee: {...}, model: 'deepseek' | 'minimax' }]
      answerMode: 'separate', // 'separate' 分开回答 | 'combined' 组合回答
      // 滚动状态
      userScrolledUp: false
    };

    // ============ 初始化 ============
    document.addEventListener('DOMContentLoaded', async function() {
      console.log('🚀 页面加载完成，开始初始化...');

      // 第1步：先从localStorage读取初始值到state（同步）
      initApiKeys();
      console.log('📦 第1步：本地存储初始化完成');

      // 第2步：异步从后台加载配置（可能覆盖本地值）
      try {
        await loadSystemConfigs();
        console.log('📡 第2步：后台配置加载完成');
      } catch (error) {
        console.error('⚠️ 后台配置加载失败:', error);
      }

      // 第3步：检查并验证API密钥状态
      checkApiKeys();
      console.log('✅ 第3步：API密钥验证完成');

      // 第4步：其他初始化
      loadHistoryList();
      initEmployeeModal();
      initScrollListener();
      initAuthModal();
      updateUserProfile();
      
      // 第5步：不默认选择员工，显示默认欢迎页面
      // selectCurrentEmployeeQuick();
      
      // 回车发送
      const apiKeyInput = document.getElementById('apiKeyInput');
      if (apiKeyInput) {
        apiKeyInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            saveChatApiKey();
          }
        });
      }
      
      const imageApiKeyInput = document.getElementById('imageApiKeyInput');
      if (imageApiKeyInput) {
        imageApiKeyInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            saveImageApiKey();
          }
        });
      }
      
      const minimaxApiKeyInput = document.getElementById('minimaxApiKeyInput');
      if (minimaxApiKeyInput) {
        minimaxApiKeyInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            saveMinimaxApiKey();
          }
        });
      }
      
      // ESC关闭模态框
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeAiEmployeeModal();
          closeImagePreview(event);
          closeAuthModal();
        }
      });
    });

    // ============ 认证检查 & 登录模态框 ============
    let pendingMessageContent = null;

    function requireAuth(content) {
      if (Api.isLoggedIn) return true;
      pendingMessageContent = content || null;
      openAuthModal();
      return false;
    }

    async function updateUserProfile() {
      const avatarEl = document.querySelector('.user-avatar');
      const nameEl = document.querySelector('.user-name');
      const statusText = document.getElementById('userStatusText');

      if (!Api.isLoggedIn) {
        if (avatarEl) avatarEl.textContent = '?';
        if (nameEl) nameEl.textContent = '未登录';
        if (statusText) statusText.textContent = '登录后开始对话';

        const authBtn = document.getElementById('userAuthBtn');
        const logoutBtn = document.getElementById('userLogoutBtn');
        if (authBtn) authBtn.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        return;
      }

      const authBtn = document.getElementById('userAuthBtn');
      const logoutBtn = document.getElementById('userLogoutBtn');
      if (authBtn) authBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'flex';

      try {
        const res = await Api.getProfile();
        if (res.code === 200) {
          const user = res.data;
          const avatarEl = document.querySelector('.user-avatar');
          const nameEl = document.querySelector('.user-name');
          const statusText = document.getElementById('userStatusText');

          if (avatarEl) avatarEl.textContent = (user.nickname || '用').charAt(0);
          if (nameEl) nameEl.textContent = user.nickname || user.email;

          if (user.quota && statusText) {
            const msgRemain = user.quota.messages.remaining;
            const paintRemain = user.quota.paintings.remaining;

            let quotaText = '';
            if (msgRemain === -1) {
              quotaText = '对话: 无限';
            } else {
              quotaText = `对话: ${msgRemain}/${user.quota.messages.total}`;
            }

            if (paintRemain !== undefined) {
              if (paintRemain === -1) {
                quotaText += ' | 绘画: 无限';
              } else {
                quotaText += ` | 绘画: ${paintRemain}/${user.quota.paintings.total}`;
              }
            }

            if (user.quota.expire_at) {
              const expireDate = new Date(user.quota.expire_at);
              const now = new Date();
              const daysLeft = Math.ceil((expireDate - now) / 86400000);
              if (daysLeft > 0) {
                quotaText += ` | 剩余${daysLeft}天`;
              } else if (user.quota.is_expired) {
                quotaText += ' | 已过期';
              }
            }

            statusText.textContent = quotaText;
          }
        }
      } catch(e) {
        console.error('获取用户信息失败:', e);
      }
    }

    function initAuthModal() {
      const modal = document.getElementById('authModal');
      if (!modal) return;

      modal.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById('authLoginForm').style.display = tab.dataset.tab === 'login' ? 'block' : 'none';
          document.getElementById('authRegisterForm').style.display = tab.dataset.tab === 'register' ? 'block' : 'none';
          clearAuthErrors();
        });
      });

      modal.querySelectorAll('.auth-method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.parentElement.querySelectorAll('.auth-method-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const isCode = btn.dataset.method === 'code';
          if (btn.closest('#authLoginForm')) {
            document.getElementById('authLoginCodeFields').style.display = isCode ? 'flex' : 'none';
            document.getElementById('authLoginPwdFields').style.display = isCode ? 'none' : 'block';
          }
        });
      });

      document.getElementById('authSendLoginCode')?.addEventListener('click', () => sendAuthCode('login'));
      document.getElementById('authSendRegCode')?.addEventListener('click', () => sendAuthCode('register'));

      [document.getElementById('authLoginEmail'), document.getElementById('authRegEmail'),
       document.getElementById('authLoginCode'), document.getElementById('authRegCode'),
       document.getElementById('authLoginPassword'), document.getElementById('authRegPassword'),
       document.getElementById('authRegNickname')
      ].forEach(input => {
        if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
      });
    }

    function openAuthModal() {
      let modal = document.getElementById('authModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'auth-modal-overlay';
        modal.innerHTML = `
          <div class="auth-modal-panel" onclick="event.stopPropagation()">
            <button class="auth-modal-close" onclick="closeAuthModal()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="auth-logo-area">
              <div class="auth-logo-icon">灵</div>
              <h2 class="auth-welcome-title">欢迎使用灵策智算</h2>
              <p class="auth-welcome-subtitle">登录或注册账号以继续使用 AI 服务</p>
            </div>

            <div class="auth-tabs">
              <div class="auth-tab active" data-tab="login">登录</div>
              <div class="auth-tab" data-tab="register">注册</div>
            </div>

            <div id="authLoginForm" class="auth-form-body">
              <div class="auth-form-group">
                <label>用户名/邮箱</label>
                <input type="text" id="authLoginEmail" placeholder="请输入用户名或邮箱" autocomplete="username">
              </div>

              <div class="auth-form-group">
                <label>密码</label>
                <input type="password" id="authLoginPassword" placeholder="请输入密码" autocomplete="current-password">
              </div>

              <div class="auth-remember-row">
                <label class="auth-checkbox-label">
                  <input type="checkbox" id="authRememberMe">
                  <span>记住我</span>
                </label>
              </div>

              <button class="auth-btn-submit" onclick="handleAuthLogin()">立即登录</button>
              <div class="auth-error-msg" id="authLoginError"></div>

              <div class="auth-switch-link">
                还没有账号？<a href="#" onclick="switchToRegister(event)">立即注册</a>
              </div>
            </div>

            <div id="authRegisterForm" class="auth-form-body" style="display:none;">
              <div class="auth-form-group">
                <label>用户名/邮箱</label>
                <input type="email" id="authRegEmail" placeholder="请输入邮箱地址" autocomplete="email">
              </div>
              <div class="auth-form-group">
                <label>设置密码</label>
                <input type="password" id="authRegPassword" placeholder="至少6位字符" autocomplete="new-password">
              </div>
              <div class="auth-form-group">
                <label>验证码</label>
                <div style="display: flex; gap: 10px;">
                  <input type="text" id="authRegCode" placeholder="请输入验证码" style="flex: 1;">
                  <button type="button" id="authSendRegCode" class="auth-btn-code" onclick="sendAuthCode('register')">获取验证码</button>
                </div>
              </div>
              <div class="auth-form-group">
                <label>昵称（选填）</label>
                <input type="text" id="authRegNickname" placeholder="给自己起个名字">
              </div>
              <button class="auth-btn-submit" onclick="handleAuthRegister()">立即注册</button>
              <div class="auth-error-msg" id="authRegError"></div>
              <div class="auth-switch-link">
                已有账号？<a href="#" onclick="switchToLogin(event)">立即登录</a>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        initAuthModal();
      }

      requestAnimationFrame(() => modal.classList.add('active'));
    }

    function closeAuthModal() {
      const modal = document.getElementById('authModal');
      if (modal) modal.classList.remove('active');
      pendingMessageContent = null;
    }

    function switchToRegister(e) {
      e.preventDefault();
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.auth-tab[data-tab="register"]').classList.add('active');
      document.getElementById('authLoginForm').style.display = 'none';
      document.getElementById('authRegisterForm').style.display = 'block';
      clearAuthErrors();
    }

    function switchToLogin(e) {
      e.preventDefault();
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
      document.getElementById('authLoginForm').style.display = 'block';
      document.getElementById('authRegisterForm').style.display = 'none';
      clearAuthErrors();
    }

    function handleUserClick() {
      if (Api.isLoggedIn) {
        openSettingsPanel();
      } else {
        openAuthModal();
      }
    }

    function openSettingsPanel() {
      // 加载用户信息
      const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
      document.getElementById('settingsUsername').textContent = userInfo.nickname || userInfo.username || '用户';
      document.getElementById('settingsEmail').textContent = userInfo.email || 'user@example.com';
      document.getElementById('settingsAvatar').textContent = (userInfo.nickname || userInfo.username || '用').charAt(0).toUpperCase();
      document.getElementById('settingsNickname').value = userInfo.nickname || '';
      document.getElementById('apiSettingsOverlay').classList.remove('hidden');
    }

    function closeSettingsPanel() {
      document.getElementById('apiSettingsOverlay').classList.add('hidden');
    }

    async function saveProfile() {
      const nickname = document.getElementById('settingsNickname')?.value.trim();
      
      try {
        const res = await Api.updateProfile({ nickname });
        if (res.code === 200) {
          showToast('保存成功');
          // 更新本地存储的用户信息
          const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
          userInfo.nickname = nickname;
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          // 更新界面显示
          document.getElementById('settingsUsername').textContent = nickname || '用户';
          document.getElementById('settingsAvatar').textContent = (nickname || '用').charAt(0).toUpperCase();
        } else {
          showToast('保存失败: ' + (res.message || '未知错误'));
        }
      } catch (e) {
        showToast('网络错误，请重试');
      }
    }

    function openAvatarUpload() {
      // 这里可以实现头像上传功能
      // 暂时使用简单的提示
      showToast('头像上传功能开发中...');
    }

    function handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_info');
        Api.token = null;
        Api.isLoggedIn = false;
        location.reload();
      }
    }

    function showChangePassword() {
      showToast('密码修改功能开发中...', 'info');
    }

    function showAuthError(msg, elId) {
      const el = document.getElementById(elId || (document.getElementById('authRegisterForm').style.display !== 'none' ? 'authRegError' : 'authLoginError'));
      if (el) { el.textContent = msg; el.style.display = 'block'; setTimeout(() => el.style.display = 'none', 4000); }
    }

    function clearAuthErrors() {
      ['authLoginError', 'authRegError'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    }

    async function sendAuthCode(type) {
      const emailInput = document.getElementById(type === 'register' ? 'authRegEmail' : 'authLoginEmail');
      const btn = document.getElementById(type === 'register' ? 'authSendRegCode' : 'authSendLoginCode');

      const email = emailInput?.value.trim();
      if (!email || !email.includes('@')) { showAuthError('请输入有效的邮箱地址'); return; }

      try {
        btn.disabled = true;
        const res = await Api.sendCode(email, type);
        if (res.code === 200) {
          startAuthCountdown(btn);
          showToast('验证码已发送');
        } else {
          showAuthError(res.message || '发送失败');
          btn.disabled = false;
        }
      } catch(e) {
        showAuthError('网络错误，请重试');
        btn.disabled = false;
      }
    }

    function startAuthCountdown(btn) {
      let seconds = 60;
      btn.disabled = true;
      btn.textContent = `${seconds}s`;
      const timer = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.textContent = '获取验证码';
        } else {
          btn.textContent = `${seconds}s`;
        }
      }, 1000);
    }

    async function handleAuthLogin() {
      const email = document.getElementById('authLoginEmail')?.value.trim();
      const password = document.getElementById('authLoginPassword')?.value;

      if (!email) { showAuthError('请输入邮箱'); return; }
      if (!password) { showAuthError('请输入密码'); return; }

      try {
        const res = await Api.login(email, null, password);
        if (res.code === 200) {
          closeAuthModal();
          updateUserProfile();
          loadHistoryList();
          showToast('登录成功，欢迎回来！');
          if (pendingMessageContent) {
            setTimeout(() => sendMessage(), 300);
          }
        } else {
          showAuthError(res.message || '登录失败');
        }
      } catch(e) {
        console.error('登录请求失败:', e);
        showAuthError('登录失败，请检查网络连接或稍后重试');
      }
    }

    async function handleAuthRegister() {
      const email = document.getElementById('authRegEmail')?.value.trim();
      const code = document.getElementById('authRegCode')?.value.trim();
      const password = document.getElementById('authRegPassword')?.value;
      const nickname = document.getElementById('authRegNickname')?.value.trim();

      if (!email) { showAuthError('请输入邮箱'); return; }
      if (!code) { showAuthError('请输入验证码'); return; }
      if ((password || '').length < 6) { showAuthError('密码至少6位'); return; }

      try {
        const res = await Api.register(email, code, password, nickname);
        if (res.code === 200) {
          closeAuthModal();
          updateUserProfile();
          loadHistoryList();
          showToast('注册成功！欢迎加入');
          if (pendingMessageContent) {
            setTimeout(() => sendMessage(), 300);
          }
        } else {
          showAuthError(res.message || '注册失败');
        }
      } catch(e) {
        showAuthError('网络错误，请重试');
      }
    }

    // ============ API Tab切换 ============
    function switchApiTab(tab) {
      const tabNames = {
        'chat': 'DeepSeek',
        'minimax': 'Minimax',
        'image': '绘画API'
      };
      document.querySelectorAll('.api-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === tabNames[tab]);
      });
      document.getElementById('chatApiSection').classList.toggle('active', tab === 'chat');
      document.getElementById('minimaxApiSection').classList.toggle('active', tab === 'minimax');
      document.getElementById('imageApiSection').classList.toggle('active', tab === 'image');
    }

    // ============ 多员工协作模式 ============
    function toggleCollaborationMode() {
      const isChecked = document.getElementById('collaborationToggle').checked;
      state.collaborationMode = isChecked;
      document.getElementById('collaborationBar').classList.toggle('active', isChecked);
      
      if (isChecked) {
        // 如果没有选中任何员工，添加当前员工
        if (state.selectedEmployees.length === 0 && state.currentEmployee) {
          state.selectedEmployees.push({
            employee: state.currentEmployee,
            model: state.currentEmployeeModel
          });
          renderSelectedEmployees();
        }
        showToast('协作模式已开启，请添加多个AI员工', 'success');
      } else {
        showToast('协作模式已关闭');
      }
    }

    function updateAnswerMode(mode) {
      state.answerMode = mode;
      const modeText = mode === 'separate' ? '分开回答' : '组合回答';
      showToast(`已切换为${modeText}模式`, 'success');
    }

    // 选择员工卡片上的模型
    function selectCardModel(employeeId, model, btnElement) {
      employeeCardModelSelection[employeeId] = model;
      
      // 更新按钮样式
      const card = btnElement.closest('.employee-card');
      card.querySelectorAll('.employee-model-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      btnElement.classList.add('active');
    }

    // 带模型选择添加员工到协作
    function selectEmployeeWithModel(employeeId) {
      const employee = AI_EMPLOYEES.find(emp => emp.id === employeeId);
      if (!employee) return;
      
      // 获取该员工卡片当前选择的模型
      const selectedModel = employeeCardModelSelection[employeeId] || 'deepseek';
      
      // 检查是否已存在该员工
      if (state.selectedEmployees.find(e => e.employee.id === employeeId)) {
        showToast(`${employee.name} 已在协作列表中`);
        closeAiEmployeeModal();
        return;
      }
      
      // 如果是第一个员工且不在协作模式，设置为当前员工
      if (!state.collaborationMode && state.selectedEmployees.length === 0) {
        state.currentEmployee = employee;
        state.currentEmployeeModel = selectedModel;
        
        // 更新侧边栏当前员工信息
        document.getElementById('currentEmployeeAvatar').textContent = employee.icon;
        document.getElementById('currentEmployeeAvatar').className = `current-employee-avatar employee-avatar ${employee.dept}`;
        document.getElementById('currentEmployeeName').textContent = employee.name;
        document.getElementById('currentEmployeeDept').textContent = employee.dept;
        document.getElementById('userStatusText').textContent = `${employee.name} (${MODEL_CONFIGS[selectedModel].name})`;
        
        // 更新顶部标题
        document.getElementById('headerTitle').textContent = employee.name;
        document.getElementById('headerBadgeText').textContent = employee.dept;
        
        // 更新欢迎界面
        updateWelcomeForEmployee(employee);
        
        // 更新输入框提示语
        updateInputPlaceholder(employee);
        
        // 更新快捷提示
        updateQuickPrompts(employee);
        
        showToast(`已选择 ${employee.name} (${MODEL_CONFIGS[selectedModel].name})`, 'success');
      } else {
        // 协作模式添加员工
        state.selectedEmployees.push({
          employee: employee,
          model: selectedModel
        });
        renderSelectedEmployees();
        showToast(`已添加 ${employee.name} (${MODEL_CONFIGS[selectedModel].name}) 到协作`, 'success');
      }
      
      closeAiEmployeeModal();
      closeSidebar(); // 移动端关闭侧边栏
    }

    function addEmployeeToCollaboration(employee) {
      // 使用员工卡片最后选择的模型，或默认deepseek
      const selectedModel = employeeCardModelSelection[employee.id] || 'deepseek';
      
      // 检查是否已存在
      if (state.selectedEmployees.find(e => e.employee.id === employee.id)) {
        showToast(`${employee.name} 已在协作列表中`);
        return;
      }
      
      state.selectedEmployees.push({
        employee: employee,
        model: selectedModel
      });
      renderSelectedEmployees();
      showToast(`已添加 ${employee.name} (${MODEL_CONFIGS[selectedModel].name}) 到协作`, 'success');
    }

    function removeEmployeeFromCollaboration(employeeId) {
      state.selectedEmployees = state.selectedEmployees.filter(e => e.employee.id !== employeeId);
      renderSelectedEmployees();
    }

    function renderSelectedEmployees() {
      const container = document.getElementById('selectedEmployeesList');
      container.innerHTML = state.selectedEmployees.map(item => `
        <div class="selected-employee-tag">
          <span>${item.employee.icon}</span>
          <span>${item.employee.name}</span>
          <span class="model-badge ${item.model}">${MODEL_CONFIGS[item.model].name}</span>
          <span class="remove-btn" onclick="removeEmployeeFromCollaboration('${item.employee.id}')">×</span>
        </div>
      `).join('');
    }

    // 修改selectEmployee函数以支持协作模式
    const originalSelectEmployee = selectEmployee;
    selectEmployee = function(employeeId) {
      const employee = AI_EMPLOYEES.find(emp => emp.id === employeeId);
      if (!employee) return;
      
      if (state.collaborationMode) {
        // 协作模式下添加员工
        addEmployeeToCollaboration(employee);
        closeAiEmployeeModal();
      } else {
        // 普通模式切换员工
        originalSelectEmployee(employeeId);
      }
    };

    // ============ AI员工模态框 ============
    function initEmployeeModal() {
      renderFilterTags();
      renderEmployeeGrid();
    }

    function renderFilterTags() {
      const filtersContainer = document.getElementById('employeeFilters');
      const deptCounts = { '全部': AI_EMPLOYEES.length };
      
      AI_EMPLOYEES.forEach(emp => {
        deptCounts[emp.dept] = (deptCounts[emp.dept] || 0) + 1;
      });
      
      const deptOrder = ['全部', '引流部', '销售部', '营销部', '转化部', '客服部', '创作部', '分析部', '教育部'];
      
      filtersContainer.innerHTML = deptOrder.map(dept => {
        const count = deptCounts[dept] || 0;
        if (count === 0) return '';
        return `<button class="filter-tag ${dept === state.currentFilter ? 'active' : ''}" onclick="setFilter('${dept}')">
          ${dept} <span class="filter-count">${count}</span>
        </button>`;
      }).join('');
    }

    function renderEmployeeGrid() {
      const grid = document.getElementById('employeeGrid');
      const keyword = state.searchKeyword.toLowerCase();
      
      let filteredEmployees = AI_EMPLOYEES;
      
      // 分类筛选
      if (state.currentFilter !== '全部') {
        filteredEmployees = filteredEmployees.filter(emp => emp.dept === state.currentFilter);
      }
      
      // 关键词搜索
      if (keyword) {
        filteredEmployees = filteredEmployees.filter(emp => 
          emp.name.toLowerCase().includes(keyword) ||
          emp.desc.toLowerCase().includes(keyword) ||
          emp.skills.some(s => s.toLowerCase().includes(keyword))
        );
      }
      
      if (filteredEmployees.length === 0) {
        grid.innerHTML = `
          <div class="no-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p>未找到匹配的AI员工</p>
          </div>
        `;
        return;
      }
      
      grid.innerHTML = filteredEmployees.map(emp => `
        <div class="employee-card" data-employee-id="${emp.id}">
          <div class="employee-card-header">
            <div class="employee-avatar ${emp.dept}">${emp.icon}</div>
            <div class="employee-info">
              <span class="employee-dept-tag ${emp.dept}">${emp.dept}</span>
              <div class="employee-name">${emp.name}</div>
              <div class="employee-desc">${emp.desc}</div>
            </div>
          </div>
          <div class="employee-card-footer">
            <div class="employee-skills">
              ${emp.skills.slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
            <button class="start-chat-btn" onclick="event.stopPropagation(); selectEmployeeWithModel('${emp.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              ${emp.isPainter ? '开始绘画' : '选择'}
            </button>
          </div>
          <div class="employee-model-select">
            <span class="employee-model-label">🤖 模型:</span>
            <button class="employee-model-btn active deepseek" data-model="deepseek" onclick="event.stopPropagation(); selectCardModel('${emp.id}', 'deepseek', this)">DeepSeek</button>
            <button class="employee-model-btn minimax" data-model="minimax" onclick="event.stopPropagation(); selectCardModel('${emp.id}', 'minimax', this)">Minimax</button>
          </div>
        </div>
      `).join('');
    }

    function setFilter(dept) {
      state.currentFilter = dept;
      renderFilterTags();
      renderEmployeeGrid();
    }

    function filterEmployees() {
      state.searchKeyword = document.getElementById('employeeSearchInput').value;
      renderEmployeeGrid();
    }

    function openAiEmployeeModal() {
      // 移动端先关闭侧边栏
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
      document.getElementById('aiEmployeeModal').classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('employeeSearchInput').focus();
      }, 300);
    }

    function closeAiEmployeeModal() {
      document.getElementById('aiEmployeeModal').classList.remove('active');
      document.body.style.overflow = '';
      // 清空搜索
      document.getElementById('employeeSearchInput').value = '';
      state.searchKeyword = '';
    }

    function selectEmployee(employeeId) {
      // 直接调用新的带模型选择函数
      selectEmployeeWithModel(employeeId);
    }

    function selectCurrentEmployeeQuick() {
      // 快速选择B站策略师
      selectEmployeeWithModel('bilibili-strategist');
    }

    function updateWelcomeForEmployee(employee) {
      const messagesContainer = document.getElementById('chatMessages');
      const quickPrompts = document.getElementById('quickPrompts');
      
      // 如果是AI绘画师，显示专用界面
      if (employee.isPainter) {
        messagesContainer.innerHTML = renderPaintingWelcome();
        quickPrompts.style.display = 'none';
        
        // 恢复之前的状态（如果有）
        setTimeout(() => {
          // 恢复绘画模式
          if (paintingMode === 'image') {
            switchPaintingMode('image');
          }
          // 初始化创作广场
          renderGalleryItems('hot');
        }, 50);
        
        return;
      }
      
      quickPrompts.style.display = 'flex';
      
      // 根据不同员工显示不同的欢迎语和快捷提示
      const welcomeHtml = `
        <div class="welcome-container" id="welcomeContainer">
          <div class="welcome-icon">
            <span style="font-size: 48px;">${employee.icon}</span>
          </div>
          <h2 class="welcome-title">${employee.name}</h2>
          <p class="welcome-subtitle">
            ${employee.desc}
          </p>
          <div class="welcome-features">
            ${employee.skills.slice(0, 4).map((skill, i) => `
              <div class="feature-card" onclick="useQuickPromptForCurrentEmployee('${skill}')">
                <div class="feature-card-icon ${['pink', 'blue', 'purple', 'orange'][i]}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div class="feature-card-title">${skill}</div>
                <div class="feature-card-desc">点击开始咨询</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      messagesContainer.innerHTML = welcomeHtml;
    }

    function renderPaintingWelcome() {
      return `
        <div class="painting-container">
          <div class="painting-welcome">
            <div class="painting-header-icon">🎨</div>
            <h2>AI绘画师</h2>
            <p>输入您的创意描述，选择图片尺寸，AI将为您生成精美图片</p>
            
            <div class="painting-form">
              <!-- 生成模式切换 -->
              <div class="painting-mode-tabs">
                <button class="mode-tab active" onclick="switchPaintingMode('text')" id="textModeTab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  文生图
                </button>
                <button class="mode-tab" onclick="switchPaintingMode('image')" id="imageModeTab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  以图生图
                </button>
              </div>
              
              <!-- 以图生图上传区域 -->
              <div class="image-upload-section" id="imageUploadSection" style="display: none;">
                <div class="image-upload-area" id="imageUploadArea" onclick="document.getElementById('referenceImageInput').click()">
                  <input type="file" id="referenceImageInput" accept="image/*" onchange="handleImageUpload(event)" style="display: none;">
                  <div class="upload-placeholder" id="uploadPlaceholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p>点击或拖拽上传参考图片</p>
                    <span>支持 JPG、PNG 格式，建议尺寸 1024×1024</span>
                  </div>
                  <div class="upload-preview" id="uploadPreview" style="display: none;">
                    <img id="previewImage" src="" alt="预览图">
                    <button class="remove-image-btn" onclick="event.stopPropagation(); removeReferenceImage();">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- 以图生图预设 -->
                <div class="image-to-image-presets">
                  <div class="presets-group">
                    <div class="presets-group-title">🔄 参考强度</div>
                    <div class="presets-tags">
                      <span class="preset-tag active" onclick="setImageStrength(0.3, this)">弱参考</span>
                      <span class="preset-tag" onclick="setImageStrength(0.5, this)">中等</span>
                      <span class="preset-tag" onclick="setImageStrength(0.7, this)">强参考</span>
                      <span class="preset-tag" onclick="setImageStrength(0.9, this)">极强</span>
                    </div>
                  </div>
                  <div class="presets-group">
                    <div class="presets-group-title">🎯 电商改图场景</div>
                    <div class="presets-tags">
                      <span class="preset-tag" onclick="addPresetToPrompt('更换背景，保留商品主体')">换背景</span>
                      <span class="preset-tag" onclick="addPresetToPrompt('同款风格，更换商品')">换商品</span>
                      <span class="preset-tag" onclick="addPresetToPrompt('调整色调，美化优化')">调色优化</span>
                      <span class="preset-tag" onclick="addPresetToPrompt('增加装饰元素，丰富画面')">加装饰</span>
                      <span class="preset-tag" onclick="addPresetToPrompt('去除水印，保持原图')">去水印</span>
                      <span class="preset-tag" onclick="addPresetToPrompt('提升画质，细节增强')">提升画质</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="painting-form-group">
                <label class="painting-form-label">🎯 描述您想要的图片</label>
                <textarea 
                  class="painting-prompt-input" 
                  id="paintingPrompt" 
                  placeholder="例如：一只可爱的橘猫在阳光下打盹，写实风格，温暖色调..."
                  rows="4"
                ></textarea>
              </div>
              
              <!-- 电商预设区域 -->
              <div class="painting-presets-section">
                <div class="presets-header">
                  <span class="presets-title">🛒 电商作图预设</span>
                  <span class="presets-subtitle">点击快速添加常用元素</span>
                </div>
                
                <div class="presets-group">
                  <div class="presets-group-title">📷 场景类型</div>
                  <div class="presets-tags">
                    <span class="preset-tag" onclick="addPresetToPrompt('商品主图，白底背景，产品居中，高清质感，电商风格')">商品主图</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('商品详情页头图，场景化展示，生活化背景')">详情页头图</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('电商促销海报，大促活动，节日氛围，优惠信息')">促销海报</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('商品展示图，场景摆拍，自然光线，专业摄影')">场景展示</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('商品细节图，微距特写，材质展示，质感细腻')">细节特写</span>
                  </div>
                </div>
                
                <div class="presets-group">
                  <div class="presets-group-title">🏷️ 商品类型</div>
                  <div class="presets-tags">
                    <span class="preset-tag" onclick="addPresetToPrompt('服装服饰，时尚穿搭，模特展示')">服装</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('美妆护肤，化妆品，精致包装')">美妆</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('食品零食，美味诱人，食欲感')">食品</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('数码电子产品，科技感，简约现代')">数码</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('家居用品，温馨舒适，生活美学')">家居</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('珠宝首饰，奢华精致，闪耀光芒')">珠宝</span>
                  </div>
                </div>
                
                <div class="presets-group">
                  <div class="presets-group-title">🎨 视觉风格</div>
                  <div class="presets-tags">
                    <span class="preset-tag" onclick="addPresetToPrompt('简约风格，干净清爽，留白设计')">简约</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('高端奢华，金色元素，精致质感')">高端</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('国潮风格，中国风元素，传统美学')">国潮</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('ins风，网红风格，潮流时尚')">ins风</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('小清新，文艺风格，柔和色调')">小清新</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('科技感，未来感，蓝紫色调')">科技风</span>
                  </div>
                </div>
                
                <div class="presets-group">
                  <div class="presets-group-title">🌈 背景氛围</div>
                  <div class="presets-tags">
                    <span class="preset-tag" onclick="addPresetToPrompt('纯白背景，简洁干净')">纯白</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('渐变背景，柔和过渡，时尚感')">渐变</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('自然场景，绿植花卉，清新自然')">自然</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('居家场景，温馨室内，生活气息')">居家</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('城市街景，都市氛围，现代感')">都市</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('节日氛围，喜庆装饰，热闹场景')">节日</span>
                  </div>
                </div>
                
                <div class="presets-group">
                  <div class="presets-group-title">✨ 效果增强</div>
                  <div class="presets-tags">
                    <span class="preset-tag" onclick="addPresetToPrompt('8K超高清，专业摄影，细节丰富')">8K高清</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('柔光效果，光晕氛围，梦幻感')">柔光</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('阴影投射，立体感，层次分明')">立体阴影</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('水珠质感，清新水润，清凉感')">水珠</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('暖色调，温暖舒适，阳光感')">暖色调</span>
                    <span class="preset-tag" onclick="addPresetToPrompt('冷色调，高级感，清爽')">冷色调</span>
                  </div>
                </div>
              </div>
              
              <!-- 创作广场 -->
              <div class="creation-gallery">
                <div class="gallery-header">
                  <span class="gallery-title">🖼️ 创作广场</span>
                  <span class="gallery-subtitle">精选热门创作，一键复刻</span>
                </div>
                
                <div class="gallery-tabs">
                  <button class="gallery-tab active" onclick="switchGalleryCategory('hot', this)">🔥 热门</button>
                  <button class="gallery-tab" onclick="switchGalleryCategory('ecommerce', this)">🛒 电商</button>
                  <button class="gallery-tab" onclick="switchGalleryCategory('portrait', this)">👤 人像</button>
                  <button class="gallery-tab" onclick="switchGalleryCategory('scene', this)">🏞️ 场景</button>
                </div>
                
                <div class="gallery-grid" id="galleryGrid">
                  <!-- 热门创作 -->
                </div>
              </div>
              
              <div class="painting-form-group">
                <label class="painting-form-label">📐 选择图片尺寸</label>
                <div class="size-selector">
                  <div class="size-option active" data-size="1024x1024" onclick="selectSize(this)">
                    <span class="size-label">1:1</span>
                    <span class="size-ratio">1024×1024</span>
                  </div>
                  <div class="size-option" data-size="720x1280" onclick="selectSize(this)">
                    <span class="size-label">9:16</span>
                    <span class="size-ratio">竖版</span>
                  </div>
                  <div class="size-option" data-size="960x1280" onclick="selectSize(this)">
                    <span class="size-label">3:4</span>
                    <span class="size-ratio">960×1280</span>
                  </div>
                  <div class="size-option" data-size="720x1440" onclick="selectSize(this)">
                    <span class="size-label">1:2</span>
                    <span class="size-ratio">720×1440</span>
                  </div>
                </div>
              </div>
              
              <button class="painting-generate-btn" id="generateBtn" onclick="generateImage()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                开始生成
              </button>
            </div>
          </div>
          
          <div class="image-result-container" id="imageResultContainer">
            <!-- 生成结果将显示在这里 -->
          </div>
        </div>
      `;
    }
    
    // 绘画模式状态
    let paintingMode = 'text'; // 'text' 或 'image'
    let referenceImageBase64 = null;
    let imageStrength = 0.5;
    
    function switchPaintingMode(mode) {
      paintingMode = mode;
      
      // 切换tab样式
      const textTab = document.getElementById('textModeTab');
      const imageTab = document.getElementById('imageModeTab');
      const uploadSection = document.getElementById('imageUploadSection');
      
      if (textTab) textTab.classList.toggle('active', mode === 'text');
      if (imageTab) imageTab.classList.toggle('active', mode === 'image');
      
      // 显示/隐藏上传区域
      if (uploadSection) uploadSection.style.display = mode === 'image' ? 'block' : 'none';
      
      // 如果切换到以图生图模式，且有之前上传的图片，恢复显示
      if (mode === 'image' && referenceImageBase64) {
        const previewImg = document.getElementById('previewImage');
        const placeholder = document.getElementById('uploadPlaceholder');
        const preview = document.getElementById('uploadPreview');
        
        if (previewImg && placeholder && preview) {
          previewImg.src = referenceImageBase64;
          placeholder.style.display = 'none';
          preview.style.display = 'block';
        }
      }
      
      // 更新按钮文本
      const generateBtn = document.getElementById('generateBtn');
      if (generateBtn) {
        generateBtn.innerHTML = mode === 'text' ? `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          开始生成
        ` : `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          以图生图
        `;
      }
    }
    
    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // 检查文件大小（限制10MB）
      if (file.size > 10 * 1024 * 1024) {
        showToast('图片大小不能超过10MB');
        return;
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        showToast('请上传图片文件');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        referenceImageBase64 = e.target.result;
        
        // 显示预览
        const previewImg = document.getElementById('previewImage');
        const placeholder = document.getElementById('uploadPlaceholder');
        const preview = document.getElementById('uploadPreview');
        
        if (previewImg && placeholder && preview) {
          previewImg.src = referenceImageBase64;
          placeholder.style.display = 'none';
          preview.style.display = 'block';
        }
        
        console.log('图片上传成功, base64长度:', referenceImageBase64.length);
        showToast('参考图片已上传', 'success');
      };
      reader.onerror = function(e) {
        console.error('图片读取失败:', e);
        showToast('图片读取失败，请重试');
      };
      reader.readAsDataURL(file);
    }
    
    function removeReferenceImage() {
      referenceImageBase64 = null;
      const input = document.getElementById('referenceImageInput');
      const placeholder = document.getElementById('uploadPlaceholder');
      const preview = document.getElementById('uploadPreview');
      
      if (input) input.value = '';
      if (placeholder) placeholder.style.display = 'flex';
      if (preview) preview.style.display = 'none';
      
      showToast('已移除参考图片');
    }
    
    function setImageStrength(strength, element) {
      imageStrength = strength;
      
      // 更新选中状态
      document.querySelectorAll('.image-to-image-presets .preset-tag').forEach(tag => {
        tag.classList.remove('active');
      });
      element.classList.add('active');
      
      const strengthText = strength < 0.4 ? '弱参考' : strength < 0.6 ? '中等' : strength < 0.8 ? '强参考' : '极强';
      showToast(`参考强度：${strengthText}`, 'success');
    }
    
    function addPresetToPrompt(preset) {
      const promptInput = document.getElementById('paintingPrompt');
      const currentValue = promptInput.value.trim();
      if (currentValue) {
        promptInput.value = currentValue + '，' + preset;
      } else {
        promptInput.value = preset;
      }
      promptInput.focus();
      showToast('已添加预设元素', 'success');
    }
    
    // 创作广场数据
    const GALLERY_DATA = {
      hot: [
        { icon: '🌸', title: '樱花少女', prompt: '一位穿着和服的少女在樱花树下，粉色的樱花飘落，温柔的光线，日系风格，唯美意境', badge: '2.3w使用' },
        { icon: '🌌', title: '星空银河', prompt: '壮观的银河星空，璀璨的星星，流星划过，紫色和蓝色的渐变，梦幻宇宙', badge: '1.8w使用' },
        { icon: '🐱', title: '萌猫写真', prompt: '一只毛茸茸的英短蓝猫，大眼睛，柔和的光线，干净的背景，萌宠摄影', badge: '1.5w使用' },
        { icon: '🏔️', title: '雪山日出', prompt: '巍峨的雪山，金色的日出光芒，云海翻涌，壮丽的自然风光，8K高清', badge: '1.2w使用' },
        { icon: '🎨', title: '水彩风景', prompt: '水彩画风格的田园风光，小河流水，绿树成荫，艺术感，手绘效果', badge: '9k使用' },
        { icon: '🌃', title: '赛博城市', prompt: '未来城市的夜景，霓虹灯光，高楼大厦，赛博朋克风格，科幻感', badge: '8.5k使用' }
      ],
      ecommerce: [
        { icon: '👗', title: '服装主图', prompt: '时尚女装展示，白色背景，专业摄影，服装平铺，高清质感，电商主图', badge: '电商必备' },
        { icon: '💄', title: '美妆产品', prompt: '精致化妆品展示，金色点缀，高端大气，产品特写，光影效果', badge: '美妆类' },
        { icon: '🍔', title: '美食摄影', prompt: '诱人的美食摄影，自然光线，餐具摆盘，食欲感，专业美食拍摄', badge: '餐饮类' },
        { icon: '📱', title: '数码产品', prompt: '智能手机产品展示，科技感背景，细节清晰，专业产品摄影', badge: '3C数码' },
        { icon: '🏠', title: '家居场景', prompt: '温馨的家居空间，北欧风格，自然光线，生活美学，室内设计', badge: '家居类' },
        { icon: '💍', title: '珠宝首饰', prompt: '奢华珠宝首饰，钻石闪耀，精致展示，高端质感，珠宝摄影', badge: '珠宝类' }
      ],
      portrait: [
        { icon: '👩', title: '古风美女', prompt: '中国古代美女，汉服装束，古典韵味，水墨画背景，仙气飘飘', badge: '古风' },
        { icon: '🧑', title: '商务精英', prompt: '职业商务人士，西装革履，自信微笑，办公室背景，专业形象', badge: '职业照' },
        { icon: '👶', title: '儿童写真', prompt: '可爱的儿童肖像，自然笑容，阳光背景，温馨亲子风格', badge: '亲子' },
        { icon: '👴', title: '老人肖像', prompt: '慈祥的老人，皱纹诉说故事，温暖光线，人文摄影风格', badge: '人文' },
        { icon: '🎭', title: '艺术人像', prompt: '创意人像摄影，光影艺术，独特构图，艺术感，前卫风格', badge: '艺术' },
        { icon: '👰', title: '婚纱人像', prompt: '浪漫婚纱摄影，白色婚纱，梦幻背景，甜蜜氛围，爱情主题', badge: '婚庆' }
      ],
      scene: [
        { icon: '🌅', title: '海边日落', prompt: '壮观的海边日落，金色的阳光洒在海面，浪花拍打沙滩，浪漫氛围', badge: '风景' },
        { icon: '🌲', title: '森林秘境', prompt: '神秘的原始森林，阳光透过树叶，雾气缭绕，童话般的意境', badge: '自然' },
        { icon: '🏯', title: '古镇水乡', prompt: '江南水乡古镇，小桥流水人家，古朴建筑，烟雨朦胧', badge: '古镇' },
        { icon: '🌃', title: '城市夜景', prompt: '繁华都市的夜景，车水马龙，灯火辉煌，现代城市魅力', badge: '城市' },
        { icon: '🌺', title: '花海世界', prompt: '无边的花海，五彩缤纷，蝴蝶飞舞，浪漫梦幻的场景', badge: '花卉' },
        { icon: '❄️', title: '冰雪世界', prompt: '纯净的冰雪世界，晶莹剔透，北极光，梦幻般的冬季', badge: '冬季' }
      ]
    };
    
    function switchGalleryCategory(category, element) {
      // 更新tab样式
      document.querySelectorAll('.gallery-tab').forEach(tab => {
        tab.classList.remove('active');
      });
      element.classList.add('active');
      
      // 渲染对应分类的内容
      renderGalleryItems(category);
    }
    
    function renderGalleryItems(category) {
      const grid = document.getElementById('galleryGrid');
      if (!grid) return;
      
      const items = GALLERY_DATA[category] || GALLERY_DATA.hot;
      
      grid.innerHTML = items.map((item, index) => `
        <div class="gallery-item" onclick="useGalleryPrompt('${item.prompt.replace(/'/g, "\\'")}')">
          <div class="gallery-item-image">${item.icon}</div>
          <div class="gallery-item-info">
            <div class="gallery-item-title">${item.title}</div>
            <div class="gallery-item-desc">${item.prompt.substring(0, 20)}...</div>
          </div>
          <span class="gallery-item-badge">${item.badge}</span>
        </div>
      `).join('');
    }
    
    function useGalleryPrompt(prompt) {
      const promptInput = document.getElementById('paintingPrompt');
      if (promptInput) {
        promptInput.value = prompt;
        promptInput.focus();
        showToast('已应用创作模板', 'success');
      }
    }

    function selectSize(element) {
      document.querySelectorAll('.size-option').forEach(opt => {
        opt.classList.remove('active');
      });
      element.classList.add('active');
    }

    function updateInputPlaceholder(employee) {
      const placeholderMap = {
        'bilibili-strategist': '输入B站内容策略相关问题...',
        'douyin-strategist': '输入抖音运营相关问题...',
        'kuaishou-strategist': '输入快手运营相关问题...',
        'baidu-seo-expert': '输入SEO优化相关问题...',
        'xiaohongshu-strategist': '输入小红书运营相关问题...',
        'discovery-coach': '输入销售技巧相关问题...',
        'outbound-strategist': '输入外呼策略相关问题...',
        'pipeline-analyst': '输入管道分析相关问题...',
        'customer-expand': '输入客户拓展相关问题...',
        'podcast-strategist': '输入播客运营相关问题...',
        'video-editor': '输入视频剪辑相关问题...',
        'crossborder-expert': '输入跨境电商相关问题...',
        'ecommerce-operator': '输入电商运营相关问题...',
        'customer-service': '输入客服问题相关...',
        'ai-painter': '绘画模式已启动，请在下方输入描述...'
      };
      
      document.getElementById('chatInput').placeholder = placeholderMap[employee.id] || '开始对话...';
    }

    function updateQuickPrompts(employee) {
      const promptsMap = {
        'bilibili-strategist': ['帮我分析热门视频', '生成爆款标题', '预测热点趋势', '规划内容矩阵'],
        'douyin-strategist': ['分析短视频数据', '优化带货脚本', '提升完播率', 'DOU+投放策略'],
        'kuaishou-strategist': ['私域引流方法', '老铁互动技巧', '直播话术设计', '粉丝粘性提升'],
        'baidu-seo-expert': ['关键词优化方案', '网站诊断分析', '外链建设策略', '排名提升技巧'],
        'xiaohongshu-strategist': ['爆款笔记分析', '种草文案写作', '涨粉策略', 'KOL合作方案'],
        'discovery-coach': ['需求挖掘技巧', 'SPIN提问训练', '异议处理话术', '方案呈现方法'],
        'outbound-strategist': ['外呼话术优化', '客户筛选方法', '转化率提升', '时间管理策略'],
        'pipeline-analyst': ['漏斗优化建议', '阶段定义方法', '预测准确性', '资源分配策略'],
        'customer-expand': ['客户画像设计', '渠道选择策略', '触达方法', '增长方案'],
        'podcast-strategist': ['选题策划方法', '脚本结构设计', '嘉宾邀约技巧', '涨粉策略'],
        'video-editor': ['剪辑节奏把控', '转场技巧', '字幕设计', '特效应用'],
        'crossborder-expert': ['选品策略', '物流方案', '本地化运营', '合规风控'],
        'ecommerce-operator': ['店铺诊断', '流量获取', '转化优化', '活动策划'],
        'customer-service': ['话术设计', '投诉处理', '好评引导', '效率提升'],
        'ai-painter': ['一只可爱的猫咪', '科幻城市夜景', '梦幻森林瀑布', '二次元少女'],
        // 教育部 - 5位老师
        'kindergarten-teacher': ['幼儿启蒙方法', '如何培养好习惯', '幼小衔接准备'],
        'primary-teacher': ['小学数学怎么学', '语文阅读理解技巧', '英语启蒙方法'],
        'middle-teacher': ['初中英语提分技巧', '中考冲刺计划', '青春期沟通方法'],
        'high-teacher': ['高考倒计时复习计划', '志愿填报技巧', '弱势学科突破'],
        'university-teacher': ['大学专业怎么选', '考研备考攻略', '留学申请指南']
      };
      
      const prompts = promptsMap[employee.id] || ['开始对话'];
      document.getElementById('quickPromptsList').innerHTML = prompts.map(p => 
        `<div class="quick-prompt" onclick="useQuickPromptForCurrentEmployee('${p}')">${p}</div>`
      ).join('');
    }

    function useQuickPromptForCurrentEmployee(prompt) {
      if (!state.currentEmployee) {
        selectEmployee('bilibili-strategist');
      }
      
      // 如果是绘画师，将提示填入绘画输入框
      if (state.currentEmployee?.isPainter) {
        const paintingPrompt = document.getElementById('paintingPrompt');
        if (paintingPrompt) {
          paintingPrompt.value = prompt;
          paintingPrompt.focus();
        }
        return;
      }
      
      document.getElementById('chatInput').value = prompt;
      document.getElementById('chatInput').focus();
      // 手动触发更新润色按钮状态
      updatePolishBtnState();
    }

    function refreshQuickPrompts() {
      if (!state.currentEmployee) return;
      
      const promptsMap = {
        'bilibili-strategist': ['帮我分析热门视频', '生成爆款标题', '预测热点趋势', '规划内容矩阵', '优化视频标题', '提升完播率', '分析竞争对手', '制定内容策略'],
        'douyin-strategist': ['分析短视频数据', '优化带货脚本', '提升完播率', 'DOU+投放策略', '爆款视频分析', '直播话术设计', '粉丝运营技巧', '内容选题建议'],
        'kuaishou-strategist': ['私域引流方法', '老铁互动技巧', '直播话术设计', '粉丝粘性提升', '内容创作方向', '用户增长策略', '直播运营技巧', '社区运营方法'],
        'baidu-seo-expert': ['关键词优化方案', '网站诊断分析', '外链建设策略', '排名提升技巧', 'SEO趋势分析', '内容优化建议', '网站结构优化', '移动端SEO'],
        'xiaohongshu-strategist': ['爆款笔记分析', '种草文案写作', '涨粉策略', 'KOL合作方案', '内容选题建议', '笔记优化技巧', '品牌推广策略', '用户增长方法'],
        'wechat-ops': ['公众号内容策划', '标题优化技巧', '粉丝增长策略', '排版设计建议', '内容分发渠道', '数据分析方法', '活动策划方案', '变现模式设计'],
        'video-account-strategist': ['视频号算法分析', '内容策划方向', '直播带货技巧', '私域导流方法', '爆款视频打造', '粉丝运营策略', '数据优化技巧', '品牌合作机会'],
        'zhihu-ops': ['问答技巧指导', '内容撰写方法', '账号定位策略', '涨粉技巧', '品牌影响力建设', '话题选择建议', '互动运营方法', '内容分发策略'],
        'website-seo-expert': ['技术SEO优化', '内容优化策略', '外链建设方法', '数据分析技巧', '排名提升方案', '移动端优化', '网站结构调整', 'SEO工具使用'],
        'private-traffic-ops': ['微信私域搭建', '社群运营技巧', '用户分层方法', '变现转化策略', '用户增长方案', '社群活动策划', '客户关系维护', '私域工具推荐'],
        'discovery-coach': ['需求挖掘技巧', 'SPIN提问训练', '异议处理话术', '方案呈现方法', '客户痛点分析', '销售技巧提升', '沟通技巧训练', '谈判策略'],
        'outbound-strategist': ['外呼话术优化', '客户筛选方法', '转化率提升', '时间管理策略', '客户分类方法', '外呼流程优化', '异议处理技巧', '绩效提升技巧'],
        'pipeline-analyst': ['漏斗优化建议', '阶段定义方法', '预测准确性', '资源分配策略', '销售预测模型', '管道健康分析', '转化率提升', '销售流程优化'],
        'customer-expand': ['客户画像设计', '渠道选择策略', '触达方法', '增长方案', '客户分层管理', '客户价值评估', '客户留存策略', ' upsell技巧'],
        'sales-script-coach': ['销售话术设计', '异议处理技巧', '成交策略', '逼单方法', '开场白优化', '产品介绍技巧', '客户心理分析', '销售流程优化'],
        'crm-specialist': ['CRM系统使用', '客户分层管理', '客户生命周期', '忠诚度提升', '数据管理技巧', '自动化营销', '客户洞察分析', '系统集成方案'],
        'negotiation-expert': ['谈判策略制定', '筹码分析方法', '让步技巧', '双赢思维', '价格谈判', '合同条款协商', '僵局破解', '关系维护'],
        'sales-data-analyst': ['销售数据看板', '趋势分析方法', '归因分析技巧', '预测模型构建', '绩效评估体系', '漏斗分析', '客户行为分析', '数据可视化'],
        'podcast-strategist': ['选题策划方法', '脚本结构设计', '嘉宾邀约技巧', '涨粉策略', '内容分发渠道', '听众增长方法', '品牌合作机会', '变现策略'],
        'video-editor': ['剪辑节奏把控', '转场技巧', '字幕设计', '特效应用', '色彩校正技巧', '音频处理方法', '视频包装设计', '内容结构优化'],
        'crossborder-expert': ['选品策略', '物流方案', '本地化运营', '合规风控', '市场分析方法', '竞争对手研究', '品牌建设策略', '用户获取渠道'],
        'brand-planner': ['品牌定位策略', '视觉识别系统', '品牌故事撰写', '整合营销方案', '品牌传播渠道', '品牌价值提升', '品牌危机管理', '品牌资产建设'],
        'event-ops-expert': ['活动策划方案', '执行管理流程', '效果评估方法', '资源整合策略', '线上活动运营', '线下活动执行', '预算管理技巧', '活动创新思路'],
        'community-ops': ['社群搭建方法', '内容运营策略', '活动策划技巧', '变现转化模式', '社群文化建设', '用户激励机制', '社群数据运营', '危机处理方案'],
        'content-marketing': ['内容策略制定', '选题策划方法', '分发渠道优化', '效果追踪技巧', '内容形式创新', '品牌内容矩阵', '内容团队管理', '内容ROI分析'],
        'ecommerce-operator': ['店铺诊断分析', '流量获取策略', '转化优化技巧', '活动策划方案', '产品定价策略', '库存管理方法', '客服体系优化', '会员体系设计'],
        'customer-service': ['话术设计技巧', '投诉处理方法', '好评引导策略', '效率提升方案', '客户满意度提升', '问题解决技巧', '服务流程优化', '客户关系维护'],
        'complaint-handler': ['投诉处理流程', '情绪管理技巧', '危机公关策略', '赔偿方案设计', '客户挽回方法', '服务质量改进', '投诉预防措施', '品牌声誉维护'],
        'after-sales-consultant': ['售后流程优化', '产品使用指导', '客户关怀策略', '复购引导方法', '售后服务标准', '客户反馈收集', '问题解决技巧', '忠诚度提升方案'],
        'ai-painter': ['一只可爱的猫咪', '科幻城市夜景', '梦幻森林瀑布', '二次元少女', '未来科技风格', '古风插画', '动物拟人化', '自然风景'],
        'copywriter': ['广告文案写作', '品牌文案策划', '社交平台文案', 'SEO文案优化', '产品描述撰写', '活动宣传文案', '品牌故事创作', '文案创意技巧'],
        'video-script-writer': ['短视频脚本创作', '宣传片脚本设计', '分镜头脚本撰写', '口播文案优化', '故事结构设计', '台词撰写技巧', '节奏把控方法', '创意构思'],
        'novel-assistant': ['情节构思技巧', '人物塑造方法', '世界观构建', '文笔优化技巧', '章节布局设计', '悬念设置方法', '情感表达技巧', '风格定位'],
        'data-analyst': ['数据分析方法', '数据可视化技巧', '趋势预测模型', '洞察报告撰写', '数据采集方案', '数据清洗技巧', '统计分析方法', '商业智能工具'],
        'competitor-analyst': ['竞品调研方法', '功能对比分析', '定价策略研究', '竞争优势分析', '市场份额评估', '竞品动态追踪', '策略建议制定', '行业趋势分析'],
        'user-researcher': ['用户访谈技巧', '问卷调研设计', '行为分析方法', '用户画像构建', '需求挖掘技巧', '用户体验评估', '研究报告撰写', '用户测试方案'],
        'kindergarten-teacher': ['幼儿启蒙方法', '如何培养好习惯', '幼小衔接准备', '亲子沟通技巧', '儿童心理发展', '游戏化教育', '行为习惯养成', '社交能力培养'],
        'primary-teacher': ['小学数学怎么学', '语文阅读理解技巧', '英语启蒙方法', '学习习惯培养', '兴趣激发策略', '家庭教育指导', '学科能力提升', '学习方法指导'],
        'middle-teacher': ['初中英语提分技巧', '中考冲刺计划', '青春期沟通方法', '学习压力管理', '学科均衡发展', '升学规划指导', '学习动力激发', '时间管理技巧'],
        'high-teacher': ['高考倒计时复习计划', '志愿填报技巧', '弱势学科突破', '学习方法优化', '心理压力调节', '名校申请攻略', '专业选择指导', '职业规划建议'],
        'university-teacher': ['大学专业怎么选', '考研备考攻略', '留学申请指南', '职业规划建议', '学习方法指导', '时间管理技巧', '人际关系处理', '实习就业准备']
      };
      
      const allPrompts = promptsMap[state.currentEmployee.id] || ['开始对话'];
      
      // 随机选择4个问题
      let shuffled = allPrompts.sort(() => 0.5 - Math.random());
      let selected = shuffled.slice(0, 4);
      
      // 如果问题不足4个，重复填充
      while (selected.length < 4) {
        selected.push(...allPrompts.slice(0, 4 - selected.length));
      }
      
      document.getElementById('quickPromptsList').innerHTML = selected.map(p => 
        `<div class="quick-prompt" onclick="useQuickPromptForCurrentEmployee('${p}')">${p}</div>`
      ).join('');
    }

    // ============ API Key管理 ============
    function checkApiKeys() {
      // 检查API Key是否已配置（不再强制重置）
      // 优先级：state当前值 > localStorage > 默认值
      if (!state.chatApiKey || state.chatApiKey === 'null' || !state.chatApiKey.startsWith('sk-')) {
        const storedKey = localStorage.getItem('deepseek_api_key');
        state.chatApiKey = (storedKey && storedKey !== 'null' && storedKey.startsWith('sk-'))
          ? storedKey
          : DEFAULT_CHAT_API_KEY;
      }
      if (!state.minimaxApiKey || state.minimaxApiKey === 'null' || !state.minimaxApiKey.startsWith('sk-')) {
        const storedKey = localStorage.getItem('minimax_api_key');
        state.minimaxApiKey = (storedKey && storedKey !== 'null' && storedKey.startsWith('sk-'))
          ? storedKey
          : DEFAULT_MINIMAX_API_KEY;
      }
      if (!state.imageApiKey || state.imageApiKey === 'null' || !state.imageApiKey.startsWith('sk-')) {
        const storedKey = localStorage.getItem('siliconflow_api_key');
        state.imageApiKey = (storedKey && storedKey !== 'null' && storedKey.startsWith('sk-'))
          ? storedKey
          : DEFAULT_IMAGE_API_KEY;
      }
      if (!state.imageModel || state.imageModel === 'null') {
        state.imageModel = localStorage.getItem('image_model') || DEFAULT_IMAGE_MODEL;
      }

      console.log('📋 API Key 检查完成:', {
        deepSeek: state.chatApiKey ? '✅ 已配置 (' + state.chatApiKey.substring(0, 10) + '...)' : '❌ 未配置',
        miniMax: state.minimaxApiKey ? '✅ 已配置 (' + state.minimaxApiKey.substring(0, 10) + '...)' : '❌ 未配置',
        siliconFlow: state.imageApiKey ? '✅ 已配置 (' + state.imageApiKey.substring(0, 10) + '...)' : '❌ 未配置'
      });

      updateApiStatus();
    }

    function openApiSettings() {
      openSettingsPanel();
    }

    function saveChatApiKey() {
      const apiKey = document.getElementById('apiKeyInput').value.trim();
      const errorMsg = document.getElementById('apiErrorMsg');
      
      if (!apiKey) {
        document.getElementById('apiKeyInput').classList.add('api-input-error');
        errorMsg.classList.add('show');
        return;
      }
      
      if (!apiKey.startsWith('sk-')) {
        document.getElementById('apiKeyInput').classList.add('api-input-error');
        errorMsg.textContent = 'API Key 格式不正确，应以 sk- 开头';
        errorMsg.classList.add('show');
        return;
      }
      
      state.chatApiKey = apiKey;
      localStorage.setItem('deepseek_api_key', apiKey);
      localStorage.setItem('deepseek_api_key_modified', 'true');  // 标记用户手动修改
      document.getElementById('apiSettingsOverlay').classList.add('hidden');
      updateApiStatus();
      showToast('DeepSeek API配置成功', 'success');
    }

    function saveMinimaxApiKey() {
      const apiKey = document.getElementById('minimaxApiKeyInput').value.trim();
      const errorMsg = document.getElementById('minimaxApiErrorMsg');
      
      if (!apiKey) {
        document.getElementById('minimaxApiKeyInput').classList.add('api-input-error');
        errorMsg.classList.add('show');
        return;
      }
      
      state.minimaxApiKey = apiKey;
      localStorage.setItem('minimax_api_key', apiKey);
      localStorage.setItem('minimax_api_key_modified', 'true');  // 标记用户手动修改
      document.getElementById('apiSettingsOverlay').classList.add('hidden');
      updateApiStatus();
      showToast('Minimax API配置成功', 'success');
    }

    function saveImageApiKey() {
      const apiKey = document.getElementById('imageApiKeyInput').value.trim();
      const model = document.getElementById('imageModelInput').value.trim();
      const errorMsg = document.getElementById('imageApiErrorMsg');
      
      if (!apiKey) {
        document.getElementById('imageApiKeyInput').classList.add('api-input-error');
        errorMsg.classList.add('show');
        return;
      }
      
      state.imageApiKey = apiKey;
      state.imageModel = model || DEFAULT_IMAGE_MODEL;
      localStorage.setItem('siliconflow_api_key', apiKey);
      localStorage.setItem('siliconflow_api_key_modified', 'true');  // 标记用户手动修改
      localStorage.setItem('image_model', state.imageModel);
      document.getElementById('apiSettingsOverlay').classList.add('hidden');
      showToast('绘画API配置成功', 'success');
    }

    function updateApiStatus() {
      const indicator = document.getElementById('apiStatusIndicator');
      const statusText = document.getElementById('apiStatusText');
      
      console.log('updateApiStatus 被调用, state:', {
        chatApiKey: state.chatApiKey,
        minimaxApiKey: state.minimaxApiKey
      });
      
      const hasDeepSeekApi = !!state.chatApiKey;
      const hasMinimaxApi = !!state.minimaxApiKey;
      
      console.log('API状态:', { hasDeepSeekApi, hasMinimaxApi });
      
      if (hasDeepSeekApi || hasMinimaxApi) {
        indicator.classList.remove('disconnected');
        indicator.classList.add('connected');
        // 显示已配置的模型
        const configured = [];
        if (hasDeepSeekApi) configured.push('DeepSeek');
        if (hasMinimaxApi) configured.push('Minimax');
        statusText.textContent = configured.join(' + ');
        console.log('状态已更新为: ' + configured.join(' + '));
      } else {
        indicator.classList.remove('connected');
        indicator.classList.add('disconnected');
        statusText.textContent = '未连接';
        console.log('状态已更新为: 未连接');
      }
    }

    // ============ AI绘画功能 ============
    let imageAbortController = null;

    async function generateImage() {
      const prompt = document.getElementById('paintingPrompt')?.value.trim();
      
      // 以图生图模式检查
      if (paintingMode === 'image') {
        if (!referenceImageBase64) {
          showToast('请先上传参考图片');
          return;
        }
        if (!prompt) {
          showToast('请输入修改描述');
          return;
        }
      } else {
        if (!prompt) {
          showToast('请输入图片描述');
          return;
        }
      }

      // 绘画API Key - 直接从localStorage读取
      state.imageApiKey = localStorage.getItem('siliconflow_api_key') || DEFAULT_IMAGE_API_KEY;
      console.log('🎨 绘画功能使用API Key:', state.imageApiKey ? state.imageApiKey.substring(0, 10) + '...' : '❌');
      
      // 获取选中的尺寸（默认使用API支持的1024x1024）
      const activeSize = document.querySelector('.size-option.active');
      let size = activeSize?.dataset.size || '1024x1024';
      
      // 确保尺寸格式正确
      console.log('选择的尺寸:', size);
      
      // 显示生成状态
      const overlay = document.getElementById('generatingOverlay');
      overlay.classList.add('active');
      
      const generateBtn = document.getElementById('generateBtn');
      generateBtn.disabled = true;
      
      imageAbortController = new AbortController();
      
      try {
        // 构建请求体
        let requestBody;
        
        if (paintingMode === 'image' && referenceImageBase64) {
          // 以图生图模式
          console.log('以图生图模式:', {
            mode: 'image-to-image',
            strength: imageStrength,
            hasImage: !!referenceImageBase64
          });
          
          requestBody = {
            model: state.imageModel,
            prompt: prompt,
            image: referenceImageBase64,
            image_size: size,
            batch_size: 1,
            num_inference_steps: 20,
            guidance_scale: 7.5
          };
        } else {
          // 文生图模式
          requestBody = {
            model: state.imageModel,
            prompt: prompt,
            image_size: size,
            batch_size: 1,
            num_inference_steps: 20
          };
        }
        
        // 打印请求信息用于调试
        console.log('绘画API请求:', {
          endpoint: IMAGE_API_ENDPOINT,
          model: state.imageModel,
          prompt: prompt,
          size: size,
          mode: paintingMode,
          apiKeyPrefix: state.imageApiKey ? state.imageApiKey.substring(0, 10) + '...' : '无'
        });
        
        const response = await fetch(IMAGE_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.imageApiKey}`
          },
          body: JSON.stringify(requestBody),
          signal: imageAbortController.signal
        });
        
        console.log('绘画API响应状态:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('绘画API错误响应:', errorText);
          let errorData = {};
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            // 解析失败，使用原始文本
          }
          throw new Error(errorData.error?.message || errorData.message || `请求失败 (${response.status}): ${errorText.substring(0, 100)}`);
        }
        
        const data = await response.json();
        console.log('绘画API响应数据:', data);
        
        // 隐藏生成状态
        overlay.classList.remove('active');
        generateBtn.disabled = false;
        
        // 显示生成的图片
        if (data.images && data.images[0] && data.images[0].url) {
          const imageUrl = data.images[0].url;
          
          // 保存到历史
          state.generatedImages.push({
            url: imageUrl,
            prompt: prompt,
            size: size,
            mode: paintingMode,
            time: Date.now()
          });
          
          // 在消息区域显示图片
          displayGeneratedImage(imageUrl, prompt, size, paintingMode === 'image' ? referenceImageBase64 : null);
          
          showToast(paintingMode === 'image' ? '以图生图完成' : '图片生成成功', 'success');
        } else {
          throw new Error('未获取到图片URL');
        }
        
      } catch (error) {
        overlay.classList.remove('active');
        generateBtn.disabled = false;
        
        if (error.name === 'AbortError') {
          showToast('生成已取消');
        } else {
          console.error('Image API Error:', error);
          
          let errorMsg = '图片生成失败';
          if (error.message.includes('401') || error.message.includes('403')) {
            errorMsg = 'API Key无效，请检查配置';
          } else if (error.message.includes('429')) {
            errorMsg = '请求过于频繁，请稍后重试';
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMsg = '网络连接失败，请检查网络';
          } else {
            errorMsg = error.message || '图片生成失败';
          }
          
          showToast(errorMsg);
        }
      }
      
      imageAbortController = null;
    }

    function cancelImageGeneration() {
      if (imageAbortController) {
        imageAbortController.abort();
      }
    }

    function displayGeneratedImage(imageUrl, prompt, size, referenceImage = null) {
      const container = document.getElementById('imageResultContainer');
      if (!container) return;
      
      const imageCard = document.createElement('div');
      imageCard.className = 'image-result-card';
      
      // 如果是以图生图模式，显示对比视图
      let imageDisplayHtml = '';
      if (referenceImage) {
        imageDisplayHtml = `
          <div class="image-comparison">
            <div class="comparison-item">
              <div class="comparison-label">原图</div>
              <img src="${referenceImage}" alt="参考图片" loading="lazy">
            </div>
            <div class="comparison-arrow">→</div>
            <div class="comparison-item">
              <div class="comparison-label">生成结果</div>
              <img src="${imageUrl}" alt="生成的图片" loading="lazy" onclick="previewImage('${imageUrl}')">
            </div>
          </div>
        `;
      } else {
        imageDisplayHtml = `
          <div class="image-display" onclick="previewImage('${imageUrl}')">
            <img src="${imageUrl}" alt="生成的图片" loading="lazy">
          </div>
        `;
      }
      
      imageCard.innerHTML = `
        <div class="image-result-header">
          <div class="image-result-title">
            <span>✨</span> ${referenceImage ? '以图生图' : '生成成功'}
          </div>
          <div class="image-result-actions">
            <button class="image-action-btn" onclick="previewImage('${imageUrl}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              预览
            </button>
            <button class="image-action-btn" onclick="downloadImage('${imageUrl}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              下载
            </button>
          </div>
        </div>
        ${imageDisplayHtml}
        <div class="image-prompt-info">
          <strong>描述：</strong>${escapeHtml(prompt)}<br>
          <strong>尺寸：</strong>${size}
        </div>
      `;
      
      container.insertBefore(imageCard, container.firstChild);
    }

    function previewImage(imageUrl) {
      const overlay = document.getElementById('imagePreviewOverlay');
      const previewImg = document.getElementById('previewImage');
      previewImg.src = imageUrl;
      overlay.classList.add('active');
    }

    function closeImagePreview(event) {
      if (event) {
        event.stopPropagation();
      }
      const overlay = document.getElementById('imagePreviewOverlay');
      overlay.classList.remove('active');
    }

    function downloadImage(imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `AI绘画_${Date.now()}.png`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('图片开始下载', 'success');
    }

    // ============ Toast提示 ============
    function showToast(message, type = 'error') {
      const toast = document.getElementById('toast');
      const toastMessage = document.getElementById('toastMessage');
      toastMessage.textContent = message;
      toast.className = 'toast' + (type === 'success' ? ' success' : '');
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // ============ 对话历史管理 ============
    function generateChatId() {
      return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveConversation() {
      if (!state.currentChatId) return;
      
      // 使用员工ID作为历史记录的前缀
      const historyKey = state.currentEmployee ? `employee_${state.currentEmployee.id}_${state.currentChatId}` : state.currentChatId;
      
      if (state.messages.length === 0) {
        delete state.conversationHistory[historyKey];
      } else {
        state.conversationHistory[historyKey] = {
          id: historyKey,
          employeeId: state.currentEmployee?.id || null,
          title: getChatTitle(),
          messages: state.messages.slice(-MAX_CONTEXT_MESSAGES),
          updatedAt: Date.now()
        };
      }
      
      localStorage.setItem('conversation_history', JSON.stringify(state.conversationHistory));
      loadHistoryList();
    }

    function getChatTitle() {
      // 从第一条用户消息提取标题
      const firstUserMsg = state.messages.find(m => m.role === 'user');
      if (firstUserMsg) {
        return firstUserMsg.content.slice(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '');
      }
      return '新建对话';
    }

    async function loadHistoryList() {
      const historyList = document.getElementById('historyList');

      if (!Api.isLoggedIn) {
        historyList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">登录后查看历史记录</div>';
        return;
      }

      historyList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">加载中...</div>';

      try {
        console.log('开始加载历史记录...');
        const res = await Api.listSessions(1, 50);
        console.log('历史记录API响应:', res);
        
        if (!res) {
          throw new Error('API返回为空');
        }
        
        if (res.code !== 200) {
          console.error('API返回错误:', res.code, res.message);
          historyList.innerHTML = `<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">加载失败: ${res.message || '未知错误'}</div>`;
          return;
        }
        
        if (!res.data || !res.data.list) {
          historyList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">暂无历史对话</div>';
          return;
        }

        const sessions = res.data.list;
        console.log('历史会话列表:', sessions);

        if (sessions.length === 0) {
          historyList.innerHTML = '<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">暂无历史对话</div>';
          return;
        }

        state.serverSessionMap = {};
        historyList.innerHTML = '';

        sessions.forEach(session => {
          const employeeId = session.employee_id || '';
          const employeeName = session.employee_name || '通用对话';
          const employeeIcon = employeeId ? (AI_EMPLOYEES.find(e => e.id === employeeId)?.icon || '🤖') : '💬';

          state.serverSessionMap[session.id] = session;

          const item = document.createElement('div');
          item.className = 'history-item' + (state.currentServerSessionId === session.id ? ' active' : '');
          item.dataset.id = session.id;
          item.dataset.serverId = session.id;
          item.innerHTML = `
            <div class="history-employee">${employeeIcon} ${escapeHtml(employeeName)}</div>
            <div class="history-title">${escapeHtml(session.title || '新对话')}</div>
            <div class="history-date">${formatDate(session.updated_at)}</div>
            <div class="history-delete" onclick="deleteHistory(event, '${session.id}', true)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </div>
          `;
          item.onclick = () => loadServerConversation(session.id);
          historyList.appendChild(item);
        });
        
        console.log('历史记录加载完成');
      } catch(e) {
        console.error('加载历史失败:', e);
        historyList.innerHTML = `<div style="color: var(--text-tertiary); font-size: 13px; padding: 16px; text-align: center;">加载失败: ${e.message || '网络错误'}</div>`;
      }
    }

    async function loadServerConversation(serverSessionId) {
      try {
        const res = await Api.getSessionMessages(serverSessionId);
        if (res.code !== 200) {
          showToast('加载对话失败');
          return;
        }

        const session = res.data.session;
        const messages = res.data.messages || [];

        state.currentServerSessionId = serverSessionId;
        state.currentChatId = 'server_' + serverSessionId;
        state.messages = messages.map(m => ({
          role: m.role,
          content: m.content,
          time: m.created_at
        }));

        if (session.employee_id) {
          const employee = AI_EMPLOYEES.find(emp => emp.id === session.employee_id);
          if (employee) {
            state.currentEmployee = employee;
            document.getElementById('currentEmployeeAvatar').textContent = employee.icon;
            document.getElementById('currentEmployeeAvatar').className = `current-employee-avatar employee-avatar ${employee.dept}`;
            document.getElementById('currentEmployeeName').textContent = employee.name;
            document.getElementById('currentEmployeeDept').textContent = employee.dept;
            document.getElementById('headerTitle').textContent = employee.name;
            document.getElementById('headerBadgeText').textContent = employee.dept;
            updateInputPlaceholder(employee);
            updateQuickPrompts(employee);
            updateWelcomeForEmployee(employee);
          }
        }

        document.querySelector('.header-title').textContent = session.title || '对话记录';

        document.querySelectorAll('.history-item').forEach(item => {
          item.classList.toggle('active', item.dataset.id == serverSessionId);
        });

        await renderMessages();
        closeSidebar();
      } catch(e) {
        console.error('加载对话失败:', e);
        showToast('加载失败');
      }
    }

    async function loadConversation(chatId) {
      const conv = state.conversationHistory[chatId];
      if (!conv) return;
      
      state.currentChatId = chatId;
      state.messages = [...conv.messages];
      
      // 恢复员工信息
      if (conv.employeeId) {
        const employee = AI_EMPLOYEES.find(emp => emp.id === conv.employeeId);
        if (employee) {
          state.currentEmployee = employee;
          document.getElementById('currentEmployeeAvatar').textContent = employee.icon;
          document.getElementById('currentEmployeeAvatar').className = `current-employee-avatar employee-avatar ${employee.dept}`;
          document.getElementById('currentEmployeeName').textContent = employee.name;
          document.getElementById('currentEmployeeDept').textContent = employee.dept;
          document.getElementById('headerTitle').textContent = employee.name;
          document.getElementById('headerBadgeText').textContent = employee.dept;
          updateInputPlaceholder(employee);
          updateQuickPrompts(employee);
          updateWelcomeForEmployee(employee);
        }
      }
      
      document.querySelector('.header-title').textContent = conv.title;
      
      // 更新历史列表高亮
      document.querySelectorAll('.history-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === chatId);
      });
      
      // 渲染消息
      await renderMessages();
    }

    async function deleteHistory(event, chatId, isServer = false) {
      event.stopPropagation();

      if (isServer) {
        try {
          const res = await Api.deleteSession(chatId);
          if (res.code === 200) {
            if (state.currentServerSessionId == chatId) {
              state.currentServerSessionId = null;
              state.currentChatId = null;
              state.messages = [];
              await createNewChat();
            }
            await loadHistoryList();
            showToast('对话已删除');
          } else {
            showToast(res.message || '删除失败');
          }
        } catch(e) {
          showToast('删除失败');
        }
        return;
      }

      if (state.conversationHistory[chatId]) {
        delete state.conversationHistory[chatId];
        localStorage.setItem('conversation_history', JSON.stringify(state.conversationHistory));
        
        if (state.currentChatId === chatId) {
          state.currentChatId = null;
          state.messages = [];
          createNewChat();
        }
        
        loadHistoryList();
        showToast('对话已删除');
      }
    }

    function formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      
      const diff = now - date;
      
      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
      if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
      if (diff < 172800000) return '昨天';
      if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
      
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }

    // ============ 移动端侧边栏控制 ============
    function toggleSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      
      // 禁止/恢复body滚动
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }
    
    function closeSidebar() {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    // 点击侧边栏内容后自动关闭（移动端）
    function handleMobileSidebarClick() {
      if (window.innerWidth <= 1024) {
        setTimeout(closeSidebar, 150);
      }
    }

    // ============ 新建对话 ============
    async function createNewChat() {
      state.currentChatId = null;
      state.messages = [];
      state.currentServerSessionId = null;

      closeSidebar();

      if (state.currentEmployee) {
        updateWelcomeForEmployee(state.currentEmployee);
      } else {
        renderDefaultWelcome();
      }

      document.querySelector('.header-title').textContent = '新建对话';

      document.querySelectorAll('.history-item').forEach(item => {
        item.classList.remove('active');
      });
    }

    function renderDefaultWelcome() {
      const messagesContainer = document.getElementById('chatMessages');
      const quickPrompts = document.getElementById('quickPrompts');
      quickPrompts.style.display = 'none';
      
      messagesContainer.innerHTML = `
        <div class="welcome-container" id="welcomeContainer" style="padding: 40px 20px;">
          <div class="welcome-icon" style="margin-bottom: 32px;">
            <div style="width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, #00A1D6, #7B61FF); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0, 161, 214, 0.3);">
              <span style="font-size: 32px; font-weight: bold; color: white; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">LC</span>
            </div>
          </div>
          <h2 class="welcome-title" style="font-size: 36px; font-weight: 700; margin-bottom: 16px; background: linear-gradient(135deg, #00A1D6, #7B61FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center;">灵策智算</h2>
          <h1 class="welcome-subtitle" style="font-size: 48px; font-weight: 800; margin-bottom: 24px; text-align: center; line-height: 1.2;">
            <span style="color: #00A1D6;">AI驱动的</span><br>
            <span style="color: white;">智能工作平台</span>
          </h1>
          <p class="welcome-description" style="font-size: 16px; line-height: 1.6; color: var(--text-secondary); text-align: center; margin-bottom: 48px; max-width: 600px; margin-left: auto; margin-right: auto;">
            深圳灵策智算控股有限责任公司打造的下一代AI工作台，汇聚多个专业AI员工，<br>
            助您高效完成各类工作任务。
          </p>
          <div class="welcome-features" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 800px; margin: 0 auto;">
            <div class="feature-card" onclick="openAiEmployeeModal()" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; cursor: pointer;">
              <div class="feature-card-icon blue" style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 24px;">
                💬
              </div>
              <div class="feature-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: white;">智能对话</div>
              <div class="feature-card-desc" style="font-size: 14px; color: var(--text-secondary);">专业AI员工随时待命</div>
            </div>
            <div class="feature-card" onclick="selectEmployee('ai-painter')" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; cursor: pointer;">
              <div class="feature-card-icon orange" style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 24px;">
                🎨
              </div>
              <div class="feature-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: white;">AI生图</div>
              <div class="feature-card-desc" style="font-size: 14px; color: var(--text-secondary);">一键生成创意图片</div>
            </div>
            <div class="feature-card" onclick="openAiEmployeeModal()" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; cursor: pointer;">
              <div class="feature-card-icon green" style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #4facfe, #00f2fe); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 24px;">
                📊
              </div>
              <div class="feature-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: white;">数据分析</div>
              <div class="feature-card-desc" style="font-size: 14px; color: var(--text-secondary);">深度洞察数据价值</div>
            </div>
            <div class="feature-card" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 32px 24px; text-align: center; transition: all 0.3s ease; cursor: pointer;">
              <div class="feature-card-icon purple" style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #a8edea, #fed6e3); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: white; font-size: 24px;">
                🔒
              </div>
              <div class="feature-card-title" style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: white;">安全可靠</div>
              <div class="feature-card-desc" style="font-size: 14px; color: var(--text-secondary);">企业级数据保护</div>
            </div>
          </div>
        </div>
      `;
    }

    // ============ 消息渲染 ============
    async function renderMessages() {
      const messagesContainer = document.getElementById('chatMessages');
      
      if (state.messages.length === 0) {
        if (state.currentEmployee) {
          updateWelcomeForEmployee(state.currentEmployee);
        } else {
          renderDefaultWelcome();
        }
        return;
      }
      
      messagesContainer.innerHTML = '';
      
      state.messages.forEach((msg, index) => {
        if (msg.role === 'system') return; // 不显示系统消息
        addMessageElement(msg.role, msg.content, '', false);
      });
      
      // 为最后一条AI消息生成相关问题
      const messageDivs = messagesContainer.querySelectorAll('.message.assistant');
      if (messageDivs.length > 0) {
        const lastAssistantMessage = messageDivs[messageDivs.length - 1];
        const content = lastAssistantMessage.dataset.rawContent || lastAssistantMessage.querySelector('.message-bubble').textContent;
        
        // 获取模型和API Key
        let model = 'deepseek';
        let apiKey = state.chatApiKey;
        
        if (state.collaborationMode && state.selectedEmployees.length > 0) {
          model = state.selectedEmployees[0].model;
          apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
        } else if (state.currentEmployee) {
          model = state.currentEmployeeModel;
          apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
        }
        
        // 生成相关问题
        await generateFollowUpQuestions(lastAssistantMessage, content, model, apiKey);
      }
      
      forceScrollToBottom(); // 加载历史消息时强制滚动到底部
    }

    function addMessageElement(type, content, time, animate = true) {
      const messagesContainer = document.getElementById('chatMessages');
      
      // 隐藏欢迎界面
      const welcome = document.getElementById('welcomeContainer');
      if (welcome) {
        welcome.style.display = 'none';
      }
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type === 'user' ? 'user' : 'assistant'}`;
      if (!animate) messageDiv.style.animation = 'none';
      
      const avatarIcon = state.currentEmployee?.icon || (type === 'user' ? '我' : '灵');
      const avatarContent = type === 'user' ? 
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' :
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      
      // 处理内容中的代码块
      const formattedContent = formatContent(content);
      const now = new Date();
      const timeStr = time || `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // 为消息生成唯一ID
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      messageDiv.id = messageId;
      
      // 操作按钮（仅AI消息显示分享按钮）
      const actionButtons = `
        <div class="message-actions">
          <button class="message-action-btn" onclick="event.stopPropagation(); copyMessage('${messageId}')" title="复制">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            复制
          </button>
          ${type === 'assistant' ? `
          <button class="message-action-btn" onclick="event.stopPropagation(); shareMessage('${messageId}')" title="分享">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            分享
          </button>
          ` : ''}
        </div>
      `;
      
      messageDiv.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="message-content">
          <div class="message-bubble">${formattedContent}</div>
          <div class="message-time">${timeStr}</div>
          ${actionButtons}
          ${type === 'assistant' ? createFollowUpHtml() : ''}
        </div>
      `;
      
      // 存储原始内容用于复制和分享
      messageDiv.dataset.rawContent = content;
      messageDiv.dataset.role = type;
      
      messagesContainer.appendChild(messageDiv);
      scrollToBottom();
      
      return messageDiv;
    }

    function formatContent(content) {
      // 转义HTML
      let formatted = escapeHtml(content);
      
      // 代码块处理
      formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
      
      // 行内代码处理
      formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      // 粗体
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // 斜体
      formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      // 换行
      formatted = formatted.replace(/\n/g, '<br>');
      
      return formatted;
    }

    // 打字机效果函数
    function typewriterEffect(messageDiv, content, speed = 20) {
      return new Promise((resolve) => {
        console.log('📝 typewriterEffect 开始 - content长度:', content.length);

        const bubble = messageDiv.querySelector('.message-bubble');
        console.log('📝 找到bubble元素:', bubble);

        if (!bubble) {
          console.error('❌ 未找到 .message-bubble 元素!');
          resolve();
          return;
        }

        let index = 0;
        const rawContent = messageDiv.dataset.rawContent || content;
        messageDiv.dataset.rawContent = rawContent;  // 确保存储原始内容
        console.log('📝 原始内容长度:', rawContent.length);

        // 先显示光标
        bubble.innerHTML = '<span class="typing-cursor">|</span>';
        console.log('✅ 光标已显示');

        const typeChar = () => {
          if (index < rawContent.length) {
            // 每次添加一个字符
            const currentText = rawContent.substring(0, index + 1);
            bubble.innerHTML = formatContent(currentText) + '<span class="typing-cursor">|</span>';
            index++;

            if (index % 50 === 0) {  // 每50个字符打印一次日志
              console.log(`⌨️ 打字进度: ${index}/${rawContent.length} (${Math.round(index/rawContent.length*100)}%)`);
            }

            scrollToBottom();
            setTimeout(typeChar, speed);
          } else {
            // 完成，移除光标
            console.log('✨ 打字完成! 总共:', rawContent.length, '个字符');
            bubble.innerHTML = formatContent(rawContent);
            resolve();
          }
        };

        // 开始打字效果
        setTimeout(typeChar, 100);
      });
    }

    // 暴露测试函数到全局
    window.testTypewriter = function() {
      console.log('🧪 开始测试打字机效果...');
      const testDiv = addMessageElement('assistant', '', null);
      testDiv.dataset.rawContent = '这是打字机效果测试！如果你能看到文字逐个出现，说明功能正常工作。';
      
      typewriterEffect(testDiv, '这是打字机效果测试！如果你能看到文字逐个出现，说明功能正常工作。', 50)
        .then(() => console.log('✅ 测试完成！'));
    };

    console.log('🎉 main.js 已加载 - 打字机效果已就绪');
    console.log('💡 在控制台输入 testTypewriter() 可以测试打字机效果');

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // ============ 润色历史栈 ============
    let polishHistory = [];
    let lastPolishedContent = ''; // 记录上一次润色后的内容，用于判断用户是否手动修改

    // ============ 润色功能 ============
    async function polishMessage() {
      const input = document.getElementById('chatInput');
      const content = input.value.trim();
      
      if (!content) return;
      
      const polishBtn = document.getElementById('polishBtn');
      const undoBtn = document.getElementById('undoBtn');
      const originalText = input.value;
      
      // 如果用户手动修改过内容（与上次润色结果不同），清空历史栈
      if (lastPolishedContent && input.value !== lastPolishedContent) {
        polishHistory = [];
        lastPolishedContent = ''; // 保持与 updatePolishBtnState 一致
        updateUndoBtnState();
      }
      
      // 保存当前内容到历史栈
      polishHistory.push(originalText);
      
      // 设置润色状态
      polishBtn.classList.add('polishing');
      polishBtn.querySelector('.polish-text').textContent = '润色中';
      polishBtn.disabled = true;

      // 获取API Key - 直接从localStorage读取，不再检查
      const apiKey = localStorage.getItem('deepseek_api_key') || DEFAULT_CHAT_API_KEY;
      state.chatApiKey = apiKey;  // 同步到state

      console.log('🔑 润色功能使用API Key:', apiKey ? apiKey.substring(0, 10) + '...' : '❌');
      
      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: `请将以下用户问题进行润色优化，使其更加具体、清晰、有针对性。保持用户的原始意图不变，只优化表述方式。

用户问题：${content}

润色后的版本（直接输出润色结果，不要其他解释）：`
              }
            ],
            stream: false,
            temperature: 0.3,
            max_tokens: 500
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `请求失败 (${response.status})`);
        }
        
        const data = await response.json();
        const polishedContent = data.choices?.[0]?.message?.content?.trim();
        
        if (polishedContent) {
          lastPolishedContent = polishedContent;
          input.value = polishedContent;
          autoResize(input);
          showToast('润色完成，可修改后发送', 'success');
          // 润色成功，启用返回按钮
          updateUndoBtnState();
        } else {
          // 润色结果为空，从历史栈移除
          polishHistory.pop();
          showToast('润色结果为空，请重试');
        }
      } catch (error) {
        console.error('润色失败:', error);
        // 润色失败，从历史栈移除
        polishHistory.pop();
        let errorMsg = '润色失败';
        if (error.message.includes('401')) {
          errorMsg = 'API Key 无效';
        } else if (error.message.includes('429')) {
          errorMsg = '请求过于频繁，请稍后重试';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMsg = '网络连接失败';
        }
        showToast(errorMsg);
      } finally {
        resetPolishBtn();
      }
      
      function resetPolishBtn() {
        polishBtn.classList.remove('polishing');
        polishBtn.querySelector('.polish-text').textContent = '润色';
        polishBtn.disabled = !input.value.trim();
      }
    }

    // ============ 返回功能 ============
    function undoPolish() {
      const input = document.getElementById('chatInput');
      
      if (polishHistory.length === 0) return;
      
      // 先清空lastPolishedContent，避免触发oninput时条件判断错误
      lastPolishedContent = '';
      
      // 从历史栈弹出上一个版本
      const previousContent = polishHistory.pop();
      input.value = previousContent;
      autoResize(input);
      
      // 更新返回按钮状态
      updateUndoBtnState();
      
      // 同时更新润色按钮状态
      updatePolishBtnState();
      
      showToast('已恢复到上一个版本', 'info');
    }

    // 更新返回按钮状态
    function updateUndoBtnState() {
      const undoBtn = document.getElementById('undoBtn');
      if (undoBtn) {
        if (polishHistory.length > 0) {
          undoBtn.classList.add('visible');
          undoBtn.disabled = false;
        } else {
          undoBtn.classList.remove('visible');
          undoBtn.disabled = true;
        }
      }
    }

    // 监听输入框内容变化，控制润色按钮状态
    function updatePolishBtnState() {
      const input = document.getElementById('chatInput');
      const polishBtn = document.getElementById('polishBtn');
      if (polishBtn && input) {
        polishBtn.disabled = !input.value.trim() || state.isGenerating;
      }
      
      // 用户手动修改输入框内容时，清空历史栈
      // 如果当前内容与lastPolishedContent不同，说明用户手动修改了
      if (lastPolishedContent && input.value !== lastPolishedContent) {
        polishHistory = [];
        lastPolishedContent = '';
        updateUndoBtnState();
      }
    }

    // ============ 发送消息 ============
    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const content = input.value.trim();

      if (!content) return;

      // 登录检查：未登录则弹出登录框
      if (!requireAuth(content)) return;

      // 检查是否选择了AI员工
      if (!state.currentEmployee && !state.collaborationMode) {
        openAiEmployeeModal();
        showToast('请先选择AI员工');
        return;
      }
      
      // 协作模式下检查是否有选中的员工
      if (state.collaborationMode && state.selectedEmployees.length === 0) {
        openAiEmployeeModal();
        showToast('协作模式下请先添加AI员工');
        return;
      }
      
      // 如果是绘画师，不处理普通消息
      if (state.currentEmployee?.isPainter && !state.collaborationMode) {
        // 将消息填入绘画输入框
        const paintingPrompt = document.getElementById('paintingPrompt');
        if (paintingPrompt) {
          paintingPrompt.value = content;
          paintingPrompt.focus();
          input.value = '';
          // 填入绘画描述后清空润色历史栈
          polishHistory = [];
          lastPolishedContent = '';
          updateUndoBtnState();
          showToast('已填入绘画描述，点击开始生成', 'success');
        }
        return;
      }
      
      // 检查API Key - 已临时禁用检查，直接使用默认值
      // 根据协作模式或当前员工的模型设置对应的API Key（强制从localStorage读取）
      const model = state.currentEmployeeModel || 'deepseek';

      if (model === 'minimax') {
        state.minimaxApiKey = localStorage.getItem('minimax_api_key') || DEFAULT_MINIMAX_API_KEY;
      } else {
        state.chatApiKey = localStorage.getItem('deepseek_api_key') || DEFAULT_CHAT_API_KEY;
      }
      state.imageApiKey = localStorage.getItem('siliconflow_api_key') || DEFAULT_IMAGE_API_KEY;

      console.log('🔑 使用API Key:', {
        model: model,
        chatKey: state.chatApiKey ? state.chatApiKey.substring(0, 10) + '...' : '❌',
        minimaxKey: state.minimaxApiKey ? state.minimaxApiKey.substring(0, 10) + '...' : '❌',
        imageKey: state.imageApiKey ? state.imageApiKey.substring(0, 10) + '...' : '❌'
      });
      
      // 禁用输入
      input.value = '';
      input.style.height = 'auto';
      input.disabled = true;
      document.getElementById('sendBtn').disabled = true;
      document.getElementById('polishBtn').disabled = true;
      document.getElementById('stopBtn').style.display = 'flex';

      // 发送消息后清空润色历史栈
      polishHistory = [];
      lastPolishedContent = '';
      updateUndoBtnState();

      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // 添加用户消息到界面
      addMessageElement('user', content, time);
      forceScrollToBottom();

      // 更新标题
      if (state.messages.filter(m => m.role === 'user').length === 0) {
        document.querySelector('.header-title').textContent = content.slice(0, 20) + (content.length > 20 ? '...' : '');
      }

      state.isGenerating = true;
      state.abortController = new AbortController();

      try {
        // 如果没有服务端会话，先创建
        if (!state.currentServerSessionId) {
          const employeeId = state.currentEmployee?.id || '';
          const employeeName = state.currentEmployee?.name || '';

          const createRes = await Api.createSession(
            employeeId,
            employeeName,
            state.collaborationMode,
            state.collaborationMode ? state.selectedEmployees.map(e => e.employee.id) : []
          );

          if (createRes.code !== 200) {
            showToast(createRes.message || '创建会话失败');
            enableInput();
            return;
          }

          state.currentServerSessionId = createRes.data.session_id;
          state.currentChatId = 'server_' + createRes.data.session_id;
        }

        const model = state.currentEmployeeModel || 'deepseek';

        // 立即显示"思考中"占位消息（提升用户体验）
        const thinkingMessageDiv = addMessageElement('assistant', '', time);
        const thinkingBubble = thinkingMessageDiv.querySelector('.message-bubble');
        if (thinkingBubble) {
          thinkingBubble.innerHTML = `
            <div class="thinking-animation">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="thinking-text">AI正在思考中...</span>
          `;
        }
        console.log('💭 显示"思考中"动画');

        // 使用流式API发送消息（大幅提升响应速度！）
        let fullContent = '';
        let isFirstToken = true;

        await Api.streamSendMessage(
          state.currentServerSessionId,
          content,
          model,
          // onToken - 收到每个token时调用
          (token) => {
            fullContent += token;

            if (isFirstToken) {
              // 第一个token到达，移除思考动画，开始显示光标
              isFirstToken = false;
              const bubble = thinkingMessageDiv.querySelector('.message-bubble');
              if (bubble) {
                bubble.innerHTML = '<span class="typing-cursor">|</span>';
              }
              console.log('✨ 收到第一个token，开始显示！');
            }

            // 实时更新内容
            const bubble = thinkingMessageDiv.querySelector('.message-bubble');
            if (bubble) {
              bubble.innerHTML = formatContent(fullContent) + '<span class="typing-cursor">|</span>';
              scrollToBottom();
            }
          },
          // onDone - 流式传输完成
          (data = {}) => {
            console.log('🎯 流式传输完成！总长度:', fullContent.length, '追问建议:', data.follow_ups);
            const bubble = thinkingMessageDiv.querySelector('.message-bubble');
            if (bubble) {
              bubble.innerHTML = formatContent(fullContent);  // 移除光标
            }

            // 保存到状态
            const aiMessage = { role: 'assistant', content: fullContent };
            state.messages.push({ role: 'user', content });
            state.messages.push(aiMessage);
            thinkingMessageDiv.dataset.rawContent = fullContent;

            // 生成相关追问
            setTimeout(async () => {
              const followUpContainer = thinkingMessageDiv.querySelector('.follow-up-questions');
              if (followUpContainer) {
                followUpContainer.style.display = 'block';
                
                // 获取模型和API Key
                let model = 'deepseek';
                let apiKey = state.chatApiKey;
                
                if (state.collaborationMode && state.selectedEmployees.length > 0) {
                  model = state.selectedEmployees[0].model;
                  apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
                } else if (state.currentEmployee) {
                  model = state.currentEmployeeModel;
                  apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
                }
                
                await generateFollowUpQuestions(thinkingMessageDiv, fullContent, model, apiKey);
              }
            }, 500);
          },
          // onError - 错误处理
          (error) => {
            throw new Error(error);
          }
        );

        // 刷新历史列表
        loadHistoryList();
        updateUserProfile();

      } catch(e) {
        console.error('发送消息错误:', e);
        addMessageElement('assistant', `抱歉，出现了错误：${e.message}。请稍后重试。`, time);
      } finally {
        enableInput();
      }
    }

    function enableInput() {
      state.isGenerating = false;
      const input = document.getElementById('chatInput');
      if (input) {
        input.disabled = false;
        input.focus();
      }
      document.getElementById('sendBtn').disabled = false;
      document.getElementById('polishBtn').disabled = false;
      document.getElementById('stopBtn').style.display = 'none';
      updatePolishBtnState();
    }

    function renderFollowUps(followUps) {
      const container = document.getElementById('chatMessages');
      followUps.forEach((text, i) => {
        const btn = document.createElement('div');
        btn.className = 'follow-up-suggestion';
        btn.textContent = text;
        btn.onclick = function() {
          document.getElementById('chatInput').value = text;
          sendMessage();
        };
        container.appendChild(btn);
      });
      scrollToBottom();
    }

    function addLoadingIndicator(employee = state.currentEmployee) {
      const messagesContainer = document.getElementById('chatMessages');
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message assistant';
      
      const loadingIcon = employee?.icon || '灵';
      const employeeName = employee?.name || 'AI';
      
      loadingDiv.innerHTML = `
        <div class="message-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div class="typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
            <span style="margin-left: 8px; color: var(--text-tertiary); font-size: 13px;">${employeeName}思考中...</span>
          </div>
        </div>
      `;
      
      messagesContainer.appendChild(loadingDiv);
      scrollToBottom();
      
      return loadingDiv;
    }

    // 支持显示员工名称的消息元素
    function addCollaborationMessageElement(type, content, time, employee = state.currentEmployee) {
      const messagesContainer = document.getElementById('chatMessages');
      
      // 隐藏欢迎界面
      const welcome = document.getElementById('welcomeContainer');
      if (welcome) {
        welcome.style.display = 'none';
      }
      
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type === 'user' ? 'user' : 'assistant'}`;
      
      const avatarIcon = employee?.icon || (type === 'user' ? '我' : '灵');
      const employeeName = employee?.name || (type === 'user' ? '' : 'AI');
      const avatarContent = type === 'user' ? 
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' :
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      
      // 处理内容中的代码块
      const formattedContent = formatContent(content);
      const now = new Date();
      const timeStr = time || `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // 如果是助手消息且有员工，显示员工名称标签
      const nameTagHtml = (type === 'assistant' && employee) ? 
        `<div class="employee-name-tag"><span class="tag-icon">${employee.icon}</span><span>${employee.name}</span></div>` : '';
      
      // 为消息生成唯一ID
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      messageDiv.id = messageId;
      
      // 操作按钮（仅AI消息显示分享按钮）
      const actionButtons = `
        <div class="message-actions">
          <button class="message-action-btn" onclick="event.stopPropagation(); copyMessage('${messageId}')" title="复制">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            复制
          </button>
          ${type === 'assistant' ? `
          <button class="message-action-btn" onclick="event.stopPropagation(); shareMessage('${messageId}')" title="分享">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            分享
          </button>
          ` : ''}
        </div>
      `;
      
      messageDiv.innerHTML = `
        <div class="message-avatar">${avatarContent}</div>
        <div class="message-content">
          ${nameTagHtml}
          <div class="message-bubble">${formattedContent}</div>
          <div class="message-time">${timeStr}</div>
          ${actionButtons}
          ${type === 'assistant' ? createFollowUpHtml() : ''}
        </div>
      `;
      
      // 存储原始内容用于复制和分享
      messageDiv.dataset.rawContent = content;
      messageDiv.dataset.role = type;
      if (employee) messageDiv.dataset.employeeName = employee.name;
      
      messagesContainer.appendChild(messageDiv);
      scrollToBottom();
      
      return messageDiv;
    }

    function scrollToBottom() {
      const messagesContainer = document.getElementById('chatMessages');
      // 只有用户没有向上滚动时才自动滚动
      if (!state.userScrolledUp) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }

    function forceScrollToBottom() {
      const messagesContainer = document.getElementById('chatMessages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      state.userScrolledUp = false;
    }

    // 监听滚动事件
    function initScrollListener() {
      const messagesContainer = document.getElementById('chatMessages');
      messagesContainer.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
        // 如果用户滚动到接近底部（距离底部100px以内），重置状态
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        state.userScrolledUp = !isNearBottom;
      });
    }

    function stopGeneration() {
      if (state.abortController) {
        state.abortController.abort();
      }
    }
    
    // ============ 追问问题功能 ============
    // 生成追问问题
    async function generateFollowUpQuestions(messageDiv, content, model, apiKey) {
      console.log('开始生成追问问题');
      console.log('messageDiv:', messageDiv);
      
      const followUpContainer = messageDiv.querySelector('.follow-up-questions');
      console.log('followUpContainer:', followUpContainer);
      
      if (!followUpContainer) {
        console.error('未找到follow-up-questions容器');
        return;
      }
      
      const questionsList = followUpContainer.querySelector('.follow-up-list');
      const refreshBtn = followUpContainer.querySelector('.follow-up-refresh');
      
      console.log('questionsList:', questionsList);
      console.log('refreshBtn:', refreshBtn);
      
      // 显示加载状态
      refreshBtn?.classList.add('loading');
      questionsList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-tertiary);">正在生成追问问题...</div>';
      
      // 显示相关问题容器
      followUpContainer.style.display = 'block';
      console.log('显示相关问题容器');

      
      // 获取用户输入的内容
      let userInput = '';
      const allMessages = messageDiv.parentNode.querySelectorAll('.message');
      const currentIndex = Array.from(allMessages).indexOf(messageDiv);
      
      if (currentIndex > 0) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          const msg = allMessages[i];
          if (msg.classList.contains('user')) {
            userInput = msg.dataset.rawContent || msg.querySelector('.message-bubble').textContent;
            break;
          }
        }
      }
      
      // 生成随机种子和随机主题，确保每次生成的问题都不同
      const randomSeed = Math.floor(Math.random() * 10000);
      const randomThemes = [
        '技术细节', '实施步骤', '效果评估', '最佳实践',
        '常见问题', '注意事项', '案例分析', '对比方案',
        '适用场景', '优化建议', '未来发展', '行业趋势'
      ];
      const randomTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
      
      const prompt = `基于以下对话内容，生成3个用户可能会追问的相关问题。要求：
1. 问题要与对话内容相关，有针对性
2. 问题要具体、有价值，能帮助用户深入了解话题
3. 问题要简洁明了，每个问题不超过30字
4. 直接输出3个问题，每行一个，不要编号和其他格式
5. 请确保生成的问题与之前的不同，要有多样性
6. 重点关注${randomTheme}方面的问题

用户输入：
${userInput.substring(0, 500)}${userInput.length > 500 ? '...' : ''}

AI回答内容：
${content.substring(0, 1000)}${content.length > 1000 ? '...' : ''}

随机种子：${randomSeed}

请生成3个追问问题：`;

      try {
        const config = MODEL_CONFIGS[model] || MODEL_CONFIGS.deepseek;
        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: 'system', content: '你是一个问题生成助手，擅长根据对话内容生成有价值的追问问题。你能够从多个角度思考，生成多样化的问题，避免重复。每次生成的问题都应该与之前的不同，要有创意和多样性。' },
              { role: 'user', content: prompt }
            ],
            stream: false,
            temperature: 1.2, // 进一步增加温度以获得更多样的问题
            max_tokens: 300,
            random_seed: Math.floor(Math.random() * 1000000), // 添加随机种子
            frequency_penalty: 0.7, // 减少重复
            presence_penalty: 0.7 // 增加多样性
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          const questionsText = data.choices?.[0]?.message?.content || '';
          
          // 解析问题
          const questions = questionsText
            .split('\n')
            .map(q => q.replace(/^\d+[\.\、\)]\s*/, '').trim())
            .filter(q => q.length > 0 && q.length <= 100)
            .slice(0, 3);
          
          if (questions.length > 0) {
            renderFollowUpQuestions(messageDiv, questions);
          } else {
            // 如果解析失败，使用默认问题
            renderFollowUpQuestions(messageDiv, getDefaultFollowUpQuestions(content));
          }
        } else {
          renderFollowUpQuestions(messageDiv, getDefaultFollowUpQuestions(content));
        }
      } catch (e) {
        console.error('生成追问问题失败:', e);
        renderFollowUpQuestions(messageDiv, getDefaultFollowUpQuestions(content));
      }
      
      refreshBtn?.classList.remove('loading');
    }
    
    // 获取默认追问问题
    function getDefaultFollowUpQuestions(content) {
      const defaultQuestions = [
        '能详细解释一下吗？',
        '还有其他方法吗？',
        '能举个例子说明吗？',
        '这个方法有什么优缺点？',
        '如何具体实施呢？',
        '需要注意哪些细节？',
        '有没有最佳实践？',
        '如何评估效果？',
        '适合什么场景使用？',
        '与其他方法相比如何？'
      ];
      
      // 随机选择3个不同的问题
      const shuffled = defaultQuestions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }
    
    // 渲染追问问题
    function renderFollowUpQuestions(messageDiv, questions) {
      const followUpContainer = messageDiv.querySelector('.follow-up-questions');
      if (!followUpContainer) return;
      
      const questionsList = followUpContainer.querySelector('.follow-up-list');
      
      questionsList.innerHTML = questions.map((q, i) => `
        <div class="follow-up-item" onclick="useFollowUpQuestion(this, '${escapeForJs(q)}')">
          <span class="follow-up-item-num">${i + 1}</span>
          <span class="follow-up-item-text">${escapeHtml(q)}</span>
        </div>
      `).join('');
      
      // 显示相关问题容器
      followUpContainer.style.display = 'block';
    }
    
    // 刷新追问问题
    async function refreshFollowUpQuestions(button) {
      const messageDiv = button.closest('.message');
      const bubbleDiv = messageDiv.querySelector('.message-bubble');
      const content = messageDiv.dataset.rawContent || bubbleDiv.textContent;
      
      // 获取模型和API Key
      let model = 'deepseek';
      let apiKey = state.chatApiKey;
      
      if (state.collaborationMode && state.selectedEmployees.length > 0) {
        model = state.selectedEmployees[0].model;
        apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
      } else if (state.currentEmployee) {
        model = state.currentEmployeeModel;
        apiKey = model === 'minimax' ? state.minimaxApiKey : state.chatApiKey;
      }
      
      await generateFollowUpQuestions(messageDiv, content, model, apiKey);
    }
    
    // 使用追问问题
    function useFollowUpQuestion(element, question) {
      const input = document.getElementById('chatInput');
      input.value = question;
      input.focus();
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    }
    
    // 为JS字符串转义
    function escapeForJs(str) {
      return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
    }
    
    // 创建追问问题HTML
    function createFollowUpHtml() {
      return `
        <div class="follow-up-questions" style="display: none;">
          <div class="follow-up-header">
            <div class="follow-up-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>相关追问</span>
            </div>
            <button class="follow-up-refresh" onclick="event.stopPropagation(); refreshFollowUpQuestions(this)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              换一批
            </button>
          </div>
          <div class="follow-up-list">
            <div style="text-align: center; padding: 20px; color: var(--text-tertiary);">正在生成追问问题...</div>
          </div>
        </div>
      `;
    }

    // ============ 事件处理 ============
    function handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    }

    function autoResize(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
      updatePolishBtnState();
    }

    function usePrompt(element) {
      const prompt = element.textContent;
      if (!state.currentEmployee) {
        selectEmployeeWithModel('bilibili-strategist');
      }
      
      // 如果是绘画师
      if (state.currentEmployee?.isPainter) {
        const paintingPrompt = document.getElementById('paintingPrompt');
        if (paintingPrompt) {
          paintingPrompt.value = prompt;
          paintingPrompt.focus();
        }
        return;
      }
      
      document.getElementById('chatInput').value = prompt;
      document.getElementById('chatInput').focus();
      // 手动触发更新润色按钮状态
      updatePolishBtnState();
    }

    function exportChat() {
      if (state.messages.length === 0) {
        showToast('暂无对话可导出');
        return;
      }
      
      const exportData = {
        title: document.querySelector('.header-title').textContent,
        employee: state.currentEmployee?.name || '未选择',
        exportTime: new Date().toLocaleString('zh-CN'),
        messages: state.messages.map(m => ({
          role: m.role === 'user' ? '用户' : 'AI',
          content: m.content
        }))
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `灵策智算_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('对话已导出');
    }
    
    // ============ 消息操作功能 ============
    
    // 复制消息内容
    function copyMessage(messageId) {
      const messageDiv = document.getElementById(messageId);
      if (!messageDiv) return;
      
      const content = messageDiv.dataset.rawContent || 
                      messageDiv.querySelector('.message-bubble').textContent;
      
      navigator.clipboard.writeText(content).then(() => {
        showToast('已复制到剪贴板', 'success');
      }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制到剪贴板', 'success');
      });
    }
    
    // 分享消息
    let currentShareData = null;
    
    function shareMessage(messageId) {
      const messageDiv = document.getElementById(messageId);
      if (!messageDiv) return;
      
      const content = messageDiv.dataset.rawContent || 
                      messageDiv.querySelector('.message-bubble').textContent;
      
      // 获取对话上下文（该消息及之前的相关对话）
      const messagesContainer = document.getElementById('chatMessages');
      const allMessages = messagesContainer.querySelectorAll('.message');
      let conversationContext = [];
      let foundTarget = false;
      
      allMessages.forEach(msg => {
        if (msg.id === messageId) foundTarget = true;
        if (!foundTarget) {
          const msgContent = msg.dataset.rawContent || msg.querySelector('.message-bubble').textContent;
          const role = msg.dataset.role || (msg.classList.contains('user') ? 'user' : 'assistant');
          conversationContext.push({ role, content: msgContent });
        }
        if (msg.id === messageId) {
          conversationContext.push({ role: 'assistant', content });
        }
      });
      
      currentShareData = {
        content,
        context: conversationContext,
        employee: state.currentEmployee?.name || '灵策智算',
        time: messageDiv.querySelector('.message-time')?.textContent || new Date().toLocaleString('zh-CN')
      };
      
      showShareModal();
    }
    
    // 显示分享模态框
    function showShareModal() {
      let modal = document.getElementById('shareModalOverlay');
      if (!modal) {
        modal = createShareModalHTML();
        document.body.appendChild(modal);
      }
      
      // 更新预览内容
      updateSharePreview();
      
      modal.classList.add('active');
    }
    
    // 创建分享模态框 HTML
    function createShareModalHTML() {
      const modal = document.createElement('div');
      modal.id = 'shareModalOverlay';
      modal.className = 'share-modal-overlay';
      modal.innerHTML = `
        <div class="share-modal">
          <div class="share-modal-header">
            <h2 class="share-modal-title">分享对话卡片</h2>
            <button class="share-modal-close" onclick="closeShareModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="share-preview-card">
            <div class="share-preview-header">
              <div class="share-preview-logo">灵</div>
              <div class="share-preview-info">
                <h3 id="shareEmployeeName">灵策智算</h3>
                <span id="shareTime"></span>
              </div>
            </div>
            <div class="share-preview-content" id="sharePreviewContent"></div>
          </div>
          
          <div class="share-qrcode-section">
            <canvas id="shareQrcodeCanvas"></canvas>
            <div class="share-qrcode-tip">扫码查看完整对话</div>
          </div>
          
          <div class="share-actions">
            <button class="share-btn share-btn-secondary" onclick="copyShareLink()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              复制链接
            </button>
            <button class="share-btn share-btn-primary" onclick="downloadShareCard()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              下载卡片
            </button>
          </div>
        </div>
      `;
      
      modal.onclick = (e) => {
        if (e.target === modal) closeShareModal();
      };
      
      return modal;
    }
    
    // 更新分享预览
    function updateSharePreview() {
      if (!currentShareData) return;
      
      document.getElementById('shareEmployeeName').textContent = currentShareData.employee;
      document.getElementById('shareTime').textContent = currentShareData.time;
      
      // 截取内容预览
      const previewContent = currentShareData.content.length > 300 
        ? currentShareData.content.substring(0, 300) + '...' 
        : currentShareData.content;
      document.getElementById('sharePreviewContent').textContent = previewContent;
      
      // 生成分享ID和链接
      const shareId = generateShareId();
      const shareLink = `${window.location.origin}${window.location.pathname}?share=${shareId}`;
      
      // 存储分享数据到 localStorage
      const shareData = {
        ...currentShareData,
        shareId,
        createdAt: Date.now()
      };
      
      let shares = JSON.parse(localStorage.getItem('lingce_shares') || '{}');
      shares[shareId] = shareData;
      localStorage.setItem('lingce_shares', JSON.stringify(shares));
      
      currentShareData.shareId = shareId;
      currentShareData.shareLink = shareLink;
      
      // 生成二维码
      generateQRCode(shareLink);
    }
    
    // 生成分享ID
    function generateShareId() {
      return Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
    }
    
    // 生成二维码
    function generateQRCode(text) {
      const canvas = document.getElementById('shareQrcodeCanvas');
      if (!canvas) return;
      
      // 直接使用真正的二维码库生成，移除假占位图
      loadQRCodeLibrary(text, canvas);
    }
    
    // 加载QR码库
    function loadQRCodeLibrary(text, canvas) {
      // 优先使用内嵌的二维码生成逻辑
      if (window.QRCode) {
        generateRealQRCode(text, canvas);
        return;
      }
      
      // 动态加载二维码库
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.onload = () => {
        console.log('QRCode库加载成功');
        generateRealQRCode(text, canvas);
      };
      script.onerror = () => {
        console.error('QRCode库加载失败，使用备用方案');
        generateQRCodeFallback(text, canvas);
      };
      document.head.appendChild(script);
    }
    
    // 生成真正的二维码
    function generateRealQRCode(text, canvas) {
      if (!window.QRCode || !canvas) return;
      
      // 设置更大的尺寸提高扫描成功率
      canvas.width = 256;
      canvas.height = 256;
      
      QRCode.toCanvas(canvas, text, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'H', // 高容错级别，方便扫描
        color: {
          dark: '#1a1a22',
          light: '#ffffff'
        }
      }, (error) => {
        if (error) {
          console.error('QR Code生成失败:', error);
          generateQRCodeFallback(text, canvas);
        } else {
          console.log('二维码生成成功');
        }
      });
    }
    
    // 备用二维码生成方案（当CDN库加载失败时使用）
    function generateQRCodeFallback(text, canvas) {
      // 使用纯JS实现的二维码生成器（qrcode-generator算法的简化版本）
      try {
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // 清空画布
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        
        // 使用qrcode-generator库的备用CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
        script.onload = () => {
          if (window.qrcode) {
            const qr = qrcode(0, 'H'); // 高容错级别
            qr.addData(text);
            qr.make();
            
            const size = 256;
            const cellSize = Math.floor(size / qr.getModuleCount());
            const offsetX = Math.floor((size - cellSize * qr.getModuleCount()) / 2);
            const offsetY = Math.floor((size - cellSize * qr.getModuleCount()) / 2);
            
            ctx.fillStyle = '#1a1a22';
            for (let row = 0; row < qr.getModuleCount(); row++) {
              for (let col = 0; col < qr.getModuleCount(); col++) {
                if (qr.isDark(row, col)) {
                  ctx.fillRect(
                    offsetX + col * cellSize,
                    offsetY + row * cellSize,
                    cellSize,
                    cellSize
                  );
                }
              }
            }
            console.log('备用二维码生成成功');
          }
        };
        script.onerror = () => {
          // 最终备用：显示错误信息
          ctx.fillStyle = '#ffcccc';
          ctx.fillRect(0, 0, 256, 256);
          ctx.fillStyle = '#cc0000';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('二维码加载失败', 128, 120);
          ctx.fillText('请刷新重试', 128, 145);
        };
        document.head.appendChild(script);
      } catch (e) {
        console.error('备用二维码生成失败:', e);
      }
    }
    
    // 关闭分享模态框
    function closeShareModal() {
      const modal = document.getElementById('shareModalOverlay');
      if (modal) modal.classList.remove('active');
    }
    
    // 复制分享链接
    function copyShareLink() {
      if (!currentShareData?.shareLink) return;
      
      navigator.clipboard.writeText(currentShareData.shareLink).then(() => {
        showToast('分享链接已复制', 'success');
      }).catch(() => {
        showToast('复制失败，请手动复制');
      });
    }
    
    // 下载分享卡片
    function downloadShareCard() {
      if (!currentShareData) return;
      
      // 生成HTML卡片文件
      const cardHTML = generateShareCardHTML();
      
      const blob = new Blob([cardHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `灵策智算_对话分享_${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('卡片已下载', 'success');
    }
    
    // 生成分享卡片HTML
    function generateShareCardHTML() {
      const data = currentShareData;
      
      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>灵策智算 - 对话分享</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="card">
    <div class="card-header">
      <div class="card-logo">灵</div>
      <h1 class="card-title">${data.employee}</h1>
      <div class="card-meta">${data.time}</div>
    </div>
    <div class="card-body">
      ${(data.context || [{ role: 'assistant', content: data.content }]).map(msg => `
        <div class="message-item">
          <div class="message-role">${msg.role === 'user' ? '👤 用户' : '🤖 AI'}</div>
          <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
      `).join('')}
    </div>
    <div class="card-footer">
      <a href="https://lingce.taokeyun.cn" target="_blank">由灵策智算生成</a>
    </div>
  </div>
</body>
</html>`;
    }
    
    // HTML转义
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML.replace(/\n/g, '<br>');
    }
    
    // 页面加载时检查分享参数
    function checkShareParam() {
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('share');
      
      if (shareId) {
        const shares = JSON.parse(localStorage.getItem('lingce_shares') || '{}');
        const shareData = shares[shareId];
        
        if (shareData) {
          // 完全替换页面为分享展示页面
          displaySharePage(shareData);
          return true;
        }
      }
      return false;
    }
    
    // 显示完整分享页面（替换整个页面内容）
    function displaySharePage(shareData) {
      // 构建上下文对话内容
      let contextHTML = '';
      if (shareData.context && shareData.context.length > 0) {
        shareData.context.forEach((msg, idx) => {
          const isUser = msg.role === 'user';
          const avatar = isUser ? '👤' : '🤖';
          const bgColor = isUser ? 'rgba(0, 161, 214, 0.15)' : 'rgba(251, 114, 153, 0.15)';
          const borderColor = isUser ? 'rgba(0, 161, 214, 0.3)' : 'rgba(251, 114, 153, 0.3)';
          contextHTML += `
            <div style="display: flex; gap: 12px; margin-bottom: 16px; ${idx === shareData.context.length - 1 ? 'background: ' + borderColor + '; padding: 16px; border-radius: 16px; border: 1px solid ' + borderColor + ';' : ''}">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: ${bgColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${avatar}</div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 13px; color: ${isUser ? '#00A1D6' : '#FB7299'}; margin-bottom: 6px; font-weight: 500;">${isUser ? '你' : shareData.employee}</div>
                <div style="color: #B8B8C0; line-height: 1.7; font-size: 14px; white-space: pre-wrap; word-break: break-word;">${escapeHtml(msg.content)}</div>
              </div>
            </div>
          `;
        });
      } else {
        // 没有上下文时直接显示分享内容
        contextHTML = `
          <div style="background: rgba(251, 114, 153, 0.15); border: 1px solid rgba(251, 114, 153, 0.3); padding: 20px; border-radius: 16px;">
            <div style="color: #B8B8C0; line-height: 1.8; font-size: 15px; white-space: pre-wrap; word-break: break-word;">${escapeHtml(shareData.content)}</div>
          </div>
        `;
      }
      
      // 生成完整的分享页面 HTML
      const sharePageHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(shareData.employee)}的AI对话 - 灵策智算</title>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  
  <div class="share-container">
    <div class="share-header">
      <div class="logo-wrapper">
        <div class="share-logo">灵</div>
        <span class="brand-name">灵策智算</span>
      </div>
      <div class="share-badge">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        分享对话
      </div>
      <h1 class="share-title">${escapeHtml(shareData.employee)}的AI对话</h1>
      <div class="share-meta">
        <span class="share-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${shareData.time}
        </span>
        <span class="share-meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          ${shareData.employee}
        </span>
      </div>
    </div>
    
    <div class="share-content">
      <div class="context-messages">
        ${contextHTML}
      </div>
    </div>
    
    <div class="share-cta">
      <div class="cta-title">👋 想要体验更多AI对话？</div>
      <div class="cta-desc">
        灵策智算 - 你的智能AI助手<br>
        点击下方按钮，开始与AI对话
      </div>
      <button class="cta-btn" onclick="startConversation()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        开始对话
      </button>
    </div>
    
    <div class="footer">
      由灵策智算提供支持 · AI让思考更高效
    </div>
  </div>
  
  <scr` + `ipt>
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML.replace(/\\n/g, '<br>');
    }
    function startConversation() {
      // 清除URL中的share参数，跳转到首页
      const baseURL = window.location.origin + window.location.pathname;
      window.location.href = baseURL;
    }
  </scr` + `ipt>
</body>
</html>
`;
      
      // 替换整个文档内容
      document.open();
      document.write(sharePageHTML);
      document.close();
    }
    
    // 保留旧的兼容函数（以防其他地方调用）
    function displaySharedContent(shareData) {
      displaySharePage(shareData);
    }
    
    // 页面加载完成后检查分享参数
    document.addEventListener('DOMContentLoaded', function() {
      checkShareParam();
      // 强制更新API状态
      updateApiStatus();
      console.log('页面初始化完成，API状态已更新');
    });
