---
title: Bugku 想蹭网先解开密码 - MISC
date: 2026-10-12 22:47:00
updated: 2026-10-12 22:47:00
description: Bugku 基础 30 题 第 21 题：Bugku 想蹭网先解开密码 - MISC
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
- 难度：★★☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/40.html
- 附件：一个 WPA 握手包（`.cap` / `.pcap`），有时附一个字典

## 2. 题目描述
给一个 WiFi 抓包文件，说"想蹭网先解开密码"。
你要**爆破出 WiFi 密码**，密码本身（或它对应的 flag）就是答案。

## 3. 解题思路（一句话）
用 `aircrack-ng` + 字典**离线爆破 WPA 握手包**，跑出密码。

## 4. 详细步骤

### 4.1 环境准备（重要）
**Windows 跑 aircrack-ng 很痛苦**，强烈建议用 **Kali Linux 虚拟机**：
- 装 VMware / VirtualBox + Kali（<https://www.kali.org/get-kali/>）
- Kali 自带 `aircrack-ng`、`hashcat`、`crunch`、`john`

**Windows 应急方案**：
- 下载 Windows 版 aircrack-ng：<https://www.aircrack-ng.org/downloads.html>
- 解压后把 `aircrack-ng.exe` 所在目录加进 PATH，或用完整路径调用
- 也可以在 **WSL2** 里 `sudo apt install aircrack-ng`

### 4.2 先确认握手包有效
```bash
# 查看包里有什么
aircrack-ng ctf.cap
```

输出里关键看这一行：
```
1 handshake(s)   ← 有握手包，可以爆破
```
如果显示 `0 handshakes`，说明这个包**没抓到完整握手**，爆不出来（题目一般会给好的包）。

### 4.3 有字典就直接爆
```bash
aircrack-ng -w password.txt ctf.cap
```

参数说明：
| 参数 | 作用 |
|---|---|
| `-w 字典` | 指定字典文件 |
| `-b BSSID` | 指定目标 AP 的 MAC（多个网络时用） |
| `-e ESSID` | 指定 WiFi 名字 |
| `-a 2` | 强制 WPA/WPA2 模式 |

**跑起来长这样：**
```
                               Aircrack-ng 1.7

      [00:00:01] 1234/10000 keys tested (1520 k/s)

      KEY FOUND! [ 12345678 ]

      Master Key     : 1F 2A ...
      Transient Key  : ...
```

`KEY FOUND! [ xxxxxxxx ]` 里的就是 WiFi 密码。

### 4.4 没给字典？自己生成一个
**情况 A：已知密码是纯数字 / 8 位**
用 `crunch`：
```bash
# 生成 8 位纯数字字典（789MB，够爆一会儿）
crunch 8 8 0123456789 -o num8.txt

# 生成 8-10 位小写字母+数字
crunch 8 10 abcdefghijklmnopqrstuvwxyz0123456789 -o mix.txt
```

**情况 B：题目提示了密码特征**（比如"手机号"、"生日"）
```bash
# 11 位手机号（中国手机号以 1 开头）
crunch 11 11 0123456789 -o phone.txt
```

**情况 C：用现成字典**
Kali 自带：
```
/usr/share/wordlists/rockyou.txt.gz      ← 先 gunzip 解压
/usr/share/wordlists/wifite.txt
```
解压：
```bash
sudo gunzip /usr/share/wordlists/rockyou.txt.gz
aircrack-ng -w /usr/share/wordlists/rockyou.txt ctf.cap
```

### 4.5 用 hashcat 爆（更快，有显卡的话）
**第一步：把 cap 转成 hashcat 格式**
```bash
# 用 hcxtools（Kali 里 apt install hcxtools）
hcxpcapngtool -o hash.hc22000 ctf.cap
```

**第二步：爆**
```bash
# 模式 22000 = WPA-PBKDF2-PMKID+EAPOL
hashcat -m 22000 hash.hc22000 password.txt

# 纯数字 8 位，用掩码攻击（比字典快得多）
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d
```

掩码字符集：
| 占位符 | 含义 |
|---|---|
| `?d` | 数字 0-9 |
| `?l` | 小写 a-z |
| `?u` | 大写 A-Z |
| `?s` | 特殊符号 |
| `?a` | 全部可打印字符 |

**跑完看结果：**
```bash
hashcat -m 22000 hash.hc22000 --show
```

### 4.6 拿到密码后
- 有些题**密码就是 flag**（比如密码是 `flag{...}` 不合法，所以密码可能是一串数字，要包成 `flag{密码}` 提交）
- 有些题密码本身还得再解一层（比如密码是十六进制 / Base64）
- **看题目要求**：是提交密码，还是提交 `flag{密码}`

## 5. 关键知识点
- **WPA/WPA2 握手包（4-way handshake）**：客户端连 WiFi 时和路由器交换的 4 个包，
  里面含有可以用密码验证的**认证信息**。抓到这个包，就能**离线**猜密码。
- **为什么可以离线爆破**：握手包里的 **MIC（消息完整性校验）** 是用密码 + 随机数算出来的。
  你猜一个密码 → 算一次 MIC → 和包里的比对 → 一致就是对的。**全程不需要连路由器**。
- **PBKDF2**：WPA 用 4096 轮 PBKDF2 把密码变成 PMK，**故意算得慢**，让爆破很贵。
  这是为什么 8 位以上强密码基本爆不动。
- **字典攻击 vs 掩码攻击**：
  - 字典：拿常见密码列表挨个试（**快，但依赖字典质量**）
  - 掩码：穷举某个字符集的所有组合（**慢，但覆盖全**）

### 5.1 抓握手包（真实场景，了解即可）
```bash
# 1. 网卡进监听模式
sudo airmon-ng start wlan0

# 2. 扫描
sudo airodump-ng wlan0mon

# 3. 锁定目标，抓包
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w ctf wlan0mon

# 4. 另开窗口，发 deauth 包逼客户端重连（这样才抓得到握手）
sudo aireplay-ng -0 2 -a AA:BB:CC:DD:EE:FF wlan0mon
```
> ⚠️ **这一步只能在你自己有授权的网络或靶场里做。攻击别人的 WiFi 是违法的。**

## 6. 常见坑
- **Windows 没 aircrack-ng**：别硬搞，装 Kali 虚拟机，10 分钟的事。
- **包不完整**：显示 `0 handshakes` 就爆不出来，检查是不是下错了附件。
- **字典太小**：爆几分钟就结束且没结果，说明字典不对。看题目有没有给字典。
- **太慢**：纯 CPU 爆 8 位数字要几分钟，11 位手机号要几小时。
  有 NVIDIA 显卡就上 hashcat，速度差几十倍。
- **密码里有特殊字符**：`aircrack-ng` 命令行注意引号转义。
