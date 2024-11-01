## 【图⽚懒加载⽅式】

图⽚懒加载可以延迟图⽚的加载，只有当图⽚即将进⼊视⼝范围时才进⾏加载。这可以⼤⼤减轻⻚⾯的加载时间，并降低带宽消耗，提⾼了⽤⼾的体验。

### 1. [Intersection Observer API](https://blog.csdn.net/Zbz00720/article/details/139025413)

- `Intersection Observer API` 是⼀种⽤于异步检查 **⽂档中元素与视⼝叠加程度**的 API。可以将其⽤于检测图⽚是否已经进⼊视⼝，并根据需要进⾏相应的处理。
- observer 观察者对象在观察元素是否进入视口、祖先元素的时候，不管元素是否进入，都会触发观察者对象的回调函数
- isIntersecting true 当前元素进入视口，false 当前元素离开视口

```js{2,3,7}
    var box = document.querySelector('.img')
    var observer = new IntersectionObserver((entry)=>{
     if (entry.isIntersecting) {
      // ...元素进入视口
     }
  })
    observer.observe(box)
```

::: example
blogs/business/dom/lazyImage/intersectionObserver
:::

### 2. ⾃定义监听器

- 可以通过⾃定义监听器来实现懒加载时，要应该避免在滚动事件处理程序中频繁进⾏图⽚加载，因为这可能会影响性能。
- 应在**滚动停⽌时**进⾏图⽚加载。
- [前置知识点](https://blog.csdn.net/lph159/article/details/142134594)

| 属性                                                                       | 说明                                                                                                                                                                  | 图解                                              |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `scrollTop`                                                                | 元素顶部与文档顶部之间的距离，也就是滚动条**滚动的距离**。                                                                                                            |                                                   |
| `window.innerHeight`                                                       | 浏览器窗口的内部高度(包括滚动条),会随着浏览器窗口的放大缩小变化                                                                                                       |                                                   |
| `clientHeight`                                                             | 获取屏幕可视区域的高度，包含元素的高度+内边距;<br/>**不包含**水平滚动条，边框和外边距                                                                                 | ![clientHeight](./lazyImage/img/clientHeight.png) |
| `clientWidth`                                                              | 获取屏幕可视区域的宽度。该属性包括内边距 padding；<br/>**不包括**边框 border、外边距 margin 和垂直滚动条（如果有的话）。                                              |                                                   |
| `offsetHeight`                                                             | 元素的 offsetHeight 是一种元素 CSS 高度的衡量标准，<br/>**包括**元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话）                                            | ![offsetHeight](./lazyImage/img/offsetHeight.png) |
| [`offsetTop`](https://blog.csdn.net/qq_42816270/article/details/138028929) | 表示元素顶部到其 offsetParent 元素内边框的距离，而 offsetParent 是最近的定位父元素或最近的 table、td、th、body 元素。当元素没有定位父元素时，offsetParent 默认为 body | ![offsetTop](./lazyImage/img/offsetTop.png)       |
| 判断元素是否进入父元素视口                                                 | `offsetTop < window.innerHeight + scrollTop`                                                                                                                          | ![alt text](./lazyImage/img/image.png)            |
| `clientX/clientY `                                                         | 鼠标相对于浏览器文档显示区的水平 X 坐标,不包括工具栏和滚动条                                                                                                          |                                                   |

详见`lazyImage/scrollListener.html`

```js{6,7,13}
function lazyLoad() {
  const images = document.querySelectorAll(".lazy");
  const scrollTop = window.pageYOffset;
  images.forEach((img) => {
    console.log('【 img 】-32', img.offsetTop, scrollTop, window.innerHeight)
    if (img.offsetTop < window.innerHeight + scrollTop) {
      img.src = img.dataset.src;
      // img.classList.remove("lazy");
    }
  });
}
let lazyLoadThrottleTimeout;// 防抖
document.addEventListener("scroll",
  function () {
    if (lazyLoadThrottleTimeout) {
      clearTimeout(lazyLoadThrottleTimeout);
    }
    lazyLoadThrottleTimeout = setTimeout(lazyLoad, 1000);//停止滚动后执行
  }
)
```

## 【如何判断 dom 元素是否在可视区域】

<!-- 【热度: 846】 -->

### 1. getBoundingClientRect() ⽅法

```js{2,6}
function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  const { top, left, bottom, right } = rect
  const height = window.innerHeight || document.documentElementclientHeight
  const width = window.innerWidth || document.documentElement.clientWidth
  return top >= 0 && left >= 0 && bottom <= height && right <= width
}
// 示例
const element = document.getElementById('my-element');
if (isInViewport(element)) {
  console.log('在可视区域')
} else {
  console.log('不在可视区域')
}
```

### 2. IntersectionObserver API

- 该 API 可以观察元素与其祖先元素或视⼝交叉的情况，并且可以设置回调函数，当元素的可⻅性发⽣变化时会调⽤该回调函数。
- 使⽤ IntersectionObserver API 的优点是可以减少不必要的计算和事件监听，提⾼了性能

```js{3,11,13}
function callback(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('Element is in viewport')
    } else {
      console.log('Element is not in viewport')
    }
  })
}

const observer = new IntersectionObserver(callback)
const element = document.getElementById('my-element')
observer.observe(element)
```

## 【虚拟滚动加载原理及实现】

### 1. 普通滚动渲染

::: example
blogs/business/dom/virtualScroll/generalRender
:::

- 如下如可以看出，渲染花了很多时间：
  ![alt text](./virtualScroll/img/generalRenderPerformance.png)

为何两次 console.log 的结果时间差异巨大?

- 在 JS 的`Event Loop`中，当 JS 引擎所管理的执行栈中的事件以及所有微任务事件全部执行完后，**才会触发渲染线程对页面进行渲染**
- 第一个 console.log 的触发时间是在页面进行**渲染之前**，此时得到的间隔时间为 JS 运行所需要的时间
- 第二个 console.log 是放到 setTimeout 中的，它的触发时间是在**渲染完成**，在下一次 Event Loop 中执行的

### 2. 虚拟滚动

#### 原理

- 虚拟列表其实是按需显示的一种实现，即**只对可见区域进行渲染**，对非可见区域中的数据不渲染或部分渲染的技术，以此减少 DOM 操作的数量和提高渲染性能。
- 实现虚拟滚动
  - 监听滚动事件，了解当前滚动位置。
  - 根据滚动位置计算当前应该渲染哪些列表项（即在视口内的项目）。
  - 只渲染那些项目 ，并用占位符（比如一个空的 div）占据其它项目应有的位置，保持滚动条大小不变。
  - 当用户滚动时，重新计算并渲染新的项目。

![alt text](./virtualScroll/img/virtualScroll.png)

#### 列表项固定高度

::: example
blogs/business/dom/virtualScroll/virtualScrollListener
:::

#### 列表项动态高度

为了使页面平滑滚动，我们可以在可见区域的上方和下方渲染额外的项目，在滚动时给予一些缓冲，避免出现短暂的白屏现象。所以将屏幕分为三个区域：

- 可视区域上方：above
- 可视区域：screen
- 可视区域下方：below

![alt text](./virtualScroll/img/VirtualListDynamic.png)
::: example
blogs/business/dom/virtualScroll/virtualScrollListenerDynamic
:::
