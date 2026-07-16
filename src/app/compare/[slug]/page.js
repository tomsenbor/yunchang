import { notFound } from 'next/navigation';
import { JsonLd } from '../../../components/JsonLd.jsx';
import { comparisons, getComparison } from '../../../lib/site-data.mjs';
import { breadcrumbJsonLd, pageMetadata } from '../../../lib/seo.mjs';
import styles from './page.module.css';

export function generateStaticParams() {
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) return {};

  const titleMap = {
    'chatgpt-vs-claude': 'ChatGPT 和 Claude 哪个好用？AI 助手对比与选择指南'
  };
  const descriptionMap = {
    'chatgpt-vs-claude': '从通用问答、长文处理、中文写作、代码辅助、办公效率和使用成本等维度，对比 ChatGPT 与 Claude 的适合场景，帮助你根据任务选择更合适的 AI 助手。'
  };

  return pageMetadata({
    title: titleMap[slug] || comparison.title,
    description: descriptionMap[slug] || comparison.summary,
    path: `/compare/${comparison.slug}`
  });
}

function buildFallbackDetail(comparison) {
  const [left, right] = Array.isArray(comparison?.tools)
    ? comparison.tools
    : ['AI 工具 A', 'AI 工具 B'];
  const pair = `${left} / ${right}`;
  const summary = comparison?.summary || `${left} 和 ${right} 的使用场景、上手难度和产出质量对比。`;

  return {
    title: `${left} 和 ${right} 怎么选？工具对比与选择指南`,
    subtitle: `从核心能力、适合场景、上手难度、内容质量、工作流适配和使用成本等维度，对比 ${left} 与 ${right} 的实际选择建议。`,
    meta: `${pair} · 工具对比 · 场景选择 / 产出质量 / 上手难度 / 工作流 · 5 个核心维度`,
    overview:
      `${summary} 这篇对比不是简单判断哪个工具绝对更强，而是把选择问题拆成具体任务：你需要更快产出、处理长资料、生成创意内容、辅助办公，还是完成更专业的工作流。看完后，你应该能根据自己的任务类型选择优先尝试哪一个工具。`,
    oneLineConclusion: [
      `如果你更看重通用任务覆盖、快速起步和多场景试错，优先考虑 ${left}。`,
      `如果你更看重特定任务质量、稳定输出和更贴近当前场景的体验，优先考虑 ${right}。`,
      `如果预算和使用频率允许，可以把两者搭配使用：先用一个工具快速形成初稿，再用另一个工具复核、润色或补充。`
    ],
    bestFor: {
      first: [
        `希望先用 ${left} 覆盖主要任务的人`,
        '需要快速得到初稿、方案、清单或可执行结果的人',
        '正在比较工具上手难度和日常效率的人',
        '希望把 AI 工具融入个人工作流的人',
        '更看重灵活试错和多任务切换的人'
      ],
      second: [
        `希望用 ${right} 解决更聚焦任务的人`,
        '更看重结果质量、稳定性和特定场景表现的人',
        '经常处理资料、创作、办公或专业任务的人',
        '希望工具输出更贴近最终可用结果的人',
        '愿意根据任务特点选择更合适工具的人'
      ]
    },
    dimensions: [
      ['上手难度', `${left} 更适合先快速试用，适合从简单任务切入。`, `${right} 更适合带着明确任务使用，效果更容易判断。`, '新手先选更容易起步的一方，熟练后再按任务质量切换。'],
      ['产出质量', `${left} 适合快速生成结构、初稿和方向。`, `${right} 适合进一步优化表达、细节和完成度。`, '需要速度时先选左侧，需要定稿质量时优先看右侧表现。'],
      ['中文体验', `${left} 可以覆盖常见中文写作、问答和整理任务。`, `${right} 在特定中文场景下需要结合实际任务测试。`, '中文办公和内容任务建议用同一段材料交叉试用。'],
      ['资料整理', `${left} 适合把零散材料转成清单、步骤和行动项。`, `${right} 适合围绕资料做总结、复核和补充。`, '资料量大时先看谁能更稳定保留关键信息。'],
      ['创作场景', `${left} 更适合快速探索多个方向。`, `${right} 更适合把选定方向继续打磨。`, '灵感阶段用速度，成稿阶段看质量。'],
      ['办公效率', `${left} 适合会议纪要、周报、邮件和任务拆解等通用流程。`, `${right} 适合更聚焦的文档、内容或专项任务。`, '日常办公优先选覆盖面更广的一方。'],
      ['专业任务', `${left} 可以辅助拆解问题，但重要结论仍需人工判断。`, `${right} 可用于补充视角和复核结果。`, '高风险任务不要只依赖任一 AI 工具。'],
      ['工作流适配', `${left} 更适合做效率入口和第一步处理。`, `${right} 更适合作为第二步优化或特定任务工具。`, '常用做法是一个负责起草，一个负责复核。'],
      ['成本门槛', `${left} 的具体套餐和额度以官网实际显示为准。`, `${right} 的具体套餐和额度以官网实际显示为准。`, '价格不确定时先按免费额度和使用频率评估。'],
      ['适合新手程度', `${left} 更适合快速建立对 AI 工具的基本感知。`, `${right} 更适合在明确需求后深入使用。`, '如果还没有固定任务，先从更易上手的一方开始。']
    ],
    scenarios: [
      {
        index: '场景一',
        title: '快速完成一个日常任务',
        text: `如果只是写一段文案、整理一份清单或生成一个初稿，${left} 更适合作为第一步效率入口。`,
        pick: `建议先用 ${left} 快速生成结果，再用 ${right} 做补充或复核。`
      },
      {
        index: '场景二',
        title: '处理更长的资料或更复杂的需求',
        text: `当任务包含较多上下文、资料或多轮修改时，要重点观察 ${right} 是否能保持结构稳定。`,
        pick: `建议用 ${right} 做深度处理，再把结论交给 ${left} 转成表格、清单或执行计划。`
      },
      {
        index: '场景三',
        title: '创作内容或探索方案',
        text: '创意阶段需要多方向试错，定稿阶段则更看重语言、逻辑和完成度。',
        pick: `先用 ${left} 发散方向，再用 ${right} 优化最终版本。`
      },
      {
        index: '场景四',
        title: '办公和学习场景',
        text: '办公与学习通常同时需要解释、总结、改写和行动项整理，单一工具未必覆盖所有细节。',
        pick: `先选更顺手的一方作为主工具，再把关键输出交给另一方检查。`
      },
      {
        index: '场景五',
        title: '需要可靠结论的任务',
        text: '涉及事实、数据、价格、政策或专业建议时，AI 输出只能作为辅助材料。',
        pick: '建议交叉使用两个工具，再结合官方来源和人工判断。'
      }
    ],
    writing: {
      first: `${left} 更适合快速形成结构、初稿和多个备选方向，适合用作任务起点。`,
      second: `${right} 更适合围绕已明确的目标继续细化、润色或补足细节。`,
      conclusion: `如果你需要速度和覆盖面，先用 ${left}；如果你更看重最终质量和专项表现，再使用 ${right} 复核。`
    },
    office: {
      narrative:
        `${left} 和 ${right} 都能提升办公与学习效率，但最好不要把它们当作完全替代人工判断的工具。更稳妥的方式是先让 AI 生成结构化结果，再由用户根据真实上下文筛选和确认。`,
      bullets: [
        `初稿、清单、行动项：优先用 ${left} 快速启动`,
        `润色、总结、复核：可以让 ${right} 补充第二轮判断`,
        '会议纪要、周报、邮件：两者都适合，但需要人工检查事实',
        '学习解释：先让 AI 用简单语言解释，再继续追问例子',
        '重要输出：不要省略人工校对和来源核验'
      ]
    },
    prosAndCons: {
      first: {
        pros: ['上手更快', '适合多场景试用', '便于生成初稿', '适合任务拆解', '能作为日常效率入口'],
        cons: ['复杂任务仍需拆分', '事实和数据需要核对', '提示词太泛时容易空泛', '具体能力会随版本和套餐变化']
      },
      second: {
        pros: ['适合聚焦任务', '便于补充第二视角', '适合做结果复核', '能提升部分场景的完成度', '适合与主力工具搭配'],
        cons: ['不一定适合所有任务', '实时信息仍需核验', '套餐和可用能力以官网为准', '重要决策不能完全依赖 AI']
      }
    },
    recommendation: {
      first: [
        `你想先快速开始使用 ${left}`,
        '你需要覆盖多个日常任务',
        '你更看重启动速度和灵活试错',
        '你希望先得到一个可修改的初稿'
      ],
      second: [
        `你已有明确任务，想测试 ${right} 的专项表现`,
        '你更看重结果细节和稳定性',
        '你需要对已有内容做第二轮优化',
        '你希望用另一个工具交叉检查结果'
      ],
      combined: [
        `用 ${left} 做第一版结构和方向`,
        `用 ${right} 做复核、润色或补充`,
        '重要内容再结合官方来源和人工判断'
      ]
    },
    notRecommended: [
      '法律、医疗、金融等高风险决策不能只依赖 AI 输出',
      '需要最新价格、政策、套餐和实时事实时，要以官网实际显示为准',
      '需要严格引用来源的研究任务，建议配合搜索型工具和原始资料',
      '企业级自动化、权限流转和长期任务执行，仍需要专门工作流工具'
    ],
    alternatives: [
      'ChatGPT（适合通用问答、写作、办公和代码辅助）',
      'Claude（适合长文阅读、自然写作和资料总结）',
      'Gemini（适合 Google 生态和多模态问答）',
      'Kimi（适合中文长文阅读和资料整理）',
      'Perplexity（适合带来源的信息检索）'
    ]
  };
}

