## 【如何⽤ canvas 来做电影院选票功能】

- `canvas.getContext('2d')`：
  - getContext 方法指定参数 2d，表示该 canvas 节点用于生成 2D 图案（即平面图案）。
  - 如果参数是 webgl，就表示用于生成 3D 图像（即立体图案）
- canvas 画布提供了一个用来作图的平面空间，该空间的每个点都有自己的坐标，x 表示横坐标，y 表示竖坐标。
  - **原点(0, 0)位于图像左上角**，x 轴的正向是原点向右，y 轴的正向是原点向下。
- `fillRect(x, y, width, height)`方法用来绘制矩形，它的四个参数分别为矩形左上角顶点的 x 坐标、y 坐标，以及矩形的宽和高。
- `fillStyle` 属性用来设置矩形的填充色。
  ::: example
  blogs/css/html/moviesCanvas
  :::
