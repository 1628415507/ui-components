<!--
 * @Description:
 * @Date: 2024-10-30 15:56:44
 * @LastEditTime: 2024-10-30 16:39:14
-->

# Edit Label 可编辑标签

## 基础用法

::: example
edit-label/index
:::

## API

### 属性

| 属性名     | 说明           | 类型                   | 默认值   |
| ---------- | -------------- | ---------------------- | -------- |
| v-model    | 绑定值         | `string`               |          |
| readonly   | 是否只读       | `boolean`              | false    |
| background | 标签背景色     | `string`               | #f5f7fa  |
| trigger    | 编辑的触发方式 | `enum`：icon, dblclick | dblclick |
| maxlength  | 最大输入长度   | `number`               |          |

### 方法

| 方法名          | 说明                                                  | 类型     | 默认值     |
| --------------- | ----------------------------------------------------- | -------- | ---------- |
| beforeEditClose | 关闭编辑状态之前的钩子函数，返回 false 则阻止关闭标签 | Function | () => true |
