---
title: Bugku 滑稽 - WEB
date: 2026-10-12 22:28:00
updated: 2026-10-12 22:28:00
description: Bugku 基础 30 题 第 2 题：Bugku 滑稽 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/68.html
- 附件：无

## 2. 题目描述
页面显示一张滑稽表情图 + 一段提示，大意是：
> "flag 就在你面前，只是你看不见。"

## 3. 解题思路（一句话）
浏览器 `F12` 打开开发者工具，**注释**或者**响应头**里就写着 flag。

## 4. 详细步骤

### 4.1 先 F12
按 `F12` → **Elements** 面板，`Ctrl+F` 搜索 `flag`：

```
flag
```

在源码里直接命中：

```html
<!-- flag{xxxxxxxx} -->
```

### 4.2 没找到？看响应头
切到 **Network** → 刷新 → 点第一个请求（就是页面本身）→
看 **Response Headers**，有时 flag 藏在自定义头里：

```
flag: flag{xxxxxxxx}
```

### 4.3 再看 Cookies
同一面板找 **Request Headers → Cookie**，或者 Application → Cookies。

### 4.4 提交
拿到 flag 后提交。

## 5. 关键知识点
- **前端三处藏东西**：HTML 注释、HTTP 响应头、Cookie。
- 新手拿到一道 Web 题，**标准动作就是 F12 + 搜 `flag`**，能解决至少 20% 的入门题。

## 6. 常见坑
- 搜 `flag` 之前先确认页面加载完了，否则 Elements 里是空的。
- 有些题 flag 在**别的文件**里（比如 `flag.js`），要在 Network 里把加载的资源全看一遍。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

