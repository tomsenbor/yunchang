import Image from 'next/image';
import Link from 'next/link';
import { Section } from '../../components/Cards.jsx';
import { getCategory, guides, tools, videos } from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: 'AI 视频教程库',
  description:
    '通过视频快速学习 ChatGPT、Claude、Gemini、Kimi、DeepSeek 等 AI 工具的使用方法，覆盖新手入门、办公效率、写作创作、资料整理、代码辅助和工具对比等场景。',
  path: '/videos'
});

const filterTags = ['全部', '新手入门', '办公效率', '写作创作', '资料整理', '代码辅助', '工具对比', '提示词实战'];

const videoMetaByCategory = {
  'ai-assistant': { type: '入门', difficulty: '新手', audience: 'AI 新手 / 办公用户' },
  'ai-writing': { type: '实战', difficulty: '新手', audience: '内容创作者 / 写作用户' },
  'ai-search': { type: '实战', difficulty: '进阶', audience: '资料整理 / 研究用户' },
  'domestic-ai': { type: '入门', difficulty: '新手', audience: '中文用户 / 办公用户' },
  'ai-image': { type: '案例', difficulty: '新手', audience: '设计 / 自媒体用户' },
  'ai-video': { type: '实战', difficulty: '进阶', audience: '视频创作者 / 运营' },
  'ai-voice': { type: '案例', difficulty: '新手', audience: '课程 / 视频创作者' },
  'ai-coding': { type: '实战', difficulty: '进阶', audience: '开发者 / 技术学习者' }
};

const videoMetaBySlug = {
  'chatgpt-3min-guide': {
    title: 'ChatGPT 入门视频教程：第一次使用 AI 助手',
    description:
      '通过一个完整演示，学习如何打开 ChatGPT、写出第一个清晰提示词、继续追问、保存结果，并判断 AI 输出是否可靠。',
    tool: 'ChatGPT',
    type: '新手入门',
    difficulty: '新手',
    duration: '4 分 17 秒',
    audience: 'AI 新手 / 办公用户 / 内容创作者',
    relatedGuideSlug: 'chatgpt-beginner-guide',
    relatedToolSlug: 'chatgpt'
  },
  'claude-user-fit-video': {
    title: 'Claude 适合哪些人使用',
    description:
      '用短视频讲清 Claude 更适合长文档、写作润色和资料总结的场景，并给出新手可直接套用的提示词公式。',
    tool: 'Claude',
    type: '场景入门',
    difficulty: '新手',
    duration: '2 分 24 秒',
    audience: '学生 / 写作者 / 内容编辑 / 产品运营 / 职场报告用户',
    relatedGuideSlug: 'claude-long-doc-writing-summary',
    relatedToolSlug: 'claude'
  },
  'gemini-vs-chatgpt-video': {
    title: 'Gemini 和 ChatGPT 有什么区别',
    description:
      '用短视频讲清 Gemini 更偏 Google 生态、搜索和多模态信息，ChatGPT 更偏通用任务、写作和连续追问。',
    tool: 'Gemini / ChatGPT',
    type: '工具对比',
    difficulty: '新手',
    duration: '2 分 32 秒',
    audience: 'AI 新手 / Google 工作流用户 / 写作办公用户 / 内容创作者',
    relatedGuideSlug: 'gemini-google-ai-beginner',
    relatedToolSlug: 'gemini'
  },
  'perplexity-research-video': {
    title: 'Perplexity 怎么做资料搜索',
    description:
      '用短视频讲清 Perplexity 更适合资料搜索、来源核对和调研整理，帮助新手把 AI 搜索结果变成可用结论。',
    tool: 'Perplexity',
    type: '资料搜索',
    difficulty: '新手',
    duration: '2 分 43 秒',
    audience: '学生 / 研究用户 / 内容编辑 / 资料整理用户',
    relatedGuideSlug: 'perplexity-ai-search-research',
    relatedToolSlug: 'perplexity'
  },
  'deepseek-beginner-video': {
    title: 'DeepSeek 新手教程',
    description:
      '从中文提问、写作润色、学习解释到代码理解，用一条短视频讲清 DeepSeek 新手第一次应该怎么用。',
    tool: 'DeepSeek',
    type: '新手入门',
    difficulty: '新手',
    duration: '2 分 44 秒',
    audience: '中文用户 / 学生 / 办公用户 / 内容创作者 / 代码学习者',
    relatedGuideSlug: 'deepseek-writing-code-qa',
    relatedToolSlug: 'deepseek'
  },
  'kimi-long-doc-video': {
    title: 'Kimi 怎么读长文档',
    description:
      '用一个长文档案例演示 Kimi 的摘要、追问、依据核对和资料整理流程，帮助新手把长资料变成可用结果。',
    tool: 'Kimi',
    type: '资料整理',
    difficulty: '新手',
    duration: '2 分 25 秒',
    audience: '学生 / 研究用户 / 知识工作者 / 内容编辑 / 会议纪要整理用户',
    relatedGuideSlug: 'kimi-long-document-summary',
    relatedToolSlug: 'kimi'
  },
  'midjourney-image-video': {
    title: 'Midjourney 怎么生成图片',
    description:
      '用短视频讲清 Midjourney 的提示词结构、风格控制、比例选择和图片迭代流程，帮助新手生成更稳定的视觉素材。',
    tool: 'Midjourney',
    type: '图片生成',
    difficulty: '新手',
    duration: '2 分 37 秒',
    audience: '设计师 / 自媒体人 / 品牌运营 / 视觉创作者 / AI 图片新手',
    relatedGuideSlug: 'midjourney-high-quality-image',
    relatedToolSlug: 'midjourney'
  },
  'runway-video-generation-video': {
    title: 'Runway 怎么生成视频',
    description:
      '用一条新手视频讲清 Runway 的镜头拆分、图生视频、提示词公式和生成后迭代流程，帮助你更稳定地做 AI 视频素材。',
    tool: 'Runway',
    type: 'AI 视频生成',
    difficulty: '新手',
    duration: '3 分 22 秒',
    audience: '视频创作者 / 广告创意 / 设计师 / 短片团队 / AI 视频新手',
    relatedGuideSlug: 'runway-ai-video-guide',
    relatedToolSlug: 'runway'
  },
  'elevenlabs-voice-video': {
    title: 'ElevenLabs 怎么做 AI 配音',
    description:
      '用一条新手视频讲清 ElevenLabs 的声音选择、口播脚本、短句测试、语速情绪调整和导出对齐流程。',
    tool: 'ElevenLabs',
    type: 'AI 配音',
    difficulty: '新手',
    duration: '3 分 12 秒',
    audience: '视频作者 / 播客 / 课程创作者 / 自媒体运营 / AI 配音新手',
    relatedGuideSlug: 'elevenlabs-ai-voice-guide',
    relatedToolSlug: 'elevenlabs'
  },
  'cursor-ai-coding-video': {
    title: 'Cursor 怎么用 AI 写代码',
    description:
      '用一条新手视频讲清 Cursor 的项目理解、代码解释、局部修改、差异检查和测试验证流程。',
    tool: 'Cursor',
    type: 'AI 编程',
    difficulty: '新手',
    duration: '3 分 43 秒',
    audience: '开发者 / 独立开发者 / 技术学生 / 创业团队 / AI 编程新手',
    relatedGuideSlug: 'cursor-ai-coding-guide',
    relatedToolSlug: 'cursor'
  }
};

