---
title: Bugku [+-<>] - Crypto
date: 2026-10-12 22:41:00
updated: 2026-10-12 22:41:00
description: Bugku 基础 30 题 第 15 题：Bugku [+-<>] - Crypto
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/49.html
- 附件：一大段只由 `+` `-` `<` `>` `[` `]` `.` `,` 组成的文本

## 2. 题目描述
题目名就是 `[+-<>]`，附件内容长这样：

```
+++++ +++++ [ > +++++ ++ < - ] > ++ . ...
```

## 3. 解题思路（一句话）
这就是 **Brainfuck** 语言本身，8 个符号，跑一下（或者用在线解释器）就出 flag。

## 4. 详细步骤

### 4.1 Brainfuck 的 8 个指令
| 符号 | 含义 |
|---|---|
| `>` | 数据指针右移一格 |
| `<` | 数据指针左移一格 |
| `+` | 当前格子值 +1 |
| `-` | 当前格子值 -1 |
| `.` | 输出当前格子对应的 ASCII 字符 |
| `,` | 读入一个字符到当前格子 |
| `[` | 如果当前格子为 0，跳到匹配的 `]` 之后 |
| `]` | 如果当前格子不为 0，跳回匹配的 `[` 之后 |

**内存模型**：一个很长的"纸带"（数组），每格存一个字节，有个指针在上面移动。

### 4.2 在线解释器（最快）
- <https://gchq.github.io/CyberChef/> → 搜 `Brainfuck`
- <https://www.dcode.fr/brainfuck-language>
- <https://copy.sh/brainfuck/>（能看执行动画，适合理解原理）

把整段密文粘进去 → Run → 出 flag。

### 4.3 自己写解释器（推荐，一次学会以后都能用）
新建 `bf.py`：

```python
def run_bf(bf, max_steps=2_000_000):
    tape = [0] * 30000
    ptr = 0
    pc = 0
    out = []

    # 1) 预处理：把 [ 和 ] 配对，避免运行时反复扫描
    stack, jump = [], {}
    for i, ch in enumerate(bf):
        if ch == '[':
            stack.append(i)
        elif ch == ']':
            if not stack:
                raise SyntaxError(f"多余的 ] 在位置 {i}")
            j = stack.pop()
            jump[i], jump[j] = j, i
    if stack:
        raise SyntaxError(f"未闭合的 [ 在位置 {stack[-1]}")

    # 2) 逐条执行
    steps = 0
    while pc < len(bf) and steps < max_steps:
        c = bf[pc]
        if   c == '>': ptr += 1
        elif c == '<': ptr -= 1
        elif c == '+': tape[ptr] = (tape[ptr] + 1) % 256
        elif c == '-': tape[ptr] = (tape[ptr] - 1) % 256
        elif c == '.': out.append(chr(tape[ptr]))
        elif c == ',': pass                      # 本题不需要输入
        elif c == '[' and tape[ptr] == 0: pc = jump[pc]
        elif c == ']' and tape[ptr] != 0: pc = jump[pc]
        pc += 1
        steps += 1

    if steps >= max_steps:
        print("[!] 达到步数上限，可能有死循环")
    return ''.join(out)

# 附件里所有非 Brainfuck 字符（空格、换行）都会自动被忽略
data = open('bf.txt', encoding='utf-8').read()
code = ''.join(ch for ch in data if ch in '+-<>[].,')
print(run_bf(code))
```

跑：
```bash
python bf.py
```

### 4.4 看一段小例子理解输出
```
++++++++[>++++++++<-]>+.      输出 'A'
```
拆解：
1. `++++++++` → 格子0 = 8
2. `[>++++++++<-]` → 循环 8 次，每次"右边格子+8，左边格子-1" → 格子1 = 64
3. `>.` → 指针移到格子1，输出 64 = 字符 `A`（ASCII 65 是 `A`，所以这里是示例）

> 真实题目里会有一长串，最终输出类似 `flag{xxxx}`。

## 5. 关键知识点
- **Brainfuck**：1993 年 Urban Müller 设计的极简图灵完备语言，只有 8 个指令。
- **图灵完备**：理论上能算任何可计算的问题 —— 这 8 个符号已经够写一个操作系统了（真的有人写过）。
- 它是**解释型语言**，直接跑字符流，不需要编译。
- 相关：`Ook!`（第 14 题）和 `[+-<>]` 本质是同一门语言的不同皮肤。

## 6. 常见坑
- **步数爆炸**：写解释器一定要设 `max_steps`，否则死循环卡死。
- 输入里混了中文标点（全角 `＋` `－`）？先替换成半角。
- 输出乱码？确认纸带初始值都是 0，并且每格按 `% 256` 处理。
- 有些题目会**故意删掉一部分 `[` `]`** 让你补全，那就要看题意了。
