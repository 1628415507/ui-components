import Sortable from 'sortablejs'
import { nextTick, reactive, ref } from 'vue'

export default function useDragElTable() {
  const filters = ref([])
  const sortOrder = ref({})

  const rowDrop = (tableRef) => {
    // 要拖拽元素的父容器 tbody
    const tbody = tableRef.$el.querySelector('.el-table__body-wrapper tbody')
    Sortable.create(tbody, {
      //  可被拖拽的子元素
      draggable: '.draggable .el-table__row',
      onEnd({ newIndex, oldIndex }) {
        // newIndex 拖动到的新的索引
        // oldIndex 没拖动前的索引
        const currRow = tableRef.data.splice(oldIndex, 1)[0]
        tableRef.data.splice(newIndex, 0, currRow)
      }
    })
  }

  // 列拖拽
  const columnDrop = (tableRef) => {
    // 要拖拽元素的父容器 头部的tr
    const wrapperTr = tableRef.$el.querySelector('.el-table__header-wrapper tr')
    const columns = tableRef.store.states.columns.value
    const _columns = tableRef.store.states._columns.value
    console.log(tableRef.store)

    Sortable.create(wrapperTr, {
      animation: 150,
      delay: 0,
      handle: '.el-table__cell:not(.el-table-fixed-column--left):not(.el-table-fixed-column--right)',
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

  const filterHandlerToVxe = ({ value, row, column }, totalRowProp = '') => {
    let cellValue = row[column.property];
    let filterValue = value;
    if (row?.[totalRowProp] && row[totalRowProp] === '合计') {
      return true
    }
    if (row.children && row.children.length) {
      let childMatch = row.children.some(child => filterHandlerToVxe({ value, row: child, column }));
      if (childMatch) {
        return true;
      }
    }
    // 检查当前节点是否匹配
    if (!cellValue && cellValue !== 0) return false;
    return cellValue === filterValue
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
    const options = []
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
  
  const treeFilter = (tree, func) => {
    return tree.map(node => ({ ...node })).filter(node => {
      node.children = node.children && treeFilter(node.children, func)
      return func(node) || (node.children && node.children.length)
    })
  }
  
  // 获取数组元素个数（包含树形）
  const countLeafNodes = (nodeArray) => {
    let count = 0
    nodeArray.forEach(node => {
      if (node.children && node.children.length > 0) {
        count += countLeafNodes(node.children)
      } else {
        count++
      }
    })
    return count
  }
  
  const traverseFlatTree = (nodes = [], arr = []) => {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i]
      arr.push(node)
      
      if (node.children && node.children.length > 0) {
        traverseFlatTree(node.children, arr)
      }
    }
    return arr
  }
  
  const handleFilterChange = (param, vxeTableRef, ...arg) => {
    const { column, field, values, datas, filterList } = param
    // const checkedFilters = vxeTableRef.getCheckedFilters()
    let filterArr = []
    const tableData = vxeTableRef.getData()
    
    const filterValues = Array.from(filterList.reduce((accumulator, current) => {
      current.values.forEach(value => accumulator.add(value));
      return accumulator;
    }, new Set()))
    const filterFields = filterList.map(item => item.property)

    if (filterValues && filterValues.length > 0) {
      filterArr = treeFilter(tableData, node => {
        console.log(node[field]);
        // return filterValues.includes(node[field])

        return filterValues.every(val => {
          return filterFields.every(fd => {
            return filterValues.includes(node[fd])
          })
        })
      })
  
      // console.log(filterArr);
      vxeTableRef.loadData(filterArr)
    } else {
      vxeTableRef.loadData(tableData)
    }
    
    // console.log(arg);
    if (filterList && filterList.length > 0) {
      arg[0]()
      arg[1]()
    } else {
      arg[2]()
    }
  }
  
  const setColumnFilterOptions = ($table, tableData, totalRowProp) => {
    const { tableColumn } = $table.getTableColumn()
    nextTick(() => {
      tableColumn.forEach((col) => {
        const options = []
        const flatData = traverseFlatTree(tableData, [])
        if (flatData.length > 0) {
          flatData.forEach((row, index) => {
            const IsExist = options.some((item) => item?.label === row[col.field])
            if (!IsExist) {
              if ((row[col.field] || String(row[col.field]) === '0') && (!row.children || row.children.length <= 0)) {
                const option = {
                  label: row[col.field],
                  value: row[col.field],
                  checked: false
                }
                options.push(option)
              }
            }
          })
        }
        $table.setFilter(col, options)
      })
      $table.updateData()
    })
  }
  
  const sortMethod = (tableData, prop, sortOrder, cb = null) => {
    const order = sortOrder === 'ascending' ? 1 : -1
    tableData.sort((a, b) => {
      if (
        (typeof a[prop] != 'number' && a[prop]?.includes('合计')) ||
        (typeof b[prop] != 'number' && b[prop]?.includes('合计')) ||
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
    handleFilterChange
  }
}
