import {
  buildFirstBatchTutorialDraft,
  firstBatchGuideToolBySlug,
  firstBatchToolContent
} from './first-batch-content.mjs';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aixiaolvtools.com';
export const SITE_URL = configuredSiteUrl.replace(/\/$/, '');
export const SITE_NAME = 'AI效率工具库';
export const SITE_DESCRIPTION =
  '面向中文用户的全球 AI 工具教程、评测、对比、免费视频解说和效率模板下载网站。';

export const homeSeo = {
  title: '全球AI工具攻略库 - ChatGPT、Claude、Gemini、DeepSeek、Midjourney 与 Runway 教程',
  description:
    'AI效率工具库提供全球AI工具教程、评测、对比和视频解说，覆盖 ChatGPT、Claude、Gemini、Perplexity、DeepSeek、Kimi、Midjourney、Runway、ElevenLabs、Cursor、Canva AI 等国内外 AI 工具。'
};

export const homeHero = {
  badge: '全球 AI 实验室',
  title: 'AI FLUID LAB',
  subtitle:
    '用中文探索 ChatGPT、DeepSeek、Kimi、Claude、Gemini、Midjourney、Runway 等 AI 工具。',
  searchPlaceholder: '搜索 ChatGPT、DeepSeek、Kimi、AI视频、提示词模板……',
  tags: ['全球AI工具', '国产AI', 'DeepSeek教程', 'AI视频', '免费工具', '提示词模板']
};

export const homeFilters = [
  '全部',
  '全球热门',
  '国产AI',
  '海外AI',
  'AI助手',
  'AI搜索',
  'AI写作',
  'AI图片',
  'AI视频',
  'AI办公',
  'AI编程',
  '免费工具',
  '新手推荐'
];

export const navItems = [
  { href: '/', label: '首页' },
  { href: '/global-ai-tools', label: '全球AI工具' },
  { href: '/ai-tools', label: 'AI模型库' },
  { href: '/china-ai-tools', label: '国产AI工具' },
  { href: '/guides', label: '教程' },
  { href: '/compare', label: '工具对比' },
  { href: '/videos', label: '视频解说' },
  { href: '/free-ai-tools', label: '免费工具' },
  { href: '/templates', label: '模板下载' }
];

export const categories = [
  { slug: 'ai-assistant', name: 'AI助手', icon: 'AI', bento: 'large', description: 'ChatGPT、Claude、Gemini、DeepSeek、Kimi 等通用 AI 助手。', shortDescription: '聊天、写作、问答、总结和日常效率入口。' },
  { slug: 'ai-search', name: 'AI搜索工具', icon: '搜', bento: 'medium', description: 'Perplexity、Gemini、腾讯元宝等搜索和资料整理工具。', shortDescription: '把搜索、资料阅读和引用整理成可用结论。' },
  { slug: 'ai-writing', name: 'AI写作工具', icon: '写', bento: 'medium', description: '文案、公众号、邮件、论文润色和内容创作工具。', shortDescription: '从选题、标题、大纲到成稿，搭建可复用写作流程。' },
  { slug: 'ai-image', name: 'AI图片工具', icon: '图', bento: 'medium', description: 'Midjourney、通义万相、文心一言等图片生成和设计辅助工具。', shortDescription: '封面、商品图、社媒配图和设计素材快速出稿。' },
  { slug: 'ai-video', name: 'AI视频工具', icon: '视', bento: 'medium', description: 'Runway、可灵AI、即梦AI、剪映AI 等视频生成和剪辑工具。', shortDescription: '脚本、分镜、生成、剪辑和字幕一条线。' },
  { slug: 'ai-office', name: 'AI办公工具', icon: '办', bento: 'small', description: 'Copilot、Notion AI、通义千问等办公效率工具。', shortDescription: '文档、表格、PPT、会议纪要和知识库提速。' },
  { slug: 'ai-coding', name: 'AI编程工具', icon: '码', bento: 'small', description: 'Cursor、GitHub Copilot、Claude Code 等编程工具。', shortDescription: '写代码、解释报错、搭建网站和自动化脚本。' },
  { slug: 'ai-design', name: 'AI设计工具', icon: '设', bento: 'small', description: 'Canva AI、Midjourney、通义万相等设计和视觉创作工具。', shortDescription: '海报、PPT、社媒视觉和品牌素材快速生成。' },
  { slug: 'ai-voice', name: 'AI配音工具', icon: '音', bento: 'small', description: 'ElevenLabs、讯飞星火等配音和语音相关工具。', shortDescription: '给视频、课程和播客补上自然旁白。' },
  { slug: 'ai-subtitle', name: 'AI字幕工具', icon: '字', bento: 'small', description: '剪映AI、字幕识别、翻译、时间轴生成和视频字幕工作流。', shortDescription: '识别、翻译、校对和导出字幕。' },
  { slug: 'domestic-ai', name: '国产AI工具', icon: 'CN', bento: 'medium', description: 'DeepSeek、通义千问、豆包、Kimi、文心一言、腾讯元宝等中文友好工具。', shortDescription: '保留国产 AI 作为重要专区，适合中文用户快速上手。' },
  { slug: 'overseas-ai', name: '海外AI工具', icon: 'GL', bento: 'medium', description: 'ChatGPT、Claude、Gemini、Perplexity、Midjourney、Runway 等海外工具。', shortDescription: '跟踪全球热门 AI 工具，用中文教程降低学习成本。' }
];

