# 12Eternity31 的安全笔记

个人网络安全 WriteUp 博客 —— **Hexo + Butterfly 主题**，通过 **GitHub Actions** 自动构建发布。

- 线上地址：<https://12eternity31.github.io>
- 源码仓库：<https://github.com/12Eternity31/12Eternity31.github.io>

## 技术栈

| 部分 | 说明 |
|---|---|
| 静态站点 | Hexo 7.3.0 |
| 主题 | Butterfly 5.7.0（`themes/butterfly/`，已随仓库提交） |
| 搜索 | hexo-generator-searchdb（本地搜索，不依赖第三方） |
| 构建 | `node build.js`（见下方"为什么要自定义构建脚本"） |
| 部署 | GitHub Actions（`.github/workflows/deploy.yml`）→ GitHub Pages |

## 本地使用

```bash
# 安装依赖（已配 npmmirror 源）
npm install

# 本地预览：http://localhost:4000
npx hexo server

# 新建文章（自动套用 scaffolds/post.md 模板）
npx hexo new post "HTB-Blue-WriteUp"

# 构建到 public/
npm run build
```

## 目录结构

```
├── _config.yml              # 站点主配置（标题/网址/分页/搜索…）
├── _config.butterfly.yml    # 主题配置（导航、代码块、深色模式、打字机…）
├── build.js                 # 构建脚本（本地 + CI 共用）
├── scaffolds/post.md        # 写 WriteUp 的模板
├── source/
│   ├── _posts/              # 文章都在这里（Markdown）
│   ├── about/  tags/  categories/    # 独立页面
│   └── img/bg.svg           # 首页背景
├── themes/butterfly/        # 主题（随仓库提交，CI 才能构建）
└── .github/workflows/deploy.yml      # 自动部署流水线
```

## 发布流程

```bash
git add .
git commit -m "post: 文章标题"
git push
```

推送到 `main` 后，GitHub Actions 自动跑 `npm run build` 并把 `public/` 发布到 Pages，
大约 1~2 分钟后刷新 <https://12eternity31.github.io> 即可看到。

## 为什么要自定义构建脚本（build.js）

Hexo 有个坑：如果站点 `package.json` 里**没有** `"hexo": { "version": "..." }` 字段，
`hexo.init()` 会跳过加载 `_config.yml`、主题和插件，结果只复制原始文件、不渲染任何页面
（表现为"文章数量 0、生成的文件只有几个"）。`build.js` 里显式调用 API 并保证流程正确，
CI 与本地使用同一套逻辑，避免"本地能跑、线上空白"。

## 写文章的 front-matter 示例

```yaml
---
title: HTB Blue WriteUp
date: 2026-10-12 20:00:00
tags: [HTB, Windows, 永恒之蓝]
categories: [WriteUp]
description: 一句话概括关键点
sticky: 1          # 置顶（可选）
---
```

## 免责声明

本站内容仅用于**已获授权的安全测试与学习研究**，请勿用于非法用途。
