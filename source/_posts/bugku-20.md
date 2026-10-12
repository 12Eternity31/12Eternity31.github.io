---
title: Bugku .!? - Crypto
date: 2026-10-12 22:46:00
updated: 2026-10-12 22:46:00
description: Bugku 基础 30 题 第 20 题：Bugku .!? - Crypto
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/54.html
- 附件：一段只由 `.` `!` `?` 组成的文本

## 2. 题目描述
附件内容类似：

```
..!..?..! .!..!..? ...
```

只有三个符号。**三个符号 + 分组 = 敲击码（Tap Code）/ 三进制**。

## 3. 解题思路（一句话）
`.` `!` `?` 三个符号，很像**用符号替换了摩斯码**，也可能是**敲击码**或**三进制编码**。
优先用工具自动识别。

## 4. 详细步骤

### 4.1 观察结构的两种可能

**可能 A：摩斯码的符号替换**
如果文本是"一串短串，用空格分开"，每个短串长度 1~5：

```
.!! .! ..? .!.    →  很像摩斯（点/划的变体）
```
把两个符号分别映射成 `.` 和 `-` 再解摩斯（看第 12 题）。

**可能 B：敲击码（Tap Code / Polybius）**
如果文本是"成对的符号组"，比如每组恰好 2 个符号：

```
.. !. .? !? .!    →  第1个符号=行, 第2个符号=列
```
这是**波利比奥斯方阵（5×5）**，靠"行号 + 列号"定位字母。

### 4.2 先丢进自动识别工具
- <https://gchq.github.io/CyberChef/> → 试这几个模块：
  - `From Morse Code`（先手工把符号换成 `.` `-`）
  - `Tap Code`（如果 CyberChef 版本有）
  - `From Base`（设置 base 3 / base 2）
- <https://www.dcode.fr/cipher-identifier> ← **【强烈推荐】**
  把密文粘进去，dcode 会**自动猜**是哪种密码，并直接给候选答案。

> **dcode 的 Cipher Identifier 是新手神器**：不确定是什么密码时，先扔进去问它。

### 4.3 如果是摩斯变体：手工替换
假设 `.` `!` `?` 中，`.` 还是点，`!` 是划，`?` 是分隔符：

```python
data = "把你题目里的密文粘这里"

# 试着把 ? 当分隔符，! 当划，. 当点
t = data.replace('?', ' ').replace('!', '-')
print(t)
# 输出再丢进 CyberChef 的 From Morse Code
```

### 4.4 如果是敲击码：查 5×5 方阵
**波利比奥斯方阵**（经典版，把 I/J 合并）：

|   | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **1** | A | B | C | D | E |
| **2** | F | G | H | I/J | K |
| **3** | L | M | N | O | P |
| **4** | Q | R | S | T | U |
| **5** | V | W | X | Y | Z |

**编码规则**：字母 → (行, 列)。比如 `F` = (2,1)，`L` = (3,1)，`A` = (1,1)，`G` = (2,2)。

**所以：**
```
密文 .!  →  如果 .=1, !=2  →  (1,2)  →  B
        ..  →  (1,1)  →  A
        !.  →  (2,1)  →  F
```

**Python 解码器**：

```python
def tap_code_decode(cipher, s1='.', s2='!'):
    """cipher: 一串符号，每 2 个一组代表 (行, 列)"""
    table = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"   # 5x5 展开（I/J 合并）
    # 更精确：按 5x5 方阵
    grid = [
        "ABCDE",
        "FGHIK",     # I/J 合并，这里用 I
        "LMNOP",
        "QRSTU",
        "VWXYZ",
    ]
    tokens = [cipher[i:i+2] for i in range(0, len(cipher), 2)]
    out = []
    for tok in tokens:
        if len(tok) < 2:
            continue
        r = 1 if tok[0] == s1 else 2 if tok[0] == s2 else 0
        c = 1 if tok[1] == s1 else 2 if tok[1] == s2 else 0
        if 1 <= r <= 5 and 1 <= c <= 5:
            out.append(grid[r-1][c-1])
    return ''.join(out)

data = "把密文粘这里（去掉空格换行）"
print(tap_code_decode(data, '.', '!'))
# 若符号映射反了，交换参数再试：tap_code_decode(data, '!', '.')
```

### 4.5 实在解不出：试三进制 / 二进制
三个符号 = 三进制数字 0/1/2：

```python
data = "把密文粘这里"
s = data.replace('.', '0').replace('!', '1').replace('?', '2')
# 去掉空格后按 8 位一组（如果原来是二进制的话）
t = ''.join(s.split())
print('长度:', len(t))
# 三进制转字符串（按 3 位一组映射到 ASCII 是常见玩法，但需按题目验证）
```

> 这步只是"排除法"，**别在这里耗太久** —— 有工具就用工具。

## 5. 关键知识点
- **敲击码（Tap Code）**：越战战俘用来通信的密码，用"敲几下"表示行和列，本质是**波利比奥斯方阵的变体**。
- **波利比奥斯方阵（Polybius Square）**：5×5 表格，用"坐标"表示 26 个字母（I/J 合并）。这是**很多密码的基础**（ADFGVX、双密码本等）。
- **符号替换**：题目常把 `.` `-` 换成 `!` `?` `1` `0` `A` `B` 之类，**先做符号归一化**是解密码题的第一步。
- **判断长度**：每组符号长度固定 = 分组编码；长度不定 = 摩斯码。

### 5.1 密码题通用解题流程
```
1. 看长度和分组规律
2. 做符号归一化（把奇怪符号换成 0/1 或 ./−）
3. 丢进 dcode Cipher Identifier 自动识别
4. 按识别结果解
5. 解出来还不是明文？继续解下一层（多层编码很常见）
```

## 6. 常见坑
- 题目给的分隔符可能是**换行**而不是空格，先规范化（`.replace('\n',' ')`）。
- I/J 合并的方阵里，解出来的 `I` 可能是 `J`，提交时两种都试试。
- 三层套娃（比如 敲击码 → Base64 → flag）很常见，**别解出一步就停**。
