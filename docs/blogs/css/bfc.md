<!--
 * @Description:
 * @Date: 2024-08-23 16:04:10
 * @LastEditTime: 2024-10-12 16:49:44
-->

# [BFC（Block Formatting Contexts (块级格式化上下文)）](https://blog.csdn.net/DFF1993/article/details/80394150)

## 1. 什么是 BFC？⚄
- BFC 即 `Block Formatting Contexts` (块级格式化上下文)，
- 它属于[CSS布局模式](https://blog.csdn.net/dff1993/article/details/79897268)的**流动模型**。
> 流动布局模型具有2个比较典型的特征：
> - 第一点，**块状元素**都会在所处的包含元素内**自上而下按顺序垂直延伸分布**，因为在默认状态下，块状元素的宽度都为100%。
> - 第二点，在流动模型下，**内联元素**都会在所处的包含元素内**从左到右水平分布显示**。
- `BFC`是一个独立的渲染区域，具有 BFC 特性的元素可以看做是隔离了的独立容器，**容器里面的子元素不会在布局上影响到外面的元素**;

## 2. BFC 的特性/原理布局规则

::: example
blogs/css/bfc/block
:::

1. 内部的 Box 会在`垂直方向`，一个接一个地放置,即 BFC 内部元素是垂直排列的
2. Box**垂直方向的距离由 margin 决定**。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠（如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。）
3. 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
4. BFC 区域不会与 float box 重叠
5. BFC 是一个独立容器，容器里面的**子元素不会影响到外面的元素**
6. 计算 BFC 的高度时，**浮动元素也参与计算**
7. 元素的类型和`display属性，决定了这个Box的类型`。不同类型的 Box 会参与不同的`Formatting Context`。

## 3. 如何创建 BFC

只要元素满足下面**任一条件**即可触发 BFC 特性：

- body 根元素
- 浮动元素：（元素的 float 不是 none）
- 绝对定位元素：position (`absolute`、`fixed`)
- display 为 `inline-block`、`table-cells`、`flex/grid` 、`table-caption`
- overflow 除了 visible 以外的值 (`hidden`、`auto`、`scroll`)

## 4. [BFC 常见应用](https://blog.csdn.net/DFF1993/article/details/80394150)

### （1）阻止元素被浮动元素覆盖

- 由于块级元素 A 发生了浮动，所以和未发生浮动的块级元素 B 不在同一层内，所以会发生 div 遮挡问题。
- 可以给元素 B 添加`overflow: hidden`，触发 BFC 来解决遮挡问题。
- 原理
  > - BFC 的特性 3：每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。  
  > - BFC 的特性 4：BFC 的区域不会与 float box 重叠。

::: example
blogs/css/bfc/demo1
:::

### （2）清除浮动

- 高度塌陷问题，在通常情况下父元素的高度会被子元素撑开，而如果子元素为浮动元素父元素会发生高度坍塌，上下边界重合，这时就可以用 BFC 来清除浮动了。
- 原理
  > BFC 的特性 6：计算 BFC 的高度时，浮动元素也参与计算

::: example
blogs/css/bfc/demo2
:::

### （3）阻止外边距折叠
- margin 塌陷问题：在标准文档流中，块级标签之间竖直方向的 margin 会以大的为准，这就是 margin 的塌陷现象。
- 可以用 overflow：hidden 产生 bfc 来解决。如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。
- 原理
  > BFC 的特性2：Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠


::: example
blogs/css/bfc/demo3
:::
###  (4)避免多列布局由于宽度计算四舍五入而自动换行

## 5. 常用的 BFC 清除浮动——clearfix
1. 加入一个空元素：`content: ""`
1. 可见度设为隐藏。仍然占据空间，只是看不到而已：`visibility: hidden`
1. 加入的这个元素转换为块级元素：`display: block`
1. 清除左右两边浮动：`clear: both; `

```css
.clearfix:after {
  /*在类名为“clearfix”的元素内最后面加入内容；*/
  content: ''; /*内容为“.”就是一个英文的句号而已。也可以不写。*/
  display: block; /*加入的这个元素转换为块级元素。*/
  clear: both; /*清除左右两边浮动。*/
  visibility: hidden; /*可见度设为隐藏。仍然占据空间，只是看不到而已*/
  height: 0; /*高度为0； */
  font-size: 0; /*字体大小为0;*/
}
```
