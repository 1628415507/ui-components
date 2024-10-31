<!--
 * @Description: 信息框
 * @Date: 2024-06-28 17:36:26
 * @LastEditTime: 2024-10-30 18:14:12
-->

# Info Card 信息框

## 基础用法

::: example
examples/info-card/base
:::

## 可收缩

- 可以通过设置 `resizable` 为`true`开启可收缩功能，并通过 `resize-type` 设置收缩的方向
- 一共有四个设置 `resizeType="none|vertical|horizontal|both"`

::: example
examples/info-card/resize
:::

## 随高度滚动

- 可以通过设置 `scrollSelector` ，获取信息框所在的容器
  ::: example
  examples/info-card/resizeScroll
  :::

## API

### Attributes

<div class="doc-table column4">

| 属性名         | 说明                                                      | 类型      | 默认值   |
| -------------- | --------------------------------------------------------- | --------- | -------- |
| header         | 标题                                                      | `string`  | false    |
| resizable      | 控制是否能被用户缩放                                      | `boolean` | false    |
| resizeType     | 控制缩放方向 （`none`、`both`、`horizontal`、`vertical`） | `string`  | vertical |
| bodyStyle      | body 的样式                                               | `object`  | -        |
| bodyClass      | body 的样式类名                                           | `string`  | -        |
| minHeight      | 信息框最小高度                                            | `string`  | -        |
| scrollSelector | 所在的滚动区域的元素名称                                  | `string`  | -        |

</div>
