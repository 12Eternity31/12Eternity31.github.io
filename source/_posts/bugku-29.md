---
title: Bugku flag 在哪儿 - MISC
date: 2026-10-12 22:55:00
updated: 2026-10-12 22:55:00
description: Bugku 基础 30 题 第 29 题：Bugku flag 在哪儿 - MISC
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/44.html
- 附件：未知（可能是图片 / 压缩包 / 文本）

## 2. 题目描述
题面就一句"flag 在哪儿"。
**这种题考的就是"MISC 排查流程"** —— 按顺序把所有藏东西的地方过一遍。

## 3. 解题思路（一句话）
`file` → `strings` → `exiftool` → `binwalk` → 十六进制 → 压缩包 → 隐写，
**六步走完，flag 一定在某一处。**

## 4. 详细步骤

### 4.1 标准六步排查法（记住这个流程，能解决 80% 的 MISC 题）

#### 第 1 步：确认真实类型
```bash
file 附件名
```

#### 第 2 步：捞明文
```bash
strings 附件名 | grep -i flag
strings 附件名 | less
```
> Windows 上用 Python 代替：
> ```powershell
> python -c "
> import re
> d=open(r'附件名','rb').read()
> for m in re.finditer(rb'[\x20-\x7e]{4,}',d): print(m.group().decode())
> " | findstr /i flag
> ```

#### 第 3 步：看元数据（EXIF）
```bash
exiftool 附件名
```
重点看：`Comment`、`Image Description`、`Artist`、`Copyright`、`XP Comment`。
> Windows 无 exiftool：右键 → 属性 → 详细信息；
> 或在线 <https://exif.tools/>

#### 第 4 步：看有没有套娃
```bash
binwalk 附件名          # 列出嵌入的文件
binwalk -e 附件名       # 提取
foremost -i 附件名 -o out/   # 另一种提取工具
```
> Windows 没 binwalk：用 **7-Zip 打开图片**试试，或者用 HxD 找 `PK`（ZIP 头）手工截取。

#### 第 5 步：十六进制看头尾
用 **HxD** 打开：
- **开头**：确认 magic bytes（`FFD8FF`=JPG，`89504E47`=PNG）
- **结尾**：追加的 flag 或另一个文件的头（`PK`=ZIP，`FFD8FF`=另一个 JPG）

#### 第 6 步：看尾部有没有附加文件
```bash
# 找 JPG / ZIP / PNG 的头出现几次
python -c "
d=open(r'附件名','rb').read()
for sig,name in [(b'\xff\xd8\xff','JPEG'),(b'PK\x03\x04','ZIP'),(b'\x89PNG','PNG'),(b'GIF8','GIF')]:
    pos=-1
    while True:
        pos=d.find(sig,pos+1)
        if pos<0: break
        print(f'{name} 偏移 {pos}')
"
```

### 4.2 如果是图片，做隐写检查

**① LSB 隐写（最低有效位）**
用 **StegSolve**（Java 工具）：
- 打开图片 → `Analyse → Data Extract`
- 勾选 `R/G/B` 的 `0` 位 → Preview

或者用 **zsteg**（Ruby 工具，PNG/BMP 神器）：
```bash
zsteg 图片.png
zsteg -a 图片.png     # 试所有方式
```

**② 图片里藏压缩包**
```bash
# ZIP 有密码？先提取再爆
zip2john secret.zip > hash.txt
john hash.txt --wordlist=rockyou.txt

# 或者用 fcrackzip
fcrackzip -u -D -p rockyou.txt secret.zip
```

**③ 图片尺寸 / 高度被改（PNG 高度隐写）**
改回来就能看到被裁掉的部分：
```python
import struct
data = bytearray(open('图片.png','rb').read())
# PNG 的宽高在 IHDR 块，偏移 16(宽) 和 20(高)，4 字节大端
w = struct.unpack('>I', data[16:20])[0]
h = struct.unpack('>I', data[20:24])[0]
print('当前尺寸:', w, 'x', h)
# 把高度改大（比如 *2），存成新文件看效果
data[20:24] = struct.pack('>I', h * 2)
open('新图片.png','wb').write(bytes(data))
```

