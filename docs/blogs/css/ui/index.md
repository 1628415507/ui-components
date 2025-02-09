<!--
 * @Description:
 * @Date: 2024-10-11 18:10:58
 * @LastEditTime: 2024-10-31 09:40:41
-->

## [【垂直居中的实现方式】](https://juejin.cn/post/7113947987537035272/)

1. 已知子元素具体宽高
   - 父元素**设置高度**+相对定位：
   - 子元素绝对定位：
   - 子元素 top、left： 50%
   - 子元素 margin-left、margin-top：自身长度的一半
2. 未知子元素具体宽高：`flex` 布局

```scss
display: flex;
justify-content: center; /* 沿着X轴水平居中 */
align-items: center; /* 沿着y轴水平居中 */
```

3. 未知子元素具体宽高：`transform: translate(-50%, -50%);`
   - `translate(x, y)`：平移元素沿 x 和 y 轴。
     - x>0: 向右移动，<0 向左移动
     - y>0: 向下移动，<0 向上移动
   - `translate` 移动的距离是**参考自身**，如果自身宽度是 300px，那么 50%就是 150px,高度也是同样的道理。
     ::: example
     blogs/css/ui/middle
     :::

## 【用 CSS 实现三角符号】

记忆口诀：盒子宽高均为零，三面边框皆透明。

```scss{3,4,5}
.triangle:after {
  content: ' ';
  width: 0px; // 宽高均为零
  height: 0px; // 宽高均为零
  border: 20px solid transparent;// 三面边框皆透明
  border-top: 20px solid var(--theme-color);// 三角形的那头有颜色
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

```

```
