export function deepClone(obj: any, weakMap = new WeakMap()) {
  // 【0】. 处理循环引用：
  if (getDataType(weakMap) !== 'WeakMap') {
    weakMap = new WeakMap() // 解决第一次调用，用户传入第二个参数，并且不是weakMap类型
  }
  // 判断是否存在循环引用
  if (weakMap.has(obj)) {
    console.log('【 存在循环引用 】-13')
    return weakMap.get(obj) //不进入后面的递归代码，避免循环引用造成死循环
  }
  //【1】. 判断值类型和引用类型：
  // 非对象、数组：typeof来判断对象和数组，因为这种类型都会返回object
  if (obj === null || typeof obj !== 'object') {
    // 处理Symbol类型
    if (getDataType(obj) == 'Symbol') {
      return Symbol(obj.description) // Symbol数据基本数据类型,但是作为值时希望其是独一无二的，所以需要重新创建。
    }
    return obj
  }
  // 可通过 instanceof 操作符来判断对象的具体类型，或是否是某个对象的实例
  if (obj instanceof RegExp) {
    return new RegExp(obj) // 正则对象的实例
  }
  if (obj instanceof Date) {
    return new Date(obj) // 日期对象的实例
  }
  // ...function

  // 【2】. 判断是数组还是对象
  let newObj: [] | {} // 创建空变量
  if (obj instanceof Array) {
    newObj = [] // 创建空数组，改变内存地址，不再指向被复制的内存地址
  } else {
    newObj = new obj.constructor() // 创建空对象，改变内存地址
  }
  weakMap.set(obj, newObj) //保存对象引用
  for (let key in obj) {
    //保证key不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 【3】. 递归
      newObj[key] = deepClone(obj[key], weakMap)
      //newObj[key] = arguments.callee(obj[key]);  //使用arguments.callee就可以让函数逻辑与函数名解耦
    }
  }
  return newObj
}

// 获取对象的数据类型
function getDataType(val: any) {
  let str = Object.prototype.toString.call(val)
  return str.slice(8, str.length - 1)
}
