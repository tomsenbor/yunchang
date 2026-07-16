# AI效率工具库 / ai-tool-guide

中文 AI 工具教程网站和视频解说频道项目，基于 Next.js + Tailwind CSS，使用 Docker Compose 部署，服务端口固定为 `3001`。

## 功能范围

- 首页、AI工具库、工具详情、分类页、教程列表、教程详情、工具对比、视频解说、免费AI工具合集、模板下载、关于、联系、隐私政策。
- SEO 元数据、canonical、Open Graph、`robots.txt`、`sitemap.xml`。
- 结构化数据：教程详情包含 `Article`、`BreadcrumbList`、`FAQPage`；视频详情包含 `VideoObject`。
- 外部联盟链接示例使用 `rel="sponsored nofollow"`。
- 示例数据集中在 `src/lib/site-data.mjs`，后续批量补充工具、文章、视频和模板时优先修改这里。

## 本地开发

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:3001
```

Windows PowerShell 如遇到 `npm.ps1` 执行策略限制，可以使用：

```bash
npm.cmd run dev
```

## 检查和构建

```bash
npm test
npm run build
```

## Docker Compose 部署

```bash
docker compose up -d --build
```

容器名：`ai-tool-guide`

端口映射：`3001:3001`

查看日志：

```bash
docker compose logs -f ai-tool-guide
```

停止服务：

```bash
docker compose down
```

## Caddy 反代示例

项目提供 `Caddyfile.example`，请手动把其中片段合并到服务器现有 Caddyfile，不要覆盖现有配置。

```caddyfile
aitoolguide.example.com {
  encode gzip zstd
  reverse_proxy 127.0.0.1:3001
}
```

## 上线前建议

- 把 `src/lib/site-data.mjs` 里的 `SITE_URL` 从 `https://aitoolguide.example.com` 改为真实域名。
- 用真实截图、视频、评测记录替换占位内容。
- 为联盟推广添加披露文字，并保持外链 `rel="sponsored nofollow"`。
- 根据实际统计、评论、订阅和下载功能完善隐私政策。
