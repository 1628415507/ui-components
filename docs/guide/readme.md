<!--
 * @Description: docs说明文档
 * @Date: 2024-06-27 09:40:26
 * @LastEditTime: 2024-10-11 17:15:10
-->
<!-- 题库https://github.com/pro-collection/interview-question/issues -->
## 网址资源
- https://github.com/pro-collection/interview-question/issues
- 组件库搭建：https://www.cnblogs.com/wp-leonard/p/17894496.html
- 博客搭建：https://blog.csdn.net/WNX10086/article/details/137160521
- 图标大全：https://www.emojiall.com/zh-hans/categories/G#google_vignette

## 各分支说明

<div class="doc-table">

| 分支       | 说明                 | 类型                                  |
| ---------- | -------------------- | ------------------------------------- |
| base       | 基础分支             | `base`                                |
| blogs      | 博客分支             | `base->blogs->develop->master`        |
| components | 组件分支             | `base->components->develop->master`   |
| develop    | 开发分支             | `develop->master`                     |
| master     | github-page 部署分支 | push 到此分支会自动发布到 github-page |

</div>

## vitepress 目录说明

```js
.
├─ docs                         # 项目根目录
│  ├─ .vitepress                # 配置目录
│  ├─  ├─ assets                # 样式资源文件
│  ├─  ├─ config                # 自定义配置、
│  ├─  ├─ customMdContainer     # 自定义md容器组件
│  ├─  ├─ menu                  # 菜单
│  ├─  ├─ theme                 # 主题配置
│  ├─  ├─ utils                 # 公共方法
│  ├─  ├─ config.mts            # markdown菜单配置
│  └─ components                # 文档中使用的组件
│  └─ examples                  # 组件示例代码、说明文档
│  ├─  ├─ blogs                 # 专栏中文档引用的组件
│  ├─  ├─ 其他                  # 组件库示例、文档
│  └─ guide                     # 指南说明文档
└─ ...
```
