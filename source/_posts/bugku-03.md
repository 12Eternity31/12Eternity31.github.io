---
title: Bugku 计算器 - WEB
date: 2026-10-12 22:29:00
updated: 2026-10-12 22:29:00
description: Bugku 基础 30 题 第 3 题：Bugku 计算器 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/69.html
- 附件：无

## 2. 题目描述
页面是一个计算器，让你算一道加法题，算对了才给 flag。
但是：**你只能填 1 位数**，题目却是 11 + 22 这种。

## 3. 解题思路（一句话）
这是**前端限制**（`maxlength="1"`），改掉它就能填正确答案。

## 4. 详细步骤

### 4.1 观察限制
F12 → Elements，找到那个输入框：

```html
<input type="text" maxlength="1" name="answer">
```

问题就在 `maxlength="1"` —— 浏览器只让你输 1 个字符。

### 4.2 改掉它（三种方法，任选）

**方法 A：直接双击改源码（最快）**
在 Elements 面板里双击 `maxlength="1"`，改成：

```html
<input type="text" name="answer">
```

（把整个 `maxlength` 属性删掉）

**方法 B：Console 里用 JS 改**
切到 Console，输入：

```javascript
document.getElementsByName("answer")[0].removeAttribute("maxlength");
```

**方法 C：Burp / HackBar 直接发请求**
把请求参数改成正确结果：

```
POST /challenges/... HTTP/1.1
...
answer=33
```

### 4.3 填入正确答案
页面上的加法算一下，填进去，点提交，flag 就出来了。

## 5. 关键知识点
- **前端校验 = 没有校验**。`maxlength`、`readonly`、`disabled`、JS 正则，全是客户端行为，改一下或直接发请求就绕过了。
- 真正安全的校验**必须在服务端做**。
- 这就是"**参数篡改 / 客户端校验绕过**"类漏洞的最小模型。

## 6. 常见坑
- 改了 `maxlength` 但表单还有 JS 校验？看 Console 报错，或者直接上 Burp 发包。
- 有些页面每次刷新题目会变，**先把答案算好再改**。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

