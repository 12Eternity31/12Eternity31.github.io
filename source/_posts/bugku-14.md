---
title: Bugku ok - Crypto
date: 2026-10-12 22:40:00
updated: 2026-10-12 22:40:00
description: Bugku 基础 30 题 第 14 题：Bugku ok - Crypto
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/48.html
- 附件：一大段由 `Ook.` `Ook?` `Ook!` 组成的文本

## 2. 题目描述
附件内容长这样：

```
Ook. Ook! Ook? Ook. Ook. Ook? Ook! ...
```

看起来像猩猩说话 —— 这就是 **Ook!** 语言。

## 3. 解题思路（一句话）
`Ook!` 是给猩猩设计的**图灵完备编程语言**，本质是 **Brainfuck 的替换版**，
有现成解码器，粘进去就能出 flag。

## 4. 详细步骤

### 4.1 Ook! 是什么
`Ook!` 只有三种词素：`Ook.`、`Ook?`、`Ook!`，两两组合成一个指令，共 8 种组合：

| Ook! 组合 | 对应 Brainfuck | 含义 |
|---|---|---|
| `Ook. Ook?` | `>` | 指针右移 |
| `Ook? Ook.` | `<` | 指针左移 |
| `Ook. Ook.` | `+` | 当前单元 +1 |
| `Ook! Ook!` | `-` | 当前单元 -1 |
| `Ook! Ook.` | `.` | 输出当前单元字符 |
| `Ook. Ook!` | `,` | 读入一个字符 |
| `Ook! Ook?` | `[` | 循环开始 |
| `Ook? Ook!` | `]` | 循环结束 |

**所有 Ook 语言都靠"两个词一组"来编码 Brainfuck 的 8 个指令。**

### 4.2 直接在线解（30 秒搞定）
1. 打开 <https://gchq.github.io/CyberChef/>
2. 右上角搜索框输入 `Ook`
3. 把 `Ook!` 模块拖到 Recipe 区
4. 左边 Input 粘密文，右边 Output 就是答案

其他在线解码器：
- <https://www.dcode.fr/ook-language>
- <https://www.splitbrain.org/services/ook>（老牌，很好用）

### 4.3 自己写 Python 解（理解原理）
```python
import re

OOK2BF = {
    ('Ook.',  'Ook?'): '>',
    ('Ook?',  'Ook.'): '<',
    ('Ook.',  'Ook.'): '+',
    ('Ook!',  'Ook!'): '-',
    ('Ook!',  'Ook.'): '.',
    ('Ook.',  'Ook!'): ',',
    ('Ook!',  'Ook?'): '[',
    ('Ook?',  'Ook!'): ']',
}

def ook_to_bf(code):
    # 把 "Ook." "Ook!" "Ook?" 提取成列表
    tokens = re.findall(r'Ook[.?!]', code)
    assert len(tokens) % 2 == 0, "词素个数必须是偶数"
    bf = ''
    for i in range(0, len(tokens), 2):
        bf += OOK2BF[(tokens[i], tokens[i + 1])]
    return bf

def run_bf(bf, max_steps=1_000_000):
    """运行 Brainfuck 代码"""
    tape = [0] * 30000
    ptr = 0
    pc = 0
    out = []
    # 预先配对 [ 和 ]
    stack, jump = [], {}
    for i, ch in enumerate(bf):
        if ch == '[':
            stack.append(i)
        elif ch == ']':
            j = stack.pop()
            jump[i], jump[j] = j, i

    steps = 0
    while pc < len(bf) and steps < max_steps:
        c = bf[pc]
        if   c == '>': ptr += 1
        elif c == '<': ptr -= 1
        elif c == '+': tape[ptr] = (tape[ptr] + 1) % 256
        elif c == '-': tape[ptr] = (tape[ptr] - 1) % 256
        elif c == '.': out.append(chr(tape[ptr]))
        elif c == ',': pass                # 不需要读入
        elif c == '[' and tape[ptr] == 0: pc = jump[pc]
        elif c == ']' and tape[ptr] != 0: pc = jump[pc]
        pc += 1
        steps += 1

    return ''.join(out)

data = open('ook.txt', encoding='utf-8').read()   # ← 换成你的附件名
bf = ook_to_bf(data)
print("Brainfuck 代码:", bf)
print("输出:", run_bf(bf))
```

跑：
```bash
python ook.py
```

## 5. 关键知识点
- **Ook!**：2009 年由 David Morgan-Mar 设计的"给猩猩看的"深奥语言（esolang）。
- **Brainfuck**：8 个符号的极简语言，`Ook!` 是它的**纯符号替换版本**。
- **esolang 三兄弟**：Brainfuck `+-<>[].,`、Ook!、还有本题第 15 题的 `[+-<>]`。
- 遇到看不懂的符号串，**先搜符号特征**（比如 "Ook" 直接搜就能知道是什么语言），别硬猜。

## 6. 常见坑
- 复制密文时**别丢换行**，Ook 是两两一组的，丢一个词后面全错位。
- 有些题把 `Ook.` 写成 `Ook。`（中文句号）或者 `Ook` 后面多个空格，先规范化。
- 跑出来一堆乱码？检查你的映射表是不是**方向反了**（`.?` 和 `?.` 别抄错）。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