function getRelatedGuide(video) {
  return guides.find((guide) => guide.categorySlug === video.categorySlug) || guides[0];
}

function getRelatedTool(video) {
  return tools.find((tool) => tool.categorySlug === video.categorySlug) || tools[0];
}

export default function VideosPage() {
  return (
    <Section
      eyebrow="Video Library"
      title="AI 视频教程库"
      description="通过视频快速学习 ChatGPT、Claude、Gemini、Kimi、DeepSeek 等 AI 工具的使用方法，覆盖新手入门、办公效率、写作创作、资料整理、代码辅助和工具对比等场景。"
      className="video-list-page"
    >
      <div className="video-list-stack">
        <div className="video-filter-row" aria-label="视频筛选标签">
          {filterTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="video-library-grid">
          {videos.map((video) => {
            const category = getCategory(video.categorySlug);
            const slugMeta = videoMetaBySlug[video.slug] || {};
            const categoryMeta = videoMetaByCategory[video.categorySlug] || { type: '教程', difficulty: '新手', audience: 'AI 工具用户' };
            const meta = { ...categoryMeta, ...slugMeta };
            const relatedGuide = meta.relatedGuideSlug
              ? guides.find((guide) => guide.slug === meta.relatedGuideSlug)
              : getRelatedGuide(video);
            const relatedTool = meta.relatedToolSlug
              ? tools.find((tool) => tool.slug === meta.relatedToolSlug)
              : getRelatedTool(video);
            const title = meta.title || video.title;
            const duration = meta.duration || video.duration;
            const description = meta.description || video.description || video.transcript;
            const toolName = meta.tool || relatedTool?.name || category?.name || 'AI 工具';

            return (
              <article className="video-library-card" key={video.slug}>
                <Link href={`/videos/${video.slug}`} className="video-library-cover">
                  <Image
                    src={video.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="video-library-image"
                  />
                  <div className="video-library-shade" />
                  <span className="video-library-duration">{duration}</span>
                  <span className="video-library-play" aria-hidden="true">▶</span>
                  <div className="video-library-caption">
                    <span>{toolName}</span>
                    <h2>{title}</h2>
                  </div>
                </Link>

                <div className="video-library-body">
                  <p className="video-library-tool">{toolName}</p>
                  <div className="video-library-meta">
                    <span>{meta.type}</span>
                    <span>{meta.difficulty}</span>
                    <span>{duration}</span>
                  </div>
                  <p>{description}</p>
                  <dl className="video-library-facts">
                    <div>
                      <dt>适合人群</dt>
                      <dd>{meta.audience}</dd>
                    </div>
                    <div>
                      <dt>关联工具</dt>
                      <dd>{relatedTool?.name || toolName}</dd>
                    </div>
                    <div>
                      <dt>关联教程</dt>
                      <dd>{relatedGuide?.title || '视频文字稿'}</dd>
                    </div>
                  </dl>
                  <Link href={`/videos/${video.slug}`} className="video-library-link">
                    查看视频教程 →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
