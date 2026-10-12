---
title: Bugku alert - WEB
date: 2026-10-12 22:30:00
updated: 2026-10-12 22:30:00
description: Bugku 基础 30 题 第 4 题：Bugku alert - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/73.html
- 附件：无

## 2. 题目描述
进页面就弹一个框，一直弹，关不掉。
题面提示：**"flag 在弹窗里"**。

## 3. 解题思路（一句话）
弹窗是用 JS 的 `alert()` 弹的，**把 JS 禁掉**，弹窗就不会出现，后面的页面内容就露出来了。

## 4. 详细步骤

### 4.1 为什么关不掉
无限弹窗的代码一般长这样：

```html
<script>
  while (true) {
    alert("flag 就在下一页");
  }
</script>
```

`alert()` 是**阻塞**的，弹窗不点掉，后面的代码和渲染都停住。

### 4.2 方法 A：禁用 JavaScript（最简单）
**Chrome / Edge：**
1. `F12` 打开开发者工具
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 `Disable JavaScript`，回车
4. 刷新页面 —— 弹窗没了，flag 就在页面上

**想恢复**：同样步骤，输入 `Enable JavaScript`。

**Firefox：**
地址栏输入 `about:config` → 搜 `javascript.enabled` → 双击改成 `false` → 刷新。
（看完记得改回 `true`）

### 4.3 方法 B：直接用 curl 看源码（推荐，不折腾）
弹窗是浏览器执行的，**服务端返回的 HTML 里一定有 flag**：

```bash
curl -s "题目地址" | findstr /i flag
```

> Linux / macOS / Git Bash 用：
> ```bash
> curl -s "题目地址" | grep -i flag
> ```

### 4.4 方法 C：删掉那个脚本标签
F12 → Elements → 找到那个 `<script>` → 右键 → `Delete element` → 弹窗消失。

## 5. 关键知识点
- **`alert()` 只是浏览器行为**，它不会影响服务端返回的内容。
- `Ctrl+Shift+P` 命令面板是前端调试的万能入口，禁 JS、截图、切主题都在里面。
- 遇到"关不掉的弹窗 / 关不掉的 debugger"，第一反应就是**禁 JS 或者用 curl**。

## 6. 常见坑
- 用 `curl` 时如果返回是 302 跳转，加 `-L` 跟随：`curl -sL "地址"`。
- 有的站点有反爬，需要加 `-A "Mozilla/5.0"`。

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