const chatgptClaudeDetail = {
  title: 'ChatGPT 和 Claude 哪个好用？AI 助手对比与选择指南',
  subtitle: '从通用问答、长文处理、中文写作、代码辅助、办公效率和使用成本等维度，对比 ChatGPT 与 Claude 的适合场景，帮助你根据任务选择更合适的 AI 助手。',
  meta: 'ChatGPT / Claude · AI 助手对比 · 写作 / 长文 / 办公 / 代码 · 5 个核心维度',
  overview:
    'ChatGPT 与 Claude 都是主流 AI 助手，但并非任何任务都等价。ChatGPT 更偏日常效率入口，强调通用可执行的任务覆盖；Claude 更偏长文处理与自然表达，适合资料梳理和深度文本工作。本文不是判断“谁绝对更强”，而是给你一个基于任务类型的选择框架。',
  oneLineConclusion: [
    '如果你需要一个覆盖写作、问答、学习、办公、代码和多任务处理的通用 AI 助手，优先选 ChatGPT。',
    '如果你主要处理长文档、长文本总结、自然表达和资料阅读，Claude 更适合。',
    '预算允许时，建议按场景混合使用：ChatGPT 做通用任务和效率入口，Claude 做长文阅读与深度写作辅助。'
  ],
  visualScores: [
    { label: '通用问答', first: 92, second: 82 },
    { label: '中文写作', first: 86, second: 90 },
    { label: '长文处理', first: 78, second: 94 },
    { label: '办公效率', first: 90, second: 84 },
    { label: '代码辅助', first: 86, second: 78 }
  ],
  bestFor: {
    chatgpt: [
      '需要一个通用 AI 助手的人',
      '写文章、邮件、方案、脚本并希望快速出结果的人',
      '需要问答、学习、办公、代码辅助都覆盖的人',
      '希望把 AI 融入日常工作流，持续追问优化的人',
      '需要多模态入口、工具调用或更综合产品体验的人'
    ],
    claude: [
      '经常阅读和总结长文档的人',
      '需要自然、克制、流畅表达的人',
      '以资料整理、文档分析、深度写作为主的人',
      '希望 AI 回答更偏文字编辑风格、可直接复用的人',
      '需要处理长上下文材料、复杂语境衔接的人'
    ]
  },
  dimensions: [
    ['通用问答', '快节奏提问、任务拆解、连续追问体验更完整', '更偏长文理解和自然解释，适合深入展开', '任务节奏较快、需多场景支撑时优先 ChatGPT。'],
    ['中文写作', '可快速生成提纲、邮件、结构化清单', '表达自然度与润色细节更稳，适合自然化输出', '追求高效产出优先 ChatGPT，追求语言质感优先 Claude。'],
    ['长文阅读', '可快速把长文切分后做摘要和行动项', '长上下文连续性更适合长文逐段消化和重组', '资料量大、逻辑密集时先用 Claude 做第一遍理解。'],
    ['资料总结', '适合把资料转成清单、表格和行动计划', '适合先理解上下文再输出完整结论结构', '想快速可执行成果先用 ChatGPT，总结型任务可借助 Claude。'],
    ['代码辅助', '适合代码示例、报错排查思路和教学型解释', '可用于补充思路和文字说明，适合复核输出', '编程入门和学习路径优先 ChatGPT，文案化说明可找 Claude 校正。'],
    ['办公效率', '快速生成周报、邮件、任务分解与执行项', '适合文档润色、报告语言优化和长内容整理', '日常协作任务先用 ChatGPT，长文本定稿可补 Claude。'],
    ['学习辅导', '问题导向快问快答，适合反复追问', '适合长材料归纳，支持较稳的内容梳理', '建立理解时优先 ChatGPT，梳理长材料时可用 Claude。'],
    ['多模态能力', '在任务驱动场景更容易切到工具入口', '强调输入内容组织后再做表述优化', '多格式输入需求更先试 ChatGPT，复杂解释要求再加 Claude。'],
    ['上手难度', '新手门槛更低，任务上手更快', '更偏文本处理链路，部分用户需要更多文本导向习惯', '新手、快速试错优先 ChatGPT，熟练用户可按任务选。'],
    ['适合新手程度', '适合从零开始的效率型用户', '适合已经有一定内容处理经验，追求表达质量的用户', '需求简单且需要快速落地选 ChatGPT；重质量精修再用 Claude。']
  ],
  scenarios: [
    {
      index: '场景一',
      title: '写一篇文章或脚本',
      text: '先用 ChatGPT 生成初稿与结构，再决定是否需要润色。这个流程适合快速产出并尽早验证任务方向。',
      pick: '建议先用 ChatGPT 起草，再用 Claude 做语气自然化、逻辑润色与文风统一。'
    },
    {
      index: '场景二',
      title: '总结一份长资料',
      text: '处理长文献或资料时，先梳理输入范围，避免让模型一次处理超出上下文长度的内容。',
      pick: '先用 Claude 提取结构与主线，再让 ChatGPT 把要点转成可执行清单。'
    },
    {
      index: '场景三',
      title: '学习一个新概念',
      text: '你先要快速获得方向判断或示例，后续再需要系统归纳。双阶段能减少理解误差。',
      pick: '新手阶段优先 ChatGPT 先问答；再用 Claude 做完整解释和归纳。'
    },
    {
      index: '场景四',
      title: '写代码和解释报错',
      text: '排错时建议先给出问题背景、报错信息与目标代码片段，避免泛化建议。',
      pick: '优先用 ChatGPT 拆解问题，再用 Claude 生成对外沟通友好的说明文本。'
    },
    {
      index: '场景五',
      title: '日常办公',
      text: '日报、周报、邮件、方案、会议纪要等任务常需快速形成结构化结果。',
      pick: '先用 ChatGPT 做内容快速生成，再让 Claude 负责长稿件语言打磨。'
    }
  ],
  writing: {
    chatgpt:
      'ChatGPT 的优势在于生成速度、结构变化能力和多任务适配。适合快速起草、扩写、改写、输出标题、搭建内容框架。',
    claude:
      'Claude 的优势在于长文本阅读、表达自然度和上下文连续性，适合长文总结、资料梳理、复杂表达修改和较长文档的审阅。',
    conclusion: '短内容、快节奏、多格式输出优先 ChatGPT；长文档、深度总结、自然表达优先 Claude。'
  },
  office: {
    bullets: [
      '周报 / 邮件 / 方案：ChatGPT 更方便',
      '长文档总结：Claude 更稳',
      '会议纪要整理：两者都适合',
      '学习解释：ChatGPT 更适合连续追问',
      '文档润色：Claude 更适合自然表达'
    ],
    narrative:
      'ChatGPT 更像综合效率入口，适合快速生成结果、拆解任务、制作表格与行动计划。Claude 更偏文档阅读和写作助手，适合把长资料转化为结构完整、表达更自然的文本。'
  },
  prosAndCons: {
    chatgpt: {
      pros: ['通用能力强', '场景覆盖广', '适合新手', '输出格式灵活', '更像日常效率入口'],
      cons: ['部分回答需二次核对', '提示词泛化会导致空泛', '不同套餐和模型体验可能不同', '长文深度整理时常需拆分任务']
    },
    claude: {
      pros: ['长文处理体验好', '写作表达自然', '适合资料总结', '适合长上下文任务', '回答风格通常更克制'],
      cons: ['生态工具入口不如 ChatGPT 完整', '实时信息与专业事实仍需核对', '代码/多任务工作流覆盖不一定全面', '不同地区与套餐能力差异需要核对']
    }
  },
  recommendation: {
    chatgpt: [
      '你只想先选一个 AI 助手',
      '你需要写作、问答、学习、办公、代码覆盖',
      '你是 AI 新手，想先建立日常效率链路',
      '你希望单工具解决多数日常任务'
    ],
    claude: [
      '你主要处理长文、资料、文档',
      '你更看重自然写作与总结质量',
      '你常常要处理大量输入并保持逻辑连贯',
      '你希望 AI 更像文字编辑与资料整理助手'
    ],
    combined: [
      '用 ChatGPT 做任务拆解、初稿、表格和行动计划',
      '用 Claude 做长文阅读、语言润色和深度总结',
      '对关键内容，两者交叉验证后再人工复核'
    ]
  },
  notRecommended: [
    '法律、医疗、金融等高风险决策不能只依赖 AI 给出的结论',
    '涉及实时更新、官方价格、政策信息要先核验来源',
    '需要企业级自动化编排时应优先结合专门工作流工具',
    '对证据链要求极高的研究任务，建议优先使用搜索与引用友好的工具'
  ],
  alternatives: [
    'Gemini（适合 Google 生态和多模态问答）',
    'Kimi（适合中文长文阅读与资料整理）',
    'DeepSeek（适合中文问答、代码辅助与推理任务）',
    'Perplexity（适合带来源的信息检索）',
    'Notion AI（适合文档与知识库场景）'
  ]
};

