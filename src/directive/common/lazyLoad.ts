// 触底加载事件
export default {
  mounted(el, binding) {
    //解构传来的值
    const { selector, loadMethod } = binding.value
    const scrollDom = document.querySelector(selector)
    if (scrollDom) {
      // 监听事件的处理函数，把函数单独写出来，方便销毁
      const scrollHandler = () => {
        const isToBottom = scrollDom.scrollTop + scrollDom.clientHeight >= scrollDom.scrollHeight - 1
        if (isToBottom) {
          loadMethod()
        }
      }
      //赋值，为了方便销毁，这里很重要，不然销毁的时候找不到dom和对应的回调函数！！！

      el.loadDom = scrollDom
      el.loadEvent = scrollHandler

      //监听滚动事件
      scrollDom?.addEventListener('scroll', scrollHandler)
    }
  },
  //销毁，会在关闭弹窗时触发（这里的el-select写在弹窗里）
  beforeUnmount(el) {
    if (el.loadDom) {
      el.loadDom.removeEventListener('scroll', el.loadEvent)
    }
  }
}
