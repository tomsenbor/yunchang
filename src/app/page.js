import Link from 'next/link';
import {
  categories,
  comparisons,
  creativeToolSlugs,
  getToolsBySlugs,
  globalToolSlugs,
  guides,
  homeHero,
  homeSeo,
  videos
} from '../lib/site-data.mjs';
import { GuideCard, Section, VideoCard } from '../components/Cards.jsx';
import { HomeToolGalleries } from '../components/HomeToolGalleries.tsx';
import { HomeHero } from '../components/HomeHero.jsx';
import { WorkflowExplorer } from '../components/WorkflowExplorer.jsx';
import { pageMetadata } from '../lib/seo.mjs';

export const metadata = pageMetadata({
  title: homeSeo.title,
  description: homeSeo.description,
  path: '/',
  appendSiteName: false
});

const homeGuideBriefs = [
  '从账号准备、界面入口到日常提问，先搭好 ChatGPT 的基础使用流程。',
  '用 Claude 处理长文档、改写段落和生成总结，适合资料量大的写作场景。',
  '了解 Gemini 在 Google 生态里的入口、搜索配合和多模态使用方式。',
  '用 Perplexity 快速查资料、保留来源，并把结果整理成可复用笔记。',
  '掌握 DeepSeek 的中文问答、写作和代码辅助，适合从零开始试用。',
  '用 Kimi 阅读长文档、追问细节，并输出清晰摘要和待办清单。',
  '用豆包生成小红书选题、标题和正文，快速搭建内容草稿。'
];

const homeGuideOutcomes = [
  '能独立完成一次高质量提问和追问。',
  '能把长资料整理成摘要、提纲和改写稿。',
  '能判断 Gemini 适合哪些 Google 工作流。',
  '能把搜索结果整理成带来源的结论。',
  '能用 DeepSeek 完成写作、解释和代码问答。',
  '能从长文档里提炼重点和行动项。',
  '能产出一版可继续打磨的小红书文案。'
];

const guideLearningPath = [
  ['ChatGPT', '学会基础提问'],
  ['Claude', '学会长文总结'],
  ['Gemini', '学会资料理解'],
  ['Perplexity', '学会资料搜索'],
  ['DeepSeek', '学会中文问答'],
  ['Kimi', '学会长文阅读']
];

const compareInsights = {
  'chatgpt-vs-claude': {
    conclusion: '长文写作选 Claude，日常问答选 ChatGPT。',
    tags: ['长文写作', '通用问答', '新手入门']
  },
  'gemini-vs-chatgpt': {
    conclusion: 'Google 生态选 Gemini，通用场景选 ChatGPT。',
    tags: ['Google生态', '通用问答', '资料理解']
  },
  'perplexity-vs-google-search': {
    conclusion: '查资料和保留来源选 Perplexity，泛搜索选 Google。',
    tags: ['资料搜索', '引用来源', '结论核查']
  },
  'deepseek-vs-chatgpt-chinese': {
    conclusion: '中文和代码入门选 DeepSeek，综合生态选 ChatGPT。',
    tags: ['中文体验', '代码入门', '综合能力']
  },
  'kimi-vs-claude-long-doc': {
    conclusion: '中文长文阅读选 Kimi，英文长文写作选 Claude。',
    tags: ['长文阅读', '写作润色', '资料整理']
  },
  'midjourney-vs-tongyi-wanxiang': {
    conclusion: '视觉质感选 Midjourney，中文提示词选通义万相。',
    tags: ['图片生成', '视觉质感', '中文提示词']
  },
  'runway-vs-kling-video': {
    conclusion: '镜头控制选 Runway，中文视频生成选可灵AI。',
    tags: ['视频生成', '镜头控制', '中文创作']
  },
  'elevenlabs-vs-china-ai-voice': {
    conclusion: '自然度选 ElevenLabs，中文配音和成本看国内工具。',
    tags: ['AI配音', '自然度', '成本控制']
  },
  'cursor-vs-claude-code': {
    conclusion: '编辑器集成选 Cursor，代码代理任务看 Claude Code。',
    tags: ['AI编程', '编辑器集成', '代码代理']
  }
};

