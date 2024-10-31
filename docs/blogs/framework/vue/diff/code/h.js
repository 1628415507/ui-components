/*
 * @Description: 产生虚拟DOM树
 * @Date: 2024-10-15 14:23:18
 * @LastEditTime: 2024-10-15 14:50:32
 */
import vnode from './vnode'
/**
 * 产生虚拟DOM树，返回的一个对象
 * 低配版本的h函数要求：这个函数必须接受三个参数，缺一不可
 * @param {*} sel
 * @param {*} data
 * @param {*} c
 * 调用的c只有三种形态 文字、数组、h函数
 * 形态①：h('div', {}, '文字')：字符串
 * 形态②：h('div', {}, [])：数组
 * 形态③：h('div', {}, h())：h()调用的同时已经被执行，相当于获取的是一个执行后返回的对象h('div', {}, h函数执行返回的对象
 */
// vnode ('选择器sel', 'data属性样式', '子元素children', '文本内容text', '真正的dom节点elm')
export default function (sel, data, c) {
  // 检查参数个数
  if (arguments.length !== 3) {
    throw new Error('目前必须只传入三个参数！')
  }
  // 检查第三个参数 c 的类型
  if (typeof c === 'string' || typeof c === 'number') {
    // 说明现在调用h函数是形态① —— h('div', {}, '文字')
    return vnode(sel, data, undefined, c, undefined)
  } else if (Array.isArray(c)) {
    // 说明现在调用h函数是形态②（数组）—— h('div', {}, [])
    let children = []
    // 遍历 c 数组，收集children
    for (let item of c) {
      // 检查 item必须是一个对象，如果不满足则抛出错误
      if (!(typeof item === 'object' && item.hasOwnProperty('sel'))) {
        throw new Error('传入的数组参数中有不是h函数') //h函数执行返回的结果必须是一个对象,因为VNode返回的一定是一个对象
      }
      // ☆☆☆ 这里不用执行item,因为调用语句中已经有了执行
      // ☆☆☆ c数组中的item是调用h函数执行之后返回的一个vnode对象
      // ☆☆☆ 所以不用执行item, 只要收集数组中的item就好了
      children.push(item)
    }
    //循环结束，children收集完毕，返回有children属性的虚拟节点
    return vnode(sel, data, children, undefined, undefined)
  } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
    // 说明是形态③：是一个对象（h函数返回值是一个对象）
    let children = [c] // 放到children数组中就行了
    return vnode(sel, data, children, undefined, undefined)
  } else {
    throw new Error('传入的第三个参数类型不对')
  }
}