export const globalToolSlugs = [
  'chatgpt',
  'claude',
  'gemini',
  'perplexity',
  'microsoft-copilot',
  'deepseek',
  'kimi',
  'doubao'
];

export const creativeToolSlugs = [
  'midjourney',
  'runway',
  'elevenlabs',
  'canva-ai',
  'notion-ai',
  'cursor',
  'jimeng-ai',
  'kling-ai',
  'tongyi-wanxiang',
  'capcut-ai'
];

const toolSeeds = [
  ['chatgpt', 'ChatGPT', 'C', 'overseas-ai', ['全球热门', '海外AI', 'AI助手', 'AI写作', 'AI编程', '免费可用', '新手推荐'], '新手、学生、办公人群、自媒体人、开发者', '全球最常用的通用 AI 助手，适合写作、问答、办公、学习和代码解释。', '通用问答、写作、编程和效率入门', '免费 + 付费', '免费可用', 4.9, ['通用问答', '写作润色', '代码解释'], 'https://chat.openai.com'],
  ['claude', 'Claude', 'CL', 'overseas-ai', ['全球热门', '海外AI', 'AI助手', 'AI写作', '付费工具'], '长文写作者、研究整理、内容编辑、知识工作者', '擅长长文档、自然写作和资料总结，适合深度阅读和内容产出。', '长文档、写作和总结', '免费 + 付费', '付费工具', 4.8, ['长文档', '自然写作', '资料总结'], 'https://claude.ai'],
  ['gemini', 'Gemini', 'G', 'overseas-ai', ['全球热门', '海外AI', 'AI助手', 'AI搜索', '免费可用'], 'Google 生态用户、学生、办公人群、资料检索用户', 'Google 生态里的 AI 助手，适合搜索辅助、多模态问答和资料整理。', 'Google 生态 AI 助手', '免费 + 付费', '免费可用', 4.6, ['搜索整合', '多模态', '资料理解'], 'https://gemini.google.com'],
  ['perplexity', 'Perplexity', 'PX', 'ai-search', ['全球热门', '海外AI', 'AI搜索', 'AI助手', '免费可用'], '研究人员、学生、内容编辑、资料检索用户', '面向资料搜索和引用整理的 AI 搜索工具，适合做调研和信息核查。', 'AI搜索和资料整理', '免费 + 付费', '免费可用', 4.7, ['引用来源', '资料搜索', '研究问答'], 'https://www.perplexity.ai'],
  ['microsoft-copilot', 'Microsoft Copilot', 'CP', 'ai-office', ['全球热门', '海外AI', 'AI办公', 'AI助手', '付费工具'], 'Office 用户、企业团队、办公人群、学生', '微软生态里的 AI 办公助手，适合文档、邮件、表格和会议场景。', 'Office 办公和企业协作', '免费 + 付费', '免费可用', 4.5, ['Office 集成', '文档辅助', '会议总结'], 'https://copilot.microsoft.com'],
  ['deepseek', 'DeepSeek', 'DS', 'domestic-ai', ['全球热门', '国产AI', '中文友好', '免费可用', 'AI助手', 'AI写作', 'AI编程'], '学生、办公人群、开发者、自媒体人', '中文体验稳定，适合问答、写作、代码解释、资料整理和日常办公入门。', '中文问答、写作、代码和资料整理', '免费 + 付费', '免费可用', 4.9, ['中文问答', '代码解释', '长文总结'], 'https://www.deepseek.com'],
  ['kimi', 'Kimi', 'K', 'domestic-ai', ['全球热门', '国产AI', '中文友好', '免费可用', 'AI助手', 'AI搜索'], '学生、研究整理、知识工作者、内容编辑', '适合长文档阅读、资料总结、论文材料梳理和问答式检索。', '长文档阅读和资料总结', '免费 + 付费', '免费可用', 4.8, ['长文档', '资料总结', '问答检索'], 'https://kimi.moonshot.cn'],
  ['doubao', '豆包', '豆', 'domestic-ai', ['全球热门', '国产AI', '中文友好', '免费可用', 'AI助手', 'AI写作'], '新手、自媒体人、学生、短视频作者', '上手门槛低，适合写小红书文案、口播脚本、日常问答和轻量办公。', '小红书文案、脚本和日常问答', '免费 + 付费', '免费可用', 4.7, ['文案生成', '脚本辅助', '移动端友好'], 'https://www.doubao.com'],
  ['midjourney', 'Midjourney', 'MJ', 'ai-image', ['全球热门', '海外AI', 'AI图片', 'AI设计', '付费工具'], '设计师、自媒体人、品牌运营、视觉创作者', '高质量 AI 图片生成工具，适合概念图、海报、视觉灵感和品牌素材。', '高质量图片生成', '付费', '付费工具', 4.8, ['图片生成', '风格控制', '视觉灵感'], 'https://www.midjourney.com'],
  ['runway', 'Runway', 'RW', 'ai-video', ['全球热门', '海外AI', 'AI视频', 'AI设计', '付费工具'], '视频创作者、广告创意、设计师、短片团队', '面向 AI 视频生成和创意剪辑的工具，适合短视频、镜头实验和素材生成。', 'AI视频生成和创意剪辑', '免费 + 付费', '付费工具', 4.6, ['视频生成', '视频编辑', '创意素材'], 'https://runwayml.com'],
  ['elevenlabs', 'ElevenLabs', 'EL', 'ai-voice', ['全球热门', '海外AI', 'AI语音', 'AI视频', '付费工具'], '视频作者、播客、课程创作者、配音需求用户', '自然度高的 AI 配音工具，适合英文旁白、多语言视频和播客制作。', 'AI配音和多语言旁白', '免费 + 付费', '付费工具', 4.6, ['自然配音', '多语言', '声音克隆'], 'https://elevenlabs.io'],
  ['canva-ai', 'Canva AI', 'CA', 'ai-design', ['全球热门', '海外AI', '中文友好', 'AI设计', 'AI办公', '免费可用'], '自媒体人、学生、独立站卖家、运营', '面向非设计用户的视觉设计工具，适合海报、PPT、社媒图和模板设计。', '海报、PPT、社媒图片和模板设计', '免费 + 付费', '免费可用', 4.7, ['模板设计', '图片生成', 'PPT设计'], 'https://www.canva.com'],
  ['notion-ai', 'Notion AI', 'N', 'ai-office', ['全球热门', '海外AI', 'AI办公', 'AI写作', '付费工具'], '知识库用户、团队协作、项目管理、内容编辑', '把 AI 写作和总结能力嵌入 Notion 工作区，适合知识库和团队文档。', '知识库、项目笔记和团队文档', '付费', '付费工具', 4.4, ['文档总结', '知识库整理', '任务草稿'], 'https://www.notion.so'],
  ['cursor', 'Cursor', 'CU', 'ai-coding', ['全球热门', '海外AI', 'AI编程', 'AI自动化', '付费工具'], '开发者、独立开发者、技术学生、创业团队', 'AI 原生代码编辑器，适合读代码、改代码、生成组件和处理开发任务。', 'AI写代码和项目开发', '免费 + 付费', '付费工具', 4.7, ['代码生成', '项目理解', '自动修改'], 'https://www.cursor.com'],
  ['github-copilot', 'GitHub Copilot', 'GH', 'ai-coding', ['海外AI', 'AI编程', 'AI自动化', '付费工具'], '程序员、独立开发者、技术学生', '适合开发者在编辑器中获得代码补全、解释和测试建议。', '代码补全和开发效率提升', '付费', '付费工具', 4.5, ['IDE集成', '代码补全', '测试建议'], 'https://github.com/features/copilot'],
  ['claude-code', 'Claude Code', 'CC', 'ai-coding', ['海外AI', 'AI编程', 'AI自动化', '付费工具'], '开发者、代码库维护者、技术团队', '面向代码任务的 Claude 工具，适合理解仓库、修改代码和执行开发流程。', '代码库理解和开发任务执行', '付费', '付费工具', 4.5, ['代码库理解', '代码修改', '开发流程'], 'https://www.anthropic.com/claude-code'],
  ['tongyi-qianwen', '通义千问', '千', 'domestic-ai', ['国产AI', '中文友好', '免费可用', 'AI助手', 'AI写作', 'AI办公'], '办公人群、学生、内容运营、电商卖家', '适合中文写作、资料总结、办公问答和阿里生态相关场景。', '写文章、做办公和资料整理', '免费 + 付费', '免费可用', 4.7, ['中文写作', '办公问答', '多端可用'], 'https://tongyi.aliyun.com'],
  ['wenxin-yiyan', '文心一言', '文', 'domestic-ai', ['国产AI', '中文友好', '免费可用', 'AI助手', 'AI写作', 'AI图片'], '办公人群、内容创作者、学生、营销运营', '适合中文文案、办公问答、图片生成和百度生态相关使用场景。', '文案、图片生成和办公问答', '免费 + 付费', '免费可用', 4.5, ['中文写作', '图片生成', '百度生态'], 'https://yiyan.baidu.com'],
  ['tencent-yuanbao', '腾讯元宝', '元', 'domestic-ai', ['国产AI', '中文友好', '免费可用', 'AI助手', 'AI搜索', 'AI办公'], '办公人群、资料搜索、微信生态用户', '适合资料搜索、办公助手、文档问答和腾讯生态相关场景。', '资料搜索、办公助手和文档问答', '免费 + 付费', '免费可用', 4.5, ['资料搜索', '办公问答', '文档整理'], 'https://yuanbao.tencent.com'],
  ['xunfei-xinghuo', '讯飞星火', '星', 'domestic-ai', ['国产AI', '中文友好', '免费可用', 'AI办公', 'AI语音'], '学生、教师、办公人群、语音场景用户', '适合中文办公、教育辅助、语音相关能力和多场景问答。', '教育、办公和语音相关场景', '免费 + 付费', '免费可用', 4.4, ['教育辅助', '办公写作', '语音能力'], 'https://xinghuo.xfyun.cn'],
  ['zhipu-qingyan', '智谱清言', '智', 'domestic-ai', ['国产AI', '中文友好', '免费可用', 'AI助手', 'AI写作', 'AI编程'], '学生、开发者、研究整理、办公人群', '适合中文问答、写作、代码解释和知识整理。', '写作、问答和代码解释', '免费 + 付费', '免费可用', 4.4, ['中文问答', '代码解释', '知识整理'], 'https://chatglm.cn'],
  ['jimeng-ai', '即梦AI', '梦', 'ai-video', ['国产AI', '中文友好', 'AI视频', 'AI图片', 'AI设计', '免费可用'], '短视频作者、设计师、自媒体人、品牌运营', '适合生成图片、短视频视觉素材、创意分镜和内容灵感图。', 'AI图片和短视频生成', '免费 + 付费', '免费可用', 4.6, ['图片生成', '视频生成', '创意分镜'], 'https://jimeng.jianying.com'],
  ['kling-ai', '可灵AI', '灵', 'ai-video', ['国产AI', '中文友好', 'AI视频', 'AI设计', '免费可用'], '短视频作者、导演、设计师、广告创意', '适合生成短视频镜头、产品展示、创意素材和视频实验片段。', 'AI短视频和镜头生成', '免费 + 付费', '免费可用', 4.6, ['视频生成', '镜头创意', '图生视频'], 'https://klingai.kuaishou.com'],
  ['tongyi-wanxiang', '通义万相', '万', 'ai-image', ['国产AI', '中文友好', 'AI图片', 'AI设计', '免费可用'], '设计师、自媒体人、电商卖家、内容运营', '适合中文提示词生成图片、视觉素材、海报灵感和商品图辅助。', 'AI图片、海报和商品图素材', '免费 + 付费', '免费可用', 4.5, ['图片生成', '设计素材', '中文提示词'], 'https://tongyi.aliyun.com/wanxiang'],
  ['capcut-ai', '剪映AI', '剪', 'ai-video', ['国产AI', '中文友好', 'AI视频', 'AI字幕', '免费可用'], '短视频作者、口播博主、课程创作者、自媒体人', '适合短视频剪辑、自动字幕、口播脚本、模板剪辑和视频发布前处理。', '短视频剪辑、字幕和模板制作', '免费 + 付费', '免费可用', 4.7, ['自动字幕', '模板剪辑', '口播脚本'], 'https://www.capcut.cn']
];

