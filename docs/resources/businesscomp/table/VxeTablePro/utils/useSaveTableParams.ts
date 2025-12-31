import { onUnmounted, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import Sortable from 'sortablejs'
// import request from '@/utils/request'
export const enum ROLE_TYPE {
  USER = 'U', // 用户级布局 principal_group_code != 1000 and is_super_admin != 1
  SYSTEM = 'S', // 系统级布局 principal_group_code = 1000
  TENANT = 'T' // 租户级布局 principal_group_code != 1000 and is_super_admin = 1
}
function useI18n() {
  return {
    t: (key: string) => key
  }
}
// 设置vxe-table表格配置
const setVxeTableConfig = (data) => {
  return Promise.resolve({})
  // return request({
  //   url: '/jhj-base-management/userTableStrorage/save',
  //   method: 'POST',
  //   headers: {
  //     repeatSubmit: false
  //   },
  //   data
  // })
}

// 获取vxe-table表格配置
const getVxeTableConfig = (data) => {
  return Promise.resolve({})
  // return request({
  //   url: '/jhj-base-management/userTableStrorage/getLoadQuery',
  //   method: 'POST',
  //   headers: {
  //     repeatSubmit: false
  //   },
  //   data
  // })
}

const setTableConfig = async (tableId: string, tableColumnConfig: any) => {
  try {
    const result: any = await setVxeTableConfig({ tableId, tableColumnConfig })
    const { success, message } = result || {}
    if (success) {
      // // console.log(message)
    } else {
      throw message
    }
  } catch (error) {
    throw error
  }
}

const getTableConfig = async (tableId: string | string[]) => {
  if (Array.isArray(tableId) && !tableId.length) {
    return {}
  }
  if (!Array.isArray(tableId) && !tableId) {
    return {}
  }
  try {
    const result: any = await getVxeTableConfig({ tableId })
    const { data, success, message } = result || {}
    if (success) {
      return data
    } else {
      throw message
    }
  } catch (error) {
    // // console.log(error)
    return {}
  }
}

// 判断数据类型
function isDataType(data, type) {
  if (type === 'array') {
    return Object.prototype.toString.call(data) === '[object Array]'
  } else if (type === 'object') {
    return Object.prototype.toString.call(data) === '[object Object]'
  }
}

// 计算字符串的个数
function getStrNum(str = '') {
  let num = 0
  for (let i = 0; i < str.length; i++) {
    let a = str.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      // 中文字符
      num += 1
    } else if (a.match(/[_MWQG]/gi) != null) {
      // 宽字符:下划线、大写M、W、Q、G等
      num += 0.7
    } else if (a.match(/[A-Z]/gi) != null) {
      // 大写字母
      num += 0.6
    } else {
      // 其他ASCII字符(小写字母、数字、符号)
      num += 0.5
    }
  }
  return num
}

