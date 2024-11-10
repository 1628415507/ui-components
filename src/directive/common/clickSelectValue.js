const handleSelectClick = (el) => {
  el.querySelector('input').select()
}

export default {
  mounted(el) {
    const clickHandler = () => handleSelectClick(el)
    el.addEventListener('click', clickHandler)

    el._clickHandler = clickHandler
  },
  unmounted(el) {
    el.removeEventListener('click', el._clickHandler)
  }
}
