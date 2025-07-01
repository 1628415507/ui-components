<!--
 * @Description: CSS API
 * @Date: 2024-10-10 15:17:32
 * @LastEditTime: 2025-07-01 15:58:03
-->

## 【CSS 优先级问题】 ⚄

`important`>`style`> `id` >`class`
|选择器|权重|
|-----|-----|
|`important`| 无条件优先|
|`style`内联样式| 1000|
|`id`选择器 | 100|
|类选择器（`.class`）、伪类选择器（如`:hover`）、属性选择器（如[type="text"]`）| 10|
|标签选择器（如 div）、伪元素选择器（如`::before`）| 1|

## 【CSS 盒模型】

怪异盒模型和标准盒模型的区别 ⚄
| box-sizing |描述 | 总宽度 |
| --- | --- | --- |
| content-box | 标准盒模型 | `width+padding+border+margin` |
| border-box | 怪异盒模型 | width(width = padding + border)+ margin|

## [【CSS3 有哪些新特性】](https://blog.csdn.net/weixin_45086164/article/details/136957847)

### RGBA 和透明度

|           | 描述                                                    | 示例                       |
| --------- | ------------------------------------------------------- | -------------------------- |
| `rgba`    | 用于设置颜色，它的透明度，仅仅是调整**颜色的透明度**    | ` rgba(225, 225, 245,0.5)` |
| `opacity` | （0~1），设置**整个元素**（包括元素里的内容）的不透明度 | `opacity: 0.2`             |

### background

- 使用`background-position`时，需要把 `background-attachment` 属性设置为 "fixed"，才能保证该属性在 Firefox 和 Opera 中正常工作。
- background-origin(content-box/padding-box/border-box)

| 属性                                                                                   | 描述                                                                                                                                                       | 默认值          | 示例                      |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------- |
| `background-image `                                                                    | 图片地址                                                                                                                                                   |                 | `background-image: url()` |
| [`background-position`](https://www.w3school.com.cn/cssref/pr_background-position.asp) | 用来设置背景图像起始位置,<br/>背景图像如果要重复，将从这一点开始<br/>第一个值是水平位置，第二个值是垂直位置。<br/>左上角是 `0% 0%`。右下角是 `100% 100%`。 | `0% 0%`(左上角) | `center`/`14% 40%`        |
| `background-repeat`                                                                    | 是否循环填充                                                                                                                                               |                 | `no-repeat`               |
| `background-size`                                                                      | 放大倍数                                                                                                                                                   |                 | `215%`/`118% 252%`        |
| `background-origin`                                                                    | 放大倍数                                                                                                                                                   |                 | `215%`                    |

::: example
blogs/css/api/background
:::

### 其他

3.  word-wrap（单词换行）：`word-wrap：break-word`
4.  文字阴影（水平阴影，垂直阴影，模糊距离，阴影颜色）  
    `text-shadow： 5px 5px 5px #FF0000;`
5.  盒阴影：`box-shadow: 10px 10px 5px #888888`
6.  font-face 属性：定义自己的字体
7.  圆角（边框半径）：`border-radius`
8.  边框图片：`border-image: url(border.png) 30 30 round`

## 【伪元素和伪类的区别】

<!-- [ 伪元素和伪类的区别](http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/) -->

- 伪类与伪元素的区别在于：**有没有创建一个文档树之外的元素。**
- `:` 伪类的操作对象是文档树中**已有的元素**，如`:hover`、`:active`、`:focus`等,偏状态；
- `::` 伪元素则**创建**了一个文档外的元素。如：

| 伪元素           | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| `::before`       | ---                                                          |
| `::after`        | ---                                                          |
| `::first-line`   | 只能用于块级元素。用于设置附属元素的**第一个行内容**的样式。 |
| `::first-letter` | 只能用于块级元素。用于设置附属元素的**第一个字母**的样式。   |
| `::selection`    | 匹配鼠标**长按拖动选中**的内容。                             |
| `::placeholder`  | 用于设置 input 元素的 placeholder 内容的样式。               |

