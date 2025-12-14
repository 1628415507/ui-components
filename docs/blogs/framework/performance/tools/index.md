<!--
 * @Description:
 * @Date: 2025-07-01 17:55:08
 * @LastEditTime: 2025-07-22 13:57:35
-->

[使用 Chrome Performance 进行性能调优](https://www.bilibili.com/video/BV1Pr4y1N7QZ/?spm_id_from=333.337.search-card.all.click&vd_source=9d75580d0b23d1137d56e03a996ac726)
## 认识Performance
- 快捷键`Ctrl+E`开始录制
- Frames:FPS
- Expericence:项目中交互不合理的地方

### 队列任务
- 计时是从点击开始录制开始算
  ![alt text](./img/image.png)
  ![alt text](./img/image-1.png)
- **Task 为当前队列任务**（第二个 Task 为定时器）
  ![alt text](./img/image-3.png)
  ![alt text](./img/Task.png)
  anonymous：匿名函数
- 重排会体现在 Main 中   
  重排会体现在 Main 当中(一次事件循环中，只会触发一次重排(大概率))
  ![alt text](./img/image-4.png)

### eventLoop

![alt text](./img/eventLoop-code.png)
![alt text](./img/eventLoop.png)

::: example
blogs/framework/performance/tools/eventLoop
:::


![alt text](./img/image-2.png)

### callTree
- callTree记录任务的时间树，可以分析出哪个任务耗时长
![alt text](./img/image-5.png)
- 数组任务
![alt text](./img/image-6.png)
![alt text](./img/image-7.png)

## 实战——列表复选框卡顿优化
### 示例页面
![alt text](./img/851b18e87adfa74876fca042bce7d71.png)
- 问题：勾选复选框后卡顿很久才勾选上
- 排查
1. performance查看耗时时间
  - 按下勾选框到出现打勾状态耗时快2s
![alt text](./img/05a0cd472c5b0b58db14af7b8258e7e.png)
2. 控制台查看
  - 控制台看出可能是因为勾选触发页面渲染引起的卡顿
![alt text](./img/c015d7caf19c5d1800ad2b9d164b8e6.png)
3. 找到相关代码
  - 勾选事件触发重新赋值，导致页面渲染引起卡顿
![alt text](./img/8de657d83d6e1801445d4704ed07637.png)
4. 处理
  - 将该部分代码调整位置，并改成绝对定位处理
![alt text](./img/8de657d83d6e1801445d4704ed07637-1.png)
5. 疑点：重新赋值引起的渲染范围其实很小，渲染涉及的代码也不对，但不知道为什么会影响卡顿这么久(猜测可能是和Dev表格的问题有关)
![alt text](./img/e2812ac065c1b28f611dffd7e979b79.png)
![alt text](./img/cea231e6bc711a90e9850a7fd1afae8.png)
### 优化前后对比
- 优化前：2s多
![alt text](./img/20939e5d13625675ce81400537bdcf8.png)
- 优化后：59ms
![alt text](./img/a63f7d0886e6d3c5188ef3d999437b2.png)