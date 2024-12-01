<!--
 * @Description:
 * @Date: 2024-10-31 09:27:12
 * @LastEditTime: 2024-11-14 16:57:40
-->

## 【⽤ nodejs 统记某个⽬录下⾯指定文件的代码⾏数】

<!-- 【热度: 1,732】 -->

| fs 方法                                                                                      | 说明                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `fs.readdirSync(directoryPath)`                                                              | 同步读取当前目录下的所有文件和文件夹，返回数组 |
| `fs.readFileSync(filePath)`                                                                  | 读取文件内容                                   |
| [`stats=fs.statSync(filePath)`](https://blog.csdn.net/qq_42744920/article/details/123719169) | 同步方法，获取文件信息状态                     |
| `stats.isFile()`                                                                             | 如果是文件则返回 true,否则返回 false;          |
| `stats.isDirectiory()`                                                                       | 如果是目录则返回 true,否则返回 false;          |
| `path.extname(file)`                                                                         | 文件后缀                                       |

- 详见`docs\examples\blogs\business\line-counter.js`
- 执行示例,在终端执行`node line-counter.js ../business .js`
  - 其中 ../business 是要统计的⽬录路径，
  - .js 是要统计的⽂件扩展名。

```js{11,17,21,23,30}
import fs from 'fs'
import path, { resolve } from 'path'
// const fs = require('fs');
// const path = require('path');
// dirPath：目录路径
// fileExtension：文件扩展名
function countLinesInDirectory(dirPath, fileExtension) {
  let totalLines = 0
  // 统计文件行数
  function countLinesInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8') // 读取文件内容
    const lines = content.split('\n') //根据换行符分割
    totalLines += lines.length
  }
  // 遍历目录
  function processDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath)
    // console.log('【 files 】-20', files)
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      const stats = fs.statSync(filePath) // 获取文件信息状态
      // 判断是文件还是目录
      if (stats.isFile() && path.extname(file) === fileExtension) {
        countLinesInFile(filePath)
      } else if (stats.isDirectory()) {
        processDirectory(filePath)
      }
    })
  }
  processDirectory(dirPath)
  return totalLines
}

// 命令⾏参数，第⼀个参数是⽬录路径，第⼆个参数是⽂件扩展名
const [_, __, dirPath, fileExtension] = process.argv

const linesCount = countLinesInDirectory(dirPath, fileExtension)
console.log(`目录 ${dirPath}下${fileExtension}文件的代码共:${linesCount}行`)
```

## ~~【nodejs 如何充分利⽤多核 CPU?】~~

总所周知， NodeJS 是**单线程**执⾏任务， 不同于 浏览器还可以使⽤ web worker 等⼿段多线程执⾏任
务。那么 NodeJS 中， 是如何充分利⽤物理机的多核 CPU 呢？

### 有三种⽅式

在 Node.js 中，JS 也是单线程的，只有⼀个主线程⽤于执⾏任务。但是，在 Node.js 中可以使⽤多进
程来利⽤多核机器，以充分利⽤系统资源。

1. **Node.js 提供了 `cluster` 模块，可以轻松创建⼦进程来处理任务**。通过将任务分配给不同的⼦进程，每个⼦进程可以在⾃⼰的线程上执⾏任务，从⽽实现多核机器的利⽤。
2. Node.js 也提供了 `worker_threads` 模块，可以创建真正的多线程应⽤程序。这个模块允许开发者创建和管理多
3. 利⽤的是 Node.js 的**事件循环机制和异步⾮阻塞的`I/O` 操作**。**Node.js 使⽤事件驱动的模型来处理请求，当有请求到达时，Node.js 将其放⼊事件队列中，然后通过事件循环来处理这些请求**。在等待 I/O 操作的过程中，Node.js 不会阻塞其他请求的处理，⽽是继续处理其他请求。这样，即使 JavaScript 是单线程的，但在实际运⾏中，多个请求可以同时处理，充分利⽤了多核系统的能⼒。

### 如果 Nodejs 只写同步代码， 是否意味着⽆法充分利⽤多核优势？

- 如果在 Node.js 的开发过程中只使⽤同步代码⽽不使⽤异步代码或集群模块，那么意味着 **⽆法充分利⽤机器多核优势。**
- Node.js 的事件驱动和异步⾮阻塞的特性使得它在处理⼤量并发请求时⾮常⾼效。**当你使⽤异步代码时，可以在等待 I/O 操作的过程中继续处理其他请求，从⽽提⾼系统的吞吐量和响应速度**。⽽同步代码会阻塞事件循环，使得只能按顺序处理请求，⽆法同时处理多个请求，⽆法充分利⽤多核系统的能⼒。
- 另外，如果你不使⽤集群模块，那么只有⼀个 Node.js 进程在运⾏，⽆法充分利⽤多核系统的资源。使⽤集群模块可以创建多个⼦进程，每个⼦进程在⼀个核⼼上运⾏，从⽽并⾏处理请求，提⾼系统的并发能⼒。

### 为何 nodejs 异步代码就可以充分利⽤多核优势了？

Node.js 的异步代码可以充分利⽤多核优势，主要有两个原因：

1. **事件驱动和⾮阻塞 I/O**：Node.js 采⽤事件驱动的模型，通过使⽤异步⾮阻塞 I/O 操作，可以在等待 I/O 操作完成的同时继续处理其他请求。这意味着在⼀个请求等待 I/O 的过程中，Node.js 可以同时处理其他请求，充分利⽤了 CPU 的多核能⼒。每个核⼼可以处理⼀个请求，从⽽提⾼系统的并发能⼒和吞吐量。
2. **事件循环机制**：Node.js 的事件循环机制使得异步代码可以⾼效地处理⼤量并发请求。事件循环机制通过将请求注册为事件监听器，并在合适的时候触发事件处理函数，从⽽实现异步处理。这样⼀来，即使有⼤量并发请求，也能够通过事件循环机制避免线程切换的开销，提⾼系统的性能。

需要注意的是，虽然 Node.js 的事件驱动和异步⾮阻塞的特性使得它能够充分利⽤多核优势，但是在处理 CPU 密集型任务时，仍然可能受限于单线程的性能。**在这种情况下，可以通过使⽤集群模块来创建多个⼦进程，在每个核⼼上运⾏独⽴的 Node.js 进程，从⽽实现并⾏处理，提⾼系统的性能**。

### 异步就能充分利⽤ CPU 原理是啥？

- 当 Node.js 使⽤异步代码时，服务器的其他 CPU 核⼼是在⼯作的。
- 这是因为 Node.js 的事件驱动模型和⾮阻塞 I/O 使得在等待 I/O 操作完成时，可以同时处理其他请求。
- 当⼀个请求在等待 I/O 操作时，CPU 核⼼可以被⽤于处理其他请求，⽽不是空闲等待。

这种⽅式可以充分利⽤服务器上的多个 CPU 核⼼，提⾼系统的并发能⼒和吞吐量。通过同时处理多个请求，可以更有效地利⽤服务器的资源，提⾼系统的性能。
