import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd.jsx';
import ToolDetailNavigation from '../../../components/ToolDetailNavigation.jsx';
import {
  TOOL_RATING_METHODOLOGY,
  TOOL_RATING_UPDATED_AT,
  getCategory,
  getTool,
  tools
} from '../../../lib/site-data.mjs';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/seo.mjs';

const chatgptDetailTitle = 'ChatGPT AI 助手评测与教程';
const chatgptDetailDescription =
  '一款通用型对话式 AI 助手，适合写作、问答、学习、办公、资料整理和代码辅助等日常效率场景。';
const chatgptSeo = {
  title: 'ChatGPT AI助手评测与教程：功能、模型、用法与替代工具',
  description:
    '系统介绍 ChatGPT 这款通用 AI 助手的工具定位、基础信息、适用场景、模型能力、核心用途、入门步骤、优点限制、教程大纲和替代工具，适合 AI 新手和效率工具用户参考。'
};

const chatgptMetaItems = [
  '免费 + 付费',
  'AI 助手',
  '海外 AI 工具',
  '写作 / 问答 / 办公 / 学习 / 代码辅助',
  '4.9 / 5'
];

const chatgptTocItems = [
  ['intro', '工具简介'],
  ['overview', '工具概述'],
  ['basic-info', '基础信息'],
  ['scenarios', '适用场景'],
  ['models', '模型说明与能力表现'],
  ['use-cases', '核心用途'],
  ['quick-start', '入门步骤'],
  ['pros-cons', '优点与限制'],
  ['tutorial', '教程大纲'],
  ['alternatives', '替代工具与外部链接']
];

const compactBestForBySlug = {
  chatgpt: '通用问答',
  claude: '长文总结',
  gemini: '资料理解',
  perplexity: '资料搜索',
  deepseek: '中文问答',
  kimi: '长文阅读',
  doubao: '日常问答',
  'microsoft-copilot': 'Office办公',
  midjourney: '图片生成',
  runway: '视频生成',
  elevenlabs: 'AI配音',
  'canva-ai': '设计制图',
  'notion-ai': '知识整理',
  cursor: 'AI编程',
  'github-copilot': '代码辅助',
  'claude-code': '代码辅助',
  'tongyi-qianwen': '中文办公',
  'wenxin-yiyan': '中文创作',
  'tencent-yuanbao': '资料搜索',
  'xunfei-xinghuo': '语音问答',
  'zhipu-qingyan': '中文助手',
  'jimeng-ai': '图片视频',
  'kling-ai': '视频生成',
  'tongyi-wanxiang': '图片生成',
  'capcut-ai': '视频剪辑'
};

const compactBestForByCategory = {
  'ai-search': '资料搜索',
  'ai-image': '图片生成',
  'ai-video': '视频生成',
  'ai-voice': 'AI配音',
  'ai-design': '设计制图',
  'ai-office': '办公提效',
  'ai-coding': '代码辅助',
  'ai-writing': '写作总结',
  'ai-assistant': '通用问答'
};

const toolTypeLabelByCategory = {
  'ai-assistant': 'AI 助手',
  'overseas-ai': 'AI 助手',
  'domestic-ai': 'AI 助手',
  'ai-search': 'AI 搜索工具',
  'ai-writing': 'AI 写作工具',
  'ai-image': 'AI 绘画工具',
  'ai-video': 'AI 视频工具',
  'ai-office': 'AI 办公工具',
  'ai-coding': 'AI 编程工具',
  'ai-design': 'AI 设计工具',
  'ai-voice': 'AI 配音工具',
  'ai-subtitle': 'AI 字幕工具'
};

const developerBySlug = {
  chatgpt: 'OpenAI',
  claude: 'Anthropic',
  gemini: 'Google',
  perplexity: 'Perplexity AI',
  'microsoft-copilot': 'Microsoft',
  deepseek: 'DeepSeek',
  kimi: 'Moonshot AI',
  doubao: '字节跳动',
  midjourney: 'Midjourney',
  runway: 'Runway',
  elevenlabs: 'ElevenLabs',
  'canva-ai': 'Canva',
  'notion-ai': 'Notion',
  cursor: 'Anysphere',
  'github-copilot': 'GitHub / Microsoft',
  'claude-code': 'Anthropic',
  'tongyi-qianwen': '阿里云',
  'wenxin-yiyan': '百度',
  'tencent-yuanbao': '腾讯',
  'xunfei-xinghuo': '科大讯飞',
  'zhipu-qingyan': '智谱 AI',
  'kling-ai': '快手',
  'tongyi-wanxiang': '阿里云',
  'capcut-ai': '剪映'
};

