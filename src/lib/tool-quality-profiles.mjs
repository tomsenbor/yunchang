const relationBundles = {
  assistant: {
    relatedGuides: ['choose-ai-assistant-guide', 'chatgpt-beginner-guide', 'ai-assistant-study-plan-guide'],
    relatedComparisons: ['chatgpt-vs-claude'],
    relatedVideos: ['chatgpt-3min-guide']
  },
  research: {
    relatedGuides: ['perplexity-ai-search-research', 'ai-search-source-check-guide', 'ai-research-report-guide'],
    relatedComparisons: ['perplexity-vs-google-search'],
    relatedVideos: ['perplexity-research-video']
  },
  office: {
    relatedGuides: ['microsoft-copilot-office-guide', 'ai-meeting-minutes-office-guide', 'ai-presentation-outline-guide'],
    relatedComparisons: ['gemini-vs-chatgpt'],
    relatedVideos: ['gemini-vs-chatgpt-video']
  },
  coding: {
    relatedGuides: ['cursor-ai-coding-guide', 'ai-codebase-reading-guide', 'ai-debugging-workflow-guide'],
    relatedComparisons: ['cursor-vs-claude-code'],
    relatedVideos: ['cursor-ai-coding-video']
  },
  image: {
    relatedGuides: ['midjourney-high-quality-image', 'ai-image-prompt-guide', 'choose-ai-creative-tool-guide'],
    relatedComparisons: ['midjourney-vs-tongyi-wanxiang'],
    relatedVideos: ['midjourney-image-video']
  },
  video: {
    relatedGuides: ['runway-ai-video-guide', 'text-to-video-workflow-guide', 'ai-video-script-guide'],
    relatedComparisons: ['runway-vs-kling-video'],
    relatedVideos: ['runway-video-generation-video']
  },
  audio: {
    relatedGuides: ['elevenlabs-ai-voice-guide', 'ai-tools-for-creators', 'choose-ai-creative-tool-guide'],
    relatedComparisons: ['elevenlabs-vs-china-ai-voice'],
    relatedVideos: ['elevenlabs-voice-video']
  },
  writing: {
    relatedGuides: ['ai-writing-outline-guide', 'ai-writing-polish-guide', 'choose-ai-writing-tool-guide'],
    relatedComparisons: ['chatgpt-vs-claude'],
    relatedVideos: ['chatgpt-3min-guide']
  }
};

