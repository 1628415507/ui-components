<!--
 * @Description:
 * @Date: 2024-11-08 14:02:47
 * @LastEditTime: 2024-11-08 15:09:34
-->

## （一）[xss 脚本注入——插入恶意脚本](https://www.cnblogs.com/sochishun/p/6993997.html)

### 1. 什么是 xss

- `Cross-Site Scripting`（跨站脚本攻击）简称  XSS，是一种**代码注入攻击**。
- 攻击者通过在目标网站上**注入恶意脚本**（比如在 url 中输入、在评论框中输入 HTML 代码和客户端脚本 js 等），使之在用户的浏览器上运行，然后引导其他用户点击某链接或浏览页面，实现对用户游览器的控制。
- 利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。

### 2. XSS 预防：

1.  cookie 加密
2.  字符串**长度验证**
3.  对用户输入的**敏感符号做过滤或转码**
4.  定期**检查数据库**内容是否包含敏感代码
5.  所有打印输出的语句,都要进行**html 转码过滤**，把字符转换成 转义字符
    - 常见转码为：
    - `< `编码为 `&lt`;
    - `>` 编码为 `&gt`;
    - `&` 编码为` &amp`;
    - `'` 编码为 `&#039`;
    - `"` 编码为 `&quot`;
    - 空格 编码为 `&nbsp`;

![alt text](XSS.png)

## （二）[CSRF 跨域请求伪造——隐式身份验证机制,模仿用户的操作](https://www.cnblogs.com/lovesong/p/5233195.html)

### 1. 什么是 CSRF?

- 一般习惯上把**通过 XSS 来实现**的 CSRF 称为 XSRF。
- CSRF 攻击是源于**Web 的隐式身份验证机制**！  
  Web 的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却无法保证该请求是用户**批准发送**的。
- CSRF 攻击者在用户**已经登录**目标网站之后  
  **诱使用户访问一个攻击页面**，利用目标网站对用户的信任，以用户身份在攻击页面对目标网站发起**伪造用户操作的请求**，达到攻击目的。  
   （在未退出 A 网站的前提下访问 B，B 使用 A 的 cookie 去访问服务器）

### 2. CSRF 攻击原理 ⭐⭐⭐⭐

- 跨域请求伪造  
  用户登录了 A 页，在不退出登录的情况下，访问了 危险网站 B 页，这个时候**B 页带着 A 页的 cookie**向 **A 的服务端**发起请求，会让服务端认为这个是可信任用户，从而达到攻击的目的
- 实现方式：  
  在 B 页中可以使用一个**隐藏**的 `iframe` 来向 A 页发起请求，只要用户没有退出 A 网站，临时 cookie 一直保存在内存中，这个时候危险网站 B 就可以拿着 cookie 为所欲为了
- 防御方式：添加 token

### 3.CSRF 预防：

- CSRF 攻击的一般是由**服务端**解决。
- **使用验证码或者 `token` 验证**，每次提交表单时需要带上 token（伪造者访问不到），如果 token 不合法，服务器拒绝请求
- 通过 `host+origin` 来判断是否为非法用户
- 给 Cookie 设置 `SameSite` 属性，来**限制第三方 Cookie**，里面有三个值 strict、lax、none
  | SameSite | |
  | --- | --- |
  | strict | 最严格，**完全禁止第三方的 cookie**；但是体验不好，如果当前有一个 github 链接，点击跳转就不会携带任何 cookie，跳转过去一直是未登录状态的 |
  | lax | 稍微放宽了一些，大多不发送 cookie，但除了 get 请求（只包括三种情况：链接、预加载请求、get 表单）以外 |
  | none | 关闭该设置

### 3.CSRF 举例：

1. 示例 1
   ![alt text](CSRF.png)
1. 示例 2：点击劫持

- 点击劫持是指利用 `iframe+css` 的 opacity 把危险网址**设置为透明覆盖到安全的网址上面**，使用户误以为在安全网址下操作。
- 防范：  
  在 http 中配置 X-frame-options 设置为 deny 可以禁止被 iframe 嵌入

## [ 问题回顾 ]

- [ ] 1.什么是 xss？什么是 csrf？⭐⭐⭐⭐⭐