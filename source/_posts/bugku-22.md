---
title: Bugku 不断的进步 - WEB
date: 2026-10-12 22:48:00
updated: 2026-10-12 22:48:00
description: Bugku 基础 30 题 第 22 题：Bugku 不断的进步 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/76.html
- 附件：无

## 2. 题目描述
页面显示"我在不断的进步"，看不到任何按钮。
提示藏在源码里。

## 3. 解题思路（一句话）
先把 **F12 看源码**这一招用熟：flag 在 **HTML 注释**里，
而且有时候注释**不止一处**，要"不断"往下翻。

## 4. 详细步骤

### 4.1 F12 → 搜 flag
`F12` → Elements → `Ctrl+F` → 输入 `flag`

命中：
```html
<!-- flag{xxxxxxxx} -->
```

### 4.2 如果一处分不够，试试这些地方
这题的价值在于**训练你形成"源码排查清单"**：

| 检查点 | 怎么找 |
|---|---|
| HTML 注释 | Elements 面板搜 `<!--` |
| 隐藏表单域 | 搜 `type="hidden"` |
| 隐藏 div | 搜 `display:none`、`visibility:hidden` |
| 外部 JS | Sources 面板 → 全局搜 `flag`（`Ctrl+Shift+F`） |
| 响应头 | Network → 点请求 → Response Headers |
| Cookie | Application → Cookies |
| robots.txt | 地址栏访问 `/robots.txt` |
| 页面源码 vs DOM | `Ctrl+U` 看原始源码，对照 Elements 里的差异 |

### 4.3 用 curl 一眼看全部
```bash
curl -s -i "题目地址"
```

`-i` 会把**响应头 + 响应体**都打出来，一次看全。

### 4.4 找找有没有别的路径
```bash
# 常见的"藏东西"文件
curl -s "题目地址/robots.txt"
curl -s "题目地址/sitemap.xml"
curl -s "题目地址/flag.php"
curl -s "题目地址/index.php.bak"
curl -s "题目地址/www.zip"
```

## 5. 关键知识点
- **前端没有秘密**：HTML、CSS、JS、注释、响应头、Cookie，用户全都能看到。
- 出题人藏 flag 的常见位置就是上面那张表，**记住这张表，70% 的入门 Web 题有解**。
- **原始源码 ≠ DOM**：`Ctrl+U` 拿到的是服务器发来的；Elements 显示的是 JS 执行后的。
  两者对比能发现"JS 动态插入的内容"。

## 6. 常见坑
- Elements 里看着有注释但搜不到？试试 `Ctrl+U`（原始源码可能有编码差异）。
- flag 被拆成几段分别写在不同的 JS 文件里，要学会 **Ctrl+Shift+F 全局搜索**。
- 有些题的 flag 要**访问另一个页面**才出现（比如 `/flag.php`），别死磕当前页。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

