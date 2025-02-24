<!--
 * @Description: 字符分割线使用文档
 * @Date: 2024-06-27 16:45:45
 * @LastEditTime: 2024-12-16 17:19:34
-->

# Input Divider 字符分割线

用于标记英文 n 个字符的大致位置

## 基础用法

<!-- 组件的路径docs\examples\input-divider\index.vue -->

35 字符分割线的大概位置以"ABCDEABCDEABCDEABCDEABCDEABCDEABCDE"为准
::: example
examples/input-divider/base
:::

## 分割字符串

将文本按每 n 字符（包括空格）进行换行拆分，未超过 n 字符的单词不进行拆分
::: example
examples/input-divider/method
:::

## API

### Attributes

支持 el-input 的基础属性

<div class="doc-table column4">

| 属性名         | 说明                     | 类型      | 默认值 |
| -------------- | ------------------------ | --------- | ------ |
| uppercase      | 英文是否自动转大写       | `boolean` | false  |
| limitHalfWidth | 只能输入半角字           | `boolean` | false  |
| showDivider    | 是否显示分割线           | `boolean` | true   |
| dividerOffset  | 分割线的位置             | `string`  | 290    |
| showClearTips  | 是否显示粘贴清空非中文的提示 | `boolean` | false  |
| splitNum       | 每多少字符换行           | `number`  | 35     |
| autoSplit      | 失焦自动换行             | `boolean` | false  |

</div>

### Exposes

<div class="doc-table column3">

| 名称      | 说明                                       | 类型       |
| --------- | ------------------------------------------ | ---------- |
| splitText | 将文本按每 35 字符（包括空格）进行换行拆分 | `Function` |

</div>
