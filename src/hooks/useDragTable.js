import Sortable from 'sortablejs'
import { ref, nextTick, onMounted } from 'vue'

export default function useDragTable() {
  // 行拖拽
  const rowDrop = ($table, tableData) => {
    Sortable.create($table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
      handle: '.drag-btn',
      ghostClass: 'dragColumnColbg',
      chosenClass: 'dragColumnColbg',
      onEnd: (sortableEvent) => {
        const newIndex = sortableEvent.newIndex
        const oldIndex = sortableEvent.oldIndex
        const currRow = tableData.splice(oldIndex, 1)[0]
        tableData.splice(newIndex, 0, currRow)
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
      }
    })
  }

  const connectToolbar = ($table, $toolbar) => {
    if ($table && $toolbar) {
      $table.connect($toolbar)
    }
  }

  const setDragTable = ($table, tableData, $toolbar) => {
    connectToolbar($table, $toolbar)
    rowDrop($table, tableData)
    columnDrop($table)
  }

  return {
    setDragTable
  }
}
