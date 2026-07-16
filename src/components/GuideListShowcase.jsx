'use client';

import Link from 'next/link';
import { getCategory } from '../lib/site-data.mjs';
import { useToast } from './Toast.tsx';

const groupDefinitions = [
  {
    id: 'assistant',
    title: 'AI助手',
    description: '先掌握通用问答、追问和资料理解，适合作为所有 AI 学习的入口。',
    categories: ['ai-assistant', 'domestic-ai']
  },
  {
    id: 'writing',
    title: 'AI写作工具',
    description: '围绕标题、大纲、文章、邮件和内容改写，建立稳定写作流程。',
    categories: ['ai-writing']
  },
  {
    id: 'office',
    title: 'AI办公工具',
    description: '覆盖资料整理、知识库、Office 办公和日常效率任务。',
    categories: ['ai-office', 'ai-search']
  },
  {
    id: 'image',
    title: 'AI图片工具',
    description: '从提示词、风格控制到海报和商品图，完成视觉素材入门。',
    categories: ['ai-image', 'ai-design']
  },
  {
    id: 'video',
    title: 'AI视频工具',
    description: '学习脚本、分镜、生成、配音和剪辑，搭起短视频工作流。',
    categories: ['ai-video', 'ai-voice', 'ai-subtitle']
  },
  {
    id: 'coding',
    title: 'AI编程工具',
    description: '面向代码阅读、组件修改和项目开发，适合想把 AI 接入开发流程的人。',
    categories: ['ai-coding']
  }
];

const pathCard = {
  title: '新手先学这 4 个 AI 工具',
  description: '先完成通用问答、长文总结、资料理解和资料搜索，再进入图片、视频和办公工具。',
  tags: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
  href: '#assistant'
};

const categoryAccent = {
  'ai-assistant': 'assistant',
  'domestic-ai': 'assistant',
  'ai-writing': 'writing',
  'ai-office': 'office',
  'ai-search': 'search',
  'ai-image': 'image',
  'ai-design': 'image',
  'ai-video': 'video',
  'ai-voice': 'video',
  'ai-subtitle': 'video',
  'ai-coding': 'coding'
};

const guideBriefs = {
  'chatgpt-beginner-guide': '适合第一次接触 ChatGPT 的新手，从提问、追问到整理结果建立基础流程。',
  'claude-long-doc-writing-summary': '用一篇长文档练习总结、提纲和改写，适合处理报告和资料的人。',
  'gemini-google-ai-beginner': '快速理解 Gemini 的搜索、图片和 Google 生态能力，适合资料理解场景。',
  'perplexity-ai-search-research': '把搜索结果、引用来源和调研结论整理成一份可复用资料。',
  'deepseek-writing-code-qa': '用中文完成写作、问答和代码解释，适合从国产 AI 工具开始练习。',
  'kimi-long-document-summary': '围绕长文阅读和摘要提取，练习把大段资料变成清晰结论。',
  'midjourney-high-quality-image': '从画面目标、风格词和参数入手，生成更稳定的视觉素材。',
  'runway-ai-video-guide': '用短任务理解从提示词到镜头生成的 AI 视频基础流程。',
  'elevenlabs-ai-voice-guide': '学习选择声音、输入文本和导出旁白，适合播客和短视频配音。',
  'cursor-ai-coding-guide': '把一个小需求交给 Cursor，练习读代码、改组件和检查结果。'
};

function getGuideBrief(guide, variant) {
  if (guideBriefs[guide.slug]) return guideBriefs[guide.slug];
  if (variant === 'compact') return guide.outcome || guide.excerpt;
  return guide.tutorialDraft?.taskExample || guide.excerpt || guide.outcome;
}

function getGuideSkills(guide) {
  const source = [
    guide.tutorialDraft?.problemsSolved?.[0],
    guide.tutorialDraft?.firstUse?.[0],
    guide.outcome
  ].filter(Boolean);

  return source.slice(0, 2);
}