const profileDefinitions = {
  chatgpt: {
    name: 'ChatGPT', relationType: 'assistant', audience: '需要通用 AI 助手的个人、学生和办公团队',
    positioning: '跨写作、问答、资料整理、学习和代码辅助处理日常任务',
    capabilities: ['多轮对话', '内容写作', '文件分析', '代码辅助', '结构化输出'],
    useCases: ['撰写与润色文案', '总结长文档', '制定学习计划', '解释和修改代码']
  },
  claude: {
    name: 'Claude', relationType: 'assistant', audience: '重视长文档处理、自然写作和资料分析的知识工作者',
    positioning: '阅读复杂材料、提炼重点并完成连贯的长篇表达',
    capabilities: ['长文档理解', '自然语言写作', '资料总结', '代码分析', '结构化推理'],
    useCases: ['总结研究材料', '润色长篇文章', '分析合同或报告', '梳理代码逻辑']
  },
  gemini: {
    name: 'Gemini', relationType: 'assistant', audience: '使用 Google 服务并需要多模态辅助的个人和团队',
    positioning: '结合文本、图片和文件完成搜索、理解与内容任务',
    capabilities: ['多模态理解', '文档分析', '内容生成', '搜索辅助', '代码问答'],
    useCases: ['整理 Google 文档', '分析图片和文件', '生成内容草稿', '辅助研究与编程']
  },
  deepseek: {
    name: 'DeepSeek', relationType: 'assistant', audience: '关注中文问答、推理和代码任务的学习者与开发者',
    positioning: '处理中文资料、逻辑推理、代码解释和通用问答',
    capabilities: ['中文问答', '逻辑推理', '代码生成', '文档总结', '结构化分析'],
    useCases: ['解决编程问题', '整理中文资料', '分析复杂问题', '生成写作提纲']
  },
  kimi: {
    name: 'Kimi', relationType: 'assistant', audience: '经常阅读中文长文档和整理研究资料的用户',
    positioning: '上传、阅读和总结长篇中文材料并持续追问细节',
    capabilities: ['长文档阅读', '文件问答', '资料总结', '中文写作', '信息提取'],
    useCases: ['总结论文报告', '阅读行业资料', '整理会议文件', '提炼长文重点']
  },
  perplexity: {
    name: 'Perplexity', relationType: 'research', audience: '需要快速查找资料并保留来源线索的研究和内容用户',
    positioning: '以问答方式检索网页、汇总信息并展示引用来源',
    capabilities: ['AI 搜索', '来源引用', '追问研究', '资料汇总', '主题探索'],
    useCases: ['核查公开资料', '开展主题研究', '比较多方观点', '寻找文章来源']
  },
  'microsoft-copilot': {
    name: 'Microsoft Copilot', relationType: 'office', audience: '使用 Microsoft 生态并希望提升办公效率的个人和组织',
    positioning: '在搜索、写作和办公场景中提供对话式任务辅助',
    capabilities: ['对话问答', '网页搜索', '文案生成', '办公辅助', '图片生成'],
    useCases: ['整理办公资料', '生成邮件草稿', '辅助网页研究', '制作内容提纲']
  },
  cursor: {
    name: 'Cursor', relationType: 'coding', audience: '需要理解代码库并加速实现、调试和重构任务的开发者',
    positioning: '在代码编辑器中结合项目上下文完成开发工作',
    capabilities: ['代码补全', '代码库问答', '多文件编辑', '错误排查', '重构辅助'],
    useCases: ['阅读陌生项目', '实现新功能', '修复代码错误', '批量重构代码']
  },
  midjourney: {
    name: 'Midjourney', relationType: 'image', audience: '追求高质量视觉风格的设计师、创作者和营销人员',
    positioning: '通过提示词生成具有鲜明风格和完成度的创意图片',
    capabilities: ['文生图', '风格控制', '图片变体', '局部调整', '参考图生成'],
    useCases: ['制作概念视觉', '生成营销配图', '探索品牌风格', '设计角色和场景']
  },
  'canva-ai': {
    name: 'Canva AI', relationType: 'image', audience: '需要快速完成社交媒体、演示和营销设计的非专业设计用户',
    positioning: '在模板化设计流程中生成图片、文案和版式内容',
    capabilities: ['智能设计', '图片生成', '文案辅助', '背景处理', '模板编辑'],
    useCases: ['制作社交海报', '创建演示文稿', '生成营销素材', '编辑商品图片']
  },
  runway: {
    name: 'Runway', relationType: 'video', audience: '需要生成、编辑和迭代视频镜头的创作者与制作团队',
    positioning: '将文字或图片转化为视频并完成生成式后期处理',
    capabilities: ['文生视频', '图生视频', '镜头控制', '视频编辑', '生成式特效'],
    useCases: ['制作广告镜头', '生成短视频素材', '验证分镜创意', '处理视频背景和特效']
  },
  pika: {
    name: 'Pika', relationType: 'video', audience: '需要快速制作创意短片和动态视觉的个人创作者',
    positioning: '通过文字、图片和特效指令生成短视频内容',
    capabilities: ['文生视频', '图生视频', '视频特效', '镜头变换', '内容延展'],
    useCases: ['制作社交短片', '让静态图片动起来', '生成创意转场', '测试视频概念']
  },
  'kling-ai': {
    name: '可灵 AI', relationType: 'video', audience: '需要中文提示词和高表现力视频生成的内容创作者',
    positioning: '根据文字或图片生成具有运动表现和镜头感的视频',
    capabilities: ['文生视频', '图生视频', '镜头运动', '主体一致性', '视频延展'],
    useCases: ['生成剧情片段', '制作商品展示', '创作人物镜头', '验证短视频分镜']
  },
  elevenlabs: {
    name: 'ElevenLabs', relationType: 'audio', audience: '需要自然语音、配音和多语言音频内容的创作者与团队',
    positioning: '生成、转换和管理适合内容制作的 AI 语音',
    capabilities: ['文本转语音', '声音克隆', '多语言配音', '语音转换', '音频工作流'],
    useCases: ['制作视频旁白', '生成播客语音', '完成多语言配音', '创建角色声音']
  },
  'notion-ai': {
    name: 'Notion AI', relationType: 'office', audience: '在 Notion 中管理知识、项目和团队文档的用户',
    positioning: '直接在工作区内完成写作、总结、搜索和资料整理',
    capabilities: ['文档写作', '内容总结', '知识问答', '信息提取', '工作区搜索'],
    useCases: ['整理会议纪要', '总结项目文档', '搭建知识库', '生成任务说明']
  },
  'jasper-chat': {
    name: 'Jasper', relationType: 'writing', audience: '需要保持品牌语气并批量生产营销内容的团队',
    positioning: '围绕品牌、营销活动和内容流程生成可复用文案',
    capabilities: ['营销写作', '品牌语气', '内容改写', '活动文案', '团队协作'],
    useCases: ['撰写营销页面', '生成广告文案', '统一品牌表达', '规划内容活动']
  },
  writesonic: {
    name: 'Writesonic', relationType: 'writing', audience: '需要博客、搜索内容和营销文案的内容团队与独立创作者',
    positioning: '从选题、草稿到优化完成多种营销内容任务',
    capabilities: ['博客写作', 'SEO 内容', '营销文案', '内容改写', '资料辅助'],
    useCases: ['创建博客草稿', '编写落地页', '优化搜索内容', '生成社交文案']
  },
  'copy-ai': {
    name: 'Copy.ai', relationType: 'writing', audience: '需要销售和市场内容工作流的增长团队',
    positioning: '围绕销售、营销和客户触达流程生成与改写内容',
    capabilities: ['销售文案', '营销工作流', '邮件写作', '内容改写', '品牌表达'],
    useCases: ['生成销售邮件', '制作活动文案', '整理客户资料', '批量改写内容']
  },
  grammarly: {
    name: 'Grammarly AI', relationType: 'writing', audience: '需要提升英文表达准确性和语气一致性的个人与团队',
    positioning: '检查语法、调整语气并辅助完成英文写作任务',
    capabilities: ['语法检查', '写作润色', '语气调整', '内容生成', '表达建议'],
    useCases: ['润色英文邮件', '检查报告语法', '调整沟通语气', '改写社交内容']
  },
  'leonardo-ai': {
    name: 'Leonardo AI', relationType: 'image', audience: '需要游戏美术、品牌视觉和可控图片生成的创作者',
    positioning: '生成、编辑和迭代具有统一风格的视觉素材',
    capabilities: ['图片生成', '风格控制', '画布编辑', '模型选择', '素材变体'],
    useCases: ['制作游戏素材', '设计品牌视觉', '生成商品概念图', '迭代角色与场景']
  },
  'stable-diffusion': {
    name: 'Stable Diffusion', relationType: 'image', audience: '需要开放模型、本地工作流和深度定制能力的技术型创作者',
    positioning: '通过模型、参数和扩展组件建立可控图片生成流程',
    capabilities: ['文生图', '图生图', '模型定制', '局部重绘', '本地部署'],
    useCases: ['搭建私有生成流程', '训练专属风格', '批量制作素材', '精细控制图片构图']
  },
  ideogram: {
    name: 'Ideogram', relationType: 'image', audience: '需要在图片中呈现文字和版式的营销与设计用户',
    positioning: '生成包含标题、标识和排版元素的创意视觉',
    capabilities: ['文生图', '文字排版', '海报生成', '风格参考', '图片编辑'],
    useCases: ['制作活动海报', '生成社交配图', '探索标识创意', '设计带字视觉']
  },
  suno: {
    name: 'Suno', relationType: 'audio', audience: '需要快速创作歌曲、配乐和音乐样稿的个人创作者',
    positioning: '通过文字描述生成包含人声或器乐的音乐内容',
    capabilities: ['歌曲生成', '歌词辅助', '风格控制', '器乐创作', '音乐延展'],
    useCases: ['制作短视频配乐', '生成歌曲样稿', '验证音乐风格', '创作主题音乐']
  },
  'murf-ai': {
    name: 'Murf AI', relationType: 'audio', audience: '需要商业配音、演示旁白和多语言语音的内容团队',
    positioning: '将脚本转换为可编辑的 AI 语音并用于内容制作',
    capabilities: ['文本转语音', '多语言配音', '语音编辑', '音色选择', '旁白制作'],
    useCases: ['制作课程旁白', '生成演示配音', '创建营销音频', '完成多语言语音版本']
  },
  windsurf: {
    name: 'Windsurf', relationType: 'coding', audience: '需要项目级理解、代码生成和智能编辑流程的开发者',
    positioning: '在代码编辑器中结合上下文完成实现、修改与调试',
    capabilities: ['代码生成', '项目理解', '智能编辑', '命令辅助', '错误排查'],
    useCases: ['实现产品功能', '理解现有代码库', '修改多个文件', '排查构建错误']
  }
};