export const toolIconBySlug = {
  chatgpt: '/icons/ai-tools/chatgpt.svg',
  claude: '/icons/ai-tools/claude.svg',
  gemini: '/icons/ai-tools/gemini.svg',
  perplexity: '/icons/ai-tools/perplexity.svg',
  'microsoft-copilot': '/icons/ai-tools/microsoft-copilot.svg',
  deepseek: '/brand-icons/current/deepseek.png',
  kimi: '/brand-icons/current/kimi.png',
  doubao: '/brand-icons/current/doubao.png',
  midjourney: '/icons/ai-tools/midjourney.svg',
  runway: '/icons/ai-tools/runway.svg',
  elevenlabs: '/icons/ai-tools/elevenlabs.svg',
  'canva-ai': '/icons/ai-tools/canva-ai.svg',
  'notion-ai': '/icons/ai-tools/notion-ai.svg',
  cursor: '/icons/ai-tools/cursor.svg',
  'github-copilot': '/icons/ai-tools/github-copilot.svg',
  'claude-code': '/icons/ai-tools/claude-code.svg',
  'tongyi-qianwen': '/brand-icons/current/tongyi-qianwen.svg',
  'wenxin-yiyan': '/brand-icons/current/wenxin-yiyan.png',
  'tencent-yuanbao': '/brand-icons/current/tencent-yuanbao.png',
  'xunfei-xinghuo': '/brand-icons/current/xunfei-xinghuo.png',
  'zhipu-qingyan': '/brand-icons/current/zhipu-qingyan.png',
  'jimeng-ai': '/brand-icons/current/jimeng-ai.png',
  'kling-ai': '/brand-icons/current/kling-ai.png',
  'tongyi-wanxiang': '/brand-icons/current/tongyi-wanxiang.png',
  'capcut-ai': '/brand-icons/current/capcut-ai.png'
};

