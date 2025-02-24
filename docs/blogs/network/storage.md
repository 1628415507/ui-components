<!--
 * @Description:
 * @Date: 2024-10-30 18:10:00
 * @LastEditTime: 2024-11-18 13:29:20
-->

# 浏览器数据存储

## 【cookie（客户端）】

- 在 HTTP 协议中，cookie 是⼀种包含在请求和响应报⽂头中的数据，⽤于在客⼾端存储和读取信息，每次浏览器的请求会⾃动带上 cookie
- cookie 是由服务器发送的，客⼾端可以使⽤浏览器 API 将 cookie 存储在本地进⾏后续使⽤。
  > 一开始 cookie 不是用来存储的，而是为了弥补 http 的状态的不足，http 是无状态协议。每当向服务器发起请求、请求结束，下次发送请求的时候服务端就不知道是谁了，所以 cookie 是用来弥补这个不足的

### 1. cookie 的组成

⼀个 cookie 通常由以下⼏个部分组成：

| 属性           | 描述                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 名称（键）     | 通常是⼀个字符串                                                                                                                                         |
| 值             | 通常也是⼀个字符串                                                                                                                                       |
| 作⽤路径`path` | 只有在指定路径下的请求才会携带该 cookie，`/` 表⽰匹配所有。                                                                                              |
| 作⽤域`domain` | • 指定了该 cookie 绑定的域名，可以使⽤ `domain` 属性来设置。<br> • 默认值：当前主机，也就是 `location.host` <br> • cookie 是不关⼼端⼝的，只要域匹配即可 |
| `http-only`    | • 为 true 时，不能被客户端更改访问，表⽰该 cookie 仅能⽤于传输<br>• ⽽客⼾端通过 `document.cookie` 获取的是空字符串;<br>• 可用于防止 XSS 攻击            |
| Secure         | 是否只允许在 https 下传输                                                                                                                                |
| expire         | 过期时间 ，以便浏览器⾃动清除失效的 cookie。                                                                                                             |
| max-age        | 生效后存活的时间                                                                                                                                         |

- 如果 expires 和 max-age 都不设置，则为 `session`，也就是会话结束
  后过期，⼤多浏览器关闭（注意不是标签⻚关闭）意味着会话结束。
- 如果设置其中⼀个，cookie 会保存在硬盘中，即便电脑关闭也不会消失。
- expires 和 max-age ⼀般只设置⼀个即可。

```js{4}
Set-Cookie: user=john; // 名称为 "user"、值为 "john"
expires=Sat, 01 Jan 2022 00:00:00 GMT;//失效时间
path=/;//作⽤于全站的
domain=example.com//作⽤域为 "example.com" 的域名
```

### 2. cookie 的属性

<!-- | 属性值      | 解释                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | -->

### 3. cookie 的生命周期

- cookie 是保存在**客户端**的，一般由 server 设置值及过期时间
- cookie 没有提供删除的 API，如果想要删除的 的话可以把`max-age设为0`或者把 `expire 设置为当前时间（立刻过期）`即可

### 4. cookie 的缺陷

| 标题       |                                                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ① 容量缺陷 | cookie 的存储空间只有`4KB`                                                                                                                     |
| ② 性能缺陷 | 不管用不用得到 cookie，http 在发送请求的时候一定会带着 cookie，这就造成了性能的浪费                                                            |
| ③ 安全缺陷 | cookie 在 http 下很容易被非法用户获取。<br/>尤其是设置了 http-only 为 false 的情况下，这个时候 js 可以读取到 cookie，很容易受到 **xss 攻击**。 |

## 【localStorage 与 sessionStorage（客户端浏览器）】

### （1）属性

|                  | localStorage                                                                                  | sessionStorage                                           |
| ---------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 生命周期         | 关闭浏览器后数据依然保留<br>**永久存储，除非手动清除，否则一直在**                            | **关闭浏览器或者标签后即失效**                           |
| 作用域           | **相同浏览器**的**不同标签**在**同源情况**下可以共享<br/>（例如：同一网站的不同页面可以共享） | 只在**当前标签可用**，当前标签的 iframe 中且同源可以共享 |
| ‌ 存储大小       | 5M+                                                                                           | 5M+                                                      |
| ‌ 存储内容类型 ‌ | 字符串类型                                                                                    | 字符串类型                                               |