function CategoryCard({ category, index }) {
  const sizeClass =
    category.bento === 'large'
      ? 'md:col-span-2 md:row-span-2 md:min-h-[280px]'
      : category.bento === 'medium'
        ? 'md:col-span-2 lg:col-span-1'
        : '';

  return (
    <Link href={`/categories/${category.slug}`} className={`gallery-card interactive-card shine-effect group flex min-h-[190px] flex-col p-4 ${sizeClass}`}>
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-sm font-black text-brand ring-1 ring-cyan-100">
          {category.icon}
        </div>
        <span className="text-xs font-black text-slate-300">0{index + 1}</span>
      </div>
      <h3 className={`mt-4 font-black text-ink ${category.bento === 'large' ? 'text-2xl' : 'text-lg'}`}>
        {category.name}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-muted">{category.shortDescription || category.description}</p>
      <span className="magnetic-button mt-auto pt-4 text-sm font-black text-brand group-hover:text-brandBright">
        <span>进入工作流</span>
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const globalTools = getToolsBySlugs(globalToolSlugs);
  const creativeTools = getToolsBySlugs(creativeToolSlugs);
  const homeWorkflowCategories = categories.slice(0, 9);
  const leadGuides = guides.slice(0, 6).map((guide, index) => ({
    ...guide,
    excerpt: homeGuideBriefs[index] || guide.excerpt,
    outcome: homeGuideOutcomes[index] || guide.outcome
  }));
  const leadVideos = videos.slice(0, 9);
  const leadComparisons = comparisons.slice(0, 9);

  return (
    <>
      <HomeHero hero={homeHero} />

      <HomeToolGalleries globalTools={globalTools} creativeTools={creativeTools} />

      <Section
        eyebrow="Workflow"
        title="按任务进入 AI 工作流"
        description="按助手、搜索、写作、图片、视频、办公、编程、设计、配音、字幕、国产 AI 和海外 AI 快速进入教程。"
        tone="section-accent-blue"
      >
        <div className="workflow-bento">
          <WorkflowExplorer categories={homeWorkflowCategories} />
        </div>
      </Section>

      <Section
        eyebrow="Guides"
        title="能跟做的全球 AI 工具教程"
        description="页面用中文讲清全球工具和国产工具的注册、使用、场景、限制和替代方案。"
        tone="section-accent-green"
        action={
          <Link href="/guides" className="home-section-action magnetic-button">
            <span>查看全部教程</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <div className="guides-section-layout">
          <aside className="guide-learning-path" aria-label="新手学习路径">
            <p className="guide-path-kicker">Learning Path</p>
            <h3 className="guide-path-title">新手学习路径</h3>
            <p className="guide-path-description">
              从通用问答、长文总结到资料搜索，按顺序完成第一个 AI 工作流。
            </p>
            <ol className="guide-path-steps">
              {guideLearningPath.map(([tool, goal]) => (
                <li key={tool} className="guide-path-step">
                  <span className="guide-path-dot" aria-hidden="true" />
                  <span className="guide-path-copy">
                    <span className="guide-path-tool">{tool}</span>
                    <span className="guide-path-goal">{goal}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          <div className="home-guides-grid guides-grid grid">
            {leadGuides.map((guide, index) => <GuideCard key={guide.slug} guide={guide} featured={index === 0} index={index} />)}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Video"
        title="3分钟视频解说：快速学会一个 AI 工具"
        description="用短视频方式快速了解全球热门工具和国产 AI 工具怎么用。"
        tone="section-accent-purple"
        action={
          <Link href="/videos" className="home-section-action magnetic-button">
            <span>查看全部视频</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <div className="home-video-grid grid">
          {leadVideos.map((video) => <VideoCard key={video.slug} video={video} />)}
        </div>
      </Section>

      <Section
        eyebrow="Compare"
        title="热门对比，帮你少试错"
        description="把常见选择题拆成场景、价格、上手门槛和适合人群，先看结论再试工具。"
        tone="section-accent-orange"
        action={
          <Link href="/compare" className="home-section-action magnetic-button">
            <span>查看全部</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <div className="home-compare-grid compare-grid grid">
          {leadComparisons.map((item) => {
            const insight = compareInsights[item.slug] || {
              conclusion: item.summary,
              tags: item.tools.slice(0, 2)
            };
            const [toolA, toolB] = item.tools;

            return (
              <Link key={item.slug} href={`/compare/${item.slug}`} className="compare-card gallery-card interactive-card group relative flex flex-col overflow-hidden">
                <div className="compare-pair" aria-label={`${toolA} versus ${toolB}`}>
                  <span className="compare-tool-pill">{toolA}</span>
                  <span className="compare-vs-text">VS</span>
                  <span className="compare-tool-pill">{toolB}</span>
                </div>
                <h3 className="compare-title">{item.title}</h3>
                <p className="compare-conclusion">
                  <span>结论：</span>
                  {insight.conclusion}
                </p>
                <div className="compare-tags" aria-label="适合场景">
                  {insight.tags.map((tag) => (
                    <span key={tag} className="compare-tag">{tag}</span>
                  ))}
                </div>
                <span className="compare-link magnetic-button">
                  <span>查看对比</span>
                  <span aria-hidden="true">→</span>
                </span>
            </Link>
            );
          })}
        </div>
      </Section>

      <section className="section-minimal section-cta home-section-container section-accent-purple">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="section-badge">Weekly Toolkit</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-ink md:text-4xl">每周更新 AI 工具教程和模板</h2>
            <p className="mt-3 text-base leading-7 text-muted md:text-lg">
              收藏本站，持续获取中文 AI 工具教程、视频解说、工具对比和提示词模板。
            </p>
          </div>
          <div className="cta-actions">
            <Link href="/free-ai-tools" className="home-section-action home-section-action-primary magnetic-button">
              <span>浏览免费工具</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/videos" className="home-section-action home-section-action-secondary magnetic-button">
              <span>查看视频解说</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
