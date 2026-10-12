---
title: Bugku 聪明的小羊 - Crypto
date: 2026-10-12 22:39:00
updated: 2026-10-12 22:39:00
description: Bugku 基础 30 题 第 13 题：Bugku 聪明的小羊 - Crypto
cover: 
top_img: 
tags:
  - Bugku
  - CRYPTO
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,CRYPTO
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：Crypto
- 难度：★☆☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/47.html
- 附件：一段密文

## 2. 题目描述
题面给出密文，比如：

```
iafqsh{...}   或   kqi{...}
```

提示跟"羊"有关。

## 3. 解题思路（一句话）
"羊"→ **Caesar（凯撒）** 的谐音梗？不完全对 ——
这题的经典提示是：**"羊" = ROT13 里的梗，本质是凯撒移位密码**。
看到字母表里的字母被整体"挪位"，先怀疑**凯撒密码 / ROT13**。

## 4. 详细步骤

### 4.1 先试最有名的 ROT13
**ROT13 = 凯撒移位 13 位**（因为 13 是 26 的一半，加密解密是同一个操作）。

```python
import codecs
print(codecs.decode('frperg', 'rot13'))   # 输出 secret
```

一行命令：
```bash
python -c "import codecs;print(codecs.decode('你的密文','rot13'))"
```

### 4.2 如果不是 ROT13，暴力试 1~25 所有移位
新建 `caesar.py`：

```python
def caesar(s, shift):
    out = []
    for c in s:
        if 'a' <= c <= 'z':
            out.append(chr((ord(c) - ord('a') + shift) % 26 + ord('a')))
        elif 'A' <= c <= 'Z':
            out.append(chr((ord(c) - ord('A') + shift) % 26 + ord('A')))
        else:
            out.append(c)          # 数字、括号、下划线等原样保留
    return ''.join(out)

cipher = "把你的密文粘这里"

for i in range(26):
    print(i, caesar(cipher, i))
```

跑：
```bash
python caesar.py
```

输出 26 行，**哪一行长得像正常英文单词，移位就是它**（反向：`caesar(cipher, -i)` 解密）。

### 4.3 举例（一看就懂）
以 `flag{hello}` 为例，右移 3 位加密后是 `iodj{khoor}`：

| 原文 | 密文（+3） |
|---|---|
| f | i |
| l | o |
| a | d |
| g | j |

所以解密的做法就是**每一行都看，找那句人话**。

### 4.4 在线工具
- <https://gchq.github.io/CyberChef/> → 搜 `ROT13` / `ROT13 Brute Force`
- <https://www.dcode.fr/caesar-cipher>（会直接把最可能的答案排前面）

## 5. 关键知识点
- **凯撒密码**：把字母表整体平移 N 位，是最古老的替换密码。
- 密钥空间只有 **25** 种，**穷举 1 秒就完事** —— 这就是"**穷举攻击**"。
- **ROT13** 是移位 13 的特例，加密 = 解密。
- 破解替换密码的通用判断标准：**解出来是不是像英文单词**（`the`、`flag`、`is`、`key`）。

## 6. 常见坑
- 密文里的 `{}` `_` 数字**不参与移位**，你写脚本时一定要保留（上面代码里 `else: out.append(c)` 就是干这个的）。
- 区分大小写：大写字母表和大写字母表对应，别混。
- 解出来是部分像英文、部分不像？那可能不是凯撒，去看 **维吉尼亚密码** 或者 **词频分析**。
