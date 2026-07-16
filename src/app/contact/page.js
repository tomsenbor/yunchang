import { pageMetadata } from '../../lib/seo.mjs';
import { Section } from '../../components/Cards.jsx';
import { ContactMailForm } from '../../components/ContactMailForm.jsx';

export const metadata = pageMetadata({
  title: '联系与投稿',
  description: '提交 AI 工具收录、教程选题、视频合作、模板资源和商务合作信息。',
  path: '/contact'
});

const submissionTypes = [
  {
    title: 'AI 工具收录',
    description: '适合提交新工具、国产 AI 产品、海外 AI 产品、免费工具和细分场景工具。',
    fields: ['工具名称', '官网链接', '适合人群', '核心功能', '价格信息', '是否有联盟合作']
  },
  {
    title: '教程选题',
    description: '适合提交你希望本站制作的图文教程、对比评测、使用指南或避坑内容。',
    fields: ['工具名称', '想解决的问题', '目标读者', '参考资料', '期望输出形式']
  },
  {
    title: '视频合作',
    description: '适合提交短视频解说、数字人教程、工具演示和联合发布需求。',
    fields: ['视频主题', '目标平台', '预计时长', '素材链接', '合作方式', '发布时间要求']
  },
  {
    title: '模板资源',
    description: '适合提交提示词模板、表格模板、脚本模板、PPT 模板和工作流模板。',
    fields: ['模板名称', '文件格式', '适用场景', '授权说明', '下载链接或文件说明']
  }
];

const reviewRules = [
  '提交内容必须和 AI 工具、效率工作流、教程、视频解说或模板资源相关。',
  '工具官网、价格、功能、截图和演示视频应尽量提供原始来源，便于核对。',
  '如果包含联盟推广、赞助内容或商业合作，需要在页面中明确披露。',
  '外部商业链接上线时会使用 rel="sponsored nofollow"。',
  '涉及版权素材、品牌 Logo、人物肖像或第三方内容时，请先确认授权。'
];

export default function ContactPage() {
  return (
    <Section
      eyebrow="Submit"
      title="联系与投稿"
      description="提交 AI 工具收录、教程选题、视频合作、模板资源或商务合作。请通过页面表单或联系邮箱发送信息。"
    >
      <div className="grid gap-6">
        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">联系方式</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            投稿、工具收录、视频合作、模板资源和商务合作，请发送邮件到：
          </p>
          <a
            href="mailto:luwenjunlumu@outlook.com"
            className="mt-4 inline-flex rounded-md border border-line px-4 py-2 text-sm font-black text-ink transition hover:border-brand hover:text-brand"
          >
            luwenjunlumu@outlook.com
          </a>
          <p className="mt-4 text-sm leading-6 text-muted">
            邮件标题建议注明：工具收录 / 教程选题 / 视频合作 / 模板投稿 / 商务合作。
          </p>
        </div>

        <ContactMailForm />

        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">提交前请准备这些信息</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            为了方便核对，请尽量提供官网、资源链接、授权说明和合作背景。不要在邮件里发送账号密码、支付信息、身份证号等敏感信息。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {submissionTypes.map((item) => (
            <section key={item.title} className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <h2 className="text-lg font-black text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-ink">
                {item.fields.map((field) => (
                  <li key={field}>· {field}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-ink">投稿格式建议</h2>
            <div className="mt-4 rounded-lg bg-soft p-4">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-ink">{`投稿类型：
名称：
官网或资源链接：
适合人群：
主要功能或内容：
推荐理由：
是否包含商业合作：
需要特别说明的授权或限制：`}</pre>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              如果是视频合作，请额外提供脚本方向、画面素材、配音要求和是否需要本站协助生成封面或字幕。
            </p>
          </section>

          <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-ink">收录和合作规则</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-muted">
              {reviewRules.map((rule) => (
                <li key={rule}>· {rule}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">合作与反馈</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            如需合作、投稿或功能反馈，请通过本页表单或联系邮箱提交；涉及附件时可在邮件中提供可访问的资源链接和授权说明。
          </p>
        </div>
      </div>
    </Section>
  );
}
