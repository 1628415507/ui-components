## VueHandsontable 表格

VueHandsontable 是一个具有电子表格功能和外观的数据网格。可以使用自定义插件轻松修改或扩展它。它使用 JSON 格式绑定到任何数据源并处理大量记录。它支持过滤、排序和 CRUD （创建、读取、更新、删除）等操作，以及高级操作 - 多列排序、创建自定义单元格类型和添加数据摘要。

### 基础表格

:::demo 当`hot-table`元素中注入`data`对象数组后，在`hot-column`中用`data`属性来对应对象中的键名即可填入数据，用`title`属性来定义表格的列名。可以使用`width`属性来定义列宽。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"

  >
    <hot-column data="date" title="日期" width="180" cell-renderer='123'/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    }
  };
</script>
```

:::

### 表格拖拽

设置 dragCheck 属性，可以进行表格拖拽。

:::demo `dragCheck`属性可以进行表格拖拽。它接受一个`Boolean`，默认为`false`，设置为`true`即为启用。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
          dragCheck: true,
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    }
  };
</script>
```

:::

### 表格排序

设置 columnSorting 属性，可以进行表格排序。

:::demo `columnSorting`属性可以进行表格排序。它接受一个`Boolean`，默认为`false`，设置为`true`即为启用。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
          columnSorting: true
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    }
  };
</script>
```

:::

### 表格后端排序

设置 back-end-sort-handle 属性，可以进行表格排序。

:::demo `back-end-sort-handle`属性可以进行表格排序，它接受一个 `Function`。同时配置 `allowColumnSorting`属性可以动态配置需要进行排序的列,它接受一个 `Array`，值为需要排序列对应的字段名。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
    :back-end-sort-handle="handleSort"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
          columnSorting: true,
          allowColumnSorting: ['address']
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    },
    methods:{
      handleSort(data) {
        console.log(data)
      }
    }
  };
</script>
```

:::

### 表格调整大小

设置 manualColumnResize 和 manualRowResize 属性，可以进行表格调整大小。

:::demo `manualColumnResize` 和 `manualRowResize`属性可以进行表格调整大小。它接受一个`Boolean`，默认为`false`，设置为`true`即为启用。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
          manualColumnResize: true,
          manualRowResize: true
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    },
  };
</script>
```

:::

### 隐藏列

允许从表格中隐藏特定列。

:::demo 允许在标题中显示隐藏的列指示器，以通知用户哪些列已被隐藏。要启用它们，请将`indicators`插件配置对象中的属性设置为 true。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          showSelection: false,
          hiddenColumns: {
            columns: [2],
            indicators: true
          }
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    },
  };
</script>
```

:::

### 表格高度、宽度

为 Table 设置高度和宽度

:::demo 在 settings 中设置`height`可以为表格设置高度，设置`width`可以为表格设置宽度。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          height: '200',
          width: '500'
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      },{
        date: '2016-05-05',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1515 弄',
      },{
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1514 弄',
      },{
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1513 弄',
      },{
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1511 弄',
      }]
    },
  };
</script>
```

:::

### 流体高度、宽度

当数据量动态变化时，可以为 Table 设置一个最小高度和最小宽度。

:::demo 在 settings 中设置`minHeight`可以为表格设置最小高度，设置`minWidth`可以为表格设置最小宽度。`autoRowSize`设置为`true`，自动设置行大小，启用此插件会降低性能，因为将执行与大小相关的计算。

```html
<template>
  <hot-table
    :data-source="tableData"
    :settings="settings"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        settings: {
          minHeight: '100',
          minWidth: '840',
          autoRowSize: 'true'
        },
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      },{
        date: '2016-05-05',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1515 弄',
      },{
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1514 弄',
      },{
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1513 弄',
      },{
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1511 弄',
      }]
    },
  };
</script>
```

:::

### 提示文本

表格内容过长，鼠标悬浮显示完整文本。

:::demo 设置`has-tip`为`true`,开始提示文本功能

```html
<template>
  <hot-table
    :data-source="tableData"
    :has-tip="true"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    },
  };
</script>
```

:::

### 分页序号

表格序号会跟随分页信息而变化。

:::demo 表格设置`current-page`为当前页数，`page-size`为分页页数，序号会显示为对应分页的。

```html
<template>
  <hot-table
    :data-source="tableData"
    :current-page="currentPage"
    :page-size="pageSize"
  >
    <hot-column data="date" title="日期" width="180"/></hot-column>
    <hot-column data="name" title="姓名" width="180"/></hot-column>
    <hot-column data="address" title="地址"/></hot-column>
  </hot-table>
  <el-pagination
    layout="prev, pager, next"
    :current-page="currentPage"
    :total="50">
  </el-pagination>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        currentPage: 2,
        pageSize: 3
      };
    },
    mounted(){
      this.tableData = [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      },{
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      },{
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
      },{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }]
    },
  };
