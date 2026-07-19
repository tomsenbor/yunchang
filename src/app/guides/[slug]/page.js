import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GuideRelatedContent } from '../../../components/GuideRelatedContent.jsx';
import { JsonLd } from '../../../components/JsonLd.jsx';
import { getGuide, getGuideContext, guides } from '../../../lib/guide-content.mjs';
import { getCategory, tools } from '../../../lib/site-data.mjs';
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from '../../../lib/seo.mjs';

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`
  });
}

const tocItems = [
  ['overview', '教程概览'],
  ['audience', '适合谁阅读'],
  ['outcomes', '本篇你会完成什么'],
  ['prep', '准备工作'],
  ['method', '核心方法'],
  ['steps', '跟做步骤'],
  ['prompts', '提示词模板'],
  ['mistakes', '常见错误'],
  ['check', '完成检查'],
  ['faq', '常见问题'],
  ['next', '下一步学习']
];

const levelLabels = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级'
};

const categoryProfiles = {
  'ai-assistant': {
    label: 'AI 助手',
    beginnerTask: '写作、问答、总结或资料整理',
    material: '一段文字、一个问题或一份工作说明',
    outputFormat: '清单、表格、文章大纲或步骤方案',
    firstResult: '一份结构清晰、可以继续修改的初稿',
    followUp: '请把结果改得更简洁，并标出需要人工核对的信息。',
    notFit: ['想学习底层模型训练的人', '需要完全自动化业务流程的人']
  },
  'domestic-ai': {
    label: '中文 AI 助手',
    beginnerTask: '中文问答、资料整理、写作或代码解释',
    material: '中文资料、课程笔记、报错信息或工作说明',
    outputFormat: '中文清单、表格、复习提纲或操作步骤',
    firstResult: '一份适合中文场景继续编辑的结果',
    followUp: '请把上面的内容改成更适合中文办公场景的版本。',
    notFit: ['需要跨国企业级权限管理的人', '需要实时权威数据但不准备核对来源的人']
  },
  'ai-writing': {
    label: 'AI 写作',
    beginnerTask: '写文章、改文案、总结长文或润色表达',
    material: '主题、目标读者、已有草稿或参考资料',
    outputFormat: '标题列表、文章大纲、初稿或润色版本',
    firstResult: '一份能继续修改的写作初稿',
    followUp: '请保留原意，把表达改得更自然，并说明修改了哪些地方。',
    notFit: ['希望完全跳过人工审稿的人', '需要严格出版级事实校对的人']
  },
  'ai-search': {
    label: 'AI 搜索',
    beginnerTask: '资料搜索、长文阅读、来源整理或调研总结',
    material: '一个调研主题、网页链接、文档或报告',
    outputFormat: '来源清单、摘要、对比表或行动建议',
    firstResult: '一份带重点和待核对信息的资料摘要',
    followUp: '请把结论和来源分开列出，并标出哪些信息还需要核对。',
    notFit: ['只想得到不带来源的结论的人', '不愿打开原始来源核查的人']
  },
  'ai-image': {
    label: 'AI 图片',
    beginnerTask: '生成海报、封面、商品图或视觉灵感',
    material: '主题、画面主体、风格参考、尺寸和用途',
    outputFormat: '提示词、风格方案、画面说明或迭代清单',
    firstResult: '一组可继续迭代的视觉方向',
    followUp: '请保留主体，把风格改得更简洁，并给出 3 个替代构图。',
    notFit: ['需要一次生成最终商用成片的人', '不准备检查版权和细节的人']
  },
  'ai-video': {
    label: 'AI 视频',
    beginnerTask: '生成短视频镜头、脚本、分镜或剪辑素材',
    material: '脚本、画面描述、参考图或视频目标',
    outputFormat: '分镜表、镜头提示词、剪辑清单或旁白脚本',
    firstResult: '一套可以进入生成或剪辑的镜头方案',
    followUp: '请把镜头控制得更简单，每个镜头只保留一个主要动作。',
    notFit: ['需要复杂长片全自动生成的人', '不准备二次剪辑和筛选素材的人']
  },
  'ai-voice': {
    label: 'AI 配音',
    beginnerTask: '生成旁白、口播脚本、播客草稿或课程解说',
    material: '脚本文字、目标语气、听众和时长',
    outputFormat: '分段旁白、口播稿、停顿标注或音频检查清单',
    firstResult: '一份适合配音工具朗读的脚本',
    followUp: '请把句子改短，并标出适合停顿的位置。',
    notFit: ['需要未经授权复刻真人声音的人', '不准备检查读音和授权规则的人']
  },
  'ai-coding': {
    label: 'AI 编程',
    beginnerTask: '读代码、改小功能、解释报错或生成示例',
    material: '项目背景、相关代码、报错信息或目标行为',
    outputFormat: '修改计划、代码片段、排查步骤或测试清单',
    firstResult: '一套可以人工检查后执行的开发步骤',
    followUp: '请先说明会改哪些文件，再给出最小修改方案。',
    notFit: ['不愿阅读 diff 就直接合并代码的人', '需要 AI 独立负责上线质量的人']
  },
  'ai-office': {
    label: 'AI 办公',
    beginnerTask: '整理会议纪要、周报、邮件、文档或项目待办',
    material: '会议记录、工作说明、邮件草稿或项目资料',
    outputFormat: '纪要、待办表、汇报框架或邮件版本',
    firstResult: '一份可以复制到办公文档中的结构化内容',
    followUp: '请把结果改成正式商务语气，并单独列出待确认信息。',
    notFit: ['需要替代团队确认流程的人', '不准备核对日期、负责人和数据的人']
  },
  'ai-design': {
    label: 'AI 设计',
    beginnerTask: '生成海报、PPT、社媒图或品牌素材方向',
    material: '主题、受众、尺寸、品牌风格和参考内容',
    outputFormat: '版式方案、标题文案、设计清单或导出检查',
    firstResult: '一套可以进入设计工具继续调整的方案',
    followUp: '请减少装饰元素，保留标题区、图片区和行动按钮区。',
    notFit: ['需要完整品牌系统设计的人', '不准备检查素材授权的人']
  },
  'ai-subtitle': {
    label: 'AI 字幕',
    beginnerTask: '生成字幕、口播脚本、短视频结构或剪辑清单',
    material: '视频主题、口播稿、原始字幕或剪辑目标',
    outputFormat: '字幕稿、分段脚本、标题钩子或发布检查清单',
    firstResult: '一份适合剪辑工具继续处理的字幕和脚本',
    followUp: '请把字幕改得更短，每句不超过 18 个字。',
    notFit: ['需要完全替代人工校对字幕的人', '不准备检查错字和时间轴的人']
  }
};

function listOrFallback(value, fallback = []) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

function normalizeTitle(guide) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return 'ChatGPT 新手入门教程：从注册到日常使用';
  }
  return guide.title
    .replace(/([A-Za-z0-9])怎么/g, '$1 怎么')
    .replace(/AI怎么/g, 'AI 怎么')
    .replace(/AI写/g, 'AI 写')
    .replace(/AI视频/g, 'AI 视频')
    .replace(/AI配音/g, 'AI 配音');
}

function getGuideTool(guide) {
  return tools.find((tool) => tool.slug === guide.toolSlug);
}

function getProfile(categorySlug) {
  return categoryProfiles[categorySlug] || categoryProfiles['ai-assistant'];
}

function getPrimaryTask(guide, draft, profile) {
  return draft.taskExample || guide.outcome || profile.beginnerTask;
}

function buildOverview(guide, tool, profile) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return [
      '这篇教程适合第一次使用 ChatGPT 的用户。目标不是讲复杂提示词技巧，也不是研究模型原理，而是帮助你完成从打开工具、输入第一个清晰问题、继续追问、保存结果到检查输出质量的完整流程。',
      '学完后，你应该能独立完成写作、总结、资料整理等基础任务，并知道哪些内容可以直接使用，哪些内容必须人工核对。',
      '这篇教程不展开 OpenAI API、自动化工作流和企业级部署，只聚焦普通用户可以马上跟做的基础使用流程。'
    ];
  }

  const toolName = tool?.name || normalizeTitle(guide).split('：')[0];
  return [
    `这篇教程围绕「${normalizeTitle(guide)}」展开，目标是让你用 ${toolName} 完成一个具体任务，而不是只了解功能介绍。`,
    `教程会从准备材料开始，带你写出第一个清晰需求，再通过追问、结构化输出和结果检查，把 ${profile.label} 能力转成可复用的工作流程。`,
    `本篇不追求一次讲完所有高级功能，也不替代专业判断。你会学会如何开始、如何修改结果，以及哪些地方需要人工核对。`
  ];
}

function buildAudience(guide, profile) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return {
      fit: [
        '第一次接触 ChatGPT 的用户',
        '想用 AI 写文章、邮件、周报的人',
        '想用 AI 总结资料、会议记录的人',
        '想学习基础提示词写法的人',
        '不知道如何追问和修改结果的人',
        '想把 ChatGPT 用到日常办公和学习中的用户'
      ],
      notFit: [
        '已经熟练使用复杂提示词的人',
        '想学习 OpenAI API 开发的人',
        '想研究模型训练和底层原理的人',
        '需要企业级自动化工作流方案的人'
      ]
    };
  }

  return {
    fit: [
      `第一次学习 ${profile.label} 工作流的新手`,
      `想用 AI 完成「${guide.outcome}」的人`,
      '希望把结果整理到文档、表格或内容工具中的用户',
      '需要一套可复用提示词模板的人',
      '想知道如何追问、检查和修改输出的人'
    ],
    notFit: [
      ...profile.notFit,
      '已经有成熟高级工作流的人',
      '需要实时价格、政策或专业结论但不打算人工核对的人'
    ]
  };
}

function buildOutcomes(guide, draft, profile) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return [
      '写出第一个清晰提示词',
      '让 ChatGPT 生成文章大纲或初稿',
      '让 ChatGPT 总结一段资料',
      '通过追问改进输出',
      '保存至少 3 个可复用提示词模板',
      '判断回答是否需要人工核对',
      '知道如何把结果整理到自己的文档里'
    ];
  }

  return [
    `明确一个适合练习的 ${profile.label} 任务`,
    `准备好 ${profile.material}`,
    `写出包含目标、背景和格式的第一条提示词`,
    `得到 ${profile.firstResult}`,
    '用追问把结果改成更适合直接使用的版本',
    '保存可复用模板和需要替换的变量',
    '完成一次事实、格式、版权或专业风险检查'
  ];
}

function buildPrep(guide, profile) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return [
      '一个可用账号或可以打开的 ChatGPT 工具入口。',
      '一个明确练习任务，例如写邮件、总结资料、生成选题。',
      '一段练习材料，例如会议记录、文章段落、工作说明。',
      '一个保存结果的文档工具，例如 Word、Notion、飞书文档或备忘录。',
      '10 到 20 分钟连续练习时间。'
    ];
  }

  return [
    `一个可打开的工具入口，或已经登录好的 ${profile.label} 工具。`,
    `一个明确练习任务，例如：${getPrimaryTask(guide, guide.tutorialDraft || {}, profile)}。`,
    `一份可输入的练习材料：${profile.material}。`,
    `一个保存结果的位置，例如文档、表格、设计稿、代码仓库或剪辑项目。`,
    '10 到 20 分钟连续练习时间，先完成小任务，再尝试更复杂的任务。'
  ];
}

function buildMethod(profile) {
  return {
    formula: [
      ['任务目标', '你要 AI 完成什么，不要只写“帮我做一下”。'],
      ['背景信息', '补充对象、受众、材料来源、使用场景和限制条件。'],
      ['输出格式', `提前指定 ${profile.outputFormat}，让结果更容易直接使用。`],
      ['风格要求', '说明正式、简洁、口语化、专业、适合新手等表达方向。'],
      ['限制条件', '写清字数、不要编造、标注不确定信息、保留来源或需要人工核对。']
    ],
    weakPrompt: `帮我做一个${profile.label}任务。`,
    strongPrompt: `请帮我完成一个「${profile.beginnerTask}」任务。背景是：【补充背景】。请用「${profile.outputFormat}」输出，风格简洁，标出不确定信息，并告诉我下一步应该如何修改。`,
    why: [
      '有明确任务，不会让 AI 自己猜方向。',
      '有背景材料，输出更贴近真实需求。',
      '有格式要求，结果更容易复制到工作文档。',
      '有限制条件，能降低编造和空泛表达的概率。'
    ]
  };
}

function chatgptSteps() {
  return [
    {
      title: '打开 ChatGPT 并确定第一个任务',
      text: '第一次使用时，不要一上来就问很大的问题。先选一个可以快速判断结果好坏的小任务，例如总结一段文字、改写一封邮件、整理会议记录或生成一篇文章大纲。',
      why: '小任务更容易判断输出是否可用，也更适合练习追问。',
      instruction: '准备一段真实会议记录或工作说明，先让 ChatGPT 按固定结构整理。',
      prompt: `我第一次使用 ChatGPT，请帮我把下面这段会议记录整理成：
