<!--
 * @Description: https://gitee.com/yanleweb/interview-question/issues/I7W2KU
 * @Date: 2024-08-23 16:04:10
 * @LastEditTime: 2024-09-18 14:29:32
-->

# 业务场景

<!-- 1. ⽤⼾访问**系统1** 的受保护资源，系统 1 发现⽤⼾未登录，跳转⾄ **sso 认证中⼼**，**并将⾃⼰的地址作
为参数**
2. sso认证中⼼ 发现⽤⼾未登录，将⽤⼾引导⾄**登录⻚⾯**
3. ⽤⼾输⼊⽤⼾名密码提交登录申请
4. sso 认证中⼼校验⽤⼾信息，创建⽤⼾与 sso 认证中⼼之间的会话，称为全局会话，同时创建授权
令牌
5. sso 认证中⼼**带着令牌跳转会最初的请求地址**（系统 1）
6. 系统 1 拿到令牌，去 sso 认证中⼼校验令牌是否有效
7. sso 认证中⼼校验令牌，返回有效，注册系统 1
8. 系统 1 使⽤该令牌创建与⽤⼾的会话，称为局部会话，返回受保护资源
9. ⽤⼾访问**系统 2** 的受保护资源
10. 系统 2 发现⽤⼾未登录，跳转⾄ **sso 认证中⼼**，并将⾃⼰的地址作为参数
11. sso 认证中⼼发现⽤⼾已登录，**跳转回系统 2 的地址，并附上令牌**
12. 系统 2 拿到令牌，去 sso 认证中⼼校验令牌是否有效
13. sso 认证中⼼校验令牌，返回有效，注册系统 2
14. 系统 2 使⽤该令牌创建与⽤⼾的局部会话，返回受保护资源 -->

## 1. Web ⽹⻚如何禁⽌别⼈移除⽔印

- `MutationObserver` 可以观察 DOM 树的变化，并在变化发⽣时触发回调函数。
- 可以在回调函数中使用`mutation.removedNodes`检查是否有⽔印被删除，
- MutationObserver API 是现代浏览器提供的功能，在⽼旧的浏览器中可能不⽀持。因此，在实际使⽤时，需要注意对浏览器的兼容性进⾏测试和处理。
  ::: example
  blogs/business/watermark
  :::

## 2. JS 执⾏ 100 万个任务， 如何保证浏览器不卡顿？

- 浏览器主线程一次只能处理一个任务（任务按照队列执行）
- web worker 是运行在 Main 线程之外的一个线程，叫做 worker 线程

### 方案 1：web worker 灵巧越过主线程阻塞问题

### 方案 2：（推荐）利用 requestAnimationFrame 实现任务调度

#### 一个 100 万个函数硬执行

- 详见`docs\examples\blogs\business\requestAnimationFrame\test.html`
- 执行下面的代码，页面会一直处于卡顿，然后最后结果闪出来

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>一个 100 万个函数硬执行</title>
  </head>
  <body>
    <p id="result"></p>
    <script>
      const $result = document.getElementById('result')
      /* ==============================  长任务 - Start ============================== */
      const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1)
      // 定义一个处理函数，例如对数组中的每个元素进行平方操作
      function processChunk(chunk) {
        return `chunk: ${chunk}`
      }

      for (const item in bigArray) {
        $result.innerText = processChunk(item)
      }
      //  ==============长任务 - End ================
    </script>
  </body>
</html>
```

#### [使用 chunkSize 来对长任务进行切分](https://blog.csdn.net/qq_53109172/article/details/135320963).

> 详见`docs\examples\blogs\business\requestAnimationFrame\3.requestAnimationFrame.html`

- `requestAnimationFrame(callback)` **触发的时机是浏览器在下次重绘之前调用指定的回调函数更新动画**
- requestAnimationFrame() 是一次性的
- 在大多数遵循 W3C 建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配**60Hz（每秒 60 次）**
- 取消 requestAnimationFrame 执行，可以通过 `cancelAnimationFrame` 方法
- 每次 requestAnimationFrame 执行频次，**一秒钟执行 60 次**， 那么每次消耗时间是 16ms 左右
- requestAnimationFrame() 运行在后台标签页或者隐藏的 `<iframe>` 里时，会被**暂停调用**以提升性能和电池寿命

```html{23,31,36,39}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>使用 chunkSize动态 来对长任务进行切分</title>
  </head>

  <body>
    <p id="result"></p>
    <script>
      const $result = document.getElementById('result')
      // 假设有一个包含大量元素的数组
      const bigArray = Array.from({ length: 1000000 }, (_, i) => i + 1)
      // 定义一个处理函数，对数组中的每个元素执行一次
      function processChunk(chunk) {
        return `chunk: ${chunk}`
      }
      // 动态调整 chunkSize 的优化方式
      let chunkSize = 1000 // 初始的 chunkSize
      let index = 0
      function processArrayWithDynamicChunkSize() {
        function processChunkWithRAF() {
          let startTime = performance.now() // 记录结束时间
          for (let i = 0; i < chunkSize; i++) {
            if (index < bigArray.length) {
              const result = processChunk(bigArray[index]) // 对每个元素执行处理函数
              $result.innerText = result
              index++
            }
          }
          let endTime = performance.now()
          let timeTaken = endTime - startTime // 计算处理时间
          // 根据处理时间动态调整 chunkSize
          if (timeTaken > 16) {
            // 如果处理时间超过一帧的时间（16毫秒），则减小 chunkSize
            chunkSize = Math.floor(chunkSize * 0.9) // 减小10%
          } else if (timeTaken < 16) {
            // 如果处理时间远小于一帧的时间（8毫秒），则增加 chunkSize
            chunkSize = Math.floor(chunkSize * 1.1) // 增加10%
          }
          if (index < bigArray.length) {
            requestAnimationFrame(processChunkWithRAF) // 继续处理下一个小块
          }
        }
        requestAnimationFrame(processChunkWithRAF) // 开始处理大数组
      }
      processArrayWithDynamicChunkSize()
    </script>
  </body>