function buildProfile(definition) {
  const relations = relationBundles[definition.relationType];
  const seoDescription = `${definition.name} 面向${definition.audience}，主要用于${definition.positioning}。核心能力包括${definition.capabilities.slice(0, 3).join('、')}，常见场景有${definition.useCases.slice(0, 2).join('、')}。`;
  const metaDescription = `${seoDescription}本页整理优势、限制、教程、视频和对比入口；具体功能与套餐以官方页面为准。`;

  return {
    seoDescription,
    metaDescription,
    capabilities: [...definition.capabilities],
    useCases: [...definition.useCases],
    pros: [
      `适合${definition.audience}`,
      `覆盖${definition.capabilities[0]}与${definition.capabilities[1]}等核心任务`,
      `可用于${definition.useCases[0]}等实际工作场景`
    ],
    cons: [
      '输出质量仍会受到输入材料、提示方式和任务复杂度影响',
      '具体功能、可用范围与套餐可能随官方版本调整'
    ],
    relatedGuides: [...relations.relatedGuides],
    relatedComparisons: [...relations.relatedComparisons],
    relatedVideos: [...relations.relatedVideos],
    updatedAt: '2026-07-19'
  };
}

export const coreToolQualityProfiles = Object.fromEntries(
  Object.entries(profileDefinitions).map(([slug, definition]) => [slug, buildProfile(definition)])
);

export const coreToolQualitySlugs = Object.keys(coreToolQualityProfiles);