1. 会议结论
2. 待办事项
3. 负责人
4. 截止时间

内容如下：
【粘贴会议记录】`,
      expected: '输出应该有清晰标题，待办事项能直接执行。如果原文没有负责人或截止时间，应该标注“原文未提及”。',
      followUp: '请把刚才的结果整理成表格，并把缺失信息单独列出来。'
    },
    {
      title: '写出第一个清晰提示词',
      text: '一个清晰提示词至少要包含任务目标、背景信息和输出格式。',
      why: '提示词越清楚，第一次输出越接近可用初稿。',
      instruction: '把读者、主题、长度、风格和结构一次说清楚。',
      prompt: `请帮我写一篇 600 字左右的文章初稿，主题是“如何用 ChatGPT 提高办公效率”，面向 AI 新手，风格简洁，结构包括：
1. 为什么需要 AI 助手
2. ChatGPT 可以做什么
3. 三个办公使用场景
4. 使用时要注意什么`,
      expected: '应该得到一篇有标题、有段落、有结构的初稿，而不是零散回答。',
      followUp: '请把这篇文章改得更适合公众号风格，并补充一个开头案例。'
    },
    {
      title: '让 ChatGPT 输出结构化结果',
      text: '如果你希望结果能直接使用，最好提前指定输出格式，例如表格、清单、步骤、邮件、报告或大纲。',
      why: '结构化输出更容易复制到文档、表格或待办工具里。',
      instruction: '给出列名、排序方式和备注字段。',
      prompt: `请把下面内容整理成一个表格，表格列包括：
