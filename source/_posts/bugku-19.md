---
title: Bugku 散乱的密文 - Crypto
date: 2026-10-12 22:45:00
updated: 2026-10-12 22:45:00
description: Bugku 基础 30 题 第 19 题：Bugku 散乱的密文 - Crypto
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
- 难度：★★☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/52.html
- 附件：一段被"打乱"的密文（可能带一个提示数字/字符串）

## 2. 题目描述
密文的字母/字符被**按某种规则重新排序**了，看起来是一堆字母，但顺序不对。
这种叫 **换位密码 / 置换密码**。

## 3. 解题思路（一句话）
字都全，只是**位置错了** → 试 **栅栏密码（Rail Fence）** 和 **列置换（Columnar Transposition）**，
穷举所有可能的分组长度，挑出人话。

## 4. 详细步骤

### 4.1 先判断类型：换位 vs 替换
```
密文: sanrihcezhuang...（字母种类和正常英文一样，只是顺序怪）→ 换位密码
密文: iodj{khoor}（字母被整体挪位）→ 替换密码（凯撒，看第 13 题）
密文: xyzabc...（频率分布均匀、完全看不懂）→ 现代加密 / 需密钥
```

**看到"字符都在，位置不对" = 换位密码。**

### 4.2 试栅栏密码（Rail Fence）
栅栏密码把明文**按"之字形"写在几行上**，然后按行读出来。

**例：明文 `flaghello`，2 栏加密**
```
之字形写入（2 栏）:
f . a . h . l . o        → 读第 1 行: fahlo
. l . g . e . l .        → 读第 2 行: lgel
密文 = fahlolgel
```

解密就是**反过来**：把密文按行切好，再按之字形读回。

**穷举所有栏数（Python）**：

```python
def rail_fence_decrypt(cipher, rails):
    """栅栏密码解密"""
    if rails <= 1:
        return cipher
    n = len(cipher)
    # 1) 构造之字形的位置索引
    pattern = [[] for _ in range(rails)]
    row, direction = 0, 1
    for i in range(n):
        pattern[row].append(i)
        if row == 0:
            direction = 1
        elif row == rails - 1:
            direction = -1
        row += direction
    # 2) 按行填充密文
    result = [''] * n
    idx = 0
    for r in range(rails):
        for pos in pattern[r]:
            result[pos] = cipher[idx]
            idx += 1
    return ''.join(result)

cipher = "把你的密文粘这里"

for rails in range(2, 11):
    print(rails, rail_fence_decrypt(cipher, rails))
```

**输出里找像英文/像 flag 的那一行**，那个栏数就是答案。

### 4.3 试列置换密码（Columnar Transposition）
把明文按**固定宽度**（密钥长度）分行写成矩阵，再**按列读出**。

**例：明文 `flagishere`，宽度 4**

```
把明文按行填进 4 列的表格:
f l a g
i s h e
r e

按"列"读出（从上到下、从左到右）:
第1列: f i r
第2列: l s e
第3列: a h
第4列: g e
密文 = fir + lse + ah + ge = "firlseahge"
```

反过来解密就是：**先按列长度切分密文，再填回表格，最后按行读出来**。

**穷举所有宽度（Python）**：

```python
def columnar_decrypt(cipher, cols):
    """列置换解密（按列读出 -> 还原矩阵 -> 按行读回）"""
    n = len(cipher)
    rows = (n + cols - 1) // cols
    full = n % cols                 # 最后一行有几列（如果整除就是 cols）
    if full == 0:
        full = cols

    # 每列的长度
    col_lens = [rows if c < full else rows - 1 for c in range(cols)]

    # 按列切分密文
    cols_data, idx = [], 0
    for c in range(cols):
        cols_data.append(cipher[idx:idx + col_lens[c]])
        idx += col_lens[c]

    # 还原成行
    out = []
    for r in range(rows):
        for c in range(cols):
            if r < len(cols_data[c]):
                out.append(cols_data[c][r])
    return ''.join(out)

cipher = "把你的密文粘这里"

for cols in range(2, 16):
    print(cols, columnar_decrypt(cipher, cols))
```

### 4.4 用在线工具（更省事）
- <https://gchq.github.io/CyberChef/> → 搜 `Rail Fence Cipher Decode`（可以设 Brute Force）
- <https://www.dcode.fr/rail-fence-cipher>（有穷举，会自动给候选）
- <https://www.dcode.fr/transposition-cipher>

### 4.5 题目给了密钥怎么办
如果题目给了个数字或单词（比如 `2` 或 `key`）：
- **数字 N** → 一般就是**栏数 / 列数**，直接用它解
- **单词** → 列置换的**列顺序密钥**，按字母序给列编号再还原

## 5. 关键知识点
- **换位密码（Transposition Cipher）**：只改变字符**位置**，不改变字符本身。
  - 所以密文的**字符频率和明文完全一样** —— 这是判断换位密码的铁证。
- **替换密码（Substitution Cipher）**：改变字符本身（凯撒、维吉尼亚、猪圈）。
- 换位密码的常见变体：**栅栏、列置换、矩形转置、倒序、蛇形读法**。
- 破解思路：**穷举参数（栏数/列数）+ 人眼挑"人话"**。

### 5.1 判断口诀
```
字符全在 → 换位（试栅栏 / 列置换）
字符变了 → 替换（试凯撒 / ROT13 / 词频分析）
字符变符号了 → 编码（摩斯 / Brainfuck / Base64 / 核心价值观）
```

## 6. 常见坑
- 密文里的 `{}` `_` `!` 等符号**也参与重排**，脚本要按整体处理，不能只处理字母。
- 栅栏密码有"**之字形（W 型）**"和"**普通分行**"两种变体，两种都试一遍。
- 穷举结果里可能有多个"看起来还行"的，**挑有 `flag` 字样的那个**。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

