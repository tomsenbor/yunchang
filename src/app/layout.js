import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site-data.mjs';
import { pageMetadata } from '../lib/seo.mjs';
import { Footer } from '../components/Footer.jsx';
import { Header } from '../components/Header.jsx';
import { ToastProvider } from '../components/Toast.tsx';

export const metadata = {
  ...pageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: '/'
  }),
  other: {
    'msvalidate.01': '6410A3F56EA97C351E3897C8DDC8CC2E',
    'baidu-site-verification': 'codeva-K8pppYvo4r'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">
        <ToastProvider>
          <div className="site-shell">
            <Header />
            <main className="site-main">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
