import {
  TOOL_RATING_METHODOLOGY,
  TOOL_RATING_UPDATED_AT
} from '../../lib/site-data.mjs';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: 'AI工具评测方法',
  description: '说明 AI效率工具库的信息来源、测试维度、更新频率、评分标准和商业合作原则。',
  path: '/methodology'
});

const evaluationDimensions = [
  ['功能能力', '核对工具能否稳定完成其主要任务，并记录能力边界和版本差异。'],
  ['易用性', '评估注册、界面、中文支持、输入方式和完成常见任务的上手成本。'],
  ['免费额度', '核对是否提供免费入口、试用限制和登录要求；未公开信息明确标记为待核对。'],
  ['适合人群', '根据新手、学生、内容创作者、办公人群和开发者等真实需求判断适配度。'],
  ['实际工作场景', '通过写作、资料整理、搜索、设计、视频、办公和编程等任务观察实际表现。']
];

export default function MethodologyPage() {
  return (
    <div className="static-page static-page-container methodology-page">
      <h1 className="text-4xl font-black text-ink">AI工具评测方法</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
        本页公开说明本站如何整理、测试和更新 AI 工具信息。最近更新时间：{TOOL_RATING_UPDATED_AT}。
      </p>

      <div className="prose-lite mt-6 rounded-lg border border-line bg-white p-6 shadow-soft">
        <section>
          <h2>工具信息来源</h2>
          <p>优先参考工具官网、官方帮助中心、价格页、更新日志和公开产品说明，并结合实际使用体验进行交叉核验。无法确认的信息使用“未公开”“待核对”或“以官方实际页面为准”。</p>
        </section>

        <section>
          <h2>测试维度</h2>
          <ul>
            {evaluationDimensions.map(([title, description]) => (
              <li key={title}><strong>{title}：</strong>{description}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>更新频率</h2>
          <p>重点页面按周检查，并在工具价格、功能、版本、免费政策或使用入口发生明显变化时更新。页面日期代表最近一次内容核查时间，不代表工具官方发布日期。</p>
        </section>

        <section>
          <h2>评分标准</h2>
          <p>{TOOL_RATING_METHODOLOGY}</p>
          <p>评分和推荐指数用于本站场景化选型参考，不代表官方评分、绝对性能排名或所有用户在所有任务中的体验。</p>
        </section>

        <section>
          <h2>商业合作说明</h2>
          <p>商业合作、联盟链接或赞助不会改变评测结论。涉及商业关系时会在相关页面明确披露，外部推广链接按规范标记；本站不接受以隐藏限制、虚构数据或承诺固定排名为条件的合作。</p>
        </section>

        <section id="ai-models">
          <h2>AI 模型数据来源与核查方法</h2>
          <p>模型条目与 AI 工具评测分开维护。模型信息优先参考官方模型文档、官方 API 与价格页面、官方发布公告、官方技术报告和可追溯的公开基准测试。</p>
          <p>只有来源、测试版本、发布时间和核查日期可追溯时，才展示公开基准数据。没有可靠统一数据时，页面显示“当前暂无可核查的统一数据”，不会生成演示分数或进度条。</p>
          <p>无法确认的字段统一标记为“未公开”“待核对”或“以官方最新文档为准”；开放权重不自动等同于完全开源。</p>
        </section>
      </div>
    </div>
  );
}
