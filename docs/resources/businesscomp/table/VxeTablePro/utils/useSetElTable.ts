import Sortable from 'sortablejs'
import { nextTick, reactive, ref } from 'vue'

export default function useDragElTable() {
  const filters = ref([])
  const sortOrder = ref({})

  // const rowDrop = (tableRef) => {
  //   // 要拖拽元素的父容器 tbody
  //   const tbody = tableRef.$el.querySelector('.el-table_body-wrapper tbody')
  //   Sortable.create(tbody, {
  //     // 可被拖拽的子元素
  //     draggable: '.draggable .el-table_row',
  //     onEnd: ({ newIndex, oldIndex }) => {
  //       // newIndex 拖动到的新的索引
  //       // oldIndex 没拖动前的索引
  //       const currRow = tableRef.data.splice(oldIndex, 1)[0]
  //       tableRef.data.splice(newIndex, 0, currRow)
  //     }
  //   })
  // }

  // 列拖拽
  const columnDrop = (tableRef) => {
    // 要拖拽元素的父容器 头部的tr
    const wrapperTr = tableRef.$el.querySelector('.el-table_header-wrapper tr')
    const columns = tableRef.store.states.columns.value
    const _columns = tableRef.store.states._columns.value
    console.log(tableRef.store)
    Sortable.create(wrapperTr, {
      animation: 150,
      delay: 0,
      handle: '.el-table_cell:not(.el-table-fixed-column--left):not(.el-table-fixed-column--right)',
      onMove: (evt, origEvt) => {
        // 固定列不允许停靠
        if (evt.related.className.indexOf('fixed-column') > -1) {
          return false
        }
      },
      onEnd: (evt) => {
        const currCol = columns.splice(evt.oldIndex, 1)[0]
        columns.splice(evt.newIndex, 0, currCol)
        const _currCol = _columns.splice(evt.oldIndex, 1)[0]
        _columns.splice(evt.newIndex, 0, _currCol)
        tableRef.store.updateColumns()
        tableRef.store.scheduleLayout()
      }
    })
  }

  const isDataType = (data, type) => {
    if (type === 'array') {
      return Object.prototype.toString.call(data) === '[object Array]'
    } else if (type === 'object') {
      return Object.prototype.toString.call(data) === '[object Object]'
    }
  }

  const filterHandler = (value, row, column) => {
    const property = column['property']
    return row[property] === value
  }

  const filterHandlerToVxe = (params, totalRowProp = '') => {
    // console.log('扩展后的表格实例:', params, totalRowProp)
    const { value, row, column } = params
    if (row?.[totalRowProp] && row[totalRowProp] === '合计') {
      return true
    }
    // 如果是数组,说明是多选过滤
    if (Array.isArray(value)) {
      return value.some((v) => row[column.field] === v)
    }
    //如果是字符串,说明是单选过滤
    return row[column.field] === value
  }

  const handleSortable = (column, prop, order, getList, tableData, cb) => {
    console.log(column, prop, order, tableData, cb)
    const params = {}
    if (order && column.sortType === 'custom') {
      params['orderParam'] = prop
      params['orderType'] = order
      sortOrder.value[column?.params?.tableId || '1'] = params
      getList && getList()
    } else if (column.sortType === 'emit') {
      sortOrder.value[column?.params?.tableId || '1'] = params
      sortMethod(tableData, prop, order, cb)
    }
  }

  const initTableConfig = (tableRefs) => {
    if (isDataType(tableRefs, 'array')) {
      tableRefs.forEach(($table) => {
        columnDrop($table)
      })
    } else if (isDataType(tableRefs, 'object')) {
      columnDrop(tableRefs)
    }
  }

  const filterTableData = (tableData, prop) => {
    const options: Array<{ label: any; value: any }> = []
    if (tableData.length > 0) {
      tableData.forEach((row, index) => {
        const IsExist = options.some((item) => item?.label === row[prop])
        if (!IsExist && row[prop]) {
          const option = {
            label: row[prop],
            value: row[prop]
          }
          options.push(option)
        }
      })
    }
    return options
  }

  const getOptionsByField = ($table, tableData, col) => {
    const activeFilterColsList = $table.getCheckedFilters().map((item) => item.field)
    const options: Array<{ label: any; value: any; checked: boolean }> = []
    tableData.forEach((row, index) => {
      // 修复:添加空值检查,防止 row [col.field]为null 时调用 toString() 报错
      const cellValue = row[col.field]
      let label = cellValue != null ? cellValue.toString() : ''
      if (activeFilterColsList.indexOf(col.field) === -1) {
        if (col.formatter) {
          // 修复:传入完整的参数对象,包括row、cellValue、column等,防止 formatter 访问 row 属性时报错
          try {
            label = col.formatter({ cellValue, row, column: col, $table })
          } catch (e) {
            // formatter 执行出错时,使用原始值
            label = cellValue != null ? cellValue.toString() : ''
          }
        }
        if (!label) {
          label = '空'
        }
      }
      const IsExist = options.some((item) => item?.label === label)
      if (!IsExist) {
        const option = {
          label: label,
          value: cellValue,
          checked: false
        }
        options.push(option)
      }
    })
    // 对选项进行排序
    options.sort((a, b) => {
      return a.label?.toString()?.localeCompare(b.label, 'zh-Hans-CN')
    })
    return options
  }

  const setColumnFilterOptions = ($table, tableData, totalRowProp = '') => {
    const tableColumn = $table.getTableColumn()
    // 修复:在此函数中获取 activeFilterColsList
    const activeFilterColsList = $table.getCheckedFilters().map((item) => item.field)
    nextTick(() => {
      tableColumn.forEach((col) => {
        let options: Array<{ label: any; value: any; checked: boolean }> = []
        if (tableData.length > 0) {
          options = getOptionsByField($table, tableData, col)
        }
        if (activeFilterColsList.indexOf(col.field) === -1) {
          $table.setFilter(col, options)
        }
        // $table.updateData()
      })
    })
  }

  const sortMethod = (tableData, prop, sortOrder, cb) => {
    const order = sortOrder === 'ascending' ? 1 : -1
    tableData.sort((a, b) => {
      if (
        (typeof a[prop] !== 'number' && a[prop]?.includes('合计')) ||
        (typeof b[prop] !== 'number' && b[prop]?.includes('合计')) ||
        a?.isAdd ||
        b?.isAdd
      ) {
        return 0
      } else if (cb) {
        return Number(cb(a).replace('%', '')) > Number(cb(b).replace('%', '')) ? 1 * order : -1 * order
      } else if (typeof a?.[prop] == 'number') {
        return Number(a[prop]) > Number(b[prop]) ? 1 * order : -1 * order
      } else {
        if (/^[\u4e00-\u9fa5]+$/.test(a[prop]) && /^[\u4e00-\u9fa5]+$/.test(b[prop])) {
          return sortOrder === 'ascending'
            ? a[prop].localeCompare(b[prop], 'zh-Hans-CN')
            : b[prop].localeCompare(a[prop], 'zh-Hans-CN')
        } else {
          return sortOrder === 'ascending' ? a[prop].localeCompare(b[prop]) : b[prop].localeCompare(a[prop])
        }
      }
    })
  }

  return {
    initTableConfig,
    filterHandler,
    filterHandlerToVxe,
    handleSortable,
    filterTableData,
    setColumnFilterOptions,
    filters,
    sortOrder,
    getOptionsByField
  }
}

