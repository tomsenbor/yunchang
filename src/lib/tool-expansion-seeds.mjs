const categoryProfiles = {
  chatbot: {
    label: 'AI 助手',
    capabilities: ['对话问答', '内容整理', '任务辅助'],
    useCases: ['日常问答', '写作辅助', '资料整理'],
    relatedGuides: ['chatgpt-beginner-guide', 'choose-ai-assistant-guide', 'ai-assistant-study-plan-guide'],
    relatedComparisons: ['chatgpt-vs-claude', 'gemini-vs-chatgpt'],
    relatedVideos: ['chatgpt-3min-guide']
  },
  'image-ai': {
    label: 'AI 图片工具',
    capabilities: ['图片生成', '视觉创意', '素材制作'],
    useCases: ['营销配图', '概念视觉', '社交媒体素材'],
    relatedGuides: ['ai-image-prompt-guide', 'ai-image-poster-guide', 'choose-ai-creative-tool-guide'],
    relatedComparisons: ['midjourney-vs-tongyi-wanxiang'],
    relatedVideos: ['midjourney-image-video']
  },
  'video-ai': {
    label: 'AI 视频工具',
    capabilities: ['视频生成', '镜头制作', '视频编辑'],
    useCases: ['短视频制作', '营销视频', '创意分镜'],
    relatedGuides: ['text-to-video-workflow-guide', 'ai-video-script-guide', 'choose-ai-creative-tool-guide'],
    relatedComparisons: ['runway-vs-kling-video'],
    relatedVideos: ['runway-video-generation-video']
  },
  'coding-ai': {
    label: 'AI 编程工具',
    capabilities: ['代码辅助', '项目理解', '调试建议'],
    useCases: ['代码补全', '代码库阅读', '开发调试'],
    relatedGuides: ['cursor-ai-coding-guide', 'ai-codebase-reading-guide', 'ai-debugging-workflow-guide'],
    relatedComparisons: ['cursor-vs-claude-code'],
    relatedVideos: ['cursor-ai-coding-video']
  },
  'audio-ai': {
    label: 'AI 音频工具',
    capabilities: ['语音生成', '音频创作', '声音编辑'],
    useCases: ['视频配音', '音乐创作', '课程旁白'],
    relatedGuides: ['elevenlabs-ai-voice-guide', 'ai-tools-for-creators', 'choose-ai-creative-tool-guide'],
    relatedComparisons: ['elevenlabs-vs-china-ai-voice'],
    relatedVideos: ['elevenlabs-voice-video']
  }
};

