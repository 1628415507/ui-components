import { VxeTableInstance } from 'vxe-table'
import { ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
// import { formatRowStatusList } from '@/utils/format'
const enum ROW_STATUS {
  NEW = 4,
  MODIFIED = 16,
  DELETE = 8,
  ORIGIN = 2
}
export type VxeTableExt = vxeTableExt & VxeTableInstance

/**
 * 使用代理模式扩展VxeTable功能,兼容dxDataGridExt的API
 */
export default class vxeTableExt {
  private readonly table: VxeTableInstance & { $extend?: any }
  private proxy: any

  private constructor(tableInstance: VxeTableInstance, proxy?: any) {
    this.table = tableInstance as any
    this.proxy = proxy || getCurrentInstance()?.proxy
    // 兼容性扩展对象
    if (!this.table.$extend) {
      ;(this.table as any).$extend = {
        selectedRowKeys: ref([]),
        newRows: ref([]),
        clear: this.clear.bind(this)
      }
    }
  }

  /**
   * 代理VxeTable对象 - 兼容dxDataGridExt.proxy
   */
  static proxy(table: VxeTableInstance, options?: any, proxy?: any): VxeTableExt {
    const tableExt = new vxeTableExt(table, proxy)
    return new Proxy(table, {
      get: (target, prop) => {
        let obj: any = target
        if ((tableExt as any)[prop]) {
          obj = tableExt
        }
        const value = (obj as any)[prop]
        if (typeof value === 'function') {
          return (...args: Array<any>) => {
            return value.apply(obj, args)
          }
        }
        return value
      }
    }) as VxeTableExt
  }

  /**
   * 创建新实例 - 兼容dxDataGridExt.newInstance
   */
  static newInstance(table: VxeTableInstance, options?: any, proxy?: any): VxeTableExt {
    return vxeTableExt.proxy(table, options, proxy)
  }

  // ==================== 扩展方法 ====================

  /**
   * 添加行
   */
  addRow(physicalRow: number, records: any): Promise<void> {
    // console.log(' 【physicalRow】 -144', physicalRow)
    if (!Array.isArray(records)) {
      records = [records]
    }
    if (physicalRow === 0) {
      this.table.insert(records) //insert才会触发表格的新增状态
    } else {
      this.table.insertAt(records, physicalRow) //insert才会触发表格的新增状态
    }
    return Promise.resolve()
  }

  /**
   * zhaungwx01, 2个月前 feat task#1455789加入延时函数处理快捷键国际化弹窗与modal冲突问题...
   * 获取新增和修改的记录
   */
  getAddedAndModifedRecords(): Array<any> {
    const allData = this.table.getTableData().tableData
    return allData.filter((record: any) => record.rowStatus && record.rowStatus !== ROW_STATUS.ORIGIN)
    // return formatRowStatusList(this.table)
  }

  /**
   * 检查行是否为新增状态
   */
  isNewRow(row: any): boolean {
    return row && row.rowStatus === ROW_STATUS.NEW
  }

  /**
   * 检查行是否为修改状态
   */
  isModifiedRow(row: any): boolean {
    if (row && !this.isNewRow(row) && this.table?.keepSource === true) {
      return this.table?.isUpdateByRow(row) //只对 keep-source 开启有效,判断行数据是否发生改变
    }
    return row && row.rowStatus === ROW_STATUS.MODIFIED
  }

  /**
   * 获取导出字段
   */
  getExportFields(): Array<string> {
    const columns = this.table.getColumns()
    const exportFields: Array<string> = []
    const columnsFilter = columns.filter(
      (col) => !['seq', 'checkbox', 'expand'].includes(col.type) && col.visible !== false
    )
    columnsFilter.forEach((column) => {
      const title = column.title || column.field
      exportFields.push(column.field)
      exportFields.push(`${column.field}|${title}`)
    })
    return exportFields
  }

  /**
   * 获取选中行(带提示)
   */
  getCheckedRowsWithTips(): Array<any> {
    const checkedRows = this.getCheckedRows()
    if (checkedRows.length === 0) {
      const message = this.proxy?.$t('tip.checkRecord') || '请选择记录'
      ElMessage.warning(message, () => {})
      throw new Error('【请选择记录】')
    }
    return checkedRows
  }

  /**
   * 获取单选行(带提示)
   */
  getCheckedOneRowWithTips(): Array<any> {
    const checkedRows = this.getCheckedRows()
    if (checkedRows.length !== 1) {
      const message = this.proxy?.$t('tip.checkOneRecord') || '请选择一条记录'
      ElMessage.warning(message, () => {})
      throw new Error('【请选择一条记录】')
    }
    return checkedRows
  }

  /**
   * 获取待删除行(带提示)
   */
  getDeleteRowsWithTips(): Array<any> {
    const checkedRows = this.getCheckedRows()
    if (checkedRows.length === 0) {
      const message = this.proxy?.$t('tip.jsWantToDelete') || '请选择要删除的记录'
      ElMessage.warning(message, () => {})
      throw new Error('【请选择要删除的记录】')
    }
    return checkedRows
  }

  /**
   * 获取选中行
   */
  getCheckedRows(): Array<any> {
    return this.table.getCheckboxRecords()
  }

  /**
   * 清空方法
   */
  clear(): void {
    this.table.clearCheckboxRow()
    this.table.clearRadioRow()
    this.table.clearCurrentRow()
  }
}
