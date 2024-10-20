## 用 CSS 实现三角符号

记忆口诀：盒子宽高均为零，三面边框皆透明。

```css
div:after {
  position: absolute;
  width: 0px;
  height: 0px;
  content: ' ';
  border-right: 100px solid transparent;
  border-top: 100px solid #ff0;
  border-left: 100px solid transparent;
  border-bottom: 100px solid transparent;
}
```

::: example
blogs/css/ui/triangle
:::

## 滚动条样式设置

- `::-webkit-scrollbar`：滚动条整体样式
- `::-webkit-scrollbar-track`：滚动条轨道样式
- `::-webkit-scrollbar-thumb`：滚动条滑块样式
  ::: example
  blogs/css/ui/scrollbar
  :::

## [画一条 0.5px 的边](https://juejin.cn/post/6844903582370643975)

- 1.直接设置 0.5（Chrome 不支持，把 0.5px 四舍五入变成了 1px）
- 2.缩放：设置 1px，然后`scale(0.5)`
- 3.用线性渐变 linear-gradient:渐变的角度从下往上，从白色#fff 渐变到黑色#000，而且是线性的
- 4.使用 svg
- 5.使用 boxshadow
  ::: example
  blogs/css/ui/halfLine
  :::
