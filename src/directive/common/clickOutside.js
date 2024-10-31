// 点击元素外的区域触发的事件
export default {
  mounted(el, binding) {
    // 在元素上绑定一个事件监听器
    el.clickOutsideEvent = function (event) {
      // 判断点击事件是否发生在元素外部
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event) // 如果是外部点击，则执行绑定的函数
      }
    }
    // 在全局添加点击事件监听器
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}