任务
负责人
截止时间
优先级
备注

内容如下：
【粘贴内容】`,
      expected: '输出应是可复制到文档或表格工具中的结构化内容。',
      followUp: '请按照优先级重新排序，并把最紧急的 3 项放在最上面。'
    },
    {
      title: '通过追问优化结果',
      text: '第一次回答通常只是初稿。你可以继续追问，让结果更短、更专业、更口语化或更适合某个平台。',
      why: '追问是把“能看”改成“能用”的关键步骤。',
      instruction: '每次追问只改一个方向，例如压缩、补例子、换语气或改格式。',
      prompt: `请基于刚才的回答，做三件事：
1. 删除重复内容
2. 用更口语化的表达
3. 最后补充一个适合新手的行动清单`,
      expected: '得到一个更清楚、更适合发布或保存的版本。',
      followUp: '请再给我一个更正式的版本，并说明两个版本分别适合什么场景。'
    },
    {
      title: '保存可复用提示词模板',
      text: '当你发现某个提示词好用时，不要只保存结果，也要保存提示词本身。这样下次遇到类似任务时可以直接复用。',
      why: '模板能减少重复试错，让后续任务更稳定。',
      instruction: '保存模板名称、适用场景、正文和可替换变量。',
      prompt: `模板名称：会议纪要整理
