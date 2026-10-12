---
title: Bugku 看看源代码 - WEB
date: 2026-10-12 22:49:00
updated: 2026-10-12 22:49:00
description: Bugku 基础 30 题 第 23 题：Bugku 看看源代码 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/78.html
- 附件：无

## 2. 题目描述
题目名就很直白：**看看源代码**。

## 3. 解题思路（一句话）
`F12` / `Ctrl+U` 看源码，flag 在注释或 JS 里。

## 4. 详细步骤

### 4.1 三种"看源码"的方式

**① 右键 → 查看网页源代码（`Ctrl+U`）**
拿到的是**服务器返回的原始 HTML**。

**② F12 → Elements**
拿到的是**浏览器解析 + JS 执行后**的 DOM。

**③ F12 → Sources**
拿到的是**所有加载的文件**：HTML、JS、CSS、图片。

> **重要区别**：JS 动态写进去的内容只在 ② 里有；服务端注释只在 ① 里有。
> **两种都要看！**

### 4.2 在 Sources 里全局搜索
`F12` → **Sources** → `Ctrl+Shift+F` → 搜 `flag`：

```
Search results:
  index.html:12   <!-- flag{xxxx} -->
  app.js:48       var key = "flag{yyyy}";
```

**全局搜索能一次扫过所有 JS / CSS 文件**，比一个个点开快得多。

### 4.3 常见藏点
```html
<!-- 注释里的 flag -->
<input type="hidden" name="flag" value="flag{xxxx}">
<div style="display:none">flag{xxxx}</div>
<script>var flag = "flag{xxxx}";</script>
<style>.f::after{content:"flag{xxxx}"}</style>
```

### 4.4 命令行一把梭
```bash
# 看响应头 + 正文
curl -s -i "题目地址" | findstr /i flag /c:"<!--"

# 只看注释
curl -s "题目地址" | findstr /c:"<!--"
```

### 4.5 如果源码里只有提示
比如源码里写着：
```html
<!-- 提示：flag 在 /flag.php -->
```
那就直接访问：
```
题目地址/flag.php
```

## 5. 关键知识点
- **`Ctrl+U`（View Source）**：看**服务端原始输出**。
- **`F12 → Elements`**：看**当前 DOM**。两者差异 = JS 干了什么。
- **`F12 → Sources`**：看**静态资源**，配合 `Ctrl+Shift+F` 全局搜索。
- 出题人往源码里藏东西的手法基本就那 5 种（注释、隐藏域、隐藏元素、JS 变量、CSS content）。

## 6. 常见坑
- 只看 Elements 不看 `Ctrl+U`：会漏掉被 JS 删掉的注释。
  （有些题故意用 JS 把注释删了，但 `Ctrl+U` 还能看到。）
- 反过来，只看 `Ctrl+U` 不看 Elements：会漏掉 JS 动态插入的内容。
- 浏览器缓存导致看到旧源码：`Ctrl+F5` 强制刷新。
