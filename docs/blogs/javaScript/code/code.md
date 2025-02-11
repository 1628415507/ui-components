## 【有效括号匹配】

> - 参考地址：https://zhuanlan.zhihu.com/p/358088483
> - [动画图解](https://www.zhihu.com/zvideo/1355905807280689152)

- 时间复杂度为 O(N)。需要遍历一遍字符串。

```js{3,15}
function Solution(s) {
  // 当字符串长度为奇数的时候，属于无效情况
  if (!s.length || s.length % 2 == 1) {
    return false
  }
  let stack = [] //构建栈
  //由外向内遍历字符串
  for (let c of s) {
    if (c == '(') {
      stack.push(')')
    } else if (c == '[') {
      stack.push(']')
    } else if (c == '{') {
      stack.push('}')
    } else if (!stack.length || c != stack.pop()) {// ☆ ☆ ☆
      return false //表明有多余的括号
    }
  }
  return !stack.length
}
const str = '{[()]}'
const res = Solution(str)
console.log('【 res 】-32', res)
```

## 【手写 new】

### 思路分析：

1. **创建**：创建一个新的空对象`let obj = {}`
1. **继承**：继承了构造函数的原型`obj.__proto__ = fn.prototype`  
   (即** 让新对象的`proto`指向原函数的 prototype**)。
1. **执行：执行构造函数方法`let result = fn.apply(obj, args)`  
   **把构造函数方法的属性和方法都添加到**this 引用的对象**中，让 this 指向这个新的对象
1. **返回**：返回这个新对象`return result instanceof Object ? result : obj`
   (如果构造函数中没有返回新对象，那么返回 this，即创建新对象；否则，返回构造函数中返回的对象。).

### 代码：

```js{5,8}
function myNew(fn, ...args) {
  // 1.创建一个空对象
  let obj = {}
  // 2.使空对象的隐式原型指向原函数的显式原型
  obj.__proto__ = fn.prototype
  // 3.执行构造函数里面的代码（执行结果保存起来作为result ）,
  // 给这个新对象添加属性和方法。
  let result = fn.apply(obj, args) // 让this指向这个新的对象obj。
  // 4.返回
  // 判断执行函数的结果是不是null或Undefined，
  // 如果是则返回之前的新对象，如果不是则返回result
  return result instanceof Object ? result : obj
}
```
