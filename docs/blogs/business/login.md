<!--
 * @Description:
 * @Date: 2024-11-12 17:30:33
 * @LastEditTime: 2024-11-14 15:14:28
-->

## [【扫码登录实现⽅式】](https://developer.baidu.com/article/details/3352196)

扫码登录的实现原理核⼼是基于⼀个中转站，该中转站通常由应⽤提供商提供，⽤于维护⼿机和 PC 之
间的会话状态。
整个扫码登录的流程如下：

1. ⽤⼾在 PC 端访问应⽤，并选择使⽤扫码登录⽅式。此时，应⽤⽣成⼀个**随机的认证码**，并将该认证
   码通过⼆维码的形式显⽰在 PC 端的⻚⾯上。
2. ⽤⼾打开⼿机上的应⽤，并选择使⽤扫码登录⽅式。此时，应⽤会打开⼿机端的相机，⽤⼾可以对
   着 PC 端的⼆维码进⾏扫描。
3. ⼀旦⽤⼾扫描了⼆维码，⼿机上的应⽤会向应⽤提供商的**中转站**发送⼀个请求，请求包含之前⽣成
   的**随机认证码和⼿机端的⼀个会话 ID**。
4. 中转站验证认证码和会话 ID 是否匹配，如果匹配成功，则该中转站将 **⽤⼾的⾝份信息发送给应⽤**，
   并创建⼀个 PC 端和⼿机端之间的会话状态。
5. 应⽤使⽤收到的⾝份信息对⽤⼾进⾏认证，并创建⼀个与该⽤⼾关联的会话状态。同时，应⽤ **返回⼀个通过认证的响应给中转站**。
6. 中转站将该响应返回给⼿机端的应⽤，并携带⼀个⽤于表⽰该会话的令牌，此时⼿机和 PC 之间的认
   证流程就完成了。
7. 当⽤⼾在 PC 端进⾏其他操作时，应⽤将会话令牌附加在请求中，并通过中转站向⼿机端的应⽤发起
   请求。⼿机端的应⽤使⽤会话令牌（也就是之前⽣成的令牌）来识别并验证会话状态，从⽽允许⽤
   ⼾在 PC 端进⾏需要登录的操作。
   ![alt text](./img/scanLogin.png)

## 【HTTP 是⼀个⽆状态的协议，那么 Web 应⽤要怎么保持⽤⼾的登录态呢？】

### 实现登录态的几种形式：

#### 1. cookie

- 服务器可以通过 HTTP 响应头中的`Set-Cookie`字段通知浏览器存储 Cookie
- 缺点：⽤⼾可以通过 `document.cookie`进行修改， 伪造登陆凭证

#### 2. session

- 仅发给客⼾端⼀个 session key ，然后在⾃⼰维护⼀个 key-value 表，如果请求中有 key ，并且在表中可以找到对应的 value ，则视为合法请求调⽤ 接⼝，验证通过后颁发 sessionID
- 这样即使⾃⾏修改了 sessionID ，也没有对应的记录，也⽆法获取数据
- 缺点：如果存在多个服务器如负载均衡时，每个服务器的状态表必须同步，或者抽离出来统⼀管理，如使⽤ Redis 等服务。

#### 3. 令牌（TOKEN）机制(JWT)

`JSON Web Token`（简称 JWT）

`JSON Web Token`（简称 JWT）, 是以 JSON 格式存储信息的 Token
|JSON Web Token |描述 |
|---|--|
| 头部|存储 Token 的**类型和签名算法**（上图中，类型是 jwt ，加密算法是 HS256 ） |
|负载|是 Token**要存储的信息**（如存储了⽤⼾姓名和昵称信息）|
|签名|是由指定的算法，将**转义后的头部和负载**，**加上密钥⼀同加密**得到的|
|`.` |最后将这三部分⽤`.` 连接，就可以得到了⼀个 Token 了。|

使⽤ `JWT` 维护登陆态，服务器不再需要维护状态表，他**仅给客⼾端发送⼀个加密的数据 token** ，每次请求都带上这个加密的数据，**再解密验证是否合法即可**。由于是加密的数据，即使⽤⼾可以修改， 命中⼏率也很⼩。

##### 客⼾端如何存储 token 呢？

1. 存在 `cookie` 中  
   虽然设置 HttpOnly 可以有效防⽌ `XSS` 攻击中 token 被窃取，但是也就意味着客⼾端⽆法获取 token 来设置 CORS 头部。
1. 存在 `sessionStorage` 或者 `localStorage` 中  
   可以设置头部解决跨域资源共享问题，同时也可以防⽌ `CSRF` ，但是就需要考虑 XSS 的问题防⽌凭证泄露。

##### Node 中 JWT 的使⽤

- 第⼀步，在你的 `/login` 路由中使⽤ `jsonwebtoken` 中间件⽤于⽣成 token

```js{1}
const jwt = require('jsonwebtoken')
let token = jwt.sign(
  {
    name: username
  },
  config.secret,
  {
    expiresIn: '24h'
  }
)
res.cookie('token', token)
```

- 第⼆步，在 Node 的⼊⼝⽂件 `app.js `中注册 `express-jwt` 中间件⽤于验证 token

```js{1,3}
const expressJwt = require('express-jwt')
app.use(
  expressJwt({
    secret: config.secret,
    getToken: (req) => {
      return req.cookies.token || null
    }
  }).unless({
    path: ['/login']
  })
)
```

- 如果 getToken 返回 null ，中间件会抛出 UnauthorizedError 异常

```js{3}
app.use(function (err, req, res, next) {
  //当token验证失败时会抛出如下错误
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      status: 'fail',
      message: '⾝份校验过期，请重新登陆'
    })
  }
})
```

