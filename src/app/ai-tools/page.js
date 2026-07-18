import { Section } from '../../components/Cards.jsx';
import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({
  title: 'AI模型库',
  description:
    '系统整理主流 AI 模型系列的能力定位、输入输出类型、上下文窗口核对方式、调用入口、适用场景和选型建议。',
  path: '/ai-tools'
});

const modelFamilies = [
  {
    name: 'GPT 系列',
    provider: 'OpenAI',
    position: '通用助手、应用开发和多模态任务的主流模型系列。',
    familyType: '闭源商用模型',
    input: '文本 / 图片 / 文件等，按具体版本核对',
    output: '文本 / 代码 / 结构化输出',
    strengths: ['通用问答', '写作', '代码辅助', '工具调用', '多模态理解'],
    bestFor: '通用 AI 助手、办公效率、应用开发、Agent 工作流',
    access: 'ChatGPT、OpenAI API、企业平台',
    context: '以官方实际版本为准',
    scale: '未公开',
    verify: ['上下文窗口', '最大输出', '价格与速率限制', '工具调用能力']
  },
  {
    name: 'Claude 系列',
    provider: 'Anthropic',
    position: '偏长文阅读、自然写作、资料总结和复杂表达处理。',
    familyType: '闭源商用模型',
    input: '文本 / 文件 / 图片等，按具体版本核对',
    output: '文本 / 摘要 / 代码说明 / 结构化分析',
    strengths: ['长文阅读', '自然写作', '文档分析', '资料总结'],
    bestFor: '长文档总结、写作润色、研究资料整理、知识工作流',
    access: 'Claude、Anthropic API、合作平台',
    context: '以官方实际版本为准',
    scale: '未公开',
    verify: ['文件处理限制', '上下文窗口', '区域可用性', '套餐差异']
  },
  {
    name: 'Gemini 系列',
    provider: 'Google',
    position: '面向 Google 生态、多模态理解和搜索辅助的模型系列。',
    familyType: '闭源商用模型',
    input: '文本 / 图片 / 音频 / 视频等，按入口核对',
    output: '文本 / 代码 / 结构化内容',
    strengths: ['多模态理解', '搜索辅助', '资料理解', '办公协作'],
    bestFor: 'Google 生态、多模态问答、学习整理、办公协作',
    access: 'Gemini、Google AI Studio、Vertex AI',
    context: '以官方实际版本为准',
    scale: '未公开',
    verify: ['不同入口版本', '多模态限制', '上下文窗口', 'API 权限']
  },
  {
    name: 'DeepSeek 系列',
    provider: 'DeepSeek',
    position: '中文问答、推理任务、代码辅助和高性价比开发场景。',
    familyType: '商用服务 / 开源版本并存',
    input: '文本 / 代码为主，按具体版本核对',
    output: '文本 / 代码 / 推理相关输出',
    strengths: ['中文问答', '推理', '代码辅助', '数学逻辑'],
    bestFor: '中文问答、代码学习、推理任务、开发辅助',
    access: 'DeepSeek 产品、API、开源模型平台',
    context: '以官方实际版本为准',
    scale: '以官方公开版本为准',
    verify: ['开源与在线版差异', '上下文窗口', '推理输出方式', '部署限制']
  },
  {
    name: 'Kimi / Moonshot 系列',
    provider: 'Moonshot AI',
    position: '面向中文长文阅读、文件理解和资料整理的模型系列。',
    familyType: '闭源商用模型',
    input: '文本 / 文件 / 网页内容等，按入口核对',
    output: '文本 / 摘要 / 清单 / 结构化整理',
    strengths: ['中文长文阅读', '资料整理', '文档总结', '网页提炼'],
    bestFor: '中文办公、长资料阅读、论文报告整理、知识问答',
    access: 'Kimi、Moonshot API',
    context: '以官方实际版本为准',
    scale: '未公开',
    verify: ['长文本限制', '文件大小', 'API 能力', '套餐限制']
  },
  {
    name: 'Qwen 系列',
    provider: 'Alibaba Cloud / 通义千问',
    position: '覆盖中文理解、企业应用、开源模型和云服务集成。',
    familyType: '开源模型 / 云服务并存',
    input: '文本 / 图片 / 音频等，按具体版本核对',
    output: '文本 / 代码 / 结构化输出',
    strengths: ['中文理解', '代码辅助', '多模态', '企业集成'],
    bestFor: '中文办公、企业应用、开发集成、阿里云生态',
    access: '通义千问、阿里云百炼、开源模型仓库',
    context: '以官方实际版本为准',
    scale: '不同版本不同，待核对',
    verify: ['开源许可证', '参数规模', '上下文窗口', '云服务限制']
  },
  {
    name: 'Llama 系列',
    provider: 'Meta',
    position: '面向开源研究、本地部署、私有化实验和应用微调。',
    familyType: '开源模型系列',
    input: '文本为主，按具体版本说明核对',
    output: '文本 / 代码 / 结构化输出',
    strengths: ['本地部署', '开源微调', '文本生成', '私有化实验'],
    bestFor: '本地部署、研究实验、开源应用、私有化原型',
    access: 'Meta 官方发布、开源模型平台、第三方部署服务',
    context: '以官方实际版本为准',
    scale: '不同版本不同，待核对',
    verify: ['许可证', '硬件要求', '量化版本', '部署成本']
  }
];

