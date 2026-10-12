---
title: Bugku 基础 30 题（刷题进度）
date: 2026-10-12 22:30:00
updated: 2026-10-12 22:30:00
type: bugku
comments: false
top_img: 
---

## 怎么用这页

这是我在 [Bugku CTF 平台](https://ctf.bugku.com/challenges) 刷新手题的计划表。
每做完一题，就在这里把 `[ ]` 改成 `[x]`，并补上 writeup 链接。

**做题记录流程**（每题 3~5 分钟就能记完）：

```bash
# 1. 生成文章（会自动套用 scaffolds/post.md 模板）
npx hexo new post "Bugku-签到题"

# 2. 写 5 行就够：题目给了什么 → 我用什么办法 → 关键命令 → 结果 → 学到了什么
# 3. 本地看一眼
npx hexo server
# 4. 推上去，1 分钟后线上更新
git add . && git commit -m "post: Bugku 签到题" && git push
```

## 前 30 题清单

| # | 题目 | 类型 | 分值 | 状态 | WriteUp |
|---|---|---|---|---|---|
| 1 | [签到题](https://ctf.bugku.com/challenges/detail/id/1.html) | MISC | 5 | [ ] |  |
| 2 | [滑稽](https://ctf.bugku.com/challenges/detail/id/68.html) | WEB | 10 | [ ] |  |
| 3 | [计算器](https://ctf.bugku.com/challenges/detail/id/69.html) | WEB | 10 | [ ] |  |
| 4 | [alert](https://ctf.bugku.com/challenges/detail/id/73.html) | WEB | 10 | [ ] |  |
| 5 | [你必须让他停下](https://ctf.bugku.com/challenges/detail/id/74.html) | WEB | 10 | [ ] |  |
| 6 | [头等舱](https://ctf.bugku.com/challenges/detail/id/77.html) | WEB | 15 | [ ] |  |
| 7 | [GET](https://ctf.bugku.com/challenges/detail/id/70.html) | WEB | 10 | [ ] |  |
| 8 | [POST](https://ctf.bugku.com/challenges/detail/id/71.html) | WEB | 10 | [ ] |  |
| 9 | [source](https://ctf.bugku.com/challenges/detail/id/168.html) | WEB | 20 | [ ] |  |
| 10 | [瑞士军刀](https://ctf.bugku.com/challenges/detail/id/96.html) | PWN | 10 | [ ] |  |
| 11 | [这是一张单纯的图片](https://ctf.bugku.com/challenges/detail/id/2.html) | MISC | 10 | [ ] |  |
| 12 | [/.－](https://ctf.bugku.com/challenges/detail/id/46.html) | Crypto | 10 | [ ] |  |
| 13 | [聪明的小羊](https://ctf.bugku.com/challenges/detail/id/47.html) | Crypto | 10 | [ ] |  |
| 14 | [ok](https://ctf.bugku.com/challenges/detail/id/48.html) | Crypto | 10 | [ ] |  |
| 15 | [[+-<>]](https://ctf.bugku.com/challenges/detail/id/49.html) | Crypto | 10 | [ ] |  |
| 16 | [入门逆向](https://ctf.bugku.com/challenges/detail/id/99.html) | Reverse | 10 | [ ] |  |
| 17 | [linux](https://ctf.bugku.com/challenges/detail/id/15.html) | MISC | 15 | [ ] |  |
| 18 | [富强民主](https://ctf.bugku.com/challenges/detail/id/61.html) | MISC | 15 | [ ] |  |
| 19 | [散乱的密文](https://ctf.bugku.com/challenges/detail/id/52.html) | Crypto | 20 | [ ] |  |
| 20 | [.!?](https://ctf.bugku.com/challenges/detail/id/54.html) | Crypto | 20 | [ ] |  |
| 21 | [这不是md5](https://ctf.bugku.com/challenges/detail/id/59.html) | Crypto | 30 | [ ] |  |
| 22 | [贝斯家族](https://ctf.bugku.com/challenges/detail/id/60.html) | Crypto | 30 | [ ] |  |
| 23 | [矛盾](https://ctf.bugku.com/challenges/detail/id/72.html) | WEB | 10 | [ ] |  |
| 24 | [把猪困在猪圈里](https://ctf.bugku.com/challenges/detail/id/159.html) | Crypto | 15 | [ ] |  |
| 25 | [黄道十二官](https://ctf.bugku.com/challenges/detail/id/191.html) | Crypto | 20 | [ ] |  |
| 26 | [备份是个好习惯](https://ctf.bugku.com/challenges/detail/id/83.html) | WEB | 20 | [ ] |  |
| 27 | [抄错的字符](https://ctf.bugku.com/challenges/detail/id/186.html) | Crypto | 10 | [ ] |  |
| 28 | [隐写](https://ctf.bugku.com/challenges/detail/id/3.html) | MISC | 10 | [ ] |  |
| 29 | [telnet](https://ctf.bugku.com/challenges/detail/id/4.html) | MISC | 10 | [ ] |  |
| 30 | [眼见非实](https://ctf.bugku.com/challenges/detail/id/5.html) | MISC | 10 | [ ] |  |

## 每题固定四段（照这个写，一篇 3 分钟）

```markdown
## 题目
给了什么（一张图/一个网址/一个附件）

## 思路
一句话：这题考什么（编码？隐写？请求头？）

## 过程
我敲的关键命令 / 改的字段（贴 1~2 行就够）

## 结果 & 收获
拿到 flag（可打码）；这类题以后怎么快速判断
```
