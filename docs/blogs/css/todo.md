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
-   css和js两种方式实现div右移1000px动画
-   单行截断css
-   transition、transform、translate的区别
-   parent元素宽高不定，实现scale固定宽高比始终为4：3
