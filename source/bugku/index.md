---
title: Bugku 基础 30 题（刷题记录）
date: 2026-10-12 22:30:00
updated: 2026-10-13 00:10:00
type: bugku
comments: false
top_img: 
---

> 入门阶段刷完的 Bugku 前 30 题，每题一篇记录：**这题考什么 → 我怎么做的 → 关键命令 → 学到了什么**。
> 全部 30 篇已完成，点表格里的「已完成」直接看单题 writeup。

## 题目清单

| # | 题目 | 类型 | WriteUp |
|---|---|---|---|
| 1 | [签到题](https://ctf.bugku.com/challenges/detail/id/1.html) | MISC | [✅ 已完成](/2026/10/12/bugku-01/) |
| 2 | [滑稽](https://ctf.bugku.com/challenges/detail/id/68.html) | WEB | [✅ 已完成](/2026/10/12/bugku-02/) |
| 3 | [计算器](https://ctf.bugku.com/challenges/detail/id/69.html) | WEB | [✅ 已完成](/2026/10/12/bugku-03/) |
| 4 | [alert](https://ctf.bugku.com/challenges/detail/id/73.html) | WEB | [✅ 已完成](/2026/10/12/bugku-04/) |
| 5 | [你必须让他停下](https://ctf.bugku.com/challenges/detail/id/74.html) | WEB | [✅ 已完成](/2026/10/12/bugku-05/) |
| 6 | [头等舱](https://ctf.bugku.com/challenges/detail/id/77.html) | WEB | [✅ 已完成](/2026/10/12/bugku-06/) |
| 7 | [GET](https://ctf.bugku.com/challenges/detail/id/70.html) | WEB | [✅ 已完成](/2026/10/12/bugku-07/) |
| 8 | [POST](https://ctf.bugku.com/challenges/detail/id/71.html) | WEB | [✅ 已完成](/2026/10/12/bugku-08/) |
| 9 | [source](https://ctf.bugku.com/challenges/detail/id/168.html) | WEB | [✅ 已完成](/2026/10/12/bugku-09/) |
| 10 | [瑞士军刀](https://ctf.bugku.com/challenges/detail/id/96.html) | PWN | [✅ 已完成](/2026/10/12/bugku-10/) |
| 11 | [这是一张单纯的图片](https://ctf.bugku.com/challenges/detail/id/2.html) | MISC | [✅ 已完成](/2026/10/12/bugku-11/) |
| 12 | [/.-](https://ctf.bugku.com/challenges/detail/id/46.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-12/) |
| 13 | [聪明的小羊](https://ctf.bugku.com/challenges/detail/id/47.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-13/) |
| 14 | [ok](https://ctf.bugku.com/challenges/detail/id/48.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-14/) |
| 15 | [[+-<>]](https://ctf.bugku.com/challenges/detail/id/49.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-15/) |
| 16 | [入门逆向](https://ctf.bugku.com/challenges/detail/id/99.html) | REVERSE | [✅ 已完成](/2026/10/12/bugku-16/) |
| 17 | [linux](https://ctf.bugku.com/challenges/detail/id/15.html) | MISC | [✅ 已完成](/2026/10/12/bugku-17/) |
| 18 | [富强民主](https://ctf.bugku.com/challenges/detail/id/61.html) | MISC | [✅ 已完成](/2026/10/12/bugku-18/) |
| 19 | [散乱的密文](https://ctf.bugku.com/challenges/detail/id/52.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-19/) |
| 20 | [.!?](https://ctf.bugku.com/challenges/detail/id/54.html) | CRYPTO | [✅ 已完成](/2026/10/12/bugku-20/) |
| 21 | [想蹭网先解开密码](https://ctf.bugku.com/challenges/detail/id/59.html) | MISC | [✅ 已完成](/2026/10/12/bugku-21/) |
| 22 | [不断的进步](https://ctf.bugku.com/challenges/detail/id/60.html) | WEB | [✅ 已完成](/2026/10/12/bugku-22/) |
| 23 | [看看源代码](https://ctf.bugku.com/challenges/detail/id/72.html) | WEB | [✅ 已完成](/2026/10/12/bugku-23/) |
| 24 | [本地包含](https://ctf.bugku.com/challenges/detail/id/159.html) | WEB | [✅ 已完成](/2026/10/12/bugku-24/) |
| 25 | [好像需要管理员](https://ctf.bugku.com/challenges/detail/id/191.html) | WEB | [✅ 已完成](/2026/10/12/bugku-25/) |
| 26 | [never give up](https://ctf.bugku.com/challenges/detail/id/83.html) | WEB | [✅ 已完成](/2026/10/12/bugku-26/) |
| 27 | [文件上传](https://ctf.bugku.com/challenges/detail/id/186.html) | WEB | [✅ 已完成](/2026/10/12/bugku-27/) |
| 28 | [备份是个好习惯](https://ctf.bugku.com/challenges/detail/id/3.html) | WEB | [✅ 已完成](/2026/10/12/bugku-28/) |
| 29 | [flag 在哪儿](https://ctf.bugku.com/challenges/detail/id/4.html) | MISC | [✅ 已完成](/2026/10/12/bugku-29/) |
| 30 | [输入密码](https://ctf.bugku.com/challenges/detail/id/5.html) | WEB | [✅ 已完成](/2026/10/12/bugku-30/) |

## 我的记录模板

每篇都是这四段，写起来很快：

```markdown
## 题目     给了什么（一张图 / 一个网址 / 一个附件）
## 思路     一句话：这题考啥（编码？隐写？请求头？）
## 过程     我敲的关键命令 / 改的字段
## 收获     这类题以后怎么快速判断
```

## 统计

- 题目数：**30**
- 类型分布：MISC 6 题 · WEB 16 题 · CRYPTO 6 题 · REVERSE 1 题 · PWN 1 题
