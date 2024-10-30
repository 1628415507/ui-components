<!--
 * @Description: 信息框
 * @Date: 2024-06-28 17:36:26
 * @LastEditTime: 2024-10-30 18:16:07
-->

# Plusminus Button 加减按钮

## 基础用法

::: example
examples/plusminus-button/index
:::

## API

### Attributes

<div class="doc-table column4">

| 属性名         | 说明                          | 类型      | 默认值 |
| -------------- | ----------------------------- | --------- | ------ |
| list           | 按钮组所在的列表              | `array`   | -      |
| index          | 按钮组所在的列表的序号        | `number`  | 0      |
| firstMarginTop | 首行距离顶部的距离，默认 22px | `string`  | 22px   |
| bothShow       | 加减按钮一直显示              | `boolean` | false  |

</div>

### 事件

<div class="doc-table column3">

| 名称   | 说明                   | 类型       |
| ------ | ---------------------- | ---------- |
| add    | 点击加号按钮触发的事件 | `Function` |
| remove | 点击删除按钮触发的事件 | `Function` |

</div>
