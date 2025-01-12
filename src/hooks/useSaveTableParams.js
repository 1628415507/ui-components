import { onUnmounted, ref } from 'vue'
import Sortable from 'sortablejs'

// import { setVxeTableConfig, getVxeTableConfig } from '@/api/basedata/tableStorageConfig.js'

async function setVxeTableConfig() {}
async function getVxeTableConfig() {}

const setTableConfig = async (tableId, tableColumnConfig) => {
  try {
    const { success, message } = await setVxeTableConfig({ tableId, tableColumnConfig })
    if (success) {
      // console.log(message)
    } else {
      throw message
    }
  } catch (error) {
    console.log(error)
  }
}

const getTableConfig = async (tableId) => {
  if (!tableId.length) {
    return {}
  }
  try {
    const { data, success, message } = await getVxeTableConfig({ tableId })
    if (success) {
      return data
    } else {
      throw message
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}

export default function useSaveTableParams(config = { isSave: true }) {
  const isSave = config.isSave == false ? false : true //isSave：是否保存列配置
  const specialColumn = ['seq', 'checkbox', 'expand']
  const baseColumns = ref({})

  // 右键菜单
  const menuConfig = ref({
    header: {
      options: [
        [
          { code: 'hideColumn', name: '隐藏列', disabled: false },
          { code: 'showAllColumn', name: '取消所有隐藏列', disabled: false }
        ]
      ]
    },
    visibleMethod(params) {
      const { options, column, $table } = params
      const isDisabled = !column
      options.forEach((list) => {
        list.forEach((item) => {
          item.disabled = isDisabled
          if (item.code == 'hideColumn') {
            if (
              specialColumn.includes(column.type) ||
              column.fixed ||
              (column?.params && column.params?.isRequire) ||
              ($table.props?.editRules &&
                $table.props.editRules[column.field] &&
                $table.props.editRules[column.field][0].required)
            ) {
              item.disabled = true
            } else {
              item.disabled = false
            }
          }
        })
      })
      return true
    },
    menuClickEvent(context) {
      const { menu, column, $table } = context
      const { fullColumn } = $table.getTableColumn()
      // console.log(context)
      if ($table) {
        switch (menu.code) {
          case 'hideColumn':
            $table.hideColumn(column)
            saveTableConfig($table)

            break
          case 'showAllColumn':
            fullColumn
              .filter((col) => !col.visible)
              .forEach((col) => {
                $table.showColumn(col)
              })
            // $table.resetColumn(true)
            saveTableConfig($table)
            break
        }
      }
    }
  })

  // 表格属性-禁用列显示隐藏的勾选
  const customConfig = ($table) => {
    return {
      checkMethod: ({ column }) => {
        if (specialColumn.includes(column.type)) {
          return false
        }
        if ($table?.editRules && $table?.editRules[column.field] && $table.editRules[column.field][0].required) {
          return false
        }
        if (column?.params?.isRequire) {
          return false
        }
        return true
      }
    }
  }

  // 列的宽度变化方法
  const resizableChange = ({ $table, column }) => {
    saveTableConfig($table)
  }

  // toolbar操作后方法
  const toolbarCustomEvent = ({ $table, type }) => {
    if ($table) {
      const { fullColumn } = $table.getTableColumn()
      // setColumnFixed 设置指定 固定列
      // clearColumnFixed 取消指定 固定列
      // hideColumn 隐藏 指定列
      // showColumn 显示 指定列
      // setColumnWidth 设置 宽
      // getColumnWidth 获取 宽
      switch (type) {
        case 'confirm': {
          saveTableConfig($table)
          break
        }
        case 'reset': {
          const oldColumns = baseColumns.value[$table.props.id]
          const refreshColumns = oldColumns.map((col) => fullColumn.find((ele) => ele.title === col.title))
          // console.log(fullColumn)
          // console.log(refreshColumns)
          $table.reloadColumn(refreshColumns)
          saveTableConfig($table, 'reset')
          break
        }
        case 'close': {
          break
        }
      }
    }
  }

  // 针对于树形表格，列合并
  const colspanMethod = ({ row, columnIndex, _rowIndex, $table }) => {
    const { tableColumn } = $table.getTableColumn()
    const columns = tableColumn.filter((column) => !column.type)
    if (!(columns.length > 0)) {
      return { rowspan: 1, colspan: 1 }
    }
    const index = $table.getColumnIndex(columns[0])
    if (row?.hasChild || (row?.children && row.children.length > 0)) {
      if (columnIndex < index) {
        return { rowspan: 1, colspan: 1 }
      } else if (columnIndex === index) {
        return { rowspan: 1, colspan: columns.length }
      } else {
        return { rowspan: 0, colspan: 0 }
      }
    } else {
      return { rowspan: 1, colspan: 1 }
    }
  }

  const exportTableData = ($table) => {
    $table.exportData({
      filename: '文件',
      sheetName: 'Sheet1',
      type: 'xlsx',
      isAllExpand: true,
      useStyle: true,
      columnFilterMethod({ column }) {
        return column.type !== 'checkbox' && column.type !== 'radio'
      }
    })
  }

  // 列拖拽
  const columnDrop = ($table) => {
    Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'), {
      handle: '.vxe-header--column:not(.col--fixed)',
      onMove: (evt, origEvt) => {
        // 固定列不允许停靠
        if (evt.related.className.indexOf('col--fixed') > -1) {
          return false
        }
      },
      onEnd: (sortableEvent) => {
        const newIndex = sortableEvent.newIndex
        const oldIndex = sortableEvent.oldIndex
        // fullColumn: 全量表头列   tableColumn: 当前渲染中的表头列
        const { fullColumn, tableColumn } = $table.getTableColumn()
        // 获取列索引 columnIndex > fullColumn
        const oldColumnIndex = $table.getColumnIndex(tableColumn[oldIndex])
        const newColumnIndex = $table.getColumnIndex(tableColumn[newIndex])
        // 移动到目标列
        const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
        fullColumn.splice(newColumnIndex, 0, currRow)
        $table.loadColumn(fullColumn)

        saveTableConfig($table)
      }
    })
  }

  // 链接toolbar工具栏
  const connectToolbar = ($table, $toolbar) => {
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  }

  // 设置表格列的各项参数
  const setTableParams = (tableRef, columns) => {
    const { fullColumn } = tableRef.getTableColumn()

    fullColumn.sort((a, b) => {
      const indexA = columns.find((item) => item.title === a.title)?.index || 0
      const indexB = columns.find((item) => item.title === b.title)?.index || 0
      return indexA - indexB
    })

    columns.forEach((column) => {
      const col = column.field
        ? fullColumn.find((col) => col.field === column.field)
        : fullColumn.find((col) => col.type === column.title)

      if (column.fixed) {
        tableRef.setColumnFixed(col, column.fixed)
      }

      if (col && column.width && column.width !== '0') {
        col.resizeWidth = column.width
        col.renderWidth = column.width
      }

      if (!column.visible) {
        tableRef.hideColumn(col)
      }
    })

    tableRef.reloadColumn(fullColumn)
  }

  // 初始化
  const initTableConfig = async (tableRefs, toolbars) => {
    const tableIds = getTableId(tableRefs)
    const columnsData = await getColumnsData(tableIds) // 模拟数据
    // console.log(columnsData)
    if (isDataType(tableRefs, 'array') && isDataType(toolbars, 'array')) {
      tableRefs.forEach(($table, i) => {
        connectToolbar($table, toolbars[i])
        columnDrop($table)
        if (isSave) {
          getBaseColumns($table)
          columnsData[$table.id] && setTableParams($table, columnsData[$table.id])
        }
      })
    } else if (isDataType(tableRefs, 'object') && isDataType(toolbars, 'object')) {
      connectToolbar(tableRefs, toolbars)
      columnDrop(tableRefs)
      if (isSave) {
        getBaseColumns(tableRefs)
        columnsData[tableRefs.id] && setTableParams(tableRefs, columnsData[tableRefs.id])
      }
    }
  }

  const isDataType = (data, type) => {
    if (type === 'array') {
      return Object.prototype.toString.call(data) === '[object Array]'
    } else if (type === 'object') {
      return Object.prototype.toString.call(data) === '[object Object]'
    }
  }

  const getColumnsData = async (tableIds) => {
    const data = await getTableConfig(tableIds)
    return data
  }

  const getTableId = (tableRefs) => {
    const ids = []
    if (isDataType(tableRefs, 'array')) {
      tableRefs.forEach(($table) => {
        ids.push($table.id)
      })
    } else if (isDataType(tableRefs, 'object')) {
      ids.push(tableRefs.id)
    }

    return ids
  }

  const getBaseColumns = ($table) => {
    const columns = $table.getTableColumn()
    const fullColumn = JSON.parse(JSON.stringify(columns.fullColumn))
    // console.log(fullColumn)
    baseColumns.value[$table.id] = fullColumn
  }
  const getColumnConfig = ($table, type = 'default') => {
    const { fullColumn } = $table.getTableColumn()
    let columnConfig = []
    if (type === 'default') {
      columnConfig = fullColumn.map((column) => {
        const index = fullColumn.findIndex((col) => col.title === column.title)
        return {
          field: column.field,
          title: column.title || column.type,
          width: column.resizeWidth || column.renderWidth,
          fixed: column.fixed || '',
          visible: column.visible,
          index
        }
      })
    } else {
      columnConfig = []
    }
    return columnConfig
  }
  const saveTableConfig = ($table, type = 'default') => {
    if (!isSave) return
    const tableId = $table?.id || $table.props.id
    const columnConfig = getColumnConfig($table, type)
    setTableConfig(tableId, columnConfig)
  }

  onUnmounted(() => {
    baseColumns.value = {}
  })

  return {
    initTableConfig,
    resizableChange,
    toolbarCustomEvent,
    colspanMethod,
    customConfig,
    menuConfig,
    exportTableData,
    saveTableConfig,
    getColumnConfig,
    setTableConfig
  }
}
