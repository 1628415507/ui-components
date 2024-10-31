<!--
 * @Description: 
 * @Date: 2024-10-30 18:10:00
 * @LastEditTime: 2024-10-31 09:54:18
-->
## H5 如何解决移动端适配问题

### 1. [使⽤ viewport 标签](https://blog.csdn.net/qq_39454432/article/details/138488494)

通过设置 viewport 标签的 meta 属性，来控制⻚⾯的缩放⽐例和宽度，以适配不同的设备。例如：

- `width=device-width` 表⽰设置 viewport 的宽度为设备宽度，
- `initial-scale=1.0` 表⽰初始缩放⽐例为 1
- 当 width 不 F 为 device-width，且和 initial-scale 同时出现时,浏览器会取两个中值最大的那个

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0"
```

### 2.使⽤ CSS3 的媒体查询

```css
@media screen and (max-width: 640px) {
  /* 样式 */
}
```

### 3.使⽤ rem 单位

- rem 是相对长度单位。是相对于根元素（即 `html` ）的字体大小 font-size 而言的
- 例如，如果 HTML 的字体大小设置为 16px，那么 1rem 就等于 16px。
  ::: example
  blogs/css/flexible/rem
  :::

### 4. 使⽤ flexible 布局⽅案

- 引入 flexible 库：`import 'lib-flexible/flexible.js'`
- flexible.js 会在⻚⾯加载时动态计算根节点的字体⼤⼩，并将 px 转化为 rem 单位，就可以正常使用 px 了
