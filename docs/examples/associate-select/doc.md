<!--
 * @Description:
 * @Date: 2024-07-16 13:49:04
 * @LastEditTime: 2024-10-30 18:20:49
-->

# Associate Select 联想控件

## 基础用法

::: example
examples/associate-select/base
:::

## 可输可选

- `allowCreate`：true，让输入框的值可输入
- `getCreateVal`：获取输入框的值

::: example
examples/associate-select/allowCreate
:::

## API

### 属性值

<div class="doc-table column4">

| 属性名        | 说明                                               | 类型       | 默认值 |
| ------------- | -------------------------------------------------- | ---------- | ------ |
| v-model       | 绑定唯一标识的值                                   | `string`   |        |
| configs       | 联想控件配置                                       | `object`   |        |
|               | configs.url : 请求的接口参数                       | `string`   |        |
|               | configs.multiple : 是否多选                        | `string`   | false  |
|               | configs.showColumn : 显示的列配置                  | `string`   |        |
|               | configs.codeKey : 唯一标识字段                     | `string`   |        |
|               | configs.nameKey : 标签展示的字段                   | `string`   |        |
| defValue      | 初始显示值                                         | `string`   |        |
| allowCreate   | 是否可输可选，未选中数据时不清空输入框的值         | `boolean`  | false  |
| beforeRequest | 调接口前的钩子函数， 若返回 false ，则阻止调接口。 | `function` | null   |
| pageSize      | 接口分页                                           | `function` | 10     |
| trigger       | 弹窗触发方式                                       | `string`   | input   |
|               | icon:点击图标触发                                  | `string`   |        |
|               | input:点击输入框触发                               | `string`   |        |

</div>

### 事件

<div class="doc-table column3">

| 名称             | 说明                                        | 类型       |
| ---------------- | ------------------------------------------- | ---------- |
| handleAutoSelect | 获取选中的数据                              | `Function` |
| getCreateVal     | 获取输入的值（`allowCreate`为`true`时有效） | `Function` |

</div>

### 方法

<div class="doc-table column3">

| 名称             | 说明             | 类型       |
| ---------------- | ---------------- | ---------- |
| clearSelectValue | 清空输入框的数据 | `Function` |

</div>
