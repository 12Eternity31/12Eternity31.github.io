---
title: Bugku linux - MISC
date: 2026-10-12 22:43:00
updated: 2026-10-12 22:43:00
description: Bugku 基础 30 题 第 17 题：Bugku linux - MISC
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/15.html
- 附件：一个文件（可能是无扩展名的二进制 / 文本）

## 2. 题目描述
给一个文件，让你"在 Linux 里找 flag"。
考的是**基础 Linux 命令**。

## 3. 解题思路（一句话）
`file` 看类型 → `strings` 捞明文 → `binwalk` 看有没有套娃 → 十六进制看头尾。

## 4. 详细步骤

### 4.1 先搞清楚它是什么
```bash
file 附件名
```
可能的输出：
```
附件名: ELF 64-bit LSB executable        → Linux 可执行文件
附件名: ASCII text                       → 纯文本
附件名: gzip compressed data             → 压缩包
附件名: Zip archive data                 → ZIP
附件名: JPEG image data                  → 图片
附件名: data                             → 没有明显特征，看十六进制
```

### 4.2 捞明文（最常用）
```bash
strings 附件名 | grep -i flag
strings 附件名 | less          # 一页页翻
```

> **Windows 用户**：装 [Git for Windows](https://git-scm.com/download/win) 会自带
> `strings`？不一定。更简单的方法：
> ```powershell
> # 用 Python 代替 strings（跨平台，万能）
> python -c "
> import re,sys
> data=open(r'附件名','rb').read()
> for m in re.finditer(rb'[\x20-\x7e]{4,}', data):
>     print(m.group().decode())
> " | findstr /i flag
> ```
> 或者用 **Notepad++ 打开，Ctrl+F 搜 `flag`**。

### 4.3 如果 strings 没有，看头尾
用 **HxD** / **010 Editor** 打开，重点看：
- **文件头（开头的 magic bytes）**：判断真实类型
- **文件尾（最后几十字节）**：追加的 flag 常常在这里

常见 magic bytes：

| 十六进制 | 类型 |
|---|---|
| `FF D8 FF` | JPEG |
| `89 50 4E 47` | PNG |
| `47 49 46 38` | GIF |
| `50 4B 03 04` | ZIP |
| `1F 8B` | GZIP |
| `7F 45 4C 46` | ELF（Linux 可执行） |
| `25 50 44 46` | PDF |
| `52 61 72 21` | RAR |

### 4.4 看有没有套娃（隐写 / 复合文件）
```bash
binwalk 附件名            # 列出里面嵌了什么
binwalk -e 附件名         # 提取出来
```

**Windows 没有 binwalk** 时的手工办法：
- 用 **7-Zip** 右键 → 打开压缩包 → 试试能不能当 ZIP 打开
- 用 HxD 找到 `PK`（ZIP 头）的位置，从那里开始**截取**存成新文件
- 用 Python 自动找并提取：
```python
import re
data = open('附件名', 'rb').read()
# 找所有 ZIP 头的位置
for m in re.finditer(rb'PK\x03\x04', data):
    print('发现 ZIP，偏移:', m.start())
    open(f'提取_{m.start()}.zip', 'wb').write(data[m.start():])
    break
```

### 4.5 如果是可执行文件
```bash
chmod +x 附件名       # 加执行权限
./附件名              # 直接跑，看它输出什么
```

### 4.6 顺带检查
```bash
exiftool 附件名        # EXIF / 元数据
cat 附件名             # 如果是文本
head -c 200 附件名 | xxd   # 看开头 200 字节
```

## 5. 关键知识点
- **`file` 命令**：靠 **magic bytes（文件头魔数）** 判断真实类型，**不要相信扩展名**。
- **`strings`**：从二进制里提取连续可打印字符，是最快的"找明文"手段。
- **`binwalk`**：检测并提取"文件里套文件"，是 MISC 题的必备工具。
- **Linux 基础命令**是 CTF 的地基：`ls` `cat` `file` `strings` `grep` `xxd` `chmod` `head` `tail` `find`。

### 5.1 新手必备 10 条 Linux 命令
```bash
ls -la                 # 列出所有文件（含隐藏）
file xxx               # 看真实类型
cat xxx                # 看文本内容
strings xxx            # 提取字符串
grep -i flag xxx       # 在文本里搜 flag（忽略大小写）
xxd xxx | head         # 十六进制看开头
xxd xxx | tail         # 十六进制看结尾
chmod +x xxx           # 加执行权限
tar -xzf xxx.tar.gz    # 解压
find . -name "*.txt"   # 找文件
```

## 6. 常见坑
- 附件没有扩展名，Windows 双击会说"不知道用什么打开" —— **别双击，先用 `file` / 看十六进制**。
- 下载的附件被 Windows 自动加了 `.txt`？重命名去掉，或按实际类型处理。
- **改了扩展名不代表改了文件类型**。一个 PNG 改成 `.zip` 还是 PNG，7-Zip 打不开。