function GuideListCard({ guide, variant, index }) {
  const category = getCategory(guide.categorySlug);
  const { showToast, messages } = useToast();
  const accent = categoryAccent[guide.categorySlug] || 'assistant';
  const skills = getGuideSkills(guide);
  const brief = getGuideBrief(guide, variant);

  return (
    <article
      className={`guide-list-card guide-list-card-${variant} guide-list-accent-${accent}`}
      style={{ '--stagger-index': index }}
    >
      <div className="guide-list-card-head">
        <div className="guide-list-meta">
          <span>{category?.name || '教程'}</span>
          {variant !== 'compact' ? <span>{guide.readTime}</span> : null}
          {variant === 'featured' ? <span>{guide.updatedAt}</span> : null}
        </div>
        <span className="guide-list-type">{variant === 'featured' ? 'Featured' : variant === 'compact' ? 'Quick' : 'Guide'}</span>
      </div>

      <h2 className="guide-list-title">
        <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
      </h2>

      <p className="guide-list-brief">{brief}</p>

      {variant === 'compact' ? (
        <div className="guide-list-skill-tags" aria-label="学习结果">
          {(skills.length ? skills : [guide.outcome]).slice(0, 2).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : (
        <div className={`guide-list-outcome ${variant === 'featured' ? 'guide-list-outcome-featured' : ''}`}>
          <p>学完能做什么</p>
          <strong>{guide.outcome}</strong>
        </div>
      )}

      <div className="guide-list-actions">
        <Link href={`/guides/${guide.slug}`} className="guide-list-link">
          <span>查看教程</span>
          <span aria-hidden="true">→</span>
        </Link>
        <button type="button" onClick={() => showToast(messages.workflow)}>
          保存到工作流
        </button>
      </div>
    </article>
  );
}

function CollectionCard() {
  return (
    <article className="guide-list-card guide-list-collection-card">
      <p className="guide-list-type">Path</p>
      <h2>{pathCard.title}</h2>
      <p>{pathCard.description}</p>
      <div className="guide-list-path-tags">
        {pathCard.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <Link href={pathCard.href} className="guide-list-link">
        <span>进入学习路线</span>
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export function GuideListShowcase({ guides }) {
  const featuredGuides = guides.slice(0, 2);
  const featuredSlugs = new Set(featuredGuides.map((guide) => guide.slug));
  const remainingGuides = guides.filter((guide) => !featuredSlugs.has(guide.slug));
  const usedSlugs = new Set(featuredSlugs);

  const groups = groupDefinitions
    .map((group) => {
      const items = remainingGuides.filter((guide) => group.categories.includes(guide.categorySlug) && !usedSlugs.has(guide.slug));
      for (const item of items) usedSlugs.add(item.slug);
      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);

  const uncategorized = remainingGuides.filter((guide) => !usedSlugs.has(guide.slug));
  if (uncategorized.length) {
    groups.push({
      id: 'more',
      title: '更多实战教程',
      description: '补充不同任务里的实用教程，适合按需继续学习。',
      items: uncategorized
    });
  }

  return (
    <div className="guide-list-showcase">
      <section className="guide-list-featured-grid" aria-label="精选教程">
        {featuredGuides.map((guide, index) => (
          <GuideListCard key={guide.slug} guide={guide} variant="featured" index={index} />
        ))}
      </section>

      <section className="guide-list-path-row" aria-label="学习路线">
        <CollectionCard />
      </section>

      <div className="guide-list-groups">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="guide-list-group">
            <div className="guide-list-group-heading">
              <p>Learning Track</p>
              <h2>{group.title}</h2>
              <span>{group.description}</span>
            </div>
            <div className="guide-list-group-grid">
              {group.items.map((guide, index) => (
                <GuideListCard
                  key={guide.slug}
                  guide={guide}
                  variant={index % 3 === 0 ? 'standard' : 'compact'}
                  index={index}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
