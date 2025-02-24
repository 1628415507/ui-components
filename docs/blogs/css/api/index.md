<!--
 * @Description:
 * @Date: 2024-10-10 15:17:32
 * @LastEditTime: 2024-10-11 16:22:38
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

1.  RGBA 和透明度

|           | 描述                                                    | 示例                       |
| --------- | ------------------------------------------------------- | -------------------------- |
| `rgba`    | 用于设置颜色，它的透明度，仅仅是调整**颜色的透明度**    | ` rgba(225, 225, 245,0.5)` |
| `opacity` | （0~1），设置**整个元素**（包括元素里的内容）的不透明度 | `opacity: 0.2`             |

2.  background
    - 使用`background-position`时，需要把 `background-attachment` 属性设置为 "fixed"，才能保证该属性在 Firefox 和 Opera 中正常工作。
    - background-origin(content-box/padding-box/border-box)
      |属性 | 描述 |默认值| 示例 |
      | --------- | ----------- | ------------------------------------------------ | -------------------------- |
      | `background-image ` | 图片地址| |`background-image: url()` |
      | [`background-position`](https://www.w3school.com.cn/cssref/pr_background-position.asp) |用来设置背景图像起始位置,<br/>背景图像如果要重复，将从这一点开始<br/>第一个值是水平位置，第二个值是垂直位置。<br/>左上角是 `0% 0%`。右下角是 `100% 100%`。 |`0% 0%`(左上角)| `center`/`14% 40%`|
      | `background-repeat` | 是否循环填充| | `no-repeat` |
      | `background-size` |放大倍数| |`215%`/`118% 252%` |
      | `background-origin` |放大倍数| | `215%` |

::: example
blogs/css/api/background
:::

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