const entranceByCategory = {
  'ai-image': '网页端、创作工作台或相关客户端入口',
  'ai-video': '网页端、创作工作台或相关客户端入口',
  'ai-voice': '网页端、语音生成工作台',
  'ai-coding': '编辑器、命令行或开发者工作流入口',
  'ai-office': '网页端、桌面端或办公套件入口',
  'ai-design': '网页端、模板设计工作台',
  'ai-search': '网页端、移动端或搜索问答入口'
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const isChatGPT = tool.slug === 'chatgpt';
  return pageMetadata({
    title: isChatGPT ? chatgptSeo.title : `${tool.name} 工具评测与教程`,
    description: isChatGPT ? chatgptSeo.description : tool.summary,
    path: `/ai-tools/${tool.slug}`
  });
}

function listOrFallback(value, fallback = []) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function getCompactBestFor(tool) {
  return (
    compactBestForBySlug[tool.slug] ||
    compactBestForByCategory[tool.categorySlug] ||
    '办公提效'
  );
}

function getToolTypeLabel(tool) {
  return toolTypeLabelByCategory[tool.categorySlug] || 'AI 工具';
}

function getToolDetailTitle(tool) {
  const typeLabel = getToolTypeLabel(tool);
  const normalizedTypeLabel = /AI$/i.test(tool.name.trim())
    ? typeLabel.replace(/^AI\s+/, '')
    : typeLabel;
  return `${tool.name} ${normalizedTypeLabel}评测与教程`;
}

function getDeveloper(tool) {
  return developerBySlug[tool.slug] || '以官网主体信息为准';
}

function getMainEntrance(tool) {
  return entranceByCategory[tool.categorySlug] || '网页端、移动端或桌面端，具体以官网实际入口为准';
}

function getDifficulty(tool) {
  if (['ai-image', 'ai-video', 'ai-coding'].includes(tool.categorySlug)) return '中';
  return '低';
}

function getChineseSupport(tool) {
  if (tool.domestic) return '较好';
  if (tool.galleryTags?.includes('中文友好')) return '较好';
  return '可用，具体体验以当前版本为准';
}

function getFocusLine(tool) {
  const focusItems = listOrFallback(tool.features, [getCompactBestFor(tool)]).slice(0, 4);
  return focusItems.join(' / ');
}

function getExternalLinkItems(tool) {
  return [
    tool.affiliateUrl ? '官方网站' : '官方网站入口以官方实际页面为准',
    '帮助中心',
    '价格页',
    '更新日志',
    '移动端或客户端入口',
    '隐私与数据说明'
  ];
}

function buildInfoRows(tool, category) {
  return [
    ['工具名称', tool.name],
    ['开发公司', getDeveloper(tool)],
    ['官方地址', tool.affiliateUrl || '以官网实际入口为准'],
    ['工具类型', getToolTypeLabel(tool)],
    ['主要入口', getMainEntrance(tool)],
    ['适合用户', tool.audience || '需要提升效率的中文用户'],
    ['核心能力', listOrFallback(tool.features, [tool.bestFor]).join('、')],
    ['价格模式', `${tool.pricing || '以官网为准'}，具体额度和套餐以官网为准`],
    ['上手难度', getDifficulty(tool)],
    ['中文支持', getChineseSupport(tool)],
    ['推荐指数', `${tool.rating} / 5`]
  ];
}

function buildModelRows(tool) {
  const taskType = tool.categorySlug === 'ai-image' ? '图像生成任务' :
    tool.categorySlug === 'ai-video' ? '视频生成任务' :
      tool.categorySlug === 'ai-voice' ? '语音生成任务' :
        tool.categorySlug === 'ai-coding' ? '代码和工程任务' :
          tool.categorySlug === 'ai-search' ? '搜索、资料整理和问答任务' :
            '写作、问答、总结和办公任务';

  return [
    ['产品名称', `${tool.name} 是用户实际使用的 ${getToolTypeLabel(tool)} 产品。`],
    ['底层能力', `${tool.name} 的具体能力会随官方版本、套餐和使用入口变化，涉及实时能力时以官网实际显示为准。`],
    ['输出质量', `主要取决于输入材料、提示词清晰度、任务复杂度和当前可用能力，适合处理${taskType}。`],
    ['产品体验', '还包括界面入口、文件或素材输入、历史记录、导出方式、套餐限制和服务稳定性。'],
    ['注意事项', '涉及事实、价格、版权、隐私、商用授权和专业结论时，需要人工核对，不建议直接照搬最终结果。']
  ];
}

