# Hugo 个人网站 - gaoyuze.com

使用 Hugo + PaperMod 主题构建的个人网站，通过 Cloudflare Pages 部署。

## 本地开发

### 启动开发服务器
```bash
docker compose up
```
然后访问 http://localhost:1313

### 创建新文章
```bash
docker compose run --rm hugo new content posts/my-new-post.md
```

### 本地构建（可选）
```bash
docker compose run --rm hugo --minify
```

## 发布流程

```bash
git add .
git commit -m "Add new post"
git push
```

Cloudflare Pages 会自动检测推送并在 ~1 分钟内部署更新。

## 目录结构

```
.
├── content/           # 文章内容
│   ├── posts/        # 博客文章
│   └── about.md      # 关于页面
├── themes/           # 主题 (PaperMod)
├── static/           # 静态资源 (图片等)
├── hugo.yaml         # Hugo 配置
└── docker-compose.yml
```
