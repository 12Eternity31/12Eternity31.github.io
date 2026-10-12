---
title: Bugku 签到题 - MISC
date: 2026-10-12 22:27:00
updated: 2026-10-12 22:27:00
description: Bugku 基础 30 题 第 1 题：Bugku 签到题 - MISC
cover: 
top_img: 
tags:
  - Bugku
  - MISC
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,MISC
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：MISC
- 难度：☆☆☆☆☆（送分题）
- 题目地址：https://ctf.bugku.com/challenges/detail/id/1.html
- 附件：无

## 2. 题目描述
题面就一个输入框，让你"输入 flag"。
其实提示藏在**开发者工具**里。

## 3. 解题思路（一句话）
题目页面的 HTML 注释里经常直接写着答案，按 `F12` 看源码。

## 4. 详细步骤

### 4.1 打开题目
点进题目，页面很干净，只有输入框。

### 4.2 打开开发者工具
按 `F12`，或者右键 → 检查（Inspect）。

### 4.3 看 Elements 面板
切到 **Elements / 元素** 面板，往下拉，会看到一段灰色的注释，长这样：

```html
<!-- flag{xxxxxxxx} -->
```

> HTML 注释在浏览器里**不显示**，但在源码里是明文。这就是"签到题"的全部内容。

### 4.4 顺便看一眼别的面板
新手习惯：进题先扫一遍
- **Elements**：注释、隐藏字段 `<input type="hidden">`
- **Console**：有没有报错、有没有变量
- **Network**：请求了哪些 JS / 接口
- **Sources**：有没有 `flag.js` 之类的文件

### 4.5 提交
把 `flag{...}` 里的内容原样（**带 `flag{}`**）粘进输入框提交。

## 5. 关键知识点
- **HTML 注释**：`<!-- -->` 内是给人看的说明，不是给浏览器渲染的，所以前端藏不住东西。
- **前端源码永远不可信**：任何在浏览器里的东西，用户都能看到。

## 6. 参考
- [MDN: HTML 注释](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Comments)
