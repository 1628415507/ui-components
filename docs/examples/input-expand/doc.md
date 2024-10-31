<!--
 * @Description: 扩展输入框使用文档
 * @Date: 2024-06-27 16:45:45
 * @LastEditTime: 2024-10-30 18:15:19
-->

# Input Expand 扩展输入框

可同时绑定输入框和文本域的值

## 基础用法

通过设置`independent`属性为`true`，可以绑定不同值
::: example
examples/input-expand/base
:::

## 限制单号类型

- 通过设置`type`属性为`order`，可以限制输入框只能输入固定单号格式
- 单号类型只对输入框做限制，文本域不做限制
- 单号类型下，强制输入框和文本域分开绑定值
- 单号类型下，文本域拆分出的第一个值会赋给输入框的值
  ::: example
  examples/input-expand/order
  :::

## API

### Attributes

<div class="doc-table column4">

| 属性名           | 说明                                                             | 类型      | 默认值 |
| ---------------- | ---------------------------------------------------------------- | --------- | ------ |
| v-model          | 绑定值                                                           | `string`  | false  |
| v-model:textarea | 弹窗内文本域的绑定值，`independent = true`或`type = order`时需要 | `string`  | false  |
| title            | 文本域弹窗的标题                                                 | `string`  | 标题   |
| label            | 弹窗中文本域显示的标签                                           | `string`  | 标签   |
| showIcon         | 是否显示右侧图标                                                 | `boolean` | true   |
| independent      | 入框和弹窗的值是否分开绑定（`type='order'`时无效）               | `boolean` | false  |

</div>

### 事件

<div class="doc-table column3">

| 名称    | 说明                                          | 类型       |
| ------- | --------------------------------------------- | ---------- |
| confirm | 点击弹窗的确认按钮时触发的事件,返回文本域的值 | `Function` |

</div>