function buildCapabilityRows(tool) {
  const rowsByCategory = {
    'ai-image': [
      ['提示词理解', `${tool.name} 适合根据主体、风格、场景、比例和参考图生成视觉方向。`],
      ['画面生成', '适合封面、商品图、概念图、海报灵感和设计素材初稿。'],
      ['风格控制', '可以通过风格词、参考图和多轮微调控制整体视觉，但细节仍需人工筛选。'],
      ['中文体验', '中文提示词可用，复杂视觉描述建议拆成主体、环境、光线和构图。'],
      ['后期核查', '文字、手部、品牌元素、版权和商用授权需要人工检查。']
    ],
    'ai-video': [
      ['镜头生成', `${tool.name} 适合把脚本、参考图或镜头描述转成短视频素材。`],
      ['图生视频', '适合让静态视觉动起来，用于片头、转场、产品展示或概念镜头。'],
      ['画面稳定性', '复杂动作、人物细节和连续镜头需要多次生成并筛选。'],
      ['剪辑衔接', '生成片段通常还需要配合剪辑、字幕、配音和调色。'],
      ['发布检查', '商用授权、人物肖像、素材来源和平台规范需要人工确认。']
    ],
    'ai-voice': [
      ['语音自然度', `${tool.name} 适合生成旁白、课程解说、播客草稿和多语言配音。`],
      ['脚本适配', '短句、停顿和语气标注越清楚，语音结果越容易贴近需求。'],
      ['多语言能力', '适合测试不同语言版本，但口音、专有名词和读音需要人工确认。'],
      ['后期处理', '导出音频后仍建议做音量统一、降噪和与视频时间轴对齐。'],
      ['授权检查', '声音授权、商用范围和平台规则以官网实际说明为准。']
    ],
    'ai-coding': [
      ['代码理解', `${tool.name} 适合解释代码、定位文件、生成思路和整理技术文档。`],
      ['代码生成', '适合生成示例、函数、组件和测试草稿，但提交前必须运行和审查。'],
      ['项目协作', '适合处理局部开发任务、报错分析和重构建议。'],
      ['中文体验', '可以用中文描述需求，但变量、接口和错误日志应尽量保留原文。'],
      ['安全核查', '涉及权限、数据、密钥、依赖升级和生产发布时，需要开发者最终确认。']
    ],
    'ai-search': [
      ['资料检索', `${tool.name} 适合围绕主题搜索资料、整理来源和形成初步结论。`],
      ['引用来源', '更适合需要保留来源、对比多个页面和核查观点的研究任务。'],
      ['信息整理', '可以把零散结果整理成摘要、对比表、清单和待确认问题。'],
      ['中文体验', '中文检索可用，但资料覆盖、来源质量和时效性需要人工判断。'],
      ['事实核对', '重要结论必须打开原始来源确认，不要只复制 AI 摘要。']
    ],
    'ai-office': [
      ['文档处理', `${tool.name} 适合总结文档、改写表达、生成汇报框架和整理知识库。`],
      ['办公协作', '适合会议纪要、周报、邮件、项目计划和团队资料整理。'],
      ['生态集成', '如果已在相关办公生态中工作，上手成本更低，具体能力以当前入口为准。'],
      ['中文体验', '中文办公场景可用，正式文档发布前仍需人工校对。'],
      ['权限与隐私', '企业资料、客户信息和内部文档需要遵守组织的数据使用规范。']
    ]
  };

  return rowsByCategory[tool.categorySlug] || [
    ['写作能力', `${tool.name} 适合生成草稿、标题、邮件、脚本、方案和结构化内容。`],
    ['问答能力', '适合解释概念、拆解问题、整理思路和生成可继续追问的初步答案。'],
    ['资料整理', '可以把长文本、零散资料和会议内容整理成摘要、清单或表格。'],
    ['办公能力', '适合周报、汇报框架、会议纪要、工作计划和流程拆解。'],
    ['代码辅助', '可以辅助解释代码、生成简单示例和分析报错，但复杂工程仍需验证。'],
    ['中文体验', `${getChineseSupport(tool)}，正式发布内容建议人工润色和核对。`]
  ];
}

function toTitleDescription(value, fallbackDescription) {
  if (value && typeof value === 'object') {
    return {
      title: value.title || value.name || value.label || fallbackDescription,
      description: value.description || value.desc || value.text || fallbackDescription
    };
  }

  const text = String(value || '').trim();
  const [title, ...rest] = text.split(/[：:。]/);
  return {
    title: title || fallbackDescription,
    description: rest.join('。').trim() || fallbackDescription
  };
}

function buildUseCaseItems(items, tool) {
  return items.slice(0, 6).map((item) => {
    const parsed = toTitleDescription(item, `适合用 ${tool.name} 处理这一类高频任务。`);
    return {
      title: parsed.title,
      description:
        parsed.description === parsed.title
          ? `适合在 ${tool.name} 中快速完成，尤其适合新手、办公和内容整理场景。`
          : parsed.description
    };
  });
}

