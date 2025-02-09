## 【Flex 弹性布局】

- 所有浏览器支持
- [Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [Flex 布局教程：实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
- flex：1

## [【Grid 网格布局】](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

- `grid-template-columns: repeat(5, minmax(150px, 1fr))`：每行五等分，最小宽度 150
- `gap:行间距 列间距` ：间距
  ::: example
  blogs/css/layout/grid
  :::

## 【Grid 布局与 Flex 布局的区别】

- Flex 布局是**轴线布局**，只能指定"项目"针对轴线的位置，可以看作是**一维布局**。
- Grid 布局则是**将容器划分成"行"和"列"**，产生单元格，然后指定"项目所在"的单元格，可以看作是**二维布局**。