const selectionTracks = [
  {
    label: '通用效率入口',
    pick: 'GPT / Claude / Gemini',
    reason: '覆盖问答、写作、资料整理、代码解释和多任务协作。'
  },
  {
    label: '长文档和中文资料',
    pick: 'Claude / Kimi / GPT',
    reason: '优先看长上下文、文件处理、摘要稳定性和中文表达质量。'
  },
  {
    label: '代码和推理任务',
    pick: 'GPT / DeepSeek / Qwen',
    reason: '重点核对代码能力、推理表现、API 稳定性和上下文窗口。'
  },
  {
    label: '多模态理解',
    pick: 'Gemini / GPT / Qwen',
    reason: '先确认图片、音频、视频输入是否在当前版本和入口可用。'
  },
  {
    label: '本地部署和私有化',
    pick: 'Llama / Qwen / DeepSeek',
    reason: '优先核对开源许可证、硬件要求、量化版本和部署成本。'
  }
];

const parameterGuide = [
  ['上下文窗口', '决定一次能处理多少输入内容。不要只看宣传值，要核对当前版本、入口和最大输出限制。'],
  ['参数规模', '不是唯一质量指标。闭源模型常不公开参数量，开源模型也要区分版本、量化和部署环境。'],
  ['输入能力', '需要拆开看文本、图片、音频、视频、文件和网页内容，不同入口经常不一致。'],
  ['输出能力', '区分文本、代码、结构化 JSON、图片、音频和函数调用，不要把产品能力等同于模型能力。'],
  ['调用方式', '同一模型在网页产品、API、云平台、第三方聚合平台里的权限和限制可能不同。'],
  ['数据可信度', '涉及价格、上下文、token、速率、模型版本、API 参数时，都应回到官方文档或控制台核对。']
];

const capabilityMatrix = [
  ['GPT 系列', '强', '强', '强', '强', '强', '中高'],
  ['Claude 系列', '强', '强', '强', '中', '中', '中'],
  ['Gemini 系列', '强', '中高', '中高', '中高', '强', '中'],
  ['DeepSeek 系列', '中高', '中', '中高', '强', '待核对', '中'],
  ['Kimi / Moonshot 系列', '中高', '强', '强', '中', '待核对', '中'],
  ['Qwen 系列', '中高', '中高', '中', '中高', '中高', '中高'],
  ['Llama 系列', '中', '中', '中', '中', '按版本核对', '强']
];

const accessModes = [
  ['产品入口', '适合普通用户快速体验，例如 ChatGPT、Claude、Gemini、Kimi。重点看界面、文件上传、历史记录和套餐。'],
  ['API 调用', '适合开发者集成。重点看模型名称、上下文、最大输出、速率限制、价格和工具调用。'],
  ['云平台', '适合企业项目。重点看权限、计费、监控、数据合规、区域和服务等级。'],
  ['开源部署', '适合本地或私有化。重点看许可证、硬件、推理框架、量化版本和维护成本。']
];

const dataRules = [
  '不写无法确认的实时价格、免费额度、速率限制和地区可用性。',
  '不把 ChatGPT、Claude、Gemini 等产品体验直接等同于模型能力。',
  '不把参数规模当作模型质量的唯一判断标准。',
  '不写未核对的 benchmark 排名、训练数据范围和最大上下文数值。',
  '生产环境选型必须回到官方文档、控制台和实际测试结果。'
];

