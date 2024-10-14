## 有效括号匹配

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
