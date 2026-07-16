import Link from 'next/link';
import { SITE_NAME } from '../lib/site-data.mjs';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <p className="site-footer-title">{SITE_NAME}</p>
          <p className="site-footer-text">
          中文 AI 工具教程、评测、对比和视频解说频道。内容持续更新，如需合作或反馈，请通过联系页提交。
          </p>
        </div>
        <div className="site-footer-links">
          <Link href="/about">关于我们</Link>
          <Link href="/contact">联系</Link>
          <Link href="/privacy">隐私政策</Link>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            蜀ICP备2026032678号-2
          </a>
        </div>
      </div>
    </footer>
  );
}
