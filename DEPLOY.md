# 部署与验收

## 本次迁移

以 main 的 `7bee57f0cb557df3a67e690f15b7b0292a2781f8` 为基础，独立分支 `redesign/writing-first`。不直接推送 main，不改变域名、DNS、仓库可见性或付费设置。

## Cloudflare Pages

现有项目应继续使用 Git 集成：生产分支 main；构建命令 `npm run build`；输出目录 `dist`；Node 22（`.nvmrc`）。预览分支启用 `redesign/writing-first`。

打开 PR 后检查 Cloudflare 的真实预览结果；不能只凭 PR 创建成功认定已经部署。GitHub CI 与 Cloudflare 构建独立，GitHub 检查失败不一定会阻止 Cloudflare 发布。合并前两者都要通过，并回读被部署的提交 SHA。

Cloudflare 预览通常公开，noindex 不是访问控制。这里始终不把草稿输出到预览。需要预览私人内容时，必须先完成单独的访问控制设计，不开启全站“包含草稿”开关。

## 合并前

- CI: Astro 类型检查、静态构建、旧网址存在、草稿泄漏回归、搜索、语言、窄屏和键盘导航测试。
- 人工: 桌面与手机实际长文阅读；本站已有技术文章的代码块；页面无横向溢出；现有书籍链接可读。
- 后台: GitHub 授权、草稿保存、图片、Markdown 往返、发布与撤回尚需站主在真实账号内验证。
- 安全: 不把任何私人草稿或测试凭据上传公开仓库；没有更改可见性或引入第三方账号密钥。

## 上线

确认预览后再合并到 main。检查生产部署 SHA 和正式首页、旧文章地址、RSS、搜索。构建成功与正式发布成功分别记录。失败时使用 Cloudflare 回滚已知成功版本，并 revert 相应代码；不要删除仓库或强推历史。

## 依赖锁文件

首次分支 CI 通过后，受限的一次性作业把本次测试用的 `package-lock.json` 提交到同一重构分支。该作业仅允许 push 事件和指定分支，不能在 PR 或 main 上写入。之后使用 npm ci。合并前需要对包含锁文件的 head 再次跑 PR 检查。
