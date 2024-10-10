<!--
 * @Description:
 * @Date: 2024-10-10 15:17:32
 * @LastEditTime: 2024-10-10 17:24:25
-->

## css 优先级问题 ⭐⭐⭐⭐⭐

- important 无条件优先
- 内联样式 1000
- id 选择器 100
- class、伪类、属性 10
- 标签 伪元素 1

## 说一下盒模型

怪异盒模型和标准盒模型的区别 ⭐⭐⭐⭐⭐
| box-sizing |描述 | 总宽度 |
| --- | --- | --- |
| content-box | 标准盒模型 | width+padding+border+margin |
| border-box | 怪异盒模型 | width（width 包含 padding + border）+margin|

## 伪元素和伪类的区别

<!-- [ 伪元素和伪类的区别](http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/) -->

- 伪类与伪元素的区别在于：**有没有创建一个文档树之外的元素。**
- `:` 伪类的操作对象是文档树中**已有的元素**，如`:hover`、`:active`、`:focus`等
- `::` 伪元素则**创建**了一个文档外的元素。如：

| 伪元素           | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| `::before`       | ---                                                          |
| `::after`        | ---                                                          |
| `::first-line`   | 只能用于块级元素。用于设置附属元素的**第一个行内容**的样式。 |
| `::first-letter` | 只能用于块级元素。用于设置附属元素的**第一个字母**的样式。   |
| `::selection`    | 匹配鼠标**长按拖动选中**的内容。                                 |
| `::placeholder`  | 用于设置 input 元素的 placeholder 内容的样式。               |
