export default {
  mounted(el, binding) {
    //当被绑定的元素插入到 DOM 中时
    el.onmousedown = function (e) {
      let maxLeft = e.target.parentNode.offsetWidth - e.target.offsetWidth
      let maxTop = e.target.parentNode.offsetHeight - e.target.offsetHeight

      let x = e.clientX - e.target.offsetLeft
      let y = e.clientY - e.target.offsetTop

      document.onmousemove = function (eve) {
        eve.preventDefault()
        let w = eve.clientX - x
        let h = eve.clientY - y

        if (w <= 0) w = 0
        if (h <= 0) h = 0
        if (w > maxLeft) w = maxLeft
        if (h > maxTop) h = maxTop

        e.target.style.left = w + 'px'
        e.target.style.top = h + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
