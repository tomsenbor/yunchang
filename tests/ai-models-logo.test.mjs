import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { currentAiModels, modelRoutes, modelVendors } from '../src/lib/model-content.mjs';

const logoMapUrl = new URL('../src/lib/model-logo-map.mjs', import.meta.url);
const logoComponentUrl = new URL('../src/components/ModelLogo.jsx', import.meta.url);
const explorerUrl = new URL('../src/components/ModelExplorer.jsx', import.meta.url);
const databaseUrl = new URL('../src/components/ModelDatabase.jsx', import.meta.url);
const comparisonUrl = new URL('../src/components/ModelComparison.jsx', import.meta.url);
const detailPageUrl = new URL('../src/app/ai-models/[slug]/page.js', import.meta.url);
const detailStylesUrl = new URL('../src/app/ai-models/[slug]/page.module.css', import.meta.url);
const stylesUrl = new URL('../src/app/ai-models/ai-models.module.css', import.meta.url);

const logoModuleExists = existsSync(fileURLToPath(logoMapUrl));
const logoComponentExists = existsSync(fileURLToPath(logoComponentUrl));

function publicFileUrl(src) {
  return new URL(`../public/${src.replace(/^\/+/, '')}`, import.meta.url);
}

test('AI model logo map and shared component exist', () => {
  assert.equal(logoModuleExists, true, 'model-logo-map.mjs should exist');
  assert.equal(logoComponentExists, true, 'ModelLogo.jsx should exist');
});

test('all ten vendors resolve to non-empty local image logos', { skip: !logoModuleExists }, async () => {
  const { resolveVendorLogo, vendorLogoMap } = await import(logoMapUrl);

  assert.equal(modelVendors.length, 10);
  assert.deepEqual(Object.keys(vendorLogoMap).sort(), modelVendors.map((vendor) => vendor.id).sort());

  for (const vendor of modelVendors) {
    const logo = resolveVendorLogo(vendor);
    assert.ok(['image', 'text'].includes(logo.type), `${vendor.id} must resolve to a supported logo type`);
    assert.ok(logo.fallbackText, `${vendor.id} must provide a fallback label`);
    if (logo.type === 'image') {
      assert.ok(logo.src, `${vendor.id} image logo must have a src`);
      assert.equal(existsSync(fileURLToPath(publicFileUrl(logo.src))), true, `${vendor.id} local logo must exist`);
    } else {
      assert.equal(logo.src, null, `${vendor.id} text fallback must not become an image request`);
    }
  }
});

test('all 31 current models resolve through the locked vendor or family identity', { skip: !logoModuleExists }, async () => {
  const { resolveModelLogo } = await import(logoMapUrl);
  const expectedLogos = new Map([
    ['gpt-5-6-sol', 'openai.svg'],
    ['claude-sonnet-5', 'anthropic.svg'],
    ['gemini-3-1-pro-preview', 'google-gemini.svg'],
    ['deepseek-v4-pro', 'deepseek.svg'],
    ['qwen3-7-max', 'qwen.svg'],
    ['llama-4-scout', 'meta.svg'],
    ['grok-4-5', 'xai.png'],
    ['mistral-medium-3-5', 'mistral-ai.svg'],
    ['kimi-k3', 'moonshot-kimi.svg'],
    ['glm-5-2', 'zhipu-glm.svg']
  ]);

  assert.equal(currentAiModels.length, 31);
  assert.equal(modelRoutes.length, 31);

  for (const model of currentAiModels) {
    const logo = resolveModelLogo(model);
    assert.ok(['image', 'text'].includes(logo.type), `${model.slug} must resolve to image or text`);
    assert.ok(logo.fallbackText, `${model.slug} must have a fallback label`);
    if (logo.type === 'image') {
      assert.ok(logo.src, `${model.slug} image logo must not have an empty src`);
      assert.equal(existsSync(fileURLToPath(publicFileUrl(logo.src))), true, `${model.slug} local logo must exist`);
    } else {
      assert.equal(logo.src, null, `${model.slug} text fallback must not become an image request`);
    }
  }

  for (const [slug, fileName] of expectedLogos) {
    assert.match(resolveModelLogo(currentAiModels.find((model) => model.slug === slug)).src, new RegExp(`/${fileName.replace('.', '\\.')}$`));
  }
});

