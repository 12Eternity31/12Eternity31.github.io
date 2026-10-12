---
title: Bugku source - WEB
date: 2026-10-12 22:35:00
updated: 2026-10-12 22:35:00
description: Bugku 基础 30 题 第 9 题：Bugku source - WEB
cover: 
top_img: 
tags:
  - Bugku
  - WEB
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,WEB
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：WEB
- 难度：★☆☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/168.html
- 附件：无

## 2. 题目描述
题面提示：**"看看源码吧"** / "flag 在源码里"。

## 3. 解题思路（一句话）
按 `F12` 看 HTML 源码，flag 在**注释**里。

## 4. 详细步骤

### 4.1 F12 → Elements
`Ctrl+F` 搜 `flag`，直接命中：

```html
<!-- flag{xxxxxxxx} -->
```

### 4.2 没找到就看这三种源码

**① 页面源码（右键 → 查看网页源代码）**
`Ctrl+U` 打开，比 Elements 更"原始"，Elements 里被 JS 改过的内容这里没有。

**② 外部 JS 文件**
F12 → **Sources / 源代码** → 左侧文件树，找 `flag.js`、`main.js` 之类，
`Ctrl+Shift+F` 全局搜 `flag`。

**③ CSS 文件**
有些题把 flag 写在 CSS 注释或 `content` 属性里：
```css
.flag::after { content: "flag{xxxx}"; }
```

### 4.3 如果题目是"看到了吗？F12 也没用"
那可能是 **robots.txt / sitemap.xml** 里给了线索：

```
https://题目地址/robots.txt
https://题目地址/sitemap.xml
```

robots.txt 里 `Disallow:` 后面常常就是出题人想藏起来的路径。

### 4.4 命令行一把梭
```bash
curl -s "题目地址" | findstr /i flag
curl -s "题目地址/robots.txt"
```

## 5. 关键知识点
- **"源码"= 服务端发给浏览器的原始文本**，包括 HTML、JS、CSS、注释。
- 敏感信息**绝对不能写在前端**：注释、JS 变量、CSS、robots.txt 都算。
- 新手 Web 题四连：`F12 搜 flag` → `看响应头` → `看 Cookie` → `看 robots.txt`。

## 6. 常见坑
- Elements 面板会显示 JS 动态插入的内容，`Ctrl+U` 显示的才是**真正从服务器来的**。两者都要看。
- 有时候 flag 被 Base64 了，看到 `ZmxhZ3s=` 开头的东西就丢进 CyberChef 解一下。