适用场景：会议记录、访谈记录、项目讨论
提示词正文：
请把下面内容整理成会议纪要，包含会议结论、待办事项、负责人和截止时间。
可替换内容：
【粘贴会议记录】`,
      expected: '形成一个下次可以直接复制使用的模板。',
      followUp: '请把这个模板改成适合项目复盘会议的版本。'
    },
    {
      title: '检查结果是否可靠',
      text: 'ChatGPT 的输出可以作为初稿，但涉及事实、数字、价格、政策、法律、医疗、金融等内容时，必须人工核对。',
      why: 'AI 输出可能自信但不准确，正式使用前必须做风险检查。',
      instruction: '检查事实、来源、缺失前提、语气和是否适合直接发给别人。',
      prompt: `请检查你刚才的回答：
1. 哪些内容是事实判断
2. 哪些内容需要进一步核对
3. 哪些结论可能存在不确定性
4. 有没有遗漏重要前提
5. 请给出一个更谨慎、更适合正式使用的版本`,
      expected: '得到一份更谨慎的版本，并知道哪些内容不能直接照搬。',
      followUp: '请把需要人工核对的内容整理成一个检查清单。'
    }
  ];
}

function buildSteps(guide, draft, profile) {
  if (guide.slug === 'chatgpt-beginner-guide') return chatgptSteps();

  const primaryTask = getPrimaryTask(guide, draft, profile);
  const fallbackPrompt = buildMethod(profile).strongPrompt;
  const draftPrompt = listOrFallback(draft.recommendedPrompts, [fallbackPrompt])[0] || fallbackPrompt;
  return [
    {
      title: `确定一个适合练习的 ${profile.label} 任务`,
      text: `先不要把目标设得太大。建议从「${primaryTask}」开始，保证你能快速判断结果好坏。`,
      why: '小任务能让你更快看出提示词、材料和输出格式哪里需要调整。',
      instruction: `准备 ${profile.material}，并写下你希望得到的最终结果。`,
      prompt: `我想用 AI 完成这个任务：${primaryTask}。
请先帮我判断这个任务是否适合新手练习，并把任务拆成 3 个可执行步骤。`,
      expected: '你会得到一份任务拆解，而不是直接进入复杂生成。',
      followUp: '请把这 3 个步骤改成我可以今天完成的练习清单。'
    },
    {
      title: '补充背景和输入材料',
      text: `把目标、受众、用途和材料说清楚。${profile.label} 工具不是只看关键词，而是依赖上下文理解任务。`,
      why: '背景越明确，AI 越不容易输出空泛内容。',
      instruction: '把素材粘贴进去，或说明素材缺失时应该先向你提问。',
      prompt: `请基于下面材料完成任务。
任务目标：【写清你要完成什么】
背景信息：【补充受众、用途、限制条件】
材料如下：
【粘贴材料】`,
      expected: `得到一份围绕材料展开的 ${profile.firstResult}。`,
      followUp: '如果信息不足，请先列出你还需要我补充的 5 个问题。'
    },
    {
      title: '指定输出格式',
      text: `提前说明你需要 ${profile.outputFormat}，不要让 AI 自由发挥。`,
      why: '格式越清楚，结果越容易直接复制使用。',
      instruction: '给出字段、顺序、长度或示例格式。',
      prompt: `请把结果整理成「${profile.outputFormat}」。
要求：
1. 先给结论
2. 再给执行步骤
3. 标出不确定信息
4. 最后给我下一步建议`,
      expected: '结果会更像工作文档，而不是散乱回答。',
      followUp: '请把上面的结果改成表格，并保留备注列。'
    },
    {
      title: '生成第一版结果并追问',
      text: '第一版结果通常只是草稿。你需要根据可用性继续追问，而不是直接复制。',
      why: '追问可以修正语气、补充细节、压缩篇幅或调整格式。',
      instruction: '选择一个最明显的问题继续要求修改。',
      prompt: draftPrompt,
      expected: `得到一版可以继续优化的 ${profile.firstResult}。`,
      followUp: profile.followUp
    },
    {
      title: '保存模板和变量',
      text: '把有效提示词保存成模板，标出每次需要替换的变量。',
      why: '模板能把一次成功经验变成以后可以复用的流程。',
      instruction: '至少保存模板名称、适用场景、提示词正文和可替换变量。',
      prompt: `请把刚才这套提示词整理成模板：
