---
title: Bugku 你必须让他停下 - WEB
date: 2026-10-12 22:31:00
updated: 2026-10-12 22:31:00
description: Bugku 基础 30 题 第 5 题：Bugku 你必须让他停下 - WEB
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
- 难度：★★☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/74.html
- 附件：无

## 2. 题目描述
页面疯狂刷新 / 疯狂跳转，一直停不下来。提示"你必须让他停下"。

## 3. 解题思路（一句话）
页面靠 **JS 定时刷新**（`setTimeout` / `location.reload`）实现无限重定向，
**禁用 JS** 或者**抓包看响应**就能拿到 flag。

## 4. 详细步骤

### 4.1 为什么停不下来
典型代码：

```html
<script>
  setTimeout(function () {
    location.reload();
  }, 100);
</script>
```

每 100 毫秒刷新一次，所以你永远看不清页面。

### 4.2 方法 A：禁用 JavaScript（首选）
1. `F12`
2. `Ctrl+Shift+P`
3. 输入 `Disable JavaScript`，回车
4. **再刷新页面** —— 页面停住了，flag 出现

### 4.3 方法 B：抓包看响应体
1. `F12` → **Network**
2. 勾上 `Preserve log`（保留日志，不然刷新就没了）
3. 点任意一条请求 → **Response** 标签
4. 在返回的 HTML 里 `Ctrl+F` 搜 `flag`

### 4.4 方法 C：curl 直取
```bash
curl -sL "题目地址" | findstr /i flag
```

### 4.5 方法 D：Burp 拦包
如果 flag 需要"停"在某个响应上，用 Burp Suite 拦截响应（`Proxy → Options → Intercept responses`），
一条条 `Forward` 直到看到带 flag 的那一条。

## 5. 关键知识点
- **无限刷新** = 客户端 JS 行为，和服务端无关。
- 抓包工具的 `Preserve log` 是排查重定向问题的必备开关。
- "让他停下"这类题的通用解法口诀：**先禁 JS，再抓包，最后 curl**。

## 6. 常见坑
- 忘了勾 `Preserve log`，一刷新记录全清空，白忙一场。
- 禁用 JS 后页面白了？说明内容是 JS 渲染的，那就要走抓包路线。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

