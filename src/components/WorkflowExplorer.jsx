'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const workflowCopy = {
  'ai-assistant': {
    icon: 'AI',
    title: 'AI助手',
    description: '聊天、写作、问答、总结和日常效率入口。',
    steps: ['输入你的目标', '选择适合的工具', '生成初稿或答案', '检查结果并继续追问'],
    tools: ['ChatGPT', 'Claude', 'DeepSeek', 'Kimi']
  },
  'ai-search': {
    icon: '搜',
    title: 'AI搜索工具',
    description: '资料搜索、引用整理、结论核查。',
    steps: ['写清楚检索问题', '限定时间和范围', '比对来源与结论', '整理成可引用笔记'],
    tools: ['Perplexity', 'Gemini', 'Kimi', '腾讯元宝']
  },
  'ai-writing': {
    icon: '写',
    title: 'AI写作工具',
    description: '标题、大纲、文章、邮件草稿。',
    steps: ['明确读者和语气', '生成结构大纲', '扩写重点段落', '润色并核查事实'],
    tools: ['Claude', 'ChatGPT', 'DeepSeek', 'Notion AI']
  },
  'ai-image': {
    icon: '图',
    title: 'AI图片工具',
    description: '封面、商品图、海报素材。',
    steps: ['描述主体和风格', '指定比例与场景', '生成多版方向', '挑选后继续微调'],
    tools: ['Midjourney', '通义万相', '即梦AI', 'Canva AI']
  },
  'ai-video': {
    icon: '影',
    title: 'AI视频工具',
    description: '脚本、分镜、生成、剪辑。',
    steps: ['写清视频目标', '拆成镜头脚本', '生成或补齐素材', '剪辑字幕后发布'],
    tools: ['Runway', '可灵AI', '即梦AI', '剪映AI']
  },
  'ai-office': {
    icon: '办',
    title: 'AI办公工具',
    description: '文档、表格、PPT、会议整理。',
    steps: ['整理输入材料', '生成文档草稿', '转成表格或演示', '补充结论与待办'],
    tools: ['Microsoft Copilot', 'Notion AI', '通义千问', 'Canva AI']
  },
  'ai-coding': {
    icon: '码',
    title: 'AI编程工具',
    description: '代码生成、项目阅读、错误排查。',
    steps: ['描述功能目标', '定位相关文件', '生成最小改动', '运行测试并修正'],
    tools: ['Cursor', 'GitHub Copilot', 'Claude Code', 'ChatGPT']
  },
  'ai-design': {
    icon: '设',
    title: 'AI设计工具',
    description: '海报、PPT、社媒视觉、品牌素材。',
    steps: ['确定版式目标', '选择模板或风格', '生成视觉方案', '统一品牌和导出'],
    tools: ['Canva AI', 'Midjourney', '通义万相', 'Figma']
  },
  'ai-voice': {
    icon: '音',
    title: 'AI配音工具',
    description: '旁白、播客、课程、多语言音频。',
    steps: ['准备脚本文案', '选择音色和语速', '生成试听版本', '剪辑降噪后发布'],
    tools: ['ElevenLabs', '讯飞星火', '剪映AI', 'MiniMax']
  }
};

const workflowIconBySlug = {
  'ai-assistant': 'message',
  'ai-search': 'search',
  'ai-writing': 'pen',
  'ai-image': 'image',
  'ai-video': 'clapperboard',
  'ai-office': 'layout',
  'ai-coding': 'code',
  'ai-design': 'penTool',
  'ai-voice': 'mic'
};

