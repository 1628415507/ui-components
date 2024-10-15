/*
 * @Description:
 * @Date: 2024-10-15 14:53:04
 * @LastEditTime: 2024-10-15 14:59:32
 */
// ==================== patchVnode.js ====================
export default function patchVnode(oldVnode, newVnode) {
  console.log('【 oldVnode, newVnode 】-8', oldVnode, newVnode)
  // 1. 判断新旧 vnode 是否是同一个对象
  if (oldVnode === newVnode) return
  // 2. 判断 newVndoe 有没有 text 属性
  if (newVnode.text && !newVnode.children?.length) {
    // 2.1 newVnode 有 text属性
    // 2.1.1 判断 newVnode 与 oldVnode 的 text 属性是否相同
    // 如果newVnode中的text和oldVnode的text不同，那么直接让新text替换老elm中的text即可。
    // 如果oldVnode中是children，也会立即消失
    if (newVnode.text !== oldVnode.text) {
      oldVnode.elm.innerText = newVnode.text
    }
  } else {
    // 2.2 newVnode 没有 text属性，即有children属性
    // 2.2.1 判断 oldVnode 有没有 children 属性
    if (oldVnode.children?.length) {
      // ☆☆☆ oldVnode有children属性 最复杂的情况，新老节点都有children
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children) // 见updateChildren.js
    } else {
      // 2.2.2 （oldVnode没有children属性，说明是text） && （newVnode有children属性）
      // 将oldVnode的text内容清空，替换成新的子节点
      oldVnode.elm.innerHTML = ''
      // 遍历新的vnode虚拟节点的子节点，创建DOM，上树
      for (let ch of newVnode.children) {
        let chDOM = createElement(ch)
        oldVnode.elm.appendChild(chDOM)
      }
    }
  }
}