const fallbackToolIcon = '/icons/ai-tools/generic-ai-tool.svg';

export const tools = toolSeeds.map(([
  slug,
  name,
  logo,
  categorySlug,
  galleryTags,
  audience,
  summary,
  bestFor,
  pricing,
  pricingLabel,
  rating,
  features,
  affiliateUrl
]) => {
  const domestic = galleryTags.includes('国产AI');
  const normalizedPricingLabel = pricing.includes('免费') ? '免费可用' : '付费工具';
  const normalizedGalleryTags = Array.from(new Set([
    ...galleryTags.filter((tag) => tag !== '免费可用' && tag !== '付费工具'),
    normalizedPricingLabel
  ]));
  const icon = toolIconBySlug[slug] || fallbackToolIcon;
  const expandedContent = firstBatchToolContent[slug] || {};

  return {
    slug,
    name,
    logo,
    icon,
    iconAlt: `${name} logo`,
    region: domestic ? 'domestic' : 'overseas',
    categorySlug,
    galleryTags: normalizedGalleryTags,
    audience: expandedContent.audience || audience,
    summary: expandedContent.summary || summary,
    bestFor,
    pricing,
    pricingLabel: normalizedPricingLabel,
    rating,
    features,
    affiliateUrl,
    featured: [...globalToolSlugs, ...creativeToolSlugs].includes(slug),
    domestic,
    ...expandedContent
  };
});

