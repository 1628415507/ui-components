/*
 * @Description:
 * @Date: 2024-10-30 13:52:27
 * @LastEditTime: 2024-10-30 14:32:20
 */
const handleDragClick = (event) => {
  event.preventDefault() // 阻止默认的拖拽行为
}

export default {
  mounted(el) {
    const dragHandler = (e) => handleDragClick(e)
    el.addEventListener('dragstart', dragHandler)
    el._dragHandler = dragHandler
  },
  unmounted(el) {
    el.removeEventListener('dragstart', el._dragHandler)
  }
}
