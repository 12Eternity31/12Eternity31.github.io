---
title: 本站开张：WriteUp 怎么写、怎么发
date: 2026-10-12 20:00:00
updated: 2026-10-12 20:00:00
description: 这个博客是干什么的，以及我平时记录做题过程的流程
cover: 
top_img: 
tags:
  - 博客
  - 随笔
categories:
  - 公告
keywords: 博客,Hexo,Butterfly,WriteUp
---

## 这个博客是干嘛的

网络安全专业在读，平时刷 CTF、打靶场、复现漏洞，**做完就忘**是最大的问题。
所以开这个站，把每道题的思路、命令、payload、踩过的坑都记下来：

- **CTF WriteUp**：Web / Pwn / Crypto / Misc / Reverse
- **靶场渗透**：HTB、VulnHub、春秋云境、墨者学院等
- **漏洞复现**：CVE 复现、中间件/框架漏洞
- **学习笔记**：内网渗透、域渗透、免杀、代码审计

## 写一篇新文章的流程

### 1. 本地新建

```bash
# 在博客根目录（D:\Blog）
npx hexo new post "HTB-Blue-WriteUp"
# 会按 scaffolds/post.md 模板生成 source/_posts/HTB-Blue-WriteUp.md
```

也可以直接新建 `.md` 文件，只要头部 front-matter 写对：

```markdown
---
title: HTB Blue WriteUp
date: 2026-10-12 20:00:00
tags:
  - HTB
  - Windows
  - 永恒之蓝
categories:
  - WriteUp
---
```

### 2. 本地预览

```bash
npx hexo clean && npx hexo server
# 浏览器打开 http://localhost:4000 看效果
```

### 3. 发布

```bash
git add .
git commit -m "post: HTB Blue WriteUp"
git push
```

推上去之后 **GitHub Actions 会自动编译并发布**，等 1~2 分钟刷新
<https://12eternity31.github.io> 就能看到。

## 写作小技巧

| 需求 | 写法 |
|---|---|
| 代码块带行号和复制按钮 | 直接写 ```` ```bash ```` 这样的围栏代码块即可 |
| 插入图片 | 打开 `post_asset_folder` 后，图片放进同名文件夹，正文里写 `![](图片名.png)` |
| 折叠一大段输出 | 主题支持 `{% hideToggle 点我看完整回显 %}` … `{% endhideToggle %}` |
| 数学公式 | 直接写 `$...$`（已开启 MathJax） |
| 流程图 | ```` ```mermaid ```` 代码块 |
| 文章置顶 | front-matter 里加 `sticky: 1` |

> 免责声明：本站所有内容仅用于**授权环境下的学习与安全研究**，请勿用于非法用途。
