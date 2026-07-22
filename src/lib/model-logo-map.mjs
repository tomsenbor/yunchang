const vendorLogoMeta = Object.freeze({
  openai: { src: '/icons/ai-models/openai.svg', alt: 'OpenAI Logo', fallbackText: 'OpenAI' },
  anthropic: { src: '/icons/ai-models/anthropic.svg', alt: 'Anthropic Logo', fallbackText: 'Anthropic' },
  google: { src: '/icons/ai-models/google-gemini.svg', alt: 'Gemini Logo', fallbackText: 'Gemini' },
  deepseek: { src: '/icons/ai-models/deepseek.svg', alt: 'DeepSeek Logo', fallbackText: 'DeepSeek' },
  'alibaba-cloud': { src: '/icons/ai-models/qwen.svg', alt: 'Qwen Logo', fallbackText: 'Qwen' },
  meta: { src: '/icons/ai-models/meta.svg', alt: 'Meta Logo', fallbackText: 'Meta' },
  xai: { src: '/icons/ai-models/xai.png', alt: 'xAI Logo', fallbackText: 'xAI' },
  'mistral-ai': { src: '/icons/ai-models/mistral-ai.svg', alt: 'Mistral AI Logo', fallbackText: 'Mistral' },
  'moonshot-ai': { src: '/icons/ai-models/moonshot-kimi.svg', alt: 'Kimi Logo', fallbackText: 'Kimi' },
  'zhipu-ai': { src: '/icons/ai-models/zhipu-glm.svg', alt: 'Zhipu AI Logo', fallbackText: 'GLM' }
});

export const vendorLogoMap = Object.freeze(Object.fromEntries(
  Object.entries(vendorLogoMeta).map(([vendorSlug, logo]) => [vendorSlug, logo.src])
));

// Current model versions do not publish distinct version-level marks. Keep this
// override map explicit so a future verified model mark can replace its vendor mark.
export const modelLogoMap = Object.freeze({});

function textFallback(name = 'AI') {
  const fallbackText = String(name).trim() || 'AI';
  return {
    type: 'text',
    src: null,
    alt: `${fallbackText} Logo`,
    fallbackText
  };
}

function imageLogo(meta) {
  return {
    type: 'image',
    src: meta.src,
    alt: meta.alt,
    fallbackText: meta.fallbackText
  };
}

export function resolveVendorLogo(vendorOrSlug) {
  const vendorSlug = typeof vendorOrSlug === 'string' ? vendorOrSlug : vendorOrSlug?.id;
  const meta = vendorLogoMeta[vendorSlug];
  return meta ? imageLogo(meta) : textFallback(vendorOrSlug?.name || vendorSlug);
}

export function resolveModelLogo(model, vendor = null) {
  const modelOverride = modelLogoMap[model?.slug];
  if (modelOverride) {
    return imageLogo({
      src: modelOverride,
      alt: `${model?.name || 'AI 模型'} Logo`,
      fallbackText: model?.name || 'AI'
    });
  }

  return resolveVendorLogo(vendor || model?.vendorSlug);
}