</html>
```

## 3. 虚拟混动加载原理及实现
### 前置知识点
  | 分支 | 说明 | |
  | ---------- | -------------------- | ------------------------------------- |
  | clientHeight  | 获取屏幕可视区域的高度| |
  | clientWidth | 获取屏幕可视区域的宽度 | |
  | offsetTop | 元素相对于文档顶部的高度。 | |
  | document.documentElement.scrollTop | 浏览器窗口顶部与文档顶部之间的距离，也就是滚动条滚动的距离。 | |

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9f4c4b681b2a49dbb1aa980fe8fc5f87~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723528&x-orig-sign=%2BVkJnxWIB2JfM280LLZJJDzWGlw%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5bab161be9b749aeaac7e59c7b9091a3~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723755&x-orig-sign=GgBBRBgMGC7a%2BOGhTrGKkZAoMjM%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/84fd23b803b64ecb89c01fa78921b09c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5bCP6I2J5byA6Iqx:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiNjE2MjA1Mjg1MDY1MjA4In0%3D&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1724723780&x-orig-sign=ivoR%2BcQjZXJBPRyBC55pcO6lhBY%3D)

### 虚拟滚动的核心原理
- 虚拟滚动的核心原理是**仅渲染用户可视范围内的列表项**，以此减少 DOM 操作的数量和提高性能。
- 实现虚拟滚动
  - 监听滚动事件，了解当前滚动位置。
  - 根据滚动位置计算当前应该渲染哪些列表项目（即在视口内的项目）。
  - 只渲染那些项目 ，并用占位符（比如一个空的 div）占据其它项目应有的位置，保持滚动条大小不变。
  - 当用户滚动时，重新计算并渲染新的项目。


<!-- 
 ::: example
  blogs/business/watermark
 :::
-->

## 4. [DocumentFragment](https://github.com/pro-collection/interview-question/issues/722)

> 详见`docs\examples\blogs\business\documentFragment.html`

DocumentFragment 是 Web API 中的一部分，它是 DOM （文档对象模型）的一个非常轻量级的节点，代表一组 DOM 节点的集合。

- 它不是一个真实存在于 DOM 中的实体
- 通常用来作为**临时**的 DOM 节点仓库。
- 一旦整个 DocumentFragment 插入到 DOM 的一个**永久节点**上，那么在 DocumentFragment 内进行的更改将会触发 DOM 的重新渲染。

### DocumentFragment API 有几个关键的特点和用途：

- 轻量级：DocumentFragment 不会引起布局重排，因为其不是真实渲染的一部分。
- 节点集合：可以在 DocumentFragment 中节点集合进行分组，这个集合可以一次性插入到 DOM 的某一部分中。
- 性能优化：通过在一个 DocumentFragment 中构建好一大块 DOM 树，然后将它整体插入到主 DOM 中，从而减少重排次数，提高效率。
- 事件不冒泡：因为 DocumentFragment 不是真实渲染的一部分，所以它的事件不会冒泡到上层的 DOM 元素，除非它被插入到了 DOM 中。

### 使用场景

以下是一些使用 DocumentFragment 的常见场景：

- 批量操作：当你想要一次性添加多个节点到 DOM 树中时，使用 DocumentFragment 可以将这些节点预先堆放在一个轻量级对象中，然后一次性添加。
- 离屏操作：如果你需要创建复杂的 DOM 结构，可以通过 DocumentFragment 在不触发页面重排和重绘的情况下进行。
- 内容填充：在填充 DOM 元素内容之前，可以先创建一个 DocumentFragment 完成所有节点的添加和排序，然后把它添加到 DOM 树中。
- 避免内存泄漏：在某些情况下，它可以作为防止因移动节点而造成的内存泄漏的一个办法。

## 5. 在表单校验场景中， 如何实现⻚⾯视⼝滚动到报错的位置
> 详见`docs\examples\blogs\business\validationForm.html`
- 滚动指定位置：`element.scrollIntoView({ block: "center", behavior: "smooth" }); `

## 6. [检测网页是否为空闲状态](https://www.jb51.net/javascript/318807ud9.htm)
> 详见`docs\examples\blogs\business\检测网页是否为空闲状态`
1. 监听⿏标移动事件 `mousemove` ；
2. 监听键盘按下事件 `mousedown` ；
3. 监听页面隐藏情况 `visibilitychange` ；
4. 在⽤⼾进⼊⽹⻚后，设置延时跳转，如果触发以上事件，则移除延时器，并重新开始。