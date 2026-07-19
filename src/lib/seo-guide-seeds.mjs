const CONTENT_DATE = '2026-07-19';

const categoryBatches = [
  {
    categorySlug: 'ai-assistant',
    relatedVideosSlugs: ['chatgpt-3min-guide', 'claude-user-fit-video', 'gemini-vs-chatgpt-video'],
    relatedComparisonsSlugs: ['chatgpt-vs-claude', 'gemini-vs-chatgpt'],
    guides: [
      {
        slug: 'chatgpt-efficient-questioning-guide',
        title: 'ChatGPT高效提问教程：从模糊问题到可用答案',
        summary: '学习补充背景、限定任务和指定输出格式，让 ChatGPT 的回答更容易核查和继续修改。',
        toolSlug: 'chatgpt',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'ChatGPT高效提问教程',
        relatedToolsSlugs: ['chatgpt', 'claude', 'gemini']
      },
      {
        slug: 'ai-assistant-meeting-summary-guide',
        title: 'AI助手整理会议纪要教程：结论、待办与负责人',
        summary: '把原始会议记录整理为结论、待办、负责人和截止时间，并保留人工核查步骤。',
        toolSlug: 'claude',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI整理会议纪要',
        relatedToolsSlugs: ['claude', 'chatgpt', 'microsoft-copilot']
      },
      {
        slug: 'ai-assistant-study-plan-guide',
        title: '用AI助手制定学习计划：目标拆解与复盘方法',
        summary: '根据学习目标、可用时间和当前基础生成阶段计划，再用固定问题完成每周复盘。',
        toolSlug: 'gemini',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI制定学习计划',
        relatedToolsSlugs: ['gemini', 'chatgpt', 'deepseek']
      }
    ]
  },
  {
    categorySlug: 'ai-writing',
    relatedVideosSlugs: ['claude-user-fit-video', 'chatgpt-3min-guide', 'kimi-long-doc-video'],
    relatedComparisonsSlugs: ['chatgpt-vs-claude', 'kimi-vs-claude-long-doc'],
    guides: [
      {
        slug: 'ai-writing-outline-guide',
        title: 'AI写作大纲教程：从选题到文章结构',
        summary: '先明确读者和写作目标，再用 AI 生成、筛选并细化文章大纲，避免直接生成空泛初稿。',
        toolSlug: 'chatgpt',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI写作大纲教程',
        relatedToolsSlugs: ['chatgpt', 'claude', 'doubao']
      },
      {
        slug: 'ai-writing-polish-guide',
        title: 'AI文章润色教程：保留原意并改善表达',
        summary: '通过限定语气、读者和修改范围，让 AI 分步骤润色文章并说明主要改动。',
        toolSlug: 'claude',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI文章润色',
        relatedToolsSlugs: ['claude', 'chatgpt', 'doubao']
      },
      {
        slug: 'ai-writing-long-form-summary-guide',
        title: 'AI长文总结教程：提取观点、证据与行动项',
        summary: '把长文拆成观点、依据、风险和行动项，建立可回查原文的总结流程。',
        toolSlug: 'kimi',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI长文总结教程',
        relatedToolsSlugs: ['kimi', 'claude', 'chatgpt']
      }
    ]
  },
  {
    categorySlug: 'ai-image',
    relatedVideosSlugs: ['midjourney-image-video'],
    relatedComparisonsSlugs: ['midjourney-vs-tongyi-wanxiang'],
    guides: [
      {
        slug: 'ai-image-prompt-guide',
        title: 'AI图片提示词教程：主体、场景与风格怎么写',
        summary: '用主体、环境、构图、光线和用途五个要素组织图片提示词，并逐轮控制变量。',
        toolSlug: 'midjourney',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI图片提示词教程',
        relatedToolsSlugs: ['midjourney', 'tongyi-wanxiang', 'wenxin-yiyan']
      },
      {
        slug: 'ai-image-poster-guide',
        title: 'AI海报制作教程：从视觉方向到排版检查',
        summary: '先生成视觉方向和背景素材，再在设计工具中完成文字排版、尺寸适配和细节检查。',
        toolSlug: 'canva-ai',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI海报制作教程',
        relatedToolsSlugs: ['canva-ai', 'midjourney', 'tongyi-wanxiang']
      },
      {
        slug: 'ai-product-image-guide',
        title: 'AI商品图制作教程：背景生成与细节核查',
        summary: '围绕商品主体、展示场景和平台尺寸生成候选图，并重点检查文字、结构和品牌细节。',
        toolSlug: 'tongyi-wanxiang',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI商品图制作',
        relatedToolsSlugs: ['tongyi-wanxiang', 'midjourney', 'canva-ai']
      }
    ]
  },
  {
    categorySlug: 'ai-video',
    relatedVideosSlugs: ['runway-video-generation-video'],
    relatedComparisonsSlugs: ['runway-vs-kling-video'],
    guides: [
      {
        slug: 'ai-video-script-guide',
        title: 'AI视频脚本教程：主题、分镜与旁白结构',
        summary: '从受众和视频目标出发，整理开场、信息段落、镜头说明和结尾行动提示。',
        toolSlug: 'chatgpt',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI视频脚本教程',
        relatedToolsSlugs: ['chatgpt', 'runway', 'capcut-ai']
      },
      {
        slug: 'text-to-video-workflow-guide',
        title: '文生视频工作流教程：提示词、镜头与素材筛选',
        summary: '把复杂画面拆为短镜头，分别生成并筛选素材，再进入剪辑和声音处理环节。',
        toolSlug: 'runway',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: '文生视频教程',
        relatedToolsSlugs: ['runway', 'kling-ai', 'jimeng-ai']
      },
      {
        slug: 'ai-video-subtitle-guide',
        title: 'AI视频字幕教程：识别、校对与导出流程',
        summary: '完成语音识别、时间轴校准、专有名词检查和字幕导出，减少自动字幕中的常见错误。',
        toolSlug: 'capcut-ai',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI视频字幕教程',
        relatedToolsSlugs: ['capcut-ai', 'xunfei-xinghuo', 'runway']
      }
    ]
  },
  {
    categorySlug: 'ai-coding',
    relatedVideosSlugs: ['cursor-ai-coding-video'],
    relatedComparisonsSlugs: ['cursor-vs-claude-code'],
    guides: [
      {
        slug: 'ai-codebase-reading-guide',
        title: 'AI阅读代码库教程：先理解结构再修改代码',
        summary: '让 AI 先定位入口、数据流和关键文件，再给出修改计划，避免直接跨文件重构。',
        toolSlug: 'cursor',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI阅读代码库',
        relatedToolsSlugs: ['cursor', 'claude-code', 'github-copilot']
      },
      {
        slug: 'ai-debugging-workflow-guide',
        title: 'AI辅助排查报错教程：日志、假设与最小修复',
        summary: '收集报错和复现步骤，让 AI 按可能性提出假设，并用最小改动逐项验证。',
        toolSlug: 'claude-code',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI辅助排查报错',
        relatedToolsSlugs: ['claude-code', 'cursor', 'chatgpt']
      },
      {
        slug: 'ai-feature-development-guide',
        title: 'AI开发小功能教程：需求拆解、实现与测试',
        summary: '把功能需求拆成可验证步骤，约束修改范围，并在每次改动后检查 diff 和测试结果。',
        toolSlug: 'github-copilot',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI开发功能教程',
        relatedToolsSlugs: ['github-copilot', 'cursor', 'claude-code']
      }
    ]
  },
  {
    categorySlug: 'ai-search',
    relatedVideosSlugs: ['perplexity-research-video', 'kimi-long-doc-video'],
    relatedComparisonsSlugs: ['perplexity-vs-google-search', 'kimi-vs-claude-long-doc'],
    guides: [
      {
        slug: 'ai-search-source-check-guide',
        title: 'AI搜索来源核查教程：从答案回到原始资料',
        summary: '检查引用是否支持结论，区分原始来源和二次转述，并记录仍需人工确认的信息。',
        toolSlug: 'perplexity',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI搜索来源核查',
        relatedToolsSlugs: ['perplexity', 'gemini', 'chatgpt']
      },
      {
        slug: 'ai-research-report-guide',
        title: 'AI调研报告教程：问题拆解、检索与结论整理',
        summary: '将调研主题拆成子问题，分别查找资料、记录来源，再汇总为带依据的结论。',
        toolSlug: 'perplexity',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI调研报告教程',
        relatedToolsSlugs: ['perplexity', 'gemini', 'claude']
      },
      {
        slug: 'ai-long-document-research-guide',
        title: 'AI长文档研究教程：摘要、问题与证据表',
        summary: '先建立文档问题清单，再提取原文证据、页码线索和待核查项，避免只保留摘要。',
        toolSlug: 'kimi',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI长文档研究',
        relatedToolsSlugs: ['kimi', 'claude', 'gemini']
      }
    ]
  },
  {
    categorySlug: 'ai-office',
    relatedVideosSlugs: ['chatgpt-3min-guide', 'gemini-vs-chatgpt-video', 'claude-user-fit-video'],
    relatedComparisonsSlugs: ['gemini-vs-chatgpt', 'chatgpt-vs-claude'],
    guides: [
      {
        slug: 'ai-meeting-minutes-office-guide',
        title: 'AI办公会议纪要教程：记录整理与任务跟进',
        summary: '把会议原始记录转换为结论、任务和风险清单，并建立会后确认与跟进流程。',
        toolSlug: 'microsoft-copilot',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI办公会议纪要',
        relatedToolsSlugs: ['microsoft-copilot', 'notion-ai', 'chatgpt']
      },
      {
        slug: 'ai-presentation-outline-guide',
        title: 'AI生成PPT大纲教程：受众、结构与页面要点',
        summary: '先定义演示对象和目标，再生成页级大纲、证据需求和视觉提示，最后人工调整节奏。',
        toolSlug: 'canva-ai',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI生成PPT大纲',
        relatedToolsSlugs: ['canva-ai', 'microsoft-copilot', 'chatgpt']
      },
      {
        slug: 'ai-spreadsheet-analysis-guide',
        title: 'AI表格分析教程：问题定义、公式与结果复核',
        summary: '在不暴露敏感信息的前提下描述表格结构，让 AI 辅助编写公式并逐项复核结果。',
        toolSlug: 'microsoft-copilot',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: 'AI表格分析教程',
        relatedToolsSlugs: ['microsoft-copilot', 'chatgpt', 'gemini']
      }
    ]
  },
  {
    categorySlug: 'domestic-ai',
    relatedVideosSlugs: ['deepseek-beginner-video', 'kimi-long-doc-video'],
    relatedComparisonsSlugs: ['deepseek-vs-chatgpt-chinese', 'kimi-vs-claude-long-doc'],
    guides: [
      {
        slug: 'domestic-ai-beginner-guide',
        title: '国产AI工具入门教程：从中文问答开始',
        summary: '从中文提问、资料整理和结果核查三个基础任务开始了解国产 AI 工具的使用方法。',
        toolSlug: 'deepseek',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: '国产AI工具入门',
        relatedToolsSlugs: ['deepseek', 'kimi', 'doubao']
      },
      {
        slug: 'domestic-ai-writing-guide',
        title: '国产AI中文写作教程：大纲、初稿与润色',
        summary: '围绕中文内容场景完成大纲、初稿和润色，并用事实清单检查生成结果。',
        toolSlug: 'doubao',
        level: 'beginner',
        searchIntent: 'informational-how-to',
        primaryKeyword: '国产AI中文写作',
        relatedToolsSlugs: ['doubao', 'tongyi-qianwen', 'deepseek']
      },
      {
        slug: 'domestic-ai-research-guide',
        title: '国产AI资料整理教程：长文阅读与信息归纳',
        summary: '将中文长文拆分为主题、观点、依据和行动项，并保留原文核查入口。',
        toolSlug: 'kimi',
        level: 'intermediate',
        searchIntent: 'informational-how-to',
        primaryKeyword: '国产AI资料整理',
        relatedToolsSlugs: ['kimi', 'tencent-yuanbao', 'tongyi-qianwen']
      }
    ]
  },
  {
    categorySlug: 'ai-tool-selection',
    relatedVideosSlugs: ['chatgpt-3min-guide', 'claude-user-fit-video', 'midjourney-image-video'],
    relatedComparisonsSlugs: ['chatgpt-vs-claude', 'gemini-vs-chatgpt', 'midjourney-vs-tongyi-wanxiang'],
    guides: [
      {
        slug: 'choose-ai-assistant-guide',
        title: 'AI助手怎么选：按问答、长文与办公场景比较',
        summary: '根据主要任务、资料类型、使用门槛和核查需求建立 AI 助手选择清单。',
        toolSlug: 'chatgpt',
        level: 'beginner',
        searchIntent: 'commercial-investigation',
        primaryKeyword: 'AI助手怎么选',
        relatedToolsSlugs: ['chatgpt', 'claude', 'gemini', 'deepseek']
      },
      {
        slug: 'choose-ai-writing-tool-guide',
        title: 'AI写作工具怎么选：短文、长文与中文润色',
        summary: '用同一份写作任务比较大纲、初稿、长文处理和中文润色效果，记录适用边界。',
        toolSlug: 'claude',
        level: 'beginner',
        searchIntent: 'commercial-investigation',
        primaryKeyword: 'AI写作工具怎么选',
        relatedToolsSlugs: ['claude', 'chatgpt', 'doubao', 'kimi']
      },
      {
        slug: 'choose-ai-creative-tool-guide',
        title: 'AI创作工具怎么选：图片、视频与设计工作流',
        summary: '先按交付物选择图片、视频或设计工具，再比较素材控制、编辑流程和人工处理成本。',
        toolSlug: 'midjourney',
        level: 'beginner',
        searchIntent: 'commercial-investigation',
        primaryKeyword: 'AI创作工具怎么选',
        relatedToolsSlugs: ['midjourney', 'runway', 'canva-ai', 'tongyi-wanxiang']
      }
    ]
  }
];