### （2）localstorage 怎么存储图片 ⚃

- 创建一个`canvas`对象，把图片保存在 canvas 中，然后使用 canvas 对象 的`toDataUrl`,再把 dataurl 数据存储在 localstorage 中。
- 或者使用**blob 二进制流** 存储，canvas 对象 toBlob

### （3）如何实现 localstorage 定时清除 ⚃

- 自己重写一个 set 方法，在存储数据时，同时设置⼀个失效时间。可以将失效时间存储为⼀个时间戳或特定的⽇期时间。
- 再重写一个 get 方法，在读取数据时，检查当前时间是否超过了失效时间。
- 如果超过了失效时间，则使⽤`localStorage.removeItem(key)`或`sessionStorage.removeItem(key)`⽅法删除该数据。
- 没过期的话正常返回

## [【indexedDB】](https://deepinout.com/javascript/javascript-questions/110_hk_1709940124.html)

> IndexedDB 是⼀种⽤于在浏览器中存储⼤量结构化数据的数据库。它提供了⼀个异步的 API，可以进⾏增删改查等数据库操作。IndexedDB 可以存储⼤量的数据，并⽀持事务操作。

### indexedDB API

- `open` 创建数据库连接
  - `open` 方法返回一个 `IDBOpenDBRequest` 对象，同时这是一个**异步**操作，open 操作并不会立马打开数据库或者开启事务，我们可以通过监听`request`的事件来进行相应的处理。
  - `open(name,version)`：open 方法传入两个参数，第一个参数是数据库的名字，第二个参数是数据库的版本号(**整数**)。
  - 当你**创建或升级**一个现有的数据库版本的时候，将会触发一个`onupgradeneeded`事件，并在事件中传入`IDBVersionChangeEvent`，我们可以通过 `event.target.result` 来获取到 IDBDatabase 对象，然后通过这个对象来进行数据库的版本升级操作
- 在数据库连接成功后，使用 `createObjectStore` 方法创建一个新的对象仓库(**类似于创建表**)

```js
// 创建了一个名为 customers 的对象存储空间，并指定了一个自增的键
db.createObjectStore('customers', {
  keyPath: 'id', //主键
  autoIncrement: true //自增
})
```

- ‌ 创建事务(**类似于连接表**) ‌
  - 可以通过调用数据库对象的 `transaction()` 方法来创建一个事务。如果不指定参数，事务默认以**只读**模式访问数据库中的所有对象存储
  - 可以通过传递一个或多个对象存储的名称以及访问模式（如 `readonly` `、readwrite` `或versionchange` ）来创建事务。
  ```js
  let transaction = db.transaction('customers', 'readwrite') //访问数据库中的对象存储customers
  ```
- 创建事务后，可以使用 `objectStore()` 方法访问特定的对象存储。(**类似于操作表**)
  例如：

```js
const store = transaction.objectStore('customers')
```

- 在事务中，可以使用` get()、put()、delete()` 等方法对对象存储进行读取、添加、更新和删除操作

```js
const request = objectStore.add(customer) //通过 add() 方法将该对象添加到对象存储空间中
request.onsuccess = function (event) {
  console.log('【 添加数据成功 】-84')
}
request.onerror = function (event) {
  console.log('【 添加数据失败 】-84')
}
```

::: example
blogs/business/indexedDB/index
:::
![alt text](./img/indexedDB.png)