const definitions = [
  // AI assistants: 20
  ['Grok', 'grok', 'xAI', 'https://grok.com/', 'chatbot', '实时信息问答与趋势理解', ['实时信息', '对话问答', '内容分析']],
  ['Poe', 'poe', 'Quora', 'https://poe.com/', 'chatbot', '在同一入口使用多种 AI 模型', ['多模型对话', '机器人创建', '提示词复用']],
  ['Character AI', 'character-ai', 'Character.AI', 'https://character.ai/', 'chatbot', '角色对话与互动内容创作', ['角色对话', '互动故事', '人物设定']],
  ['You.com', 'you-com', 'You.com', 'https://you.com/', 'chatbot', '搜索辅助与资料问答', ['AI 搜索', '来源整理', '对话问答']],
  ['Pi', 'pi-ai', 'Inflection AI', 'https://pi.ai/', 'chatbot', '自然对话与个人陪伴式交流', ['自然对话', '想法梳理', '沟通练习']],
  ['Le Chat', 'mistral-le-chat', 'Mistral AI', 'https://chat.mistral.ai/chat', 'chatbot', '通用问答与文档处理', ['对话问答', '文档理解', '内容生成']],
  ['Meta AI', 'meta-ai', 'Meta', 'https://www.meta.ai/', 'chatbot', '通用问答与社交场景辅助', ['对话问答', '创意生成', '社交内容']],
  ['HuggingChat', 'huggingchat', 'Hugging Face', 'https://huggingface.co/chat/', 'chatbot', '体验开源模型与通用问答', ['开源模型', '对话问答', '模型体验']],
  ['Phind', 'phind', 'Phind', 'https://www.phind.com/', 'chatbot', '面向开发问题的搜索与解答', ['技术搜索', '代码解释', '问题排查']],
  ['Duck.ai', 'duckduckgo-ai-chat', 'DuckDuckGo', 'https://duck.ai/', 'chatbot', '注重隐私的多模型对话', ['隐私对话', '多模型问答', '内容总结']],
  ['Coze', 'coze', 'ByteDance', 'https://www.coze.com/', 'chatbot', '搭建对话机器人与自动化工作流', ['机器人搭建', '工作流', '知识库']],
  ['Monica', 'monica', 'Monica', 'https://monica.im/', 'chatbot', '浏览器内的阅读、写作与翻译辅助', ['网页总结', '写作辅助', '翻译']],
  ['Chatsonic', 'chatsonic', 'Writesonic', 'https://writesonic.com/chat', 'chatbot', '营销写作与联网对话', ['营销写作', '联网问答', '内容生成']],
  ['Jasper', 'jasper-chat', 'Jasper', 'https://www.jasper.ai/chat', 'chatbot', '品牌营销内容与团队写作', ['品牌内容', '营销文案', '团队协作']],
  ['Copy.ai', 'copy-ai', 'Copy.ai', 'https://www.copy.ai/', 'chatbot', '销售和营销文案工作流', ['销售文案', '营销工作流', '内容改写']],
  ['Writesonic', 'writesonic', 'Writesonic', 'https://writesonic.com/', 'chatbot', '博客、营销和搜索内容制作', ['博客写作', 'SEO 内容', '营销文案']],
  ['Grammarly', 'grammarly', 'Grammarly', 'https://www.grammarly.com/ai', 'chatbot', '英文写作检查与表达优化', ['语法检查', '写作润色', '语气调整']],
  ['QuillBot', 'quillbot', 'QuillBot', 'https://quillbot.com/', 'chatbot', '改写、摘要与英文写作辅助', ['内容改写', '文本摘要', '语法检查']],
  ['Otter.ai', 'otter-ai', 'Otter.ai', 'https://otter.ai/', 'chatbot', '会议转写与纪要整理', ['会议转写', '纪要生成', '行动项整理']],
  ['Fireflies.ai', 'fireflies-ai', 'Fireflies.ai', 'https://fireflies.ai/', 'chatbot', '会议记录、搜索与协作分析', ['会议记录', '对话搜索', '团队协作']],

  // AI image tools: 20
  ['DALL-E', 'dall-e', 'OpenAI', 'https://openai.com/index/dall-e-3/', 'image-ai', '根据文字描述生成和修改图片', ['文生图', '图片编辑', '创意构图']],
  ['Stable Diffusion', 'stable-diffusion', 'Stability AI', 'https://stability.ai/stable-image', 'image-ai', '开放式图片生成与工作流定制', ['文生图', '模型定制', '本地工作流']],
  ['Leonardo AI', 'leonardo-ai', 'Leonardo.Ai', 'https://leonardo.ai/', 'image-ai', '游戏、美术和品牌视觉生成', ['图片生成', '风格控制', '素材编辑']],
  ['Ideogram', 'ideogram', 'Ideogram', 'https://ideogram.ai/', 'image-ai', '包含文字排版的视觉图片生成', ['文字生成', '海报设计', '风格参考']],
  ['Adobe Firefly', 'adobe-firefly', 'Adobe', 'https://firefly.adobe.com/', 'image-ai', '创意设计与 Adobe 工作流辅助', ['图片生成', '生成式填充', '设计工作流']],
  ['Playground AI', 'playground-ai', 'Playground AI', 'https://playground.com/', 'image-ai', '快速生成和编辑创意图片', ['图片生成', '画布编辑', '风格探索']],
  ['FLUX', 'flux-ai', 'Black Forest Labs', 'https://bfl.ai/', 'image-ai', '高质量图片生成与模型调用', ['图片生成', '提示词理解', '模型调用']],
  ['Recraft', 'recraft', 'Recraft', 'https://www.recraft.ai/', 'image-ai', '品牌图形、插画和矢量素材制作', ['矢量生成', '品牌设计', '插画制作']],
  ['Clipdrop', 'clipdrop', 'Clipdrop', 'https://clipdrop.co/', 'image-ai', '图片清理、扩图和背景处理', ['背景移除', '图片扩展', '画质增强']],
  ['DreamStudio', 'dreamstudio', 'Stability AI', 'https://dreamstudio.ai/', 'image-ai', '通过 Stable Diffusion 生成图片', ['文生图', '参数控制', '风格生成']],
  ['NightCafe', 'nightcafe', 'NightCafe', 'https://creator.nightcafe.studio/', 'image-ai', '多模型艺术图片生成与社区创作', ['艺术生成', '多模型', '社区创作']],
  ['Craiyon', 'craiyon', 'Craiyon', 'https://www.craiyon.com/', 'image-ai', '轻量文字生成图片', ['文生图', '概念草图', '快速创意']],
  ['Photoroom', 'photoroom', 'Photoroom', 'https://www.photoroom.com/', 'image-ai', '商品图片与电商视觉处理', ['商品图', '背景替换', '批量编辑']],
  ['remove.bg', 'remove-bg', 'remove.bg', 'https://www.remove.bg/', 'image-ai', '自动移除图片背景', ['背景移除', '透明底图', '批量处理']],
  ['Krea AI', 'krea-ai', 'Krea', 'https://www.krea.ai/', 'image-ai', '实时生成和增强视觉素材', ['实时生成', '图片增强', '风格控制']],
  ['Artbreeder', 'artbreeder', 'Artbreeder', 'https://www.artbreeder.com/', 'image-ai', '混合和调整角色与艺术图像', ['图像混合', '角色设计', '参数调整']],
  ['Mage', 'mage-space', 'Mage', 'https://www.mage.space/', 'image-ai', '在线生成多种风格图片', ['文生图', '风格模型', '图片变体']],
  ['getimg.ai', 'getimg-ai', 'getimg.ai', 'https://getimg.ai/', 'image-ai', '图片生成、编辑和工作流调用', ['图片生成', '局部重绘', 'API 工作流']],
  ['SeaArt AI', 'seaart-ai', 'SeaArt', 'https://www.seaart.ai/', 'image-ai', '多模型图片创作与工作流分享', ['多模型生成', '风格创作', '工作流']],
  ['Pixlr AI', 'pixlr-ai', 'Pixlr', 'https://pixlr.com/', 'image-ai', '在线图片编辑与生成式处理', ['图片编辑', '生成式填充', '背景处理']],

  // AI video tools: 18
  ['Pika', 'pika', 'Pika', 'https://pika.art/', 'video-ai', '文字或图片生成创意短视频', ['文生视频', '图生视频', '视频特效']],
  ['Luma Dream Machine', 'luma-dream-machine', 'Luma AI', 'https://lumalabs.ai/dream-machine', 'video-ai', '生成具有镜头运动的视频片段', ['文生视频', '图生视频', '镜头运动']],
  ['HeyGen', 'heygen', 'HeyGen', 'https://www.heygen.com/', 'video-ai', '数字人讲解和多语言营销视频', ['数字人', '口型同步', '视频翻译']],
  ['Synthesia', 'synthesia', 'Synthesia', 'https://www.synthesia.io/', 'video-ai', '企业培训与数字人讲解视频', ['数字人视频', '培训内容', '多语言制作']],
  ['Vidu', 'vidu', '生数科技', 'https://www.vidu.com/', 'video-ai', '文字和图片生成视频片段', ['文生视频', '图生视频', '主体一致性']],
  ['Hailuo AI', 'hailuo-ai', 'MiniMax', 'https://hailuoai.video/', 'video-ai', '创意镜头与角色视频生成', ['文生视频', '图生视频', '角色镜头']],
  ['Sora', 'sora', 'OpenAI', 'https://sora.com/', 'video-ai', '基于提示词生成和编辑视频', ['视频生成', '故事板', '视频编辑']],
  ['Veo', 'veo', 'Google DeepMind', 'https://deepmind.google/models/veo/', 'video-ai', '高质量视频生成与镜头理解', ['文生视频', '镜头控制', '视频生成']],
  ['InVideo AI', 'invideo-ai', 'InVideo', 'https://invideo.io/ai/', 'video-ai', '从脚本快速制作完整视频', ['脚本转视频', '素材编排', '配音字幕']],
  ['VEED AI', 'veed-ai', 'VEED', 'https://www.veed.io/tools/ai-video', 'video-ai', '在线视频编辑与 AI 视频制作', ['视频编辑', '自动字幕', '脚本生成']],
  ['Descript', 'descript', 'Descript', 'https://www.descript.com/', 'video-ai', '通过编辑文本处理音视频内容', ['文本剪辑', '转写', '播客视频']],
  ['OpusClip', 'opus-clip', 'OpusClip', 'https://www.opus.pro/', 'video-ai', '将长视频拆分为社交媒体短片', ['长转短', '精彩片段', '字幕重排']],
  ['FlexClip', 'flexclip', 'PearlMountain', 'https://www.flexclip.com/', 'video-ai', '模板化在线视频制作与编辑', ['模板视频', '在线剪辑', '字幕配音']],
  ['Suno', 'suno', 'Suno', 'https://suno.com/', 'audio-ai', '通过文字描述生成歌曲和音乐样稿', ['歌曲生成', '风格控制', '音乐延展']],
  ['D-ID', 'd-id', 'D-ID', 'https://www.d-id.com/', 'video-ai', '照片驱动的数字人视频生成', ['数字人', '照片说话', '视频讲解']],
  ['Colossyan', 'colossyan', 'Colossyan', 'https://www.colossyan.com/', 'video-ai', '面向培训场景的数字人视频', ['数字人培训', '课程视频', '多语言']],
  ['Murf AI', 'murf-ai', 'Murf AI', 'https://murf.ai/', 'audio-ai', '生成商业配音和多语言旁白', ['文本转语音', '多语言配音', '语音编辑']],
  ['Kaiber', 'kaiber', 'Kaiber', 'https://kaiber.ai/', 'video-ai', '音乐视觉与风格化视频创作', ['风格视频', '音乐视觉', '图生视频']],

  // AI coding tools: 17
  ['Windsurf', 'windsurf', 'Windsurf', 'https://windsurf.com/', 'coding-ai', '智能代码编辑与项目级协作', ['代码生成', '项目理解', '智能编辑'], ['Windows', 'macOS', 'Linux']],
  ['Replit AI', 'replit-ai', 'Replit', 'https://replit.com/ai', 'coding-ai', '浏览器内生成、运行和部署代码', ['代码生成', '在线运行', '项目搭建'], ['Web']],
  ['Amazon Q Developer', 'amazon-q-developer', 'Amazon Web Services', 'https://aws.amazon.com/q/developer/', 'coding-ai', 'AWS 与开发工作流中的代码辅助', ['代码建议', 'AWS 辅助', '安全扫描'], ['IDE 插件', '命令行']],
  ['Tabnine', 'tabnine', 'Tabnine', 'https://www.tabnine.com/', 'coding-ai', '面向团队的代码补全与辅助', ['代码补全', '团队模型', '代码问答'], ['IDE 插件']],
  ['Sourcegraph Cody', 'sourcegraph-cody', 'Sourcegraph', 'https://sourcegraph.com/cody', 'coding-ai', '大型代码库搜索与上下文问答', ['代码搜索', '代码库理解', '代码生成'], ['IDE 插件']],
  ['Aider', 'aider', 'Aider', 'https://aider.chat/', 'coding-ai', '在命令行中协作编辑代码仓库', ['命令行编程', '代码修改', 'Git 工作流'], ['命令行']],
  ['Continue', 'continue-dev', 'Continue', 'https://www.continue.dev/', 'coding-ai', '可配置的开源 AI 编程助手', ['代码补全', '模型配置', '代码问答'], ['IDE 插件']],
  ['Bolt.new', 'bolt-new', 'StackBlitz', 'https://bolt.new/', 'coding-ai', '通过提示词创建和运行 Web 应用', ['应用生成', '在线预览', '代码编辑'], ['Web']],
  ['Lovable', 'lovable', 'Lovable', 'https://lovable.dev/', 'coding-ai', '通过对话构建 Web 产品原型', ['应用生成', '界面搭建', '产品原型'], ['Web']],
  ['v0', 'v0', 'Vercel', 'https://v0.dev/', 'coding-ai', '生成前端界面和 Web 应用代码', ['界面生成', 'React 代码', '原型搭建'], ['Web']],
  ['BLACKBOX AI', 'blackbox-ai', 'BLACKBOX AI', 'https://www.blackbox.ai/', 'coding-ai', '代码问答、生成与开发搜索', ['代码生成', '代码搜索', '开发问答'], ['Web', 'IDE 插件']],
  ['Qodo', 'qodo', 'Qodo', 'https://www.qodo.ai/', 'coding-ai', '代码审查、测试和质量辅助', ['代码审查', '测试生成', '质量检查'], ['IDE 插件']],
  ['JetBrains AI Assistant', 'jetbrains-ai-assistant', 'JetBrains', 'https://www.jetbrains.com/ai/', 'coding-ai', 'JetBrains IDE 内的开发辅助', ['代码生成', '解释重构', '提交信息'], ['JetBrains IDE']],
  ['Gemini Code Assist', 'gemini-code-assist', 'Google', 'https://codeassist.google/', 'coding-ai', '开发环境中的代码建议与问答', ['代码补全', '代码问答', '云开发辅助'], ['IDE 插件']],
  ['OpenAI Codex', 'openai-codex', 'OpenAI', 'https://openai.com/codex/', 'coding-ai', '处理代码任务与软件开发工作流', ['代码任务', '项目修改', '开发协作'], ['Web', '命令行']],
  ['Devin', 'devin', 'Cognition', 'https://devin.ai/', 'coding-ai', '面向软件任务的自主开发协作', ['任务规划', '代码实现', '问题修复'], ['Web']],
  ['Warp', 'warp', 'Warp', 'https://www.warp.dev/', 'coding-ai', '集成 AI 辅助的现代终端工作流', ['终端辅助', '命令生成', '工作流共享'], ['Windows', 'macOS', 'Linux']]
];

function createToolSeed(definition) {
  const [name, slug, developer, officialUrl, category, focus, capabilityTags, platforms = ['Web']] = definition;
  const profile = categoryProfiles[category];

  return {
    name,
    slug,
    developer,
    officialUrl,
    category,
    pricing: '以官方实际页面为准',
    platforms,
    capabilities: [...new Set([...capabilityTags, ...profile.capabilities])].slice(0, 5),
    useCases: [...new Set([focus, ...profile.useCases])].slice(0, 4),
    searchKeywords: [...new Set([name, developer, focus, profile.label])],
    relatedGuides: [...profile.relatedGuides],
    relatedComparisons: [...profile.relatedComparisons],
    relatedVideos: [...profile.relatedVideos],
    summary: `${name} 是 ${developer} 提供的${profile.label}，主要用于${focus}。`
  };
}

export const toolExpansionSeeds = definitions.map(createToolSeed);
