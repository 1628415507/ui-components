<!--
 * @Description: 字符分割线使用文档
 * @Date: 2024-06-27 16:45:45
 * @LastEditTime: 2024-08-14 13:12:38
-->

# Input Divider 字符分割线

用于标记英文 35 个字符的大致位置

## 基础用法

<!-- 组件的路径docs\examples\input-divider\index.vue -->

35 字符分割线的大概位置以"ABCDEABCDEABCDEABCDEABCDEABCDEABCDE"为准
::: example
input-divider/base
:::

## 分割字符串

将文本按每 35 字符（包括空格）进行换行拆分，未超过35字符的单词不进行拆分
::: example
input-divider/method
:::

## API

### Attributes

支持 el-input 的基础属性

<div class="doc-table column4">

| 属性名         | 说明               | 类型      | 默认值 |
| -------------- | ------------------ | --------- | ------ |
| uppercase      | 英文是否自动转大写 | `boolean` | false  |
| limitHalfWidth | 只能输入半角字     | `boolean` | false  |

</div>

### Exposes

<div class="doc-table column3">

| 名称      | 说明                                       | 类型       |
| --------- | ------------------------------------------ | ---------- |
| splitText | 将文本按每 35 字符（包括空格）进行换行拆分 | `Function` |

</div>
