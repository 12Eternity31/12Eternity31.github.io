---
title: Bugku POST - WEB
date: 2026-10-12 22:34:00
updated: 2026-10-12 22:34:00
description: Bugku 基础 30 题 第 8 题：Bugku POST - WEB
cover: 
top_img: 
tags:
  - Bugku
  - WEB
  - 基础30题
categories:
  - WriteUp
keywords: Bugku,CTF,WriteUp,WEB
---

## 1. 题目信息
- 平台：Bugku CTF
- 分类：WEB
- 难度：★☆☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/71.html
- 附件：无

## 2. 题目描述
页面提示：
> "请用 POST 方式提交一个名为 `what` 的参数，值为 `flag`"

## 3. 解题思路（一句话）
POST 参数**改 URL 没用**，必须修改**请求体**，用 HackBar / Burp / curl 发包。

## 4. 详细步骤

### 4.1 GET 和 POST 的区别（一眼看懂）
```
GET  /index.php?what=flag HTTP/1.1     ← 参数在 URL 上
Host: xxx

POST /index.php HTTP/1.1               ← 参数在下面的请求体里
Host: xxx
Content-Type: application/x-www-form-urlencoded
Content-Length: 9

what=flag
```

### 4.2 方法 A：curl（最快，不用装插件）
```bash
curl -s -X POST -d "what=flag" "题目地址"
```

想同时看响应头（有时 flag 在头里）：
```bash
curl -s -i -X POST -d "what=flag" "题目地址"
```

### 4.3 方法 B：HackBar 插件
1. 装 HackBar（Chrome / Firefox 商店都有）
2. `F12` 打开 HackBar
3. 勾选 `POST`，在 body 框里填 `what=flag`
4. 点 `Execute`

### 4.4 方法 C：Burp Suite
1. 浏览器设代理 127.0.0.1:8080，开 Burp 拦截
2. 在题目页面点一下提交按钮，让 Burp 抓到请求
3. 把请求体改成 `what=flag`
4. `Forward`

### 4.5 用 Python 脚本（顺手学一下）
```python
import requests

url = "题目地址"
r = requests.post(url, data={"what": "flag"})
print(r.text)
```

跑：
```bash
python post.py
```

## 5. 关键知识点
- POST 参数在**请求体**中，`Content-Type: application/x-www-form-urlencoded` 时格式就是 `key=value&key2=value2`。
- 还有两种常见 body 格式：
  - `application/json`：`{"what": "flag"}`
  - `multipart/form-data`：文件上传用
- 命令行测试接口的万能工具就是 `curl`，**建议新手直接背下来 `curl -X POST -d "a=b" URL`**。

## 6. 常见坑
- Windows 的 `cmd` 里双引号没问题，但 **PowerShell 里 `curl` 是 `Invoke-WebRequest` 的别名**，参数不兼容。
  - 解决：用 `curl.exe`，或者干脆用 `python` / Git Bash。
- 忘了 `-X POST`，`-d` 其实会自动用 POST，但写清楚不容易错。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