export default function useSaveTableParams(config = { isSave: true }) {
  const { t: $t } = useI18n()
  const isSave = config.isSave == false ? false : true //isSave:是否保存列配置
  const specialColumn = ['seq', 'checkbox', 'expand']
  const baseColumns = ref({})

  // 右键菜单
  const menuConfig = ref({
    header: {
      options: [
        { code: 'showAllColumn', name: $t('vxeTable.showAllColumn'), disabled: false },
        { code: 'columnWidthAuto', name: $t('vxeTable.ColumnWidthAuto'), disabled: false }
      ]
    },
    visibleMethod(params) {
      // // console.log(params.$event)
      const { options, column, $table, $event } = params
      if (params.$event.altKey) {
        return false
      } else {
        const isDisabled = !column
        options.forEach((list) => {
          list.forEach((item) => {
            item.disabled = isDisabled
            if (item.code == 'hideColumn') {
              if (
                (column.type && specialColumn.includes(column.type)) ||
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
      }
    },
    async menuClickEvent(context, $tablePro) {
      const { menu, column } = context
      let $table = $tablePro
      const { fullColumn } = $table.getTableColumn()
      if (!$table) {
        return
      }
      const $tableLayout = $table.$layout
      if (menu.type == 'gridLayout') {
        const layoutItem = $tableLayout?.userTemplates?.value.find(
          (it) => it[$tableLayout.tableConfig.layoutIdProp] == menu.code
        )
        $tableLayout.tempDefault.value = false
        // 切换模板并设为默认
        $tableLayout.updateDefaultLayout(layoutItem)
      } else {
        switch (menu.code) {
          case 'defaultLayout':
            // 使用默认布局
            $tableLayout?.useDefaultLayout()
            break
          case 'resetLayout':
            // 恢复默认布局
            $tableLayout?.resetDefaultLayout({ isRender: true })
            break
          case 'newLayout':
            $tableLayout.openNew('table')
            break
          case 'saveLayout':
            $tableLayout.saveUserLayout()
            break
          case 'saveTenantLayout':
            $tableLayout.saveTenantLayout()
            break
          case 'saveSystemLayout':
            $tableLayout.saveSystemLayout()
            break
          case 'saveAsLayout':
            $tableLayout.saveAs(ROLE_TYPE.USER)
            break
          case 'deleteLayout':
            const obj = $tableLayout.userTemplates.value.find((it) => it.isDefault)
            $tableLayout.deleteLayoutClick(obj)
            break
          case 'hideColumn':
            $table.hideColumn(column)
            saveTableConfig($table)
            // 同步更新弹窗的 showColumnsList 和 hideColumnsList
            if ($tableLayout && $tableLayout.showColumnsList) {
              const { fullColumn } = $table.getTableColumn()
              const newShowColumnsList: any[] = []
              const newHideColumnsList: any[] = []

              fullColumn.forEach((col) => {
                if (specialColumn.includes(col.type)) {
                  return
                }
                const existingShowItem = $tableLayout.showColumnsList.value.find((item) => item.field === col.field)
                const existingHideItem = $tableLayout.hideColumnsList?.value?.find((item) => item.field === col.field)
                const existingItem = existingShowItem || existingHideItem

                if (existingItem) {
                  if (col.visible) {
                    newShowColumnsList.push({ ...existingItem, isShow: true })
                  } else {
                    newHideColumnsList.push({ ...existingItem, isShow: false })
                  }
                }
              })

              $tableLayout.showColumnsList.value = newShowColumnsList
              if ($tableLayout.hideColumnsList) {
                $tableLayout.hideColumnsList.value = newHideColumnsList
              }
            }
            // autoSaveLayout($table) // 取消自动保存,改为手动保存
            break
          case 'showAllColumn':
            // 使用布局设置中的重置逻辑,恢复到上一级布局
            if ($tableLayout && $tableLayout.resetDefaultLayout) {
              await $tableLayout.resetDefaultLayout(false)
            }
            // resetDefaultLayout 已经更新了 showColumnsList真接应用到表格
            const showColumns = $tableLayout.showColumnsList?.value
            const hideColumns = $tableLayout.hideColumnsList?.value
            const fullColumn = $table.getTableColumn().fullColumn
            // 根据 showColumnsList 和 hideColumnsList 设置列的可见性
            fullColumn.forEach((col) => {
              if (specialColumn.includes(col.type)) {
                return //跳过特殊列
              }
              const isInShowList = showColumns.find((item) => item.field === col.field)
              const isInHideList = hideColumns.find((item) => item.field === col.field)
              if (isInShowList) {
                col.visible = true
              } else if (isInHideList) {
                col.visible = false
              }
            })
            // 重新加载列
            $table.reloadColumn(fullColumn)
            // fallback:如果没有扩展方法,显示所有列
            if (!$tableLayout || !$tableLayout.resetDefaultLayout) {
              fullColumn
                .filter((col) => !col.visible)
                .forEach((col) => {
                  $table.showColumn(col)
                })
            }
            saveTableConfig($table)
            // autoSaveLayout($table) // 取消自动保存,改为手动保存
            break
          case 'columnWidthAuto':
            let tableData = $table.getTableData().fullData
            const visibleColumns = fullColumn.filter((col) => col.visible)
            visibleColumns.forEach((col, colIndex) => {
              if (!specialColumn.includes(col.type)) {
                let len = getStrNum(col.title) * 24 || 0 // 计算标题宽度,增加系数提高准确性
                //遍历数据计算内容宽度
                tableData.forEach((item) => {
                  const value = item[col.field] || ''
                  let num = getStrNum(value)
                  const fieldw = num * 18 || 0 // 进一步增加内容宽度系数
                  if (fieldw > len) {
                    len = fieldw
                  }
                })
                // 排序图标补偿
                if (col.sortable) {
                  len += 60
                }
                // 检查是否包含下划线或多个大写字母,需要额外空间
                const hasUnderscore = (col.title || '').includes('_')
                const hasMultipleUpperCase = (col.title || '').match(/[A-Z]/g)?.length > 1
                let extraBuffer = 20
                if (hasUnderscore) {
                  extraBuffer += 15 // 下划线额外增加15px
                }
                if (hasMultipleUpperCase) {
                  extraBuffer += 10 // 多个大写字母额外增加10px
                }
                // 增加缓冲空间避免省略号,最小宽度90px
                const autoWidth = Math.max(len + extraBuffer, 90).toFixed(0)
                col.width = autoWidth
                // console.log('【col.width】', -121', col.title, autoWidth, col.width, col)
                // 最后一列的宽度设置
                if (colIndex === visibleColumns.length - 1) {
                  const tableContainer = document.getElementById($table.id)
                  const clientWidth = tableContainer?.clientWidth || 0 //容器宽度
                  //计算所有显示列的总宽度
                  const columnsWidthCount = visibleColumns.reduce((pre, cur) => {
                    return Number(cur.width) + pre
                  }, 0)
                  const remainingSpace = clientWidth - columnsWidthCount
                  //还有剩余空间
                  if (remainingSpace > 0) {
                    col.resizeWidth = Number(autoWidth) + Number(remainingSpace)
                    col.width = col.resizeWidth
                  } else {
                    col.resizeWidth = autoWidth
                  }
                }
              }
            })
            $table.reloadColumn(visibleColumns)
            setTimeout(() => {
              saveTableConfig($table)
            }, 0)
            break
          case 'clearFilter':
            $table.clearFilterPro()
            break
        }
      }
    }
  })

  function setLayoutMenu(e: any, $tablePro: any) {
    let layoutMenu: any[] = []
    // 布局列表
    const $tableLayout = $tablePro.$layout
    const tableConfig = $tableLayout.tableConfig
    const roleType = $tableLayout.roleType
    let hasUserDefault = false
    const layoutList = $tableLayout?.userTemplates?.value
    // 已有布局列表
    if ([ROLE_TYPE.TENANT, ROLE_TYPE.USER].includes(roleType)) {
      for (const index in layoutList) {
        const layoutItem = layoutList[index]
        let menuItem: any = {
          name: layoutItem.name,
          code: layoutItem[tableConfig.layoutIdProp],
          type: 'gridLayout',
          disabled: false
        }
        if (layoutItem.isDefault && !$tableLayout.tempDefault?.value) {
          hasUserDefault = menuItem.name !== tableConfig.DEFAULT_TEMP_NAME //排除默认布局
          menuItem.prefixConfig = { icon: 'layout-checked' } //当前布局
        }
        if (menuItem.name !== tableConfig.DEFAULT_TEMP_NAME) {
          layoutMenu.push(menuItem)
        }
      }
    }
    //默认布局
    layoutMenu.push({
      name: $t('vxeTable.default'),
      code: 'defaultLayout',
      prefixConfig: { icon: !hasUserDefault ? 'layout-checked' : '' },
      className: layoutList.length > 1 || hasUserDefault ? 'begin-group' : ''
    })
    if ([ROLE_TYPE.TENANT, ROLE_TYPE.USER].includes(roleType)) {
      if (!hasUserDefault) {
        //没有默认布局时，显示"新建"和"另存为"
        layoutMenu.push({
          name: $t('vxeTable.new'),
          code: 'newLayout',
          className: 'begin-group'
        })
      } else {
        //有默认布局时，显示"保存"、"另存为"、"删除"
        layoutMenu.push({
          className: 'begin-group',
          name: $t('vxeTable.save'),
          code: 'saveLayout'
        })
      }
      // Save As
      layoutMenu.push({
        name: $t('vxeTable.saveAs'),
        code: 'saveAsLayout'
      })
      // 删除
      layoutMenu.push({
        className: 'begin-group',
        name: $t('vxeTable.delete'),
        code: 'deleteLayout'
      })
    }
    // 保存 - 系统级
    if (roleType == ROLE_TYPE.SYSTEM) {
      layoutMenu.push({
        className: 'begin-group',
        name: $t('vxeTable.saveSystemLayout'),
        code: 'saveSystemLayout'
      })
    }
    // 保存 - 租户级
    if (roleType == ROLE_TYPE.TENANT) {
      layoutMenu.push({
        className: 'begin-group',
        name: $t('vxeTable.saveTenantLayout'),
        code: 'saveTenantLayout'
      })
    }
    return layoutMenu
  }

  const onHeaderCellMenu = (e: any, $tablePro: any) => {
    let layoutMenu = setLayoutMenu(e, $tablePro)
    e.options[0] = layoutMenu
    const $tableLayout = $tablePro.$layout
    const defaultLayoutMenu: any[] = []
    const isRequired = $tablePro.editRules?.[e.column.field]?.some((it) => it.required === true)
    if (!isRequired) {
      // 隐藏列
      defaultLayoutMenu.push({
        code: 'hideColumn',
        name: $t('vxeTable.hideColumn'),
        disabled: false,
        className: 'begin-group'
      })
    }
    // 必填列,系统级不显示取消隐藏列按钮
    if ($tableLayout.hideColumnsList.value.length) {
      defaultLayoutMenu.push({
        code: 'showAllColumn',
        name: $t('vxeTable.showAllColumn'),
        disabled: false
      }) // 取消日
    }
    // 添加恢复默认布局按钮
    if ($tableLayout.roleType === ROLE_TYPE.TENANT && $tableLayout.isUserDefaultActive.value) {
      defaultLayoutMenu.push({ code: 'resetLayout', name: $t('vxeTable.resetLayout'), disabled: false })
    }
    defaultLayoutMenu.push({ code: 'columnWidthAuto', name: $t('vxeTable.ColumnWidthAuto'), disabled: false })
    const isFilter = $tablePro.isFilter()
    if (isFilter) {
      defaultLayoutMenu.push({ code: 'clearFilter', name: $t('vxeTable.clearFilter'), disabled: false })
    }
    e.options[0] = layoutMenu.concat(defaultLayoutMenu)
  }

  // 表格属性-禁用列显示隐藏的勾选
  const customConfig = ($table: any) => {
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
  const resizableChange = ({ $table, column }: any) => {
    saveTableConfig($table)
    // autoSaveLayout($table) // 取消自动保存,改为手动保存
  }

  // 列拖拽结束方法
  const columnDragEnd = ({ $table, column, newIndex, oldIndex }: any) => {
    //调试:显示保存前的配置
    const columnConfig = getColumnConfig($table)
    saveTableConfig($table)
    // autoSaveLayout($table) // 取消自动保存,改为手动保存
  }

  // toolbar操作后方法
  const toolbarCustomEvent = ({ $table, type }: any) => {
    if ($table) {
      const { fullColumn } = $table.getTableColumn()
      // setColumnFixed设置指定、固定列
      // clearColumnFixed 取消指定、固定列
      // hideColumn 隐藏指定列
      // showColumn 显示、指定列
      // setColumnWidth 设置 宽
      // getColumnWidth 获取、宽
      switch (type) {
        case 'confirm': {
          saveTableConfig($table)
          break
        }
        case 'reset': {
          const oldColumns = baseColumns.value[$table.props.id]
          const refreshColumns = oldColumns.map((col) => fullColumn.find((ele) => ele.title === col.title))
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

  // 针对于树形表格,列合并
  const colspanMethod = ({ row, columnIndex, rowIndex, $table }: any) => {
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

  const exportTableData = ($table: any) => {
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
  const columnDrop = ($table: any) => {
    if (!$table.$el) return
    Sortable.create($table.$el.querySelector('.vxe-table--header .vxe-header--row'), {
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
        // fullColumn: 全量表头列 tableColumn:当前渲染中的表头列
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
  const connectToolbar = ($table: any, $toolbar: any) => {
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  }

  // 设置表格列的各项参数
  const setTableParams = (tableRef: any, columns: any[]) => {
    const { fullColumn } = tableRef.getTableColumn()
    fullColumn.sort((a, b) => {
      const indexA = columns.findIndex((col) => col.title === a.title)
      const indexB = columns.findIndex((col) => col.title === b.title)
      return indexA - indexB
    })
    columns.forEach((column) => {
      const col = fullColumn.find((ele) => ele.field === column.field || ele.title === column.title)
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

  //初始化
  const initTableConfig = async (tableRefs: any, toolbars?: any) => {
    if (!tableRefs) {
      return
    }
    //初始化表格扩展对象
    if (!tableRefs.$layout) {
      tableRefs.$layout = {}
    }
    if (!tableRefs.$layout.userTemplates) {
      tableRefs.$layout.userTemplates = ref([])
    }
    if (!tableRefs.$layout.tempDefault) {
      tableRefs.$layout.tempDefault = ref(false)
    }
    //设置一个简单的保存布局方法占位符
    if (!tableRefs.$layout.saveLayoutApi) {
      tableRefs.$layout.saveLayoutApi = async (silent = false) => {
        return Promise.resolve(true)
      }
    }

    const tableIds = getTableId(tableRefs)
    const columnsData = await getColumnsData(tableIds) //模拟数据
    if (isDataType(tableRefs, 'object') && isDataType(toolbars, 'object')) {
      connectToolbar(tableRefs, toolbars)
      columnDrop(tableRefs)
      if (isSave) {
        getBaseColumns(tableRefs)
        columnsData[tableRefs.id] && setTableParams(tableRefs, columnsData[tableRefs.id])
      }
    }
  }

  const getColumnsData = async (tableIds: string | string[]) => {
    const data = await getTableConfig(tableIds)
    return data
  }

  const getTableId = (tableRefs: any): string[] => {
    const ids: string[] = []
    if (isDataType(tableRefs, 'array')) {
      tableRefs.forEach(($table) => {
        ids.push($table.id)
      })
    } else if (isDataType(tableRefs, 'object')) {
      ids.push(tableRefs.id)
    }
    return ids
  }

  const getBaseColumns = ($table: any) => {
    const columns = $table.getTableColumn()
    const fullColumn = JSON.parse(JSON.stringify(columns.fullColumn))
    baseColumns.value[$table.id] = fullColumn
  }

  const getColumnConfig = ($table: any, type: string = 'default') => {
    const { fullColumn } = $table.getTableColumn()
    let columnConfig = []
    if (type === 'default') {
      columnConfig = fullColumn.map((column, index) => {
        // 使用当前循环的index,而不是 findIndex,这样能正确反映拖拽后的顺序
        return {
          field: column.field,
          title: column.title || column.type,
          width: column.resizeWidth || column.renderWidth,
          fixed: column.fixed,
          visible: column.visible,
          index
        }
      })
    } else {
      columnConfig = []
    }
    return columnConfig
  }

  const saveTableConfig = ($table: any, type: string = 'default') => {
    if (!isSave) return
    const tableId = $table?.id || $table.props.id
    const columnConfig = getColumnConfig($table, type)
    setTableConfig(tableId, columnConfig)
  }

  // 防抖定时器
  let autoSaveTimer = null

  onUnmounted(() => {
    baseColumns.value = {}
    // 清理自动保存定时器
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
      autoSaveTimer = null
    }
  })

  return {
    initTableConfig,
    resizableChange,
    columnDragEnd,
    onHeaderCellMenu,
    toolbarCustomEvent,
    colspanMethod,
    customConfig,
    menuConfig,
    exportTableData,
    saveTableConfig,
    getColumnConfig,
    setTableConfig
    // autoSaveLayout
  }
}
