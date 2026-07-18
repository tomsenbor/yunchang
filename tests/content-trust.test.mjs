import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');

test('live pages do not expose prelaunch placeholder copy', () => {
  const sources = [
    'src/components/Footer.jsx',
    'src/app/guides/page.js',
    'src/app/compare/page.js',
    'src/app/contact/page.js',
    'src/app/privacy/page.js',
    'src/app/templates/page.js',
    'src/app/free-ai-tools/page.js',
    'src/app/about/page.js',
    'src/app/ai-tools/page.js',
    'src/app/ai-tools/[slug]/page.js',
    'src/app/methodology/page.js',
    'src/app/videos/[slug]/page.js'
  ].map(read).join('\n');
  const bannedCopy = [
    '预留',
    '待完善',
    '上线前',
    '后续补充',
    '后续扩展',
    '可扩展',
    '预留人工补充',
    '正式上线前',
    '当前项目模板',
    '后续可扩展',
    '后续建议补充',
    '站内占位',
    '没有真实视频链接'
  ];

  for (const phrase of bannedCopy) {
    assert.ok(!sources.includes(phrase), `上线页面仍包含占位文案：${phrase}`);
  }
});

test('free tool cards disclose verification and official-source details', () => {
  const source = `${read('src/app/free-ai-tools/page.js')}\n${read('src/components/Cards.jsx')}`;
  const requiredCopy = [
    '核查日期',
    '免费额度 / 限制',
    '是否需要登录',
    '官方来源',
    '官方入口',
    '价格或套餐以官方实际页面为准',
    'tool.affiliateUrl'
  ];

  for (const phrase of requiredCopy) {
    assert.ok(source.includes(phrase), `免费工具信息缺少：${phrase}`);
  }
});

test('compare scores disclose methodology, date, and limitations', () => {
  const source = [
    'src/lib/site-data.mjs',
    'src/app/ai-tools/[slug]/page.js',
    'src/app/free-ai-tools/page.js',
    'src/app/compare/[slug]/page.js',
    'src/app/methodology/page.js'
  ].map(read).join('\n');
  const requiredCopy = [
    '评分基于功能完整度、易用性、适用场景、免费体验和实际使用反馈综合评估',
    '最近更新时间',
    '中文写作',
    '长文处理',
    '代码辅助',
    '资料整理',
    '上手难度',
    '工作流适配',
    '内容核查日期',
    '不代表官方评分',
    '不代表所有场景下的绝对结论'
  ];

  for (const phrase of requiredCopy) {
    assert.ok(source.includes(phrase), `对比评分说明缺少：${phrase}`);
  }
});

test('home hero uses a Chinese SEO h1 while retaining the English visual title', () => {
  const source = read('src/components/HomeHero.jsx');

  assert.ok(
    source.includes('<span className="sr-only">AI效率工具库｜全球AI工具教程、评测与工作流</span>'),
    '首页缺少中文核心关键词 H1'
  );
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1, '首页 Hero 应只有一个主要 H1');
  assert.ok(source.includes('aria-label={heroTitle}'), '首页英文视觉标题缺少原有辅助阅读标签');
  assert.ok(source.includes('fluid-main-title'), '首页英文视觉标题样式被移除');
  assert.ok(source.includes('AI FLUID LAB'), '首页英文品牌视觉文案被移除');
});

test('methodology page discloses sources, dimensions, updates, scoring, and cooperation', () => {
  const source = `${read('src/app/methodology/page.js')}\n${read('src/lib/site-data.mjs')}`;
  const requiredCopy = [
    '工具信息来源',
    '测试维度',
    '功能能力',
    '易用性',
    '免费额度',
    '适合人群',
    '实际工作场景',
    '更新频率',
    '评分标准',
    '商业合作说明',
    "'/methodology'"
  ];

  for (const phrase of requiredCopy) {
    assert.ok(source.includes(phrase), `评测方法页缺少：${phrase}`);
  }
});
