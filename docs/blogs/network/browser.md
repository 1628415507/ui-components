## 【V8 ⾥⾯的 JIT 是什么？】

在计算机科学中，JIT 是“`Just-In-Time`”（即时编译）的缩写，它是⼀种提⾼代码执⾏性能的技术。
具体来说，在 V8 引擎（Google Chrome 浏览器和 Node.js 的 JavaScript 引擎）中，JIT 编译器在
JavaScript 代码运⾏时，将其编译成**机器语⾔**，以提⾼执⾏速度。

- 这⾥简要解释下 JIT 编译器的⼯作原理：
  1. 解释执⾏：V8 ⾸先通过⼀个解释器（如 Ignition）来执⾏ JavaScript 代码。这个过程中，代码不
     会编译成机器语⾔，⽽是**逐⾏解释执⾏**。这样做的优点是启动快，但执⾏速度较慢。
  2. 即时编译：当代码被 **多次执⾏** 时，V8 会认为这部分代码是“热点代码”（`Hot Spot`），此时 JIT 编
     译器（如 TurboFan）会介⼊，将这部分热点代码编译成机器语⾔。机器语⾔运⾏在 CPU 上⽐解释
     执⾏要快得多。
  3. 优化与去优化：JIT 编译器会对**热点代码**进⾏优化，但有时候它会基于错误的假设做出优化（例如
     认为某个变量总是某种类型）。如果后来的执⾏发现这些假设不成⽴，编译器需要去掉优化
     （Deoptimize），重新编译。
- JIT 编译器的⼀个关键优点是它能够在不牺牲启动速度的情况下，提供接近于或同等于编译语⾔的运⾏
  速度。这使得像 JavaScript 这样原本被认为执⾏效率较低的语⾔能够⽤于复杂的计算任务和⾼性能的
  应⽤场景。
- 随着 V8 和其他现代 JavaScript 引擎的不断进步，JIT 编译技术也在持续优化，以提供更快的执⾏速度
  和更⾼的性能。

## 【如何减少 JS 加载对浏览器渲染过程的阻塞】

### JS 的加载会阻塞浏览器渲染吗？

- JavaScript 的加载、解析和执⾏默认情况下会阻塞浏览器的渲染过程。
- 这是因为浏览器渲染引擎和 JavaScript 引擎是**单线程**的，并且 **⼆者共享同⼀个线程**。**JavaScript 在执⾏时会阻⽌ DOM 构建**，因为 JavaScript 可能会修改 DOM 结构（例如添加、修改或删除节点）。出于这个原因，**浏览器必须暂停 DOM 的解析和渲染，直到 JavaScript 执⾏完成**。
- 默认情况下，当浏览器遇到⼀个 `<script`> 标签时，会⽴即停⽌解析 HTML，转⽽下载和执⾏脚本，然后再继续 HTML 的解析和渲染。这意味着在 HTML ⽂档中的 JavaScript 脚本的下载和执⾏过程中，⻚⾯的渲染是被阻塞的。

### 如何减少 JS 加载对浏览器渲染过程的阻塞：

- 异步脚本（async）
- 延迟脚本（defer）
- 移动脚本位置  
   将脚本放在 HTML 的底部，即`<body>` 标签关闭之前，⽽不是放在 `<head>` 中，可以让⻚⾯内容
  先加载显⽰，从⽽减少⽤⼾对加载过程的可感知时间。
- 动态脚本加载  
  可以使⽤ JavaScript 动态创建 `<script>` 元素并添加到 DOM 中，从而控制脚本的加载和
  执⾏时机。

```js
const script = document.createElement('script')
script.src = 'script.js'
document.body.appendChild(script)
```

现代 Web 开发中通常推荐使⽤ `async` 或 `defer` 属性，提⾼⻚⾯加载性能，尤其是对于那些需要从外部服务器加载的⼤型 JavaScript 库来说尤为关键。

## 【浏览器对队头阻塞有什么优化？】

### 什么是队头阻塞

- 队头阻塞（`Head-of-Line Blocking`，缩写 HoLB）问题主要发⽣在⽹络通信中，特别是在使⽤`HTTP/1.1` 和以前版本时，在⼀个 TCP 连接中同⼀时间只能处理⼀个请求。
- 即使后续的请求已经准备好在客⼾端，它们也**必须等待当前处理中的请求完成后才能被发送**。这会延迟整个⻚⾯或应⽤的⽹络请求，降低性能。

### 优化措施

- 现代浏览器和协议已经实施了多种优化措施来减少或解决队头阻塞问题：

1. `多路复⽤（HTTP/2）`  
   为了解决 HTTP/1.x 的诸多问题，包括队头阻塞问题，HTTP/2 引⼊了**多路复⽤**（multiplexing）功能。这允许**在同⼀ TCP 连接上同时传输多个独⽴的请求-响应消息**。可以并⾏处理多个请求，⼤⼤减少了队头阻塞的问题。
2. `服务器推送（HTTP/2）`：  
   HTTP/2 还引⼊了服务器推送（server push）功能，允许服务器主动发送多个响应到客⼾端，⽽不需要客⼾端明确地为每个资源提出请求。这提⾼了⻚⾯加载的速度，因为相关资源可以被预先发送⽽⽆需等待浏览器请求。
3. `优先级设置（HTTP/2）`：  
   HTTP/2 允许设置资源的加载优先级，使得关键资源（如 HTML，CSS，JavaScript）可以⽐不那么重要的资源（如图⽚，⼴告）更早加载。
4. 域名分散（Domain Sharding）（HTTP/1.1）：  
   这种技术常⽤于 HTTP/1.1 中，通过创建多个⼦域，使得浏览器可以同时开启更多的 TCP 连接来加载资源。虽然这种⽅法可以在⼀定程度上减轻队头阻塞，但它增加了复杂性，并且在 HTTP/2 中由于多路复⽤功能变得不再必要。
5. 连接重⽤（Connection Reuse）（HTTP/1.1）：  
   这是 HTTP/1.1 中的⼀个特性，即持久连接（Persistent Connections），**允许在⼀次 TCP 连接中发送和接收多个 HTTP 请求和响应，⽽⽆需开启新的连接**，从⽽减少了 TCP 握⼿的开销并提升了效率。
6. `资源优化`：  
   **减少资源的⼤⼩通过压缩（如 GZIP）**，优化图⽚，减少 CSS 和 JavaScript ⽂件的⼤⼩等，可以减少队头阻塞的影响，因为⼩资源⽂件传输更快。
7. 预加载：  
   浏览器可以通过使⽤ `<link rel="preload">` 标签预加载关键资源，例如字体⽂件和关键脚本，这样可以确保它们在主要内容加载之前已经准备好。
8. HTTP/3 和 QUIC 协议：  
   HTTP/3 是未来的推进⽅向，它基于 QUIC 协议，⼀个在 UDP 之上的新传输层协议，旨在进⼀步减少延迟，解决 TCP/IP 协议的队头阻塞问题。

总的来说，HTTP/2 的特性如`多路复⽤、服务器推送和优先级设置`都有助于减少队头阻塞。⽽ HTTP/3 的引⼊可能会在未来为⽹络通信带来根本性的变化。在使⽤ HTTP/2、HTTP/3 和浏览器级别的优化时，⽹⻚开发者也需注意资源加载优化的最佳实践，以更全⾯地应对队头阻塞问题