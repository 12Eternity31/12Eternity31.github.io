---
title: Bugku 头等舱 - WEB
date: 2026-10-12 22:32:00
updated: 2026-10-12 22:32:00
description: Bugku 基础 30 题 第 6 题：Bugku 头等舱 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/77.html
- 附件：无

## 2. 题目描述
页面提示大意是：**"只有 VIP 才能拿到 flag"** / "你不是头等舱乘客"。

## 3. 解题思路（一句话）
"你是不是 VIP"这种判断，往往是**看请求头或 Cookie**，改一下就行。

## 4. 详细步骤

### 4.1 F12 看请求头
`F12` → **Network** → 刷新 → 点页面请求 → 看 **Request Headers**：

```
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
Referer: https://ctf.bugku.com/challenges/detail/id/77.html
Cookie: PHPSESSID=xxxx
```

### 4.2 看 Cookie 里有什么
Application（应用）→ Cookies，或者直接看请求头里的 Cookie。
常见"身份"字段名：

```
is_vip=0     →  改成 is_vip=1
vip=false    →  改成 vip=true
user=guest   →  改成 user=admin
level=1      →  改成 level=9
```

### 4.3 改 Cookie 的两种方法

**方法 A：Console 里改（改完刷新）**
```javascript
document.cookie = "is_vip=1; path=/";
```

**方法 B：HackBar / Burp 改请求头**
Burp 拦下请求 → 把 Cookie 里的 `is_vip=0` 改成 `is_vip=1` → Forward。

### 4.4 如果是 User-Agent 判断
有的题要你伪装成特定浏览器 / 特定爬虫，比如：

```
User-Agent: bugku
```
或
```
User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```

用 curl 快速试：

```bash
curl -s -A "bugku" "题目地址" | findstr /i flag
```

### 4.5 提交
拿到 flag 后提交。

## 5. 关键知识点
- **HTTP 是无状态的**，服务端判断"你是谁"只能靠 **Cookie / Session / 请求头**。
- 客户端传来的任何身份标识**都可以伪造**，这叫"**越权 / 身份伪造**"。
- 请求头里的常见身份线索：`Cookie`、`User-Agent`、`Referer`、`X-Forwarded-For`、自定义 `X-*` 头。

## 6. 常见坑
- 改完 Cookie 一定要**刷新**页面，服务端才会重新读。
- 有的站 Cookie 有签名/加密，改了会失效 —— 那就换成改请求头试试。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