## 【CSS 动画】

### transition API

```scss
transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1);
```

- `transition: [property] [duration] [timing-function] [delay];`
  | transition |子属性|说明 |
  | ------------------------|---------------------- | ------------ |
  | `property` || 要过渡的 CSS 属性（如 opacity、transform）|
  | `duration`| |动画持续时间（如 1s 表示 1 秒） |
  | `timing-function`| `____________`| 动画的速度曲线（如 linear、ease、cubic-bezier(...)） |
  | |linear| |
  | |ease| |
  | |cubic-bezier|贝塞尔曲线（加速-减速）|
  | `delay` |`____________`|动画延迟时间（可选） |

### 示例

::: example
blogs/css/api/transition
:::

### 代码解析

```scss{6}
/* 渐入动画 */
.fade-in {
  opacity: 0; //初始状态，元素完全透明
  transform: translateY(40px); //向下偏移 40px
  // 当类名从 .fade-in 变为 .fade-in.show 时，opacity 和 transform 属性会在 1 秒内平滑过渡，形成向上淡入的动画。
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1);

  &.show {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- `opacity 1s cubic-bezier(0.4,0,0.2,1)`
  表示 opacity 属性在 1 秒内，按照自定义的贝塞尔曲线（加速-减速）变化。
- `transform 1s cubic-bezier(0.4,0,0.2,1)`
  表示 transform 属性（如平移、缩放等）也在 1 秒内，按照同样的速度曲线变化。
- `cubic-bezier(0.4,0,0.2,1)` 是什么？  
   这是一个自定义的缓动函数，常用于 Material Design 和苹果风格动画。
  它的效果是：**开始和结束都比较平滑，中间加速，比 ease 更自然**。

## IntersectionObserver API

- `new IntersectionObserver(callback, options)`
  | transition |子属性|说明 |
  | ---------------------------- |----------------------- | ------------ |
  | `callback` | `_____________________`| 回调函数，元素进入或离开视口时触发。参数 entries 是被监听元素的状态数组 |
  | |entries | 一个数组，每个元素是一个 IntersectionObserverEntry，包含被监听元素的可见性信息 |
  | |entries:isIntersecting |布尔值，表示元素是否与视口相交（即是否可见）|
  | |entries:intersectionRatio |元素可见部分的比例（0~1）|
  | `options` | `_____________________`| 配置对象。|
  | |threshold|阈值，取值 0~1，表示多少比例的元素进入视口时触发回调。 |
  | |root|指定监听的容器，默认是视口（null） |
  | |rootMargin|扩展或收缩 root 边界的距离，类似 CSS 的 margin |

- IntersectionObserver 用于监听元素（这里是 box1）是否进入视口。

### 代码解析

```js{4,7,13,15}
//docs\blogs\css\api\animation.ts
const show = ref([false, false, false, false, false])
let hasTriggered = false //是否已经触发过
// 监听元素是否进入视口
const observer = new IntersectionObserver(
  (entries) => {
    if (hasTriggered) return
    if (entries[0].isIntersecting) {
      hasTriggered = true
      // 顺序渐入
      show.value.forEach((_, i) => {
        setTimeout(() => {
          show.value[i] = true
        }, i * 400)
      }) // 每个区域延迟400ms
      observer.disconnect() //只触发一次（hasTriggered 标记），触发后断开监听（observer.disconnect()）。
    }
  },
  { threshold: 0.3 } //当 box1 至少有 30%（threshold: 0.3）进入视口时
)
// 监听第一个box进入视口
observer.observe(box1.value)
```

<!-- <figure> 标签规定独立的流内容（图像、图表、照片、代码等等）。

<figure> 元素的内容应该与主内容相关，同时元素的位置相对于主内容是独立的。如果被删除，则不应对文档流产生影响。 -->
