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