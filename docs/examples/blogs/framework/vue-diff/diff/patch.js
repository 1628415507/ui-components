/*
 * @Description: 
 * @Date: 2024-10-15 14:23:25
 * @LastEditTime: 2024-10-15 14:47:16
 */
import vnode from './vnode'
import createElement from './createElement'

export default function (oldVnode, newVnode) {
  console.log('【 oldVnode, newVnode 】-10', oldVnode, newVnode)
  // 1.判断传入的第一个参数是 DOM节点 还是 虚拟节点
  if (oldVnode.sel == '' || oldVnode.sel === undefined) {
    // 说明oldVnode是DOM节点，此时要包装成虚拟节点
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(), // sel
      {}, // data：data.key
      [], // children
      undefined, // text
      oldVnode // elm
    )
  }
  // 2.判断 oldVnode 和 newVnode 是不是同一个节点（key、标签名）
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
    //=====================================================
    console.log('是同一个节点，需要精细化比较')
    // patchVnode(oldVnode, newVnode)
    //=====================================================
  } else {
    console.log('不是同一个节点，暴力 插入新节点，删除旧节点')
    const newVnodeElm = createElement(newVnode) // （1）创建 新虚拟节点 为 DOM节点
    console.log('【 newVnodeElm 】-31', newVnodeElm)
    const oldVnodeElm = oldVnode.elm // （2）要操作DOM，所以都要转换成 DOM节点
    // 3. 如果存在新节点，则更换旧节点（插入“新节点”到“旧节点”之前，删除旧节点）
    if (newVnodeElm) {
      //  oldVnodeElm.parentNode：父节点
      oldVnodeElm.parentNode?.insertBefore(newVnodeElm, oldVnodeElm) // 判断newVnodeElm是存在的,在旧节点之前插入新节点
      console.log('【 父节点 】-35', oldVnodeElm.parentNode)
    }
    oldVnodeElm.parentNode?.removeChild(oldVnodeElm) // 删除旧节点
  }
}