# 前端水印

## [页面加水印实现方案](https://zhuanlan.zhihu.com/p/374734095)

### 1. 重复的 dom 元素覆盖实现

- 在页面上覆盖一个`position:fixed`的 div 盒子，盒子透明度设置较低;
- 设置`pointer-events: none`样式实现点击穿透，禁止鼠标选取水印元素
- 在盒子内通过 js 循环生成水印 div，每个水印 div 内展示一个要显示的水印内容
  ::: example
  blogs/business/watermark/dom
  :::
- 缺点：这种方案需要要在 js 内循环创建多个 dom 元素，既不优雅也影响性能

### 2. canvas 输出背景图

- 在页面上覆盖一个固定定位的盒子，然后创建一个 canvas 画布，绘制出一个水印区域，
- 将这个水印通过 toDataURL 方法输出为一个图片，将这个图片设置为盒子的背景图，
- 通过 `backgroud-repeat：repeat`样式实现填满整个屏幕的效果，简单实现的代码。
  默认情况下,背景图片会在水平和垂直方向上重复出现,直到填满整个页面
  ::: example
  blogs/business/watermark/canvas
  :::

### 3. svg 输出背景图

- canvas 的兼容性略好于 svg
  ::: example
  blogs/business/watermark/svg
  :::

## Web ⽹⻚如何禁⽌别⼈移除⽔印

- `MutationObserver` 可以观察 DOM 树的变化，并在变化发⽣时触发回调函数。
- 但是 MutationObserver 只能监测到诸如属性改变、子结点变化等，对于自己本身被删除，是没有办法监听的，这里可以通过监测父结点来达到要求
- 可以在回调函数中使用`mutation.removedNodes`检查是否有⽔印被删除，
- MutationObserver API 是现代浏览器提供的功能，在⽼旧的浏览器中可能不⽀持。因此，在实际使⽤时，需要注意对浏览器的兼容性进⾏测试和处理。
  ::: example
  blogs/business/watermark/observerWatermark
  :::
