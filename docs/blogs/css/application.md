## 【前端如何做⻚⾯主题⾊切换】

### 1. 使⽤ CSS ⾃定义属性

- `Document.documentElement` 返回 document 的根元素（例如，HTML 文档的 `<html>` 元素）。
- 通过`[data-theme='dark']`：定义 css 变量 `theme='dark'`暗色主题
- 通过`document.documentElement.dataset`动态获取和修改变量 theme
  ::: example
  blogs/css/theme/rootDataset
  :::

### 2. 使⽤媒体查询⾃动应⽤暗⿊模式

- 某些现代浏览器⽀持 CSS 媒体查询 `prefers-color-scheme` 。可以使⽤这个特性来 **⾃动根据⽤⼾的系统设置** 应⽤暗⿊模式或明亮模式，⽽⽆须 JavaScript：
- `prefers-color-scheme: dark`：系统为深色模式
- `prefers-color-scheme: light`：系统为浅色模式

  ::: example
  blogs/css/theme/prefersColorScheme
  :::

### 3. 使⽤ CSS 类切换