const guideSeeds = [
  ['chatgpt-beginner-guide', 'ChatGPT新手入门教程：从注册到日常使用', 'ai-assistant', '完成注册、基础提问、写作和日常效率工作流'],
  ['claude-long-doc-writing-summary', 'Claude怎么用：长文档、写作和总结教程', 'ai-writing', '用 Claude 阅读长文档、提炼摘要并润色文章'],
  ['gemini-google-ai-beginner', 'Gemini怎么用：Google生态 AI 助手入门', 'ai-assistant', '理解 Gemini 在搜索、图片和 Google 生态里的用法'],
  ['perplexity-ai-search-research', 'Perplexity怎么用：AI搜索和资料整理教程', 'ai-search', '用 AI 搜索整理资料、引用来源和调研结论'],
  ['deepseek-writing-code-qa', 'DeepSeek新手入门教程：写作、代码和问答', 'domestic-ai', '用 DeepSeek 完成中文写作、代码解释和日常问答'],
  ['kimi-long-document-summary', 'Kimi怎么阅读长文档和总结资料', 'ai-search', '把长文档整理成摘要、提纲和行动项'],
  ['doubao-xiaohongshu-copywriting', '豆包AI怎么写小红书文案', 'ai-writing', '产出小红书标题、正文、标签和口播脚本'],
  ['tongyi-qianwen-writing-office', '通义千问怎么写文章和做办公', 'ai-office', '用通义千问完成文章大纲、正文和办公问答'],
  ['midjourney-high-quality-image', 'Midjourney怎么生成高质量图片', 'ai-image', '写出更稳定的提示词并生成高质量视觉素材'],
  ['runway-ai-video-guide', 'Runway怎么生成AI视频', 'ai-video', '从提示词到镜头生成，完成第一段 AI 视频素材'],
  ['elevenlabs-ai-voice-guide', 'ElevenLabs怎么做AI配音', 'ai-voice', '生成自然旁白并理解多语言配音流程'],
  ['cursor-ai-coding-guide', 'Cursor怎么用AI写代码', 'ai-coding', '用 Cursor 读代码、改组件和完成开发任务'],
  ['microsoft-copilot-office-guide', 'Microsoft Copilot办公入门教程', 'ai-office', '在 Office 和浏览器场景中使用 Copilot 提升效率'],
  ['canva-ai-design-guide', 'Canva AI怎么做海报和PPT', 'ai-design', '用模板和 AI 功能快速生成社媒图与演示稿'],
  ['notion-ai-knowledge-base', 'Notion AI怎么整理知识库', 'ai-office', '把笔记、项目和资料整理成可查询知识库'],
  ['wenxin-copywriting-image', '文心一言怎么写文案和生成图片', 'ai-image', '完成文案草稿和配图创意生成'],
  ['tencent-yuanbao-search-office', '腾讯元宝怎么做资料搜索和办公助手', 'ai-office', '用 AI 搜索和问答辅助日常办公'],
  ['jimeng-ai-short-video-guide', '即梦AI怎么生成短视频', 'ai-video', '从画面提示词到短视频素材生成'],
  ['kling-ai-video-generation-guide', '可灵AI视频生成入门教程', 'ai-video', '理解图生视频、文生视频和镜头控制基础'],
  ['tongyi-wanxiang-image-guide', '通义万相怎么生成商品图和海报', 'ai-image', '用中文提示词生成电商图和视觉素材'],
  ['capcut-ai-subtitle-video', '剪映AI怎么做字幕和短视频', 'ai-subtitle', '自动字幕、模板剪辑和口播视频工作流'],
  ['free-ai-writing-tools', '免费AI写作工具推荐', 'ai-writing', '搭建零成本写作工具清单'],
  ['ai-tools-for-creators', '适合自媒体人的AI工具合集', 'ai-video', '搭建选题、脚本、剪辑、发布工具链'],
  ['ai-tools-for-independent-sellers', '适合独立站卖家的AI工具合集', 'ai-office', '优化商品页、客服、图片和营销内容']
];

