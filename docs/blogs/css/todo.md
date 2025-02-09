<!--
 * @Description:
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-11 15:45:07
-->
<!--
 * @Description:
 * @Date: 2024-10-09 18:05:54
 * @LastEditTime: 2024-10-10 15:22:47
-->

# [CSS 专栏](https://www.kancloud.cn/surahe/front-end-notebook/482352)

## 学习网址

- [常见的浏览器兼容问题及解决方案](https://blog.csdn.net/m_sy530/article/details/109248142)
- [三栏式布局方案](https://juejin.cn/post/7255483407559131195)
- [前端响应式布局原理与方案（详细版）](https://juejin.cn/post/6844903814332432397 'https://juejin.cn/post/6844903814332432397')
- 如何提高动画的渲染性能
  - [这样使用 GPU 动画](https://link.juejin.cn?target=https%3A%2F%2Fwww.w3cplus.com%2Fanimation%2Fgpu-animation-doing-it-right.html 'https://www.w3cplus.com/animation/gpu-animation-doing-it-right.html')

## 吸顶效果

## 7. 什么是 DOM 事件流？什么是事件委托 ⚄

### （1）DOM 事件流，分为三个阶段

- 捕获阶段
- 目标阶段
- 冒泡阶段
  在 addeventListener()的第三个参数(useCapture)设为 true，就会在捕获阶段运行，默认是 false 冒泡

### （2）事件委托

利用冒泡原理（**子向父一层层穿透**），把事件绑定到父元素中，以实现事件委托

### （3）事件冒泡和事件捕捉的区别 ⚄

| 区别     | 事件（向上）冒泡                                     | 事件（向下）捕捉                            |
| -------- | ---------------------------------------------------- | ------------------------------------------- |
| 执行顺序 | **从下至上**（儿子至祖宗）执行                       | **从上至下**（祖宗到儿子）执行              |
| 属性设置 | 在 addEventListener 中的第三属性设置为 false（默认） | 在 addEventListener 中的第三属性设置为 true |

## 8. CSS 语法

- css 和 js 两种方式实现 div 右移 1000px 动画
- 单行截断 css
- transition、transform、translate 的区别
- parent 元素宽高不定，实现 scale 固定宽高比始终为 4：3
