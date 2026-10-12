---
title: Bugku never give up - WEB
date: 2026-10-12 22:52:00
updated: 2026-10-12 22:52:00
description: Bugku 基础 30 题 第 26 题：Bugku never give up - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/75.html
- 附件：无

## 2. 题目描述
页面写着 **"never give up"**，然后下面有一行不起眼的提示，
比如 **"Welcome to bugku"** 之类的一串文字。看起来啥也没有。

## 3. 解题思路（一句话）
那行"不起眼"的文字里**藏着一个地址或参数**，
通常要**改 URL / 加参数 / 加请求头**才进得去。

## 4. 详细步骤

### 4.1 第一步：完整读页面文字（别跳读）
`Ctrl+U` 看源码，把页面上出现的**每一个词**都当线索：

```
never give up
Welcome to bugku
```
如果出现类似 `?what=flag`、`/a.php`、`bugku` 这样的东西，**照它做**。

### 4.2 第二步：常见套路清单

| 页面提示 | 你要做的 |
|---|---|
| 出现 `?cmd=` / `?url=` / `?file=` | 拼参数试试 |
| 出现一个 URL 或路径 | 直接访问它 |
| 出现 `bugku`、`flag`、`admin` 等词 | 当作参数值试 |
| 说"你来自哪里" | 改 `Referer` |
| 说"你用什么浏览器" | 改 `User-Agent` |
| 说"你不是从本地来的" | 改 `X-Forwarded-For: 127.0.0.1` |
| 说"看看别的地方" | 看 `robots.txt`、`/flag.php` |

### 4.3 第三步：curl 逐个试（脚本化）
```bash
URL="题目地址"

# 1. 原样看一遍
curl -s "$URL" | findstr /i "flag"

# 2. 加常见参数
for p in "what=flag" "flag=flag" "cmd=ls" "a=1"; do
  echo "--- $p ---"
  curl -s "$URL?$p" | findstr /i flag
done
```

> **Windows 的 `for` 语法和 Bash 不同**，上面这段建议在 **Git Bash / WSL** 里跑。
> PowerShell 版本：
> ```powershell
> $u = "题目地址"
> foreach ($p in "what=flag","flag=flag","a=1") {
>   Write-Host "--- $p ---"
>   (Invoke-WebRequest "$u`?$p").Content | Select-String -Pattern flag
> }
> ```

### 4.4 第四步：试请求头
```bash
curl -s -H "Referer: https://ctf.bugku.com/" "$URL" | findstr /i flag
curl -s -A "bugku" "$URL" | findstr /i flag
curl -s -H "X-Forwarded-For: 127.0.0.1" "$URL" | findstr /i flag
curl -s -H "Cookie: is_admin=1" "$URL" | findstr /i flag
```

### 4.5 第五步：看看有没有别的文件
```bash
for f in robots.txt flag.php index.php.bak www.zip backup.zip .git/config; do
  echo "--- $f ---"
  curl -s -o /dev/null -w "%{http_code}\n" "$URL/$f"
done
```
`200` 的就是存在的文件，去访问它。

> **状态码含义**：`200` 存在、`404` 不存在、`403` 存在但禁止访问（**403 也值得关注**）。

### 4.6 关于题目名 "never give up"
这题名暗示：**别放弃，多试几次 / 多试几个方向**。
Web 入门题的通用解法就是**穷举常见套路**，一个不行换下一个，
把上面 4.2 那张表从上到下试完，基本就出 flag 了。

## 5. 关键知识点
- **信息收集（Information Gathering）**是渗透测试的第一步，也是 CTF Web 题的第一步。
- **HTTP 请求头可以被任意伪造**，服务端如果信任它们就有问题：
  - `Referer`：来源页（可伪造防"防盗链"）
  - `User-Agent`：客户端标识
  - `X-Forwarded-For`：真实 IP（可伪造）
  - `Cookie`：身份标识
- **目录 / 文件探测**：`robots.txt`、`.git/`、`*.bak`、`www.zip` 是常见的**源码泄露**点。

### 5.1 自动化探测工具
- **dirsearch**：目录扫描
  ```bash
  python dirsearch.py -u "题目地址" -e php,html,txt,bak
  ```
- **Burp Intruder**：请求头 / 参数爆破
- **ffuf**：
  ```bash
  ffuf -u "题目地址/FUZZ" -w 字典.txt
  ```

## 6. 常见坑
- **别只盯着页面本身**，`robots.txt` 和 `.git/` 经常直接给答案。
- **别一次改多个变量**，要一个个试，否则不知道是哪个起了作用。
- 有的题目每次请求参数不同（比如带时间戳 / token），要用 Burp 的宏或脚本处理。
- 题目名 / 题面里的**每个字都可能是提示**，中文题尤其如此。