1. 模板名称
2. 适用场景
3. 提示词正文
4. 每次需要替换的变量
5. 使用注意事项`,
      expected: '你会得到一份可以复制到提示词库的模板。',
      followUp: '请再给我一个更适合进阶任务的版本。'
    },
    {
      title: '检查结果并决定是否可用',
      text: '正式使用前，检查事实、数字、来源、版权、专业判断和是否符合你的目标。',
      why: 'AI 输出可以节省时间，但不应替代最终判断。',
      instruction: '把需要核对的地方单独列出来，再决定是否发布、提交或继续修改。',
      prompt: `请检查刚才的结果：
1. 哪些内容可以直接使用
2. 哪些内容需要人工核对
3. 哪些内容可能存在风险
4. 如果要正式使用，还需要补充什么`,
      expected: '得到一份风险更清楚的最终检查清单。',
      followUp: '请把需要人工核对的内容按优先级排序。'
    }
  ];
}

function basePromptTemplates(profile) {
  return [
    {
      name: '基础提问模板',
      scenario: '第一次向 AI 提问，不知道如何组织需求时使用。',
      prompt: `请你作为【角色】，帮我完成【任务】。
背景信息是：【补充背景】。
输出要求：
1. 用【格式】呈现
2. 语言风格【正式 / 简洁 / 口语化 / 专业】
3. 控制在【字数或长度】
4. 如果信息不足，请先向我提问，不要直接编造`,
      variables: '角色、任务、背景、格式、风格、字数。',
      advice: '第一次提问时，至少填写任务、背景和输出格式。'
    },
    {
      name: `${profile.label} 任务拆解模板`,
      scenario: `面对 ${profile.beginnerTask}，不知道先做哪一步时使用。`,
      prompt: `我想完成一个 ${profile.label} 任务：有关【主题】。
我的目标是：【目标】。
已有材料是：【材料】。
请帮我拆成：
1. 准备材料
2. 第一次输入
3. 需要追问的方向
4. 输出检查清单
5. 下一步优化建议`,
      variables: '主题、目标、材料、输出检查重点。',
      advice: '先让 AI 拆流程，再进入正式生成，可以减少返工。'
    },
    {
      name: '总结资料模板',
      scenario: '会议记录、文章段落、网页内容、学习资料。',
      prompt: `请帮我总结下面这段内容，要求：
1. 用 5 条以内说明核心观点
2. 单独列出行动项
3. 标出不确定或需要核对的信息
4. 输出为表格

资料如下：
【粘贴内容】`,
      variables: '资料内容、总结条数、输出字段。',
      advice: '如果资料很长，可以分段输入，并让 AI 先总结每一段，再做总总结。'
    },
    {
      name: '生成初稿模板',
      scenario: `需要先得到一版 ${profile.firstResult} 时使用。`,
      prompt: `请帮我生成一份【类型】初稿，主题是【主题】。
目标读者是【读者】。
希望风格是【风格】。
请按照以下结构输出：
1. 标题
2. 核心内容
3. 具体步骤
4. 注意事项
5. 可继续优化的方向

要求：不要空泛表达，尽量给出具体例子。`,
      variables: '类型、主题、读者、风格、结构。',
      advice: '把“初稿”当作起点，后面还要继续追问和人工修改。'
    },
    {
      name: '追问优化模板',
      scenario: '第一次回答不满意，需要继续优化。',
      prompt: `请基于刚才的回答继续优化：
1. 哪些地方太空泛，请补充具体例子
2. 哪些地方可以更简洁，请压缩
3. 哪些地方可能不准确，请标出来
4. 请给出一个更适合直接使用的版本`,
      variables: '优化方向、目标平台、语气、长度。',
      advice: '每次追问只改 1 到 2 个方向，效果通常比一次改很多更稳定。'
    },
    {
      name: '输出检查模板',
      scenario: '检查 AI 的回答是否可靠，特别适合事实、数据、方案类内容。',
      prompt: `请检查你刚才的回答：
1. 哪些内容是事实判断
2. 哪些内容需要进一步核对
3. 哪些结论可能存在不确定性
4. 有没有遗漏重要前提
5. 请给出一个更谨慎、更适合正式使用的版本`,
      variables: '检查标准、使用场景、风险等级。',
      advice: '涉及价格、政策、医疗、法律、金融或工程上线时，必须人工核对。'
    }
  ];
}

function chatgptPromptTemplates() {
  return [
    {
      name: '基础提问模板',
      scenario: '第一次向 ChatGPT 提问，不知道如何组织需求时使用。',
      prompt: `请你作为【角色】，帮我完成【任务】。