**④ 盲水印**
需要 `bwm` 工具或者 Python `blind-watermark` 库：
```bash
pip install blind-watermark
blind_watermark --extract --origin 原图.png --image 带水印.png --out 结果.png
```

**⑤ 图片拼接 / 帧提取（GIF）**
```bash
# 提取 GIF 每一帧
convert 动画.gif frame_%03d.png
# 或者
ffmpeg -i 动画.gif frame_%03d.png
```

**⑥ 二维码 / 条形码**
- 在线识别：<https://zxing.org/w/decode.jspx>
- 命令行：`zbarimg 图片.png`
- 二维码有时候需要**反色**或**修补定位点**才能扫出来 → 用图片编辑器处理

**⑦ 声音文件（音频隐写）**
- 看**频谱图**：Audacity → 频谱视图（有些题把文字画在频谱上）
- **摩斯电码**：听声音或者看波形
- **DTMF**：手机按键音
- **SSTV**：慢扫描电视（用 `qsstv` 解码）

### 4.3 如果是压缩包

```bash
# 1. 看是不是伪加密（ZIP 头里的加密标志位被改了）
#    正常未加密: 50 4B 03 04 14 00 00 00
#                          ↑ 这里改成 09 00 就是伪加密
#    用 HxD 把 09 改回 00 即可

# 2. 明文攻击（如果有已知文件）
#    已知压缩包里有一个文件的内容 -> 可以还原整个包
bkcrack -C secret.zip -c known.txt -p known.txt

# 3. CRC32 爆破（压缩包内容很小的时候）
python crc32_brute.py

# 4. 密码爆破
zip2john secret.zip > hash.txt
john hash.txt --wordlist=rockyou.txt
```

### 4.4 如果是流量包（.pcap）
```bash
# 用 Wireshark 打开，按协议过滤
http.request.uri contains "flag"
tcp contains "flag"
# 导出 HTTP 对象：File → Export Objects → HTTP
```
（这就是第 21 题那类流量的思路）

## 5. 关键知识点
- **MISC 题的核心能力 = 工具熟练度 + 排查流程**。
  不知道从哪下手时，**照着上面六步从头走到尾**。
- **文件格式都有固定结构**，了解结构才能发现异常：
  - JPG：`FF D8 FF` 开头，`FF D9` 结尾
  - PNG：`89 50 4E 47 0D 0A 1A 0A` 开头，`IEND` 块结尾
  - ZIP：`50 4B 03 04` 开头
  - GIF：`47 49 46 38`（"GIF8"）开头
- **信息可以藏在很多维度**：文件内容、文件头尾、文件结构（宽高）、像素位（LSB）、时间戳、文件名、音频频谱。

### 5.1 MISC 工具箱速查
| 场景 | 工具 |
|---|---|
| 十六进制编辑 | **HxD**（Win）、010 Editor、Bless |
| 通用隐写 | **StegSolve**、**zsteg**（PNG）、steghide |
| 提取嵌入文件 | **binwalk**、foremost、7-Zip |
| EXIF | **exiftool** |
| 图片识别 | zbarimg、ZXing |
| 压缩包爆破 | **john** + zip2john、fcrackzip |
| 音频 | Audacity、Sonic Visualiser |
| 流量 | **Wireshark**、NetworkMiner |
| 万能解码 | **CyberChef**、dcode.fr |
| 综合 GUI | **Kali 里的 `binwalk`/`foremost`/`steghide`** |

## 6. 常见坑
- **别上来就用最复杂的工具**，先 `file` + `strings` + `exiftool`，很多题这三步就结束了。
- **改了后缀 ≠ 改了类型**，永远以 magic bytes 为准。
- **提取出来的文件记得再看一遍**（套娃很常见，ZIP 里还有图片，图片里还有 ZIP）。
- **Windows 缺 Linux 工具**：最省事的方案是装个 **Kali 虚拟机**或 **WSL**，
  一次装好 `binwalk zsteg steghide exiftool foremost`，以后所有 MISC 题都能做。
