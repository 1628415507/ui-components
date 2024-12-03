<!--
 * @Description:
 * @Date: 2024-08-23 16:04:10
 * @LastEditTime: 2024-10-31 09:35:35
-->

# [BFC（Block Formatting Contexts (块级格式化上下文)）](https://blog.csdn.net/DFF1993/article/details/80394150)

## 1.前置知识点

### Box: CSS 布局的基本单位

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此 Box 内的元素会以不同的方式渲染。让我们看看有哪些盒子：

- `block-level box`:display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
- `inline-level box`:display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context；
- `run-in box`: css3 中才有。

## 2. 什么是 BFC？⚄

- BFC 即 `Block Formatting Contexts` (块级格式化上下文)，它是一个**独立的渲染区域**，只有`Block-level box`参与， 它规定了内部的`Block-level` Box 如何布局，并且与这个区域外部毫不相干。
- 具有 BFC 特性的元素可以看做是隔离了的独立容器，**容器里面的子元素不会在布局上影响到外面的元素**;
- 它属于[CSS 布局模式](https://blog.csdn.net/dff1993/article/details/79897268)的**流动模型**。
  > 流动布局模型具有 2 个比较典型的特征：
  >
  > - 第一点，**块状元素**都会在所处的包含元素内**自上而下按顺序垂直延伸分布**，因为在默认状态下，块状元素的宽度都为 100%。
  > - 第二点，在流动模型下，**内联元素**都会在所处的包含元素内**从左到右水平分布显示**。

## 3. BFC 的特性/原理布局规则

::: example
blogs/css/bfc/block
:::

1. **垂直排列**：内部的 Box 会在`垂直方向`，一个接一个地放置,即 BFC 内部元素是垂直排列的
2. **margin 重叠**：Box 垂直方向的距离由 margin 决定。**属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠**，
   - 即块级标签之间竖直方向的 margin 会以**大**的为准
   - 如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。
3. 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
4. **拥有 `BFC` 特性的区域不会与 float Box 重叠**
5. 独立容器：BFC 是一个独立容器，容器里面的**子元素不会影响到外面的元素**
6. 计算 BFC 的高度时，**浮动元素也参与计算**
7. 元素的类型和`display属性，决定了这个Box的类型`。不同类型的 Box 会参与不同的`Formatting Context`。

## 4. 如何创建 BFC

只要元素满足下面**任一条件**即可触发 BFC 特性：

- body 根元素
- 浮动元素：（元素的 float 不是 none）
- 绝对定位元素：position (`absolute`、`fixed`)
- display 为 `inline-block`、`table-cells`、`flex/grid` 、`table-caption`
- overflow 除了 visible 以外的值 (`hidden`、`auto`、`scroll`)

## 5. [BFC 常见应用](https://blog.csdn.net/DFF1993/article/details/80394150)

### （1）阻止非浮动元素被浮动元素覆盖

- 由于块级元素 A 发生了浮动，所以和未发生浮动的块级元素 B 不在同一层内，所以会发生 div 遮挡问题。
- 可以给元素 B 添加`overflow: hidden`，触发 BFC 来解决遮挡问题。
- 原理
  > - BFC 的特性 3：每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
  > - BFC 的特性 4：BFC 的区域不会与 float box 重叠。

::: example
blogs/css/bfc/demo1
:::

### （2）清除浮动引起的高度塌陷

- 高度塌陷问题，在通常情况下父元素的高度会被子元素撑开，而如果子元素为浮动元素父元素会发生高度坍塌，上下边界重合，这时就可以用 BFC 来清除浮动了。
- 原理
  > BFC 的特性 6：计算 BFC 的高度时，**浮动元素也参与计算**

::: example
blogs/css/bfc/demo2
:::

### （3）阻止外边距 margin 折叠

- margin 塌陷问题：在标准文档流中，块级标签之间竖直方向的 margin 会以大的为准，这就是 margin 的塌陷现象。
- 可以用 `overflow：hidden` 产生 bfc 来解决。如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。
- 原理
  > BFC 的特性 2：Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠

::: example
blogs/css/bfc/demo3
:::

### ~~（4）避免多列布局由于宽度计算四舍五入而自动换行~~

## 6. [常用的 BFC 清除浮动——clearfix](https://blog.csdn.net/weixin_41041379/article/details/81871980)

> - `clear:both` 是一个 CSS 属性，用于解决浮动元素对块级元素的**重叠问题**。
> - `clear:both` 属性的作用是为当前元素**指定一个高度**，**该高度足以容纳所有浮动元素**。这确保了当前元素下方没有浮动元素重叠。
> - `clear:both` **只能清除当前元素上方的浮动元素**。如果需要清除多个元素上的浮动元素，则需要在每个元素上使用 clear:both 属性

- 原理：通过 CSS **伪元素**在容器的内部元素**之后**添加一个看不见的空格`“ ”`或点`“.”` ，并且设置 clear 属性清除浮动。

1. 加入一个空元素：`content: ""`
1. 可见度设为隐藏。仍然占据空间，只是看不到而已：`visibility: hidden`
1. 加入的这个元素转换为块级元素：`display: block`
1. 清除左右两边浮动：`clear: both; `

```css{2,5}
 /*在类名为“clearfix”的元素内最后面加入内容；*/
 .clearfix:after {
  content: ''; /*内容为“.”就是一个英文的句号而已。也可以不写。*/
  display: block; /*加入的这个元素转换为块级元素。*/
  clear: both; /*清除左右两边浮动。*/
  visibility: hidden; /*可见度设为隐藏。仍然占据空间，只是看不到而已*/
  height: 0; /*高度为0； */
  font-size: 0; /*字体大小为0;*/
}
```

- 浮动的框可以向左或向右移动，直到它的外边缘碰到包含框或**另一个浮动框**的边框为止  
  ::: example
  blogs/css/bfc/clearfix
  :::