背景信息是：【补充背景】。
输出要求：
1. 用【格式】呈现
2. 语言风格【正式 / 简洁 / 口语化 / 专业】
3. 控制在【字数或长度】
4. 如果信息不足，请先向我提问，不要直接编造`,
      variables: '角色、任务、背景、格式、风格、字数。',
      advice: '第一次提问时，至少填写任务、背景和输出格式。'
    },
    {
      name: '总结资料模板',
      scenario: '会议记录、文章段落、网页内容、学习资料。',
      prompt: `请帮我总结下面这段内容，要求：
1. 用 5 条以内说明核心观点
2. 单独列出行动项
3. 标出不确定或需要核对的信息
4. 输出为表格

资料如下：
【粘贴内容】`,
      variables: '资料内容、总结条数、行动项字段。',
      advice: '如果资料很长，可以分段输入，并让 ChatGPT 先总结每一段，再做总总结。'
    },
    {
      name: '写作初稿模板',
      scenario: '文章、公众号、短视频脚本、邮件、方案初稿。',
      prompt: `请帮我写一篇【类型】初稿，主题是【主题】。
目标读者是【读者】。
希望风格是【风格】。
请按照以下结构输出：
1. 标题
2. 开头
3. 主要内容
4. 结尾
5. 可继续优化的方向

要求：
不要空泛表达，尽量给出具体例子。`,
      variables: '类型、主题、读者、风格、结构。',
      advice: '适合先拿到一版草稿，再用追问调整语气和结构。'
    },
    {
      name: '改写润色模板',
      scenario: '优化已有文字，让表达更清楚、更专业或更口语化。',
      prompt: `请帮我润色下面这段文字，要求：
1. 保留原意
2. 让表达更清晰
3. 删除重复和啰嗦内容
4. 风格改成【正式 / 自然 / 口语化 / 专业】
5. 最后说明你改了哪些地方

原文如下：
【粘贴原文】`,
      variables: '原文、风格、长度、目标读者。',
      advice: '正式场景建议保留“说明你改了哪些地方”，便于人工审核。'
    },
    {
      name: '追问优化模板',
      scenario: '第一次回答不满意，需要继续优化。',
      prompt: `请基于刚才的回答继续优化：
1. 哪些地方太空泛，请补充具体例子
2. 哪些地方可以更简洁，请压缩
3. 哪些地方可能不准确，请标出来
4. 请给出一个更适合直接使用的版本`,
      variables: '优化方向、目标平台、语气、长度。',
      advice: '把“更简洁”“更正式”“补例子”拆开追问，效果更稳定。'
    },
    {
      name: '输出检查模板',
      scenario: '检查 ChatGPT 的回答是否可靠，特别适合事实、数据、方案类内容。',
      prompt: `请检查你刚才的回答：