</script>
```

:::

### Table Attributes

| 参数                   | 说明                                                                   | 类型         | 可选值            | 默认值                      |
| ---------------------- | ---------------------------------------------------------------------- | ------------ | ----------------- | --------------------------- |
| id                     | 表格`id`                                                               | string       | —                 | 默认`hot-`拼接 7 位随机字符 |
| settings               | 表格配置                                                               | object       | —                 | —                           |
| data-source            | 显示的数据                                                             | array        | —                 | —                           |
| rules                  | 验证规则                                                               | array/object | —                 | —                           |
| rules-key              | 验证规则`key`                                                          | string       | —                 | —                           |
| combine-name           | 规则分组名称                                                           | string       | —                 | —                           |
| show-filter            | 是否开启部分过滤                                                       | boolean      | —                 | false                       |
| show-selection         | `Setting` 配置 `showSelection`: `false`序号不显示                      | boolean      | —                 | true                        |
| align                  | 对齐方式                                                               | string       | left/center/right | left                        |
| hidden                 | 隐藏                                                                   | string       | —                 | false                       |
| summary                | 合计                                                                   | string       | —                 | —                           |
| has-tip                | 是否开启提示文本。单元格数据过长，出现省略号，移动到该项展示所有数据。 | boolean      | —                 | false                       |
| empty-text             | 空数据时显示的文本内容                                                 | String       | —                 | 暂无数据                    |
| dict-name              | 字典表名称                                                             | string       | —                 | —                           |
| col-settings-key       | 表格列配置，必须赋值的是唯一值。                                       | string       | —                 | —                           |
| sortable               | 对应列是否可以排序                                                     | string       | —                 | —                           |
| css                    | 编辑表格列信息                                                         | function     | —                 | —                           |
| show-index-column      | 是否显示序号                                                           | boolean      | —                 | true                        |
| fixed-columns-right    | 固定右侧列                                                             | number       | —                 | —                           |
| calculate              | 计算                                                                   | function     | —                 | —                           |
| show-column-header-tip | 是否显示提示文本                                                       | boolean      | —                 | false                       |
| selection-column-width | 复选框栏列宽度                                                         | number       | —                 | 60                          |
| selection-column-title | 序号列列名                                                             | string       | —                 | 序号                        |
| checked-display        | 选中展示                                                               | string       | —                 | —                           |
| unchecked-display      | 未选中展示                                                             | string       | —                 | —                           |
| display-format         | 格式化内容                                                             | function     | —                 | —                           |
| current-page           | 当前页码,用于更新序号                                                  | number       | —                 | —                           |
| page-size              | 分页显示条目个数,用于更新序号                                          | number       | —                 | —                           |
| required               | 是否必须                                                               | boolean      | —                 | —                           |
| show-check-all         | 是否显示全选                                                           | boolean      | —                 | false                       |
| back-end-sort-handle   | 表格后端排序                                                           | function     | —                 | data                        |

### Table Events

| 事件名                  | 说明                                                                                           | 参数                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| cell-dblclick           | 当某个单元格被点击时会触发该事件                                                               | record, col, row, physicalRow, field, event       |
| cell-click              | 当某个单元格被点击时会触发该事件                                                               | record, col, row, physicalRow, physicalCol, event |
| row-dblclick            | 当某一行被双击时会触发该事件                                                                   | record, row, physicalRow                          |
| row-click               | 当某一行被点击时会触发该事件                                                                   | record, row, physicalRow, event                   |
| header-click            | 当某一列的表头被点击时会触发该事件                                                             | row, col, physicalRow, event                      |
| after-filter            | 过滤后由过滤器插件触发，`filters` 属性为 `true`                                                | row, col, physicalRow, event                      |
| after-column-sort       | 在对列进行排序后由 ColumnSorting 和 MultiColumnSorting 插件触发                                | currentSortConfig, destinationSortConfigs         |
| before-column-sort      | 在对列进行排序前由 ColumnSorting 和 MultiColumnSorting 插件触发                                | currentSortConfig, destinationSortConfigs         |
| selection-change        | 当选择项发生变化时会触发该事件                                                                 | isAll, checked, record                            |
| value-change            | 当值发生变化时会触发该事件                                                                     | prop, newValue, oldValue                          |
| colunm-selection-change | 当列选择项发生变化时会触发该事件，列`type`设置为`checkbox`，且`column`的`type`设置为`checkbox` | isAll, checked, record                            |

### Table Methods

| 方法名                                           | 说明                                                                                                                                          | 参数                                    |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| getCurrentColumnSettings                         | 获取当前列设置                                                                                                                                | —                                       |
| getSelectedIndex                                 | 返回当前选定单元格的索引                                                                                                                      | —                                       |
| loadData                                         | 加载数据                                                                                                                                      | dataSource: array                       |
| reset                                            | 加载数据                                                                                                                                      | -                                       |
| addRow                                           | 新增行                                                                                                                                        | record: object, pos: number             |
| validateCells                                    | 验证所有单元格，并在完成后调用回调,如果其中一个单元格无效，则`valid`返回 alse，否则它返回 true。                                              | -                                       |
| validateColumns                                  | 验证`列`，并在完成后调用回调,如果其中一个单元格无效，则`valid`返回 alse，否则它返回 true。                                                    | columns: array                          |
| validateColumns                                  | 验证`行`，并在完成后调用回调,如果其中一个单元格无效，则`valid`返回 alse，否则它返回 true。                                                    | columns: array                          |
| showErrorMessage                                 | 传入页面左边，展示错误信息。                                                                                                                  | x: x 坐标, y: y 坐标, message: 错误信息 |
| hideErrorMessage                                 | 隐藏错误信息。                                                                                                                                | x: x 坐标, y: y 坐标, message: 错误信息 |
| selectRows                                       | 用于多选表格，设置多行的为选中状态，未使用第二个参数则默认设置`true`，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） | rows, checked                           |
| selectCell                                       | 选择行和列值指定的单元格或结束于 endRow、endCol 的单元格范围。 如果表                                                                         |
| 被配置为支持数据列属性，这些属性可用于进行选择。 | row, column, endRow, endColumn, scrollToCell, changeListener                                                                                  |
| deselectCell                                     | 取消选择表格上的当前单元格选择。                                                                                                              | -                                       |
| resizeTo                                         | 更新重置表格尺寸，`width`和`height`为可选参数。                                                                                               | width, height                           |
| render                                           | 重新渲染表格。调用此方法会启动重新计算、重绘和将更改应用于 DOM 的过程。在渲染表格时，会调用所有单元格渲染器。                                 | -                                       |
| scrollToTop                                      | 滚动到顶部。                                                                                                                                  | -                                       |
| scrollToBottom                                   | 滚动到底部。                                                                                                                                  | -                                       |
| setCommentAtCell                                 | 为指定的单元格设置注释。                                                                                                                      | row, col, comment                       |
| removeCellComment                                | 为指定的单元格设置注释。                                                                                                                      | row, col                                |
| getCellComment                                   | 获取指定的单元格注释。                                                                                                                        | row, col                                |

### Setting Attributes

| 参数                                 | 说明                                                                                                           | 类型                          | 可选值                    | 默认值          |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------- | --------------- |
| showSelection                        | 序号是否显示                                                                                                   | boolean                       | —                         | true            |
| minHeight                            | Table 的最小高度。合法的值为数字的高度。                                                                       | number                        | —                         | —               |
| minWidth                             | Table 的最小宽度。合法的值为数字的宽度。                                                                       | number                        | —                         | —               |
| height                               | Table 的高度，默认为自动高度。Table 的高度会受控于外部样式。                                                   | number                        | —                         | —               |
| width                                | Table 的宽度，默认为自动宽度。Table 的宽度会受控于外部样式。                                                   | number                        | —                         | —               |
| rowHeaders                           | 启用或禁用默认行标题                                                                                           | boolean/array/function        | —                         | true            |
| language                             | 语言                                                                                                           | string                        | —                         | zh-CN           |
| manualColumnMove                     | 列移动                                                                                                         | boolean/array                 | —                         | zh-CN           |
| selectionMode                        | 表格选择模式                                                                                                   | string                        | single / range / multiple | multiple        |
| stretchH                             | 拉伸表格，列变化的模式                                                                                         | string                        | 不处理none / 最后列last / 平均all         | —               |
| licenseKey                           | 商业版的许可证密钥                                                                                             | string                        | —                         | —               |
| autoRowSize                          | 自动设置行大小，启用此插件会降低性能，因为将执行与大小相关的计算。                                             | boolean                       | —                         | undefined/false |
| wordWrap                             | 自动换行                                                                                                       | boolean                       | —                         | true            |
| outsideClickDeselects                | 在网格外单击鼠标将取消选择当前选择，可以是一个接受                                                             |
| 点击事件目标并返回一个布尔值的函数。 | boolean/function                                                                                               | —                             | true                      |
| fillHandle                           | 启用填充手柄（向下拖动和向下复制）功能，该功能在所选区域的右下角显示一个小矩形，让您可以将值扩展到相邻单元格。 | boolean                       | —                         | true            |
| rowHeights                           | 以像素为单位定义行高                                                                                           | number/string/function        | —                         | —               |
| manualColumnResize                   | 手动调整列大小                                                                                                 | boolean/array                 | —                         | —               |
| currentRowClassName                  | 当前行类名                                                                                                     | string                        | —                         | —               |
| allowColumnSorting                   | 当设置了`back-end-sort-handle`属性，开启后端排序功能，动态配置需要进行排序的列。                               | array                         | —                         | —               |
| dragCheck                            | 是否可拖拽                                                                                                     | boolean                       | —                         | false           |
| dragStartRow                         | 拖选开始行                                                                                                     | object                        | —                         | undefined       |
| nestedSettings                       | 多级表头配置                                                                                                   | array                         | —                         | undefined       |
| dynamicColumnsSettings               | 动态表格列配置                                                                                                 | {title, data, columns, index} | —                         | undefined       |
| dynamicColumnsLoaded                 | 动态列已加载                                                                                                   | array                         | —                         | undefined       |
| validationGroup                      | 校验分组                                                                                                       | string                        | —                         | null            |
| copyPaste                            | 复制粘贴                                                                                                       | string                        | —                         | true            |
| readOnly                             | 单元格、列或注释只读。                                                                                         | string                        | —                         | false           |
