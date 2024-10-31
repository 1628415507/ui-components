/*
 * @Description: 
 * @Date: 2024-10-15 14:25:14
 * @LastEditTime: 2024-10-15 14:25:32
 */
/**
 * 创建节点。将vnode虚拟节点创建为DOM节点
 * 是孤儿节点，不进行插入操作
 * @param {object} vnode
 */
export default function createElement(vnode) {
  // 1.根据虚拟节点sel选择器属性 创建一个DOM节点，这个节点现在是孤儿节点
  let domNode = document.createElement(vnode.sel)
  // 2.判断是有子节点还是有文本
  if (vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
    domNode.innerText = vnode.text // 说明没有子节点，内部是文本
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 3.说明内部是子节点，需要递归创建节点
    // 4.遍历数组
    for (let ch of vnode.children) {
      // 5.递归创建子节点，一旦调用createElement意味着创建出DOM了。并且它的elm属性指向了创建出的dom，但是没有上树，是一个孤儿节点
      let childDOM = createElement(ch) // 得到 子节点 表示的 DOM节点 递归最后返回的一定是文本节点
      console.log(ch)
      // 6.文本节点 上domNode树
      domNode.appendChild(childDOM) //appendChild将一个节点附加到指定父节点的子节点列表的末尾处。
    }
  }
  // 7.补充虚拟节点的elm属性,代表已经成为真实节点
  vnode.elm = domNode
  // 8.返回domNode DOM对象
  return domNode
}