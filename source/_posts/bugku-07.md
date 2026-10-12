---
title: Bugku GET - WEB
date: 2026-10-12 22:33:00
updated: 2026-10-12 22:33:00
description: Bugku 基础 30 题 第 7 题：Bugku GET - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/70.html
- 附件：无

## 2. 题目描述
页面提示：
> "请用 GET 方式提交一个名为 `what` 的参数，值为 `flag`"

## 3. 解题思路（一句话）
GET 参数就是 URL 里 `?` 后面的东西，直接在地址栏拼上就行。

## 4. 详细步骤

### 4.1 GET 是什么
`GET` 是最常见的请求方式，参数**明文写在 URL 里**：

```
https://example.com/page.php?name=zhangsan&age=18
                          ↑ 参数名   ↑ 参数值
```

多个参数用 `&` 连接。

### 4.2 直接改地址栏
假设题目地址是：

```
https://ctf.bugku.com/challenges/.../index.php
```

我们加上参数：

```
https://ctf.bugku.com/challenges/.../index.php?what=flag
```

回车 —— 页面就会显示 flag（有时需要再看一次源码）。

### 4.3 用 curl 验证
```bash
curl -s "题目地址?what=flag"
```

### 4.4 参数名要对
题目说参数名是 `what` 就**必须**是 `what`，写成 `flag=flag`、`what=1` 都不行。
大小写也敏感：`what` ≠ `What`。

## 5. 关键知识点
- **GET 参数**：放在 URL 里，用于"获取"数据，会被记录在日志、浏览器历史里，**不要用它传密码**。
- **POST 参数**：放在请求体里，用于"提交"数据。
- 手工测试 Web 题，**改 URL 上的参数是最快的第一步**。

## 6. 常见坑
- 中文 / 特殊符号要 URL 编码：`{` → `%7B`，`}` → `%7D`，空格 → `%20`。
  - 比如 `flag{get}` 编码后是 `flag%7Bget%7D`
  - 在线编码：<https://gchq.github.io/CyberChef/>（URL Encode 模块）
- 拼参数时别把原来的参数删了，用 `&` 往后加。
