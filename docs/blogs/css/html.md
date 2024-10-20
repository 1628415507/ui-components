## HTML5 新特性、语义化

### 概念

HTML5 的语义化指的是`合理正确的使用语义化的标签来创建页面结构`。(正确的标签做正确的事)

### 语义化标签

| 标签    | 描述                                                                       |
| ------- | -------------------------------------------------------------------------- |
| header  | 用于定义文档或文档节的**头部**，通常包含标题、导航链接和其他头部内容       |
| footer  | 用于定义文档或文档节的**尾部**，通常包含版权信息、作者信息和其他尾部内容。 |
| nav     | 用于定义导航**链接**的集合                                                 |
| main    | 定义页面的**主要内容**                                                     |
| article | 用于定义独立的内容块，如博客**文章**、新闻报道等                           |
| section | 用于定义文档中的节，表示文档的**某个区域或功能块**                         |
| aside   | 定义与页面主内容 minor 的内容 ,如**侧边栏**                                |

::: example
blogs/html/html5Layput
:::

### 语义化的优点
- 在没 CSS 样式的情况下，页面整体也会呈现很好的**结构**效果
- 代码结构清晰，易于阅读，
- 利于开发和维护，方便其他设备解析（如屏幕阅读器）根据语义渲染网页。
- 有利于搜索引擎优化（**SEO**），搜索引擎爬虫会根据不同的标签来赋予不同的权重
