/*
 * @Description:两个表格间拖拽的方法
 * @Date: 2024-05-24 16:55:42
 * @LastEditTime: 2024-12-31 16:33:32
 */
import Sortable from 'sortablejs'
import { nextTick, ref,onUnmounted } from 'vue'

// 判断鼠标是否在div内
function isInside(event, $table) {
  const { clientX, clientY } = event // 获取鼠标相对于页面的位置
  let targetEl = $table.$el
  const rect = targetEl?.getBoundingClientRect() // 获取div的位置和大小
  const { left, right, top, bottom } = rect
  // 判断鼠标是否在div内
  return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom
} // 表格列拖拽

// 初始化 sortable 实现拖动
function initTablesDrag(target, config) {
  // dataChange：数据变化的回调事件
  // dragEnd：拖拽结束的回调事件
  // target：互相拖拽的表格对象
  const { dragEnd, dataChange } = config
  const pullRef = target[0]
  const putRef = target[1]
  const pullIndex = ref('') // 开始拖拽时的位置
  let pullInstance
  let putInstance
  // 绑定表格拖拽事件
  function bindDrag($pullRef, $putRef) {
    if (!$pullRef) {
      return
    }
    return Sortable.create($pullRef?.$el?.querySelector('.body--wrapper>.vxe-table--body tbody'), {
      handle: '.vxe-body--row',
      // animation: 150,
      group: {
        name: 'name',
        pull: true,
        put: true // () => { return true}
      },
      // 开始拖拽的回调方法
      onStart: function (evt) {
        pullIndex.value = evt.oldIndex
        // console.log('【 开始拖拽  】-47', pullIndex.value)
      },
      // 元素从其他列表拖拽到当前列表的回调方法(当前列表为空不会触发)
      onAdd: function (evt) {
        const pullData = $pullRef?.data || [] //
        const putData = $putRef?.data || [] //
        // console.log(`【 移入-evt 】-101`, $pullRef.id, '===', evt)
        const { newIndex, oldIndex } = evt
        const newRow = putData[pullIndex.value]
        // console.log('【 newRow 】-53', newIndex, newRow, putData)
        pullData.splice(newIndex, 0, newRow)
        nextTick(() => {
          $pullRef.reloadData(pullData) //重新渲染数据
          dataChange && dataChange($pullRef, $putRef)
        })
      },
      // 元素从当前列表中移除进入其他列表的回调方法
      onRemove: function (evt) {
        const pullData = $pullRef?.data || [] //
        //// console.log('【 移出-evt 】-114', $pullRef.id, '===', evt)
        const { oldIndex } = evt
        pullData.splice(oldIndex, 1)
        dataChange && dataChange($pullRef, $putRef)
      },
      // 列表内元素顺序更新的时候触发
      onUpdate: function (evt) {
        const pullData = $pullRef?.data || [] //
        const { newIndex, oldIndex } = evt
        const currRow = pullData.splice(oldIndex, 1)[0]
        pullData.splice(newIndex, 0, currRow)
        nextTick(() => {
          $pullRef.reloadData(pullData) //重新渲染数据
        })
      },
      // 结束拖拽
      onEnd: function (evt) {
        const pullData = $pullRef?.data || [] //
        const putData = $putRef?.data || [] //
        const { newIndex, oldIndex } = evt
        console.log('【结束拖拽- newIndex, oldIndex 】-86', evt, newIndex, oldIndex)
        //// console.log('【 结束拖拽-evt 】-133', evt)
        // 目标元素没有值
        if (isInside(evt.originalEvent, $putRef) && !putData.length) {
          const currRow = pullData.splice(pullIndex.value, 1)[0]
          putData.push(currRow)
          nextTick(() => {
            $putRef.reloadData(putData) //重新渲染数据
            dataChange && dataChange($pullRef, $putRef)
          })
        }
        dragEnd && dragEnd($pullRef, $putRef)
      }
    })
  }
  nextTick(() => {
    pullInstance = bindDrag(pullRef, putRef)
    putInstance = bindDrag(putRef, pullRef)
  })
  // 销毁实例
  function destroy() {
    pullInstance?.destroy()
    putInstance?.destroy()
  }

  onUnmounted(() => {
    destroy()
  })
  // return {
  //   destory
  // }
}

export { initTablesDrag }
