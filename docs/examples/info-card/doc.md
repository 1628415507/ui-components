<!--
 * @Description: 信息框
 * @Date: 2024-06-28 17:36:26
 * @LastEditTime: 2024-10-30 18:14:12
-->

# Info Card 信息框

信息卡片组件，用于展示信息和内容区域。

## 基础用法

最基础的用法，通过 `header` 属性设置标题。

::: example
examples/info-card/base
:::

## 标题图标

通过 `header-icon` 属性设置标题前缀图标样式，支持 `dot`（圆点）和 `line`（竖线）两种样式。

::: example
examples/info-card/headerIcon
:::

## 可收缩

- 通过设置 `collapsible` 为 `true` 自动开启展开/收缩功能，
- 通过 `expand` 手动控制展开/收缩状态。

::: example
examples/info-card/collapsible
:::

## 可调整大小

通过设置 `resizable` 为 `true` 开启可调整大小功能，通过 `resize-type` 设置调整方向。

::: example
examples/info-card/resize
:::

## 滚动容器联动

当信息框处于滚动容器中时，可以通过设置 `scroll-selector` 指定滚动容器，调整信息框高度时自动滚动容器。

::: example
examples/info-card/resizeScroll
:::

## 自定义样式

- 通过 `border` 属性显示边框;
- 通过 `background` 属性设置背景色;
- 通过 `body-style` 和 `body-class` 自定义内容区域样式。

::: example
examples/info-card/customStyle
:::

## 自定义标题

通过 `header` 插槽可以自定义标题内容。

::: example
examples/info-card/customHeader
:::

## 高度设置

通过 `height` 设置固定高度，通过 `min-height` 设置最小高度。

::: example
examples/info-card/height
:::

## API

### Attributes

<div class="doc-table column4">

| 属性名          | 说明                                                       | 类型      | 默认值     |
| --------------- | ---------------------------------------------------------- | --------- | ---------- |
| header          | 标题文本                                                   | `string`  | ''         |
| header-icon     | 标题前缀图标样式，可选值：`dot`（圆点）、`line`（竖线）    | `string`  | 'line'     |
| collapsible     | 是否启用自动展开/收缩功能                                  | `boolean` | false      |
| expand          | 默认是否展开（手动控制展开/收缩）                          | `boolean` | true       |
| resizable       | 是否可调整大小                                             | `boolean` | false      |
| resize-type     | 调整方向，可选值：`none`、`both`、`horizontal`、`vertical` | `string`  | 'vertical' |
| scroll-selector | 滚动容器的选择器（配合 `resizable` 使用）                  | `string`  | ''         |
| background      | 背景色                                                     | `string`  | '#fbfcfe'  |
| border          | 是否显示边框                                               | `boolean` | false      |
| body-style      | 内容区域的自定义样式对象                                   | `object`  | {}         |
| body-class      | 内容区域的自定义样式类名                                   | `string`  | ''         |
| min-height      | 最小高度                                                   | `string`  | '250px'    |
| height          | 固定高度（为空时由内容撑开）                               | `string`  | ''         |

</div>

### Events

<div class="doc-table column3">

| 事件名        | 说明                        | 回调参数              |
| ------------- | --------------------------- | --------------------- |
| expand-change | 展开/收缩状态改变时触发     | `(expanded: boolean)` |
| resizing      | 调整大小过程中触发          | `(event: MouseEvent)` |

</div>

### Slots

<div class="doc-table column3">

| 插槽名  | 说明           |
| ------- | -------------- |
| header  | 自定义标题内容 |
| default | 卡片内容       |

</div>