<!-- -  // 创建了一个名为 customers 的对象存储空间，并指定了一个自增的键
- db.createObjectStore('customers', {
  -->

### IndexedDB 存储空间⼤⼩是如何约束的？

- IndexedDB 有⼤⼩限制。具体来说，IndexedDB 的⼤⼩限制通常由浏览器实现决定，因此不同浏览器可能会有不同的限制。
- ⼀般来说，IndexedDB 的⼤⼩限制可以分为两个⽅⾯：
  - **单个数据库**的⼤⼩限制：每个 IndexedDB 数据库的⼤⼩通常会有限制，这个限制可以是固定的（如某些浏览器限制为特定的⼤⼩，如 50MB），也可以是动态的（如某些浏览器根据设备剩余存储空间来动态调整⼤⼩）。
  - **整个浏览器**的⼤⼩限制：除了每个数据库的⼤⼩限制外，浏览器还可能设置整 IndexedDB 存储的总⼤⼩限制。这个限制可以根据浏览器的策略和设备的可⽤存储空间来决定。
- 需要注意的是，由于 IndexedDB 是在⽤⼾设备上进⾏存储的，并且浏览器对存储空间的管理可能会受到⽤⼾权限和设备限制的影响，因此在使⽤ IndexedDB 存储⼤量数据时，**需要注意数据的⼤⼩和存储限制**，以免超过浏览器的限制导致出错或⽆法正常存储数据。

### 开发者是否可以通过 JS 代码可以调整 IndexedDB 存储空间⼤⼩？

- 实际上，在创建数据库时，⽆法直接通过 API 设置存储空间⼤⼩。
- **IndexedDB 的存储空间⼤⼩通常由浏览器的策略决定，并且在⼤多数情况下，开发者⽆法直接控制**。
- 浏览器会根据⾃⾝的限制和规则，动态分配和管理 IndexedDB 的存储空间。因此，将存储空间⼤⼩设置为期望的值不是开发者可以直接控制的。
- 开发者可以通过以下⽅式来控制 IndexedDB 的存储空间使⽤情况：
  1. 优化数据模型：设计合适的数据结构和索引，避免存储冗余数据和不必要的索引。
  2. 删除不再需要的数据：定期清理不再需要的数据，以减少数据库的⼤⼩。
  3. 压缩数据：对存储的数据进⾏压缩，可以减少存储空间的使⽤。

这些⽅法只能间接地影响 IndexedDB 的存储空间使⽤情况，具体的存储空间⼤⼩仍然由浏览器决定。

## Cache Storage

Cache Storage 是浏览器缓存的⼀部分，⽤于存储浏览器的缓存资源。它可以⽤来缓存⽹⻚、脚本、样式表、图像等**静态资源**，以提⾼⽹⻚加载速度和离线访问能⼒。

## Web SQL Database：

Web SQL Database 是⼀种**已被废弃**但仍被⼀些浏览器⽀持的关系型数据库。它使⽤ SQL 语⾔来进⾏数据操作，可以存储⼤量的结构化数据。

## 追问：service worker 存储的内容是放在 哪⼉的？

Service Worker 可以利⽤ Cache API 和 IndexedDB API 进⾏存储。具体来说：

1. Cache API：Service Worker 可以使⽤ Cache API 将请求的响应存储在浏览器的 `Cache Storage`中。Cache Storage 是浏览器的⼀部分，⽤于存储缓存的资源。通过 Cache API，Service Worker 可以将⽹⻚、脚本、样式表、图像等静态资源缓存起来，以提⾼⽹⻚加载速度和离线访问能⼒。
2. IndexedDB API：
   - Service Worker 还可以利⽤ IndexedDB API 在浏览器中创建和管理数据库。
   - IndexedDB 是⼀种⽤于存储⼤量结构化数据的数据库，Service Worker 可以通过 IndexedDB API 进⾏数据的增删改查操作。通过 IndexedDB，Service Worker 可以将⼤量的数据进⾏持久化存储，以便在离线状态下仍然能够访问和操作数据。
   - Service Worker 存储的内容并不是放在普通的浏览器缓存或本地数据库中，⽽是放在 Service Worker 的**全局作⽤域**中。
   - Service Worker 运⾏在**独⽴的线程中，与浏览器主线程分离，因此能够独⽴地处理⽹络请求和数据存储，提供了⼀种强⼤的离线访问和缓存能⼒**

## session（服务端）

- 作用域：session 是保存在**服务端**的
- session 的运行依赖 sessionId，sessionId 又保存在 cookie 中，  
  **所以禁用了 cookie 之后 session 也是用不了的**
  如果硬要用也可以，可以把 sessionId 存储在 url 中
- session 一般是用来跟踪用户状态的
- session 比较安全，因为存储在服务器中  
  不过为了减少服务端的压力，很多信息还是推荐存在 cookie 中的

## 将静态资源缓存在本地的⽅式有哪些？【热度: 584】

### 浏览器可以使⽤以下⼏种⽅式将前端静态资源缓存在本地：

1. HTTP 缓存：
   - 浏览器通过设置 `HTTP` 响应头中的 `Cache-Control` 或 `Expires` 字段来指定资源的缓存策略。
   - 常⻅的缓存策略有：`no-cache`（每次都请求服务器进⾏验证）、`no-store`（不缓存资源）、`max-age`（设置资源缓存的最⼤时间）等。浏览器根据这些缓存策略来决定是否将资源缓存在地。
2. `ETag/If-None-Match`：
   - 服务器可以通过在**响应头**中添加 `ETag` 字段，⽤于标识资源的版本号。
   - 当浏览器**再次请求**资源时，会将上次请求返回的 **`ETag 值`**通过 `If-None-Match` 字段**发送给服务器**，由服务器判断资源是否发⽣了变化。
   - 如果资源未发⽣变化，服务器会返回 `304 Not Modified` 状态码，浏览器则直接使⽤本地缓存的资源。
3. `Last-Modified/If-Modified-Since`：
   - 服务器可以通过在响应头中添加 `Last-Modified` 字段，⽤于标识**资源的最后修改时间**。
   - 浏览器**再次请求资源时**，会将上次请求返回的 **Last-Modified 值**通过 `If-Modified-Since` 字段发送给服务器。服务器根据资源的最后修改时间判断资源是否发⽣了变化，
   - 如果未发⽣变化，则返回 `304 Not Modified` 状态码，浏览器使⽤本地缓存的资源。
4. `Service Worker` 缓存：
   - 使⽤ Service Worker 可以将前端资源缓存在浏览器的 Service Worker 缓存中。
   - Service Worker 是运⾏在浏览器后台的脚本，它可以拦截和处理⽹络请求，因此可以将前端资源缓存起来，并在**离线状态**下提供缓存的资源。
5. `LocalStorage` 或 `IndexedDB`：
   - 对于⼀些⼩的静态资源，可以将其存储在浏览器的 LocalStorage 或 IndexedDB 中。
   - 这些存储⽅式是浏览器提供的本地存储机制，可以将数据以键值对的形式存储在浏览器中，从⽽实现缓存的效果。

### 如何将静态资源缓存在 LocalStorage 或 IndexedDB

- 使⽤ IndexedDB 将静态资源缓存的⽰例代码

```js{1,6,13,15,35}
// 1.打开库：打开或创建⼀个IndexedDB数据库
var request = indexedDB.open('myDatabase', 1)
// 创建或更新数据库的对象存储空间
request.onupgradeneeded = function (event) {
  var db = event.target.result
  // 2.创建表：创建resources对象
  var objectStore = db.createObjectStore('resources', { keyPath: 'url' })//
  objectStore.createIndex('url', 'url', { unique: true })
}
// 成功打开数据库后，将资源请求并存储在IndexedDB中
request.onsuccess = function (event) {
  var db = event.target.result
  //3.连接表：创建事务读取数据库中的resources对象
  var transaction = db.transaction('resources', 'readwrite')
  // 4. 操作表：从事务中获取resources对象进行操作
  var objectStore = transaction.objectStore('resources')
  resources.forEach(function (url) {
    // 发起资源请求
    fetch(url)
      .then(function (response) {
        // 检查请求是否成功
        if (!response.ok) {
          throw new Error('Request failed: ', response.status)
        }
        // 将响应数据存储在IndexedDB中
        return response.blob()
      })
      .then(function (data) {
        // 创建⼀个资源对象，以URL作为键名
        var resource = {
          url: url,
          data: data
        }
        // 将资源对象存储在IndexedDB中
        objectStore.put(resource)
        console.log('Resource cached: ', url)
      })
      .catch(function (error) {
        console.error(error)
      })
  })
  // 完成事务
  transaction.oncomplete = function () {
    console.log('All resources cached in IndexedDB.')
  }
  transaction.onerror = function (event) {
    console.error('Transaction error:', event.target.error)
  }
}
```

## [ 问题回顾 ]

- [ ] 1. localStorage、sessionStorage、cookie、session 之间有什么区别 ⭐⭐⭐⭐⭐

- [ ] 2. localStorage 与 sessionStorage 的区别？
- [ ] 3. 怎么删除 cookie？
- [ ] 4. cookie 有什么缺陷？3 个
- [ ] 5. Cookie、sessionStorage、localStorage 的区别