function WorkflowIcon({ name }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true'
  };

  switch (name) {
    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case 'pen':
      return (
        <svg {...iconProps}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );
    case 'image':
      return (
        <svg {...iconProps}>
          <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
          <circle cx="8.5" cy="9.5" r="1.4" />
          <path d="m5.5 17 4.2-4.2 3.2 3.2 2.2-2.2L19 17" />
        </svg>
      );
    case 'clapperboard':
      return (
        <svg {...iconProps}>
          <path d="M4 9h16" />
          <path d="M6.5 4 9 9" />
          <path d="M12 4l2.5 5" />
          <path d="M17.5 4 20 9" />
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
        </svg>
      );
    case 'layout':
      return (
        <svg {...iconProps}>
          <rect x="4" y="4" width="7" height="7" rx="1.8" />
          <rect x="13" y="4" width="7" height="7" rx="1.8" />
          <rect x="4" y="13" width="7" height="7" rx="1.8" />
          <rect x="13" y="13" width="7" height="7" rx="1.8" />
        </svg>
      );
    case 'code':
      return (
        <svg {...iconProps}>
          <path d="m8 8-4 4 4 4" />
          <path d="m16 8 4 4-4 4" />
          <path d="m14 5-4 14" />
        </svg>
      );
    case 'penTool':
      return (
        <svg {...iconProps}>
          <path d="M12 3 4.5 10.5 12 21l7.5-10.5Z" />
          <path d="M12 3v6" />
          <circle cx="12" cy="10.5" r="1.7" />
        </svg>
      );
    case 'mic':
      return (
        <svg {...iconProps}>
          <rect x="9" y="3.5" width="6" height="10" rx="3" />
          <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
          <path d="M12 18v3" />
          <path d="M9 21h6" />
        </svg>
      );
    case 'message':
    default:
      return (
        <svg {...iconProps}>
          <path d="M20 11.5a7.4 7.4 0 0 1-7.7 7.2 8.5 8.5 0 0 1-3.2-.7L4 19.5l1.5-4.4a7.1 7.1 0 0 1-.8-3.4A7.4 7.4 0 0 1 12.4 4 7.4 7.4 0 0 1 20 11.5Z" />
          <path d="M8.5 11h7" />
          <path d="M8.5 14h4.5" />
        </svg>
      );
  }
}

function buildWorkflowItem(category) {
  const copy = workflowCopy[category.slug] || {};

  return {
    slug: category.slug,
    href: `/categories/${category.slug}`,
    icon: copy.icon || category.icon || 'AI',
    iconName: workflowIconBySlug[category.slug] || 'message',
    title: copy.title || category.name,
    description: copy.description || category.shortDescription || category.description,
    steps: copy.steps || ['明确任务目标', '选择合适工具', '生成第一版结果', '检查并继续优化'],
    tools: copy.tools || []
  };
}

export function WorkflowExplorer({ categories }) {
  const workflowItems = useMemo(() => categories.map(buildWorkflowItem), [categories]);
  const [activeSlug, setActiveSlug] = useState('ai-assistant');

  const activeItem =
    workflowItems.find((item) => item.slug === activeSlug) ||
    workflowItems[0] ||
    buildWorkflowItem({ slug: 'ai-assistant' });
  const taskItems = workflowItems.filter((item) => item.slug !== 'ai-assistant').slice(0, 8);

  return (
    <div className="workflow-grid">
      <article className="workflow-main-card" aria-live="polite">
        <div key={activeItem.slug} className="workflow-main-content">
          <div className="workflow-main-topline">
            <span className="workflow-main-icon">
              <WorkflowIcon name={activeItem.iconName} />
            </span>
            <span className="workflow-main-label">Selected Workflow</span>
          </div>

          <div className="workflow-main-heading">
            <h3>{activeItem.title}</h3>
            <p>{activeItem.description}</p>
          </div>

          <div className="workflow-process" aria-label={`${activeItem.title} 推荐流程`}>
            <span className="workflow-section-label">推荐流程</span>
            <ol>
              {activeItem.steps.slice(0, 4).map((step, index) => (
                <li key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="workflow-tool-strip" aria-label={`${activeItem.title} 推荐工具`}>
            <span className="workflow-section-label">推荐工具</span>
            <div>
              {activeItem.tools.slice(0, 4).map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>

          <Link href={activeItem.href} className="workflow-action magnetic-button">
            <span>进入工作流</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>

      <div className="workflow-task-grid" aria-label="选择 AI 工作流任务">
        {taskItems.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            className={`workflow-task-card${activeSlug === item.slug ? ' is-active' : ''}`}
            onClick={() => setActiveSlug(item.slug)}
            aria-pressed={activeSlug === item.slug}
          >
            <span className="workflow-task-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="workflow-task-icon">
              <WorkflowIcon name={item.iconName} />
            </span>
            <span className="workflow-task-title">{item.title}</span>
            <span className="workflow-task-description">{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