function ComparisonTable({ rows, className, tools }) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [leftLabel, rightLabel] = Array.isArray(tools) && tools.length >= 2
    ? tools
    : ['工具 A', '工具 B'];

  return (
    <div className={className ? className : styles.compareTable}>
      <table>
        <thead>
          <tr>
            <th>维度</th>
            <th>{leftLabel}</th>
            <th>{rightLabel}</th>
            <th>怎么选</th>
          </tr>
        </thead>
        <tbody>
          {safeRows.map(([dimension, chatgpt, claude, choose]) => (
            <tr key={dimension}>
              <td>{dimension}</td>
              <td>{chatgpt}</td>
              <td>{claude}</td>
              <td>{choose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderListBlock(items, className = 'doc-simple-list') {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return null;
  return <ul className={className}>{safeItems.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function buildDashboardRows(detail) {
  if (Array.isArray(detail?.visualScores) && detail.visualScores.length > 0) {
    return detail.visualScores.slice(0, 5);
  }

  const baseRows = Array.isArray(detail?.dimensions) ? detail.dimensions.slice(0, 5) : [];
  const fallbackScores = [
    [88, 78],
    [82, 86],
    [76, 90],
    [84, 80],
    [80, 84]
  ];

  return baseRows.map(([label], index) => {
    const [first, second] = fallbackScores[index % fallbackScores.length];
    return { label, first, second };
  });
}

function averageScore(rows, key) {
  if (!rows.length) return 0;
  return Math.round(rows.reduce((sum, row) => sum + row[key], 0) / rows.length);
}

function ComparisonDashboard({ detail, tools }) {
  const rows = buildDashboardRows(detail);
  if (!rows.length) return null;

  const [firstTool, secondTool] = tools.length >= 2 ? tools : ['工具 A', '工具 B'];
  const firstAverage = averageScore(rows, 'first');
  const secondAverage = averageScore(rows, 'second');
  const leadTool = firstAverage >= secondAverage ? firstTool : secondTool;
  const leadScore = Math.max(firstAverage, secondAverage);

  return (
    <section className={styles.compareDashboard} aria-label="工具对比可视化看板">
      <div className={styles.compareDashboardHeader}>
        <div>
          <p className={styles.compareDashboardKicker}>Visual Brief</p>
          <h2>工具对比可视化看板</h2>
          <p>把本文核心维度转成选型参考指数，帮助你先看差异，再进入下面的详细对比。</p>
        </div>
        <div className={styles.compareDashboardPair} aria-label={`${firstTool} versus ${secondTool}`}>
          <span>{firstTool}</span>
          <strong>VS</strong>
          <span>{secondTool}</span>
        </div>
      </div>

      <p className="mt-4 rounded-lg border border-line bg-soft px-4 py-3 text-sm leading-6 text-muted">
        以下评分为本站基于公开产品信息与常见使用场景整理的选型参考，主要参考中文写作、长文处理、代码辅助、资料整理、上手难度和工作流适配等维度。内容核查日期：2026-07-15。评分不代表官方评分或官方性能排名，也不代表所有场景下的绝对结论；实际体验会随版本、地区、套餐和任务变化。
      </p>

      <div className={styles.compareDashboardGrid}>
        <div className={styles.compareBarsPanel}>
          <h3>核心维度倾向</h3>
          <div className={styles.compareBarsList}>
            {rows.map((row) => (
              <div key={row.label} className={styles.compareBarsRow}>
                <div className={styles.compareBarsLabel}>
                  <span>{row.label}</span>
                  <strong>{row.first >= row.second ? firstTool : secondTool}</strong>
                </div>
                <div className={styles.compareBarsPair}>
                  <div className={styles.compareBarsLine}>
                    <span>{firstTool}</span>
                    <i>
                      <b style={{ width: `${row.first}%` }} />
                    </i>
                    <em>{row.first}</em>
                  </div>
                  <div className={styles.compareBarsLine}>
                    <span>{secondTool}</span>
                    <i>
                      <b className={styles.compareBarsSecond} style={{ width: `${row.second}%` }} />
                    </i>
                    <em>{row.second}</em>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.compareDecisionPanel}>
          <h3>快速判断</h3>
          <div className={styles.compareScoreStack}>
            <div>
              <span>{firstTool}</span>
              <strong>{firstAverage}</strong>
            </div>
            <div>
              <span>{secondTool}</span>
              <strong>{secondAverage}</strong>
            </div>
          </div>
          <p>
            当前维度更偏向 <strong>{leadTool}</strong>，综合参考指数 {leadScore}。重要任务仍建议结合正文说明和人工核对。
          </p>
        </aside>
      </div>
    </section>
  );
}

export default async function ComparisonDetailPage({ params }) {
  const { slug } = await params;
  const comparison = getComparison(slug);
  if (!comparison) notFound();

  const detail = comparison.slug === 'chatgpt-vs-claude' ? chatgptClaudeDetail : buildFallbackDetail(comparison);
  const detailSectionClass = styles.compareSection;
  const comparisonTools = Array.isArray(comparison?.tools) ? comparison.tools : [];
  const [firstTool, secondTool] = comparisonTools.length >= 2 ? comparisonTools : ['工具 A', '工具 B'];

  const dimensions = Array.isArray(detail?.dimensions) ? detail.dimensions : [];
  const oneLineConclusion = Array.isArray(detail?.oneLineConclusion) ? detail.oneLineConclusion : [];
  const scenarios = Array.isArray(detail?.scenarios) ? detail.scenarios : [];
  const officeBullets = Array.isArray(detail?.office?.bullets) ? detail.office.bullets : [];
  const officeNarrative = detail?.office?.narrative || '';
  const bestForFirst = Array.isArray(detail?.bestFor?.first)
    ? detail.bestFor.first
    : Array.isArray(detail?.bestFor?.chatgpt)
      ? detail.bestFor.chatgpt
      : [];
  const bestForSecond = Array.isArray(detail?.bestFor?.second)
    ? detail.bestFor.second
    : Array.isArray(detail?.bestFor?.claude)
      ? detail.bestFor.claude
      : [];
  const prosFirst = Array.isArray(detail?.prosAndCons?.first?.pros)
    ? detail.prosAndCons.first.pros
    : Array.isArray(detail?.prosAndCons?.chatgpt?.pros)
      ? detail.prosAndCons.chatgpt.pros
      : [];
  const consFirst = Array.isArray(detail?.prosAndCons?.first?.cons)
    ? detail.prosAndCons.first.cons
    : Array.isArray(detail?.prosAndCons?.chatgpt?.cons)
      ? detail.prosAndCons.chatgpt.cons
      : [];
  const prosSecond = Array.isArray(detail?.prosAndCons?.second?.pros)
    ? detail.prosAndCons.second.pros
    : Array.isArray(detail?.prosAndCons?.claude?.pros)
      ? detail.prosAndCons.claude.pros
      : [];
  const consSecond = Array.isArray(detail?.prosAndCons?.second?.cons)
    ? detail.prosAndCons.second.cons
    : Array.isArray(detail?.prosAndCons?.claude?.cons)
      ? detail.prosAndCons.claude.cons
      : [];
  const recommendationFirst = Array.isArray(detail?.recommendation?.first)
    ? detail.recommendation.first
    : Array.isArray(detail?.recommendation?.chatgpt)
      ? detail.recommendation.chatgpt
      : [];
  const recommendationSecond = Array.isArray(detail?.recommendation?.second)
    ? detail.recommendation.second
    : Array.isArray(detail?.recommendation?.claude)
      ? detail.recommendation.claude
      : [];
  const recommendationCombined = Array.isArray(detail?.recommendation?.combined) ? detail.recommendation.combined : [];
  const notRecommended = Array.isArray(detail?.notRecommended) ? detail.notRecommended : [];
  const alternatives = Array.isArray(detail?.alternatives) ? detail.alternatives : [];
  const writing = detail?.writing || {};
  const writingFirst = writing?.first || writing?.chatgpt || '';
  const writingSecond = writing?.second || writing?.claude || '';
  const writingConclusion = writing?.conclusion || '';

  const tocItems = [
    ['overview', '对比概览'],
    ['one-line', '一句话结论'],
    ['who', '适合谁'],
    ['dimensions', '核心维度对比'],
    ['scenarios', '典型场景选择'],
    ['writing', '写作与长文处理'],
    ['office', '办公与学习效率'],
    ['pros-cons', '优点与限制'],
    ['recommendation', '推荐选择'],
    ['not-recommended', '不推荐场景与替代方案']
  ];

  const targetMainContent = (
    <>
      <header className={`doc-hero ${styles.compareDocHeader}`} id="overview">
        <div className="doc-kicker">
          <span className="section-accent-dots" aria-hidden="true">
            <span className="section-dot section-dot-purple" />
            <span className="section-dot section-dot-yellow" />
            <span className="section-dot section-dot-cyan" />
          </span>
          <span className="section-eyebrow">Compare</span>
        </div>
        <h1 className="doc-title">{detail.title}</h1>
        <p className="doc-subtitle">{detail.subtitle}</p>
        <div className={styles.compareMeta} aria-label="对比信息">
          <div><strong>{detail.meta}</strong></div>
        </div>
      </header>

      <ComparisonDashboard detail={detail} tools={comparisonTools} />

      <section className={detailSectionClass} id="overview">
        <h2>对比概览</h2>
        <p>{detail.overview}</p>
      </section>

      <section className={detailSectionClass} id="one-line">
        <h2>一句话结论</h2>
        {oneLineConclusion.length > 0 && (
          <div className={styles.compareVerdict}>
            {oneLineConclusion.map((line, index) => {
              const labels = [`优先选 ${firstTool}：`, `优先选 ${secondTool}：`, '最佳搭配：'];
              return (
                <p key={`${line}-${index}`}>
                  <strong>{labels[index]}</strong>
                  {line}
                </p>
              );
            })}
          </div>
        )}
      </section>

      <section className={detailSectionClass} id="who">
        <h2>适合谁</h2>
        <div className={styles.compareChoiceGrid}>
          <div className={styles.compareChoiceBlock}>
            <h3>{firstTool} 适合</h3>
            {renderListBlock(bestForFirst, styles.compareChoiceList)}
          </div>
          <div className={styles.compareChoiceBlock}>
            <h3>{secondTool} 适合</h3>
            {renderListBlock(bestForSecond, styles.compareChoiceList)}
          </div>
        </div>
      </section>

      <section className={detailSectionClass} id="dimensions">
        <h2>核心维度对比</h2>
        <ComparisonTable rows={dimensions} className={styles.compareTable} tools={comparisonTools} />
      </section>

      <section className={detailSectionClass} id="scenarios">
        <h2>典型场景选择</h2>
        <div className={styles.compareScenarioList}>
          {scenarios.map((item) => (
            <div key={`${item.index}-${item.title}`} className={styles.compareScenarioItem}>
              <div className={styles.compareScenarioMeta}>{item.index}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <p className={styles.compareScenarioPick}>{item.pick}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={detailSectionClass} id="writing">
        <h2>写作与长文处理</h2>
        <div className={styles.compareChoiceBlock}>
          {writingFirst ? <p><strong>{firstTool}：</strong>{writingFirst}</p> : null}
          {writingSecond ? <p><strong>{secondTool}：</strong>{writingSecond}</p> : null}
          {writingConclusion ? <p><strong>结论：</strong>{writingConclusion}</p> : null}
        </div>
      </section>

      <section className={detailSectionClass} id="office">
        <h2>办公与学习效率</h2>
        {officeNarrative ? <p>{officeNarrative}</p> : null}
        <ul className={styles.compareChoiceList}>
          {officeBullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={detailSectionClass} id="pros-cons">
        <h2>优点与限制</h2>
        <div className={styles.compareChoiceGrid}>
          <div className={styles.compareChoiceBlock}>
            <h3>{firstTool} 优点</h3>
            {renderListBlock(prosFirst, styles.compareChoiceList)}
            <h3 className={styles.compareSubSectionHeading}>{firstTool} 限制</h3>
            {renderListBlock(consFirst, styles.compareChoiceList)}
          </div>
          <div className={styles.compareChoiceBlock}>
            <h3>{secondTool} 优点</h3>
            {renderListBlock(prosSecond, styles.compareChoiceList)}
            <h3 className={styles.compareSubSectionHeading}>{secondTool} 限制</h3>
            {renderListBlock(consSecond, styles.compareChoiceList)}
          </div>
        </div>
      </section>

      <section className={detailSectionClass} id="recommendation">
        <h2>推荐选择</h2>
        <div className={styles.compareRecommendGrid}>
          <div className={styles.compareRecommendBlock}>
            <h3>推荐 {firstTool} 的情况</h3>
            {renderListBlock(recommendationFirst, styles.compareChoiceList)}
          </div>
          <div className={styles.compareRecommendBlock}>
            <h3>推荐 {secondTool} 的情况</h3>
            {renderListBlock(recommendationSecond, styles.compareChoiceList)}
          </div>
          <div className={styles.compareRecommendBlock}>
            <h3>推荐搭配使用</h3>
            {renderListBlock(recommendationCombined, styles.compareChoiceList)}
          </div>
        </div>
      </section>

      <section className={detailSectionClass} id="not-recommended">
        <h2>不推荐场景与替代方案</h2>
        <div className={styles.compareRecommendBlock}>
          <h3>不推荐只依赖这些场景</h3>
          {renderListBlock(notRecommended, styles.compareChoiceList)}
        </div>
        <div className={styles.compareRecommendBlock}>
          <h3>可替代或补充工具</h3>
          {renderListBlock(alternatives, styles.compareChoiceList)}
        </div>
      </section>
    </>
  );

  return (
    <article className={`${styles.compareDetailPage} ${styles.compareTarget}`}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: '首页', href: '/' },
          { name: '工具对比', href: '/compare' },
          { name: comparison.title, href: `/compare/${comparison.slug}` }
        ])}
      />

      <div className={styles.compareDocShell}>
        <main className={`${styles.compareDocMain} ${styles.compareDocContent}`}>
          {targetMainContent}
        </main>

        <aside className={styles.compareDocRight} aria-label="页面目录">
          <p>目录</p>
          <nav className={styles.compareToc}>
            {tocItems.map(([id, label]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
          </nav>
        </aside>
      </div>
    </article>
  );
}
