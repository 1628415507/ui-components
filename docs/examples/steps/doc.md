<!--
 * @Description: 单号输入框使用文档
 * @Date: 2024-06-27 16:45:45
 * @LastEditTime: 2024-10-31 09:25:12
-->

# Steps 步骤条

## 横向步骤条

::: example
examples/steps/RowSteps
:::

## 纵向步骤条

::: example
examples/steps/VerticalSteps
:::

## API
### 数据格式
```js
const errorStepList= ref([
  {
      "title": "项目公告",
      "status": "finish "
  },
  {
      "title": "项目报价",
      "status": "finish "
  },
  {
      "title": "开标谈判",
      "status": "process"
  },
  {
      "title": "定标",
      "status": "wait"
  }
])
```
### Attributes

<div class="doc-table column4">

| 属性名             | 说明       | 类型     | 默认值  |
| ------------------ | ---------- | -------- | ------- |
| stepList           | 步骤条数据 | `array`  | []      |
| stepList{}-finish  | 已完成状态 | `string` | finish  |
| stepList{}-process | 进行中状态 | `string` | process |
| stepList{}-wait    | 未开始状态 | `string` | wait    |
| stepList{}-error   | 错误状态   | `string` | error   |

</div>
