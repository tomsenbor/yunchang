'use client';

const contactEmail = 'luwenjunlumu@outlook.com';

const submissionTypes = [
  '工具收录',
  '教程选题',
  '视频合作',
  '模板投稿',
  '商务合作',
  '其他'
];

function getValue(formData, key) {
  return String(formData.get(key) || '').trim();
}

export function ContactMailForm() {
  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const type = getValue(formData, 'type');
    const name = getValue(formData, 'name');
    const email = getValue(formData, 'email');
    const link = getValue(formData, 'link');
    const commercial = getValue(formData, 'commercial');
    const rights = getValue(formData, 'rights');
    const message = getValue(formData, 'message');
    const subject = `AI效率工具库投稿 - ${type || '未分类'} - ${name || '未填写名称'}`;
    const body = [
      '投稿类型：',
      type || '未填写',
      '',
      '名称或主题：',
      name || '未填写',
      '',
      '联系人邮箱：',
      email || '未填写',
      '',
      '官网/资源/附件链接：',
      link || '未填写',
      '',
      '是否包含商业合作：',
      commercial || '未填写',
      '',
      '授权或版权说明：',
      rights || '未填写',
      '',
      '详细说明：',
      message || '未填写'
    ].join('\n');

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-black text-ink">快速提交表单</h2>
        <p className="text-sm leading-6 text-muted">
          填写后点击提交，会自动打开你的邮箱客户端并生成邮件正文。发送前可以再检查和补充附件。
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink">
          投稿类型
          <select name="type" required className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink">
            <option value="">请选择</option>
            {submissionTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          名称或主题
          <input name="name" required className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink" placeholder="例如 Claude 教程合作" />
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          联系邮箱
          <input name="email" type="email" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink" placeholder="你的邮箱" />
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          官网 / 资源 / 附件链接
          <input name="link" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink" placeholder="https://..." />
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          是否包含商业合作
          <select name="commercial" className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-ink">
            <option value="未说明">未说明</option>
            <option value="不包含商业合作">不包含商业合作</option>
            <option value="包含商业合作">包含商业合作</option>
            <option value="希望进一步沟通">希望进一步沟通</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          授权或版权说明
          <input name="rights" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink" placeholder="例如原创 / 已授权 / 需沟通" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-bold text-ink">
        详细说明
        <textarea
          name="message"
          required
          rows={7}
          className="rounded-md border border-line px-3 py-2 text-sm font-medium leading-6 text-ink"
          placeholder="请说明工具亮点、教程需求、视频合作方向或模板资源内容。"
        />
      </label>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="rounded-md bg-brand px-5 py-2.5 text-sm font-black text-white transition hover:bg-brandBright">
          生成邮件并提交
        </button>
        <p className="text-xs leading-5 text-muted">
          不会上传到服务器；内容会在你的邮箱客户端里生成，最终发送由你确认。
        </p>
      </div>
    </form>
  );
}