1. 哪些内容是事实判断
2. 哪些内容需要进一步核对
3. 哪些结论可能存在不确定性
4. 有没有遗漏重要前提
5. 请给出一个更谨慎、更适合正式使用的版本`,
      variables: '检查标准、使用场景、风险等级。',
      advice: '涉及事实、数字、价格、政策、法律、医疗、金融时，不要跳过人工核对。'
    }
  ];
}

function buildMistakes() {
  return [
    ['只输入一句很泛的问题', 'AI 不知道目标、受众和输出格式，容易给出空泛回答。', '补充任务目标、背景信息和格式要求。'],
    ['不给背景信息', '缺少上下文会让结果偏离真实需求。', '说明使用场景、材料来源、读者和限制条件。'],
    ['不指定输出格式', '结果可能变成散乱段落，不方便复制使用。', '提前要求表格、清单、步骤、文章或脚本格式。'],
    ['一次要求完成太多目标', '任务过大时容易遗漏细节，也很难判断哪里出错。', '把任务拆成准备、生成、追问、检查几个步骤。'],
    ['直接复制结果不核对', '事实、数字、引用和专业结论可能存在错误。', '正式使用前检查来源、日期、数据和关键判断。'],
    ['不继续追问', '第一次回答通常只是草稿。', '继续要求更简洁、更具体、更正式或改成其它格式。'],
    ['把 AI 当作权威结论来源', 'AI 可以辅助整理，但不能替代专业判断。', '高风险内容必须结合官方来源和专业人士确认。']
  ];
}

function buildCompletionChecks() {
  return [
    '我是否能说清楚任务目标',
    '我是否能补充必要背景',
    '我是否能指定输出格式',
    '我是否知道如何继续追问',
    '我是否保存了可复用提示词',
    '我是否检查了事实、数字、政策或专业结论',
    '我是否知道哪些内容不能直接照搬',
    '我是否能把结果整理到自己的工作文档中'
  ];
}

function buildNextLearning(guide, profile, nextGuides) {
  if (guide.slug === 'chatgpt-beginner-guide') {
    return {
      beginner: ['学会写更清楚的提示词', '学会让 ChatGPT 总结长文档', '学会用 ChatGPT 写邮件、周报和方案'],
      advanced: ['ChatGPT 写作工作流', 'ChatGPT 办公自动化', 'ChatGPT 资料整理方法', 'ChatGPT 与 Claude / Gemini / Kimi 的区别'],
      recommendations: nextGuides
    };
  }

  return {
    beginner: [
      `继续练习 ${profile.label} 的基础提示词`,
      `把本篇模板应用到第二个真实任务`,
      '建立一个自己的提示词和结果检查文档'
    ],
    advanced: [
      `${profile.label} 与其它工具的差异`,
      '如何把输出接入日常工作流',
      '如何做来源、版权、事实和质量检查'
    ],
    recommendations: nextGuides
  };
}

function getNextGuides(guide) {
  return guides
    .filter((item) => item.slug !== guide.slug)
    .slice(0, 3);
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const category = getCategory(guide.categorySlug);
  const tool = getGuideTool(guide);
  const profile = getProfile(guide.categorySlug);
  const draft = guide.tutorialDraft || {};
  const title = normalizeTitle(guide);
  const description = guide.slug === 'chatgpt-beginner-guide'
    ? '面向第一次使用 ChatGPT 的新手，从账号准备、第一次提问、追问优化、提示词模板到结果检查，完成一套可复用的基础使用流程。'
    : `面向新手整理「${title}」的准备工作、核心方法、跟做步骤、提示词模板和结果检查，帮助你完成一个可复用的 ${profile.label} 工作流。`;
  const nextGuides = getNextGuides(guide);
  const overview = buildOverview(guide, tool, profile);
  const audience = buildAudience(guide, profile);
  const outcomes = buildOutcomes(guide, draft, profile);
  const prepItems = buildPrep(guide, profile);
  const method = buildMethod(profile);
  const steps = buildSteps(guide, draft, profile);
  const promptTemplates = guide.slug === 'chatgpt-beginner-guide'
    ? chatgptPromptTemplates()
    : basePromptTemplates(profile);
  const mistakes = buildMistakes();
  const completionChecks = buildCompletionChecks();
  const nextLearning = buildNextLearning(guide, profile, nextGuides);
  const guideContext = getGuideContext(guide);

  return (
    <article className="guide-detail-page">
      <JsonLd data={breadcrumbJsonLd([
        { name: '首页', href: '/' },
        { name: '教程', href: '/guides' },
        {
          name: guideContext.category.name,
          href: `/guides/category/${guideContext.category.slug}`
        },
        { name: guide.title, href: `/guides/${guide.slug}` }
      ])} />
      <JsonLd data={articleJsonLd(guide, `/guides/${guide.slug}`)} />
      <JsonLd data={faqJsonLd(guide.faq)} />

      <div className="guide-detail-layout">
        <main className="guide-main">
          <header className="guide-hero guide-doc-header">
            <div className="guide-kicker">
              <span className="section-accent-dots" aria-hidden="true">
                <span className="section-dot section-dot-purple" />
                <span className="section-dot section-dot-yellow" />
                <span className="section-dot section-dot-cyan" />
              </span>
              <span className="section-eyebrow">{category?.name || 'AI 教程'}</span>
            </div>
            <h1 className="guide-title">{title}</h1>
            <p className="guide-description">{description}</p>
            {guide.slug === 'claude-long-doc-writing-summary' ? (
              <Link href="/videos/claude-user-fit-video" className="guide-video-entry">
                <span>配套视频</span>
                <strong>Claude 适合哪些人使用</strong>
                <small>先看短视频，再跟着本页做长文档、写作和总结练习</small>
              </Link>
            ) : null}
            <div className="guide-meta-row" aria-label="教程信息">
              <span>作者：{guide.author}</span>
              <span>审核：{guide.reviewer}</span>
              <span>更新：{guide.updatedAt}</span>
              <span>{guide.readTime}</span>
              <span>{category?.name || 'AI 教程'}</span>
              <span>难度：{levelLabels[guide.level] || guide.level}</span>
            </div>
          </header>

          <article className="guide-doc-content">
            <section className="guide-section" id="overview">
              <p className="guide-section-kicker">Overview</p>
              <h2>教程概览</h2>
              {overview.map((item) => <p key={item}>{item}</p>)}
            </section>

            <section className="guide-section" id="audience">
              <p className="guide-section-kicker">Audience</p>
              <h2>适合谁阅读</h2>
              <div className="tutorial-compare-grid">
                <div>
                  <h3>适合阅读</h3>
                  <ul className="tutorial-checklist">
                    {audience.fit.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3>不太适合</h3>
                  <ul className="tutorial-muted-list">
                    {audience.notFit.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section className="guide-section" id="outcomes">
              <p className="guide-section-kicker">Outcome</p>
              <h2>本篇你会完成什么</h2>
              <ul className="tutorial-checklist">
                {outcomes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="guide-section" id="prep">
              <p className="guide-section-kicker">Before you start</p>
              <h2>准备工作</h2>
              <ul className="guide-simple-list">
                {prepItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="tutorial-callout">
                第一次练习不要选择太复杂的任务。建议从“总结一段文字”“改写一封邮件”“整理一个小清单”开始，任务越具体，输出越容易判断好坏。
              </div>
            </section>

            <section className="guide-section" id="method">
              <p className="guide-section-kicker">Method</p>
              <h2>核心方法</h2>
              <p>清晰提示词 = 任务目标 + 背景信息 + 输出格式 + 风格要求 + 限制条件。</p>
              <table className="tutorial-table">
                <tbody>
                  {method.formula.map(([name, detail]) => (
                    <tr key={name}>
                      <th>{name}</th>
                      <td>{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="prompt-template-card prompt-template-card-compact">
                <div className="prompt-template-card-header">
                  <h3>普通提问</h3>
                </div>
                <pre className="prompt-template-body">{method.weakPrompt}</pre>
              </div>
              <div className="prompt-template-card">
                <div className="prompt-template-card-header">
                  <h3>更好的提问</h3>
                </div>
                <pre className="prompt-template-body">{method.strongPrompt}</pre>
              </div>
              <ul className="tutorial-checklist tutorial-compact-list">
                {method.why.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="guide-section" id="steps">
              <p className="guide-section-kicker">Follow along</p>
              <h2>跟做步骤</h2>
              <div className="guide-step-list">
                {steps.map((step, index) => (
                  <section key={step.title} className="tutorial-step">
                    <h3>Step {index + 1}. {step.title}</h3>
                    <p>{step.text}</p>
                    <dl className="tutorial-step-detail">
                      <div>
                        <dt>为什么要做</dt>
                        <dd>{step.why}</dd>
                      </div>
                      <div>
                        <dt>操作说明</dt>
                        <dd>{step.instruction}</dd>
                      </div>
                    </dl>
                    <div className="prompt-template-card">
                      <div className="prompt-template-card-header">
                        <h4>可复制示例提示词</h4>
                        <button type="button" aria-label={`复制第 ${index + 1} 步提示词`}>复制</button>
                      </div>
                      <pre className="prompt-template-body">{step.prompt}</pre>
                    </div>
                    <dl className="tutorial-step-detail">
                      <div>
                        <dt>预期结果</dt>
                        <dd>{step.expected}</dd>
                      </div>
                      <div>
                        <dt>如果结果不好，继续追问</dt>
                        <dd>{step.followUp}</dd>
                      </div>
                    </dl>
                    <p className="guide-step-note">完成本步后，建议记录输入内容、生成结果和需要继续追问的地方。</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="guide-section" id="prompts">
              <p className="guide-section-kicker">Prompt templates</p>
              <h2>提示词模板</h2>
              <p>下面的模板可以直接复制，但建议先替换【变量】里的内容，再根据你的任务继续追问。</p>
              {/* className="prompt-block" remains supported for legacy guide prompt examples. */}
              <div className="guide-prompt-stack">
                {promptTemplates.map((template) => (
                  <section key={template.name} className="prompt-template-card">
                    <div className="prompt-template-card-header">
                      <h3>{template.name}</h3>
                      <button type="button" aria-label={`复制${template.name}`}>复制</button>
                    </div>
                    <p className="prompt-template-meta"><strong>适用场景：</strong>{template.scenario}</p>
                    <pre className="prompt-template-body">{template.prompt}</pre>
                    <p className="prompt-template-meta"><strong>可替换变量：</strong>{template.variables}</p>
                    <p className="prompt-template-meta"><strong>使用建议：</strong>{template.advice}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="guide-section" id="mistakes">
              <p className="guide-section-kicker">Common mistakes</p>
              <h2>常见错误</h2>
              <table className="tutorial-table tutorial-mistake-table">
                <thead>
                  <tr>
                    <th>常见错误</th>
                    <th>为什么有问题</th>
                    <th>怎么改</th>
                  </tr>
                </thead>
                <tbody>
                  {mistakes.map(([mistake, reason, fix]) => (
                    <tr key={mistake}>
                      <td>{mistake}</td>
                      <td>{reason}</td>
                      <td>{fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="guide-section" id="check">
              <p className="guide-section-kicker">Final check</p>
              <h2>完成检查</h2>
              <ul className="tutorial-checklist">
                {completionChecks.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="guide-section" id="faq">
              <p className="guide-section-kicker">FAQ</p>
              <h2>常见问题</h2>
              <div className="next-learning-list">
                {guide.faq.map((item) => (
                  <section key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </section>
                ))}
              </div>
            </section>

            <section className="guide-section" id="next">
              <p className="guide-section-kicker">Next learning</p>
              <h2>下一步学习</h2>
              <div className="next-learning-list">
                <section>
                  <h3>新手下一步</h3>
                  <ul>
                    {nextLearning.beginner.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
                <section>
                  <h3>进阶方向</h3>
                  <ul>
                    {nextLearning.advanced.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
              </div>
            </section>

            <GuideRelatedContent {...guideContext} />
          </article>
        </main>

        <aside className="guide-toc" aria-label="教程目录">
          <p>本篇目录</p>
          <nav>
            {tocItems.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
        </aside>
      </div>
    </article>
  );
}
