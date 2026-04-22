export interface AIEmployee {
  id: string;
  name: string;
  dept: string;
  icon: string;
  desc: string;
  skills: string[];
  systemPrompt: string;
  isPainter?: boolean;
}

export const AI_EMPLOYEES: AIEmployee[] = [
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
    id: 'pipeline-analyst',
    name: 'Pipeline分析师',
    dept: '销售部',
    icon: '📊',
    desc: '销售管道管理专家，帮你优化销售漏斗，预测成交率，提升销售预测准确性',
    skills: ['漏斗优化', '阶段定义', '转化提升', '预测模型'],
    systemPrompt: `你是一个专业的销售Pipeline分析师，专注于帮助销售团队优化管道管理和提升预测准确性。`
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
  // 客服部
  {
    id: 'customer-service',
    name: '客服响应者',
    dept: '客服部',
    icon: '💬',
    desc: '专业客服话术专家，帮助提升客户满意度，优化售后处理流程',
    skills: ['话术设计', '投诉处理', '好评引导', '流程优化'],
    systemPrompt: `你是一个专业的客服响应专家，专注于帮助企业提升客户服务质量和效率。`
  }
];

export const DEPARTMENTS = Array.from(new Set(AI_EMPLOYEES.map(emp => emp.dept)));
