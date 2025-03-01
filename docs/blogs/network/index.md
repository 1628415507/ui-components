<!--
 * @Description:
 * @Date: 2024-10-30 18:10:00
 * @LastEditTime: 2024-11-05 13:46:53
-->

## DNS 协议了解多少

### DNS 基本概念

- DNS（`Domain Name System`，域名系统）是因特⽹上⽤于**将主机名转换为 IP 地址的协议**。它是⼀个分布式数据库系统，通过将主机名映射到 IP 地址来实现主机名解析，并使⽤⼾能够通过更容易识别的主机名来访问互联⽹上的资源。
- 在使⽤ DNS 协议进⾏主机名解析时，系统⾸先查询**本地 DNS 缓存**。如果缓存中不存在结果，系统将向本地 DNS 服务器发出请求，并**逐级向上查找**，直到找到权威 DNS 服务器并获得解析结果。
- 在域名解析的过程中，DNS 协议采⽤了**分级命名空间**的结构，不同的域名可以通过**点分隔符**分为多个级别，
  例如 `www.example.com` 可以分为三个级别： `www` 、 `example` 和 `com` 。

### DNS 用的网络协议：

- DNS 在**区域传输**的时候用的 tcp
  > 将一个区域文件传输到多个 DNS 服务器的过程叫做**区域传输**
- 在**域名解析**的时候用的是 udp

### 除了将域名映射到 IP 地址之外，DNS 协议还⽀持多种其他功能：

1. **逆向映射**：将 IP 地址解析为域名。
2. 邮件服务器设置：⽀持邮件服务器的⾃动发现和设置。
3. **负载均衡**：DNS 还可以实现简单的负载均衡，通过将相同 IP 地址的主机名映射到不同的 IP 地址来分散负载。
4. 安全：DNSSEC（DNS Security Extensions，DNS 安全扩展）可以提供对域名解析的认证和完整性。

### 如何加快 DNS 的解析？

有以下⼏种⽅法可以加快 DNS 的解析：

1. 使⽤⾼速 DNS 服务器：默认情况下，⽹络服务提供商（ISP）为其⽤⼾提供 DNS 服务器。但是，这些服务器不⼀定是最快的，有时会出现瓶颈。如果您想加快 DNS 解析，请尝试使⽤其他⾼速 DNS 服务器，例如 Google 的公共 DNS 服务器或 OpenDNS。
2. **缓存 DNS 记录**：在本地计算机上缓存 DNS 记录可以⼤⼤加快应⽤程序的响应。**当您访问特定的⽹站时，计算机会⾃动缓存该⽹站的 DNS 记录**。如果您再次访问该⽹站，则计算机将使⽤缓存的 DNS 记录。
3. 使⽤ DNS 缓存⼯具：⼀些辅助⼯具可以帮助您优化与 DNS 相关的设置，例如免费的 DNS Jumper 软件和 Namebench ⼯具，它们可以测试您的 DNS 响应时间并为您推荐最佳配置。
4. 减少 DNS 查找：当您访问⼀个⽹站时，您的计算机将会查找该域名的 IP 地址。如果⽹站有很多域名，则查找过程可能会变得⾮常缓慢。因此，**尽可能使⽤较少的域名**可以减少 DNS 查找的数量，并提⾼响应速度。
5. **使⽤ CDN**：CDN（内容分发⽹络）是⼀种将内容存储在全球多个位置的系统。这些位置通常都有专⽤的 DNS 服务器，可以⼤⼤加快站点的加载速度。

通过使⽤**⾼速 DNS 服务器、缓存 DNS 记录、减少 DNS 查找、使⽤ CDN 和 DNS 缓存⼯具**等⽅法，可以显著提⾼ DNS 解析速度，从⽽加快应⽤程序响应时间。

## [对称加密和非对称加密](https://juejin.cn/post/7428612258726674467?searchId=20250301192434C83AEEC06D352FBE1D12)

前端数据加密主要基于以下两种加密方式：
||对称加密|非对称加密|
|---|---|----|
|概念|使用**相同的密钥**进行加密和解密| 使用一对密钥，**公钥用于加密，私钥用于解密**|
|优点|加密和解密**速度快**，适合大量数据的加密|安全性高，无需传输密钥|
|缺点|密钥管理困难，需要传输密钥|加密和解密速度慢，适合少量数据的加密|
|常见算法|`AES` (Advanced Encryption Standard)|`RSA` (Rivest-Shamir-Adleman)|

### 前端数据加密的常见方法和技术

| 方法                                            | 优点                           | 缺点                                        |
| ----------------------------------------------- | ------------------------------ | ------------------------------------------- |
| 使用 JavaScript 库，<br/>如 `CryptoJS`, `Forge` | 易用性高、功能强大             | 加密强度受限、性能开销较大、<br/>兼容性问题 |
| 使用 Web Crypto API                             | 安全性高、性能较好、兼容性较好 | 学习成本较高、功能相对简单                  |
| 使用 HTTPS 协议                                 | 安全性高、部署简单、兼容性好   | 无法加密所有数据、性能开销较大              |

### CryptoJS 加密示例

- 安装 CryptoJS:
  `npm install crypto-js`

#### AES 对称加密示例

优点:

- 安全性高: AES 算法是目前最安全的对称加密算法之一，广泛应用于数据加密领域。
- 加密强度高: AES 算法支持 128 位、192 位和 256 位密钥长度，加密强度高。
- 计算速度快: AES 算法的计算速度较快，适合用于大量数据的加密。

缺点:

- 密钥管理复杂: 对称加密算法需要安全地管理密钥，防止密钥泄露。
- 无法验证数据来源: 对称加密算法无法验证数据来源的真实性。

```js{5,6,13,18}
// 引入 CryptoJS
import CryptoJS from 'crypto-js'

// 定义密钥和明文数据
const key = CryptoJS.enc.Utf8.parse('1234567890abcdef') // 密钥长度必须为 16、24 或 32 字节
const AESConfig={
  mode: CryptoJS.mode.ECB, // 加密模式
  padding: CryptoJS.pad.Pkcs7 // 填充方式
}
const plaintext = 'Hello, World!'
// ------------------------------ 加密 ------------------------------
// 加密:用定义好的KEY对将文本内容进行加密
const encrypted = CryptoJS.AES.encrypt(plaintext, key, AESConfig)

console.log('密文:', encrypted.toString())// 输出密文
// ------------------------------ 解密 ------------------------------
// 解密：用定义好的KEY对加密过的文本内容进行解密
const decrypted = CryptoJS.AES.decrypt(encrypted, key,AESConfig)

// 输出明文
console.log('明文:', decrypted.toString(CryptoJS.enc.Utf8))
```

#### RSA 非对称加密示例

```js{4,10,16}
import CryptoJS from 'crypto-js' // 引入 CryptoJS

// 生成 RSA 密钥对
const { privateKey, publicKey } = CryptoJS.RSA.generateKeyPair(2048)

// 定义明文数据
const plaintext = 'Hello, World!'

// 公钥加密
const encrypted = CryptoJS.RSA.encrypt(plaintext, publicKey)

// 输出密文
console.log('密文:', encrypted.toString())

// 私钥解密
const decrypted = CryptoJS.RSA.decrypt(encrypted, privateKey)

// 输出明文
console.log('明文:', decrypted.toString(CryptoJS.enc.Utf8))
```
