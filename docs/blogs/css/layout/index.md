<!--
 * @Description:
 * @Date: 2025-02-10 12:27:23
 * @LastEditTime: 2025-02-10 17:02:26
-->

## 【Flex 弹性布局】

- 所有浏览器支持
- [Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [Flex 布局教程：实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
- flex：1
- 设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。

### flex container 属性

| 属性            | 可选值                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| flex-direction  | `row(默认)`/`row-reverse`/`column`/`column-reverse`                                                                                                |
| flex-wrap       | `nowrap(默认)`/`wrap`/`wrap-reverse(换行，第一行在下方)`                                                                                           |
| flex-flow       | `flex-flow: <flex-direction>  <flex-wrap>`<br/>flex-direction 和 flex-wrap 的简写形式                                                              |
| justify-content | `flex-start(默认)`/`flex-end`/`center`/`space-between`/`space-around`                                                                              |
| align-items     | `stretch(默认,如果项目未设置高度或设为auto，将占满整个容器的高度)`<br/>`flex-start`/`flex-end`/`center`/`baseline(项目的第一行文字的基线对齐)`    |
| align-content   | 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用<br/>`flex-start`/`flex-end`/`center`/`space-between`/`space-around`/`stretch(默认)` |

### flex item 属性

| 属性        | 可选值                                                                                                    |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| order       | 数值越小，排列越靠前，默认为 0                                                                            |
| flex-grow   | 定义项目的**放大比例**，默认为 0，即如果存在剩余空间，也不放大，<br/>如果属性都为 1，则它们将**等分**剩余空间 |
| flex-shrink | 定义项目的**缩小比例**，默认为 1，即如果空间不足，该项目将缩小，<br/>0 则不缩小                           |
| flex-basis  | 定义了在分配多余空间之前，项目占据的主轴空间（main size）<br/>它的默认值为 auto，即项目的本来大小         |
| flex        | flex 属性是 `flex-grow`, `flex-shrink`和 `flex-basis` 的简写，默认值为`0 1 auto`。<br/>后两个属性可选。              |
|align-self|`auto`/`flex-start`/`flex-end`/`center`/`baseline`/`stretch`<br/>属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。<br/>默认值为auto，表示继承父元素的align-items属性，<br/>如果没有父元素，则等同于stretch。|
## [【Grid 网格布局】](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

- `grid-template-columns: repeat(5, minmax(150px, 1fr))`：每行五等分，最小宽度 150
- `gap:行间距 列间距` ：间距
  ::: example
  blogs/css/layout/grid
  :::

## 【Grid 布局与 Flex 布局的区别】

- Flex 布局是**轴线布局**，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。
- Grid 布局则是**将容器划分成"行"和"列"**，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。
