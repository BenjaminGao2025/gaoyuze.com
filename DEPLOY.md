# 部署与验收

## 本次迁移

以 main 的 `7bee57f0cb557df3a67e690f15b7b0292a2781f8` 为基础，独立分支 `redesign/writing-first`，草稿 PR #1。不直接推送 main，不改变域名、DNS、仓库可见性或付费设置。

## Cloudflare Pages

继续使用现有项目 gaoyuze-com 的 Git 集成：生产分支 main；构建命令 `npm run build`；输出目录 `dist`；Node 由 `.nvmrc` 固定（22.23.2）。预览分支为 `redesign/writing-first`。

分支预览地址： https://redesign-writing-first.gaoyuze-com.pages.dev

打开 PR 核对 Cloudflare 的真实部署状态、对应提交及预览地址；不能只凭 PR 创建成功认定已经部署。GitHub CI 与 Cloudflare 构建独立，GitHub 检查失败不一定会阻止 Cloudflare 发布。合并前两者都要通过，并回读被部署的提交 SHA。

Cloudflare 预览可能公开，noindex 不是访问控制。这里始终不把文章草稿输出到预览。需要预览私人内容时，必须先完成单独的访问控制设计，不开启全站“包含草稿”开关。

## 合并前

- CI: Astro 类型检查、静态构建、原有 6 个文章语言网址和 2 个书籍网址、所有内部链接、草稿泄漏回归、搜索、语言、窄屏和键盘导航测试。
- 人工: 桌面与手机实际长文阅读；本站已有技术文章的代码块；页面无横向溢出；原有书籍链接可读。CI 产物 site-review 保存对应截图和审计报告，保留 7 天。
- 后台: GitHub 授权、草稿保存、图片、Markdown 往返、发布与撤回尚需站主在真实账号内验证。编辑器预览不等于正式网页；不承诺复杂表格和 MDX 富文本往返无损。
- 安全: 不把私人草稿、用户账号凭据或任何秘密提交到公开仓库。仓库改私有必须由站主另行确认。

## 上线

站主确认预览并完成发布流程验收后，才合并到 main。检查生产部署 SHA 和正式首页、原有文章地址、RSS、搜索。构建成功与正式发布成功分别记录。失败时使用 Cloudflare 回滚已知成功版本，并 revert 相应代码；不要删除仓库或强推历史。

## 依赖与回退

完整锁文件已保存。使用 npm ci，不再在 CI 自动生成或回写锁文件；一次性的锁文件写入作业已移除，CI 只读仓库。升级依赖时需要同时提交 package.json 与 package-lock.json，并重新通过审计、构建和浏览器测试。

网站使用 Astro 7.3.1 / MDX 8.0.0 处理此次发现的依赖告警。审计结果只代表执行时已知的告警，不构成“永远没有漏洞”的保证。最终以每次 site-review 中的 qa/npm-audit.json 为准。