### 如何实现单点登录

- 假设我们在电脑和⼿机都使⽤同⼀个⽤⼾登陆，对于服务器来说，这两次登陆⽣成的 token 都是合法的，尽管他们是同⼀个⽤⼾。所以两个 token 不会失效。
- 要实现单点登陆，服务器只需要维护⼀张**userId 和 token 之间映射关系的表**。每次登陆成功都刷新 token 的值。
- 在处理业务逻辑之前，使⽤解密拿到的 userId **去映射表中找到 token** ，**和请求中的 token 对⽐** 就能校验是否合法了。

### cookie 使⽤流程总结 登录 / 注册请求：

- 浏览器发送⽤⼾名和密码到服务器。 服务器验证通过后，在响应头中设置 cookie，附带登录认证信息（⼀般为 jwt）。
- 浏览器收到 cookie 保存下来。 后续请求，浏览器会⾃动将符合的 cookie 附带到请求中；
- 服务器验证 cookie 后，允许其他操作完成业务流程。

## [【OAuth2.0 是什么登录⽅式】](https://www.processon.com/diagraming/67359e2d25e8fb30af37cd16)

- OAuth2.0 并不是⼀种特定的登录⽅式，⽽是⼀种**授权框架**，⽤于授权 **第三⽅应⽤** 访问⽤⼾的资源。它被⼴泛应⽤于⾝份验证和授权的场景中。
- OAuth2.0 通过引⼊授权服务器、资源服务器和客⼾端等⻆⾊，**实现了⽤⼾授权和资源访问的分离**。
- 具体流程如下：
  1. ⽤⼾向客⼾端发起请求，请求访问某个资源。
  2. 客⼾端将⽤⼾**重定向**到授权服务器，并携带⾃⼰的⾝份凭证（客⼾端 ID）。
  3. ⽤⼾在授权服务器登录，并授权客⼾端访问特定的资源。
  4. 授权服务器验证⽤⼾⾝份，并⽣成 **访问令牌（`Access Token`）**。
  5. 授权服务器将访问令牌发送给客⼾端。
  6. 客⼾端使⽤访问令牌向资源服务器请求访问资源。
  7. 资源服务器验证访问令牌的有效性，并根据权限决定是否允许访问资源。
  8. 资源服务器向客⼾端返回请求的资源。

![alt text](OAuth2.0.png)
在这个过程中，OAuth2.0 通过访问令牌实现了⽤⼾和资源服务器之间的⾝份授权和资源访问分离。客⼾端⽆需知道或存储⽤⼾的凭证（如⽤⼾名和密码），⽽是使⽤**访问令牌**代表⽤⼾向资源服务器请求资源，提供了更安全和便捷的授权⽅式。

## 【单点登录 SSO 是如何实现的？】

> 单点登录：`Single Sign On`，简称`SSO`。⽤⼾只要登录⼀次，就可以访问 **所有相关信任应⽤** 的资源。企业 ⾥⾯⽤的会⽐较多，有很多内⽹平台，但是只要在⼀个系统登录就可以。

### 实现⽅案

- 单⼀域名：可以把 cookie 种在**根域名**下实现单点登录
- 多域名：常⽤ `CAS`来解决，新增⼀个认证中⼼的服务。`CAS（Central Authentication Service）`是实现 SSO 单点登录的框架
- CAS 实现单点登录的流程：
  1. ⽤⼾访问系统 A，判断未登录，则直接跳到认证中⼼⻚⾯
  2. 在认证中⼼⻚⾯输⼊账号，密码，⽣成**令牌**，重定向到 系统 A
  3. 在系统 A 拿到令牌到认证中⼼去认证，认证通过，则建⽴对话
  4. ⽤⼾访问系统 B，发现没有有效会话，则重定向到认证中⼼
  5. 认证中⼼发现有全局会话，新建令牌，重定向到系统 B
  6. 在系统 B 使⽤令牌去认证中⼼验证，验证成功后，建议系统 B 的局部会话。

### [举例](https://www.processon.com/diagraming/67359052d3ba651985762e49)

下⾯是举例来详细说明 CAS 实现单点登录的流程：  
**⼀、第⼀次访问系统 A**

1. ⽤⼾访问系统 A (www.app1.com)， 跳转认证中⼼ client(www.sso.com)， 然后输⼊⽤⼾名，密码登录，
2. 然后认证中⼼ serverSSO 把 cookieSSO 种在认证中⼼的域名下 (www.sso.com)， 重定向到系统 A，并且带上⽣成 ticket 参数 `(www.app1.com?ticket =xxx`)
3. 系统 A (www.app1.com?ticket =xxx)请求系统 A 的后端 serverA ，serverA 去 serverSSO 验证，通
   过后，将 cookieA 种在 www.app1.com下

**⼆、第⼆次访问系统 A**：直接携带 cookieA 去访问后端，验证通过后，即登录成功。

**三、第三次访问系统 B**

1. 访问系统 B (www.app2.com)， 跳转到认证中⼼ client(www.sso.com)， 这个时候会把认证中⼼的 cookieSSO 也携带上，
2. 发现⽤⼾已登录过，则直接重定向到系统 B（www.app2.com）， 并且带上⽣成的 ticket 参数（`www.app2.com?ticket =xxx`）
3. 系统 B (www.app2.com?ticket =xxx)请求系统 B 的后端 serverB，serverB 去 serverSSO 验证，通过后，将 cookieB 种在www.app2.com下
   ![alt text](CAS-示例.png)
   注意 cookie ⽣成时机及种的位置：

- cookieSSO，SSO 域名下的 cookie
- cookieA，系统 A 域名下的 cookie
- cookieB，系统 B 域名下的 cookie
