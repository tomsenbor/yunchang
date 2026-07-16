import { pageMetadata } from '../../lib/seo.mjs';

export const metadata = pageMetadata({ title: '隐私政策', path: '/privacy' });

export default function PrivacyPage() {
  return (
    <div className="static-page static-page-container privacy-page">
      <h1 className="text-4xl font-black text-ink">隐私政策</h1>
      <div className="prose-lite mt-6 rounded-lg border border-line bg-white p-6 shadow-soft">
        <p>本站不会通过联系表单直接上传或存储你填写的内容；提交操作会在本地邮件客户端生成邮件，由你确认后发送。</p>
        <p>请勿发送账号密码、支付信息、身份证号等敏感信息。站点功能或数据处理方式发生变化时，本页将同步更新。</p>
      </div>
    </div>
  );
}
