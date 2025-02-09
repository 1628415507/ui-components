## 【前端如何做⻚⾯主题⾊切换】

### 1. 使⽤ CSS ⾃定义属性

- `Document.documentElement` 返回 document 的根元素（例如，HTML 文档的 `<html>` 元素）。
- 通过`[data-theme='dark']`：定义 css 变量 `theme='dark'`暗色主题下的 css 变量
- 通过`document.documentElement.dataset`动态获取和修改变量 theme

```js{1,4}
// 切换theme变量的值
root.dataset.theme = 'light' //'dark'
// dark主题下的css样式
[data-theme='dark'] {
  --theme-bg: #1e2a34; /* 暗⿊主题⾊ */
  --theme-text: #04f5e9; /* 暗⿊主题⽂本颜⾊ */
}
```

::: example
blogs/css/theme/rootDataset
:::

### 2. 使⽤媒体查询⾃动应⽤暗⿊模式

- 某些现代浏览器⽀持 CSS 媒体查询 `prefers-color-scheme` 。可以使⽤这个特性来 **⾃动根据⽤⼾的系统设置** 应⽤暗⿊模式或明亮模式，⽽⽆须 JavaScript：
- `prefers-color-scheme: dark`：系统为深色模式
- `prefers-color-scheme: light`：系统为浅色模式

```scss{1}
@media (prefers-color-scheme: dark) {
//@media (prefers-color-scheme: light) {
  .theme-page {
    background-color: #1e2a34;
  }
}
```

::: example
blogs/css/theme/prefersColorScheme
:::

### 3. 使⽤ CSS 类切换

<!-- ## 如何解决高分辨率屏幕下图片模糊的问题？

回答：高分辨率屏幕（如 Retina 屏幕）上的图片会显示模糊。解决方法是使用 srcset 属性为不同分辨率的设备提供不同的图片资源。例如，通过 srcset="image-1x.jpg 1x, image-2x.jpg 2x" 来为常规屏幕和高清屏幕提供不同清晰度的图片。 -->

## 【常见的浏览器兼容问题及解决方案】

### 1. 不同浏览器的默认 margin 和 padding 不一致

- 不同浏览器对 CSS 属性的解析存在差异，导致页面布局在不同浏览器中显示不一致 ‌
- 在 style 样式里添加如下代码,重置默认样式

```css
<style>
*{
   //在VSCode编辑器中，输入：m0+p0，按enter键就能快速补全
   margin:0;
   padding:0;
 }
 </style>
```

### 2. ‌event.srcElement 属性差异

不同浏览器对 event.srcElement 的支持不同。IE 下，event 对象有 srcElement 属性，但是没有 target 属性；Firefox 下，event 对象有 target 属性，但是没有 srcElement 属性。

```js
srcObj = event.srcElement || event.target
```

<!--

。
‌图片的默认间距不一致‌：图片在不同浏览器中的间距处理可能不同，影响页面布局的统一性‌
1
。
‌获取视口的宽高‌：不同浏览器获取视口宽高的方法可能不同，需要使用不同的API或方法来实现兼容‌
1
。
‌SVG和Canvas的支持差异‌：老版本的IE浏览器不支持SVG和Canvas，需要在代码中进行特殊处理‌
1
。
‌透明度处理差异‌：IE9以下版本不支持opacity属性，需要通过其他方式实现透明效果‌
1
。
‌文字大小差异‌：不同浏览器对文字大小的解析可能存在差异，影响页面的整体美观和阅读体验‌
1
。
‌事件绑定差异‌：例如IE9以下版本不支持addEventListener，需要通过其他方式绑定事件‌

‌cursor样式差异‌：如cursorhand在非Windows系统上可能不显示手型图标‌

‌const关键字支持差异‌：老版本IE不支持const关键字，需要使用var替代‌

‌innerText属性差异‌：Firefox不支持innerText属性，需要使用其他方法获取文本内容‌

‌获取鼠标在页面上的位置差异‌：不同浏览器获取鼠标位置的方法不同，需要使用不同的API来实现‌

‌获取键盘事件的键值差异‌：不同浏览器获取键盘事件键值的方法不同，需要使用不同的方法来实现‌

‌min-height属性支持差异‌：IE6不支持min-height属性，需要通过其他方式实现高度限制‌
1
。
‌CSS3属性支持差异‌：IE浏览器对一些CSS3属性的支持不如其他现代浏览器，需要在代码中进行特殊处理‌
1
。
‌解决浏览器兼容性的策略和方法包括‌：

‌使用兼容性工具和库‌：如jQuery、Modernizr等工具可以帮助检测浏览器特性并提供兼容性解决方案‌
2
。
‌CSS Hack和条件注释‌：通过特定的CSS hack和条件注释来确保在不同浏览器中正确显示页面元素‌
2
。
‌渐进增强和优雅降级‌：渐进增强先为低版本浏览器构建基本功能，然后再为高级浏览器添加增强功能；优雅降级则先为所有浏览器构建完整功能，然后针对低版本浏览器进行兼容处理‌
2
。 -->
