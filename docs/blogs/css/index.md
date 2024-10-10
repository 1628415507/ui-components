<!--
 * @Description: 
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-10 15:39:41
-->
<!--
 * @Description: 
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-10 15:22:47
-->
# [CSS专栏](https://www.kancloud.cn/surahe/front-end-notebook/482352)
---
highlight: a11y-dark
theme: simplicity-green
---

## 知识点罗列
- [ ]  [说一下BFC（Block Formatting Contexts (块级格式化上下文)）](https://juejin.cn/post/7113935113091547167/)
- [ ] [CSS垂直居中的方案](https://juejin.cn/post/7113947987537035272/)
- [ ] [三栏式布局方案](https://juejin.cn/post/7255483407559131195)


## CSS3有哪些新特性？
1.  RGBA和透明度
0.  - background-image 
    - background-origin(content-box/padding-box/border-box) 
    - background-size 
    - background-repeat
0.  word-wrap（单词换行）：`word-wrap：break-word`
0.  文字阴影（水平阴影，垂直阴影，模糊距离，阴影颜色）  
    `text-shadow： 5px 5px 5px #FF0000;`
0.  盒阴影：`box-shadow: 10px 10px 5px #888888`
0.  font-face属性：定义自己的字体
0.  圆角（边框半径）：`border-radius`
0.  边框图片：`border-image: url(border.png) 30 30 round`

## 吸顶效果  

## 7. 什么是DOM事件流？什么是事件委托⭐⭐⭐⭐⭐
### （1）DOM事件流，分为三个阶段
- 捕获阶段
- 目标阶段
- 冒泡阶段
在addeventListener()的第三个参数(useCapture)设为true，就会在捕获阶段运行，默认是false冒泡

### （2）事件委托  
利用冒泡原理（**子向父一层层穿透**），把事件绑定到父元素中，以实现事件委托

### （3）事件冒泡和事件捕捉的区别⭐⭐⭐⭐⭐
| 区别 | 事件（向上）冒泡 |事件（向下）捕捉 |
| --- | --- | --- |
| 执行顺序 | **从下至上**（儿子至祖宗）执行 | **从上至下**（祖宗到儿子）执行 |
| 属性设置 | 在addEventListener中的第三属性设置为false（默认） | 在addEventListener中的第三属性设置为true|
## 8. CSS语法
-   [position的几个属性和含义](https://www.runoob.com/cssref/pr-class-position.html)
- flex布局
  - [Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
  - [Flex 布局教程：实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)
  -   flex：1
-----
-   css和js两种方式实现div右移1000px动画


-   单行截断css

-   transition、transform、translate的区别

-   如何画一条 0.5px 的边框

    -   [怎么画一条0.5px的边（更新）](https://juejin.cn/post/6844903582370643975 "https://juejin.cn/post/6844903582370643975")


-   parent元素宽高不定，实现scale固定宽高比始终为4：3





-   响应式布局方案

    -   [前端响应式布局原理与方案（详细版）](https://juejin.cn/post/6844903814332432397 "https://juejin.cn/post/6844903814332432397")


-   如何提高动画的渲染性能

    -   [这样使用GPU动画](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cplus.com%2Fanimation%2Fgpu-animation-doing-it-right.html "https://www.w3cplus.com/animation/gpu-animation-doing-it-right.html")
----
> 参考链接：https://juejin.cn/post/7013953652578582558\