export const guides = guideSeeds.map(([slug, title, categorySlug, outcome], index) => {
  const toolSlug = firstBatchGuideToolBySlug[slug];
  const tutorialDraft = buildFirstBatchTutorialDraft(toolSlug);

  return {
    slug,
    title,
    toolSlug,
    categorySlug,
    outcome: tutorialDraft?.problemsSolved?.[0] || outcome,
    excerpt: tutorialDraft?.excerpt || `${title}，按步骤整理适合新手跟做的操作流程、提示词示例和常见错误。`,
    readTime: `${6 + (index % 5)}分钟`,
    updatedAt: '2026-06-17',
    author: 'AI效率工具库编辑部',
    sections: tutorialDraft?.outline || ['适合谁使用', '准备工作', '操作步骤', '常见问题', '延伸工具'],
    tutorialDraft,
    faq: [
      { question: '这篇教程适合新手吗？', answer: '适合。页面会按步骤保留截图、提示词和视频讲解位置。' },
      { question: '是否包含付费推荐？', answer: '如后续添加联盟链接，会使用 sponsored nofollow 标记并明确说明。' }
    ]
  };
});

const videoSeeds = [
  ['chatgpt-3min-guide', '3分钟了解 ChatGPT 怎么用', 'ai-assistant', '快速了解 ChatGPT 的注册、提问、写作和日常使用方式。'],
  ['claude-user-fit-video', 'Claude 适合哪些人使用', 'ai-writing', '用短视频讲清 Claude 更适合长文档、写作和总结的场景。'],
  ['gemini-vs-chatgpt-video', 'Gemini 和 ChatGPT 有什么区别', 'ai-assistant', '对比 Gemini 与 ChatGPT 的生态、搜索和多模态能力。'],
  ['perplexity-research-video', 'Perplexity 怎么做资料搜索', 'ai-search', '演示 Perplexity 如何搜索资料、保留来源并整理调研结论。'],
  ['deepseek-beginner-video', 'DeepSeek 新手教程', 'domestic-ai', '从中文提问、写作到代码解释，快速看懂 DeepSeek。'],
  ['kimi-long-doc-video', 'Kimi 怎么读长文档', 'ai-search', '用一个长文档案例演示 Kimi 的摘要、提问和资料整理流程。'],
  ['midjourney-image-video', 'Midjourney 怎么生成图片', 'ai-image', '演示 Midjourney 的提示词、风格控制和图片生成流程。'],
  ['runway-video-generation-video', 'Runway 怎么生成视频', 'ai-video', '演示从提示词到 AI 视频镜头的基础生成流程。'],
  ['elevenlabs-voice-video', 'ElevenLabs 怎么做AI配音', 'ai-voice', '快速了解 ElevenLabs 的声音选择、文本配音和导出流程。'],
  ['cursor-ai-coding-video', 'Cursor 怎么用AI写代码', 'ai-coding', '演示 Cursor 如何读项目、改代码和生成组件。']
];

