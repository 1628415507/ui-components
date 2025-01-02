/*
 * @Description:表格键盘事件
 * @Date: 2024-08-07 18:01:28
 * @LastEditTime: 2025-01-02 17:40:53
 */
const types = ['input', 'select', 'textarea']
const KEY_CODES = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13
}
// 元素是否可聚焦
function focusable(element) {
  const noKeyFocus = element.dataset?.enterindex == -1 || element.tabindex == -1 // 不需要回车聚焦的元素(data-enterindex="-1")
  const isFileInput = element.type == 'file' // 是否是上传类型
  const disabled = element.disabled // 禁用的元素
  return !noKeyFocus && !isFileInput && !disabled
}
// 获取可聚焦的元素
function getFocusableInputs(rowElement) {
  const selectors = rowElement.querySelectorAll(types.join(','))
  return Array.from(selectors).filter((item) => {
    return focusable(item)
  })
}
// 上下键切换行
function handleUnpDown(params) {
  const { $event, $table } = params
  let $editRecord = $table.getEditRecord()
  let field = $editRecord.column.field
  let rowIndex = $editRecord.rowIndex
  let tableData = $table.getTableData().fullData
  let newRowIndex = 0
  // 向上
  if (rowIndex > 0 && $event.keyCode === KEY_CODES.UP) {
    newRowIndex = rowIndex - 1
  }
  // 向下
  if ($event.keyCode === KEY_CODES.DOWN) {
    newRowIndex = rowIndex + 1
  }
  if (rowIndex == newRowIndex) {
    return
  }
  const nextRow = tableData[newRowIndex]
  $table.setEditRow(nextRow, field) //激活行编辑并激活指定单元格
  // $table.setEditRow(nextRow) //激活行编辑并激活第一个单元格
  // console.log('【  $editRecord.column.field 】-64', $editRecord.column.field)
  // console.log('【 $event.key  】-16', $event.keyCode, newRowIndex)
}
// 回车键换下一行
async function handleEnter(params) {
  const { $event, $table,isSelect } = params
  // console.log('【 回车 】-100', isSelect,$event, $event.preventDefault())
  let $editRecord = $table.getEditRecord()
  const curCellEl = $editRecord.cell
  const rowElement = curCellEl.parentElement //当前单元格所在行
  const rowInputs = getFocusableInputs(rowElement) //所在行的输入框
  const activeInput = $event.srcElement // //触发回车事件的元素document.activeElement
  const index = Array.from(rowInputs).findIndex((item) => {
    return item === activeInput
  })
  let curIndex = index + 1 //当前输入框的顺序
  let rowIndex = $editRecord.rowIndex //当前行的顺序
  let tableData = $table.getTableData().fullData
  // 当前行的最后一个元素换行
  if (rowIndex !== tableData.length - 1 && curIndex > rowInputs.length - 1) {
    let nextRowIndex = rowIndex + 1
    // if ( $event.preventDefault) {
    // $event.preventDefault()
    // } else {
    //   $event.returnValue = false
    // }
    const nextRow = tableData[nextRowIndex]
    await $table.setEditRow(nextRow) //激活下一行行编辑并激活第一个单元格
    // 处理下一行的第一个输入框被跳过的问题（和全局的回车事件冲突）
    let $nextEditRecord = $table.getEditRecord()
    const nextRowElement = $nextEditRecord.cell.parentElement
    const nextRowInputs = getFocusableInputs(nextRowElement) //
    // console.log('【 nextRowInputs 】-87', nextRowInputs)
    const nextFocusInput = nextRowInputs[0]
    !isSelect&&nextFocusInput.setAttribute('focused', true) //设置focused属性，代表已处理过聚焦
    nextFocusInput.focus()
  }
}
export const tableKeydown = async (params) => {
  const { keyCode } = params.$event
  // 回车
  if (keyCode === KEY_CODES.ENTER) {
    handleEnter(params)
  }
  //上下切换行
  if (keyCode === KEY_CODES.UP || keyCode === KEY_CODES.DOWN) {
    handleUnpDown(params)
  }
  // // 左右键事件
  // if (keyCode === KEY_CODES.LEFT || keyCode === KEY_CODES.RIGHT) {
  // }
}

export default {
  tableKeydown
}