test('local SVG logos contain no scripts, event handlers or unsafe external references', { skip: !logoModuleExists }, async () => {
  const { vendorLogoMap } = await import(logoMapUrl);
  const svgPaths = [...new Set(Object.values(vendorLogoMap).filter((src) => src.endsWith('.svg')))];

  for (const src of svgPaths) {
    const svg = await readFile(publicFileUrl(src), 'utf8');
    assert.doesNotMatch(svg, /<script\b/i, `${src} must not contain script tags`);
    assert.doesNotMatch(svg, /\son\w+\s*=/i, `${src} must not contain inline event handlers`);
    assert.doesNotMatch(svg, /(?:href|src)\s*=\s*["']https?:\/\//i, `${src} must not contain external asset references`);
  }
});

test('shared ModelLogo handles fixed sizing, alt text and image failure fallback', { skip: !logoComponentExists }, async () => {
  const component = await readFile(logoComponentUrl, 'utf8');

  assert.match(component, /resolveModelLogo/);
  assert.match(component, /resolveVendorLogo/);
  assert.match(component, /width=\{imageSize\}/);
  assert.match(component, /height=\{imageSize\}/);
  assert.match(component, /onError=/);
  assert.match(component, /fallbackText/);
  assert.match(component, /alt=\{decorative \? '' : logo\.alt\}/);
});

test('detail hero keeps its existing 64px desktop and 48px mobile logo frame', async () => {
  const [detailPage, detailStyles] = await Promise.all([
    readFile(detailPageUrl, 'utf8'),
    readFile(detailStylesUrl, 'utf8')
  ]);

  assert.doesNotMatch(detailPage, /<ModelLogo[^>]*frameSize=\{64\}/);
  assert.match(detailStyles, /\.vendorMark\s*\{[^}]*width:\s*64px[^}]*height:\s*64px/s);
  assert.match(detailStyles, /@media \(max-width: 639px\)[\s\S]*\.vendorMark\s*\{[^}]*width:\s*48px[^}]*height:\s*48px/s);
});

test('every AI model display surface uses the shared logo resolver without abbreviation placeholders', { skip: !logoComponentExists }, async () => {
  const sources = await Promise.all([explorerUrl, databaseUrl, comparisonUrl, detailPageUrl].map((url) => readFile(url, 'utf8')));
  const [explorer, database, comparison, detailPage] = sources;
  const combined = sources.join('\n');

  assert.match(explorer, /<ModelLogo[\s\S]*vendor=\{vendor\}/);
  assert.match(database, /<ModelLogo[\s\S]*model=\{model\}/);
  assert.match(comparison, /<ModelLogo[\s\S]*model=\{model\}/);
  assert.match(detailPage, /<ModelLogo[\s\S]*model=\{model\}/);
  assert.match(detailPage, /relatedModels\.map[\s\S]*<ModelLogo/);
  assert.doesNotMatch(combined, /name\?*\.?slice\(0,\s*2\)|name\.slice\(0,\s*2\)/);
  assert.doesNotMatch(combined, />\s*(?:Op|An|Go|xA)\s*</);
});

test('hero search moves visible keyboard focus from the input rectangle to the outer pill', async () => {
  const styles = await readFile(stylesUrl, 'utf8');

  assert.match(styles, /\.heroSearch:focus-within\s*\{[^}]*border-color:\s*rgba\(54,\s*215,\s*232,[^)]+\)[^}]*box-shadow:/s);
  assert.match(styles, /\.heroSearch input\s*\{[^}]*border:\s*0[^}]*outline:\s*0[^}]*box-shadow:\s*none[^}]*background:\s*transparent/s);
  assert.match(styles, /\.heroSearch input:focus-visible\s*\{[^}]*outline:\s*0[^}]*box-shadow:\s*none/s);
  assert.doesNotMatch(styles, /\.heroSearch input:focus-visible\s*\{[^}]*outline:\s*[1-9]/s);
});