export const videos = videoSeeds.map(([slug, title, categorySlug, description], index) => ({
  slug,
  title,
  description,
  categorySlug,
  duration: ['04:17', '02:24', '02:32', '02:43', '02:44', '02:25', '02:37', '03:22', '03:12', '03:43'][index],
  publishedAt: '2026-06-17',
  thumbnail: slug === 'chatgpt-3min-guide'
    ? '/images/chatgpt-intro-video-cover.png'
    : slug === 'claude-user-fit-video'
      ? '/images/claude-user-fit-video-cover.png'
      : slug === 'gemini-vs-chatgpt-video'
        ? '/images/gemini-vs-chatgpt-video-cover.png'
        : slug === 'perplexity-research-video'
          ? '/images/perplexity-research-video-cover.png'
          : slug === 'deepseek-beginner-video'
            ? '/images/deepseek-beginner-video-cover.png'
            : slug === 'kimi-long-doc-video'
              ? '/images/kimi-long-doc-video-cover.png'
              : slug === 'midjourney-image-video'
                ? '/images/midjourney-image-video-cover.png'
                : slug === 'runway-video-generation-video'
                  ? '/images/runway-video-generation-video-cover.png'
                  : slug === 'elevenlabs-voice-video'
                    ? '/images/elevenlabs-voice-video-cover.png'
                    : slug === 'cursor-ai-coding-video'
                      ? '/images/cursor-ai-coding-video-cover.png'
                      : `/images/video-cover-${(index % 3) + 1}.svg`,
  embedUrl: '',
  transcript: `${description} 本页提供视频概览、章节时间轴、重点摘要和观看建议，适合先快速了解再进入对应教程练习。`
}));

