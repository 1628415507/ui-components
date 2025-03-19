## 减小项目体积

- dist 目录分析

1. 图片压缩
1. Gzip 压缩传输
1. 未剔除项目模板用到的冗余依赖，比如 g2、quill、wangEditor、mock 等
   > 将 public 的静态资源移入 assets。静态资源应该放在 assets 下，public 只会单纯的复制到 dist，应该放置不经 webpack 处理的文件，比如不兼容 webpack 的库，需要指定文件名的文件等等
1. moment 和 moment-timezone 重复，且体积较大
<!--
1. 移除页面上没引用到 SVG 图标、应该被内联的小图等
1. 去除组件库中无用的 icon
1. 一些没用到的 Ant-design 组件库由于全局注册也一并打包了进去
1. core-js 体积较大
1. 打包策略不合理，导致 chunk-vendor 太大
   -->
1. 路由懒加载
1. 拆分打包