function buildStepItems(items) {
  return items.slice(0, 6).map((item) => {
    const parsed = toTitleDescription(item, '按步骤完成后再检查结果。');
    return {
      title: parsed.title,
      description:
        parsed.description === parsed.title
          ? '先完成这一个小步骤，再进入下一轮补充、修改或核查。'
          : parsed.description
    };
  });
}

function buildScenarioItems(items, tool) {
  return items.slice(0, 6).map((item) => {
    const parsed = toTitleDescription(item, `${tool.name} 可以作为这个场景里的辅助工具。`);
    return {
      title: parsed.title,
      description:
        parsed.description === parsed.title
          ? `把目标、素材和输出格式说明清楚，${tool.name} 更容易给出可继续编辑的结果。`
          : parsed.description
    };
  });
}

function ChatGPTDetailSections() {
  const basicInfo = [
    ['工具名称', 'ChatGPT'],
    ['开发公司', 'OpenAI'],
    ['官方地址', 'https://chatgpt.com/'],
    ['工具类型', '通用 AI 助手 / 对话式 AI 工具'],
    ['主要入口', '网页端、移动端、桌面端'],
    ['适合用户', '学生、办公人群、内容创作者、运营人员、开发者、研究人员、自由职业者'],
    ['核心能力', '写作、问答、总结、翻译、学习、办公、代码辅助、数据分析、图片理解、文件分析'],
    ['价格模式', '提供免费版本，也有付费订阅版本，具体以官网为准'],
    ['上手难度', '低'],
    ['中文支持', '较好'],
    ['推荐指数', '4.9 / 5']
  ];

  const scenarios = [
    ['写作与内容创作', '用于文章草稿、短视频脚本、标题生成、文案优化、邮件撰写、产品介绍、公众号内容和营销方案。'],
    ['学习与知识理解', '用于解释概念、拆解知识点、生成学习计划、整理复习提纲、模拟问答和翻译资料。'],
    ['办公与资料整理', '用于总结会议纪要、整理长文档、提炼重点、制作清单、生成汇报框架和拆解工作流程。'],
    ['代码辅助', '用于解释代码、生成简单代码片段、排查报错思路、说明 API 用法和整理技术文档。'],
    ['信息分析与多模态任务', '在支持相关功能的版本中，可处理图片、文件、表格和数据分析任务，帮助用户提炼结论。']
  ];

  const modelNotes = [
    ['ChatGPT', '用户实际使用的 AI 助手产品。'],
    ['底层模型', 'ChatGPT 会根据版本、套餐和使用场景调用不同模型，能力会随官方更新变化。'],
    ['模型能力', '影响回答质量、推理深度、代码能力、写作质量和复杂任务处理能力。'],
    ['产品体验', '还包括界面、文件上传、语音、联网搜索、历史记录、工具调用、套餐限制和稳定性。']
  ];

  const capabilityNotes = [
    ['写作能力', '适合生成文章草稿、标题、脚本、邮件、方案和结构化内容。'],
    ['问答能力', '适合解释概念、回答常识问题、拆解复杂主题，但事实性结论仍建议核对来源。'],
    ['办公能力', '适合会议纪要、周报、汇报框架、文档总结、工作计划和流程拆解。'],
    ['代码辅助', '适合代码解释、简单代码生成、报错分析和技术文档整理，复杂工程问题仍需验证。']
  ];

  const useCases = [
    ['生成内容', '生成文章、短视频脚本、广告文案、邮件、报告、课程大纲、活动方案和产品介绍。'],
    ['整理信息', '把零散内容整理成清单、表格、摘要、流程、对比和结论。'],
    ['辅助决策', '列出方案、比较优缺点、拆解风险并生成行动计划，最终判断仍由用户确认。'],
    ['辅助学习', '用不同难度解释知识点，生成练习题、学习计划和复习清单。'],
    ['辅助办公', '提升周报、汇报、会议纪要、表达改写和计划制定效率。'],
    ['辅助编程', '解释代码逻辑、生成示例代码、分析报错原因和提供学习路线。']
  ];

  const quickStart = [
    ['明确任务', '不要只输入“帮我写一下”，最好说明目标、对象、风格、长度、用途和输出格式。'],
    ['给足背景', 'ChatGPT 的输出质量很依赖上下文，背景越清楚，结果越接近需求。'],
    ['指定格式', '可以要求输出为表格、清单、教程、分步骤方案、标题列表、文章结构或对比表。'],
    ['连续追问', '第一次结果不一定完美，可以继续要求它更简洁、更专业、更口语化、补充例子或改成表格。'],
    ['人工校对', '涉及事实、数据、价格、政策、医疗、法律、金融等内容时，必须人工核对。']
  ];

  const pros = [
    ['上手简单', '通过聊天即可使用，不需要复杂学习成本。'],
    ['场景覆盖广', '写作、问答、学习、办公、代码、资料整理都能覆盖。'],
    ['连续对话能力强', '可以基于上下文持续修改和完善结果。'],
    ['输出格式灵活', '可以生成文章、表格、清单、教程、代码、摘要和方案。'],
    ['适合作为效率入口', '很多日常工作可以先生成初稿，再由用户修改。']
  ];

  const cons = [
    ['可能出现事实错误', '涉及最新信息、专业结论和具体数据时，需要核对来源。'],
    ['结果依赖提示词质量', '问题描述越模糊，输出越容易泛泛而谈。'],
    ['不能完全替代专业判断', '法律、医疗、金融、工程上线等高风险任务，需要专业人士确认。'],
    ['不同套餐和模型体验不同', '免费版、付费版、不同模型和不同地区的可用能力可能存在差异。'],
    ['长任务需要拆解', '复杂任务最好拆成多个步骤，不要一次性要求它完成所有内容。']
  ];

  const outline = [
    'ChatGPT 是什么，适合解决什么问题',
    '如何注册和进入 ChatGPT',
    '如何写出清楚的提示词',
    '如何让 ChatGPT 生成文章、脚本和标题',
    '如何让 ChatGPT 总结文档和整理资料',
    '如何让 ChatGPT 辅助学习和解释概念',
    '如何让 ChatGPT 辅助办公、周报和会议纪要',
    '如何让 ChatGPT 解释代码和排查问题',
    '如何使用图片、文件和数据分析能力',
    '如何判断 ChatGPT 输出是否可靠',
    '如何把 ChatGPT 融入日常工作流',
    'ChatGPT 常见错误和避坑方法'
  ];

  const alternatives = [
    ['Claude', '适合长文阅读、深度写作、文档分析和自然表达。'],
    ['Gemini', '适合 Google 生态用户，以及搜索、办公和多模态相关场景。'],
    ['Kimi', '适合中文长文阅读、资料整理、文档总结和中文办公场景。'],
    ['DeepSeek', '适合中文问答、代码辅助、推理任务和高性价比使用场景。'],
    ['Perplexity', '适合带引用来源的信息搜索和研究型问答。'],
    ['Notion AI', '适合已经使用 Notion 的用户做笔记、文档和知识库整理。']
  ];

  return (
    <>
      <section className="doc-section" id="intro">
        <p className="doc-section-eyebrow">Introduction</p>
        <h2>1. 工具简介</h2>
        <p>ChatGPT 是 OpenAI 推出的通用型 AI 助手，用户可以通过自然语言对话，让它完成写作、问答、学习、办公、资料整理、代码解释、图片理解、文件分析等任务。</p>
        <p>它不是只服务某一个垂直场景，而是把多个常见 AI 能力集中在一个聊天工作流里。对于普通用户来说，ChatGPT 更像一个可以随时沟通的智能助手。</p>
        <p>本页评测的是 ChatGPT 这个 AI 产品的综合使用体验，而不是单独评测某一个 GPT 模型。</p>
      </section>

      <section className="doc-section" id="overview">
        <p className="doc-section-eyebrow">Overview</p>
        <h2>2. 工具概述</h2>
        <p>ChatGPT 的核心交互方式是对话。用户不需要学习复杂的软件操作，只需要输入问题、需求或任务说明，就可以让它生成内容、分析信息、整理思路或给出方案。</p>
        <p>相比传统搜索引擎，ChatGPT 更适合处理需要组织、改写、推理、总结和连续追问的任务。例如先解释一个概念，再要求它用更简单的话说明，或者整理成表格、清单、教程、邮件、脚本和方案。</p>
      </section>

      <section className="doc-section" id="basic-info">
        <p className="doc-section-eyebrow">Basics</p>
        <h2>3. 基础信息</h2>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-info-table">
            <tbody>
              {basicInfo.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="doc-callout">
          {TOOL_RATING_METHODOLOGY} 最近更新时间：{TOOL_RATING_UPDATED_AT}。详细标准见
          <Link href="/methodology">AI工具评测方法</Link>。
        </p>
        <p className="doc-callout">ChatGPT 的功能、可用模型和套餐能力会随官方更新变化，具体以实际版本和页面更新时间为准。</p>
      </section>

      <section className="doc-section" id="scenarios">
        <p className="doc-section-eyebrow">Use cases</p>
        <h2>4. 适用场景</h2>
        <div className="doc-line-list">
          {scenarios.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <h3>不太适合的场景</h3>
        <ul className="doc-simple-list">
          <li>需要完全准确且不可出错的法律、医疗、金融决策。</li>
          <li>需要实时、权威、强验证的信息，除非配合联网搜索和人工核对。</li>
          <li>需要直接替代专业人士最终判断的高风险任务。</li>
          <li>需要长期稳定自动执行的复杂业务流程，除非结合专门的工作流工具。</li>
        </ul>
      </section>

      <section className="doc-section" id="models">
        <p className="doc-section-eyebrow">Models</p>
        <h2>5. 模型说明与能力表现</h2>
        <p>ChatGPT 是产品名称，底层 GPT 模型是它可能调用的模型能力之一。两者不能混为一谈。</p>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-model-table">
            <thead>
              <tr>
                <th>项目</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {modelNotes.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-capability-table">
            <thead>
              <tr>
                <th>能力</th>
                <th>表现说明</th>
              </tr>
            </thead>
            <tbody>
              {capabilityNotes.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section" id="use-cases">
        <p className="doc-section-eyebrow">What it does</p>
        <h2>6. 核心用途</h2>
        <div className="doc-line-list">
          {useCases.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section" id="quick-start">
        <p className="doc-section-eyebrow">Start here</p>
        <h2>7. 入门步骤</h2>
        <div className="doc-line-list">
          {quickStart.map(([title, text], index) => (
            <div key={title}>
              <h3>{index + 1}. {title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="prompt-block">
          <pre><code>请帮我写一篇 800 字的 ChatGPT 工具介绍，面向 AI 新手，风格简洁，结构包括简介、适用场景、优点和限制。</code></pre>
        </div>
      </section>

      <section className="doc-section" id="pros-cons">
        <p className="doc-section-eyebrow">Pros and limits</p>
        <h2>8. 优点与限制</h2>
        <div className="doc-compare-panel">
          <div>
            <h3>优点</h3>
            {pros.map(([title, text]) => <p key={title}><strong>{title}：</strong>{text}</p>)}
          </div>
          <div>
            <h3>限制</h3>
            {cons.map(([title, text]) => <p key={title}><strong>{title}：</strong>{text}</p>)}
          </div>
        </div>
      </section>

      <section className="doc-section" id="tutorial">
        <p className="doc-section-eyebrow">Learning path</p>
        <h2>9. 教程大纲</h2>
        <p>新手可以按照以下顺序学习 ChatGPT：</p>
        <ol className="doc-simple-list">
          {outline.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </section>

      <section className="doc-section" id="alternatives">
        <p className="doc-section-eyebrow">Next options</p>
        <h2>10. 替代工具与外部链接</h2>
        <div className="doc-line-list">
          {alternatives.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <p className="detail-external-link"><a href="https://chatgpt.com/" target="_blank" rel="sponsored nofollow noopener noreferrer">访问 ChatGPT 官方网站</a>。价格、套餐、模型和功能更新以官网为准。</p>
      </section>
    </>
  );
}

function GenericToolSections({
  tool,
  category,
  useCaseItems,
  quickStartItems,
  scenarioItems,
  pros,
  cons,
  promptExamples,
  tutorialOutline,
  beginnerTips,
  commonMistakes,
  sidebarTools
}) {
  const infoRows = buildInfoRows(tool, category);
  const modelRows = buildModelRows(tool);
  const capabilityRows = buildCapabilityRows(tool);
  const overviewParagraphs = [
    `${tool.name} 是一款${getToolTypeLabel(tool)}，面向 ${tool.audience || '效率用户'}，主要适合 ${tool.bestFor || '日常内容处理和工作流提效'}。`,
    tool.summary,
    `本页评测重点是 ${tool.name} 作为产品在真实任务中的使用方式、适用场景、能力边界和新手上手路径，而不是把它等同于某一个固定模型或单一功能。`
  ].filter(Boolean);
  const conceptParagraphs = [
    `${tool.name} 的核心价值在于把用户输入的目标、素材和上下文转化成更容易继续编辑、判断或执行的结果。`,
    `和传统软件相比，它更依赖自然语言说明；和普通搜索相比，它更适合整理、改写、提炼、生成和连续追问。`,
    `使用时建议先把任务拆小，说明背景、输入材料、输出格式和核查标准，再根据第一版结果逐步修订。`
  ];
  const externalLinkItems = getExternalLinkItems(tool);

  return (
    <>
      <section className="doc-section" id="intro">
        <p className="doc-section-eyebrow">Introduction</p>
        <h2>1. 工具简介</h2>
        {overviewParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="doc-section" id="overview">
        <p className="doc-section-eyebrow">Overview</p>
        <h2>2. 工具概述</h2>
        {conceptParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="doc-section" id="basic-info">
        <p className="doc-section-eyebrow">Basics</p>
        <h2>3. 基础信息</h2>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-info-table">
            <tbody>
              {infoRows.map(([label, value]) => (
                <tr key={label}>
                  <th>{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="doc-callout">
          {TOOL_RATING_METHODOLOGY} 最近更新时间：{TOOL_RATING_UPDATED_AT}。详细标准见
          <Link href="/methodology">AI工具评测方法</Link>。
        </p>
        <p className="doc-callout">{tool.name} 的价格、套餐、入口、可用能力和模型更新会随官方调整变化，涉及购买、商用或专业判断时请以官网实际显示为准。</p>
      </section>

      <section className="doc-section" id="scenarios">
        <p className="doc-section-eyebrow">Use cases</p>
        <h2>4. 适用场景</h2>
        <div className="doc-line-list">
          {scenarioItems.map((item) => (
            <div key={`${item.title}-${item.description}`}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <h3>不太适合的场景</h3>
        <ul className="doc-simple-list">
          <li>需要完全准确且不可出错的法律、医疗、金融等高风险决策。</li>
          <li>需要实时、权威、强验证的信息，除非配合原始来源和人工核查。</li>
          <li>需要直接替代专业人士最终判断的复杂任务。</li>
          <li>涉及隐私、客户资料、版权、商用授权或内部数据时，需要先确认合规边界。</li>
        </ul>
      </section>

      <section className="doc-section" id="models">
        <p className="doc-section-eyebrow">Models</p>
        <h2>5. 模型说明与能力表现</h2>
        <p>{tool.name} 是用户实际使用的产品入口，底层能力、套餐权限、文件或素材处理能力会随官方版本更新变化。本页重点关注产品在真实任务中的综合体验。</p>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-model-table">
            <thead>
              <tr>
                <th>项目</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {modelRows.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="doc-table-wrap ai-tool-doc-table-wrap">
          <table className="ai-tool-doc-table ai-tool-capability-table">
            <thead>
              <tr>
                <th>能力</th>
                <th>表现说明</th>
              </tr>
            </thead>
            <tbody>
              {capabilityRows.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section" id="use-cases">
        <p className="doc-section-eyebrow">What it does</p>
        <h2>6. 核心用途</h2>
        <div className="doc-line-list">
          {useCaseItems.map((item) => (
            <div key={`${item.title}-${item.description}`}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-section" id="quick-start">
        <p className="doc-section-eyebrow">Start here</p>
        <h2>7. 入门步骤</h2>
        <div className="doc-line-list">
          {quickStartItems.map((item, index) => (
            <div key={`${item.title}-${item.description}`}>
              <h3>{index + 1}. {item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        {promptExamples.length > 0 ? (
          <div className="prompt-block">
            <p>
              <span>提示词示例</span>
              <button type="button" aria-label={`复制 ${tool.name} 提示词示例`}>复制</button>
            </p>
            <pre><code>{promptExamples[0]}</code></pre>
          </div>
        ) : null}
      </section>

      <section className="doc-section" id="pros-cons">
        <p className="doc-section-eyebrow">Decision notes</p>
        <h2>8. 优点与限制</h2>
        <div className="doc-compare-panel">
          <div>
            <h3>优点</h3>
            <ul className="doc-simple-list">
              {pros.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h3>限制</h3>
            <ul className="doc-simple-list">
              {cons.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="doc-section" id="tutorial">
        <p className="doc-section-eyebrow">Learning path</p>
        <h2>9. 教程大纲</h2>
        <div className="doc-outline-layout">
          <div>
            <h3>建议学习顺序</h3>
            <ol className="doc-simple-list">
              {tutorialOutline.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
          <div className="doc-reading-columns">
            <div>
              <h3>新手提示</h3>
              <ul className="doc-simple-list">
                {beginnerTips.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3>常见错误</h3>
              <ul className="doc-simple-list">
                {commonMistakes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="doc-section" id="alternatives">
        <p className="doc-section-eyebrow">Next options</p>
        <h2>10. 替代工具与外部链接</h2>
        {sidebarTools.length > 0 ? (
          <div className="doc-line-list">
            {sidebarTools.slice(0, 3).map((item) => (
              <div key={item.slug}>
                <h3><Link href={`/ai-tools/${item.slug}`}>{item.name}</Link></h3>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        ) : null}
        <h3>外部链接建议</h3>
        <ul className="doc-simple-list">
          {externalLinkItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {tool.affiliateUrl ? (
          <p className="doc-external-note">
            <a href={tool.affiliateUrl} rel="sponsored nofollow noopener" className="font-bold text-brand">
              访问 {tool.name}
            </a>
            。价格、套餐、功能和模型更新以官网实际显示为准。
          </p>
        ) : null}
      </section>
    </>
  );
}

export default async function ToolDetailPage({ params }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const isChatGPT = tool.slug === 'chatgpt';
  const category = getCategory(tool.categorySlug);
  const useCases = listOrFallback(tool.useCases, tool.features);
  const quickStart = listOrFallback(tool.quickStart, [
    '打开工具官网并完成账号准备。',
    '选择一个具体任务，补充背景和输出格式。',
    '先生成第一版结果，再逐轮修改。',
    '保存可复用的提示词和工作流。'
  ]);
  const scenarios = listOrFallback(tool.scenarios, [tool.bestFor]);
  const pros = listOrFallback(tool.pros, ['上手门槛低', '适合常见效率场景', '可以和现有工作流结合']);
  const cons = listOrFallback(tool.cons, ['重要结果仍需人工核查', '价格和额度以官网为准', '复杂任务需要拆分步骤']);
  const beginnerTips = listOrFallback(tool.beginnerTips, ['先说明目标和读者', '要求输出固定格式', '重要内容二次核查']);
  const commonMistakes = listOrFallback(tool.commonMistakes, ['问题过于宽泛', '忽略事实核查', '一次要求完成太多目标']);
  const promptExamples = listOrFallback(tool.promptExamples, [
    `请帮我用 ${tool.name} 完成一个新手可执行的任务流程，输出为步骤清单。`
  ]);
  const tutorialOutline = listOrFallback(tool.tutorialOutline, [
    '适合谁使用',
    '能解决什么问题',
    '第一次怎么用',
    '真实任务示例',
    '常见坑和替代工具'
  ]);
  const alternativeTools = listOrFallback(tool.alternatives)
    .map((name) => tools.find((item) => item.name === name))
    .filter(Boolean);
  const relatedTools = tools
    .filter((item) => item.slug !== tool.slug && item.categorySlug === tool.categorySlug)
    .slice(0, 4);
  const sidebarTools = alternativeTools.length > 0 ? alternativeTools : relatedTools;
  const useCaseItems = buildUseCaseItems(useCases, tool);
  const quickStartItems = buildStepItems(quickStart);
  const scenarioItems = buildScenarioItems(scenarios, tool);
  const tocItems = chatgptTocItems;
  const metaItems = isChatGPT ? chatgptMetaItems : [
    tool.pricing,
    getToolTypeLabel(tool),
    category?.name,
    getFocusLine(tool),
    `${tool.rating} / 5`
  ].filter(Boolean);

  return (
    <article className="doc-page-shell site-page-container tool-detail-page ai-tool-detail-page">
      <JsonLd data={breadcrumbJsonLd([
        { name: '首页', href: '/' },
    { name: 'AI工具库', href: '/tools' },
        { name: tool.name, href: `/ai-tools/${tool.slug}` }
      ])} />

      <div className="tool-doc-layout ai-tool-doc-shell">
        <main className="doc-main detail-prose ai-tool-doc-main">
          <div className="doc-main-inner ai-tool-doc-content">
            <header className="doc-hero tool-doc-hero ai-tool-doc-header" id="top">
              <div className="doc-kicker">
                <span className="section-accent-dots" aria-hidden="true">
                  <span className="section-dot section-dot-purple" />
                  <span className="section-dot section-dot-yellow" />
                  <span className="section-dot section-dot-cyan" />
                </span>
                <span className="section-eyebrow">{category?.name || 'AI Tool'}</span>
              </div>
              <div className="doc-title-stack">
                <h1 className="doc-title">{isChatGPT ? chatgptDetailTitle : getToolDetailTitle(tool)}</h1>
                <p className="doc-subtitle">{isChatGPT ? chatgptDetailDescription : tool.summary}</p>
              </div>
              {tool.slug === 'claude' ? (
                <Link href="/videos/claude-user-fit-video" className="doc-video-entry">
                  <span>视频教程</span>
                  <strong>Claude 适合哪些人使用</strong>
                  <small>用 2 分 24 秒讲清长文档、写作和总结场景</small>
                </Link>
              ) : null}
              <div className="doc-meta-row detail-overview-row" aria-label="页面信息">
                <div className="detail-overview-grid">
                  {metaItems.map((item) => (
                    <div key={item}>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            {isChatGPT ? (
              <ChatGPTDetailSections />
            ) : (
              <GenericToolSections
                tool={tool}
                category={category}
                useCaseItems={useCaseItems}
                quickStartItems={quickStartItems}
                scenarioItems={scenarioItems}
                pros={pros}
                cons={cons}
                promptExamples={promptExamples}
                tutorialOutline={tutorialOutline}
                beginnerTips={beginnerTips}
                commonMistakes={commonMistakes}
                sidebarTools={sidebarTools}
              />
            )}
          </div>
        </main>

        <ToolDetailNavigation
          tocItems={tocItems}
          relatedTools={sidebarTools}
          toolName={tool.name}
        />
      </div>
    </article>
  );
}