export const comparisons = [
  { slug: 'chatgpt-vs-claude', title: 'ChatGPT 和 Claude 哪个好用', tools: ['ChatGPT', 'Claude'], summary: '从通用能力、长文档、中文写作和价格对比两个主流 AI 助手。' },
  { slug: 'gemini-vs-chatgpt', title: 'Gemini 和 ChatGPT 有什么区别', tools: ['Gemini', 'ChatGPT'], summary: '对比搜索整合、多模态能力、移动端体验和中文用户的实际选择建议。' },
  { slug: 'perplexity-vs-google-search', title: 'Perplexity 和 Google 搜索怎么选', tools: ['Perplexity', 'Google 搜索'], summary: '比较 AI 搜索、传统搜索、引用来源和资料整理效率。' },
  { slug: 'deepseek-vs-chatgpt-chinese', title: 'DeepSeek 和 ChatGPT 哪个适合中文用户', tools: ['DeepSeek', 'ChatGPT'], summary: '从中文体验、写作、代码、价格和访问门槛对比两个常用 AI 助手。' },
  { slug: 'kimi-vs-claude-long-doc', title: 'Kimi 和 Claude 哪个适合长文档', tools: ['Kimi', 'Claude'], summary: '比较长文档阅读、资料总结、上下文长度和中文材料处理体验。' },
  { slug: 'midjourney-vs-tongyi-wanxiang', title: 'Midjourney 和通义万相怎么选', tools: ['Midjourney', '通义万相'], summary: '对比高质量图片生成、中文提示词、设计素材和使用门槛。' },
  { slug: 'runway-vs-kling-video', title: 'Runway 和可灵AI 哪个适合视频生成', tools: ['Runway', '可灵AI'], summary: '从视频质量、镜头控制、中文提示词和短视频场景对比。' },
  { slug: 'elevenlabs-vs-china-ai-voice', title: 'ElevenLabs 和国内AI配音工具怎么选', tools: ['ElevenLabs', '国内AI配音工具'], summary: '比较自然度、多语言、中文配音、价格和商用场景。' },
  { slug: 'cursor-vs-claude-code', title: 'Cursor 和 Claude Code 哪个适合写代码', tools: ['Cursor', 'Claude Code'], summary: '从编辑器集成、代码库理解、自动修改和开发流程对比。' }
];

export const templates = [
  { slug: 'xiaohongshu-prompt-pack', title: '小红书文案提示词模板', type: 'Prompt', format: 'Markdown' },
  { slug: 'wechat-article-outline', title: '公众号文章大纲模板', type: '写作模板', format: 'Doc' },
  { slug: 'ai-tool-review-sheet', title: 'AI工具评测记录表', type: '表格', format: 'Sheet' },
  { slug: 'video-script-template', title: 'AI视频解说脚本模板', type: '视频脚本', format: 'Markdown' }
];

export const staticRoutes = [
  '/',
  '/global-ai-tools',
  '/china-ai-tools',
  '/ai-tools',
  '/guides',
  '/compare',
  '/videos',
  '/free-ai-tools',
  '/templates',
  '/about',
  '/contact',
  '/privacy'
];

export function getCategory(slug) {
  return categories.find((category) => category.slug === slug);
}

export function getTool(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getGuide(slug) {
  return guides.find((guide) => guide.slug === slug);
}

export function getVideo(slug) {
  return videos.find((video) => video.slug === slug);
}

export function getComparison(slug) {
  return comparisons.find((comparison) => comparison.slug === slug);
}

export function getToolsBySlugs(slugs) {
  return slugs.map((slug) => getTool(slug)).filter(Boolean);
}

export function getGlobalTools() {
  return tools;
}

export function getChinaTools() {
  return tools.filter((tool) => tool.domestic);
}

export function getAllRoutes() {
  return [
    ...staticRoutes,
    ...categories.map((item) => `/categories/${item.slug}`),
    ...tools.map((item) => `/ai-tools/${item.slug}`),
    ...guides.map((item) => `/guides/${item.slug}`),
    ...comparisons.map((item) => `/compare/${item.slug}`),
    ...videos.map((item) => `/videos/${item.slug}`)
  ];
}
