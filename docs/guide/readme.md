<!--
 * @Description: docs说明文档
 * @Date: 2024-06-27 09:40:26
 * @LastEditTime: 2024-08-16 17:51:50
-->

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
│  └─ guide                     # 指南说明文档
└─ ...
```
