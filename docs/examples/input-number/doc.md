<!--
 * @Description: 数字输入框使用文档
 * @Date: 2024-06-27 16:45:45
 * @LastEditTime: 2024-10-30 18:15:31
-->

# Input Number 数字输入框

## 基础用法

只能输入数值
::: example
examples/input-number/base
:::

## 限制小数位

通过设置`precision`属性，可以限制小数的位数，默认 4 位小数
::: example
examples/input-number/precision
:::

## 复合型输入框

可以在输入框中前置或后置一个元素。  
可通过 `slot` 来指定在 Input 中分发的前置或者后置的内容。
::: example
examples/input-number/slot
:::

## API

### Attributes

<div class="doc-table column4">

| 属性名     | 说明             | 类型                 | 默认值         |
| ---------- | ---------------- | -------------------- | -------------- |
| v-model    | 绑定值           | `number / undefined	` | -              |
| precision  | 数值精度         | `number`             | 4              |
| min        | 数值允许的最小值 | `number`             | 0              |
| max        | 数值允许的最大值 | `number`             | 999999999.9999 |
| maxlength  | 数值位数         | `number`             | 14             |
| disabled   | 是否禁用         | `boolean`            | false          |
| slotAppend | 是否使用插槽     | `boolean`            | false          |
| textAlign  | 文本对齐         | `string`             | left           |

</div>
