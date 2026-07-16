import { Section } from '../../components/Cards.jsx';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: '模板下载',
  description: 'AI 提示词模板、文章大纲、工具评测表和视频解说脚本模板下载页。',
  path: '/templates'
});

const templateGroups = [
  {
    slug: 'xiaohongshu-prompt-pack',
    title: '小红书文案提示词模板',
    type: 'Prompt',
    format: 'Markdown',
    href: '/templates/xiaohongshu-prompt-pack.md',
    summary: '适合把 AI 工具教程、使用体验、工具对比整理成小红书笔记。',
    includes: ['标题备选', '正文初稿', '配图建议', '标签', '核对清单'],
    bestFor: '自媒体作者、AI 工具号、课程运营'
  },
  {
    slug: 'wechat-article-outline',
    title: '公众号文章大纲模板',
    type: '写作模板',
    format: 'Markdown',
    href: '/templates/wechat-article-outline.md',
    summary: '把选题拆成开头、正文、操作步骤、常见错误和结尾建议。',
    includes: ['文章信息', '标题备选', '正文大纲', 'AI 写作提示词'],
    bestFor: '公众号作者、知识博主、教程编辑'
  },
  {
    slug: 'ai-tool-review-sheet',
    title: 'AI工具评测记录表',
    type: '表格',
    format: 'CSV',
    href: '/templates/ai-tool-review-sheet.csv',
    summary: '记录工具类型、价格、中文体验、优点限制和是否推荐。',
    includes: ['工具信息', '适合人群', '优缺点', '替代工具', '推荐结论'],
    bestFor: '工具评测、选型对比、内容资料库'
  },
  {
    slug: 'video-script-template',
    title: 'AI视频解说脚本模板',
    type: '视频脚本',
    format: 'Markdown',
    href: '/templates/video-script-template.md',
    summary: '按短视频节奏拆解开场、要点、操作建议、风险提醒和总结。',
    includes: ['分段口播', '画面建议', '字幕短句', '结尾引导'],
    bestFor: '视频解说、数字人教程、工具教学短片'
  }
];

const usageSteps = [
  '先选择最接近当前任务的模板，不要一次混用多个模板。',
  '把【变量】替换成真实主题、读者、素材和输出格式。',
  '用 AI 生成第一版后，再追问“删掉空话、补充例子、标出需核对信息”。',
  '正式发布前检查事实、链接、价格、版权和平台规则。'
];

export default function TemplatesPage() {
  return (
    <Section
      eyebrow="Templates"
      title="模板下载"
      description="整理常用 AI 工作流模板，覆盖文案、文章大纲、工具评测和视频脚本。模板可直接下载，也可以复制到 ChatGPT、Claude、DeepSeek、Kimi 等工具里继续修改。"
    >
      <div className="grid gap-6">
        <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">怎么使用这些模板</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-muted md:grid-cols-2">
            {usageSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-soft text-xs font-black text-brand">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="site-page-grid template-grid grid sm:grid-cols-2 lg:grid-cols-4">
          {templateGroups.map((template) => (
            <article key={template.slug} className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-black text-accent">{template.type}</p>
                <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-bold text-muted">{template.format}</span>
              </div>
              <h2 className="mt-3 text-lg font-black leading-snug text-ink">{template.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{template.summary}</p>
              <p className="mt-4 text-xs font-black text-muted">适合：{template.bestFor}</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink">
                {template.includes.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
              <a
                href={template.href}
                download
                className="mt-auto inline-flex w-full items-center justify-center rounded-md border border-line px-3 py-2 text-sm font-bold text-ink transition hover:border-brand hover:text-brand"
              >
                下载模板
              </a>
            </article>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-black text-ink">适合直接复用</h2>
            <p className="mt-2 text-sm leading-6 text-muted">日常内容生产、AI 工具评测、教程脚本、资料整理都可以先套模板，再根据任务继续追问。</p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-black text-ink">需要人工核对</h2>
            <p className="mt-2 text-sm leading-6 text-muted">价格、功能更新、引用来源、版权和商业授权不要只依赖 AI 输出，正式发布前必须检查。</p>
          </section>
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-black text-ink">更多模板</h2>
            <p className="mt-2 text-sm leading-6 text-muted">更多 Notion、飞书表格、PPT、视频分镜和 SEO 内容模板将陆续发布。</p>
          </section>
        </div>
      </div>
    </Section>
  );
}
