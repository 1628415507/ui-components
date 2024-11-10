// const inputArr = ref([
//   { key: 'control+alt+0', value: '这是0的文本' }
// ])
const forbidKeyboard = ref(false) // forbidKeyboard 为 true，取消快捷键
const keydown = ref('')
const arrKey = ref([])

const handleKeyDown = (e, input) => {
  const shortCutConfig = localStorage.getItem('shortCutConfig')
  if (arrKey.value.length > 0) {
    // 长按去重
    if (arrKey.value.indexOf(e.key.toLowerCase()) >= 0) {
      return
    }
  }
  if (!e.metaKey) {
    arrKey.value.push(e.key.toLowerCase())
    keydown.value = arrKey.value.join('+')
  }
  if (shortCutConfig) {
    let inputArr = JSON.parse(shortCutConfig)
    const inputKeys = inputArr.map((item) => item.shoutCutKey)
    if (inputKeys.some((key) => keydown.value.includes(key))) {
      if (forbidKeyboard.value) {
        // e.preventDefault()
        preventEvent(e)
        return
      }
      let keyItem = inputArr.find((item) => keydown.value.includes(item.shoutCutKey))
      keydown.value = ''
      if (keyItem) {
        e.target.value = keyItem.shortcutCopyContent
        e.target.dispatchEvent(new Event('input'))
      }
      // e.preventDefault() // 取消浏览器原有的操作
      preventEvent(e)
    }
  }
}
const handleKeyUp = (e, input) => {
  arrKey.value.splice(arrKey.value.indexOf(e.key.toLowerCase()), 1)
  keydown.value = arrKey.value.join('+')
  // e.preventDefault()
  preventEvent(e)
}

const preventEvent = (e) => {
  e.preventDefault()
}

export default {
  mounted: (el, binding, vnode, prevVnode) => {
    nextTick(() => {
      const allDom = el.querySelectorAll('*')
      const inputs = Array.from(allDom)
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].tagName.toLowerCase() === 'input' || inputs[i].tagName.toLowerCase() === 'textarea') {
          inputs[i].onfocus = () => {
            document.addEventListener('keydown', (e) => handleKeyDown(e, inputs[i]))
            document.addEventListener('keyup', (e) => handleKeyUp(e, inputs[i]))
          }
        }
      }
    })
  },
  unmounted: (el, binding, vnode, prevVnode) => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  }
}
