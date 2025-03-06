# 性能优化

## 【白屏优化】

前端白屏优化的主要方案包括以下几个方面 ‌

- 路由懒加载 ‌
- 组件懒加载
- 优化资源加载
- 使用骨架屏技术

## 【性能优化方面】

### 资源优化

#### 压缩资源

- 压缩 CSS 和 JavaScript
  > 使用工具如 Webpack、Gulp 或 Rollup 等，结合插件如 cssnano、terser-webpack-plugin 等来压缩文件。
- 压缩 HTML
  > 使用 html-minifier 等工具来压缩 HTML 代码。
- 图片优化
  > 使用工具如 ImageOptim、TinyPNG、或在线服务来压缩图片，同时采用适当的图片格式（如 WebP）和尺寸。

#### 缓存利用

- 利用浏览器缓存：通过设置正确的 Cache-Control 和 Expires 头部信息来缓存静态资源，如 CSS、JavaScript 和图片文件。
- 使用 Service Workers：通过 Service Workers 缓存关键资源，实现离线访问和更新。

### 代码分割

- 代码拆分
- 按需加载：使用 Webpack 的 SplitChunksPlugin 或 React 的 React.lazy 和 Suspense 来实现代码的按需加载，减少初始加载时间。
- 路由懒加载：在 Vue 或 React 等框架中，通过动态导入组件来实现路由级别的代码分割。

### 优化渲染过程

#### 减少重排（Reflow）和重绘（Repaint）

- 避免在循环中修改 DOM：批量修改 DOM 可以提高性能。
- 使用 CSS 的 transform 和 opacity 进行动画，因为它们不触发重排和重绘。

将复杂的 DOM 操作放在 requestAnimationFrame 中执行，确保它们在重排重绘之前执行。

#### 虚拟 DOM

使用虚拟 DOM 库：如 React 或 Vue，它们通过虚拟 DOM 来最小化实际 DOM 操作，从而提高性能。

### 异步加载和延迟加载

#### 异步加载 JavaScript

使用`<script>`标签的 async 或 defer 属性：async 允许脚本非阻塞地下载，而 defer 则是在文档解析完成后执行。

动态导入：使用 ES6 的动态导入语法或 Webpack 的魔法注释来实现模块的动态加载。

### 使用现代 API 和工具

#### PWA（Progressive Web Apps）

实现 PWA：利用 Service Workers、Manifest 文件等使应用具备离线能力、安装到主屏幕等特性。

#### Web Workers

使用 Web Workers：对于计算密集型任务，可以使用 Web Workers 在后台线程中运行，不阻塞 UI 线程。

### 监测和持续优化

#### 使用性能分析工具

使用 Lighthouse、PageSpeed Insights、WebPageTest 等工具：定期检查网站性能，并根据反馈进行调整。

监控和分析工具：如 New Relic、Google Analytics 等，用于实时监控网站性能并收集用户行为数据。

通过实施上述策略，可以显著提升前端应用的性能和用户体验。持续的性能监控和优化是保持应用高效的关键。
