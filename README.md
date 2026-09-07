# 高瑜泽 · 个人博客

Astro 静态博客，中文优先，Markdown/MDX 内容存放在 Git 仓库中。

## 页面

首页、文章、归档、全文搜索、关于、RSS。既有 `/articles/{pageSlug}/{lang}/` 和 `/books/{pageSlug}/` 链接保留。正文文件未重写；旧书架保留但不再占据首页。

## 开发

```sh
nvm use
npm ci
npm run dev
```

构建输出为 `dist/`。Node 版本由 `.nvmrc` 固定，完整依赖由 `package-lock.json` 固定。

```sh
npm run build
npm run test:static
npm run test:privacy
npx playwright install chromium
npm run test:browser
```

普通阅读页面不加载客户端 JavaScript；只有搜索页加载站内检索脚本。字体使用系统字体，不依赖外部字体服务。为了消除依赖审计告警，重构使用 Astro 7.3.1 和 MDX 8.0.0，保留原有 HTML 空白处理方式。

写作、隐私和后台首次授权请看 [WRITING.md](WRITING.md)。部署及验收请看 [DEPLOY.md](DEPLOY.md)。

## 安全边界

静态构建只发布显式 `draft: false` 的文章，首页、详情、搜索、RSS 共用同一过滤入口。公开仓库里的草稿原文依然公开；上传目录里的图片会被原样发布。Pages CMS 配置不等于已开通后台。不要向公开仓库提交秘密。

CI 只有读取仓库的权限，不会推送或自动合并。构建与浏览器测试之外，依赖审计发现高危告警时会阻止 CI 通过。依赖更新应通过独立 PR 和同一套测试，不自动更新生产。
