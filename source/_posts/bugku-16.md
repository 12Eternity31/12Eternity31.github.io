---
title: Bugku 入门逆向 - Reverse
date: 2026-10-12 22:42:00
updated: 2026-10-12 22:42:00
description: Bugku 基础 30 题 第 16 题：Bugku 入门逆向 - Reverse
cover: 
top_img: 
tags:
  - Bugku
  - REVERSE
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,REVERSE
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：Reverse（逆向工程）
- 难度：★☆☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/99.html
- 附件：一个 Windows 可执行文件（`.exe`）

## 2. 题目描述
运行程序，让你输入一个 key，输对了给 flag。这是**最简单的逆向题**：
程序把 flag 做了个很笨的变换，逆回来就行。

## 3. 解题思路（一句话）
用 IDA / Ghidra 打开程序，找到主函数里对字符串做运算的那几行，
**把运算反过来**就得到 flag。

## 4. 详细步骤

### 4.1 第一步：先跑一下 + 看字符串（30 秒）
```bash
# 在 Windows 上直接双击运行，或者命令行
入门逆向.exe
```

然后拖出字符串：
```bash
strings 入门逆向.exe | findstr /i "flag key"
```

> Windows 没 `strings`？用 **Notepad++ 打开 exe 搜 `flag`**，
> 或者装上 **Sysinternals Strings**（微软官方，免安装）：
> <https://learn.microsoft.com/sysinternals/downloads/strings>

如果能直接看到 `flag{...}`，恭喜，交了就完事（很多入门逆向就这样）。

### 4.2 第二步：用 IDA 反汇编（正戏）
1. 下载 **IDA Free**（免费版够用）：<https://hex-rays.com/ida-free/>
2. 拖进 exe，一路默认，等分析完
3. 左侧 **Functions window** 找 `main`（或者按 `F5` 用 Hex-Rays 看伪代码）

**本题典型伪代码长这样：**

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  int i;
  char v4[40];

  strcpy(v4, "bu`e4XYzZ]Y[Z");      // ← 被"加密"过的字符串
  for ( i = 0; i < strlen(v4); ++i )
    v4[i] += 1;                     // ← 每个字符 +1，就这么简单
  printf("flag{%s}\n", v4);
  return 0;
}
```

> 上面的 `bu`e4XYzZ]Y[Z` 只是**格式示例**，你题目里的字符串以实际为准。
> **关键点：循环里对每个字符做了 `+1`。**

### 4.3 第三步：把运算反回去
既然是 `+1`，那**原始 flag = 每个字符 -1**：

```python
s = "bu`e4XYzZ]Y[Z"        # ← 换成你在 IDA 里看到的字符串
print("flag{%s}" % ''.join(chr(ord(c) - 1) for c in s))
```

输出：
```
flag{...}
```

### 4.4 如果想不装 IDA（备选方案）
- **Ghidra**（NSA 开源，功能不输 IDA）：<https://ghidra-sre.org/>
- **在线反汇编**：把 exe 传到 <https://www.onlinegdb.com/> （支持有限）
- **Python 硬算**：如果只看到一个字符串，直接猜最常见的变换：
  ```python
  s = "你的字符串"
  for d in (-2, -1, 1, 2):          # 试试 ±1 ±2
      print(d, ''.join(chr(ord(c) + d) for c in s))
  for k in range(1, 128):           # 试试异或
      r = ''.join(chr(ord(c) ^ k) for c in s)
      if 'flag' in r.lower():
          print('xor', k, r)
  ```

### 4.5 更懒的办法：动态调试直接"跳"过去
用 **x64dbg / OllyDbg**，在 `printf` 前下断点，
或者直接把那个 `jz/jnz` 判断改成永远成立 —— 程序自己会把 flag 打印出来。
（新手先别急，等熟练了再玩动态调试。）

## 5. 关键知识点
- **逆向工程** = 从二进制还原出程序逻辑。
- 做题三板斧：**`strings` 找明文 → IDA/Ghidra 看伪代码 → 写脚本逆运算**。
- 入门逆向的"加密"几乎都是**单字节线性变换**：`+n`、`-n`、`^n`、`~`、`大小写互换`、`字符交换`。
- 常见工具：**IDA Free / Ghidra**（静态）、**x64dbg / OllyDbg**（动态）、**PEiD / DIE**（查壳）。

### 5.1 查壳（有些 exe 加壳了）
用 **Detect It Easy (DIE)**：
- 如果显示 `UPX`，先脱壳：`upx -d 程序.exe`
- 如果显示 `VMProtect / Themida`，那这题就不入门了，换题。

## 6. 常见坑
- **IDA Free 没有 Hex-Rays（反编译器）**？有的版本有。没有就装 **Ghidra**，Ghidra 的反编译是免费的、非常好用。
- 64 位 vs 32 位搞错：`file` 一下，或者用 DIE 看。
- 字符串被拆开存了（一个字符一个变量）？那要一行行跟着看。
- 你看到的字符串可能**已经是明文 flag 了**（程序根本没加密），先直接试提交。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