function buildFaq(guide) {
  return [
    {
      question: `${guide.title}适合零基础用户吗？`,
      answer: guide.level === 'beginner'
        ? '适合。建议先用一项真实小任务完成完整流程，再逐步增加资料量和输出要求。'
        : '建议先掌握对应工具的基础操作，再按教程中的核查步骤完成一次真实任务。'
    },
    {
      question: 'AI生成的结果可以直接使用吗？',
      answer: '不建议直接使用。事实、引用、数据、代码和版权相关内容都需要结合原始资料与实际环境复核。'
    }
  ];
}

export const seoGuideSeeds = categoryBatches.flatMap((batch) => {
  const peerSlugs = batch.guides.map((guide) => guide.slug);

  return batch.guides.map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    summary: guide.summary,
    categorySlug: batch.categorySlug,
    toolSlug: guide.toolSlug,
    level: guide.level,
    searchIntent: guide.searchIntent,
    primaryKeyword: guide.primaryKeyword,
    publishedAt: CONTENT_DATE,
    updatedAt: CONTENT_DATE,
    faq: buildFaq(guide),
    relatedToolsSlugs: guide.relatedToolsSlugs,
    relatedGuidesSlugs: peerSlugs.filter((slug) => slug !== guide.slug),
    relatedVideosSlugs: batch.relatedVideosSlugs,
    relatedComparisonsSlugs: batch.relatedComparisonsSlugs
  }));
});
