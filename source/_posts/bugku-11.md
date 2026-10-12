---
title: Bugku 这是一张单纯的图片 - MISC
date: 2026-10-12 22:37:00
updated: 2026-10-12 22:37:00
description: Bugku 基础 30 题 第 11 题：Bugku 这是一张单纯的图片 - MISC
cover: 
top_img: 
tags:
  - Bugku
  - MISC
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,MISC
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：MISC
- 难度：★☆☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/2.html
- 附件：一张图片（`1.jpg` 之类的）

## 2. 题目描述
下载一张看起来人畜无害的图，题目说"这是一张单纯的图片"。
（**翻译：它一点也不单纯。**）

## 3. 解题思路（一句话）
flag 被 **Base64 编码后写在图片文件末尾**（追加数据），用记事本打开拉到最后就能看到。

## 4. 详细步骤

### 4.1 先做常规检查
```bash
# 看文件真实类型
file 1.jpg

# 看文件头（确认是 JPG）
# JPG 开头是 FF D8 FF，PNG 开头是 89 50 4E 47
```

### 4.2 拉到最后看明文
**方法 A：记事本 / VSCode 打开图片，拉到最底部**
文件末尾会有一段可读字符，长这样：

```
...ÿÙflag{xxxxxxxx}
```

看到 `flag{...}` 直接抄。

**方法 B：命令行（推荐）**
```bash
# Windows
findstr /i flag 1.jpg

# Linux / macOS
strings 1.jpg | grep -i flag
```

**方法 C：十六进制查看**
用 **HxD**（Windows 免费）或 **010 Editor** 打开，拉到文件末尾：
```
FF D8 FF ... [正常 JPG 数据] ... FF D9  ← 这里 JPG 就结束了
66 6C 61 67 7B ... }                   ← 后面全是追加的 flag 明文
```

### 4.3 如果看到的是乱码字符串
说明被编码了。常见几种：

| 特征 | 编码 | 解法 |
|---|---|---|
| 结尾是 `=` 或 `==`，字符集 `A-Za-z0-9+/` | Base64 | 直接解 |
| 只有 `.` 和 `-` | 摩斯码 | 见第 12 题 |
| 十六进制 `666c61677b` | Hex | 转 ASCII |
| 一串数字 | ASCII 或 Unicode | 转字符 |

在线工具：<https://gchq.github.io/CyberChef/> → 搜 `From Base64`。

命令行解 Base64：
```bash
# Linux / Git Bash
echo "ZmxhZ3t4eH0=" | base64 -d

# Python（跨平台）
python -c "import base64;print(base64.b64decode('ZmxhZ3t4eH0=').decode())"
```

## 5. 关键知识点
- **文件追加数据（File Append）**：JPG/PNG/GIF 这类格式有明确的结束标志，解析器读到结束标志就停了，
  **后面再塞多少数据都不影响图片正常显示** —— 这是最简单的隐写。
- 相关概念：**文件尾隐写**、**Slack Space**、**EXIF 注释**。
- 通用排查顺序：`file` → `strings` → `exiftool` → `binwalk` → 十六进制看头尾。

### 5.1 顺带检查 EXIF（很多题藏在这里）
```bash
exiftool 1.jpg
```
> 没装 exiftool？Windows 可以右键图片 → 属性 → 详细信息，
> 或者用在线工具 <https://exif.tools/>。

### 5.2 检查有没有附加文件（binwalk）
```bash
binwalk 1.jpg        # 看有没有嵌入 ZIP / PNG
binwalk -e 1.jpg     # 直接提取
```
Windows 没 binwalk？用 **7-Zip** 打开图片试试（很多图片后面接了个 ZIP），或者装 WSL。

## 6. 常见坑
- 用**记事本**打开大图会卡死，小图可以。
- `strings` 搜不到？可能 flag 是**大小写混合的编码**，试试搜 `ZmxhZ`（Base64 里 `flag` 的开头）。
- 别急着上复杂工具，**先 `strings` 一把**，入门题 60% 都是明文追加。