export default function AiToolsPage() {
  return (
    <Section
      eyebrow="Model Library"
      title="AI模型库"
      description="系统整理主流 AI 模型系列的能力定位、输入输出类型、上下文窗口核对方式、调用入口、适用场景和选型建议。这里关注模型本身，不重复工具详情页的产品体验介绍。"
      className="model-library-page"
    >
      <div className="model-library-stack">
        <section className="model-library-hero-panel">
          <div>
            <p className="model-library-lead">
              AI 工具是你直接使用的产品，AI 模型是产品背后的能力基础。模型库的目标不是告诉你“哪个工具好用”，而是帮助你判断某个模型系列适合处理什么任务、需要核对哪些参数、应该从哪个入口调用。
            </p>
          </div>
          <div className="model-library-principles" aria-label="模型库原则">
            <span>不编造参数</span>
            <span>按任务选型</span>
            <span>标注核对项</span>
          </div>
        </section>

        <section className="model-library-section">
          <h2>模型库概览</h2>
          <div className="model-library-overview">
            <div>
              <span>已整理模型系列</span>
              <strong>{modelFamilies.length}</strong>
              <p>覆盖通用、长上下文、多模态、推理、开源部署等主要方向。</p>
            </div>
            <div>
              <span>页面重点</span>
              <strong>模型资料</strong>
              <p>突出上下文、输入输出、调用方式、能力边界和适用任务。</p>
            </div>
            <div>
              <span>数据处理</span>
              <strong>需核对</strong>
              <p>不确定信息使用“以官方实际版本为准”“未公开”“待核对”。</p>
            </div>
          </div>
        </section>

        <section className="model-library-section">
          <h2>快速选型索引</h2>
          <div className="model-track-grid">
            {selectionTracks.map((track) => (
              <article key={track.label}>
                <span>{track.label}</span>
                <h3>{track.pick}</h3>
                <p>{track.reason}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="model-library-section">
          <h2>主流模型系列</h2>
          <div className="model-card-grid">
            {modelFamilies.map((model) => (
              <article key={model.name} className="model-card">
                <div className="model-card-header">
                  <span>{model.provider}</span>
                  <h3>{model.name}</h3>
                  <p>{model.position}</p>
                </div>
                <div className="model-meta-strip">
                  <span>{model.familyType}</span>
                  <span>{model.access}</span>
                </div>
                <dl className="model-field-list">
                  <div>
                    <dt>输入</dt>
                    <dd>{model.input}</dd>
                  </div>
                  <div>
                    <dt>输出</dt>
                    <dd>{model.output}</dd>
                  </div>
                  <div>
                    <dt>适合</dt>
                    <dd>{model.bestFor}</dd>
                  </div>
                  <div>
                    <dt>上下文</dt>
                    <dd>{model.context}</dd>
                  </div>
                  <div>
                    <dt>参数</dt>
                    <dd>{model.scale}</dd>
                  </div>
                </dl>
                <div className="model-chip-list" aria-label={`${model.name}主要能力`}>
                  {model.strengths.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="model-verify-box">
                  <strong>生产使用重点核对</strong>
                  <p>{model.verify.join(' / ')}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="model-library-section">
          <h2>模型核心参数说明</h2>
          <div className="model-note-list">
            {parameterGuide.map(([title, description]) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="model-library-section">
          <h2>能力表现矩阵</h2>
          <div className="model-matrix" role="table" aria-label="模型能力表现矩阵">
            <div className="model-matrix-row model-matrix-head" role="row">
              <span role="columnheader">模型系列</span>
              <span role="columnheader">通用问答</span>
              <span role="columnheader">长文资料</span>
              <span role="columnheader">写作表达</span>
              <span role="columnheader">代码推理</span>
              <span role="columnheader">多模态</span>
              <span role="columnheader">私有化</span>
            </div>
            {capabilityMatrix.map((row) => (
              <div className="model-matrix-row" role="row" key={row[0]}>
                {row.map((item, index) => (
                  <span role="cell" key={`${row[0]}-${index}`}>{item}</span>
                ))}
              </div>
            ))}
          </div>
          <p className="model-library-note">
            能力矩阵用于初步筛选，不代表固定排名。具体表现会随模型版本、入口、提示词、上下文长度和任务材料变化。
          </p>
        </section>

        <section className="model-library-section">
          <h2>调用和落地方式</h2>
          <div className="model-access-grid">
            {accessModes.map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="model-library-section">
          <h2>避免编造和重复的规则</h2>
          <ul className="model-rule-list">
            {dataRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </Section>
  );
}
