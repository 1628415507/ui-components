const handleInputFocus = (el, binding, vnode, prevVnode) => {
  const allDom = el.querySelectorAll('*')
  const types = binding.value && binding.value.length > 0 ? binding.value : ['input', 'textarea', 'button']
  const code = binding.arg ? binding.arg : 'enter'
  // 先绕过不需要回车聚焦的元素，再根据 types 筛选出符合表单类型的元素
  const inputs = Array.from(allDom)
    .filter((item) => !item.dataset.nokeyfocus)
    .filter((dom) => {
      return types.some((item) => dom.tagName.toLowerCase() === item)
    })
  if (inputs && inputs.length > 0) {
    if (code === 'enter') {
      addEvent('enterIndex')
    } else if (code === 'arrow') {
      addEvent('arrowIndex')
    }
  }
  function addEvent(__index__) {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute(__index__, i)
      inputs[i].addEventListener(
        'keyup',
        (e) => {
          let attrIndex = e.srcElement.getAttribute(__index__)
          let comIndex = parseInt(attrIndex)
          if (code === 'enter' && !inputs[i].dataset.nokeyenter) {
            if (e.keyCode === 13) {
              activeNextFocus(comIndex)
            }
          }
          if (code === 'arrow') {
            if (e.keyCode === 37) {
              // 向左
              activePrevFocus(comIndex)
            }
            if (e.keyCode === 39) {
              // 向右
              activeNextFocus(comIndex)
            }
          }
        },
        true
      )
    }
  }
  function activeNextFocus(index) {
    if (index < inputs.length - 1) {
      if (inputs[index + 1].disabled) {
        activeNextFocus(index + 1)
      } else {
        inputs[index + 1].focus()
      }
    } else {
      activeNextFocus(-1)
    }
  }
  function activePrevFocus(index) {
    if (index > 0) {
      if (inputs[index - 1].disabled) {
        activePrevFocus(index - 1)
      } else {
        inputs[index - 1].focus()
      }
    } else {
      activePrevFocus(inputs.length)
    }
  }
}
export default {
  mounted: (el, binding, vnode, prevVnode) => {
    nextTick(() => {
      setTimeout(() => {
        handleInputFocus(el, binding, vnode, prevVnode)
      }, 5)
    })
  },
  updated: (el, binding, vnode, prevVnode) => {
    nextTick(() => {
      setTimeout(() => {
        handleInputFocus(el, binding, vnode, prevVnode)
      }, 5)
    })
  }
}
