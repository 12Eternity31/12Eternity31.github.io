---
title: Bugku 备份是个好习惯 - WEB
date: 2026-10-12 22:54:00
updated: 2026-10-12 22:54:00
description: Bugku 基础 30 题 第 28 题：Bugku 备份是个好习惯 - WEB
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
- 难度：★★☆☆☆
- 题目地址：https://ctf.bugku.com/challenges/detail/id/86.html
- 附件：无

## 2. 题目描述
页面看起来很普通，什么提示都没有。
题目名是**"备份是个好习惯"** → 暗示服务器上有**源码备份文件**。

## 3. 解题思路（一句话）
用**备份文件后缀字典**扫描，找到 `index.php.bak` 之类的源码备份，
下载看源码，再按源码提示解。

## 4. 详细步骤

### 4.1 什么是"源码泄露"
运维/开发人员改代码前习惯先备份：
```
index.php      →  index.php.bak
index.php      →  index.php~      （vim 的备份）
index.php      →  .index.php.swp  （vim 崩溃残留）
```
**这些文件放在 Web 目录下，浏览器能直接下载** —— 拿到源码就等于拿到答案。

### 4.2 第一步：猜备份文件名
假设首页是 `index.php`，逐个访问：

```bash
URL="题目地址"

for f in index.php.bak index.php~ index.php.swp index.php.txt index.php.old \
         index.php.save index.php.orig .index.php.swp www.zip www.rar \
         web.zip backup.zip code.zip html.zip index.zip test.zip \
         .git/config .svn/entries .DS_Store; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$URL/$f")
  echo "$code  $f"
done
```

**看到 `200` 的就是存在的文件**，用浏览器直接打开它。

> **Windows PowerShell 版本：**
> ```powershell
> $u = "题目地址"
> foreach ($f in "index.php.bak","index.php~","www.zip","www.rar","backup.zip",".git/config") {
>   try {
>     $r = Invoke-WebRequest "$u/$f" -UseBasicParsing -ErrorAction Stop
>     Write-Host "$($r.StatusCode)  $f"
>   } catch {
>     Write-Host "404  $f"
>   }
> }
> ```

### 4.3 第二步：常见备份后缀大全（背下来）
| 后缀 | 来源 |
|---|---|
| `.bak` | 最通用备份 |
| `.backup` | 同上 |
| `~` | vim / emacs 备份 |
| `.swp` / `.swo` | vim 编辑时的临时文件 |
| `.old` | 旧版本 |
| `.orig` | 原始文件 |
| `.save` | 部分编辑器 |
| `.txt` | 手滑存成文本 |
| `.zip` / `.rar` / `.tar.gz` / `.7z` | 整站打包备份 |
| `.php.bak` / `.php~` / `.php.txt` | 针对 PHP 源码 |
| `.git/` / `.svn/` / `.hg/` | 版本控制目录泄露 |
| `.DS_Store` | macOS 目录索引（泄露文件名列表） |
| `WEB-INF/web.xml` | Java 应用的配置 |

### 4.4 第三步：用工具自动扫
**dirsearch**（推荐，Python 写的）：
```bash
git clone https://github.com/maurosoria/dirsearch.git
cd dirsearch
python dirsearch.py -u "题目地址" -e php,zip,bak,txt,rar,swp
```

**Burp Intruder：**
1. 拦一个请求发到 Intruder
2. 把文件名位置设为 payload 位置（`§index.php§`）
3. Payload 列表填上面的后缀字典
4. Start attack，看响应长度不同的那个

**7kbscan / 御剑**（Windows 图形化工具，新手友好）

### 4.5 第四步：拿到源码后怎么办
下载的 `index.php.bak` 打开，可能看到：

```php
<?php
include "flag.php";
$a = @$_REQUEST['hello'];
eval("var_dump($a);");
show_source(__FILE__);
?>
```

或者类似：
```php
<?php
extract($_GET);
if ($flag == "bugku") { echo $flag2; }
?>
```

**分析思路：**
1. 看有没有 `include` → 可能有文件包含（第 24 题）
2. 看有没有 `eval` / `assert` / `system` → 可能有代码执行
3. 看有没有 `extract` / `$$var` → 可能有变量覆盖
4. 看有没有弱类型比较 `==` → 可能有 PHP 弱比较绕过（第 30 题）
5. 看有没有 `preg_replace` 带 `/e` → 代码执行

### 4.6 顺带检查版本控制泄露
```bash
# .git 泄露（最严重，能还原整个源码）
curl -s "题目地址/.git/config"

# 如果有，用 GitHack 直接还原
python GitHack.py "题目地址/.git/"
```

```bash
# .svn 泄露
curl -s "题目地址/.svn/entries"
```

### 4.7 .DS_Store 泄露文件名
如果 `.DS_Store` 存在，用工具看里面列了哪些文件：
```bash
python ds_store_exp.py "题目地址/.DS_Store"
```
下载：<https://github.com/lijiejie/ds_store_exp>

## 5. 关键知识点
- **源码泄露（Source Code Disclosure）**：备份文件、版本控制目录忘记删，导致源码可被下载。
- **拿到源码 = 拿到答案**：Web 题一旦有源码，漏洞点就是明牌。
- **`.git` 泄露最危险**：能完整还原项目（包括历史版本里的密码、密钥）。
- **常见的"泄露三兄弟"**：`*.bak/~/.swp`、`.git/.svn`、`www.zip/www.rar`。
- 这条攻击链属于 **信息收集（Recon）** 阶段，是渗透测试的第一步。

### 5.1 防御方案
```nginx
# Nginx：禁止访问备份和版本控制文件
location ~* \.(bak|swp|swo|old|orig|save|txt|zip|rar|tar\.gz)$ { deny all; }
location ~ /\.(git|svn|hg|DS_Store) { deny all; }
```
```apache
# Apache
<FilesMatch "\.(bak|swp|old|orig|save|zip|rar)$">
    Require all denied
</FilesMatch>
```
**更好的做法**：直接把备份和 `.git` 目录**放在 Web 根目录之外**。

## 6. 常见坑
- **别只试 `.bak`**，把 4.3 那张表全跑一遍，很快的。
- **`.git` 泄露需要用工具还原**，直接访问 `/.git/` 会返回 403（正常，目录列表关了），
  但 `/.git/config`、`/.git/HEAD` 能访问就说明有戏。
- **注意目录层级**：备份可能在 `/admin/index.php.bak`、`/source/index.php.bak`。
- 下载下来的 `.zip` 可能**有密码** → 用 `zip2john` + `john` 爆破。
  ```bash
  zip2john backup.zip > hash.txt
  john hash.txt --wordlist=rockyou.txt
  ```

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

