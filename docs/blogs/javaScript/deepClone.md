## （一） [谈一谈深克隆和浅克隆](https://blog.csdn.net/sinat_17775997/article/details/70482279)

### （1）浅克隆（`只复制内存地址`）:

- 浅克隆：只是拷贝了**基本类型的数据**，而引用类型数据，复制后也是会发生引用
- 换句话说，浅复制仅仅是指向**被复制的内存地址**，如果原地址中对象被改变了，那么浅复制出来的对象也会相应改变。

### （2）深克隆（和原来的没关系， `创建一个新对象`）

- 属性中**引用的其他对象**也会被克隆，不再指向原有对象地址。
- `JSON.parse`、`JSON.stringify()`

## （二） 手写浅拷贝、深拷贝

**题目：**
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acbb33ad99484ed6a56fdd9b256865a2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp)

### 1. 浅拷贝（和原来的有关系）：

只是把对象的属性和属性值拷贝到另一个对象中，**只克隆第一层**，没有克隆地址

#### （1）方法一（ES6）

```js
let obj2 = { ...obj }
console.log(obj, obj2)
```

#### （2）方法二（ES6）：`Object.assign()`

> **`Object.assign`**：会**合并对象生成一个新对象**。  
> 如果对象的属性是普通类型改变之后新对象不会改变，如果是引用类型改变后新对象也会改变，所以 Object.assign 实际上还是浅拷贝。

```js{5}
var obj = {
  aa: 1,
  b: { item: '45' }
}
var newObj = Object.assign({}, obj)
obj.aa = 2 //对象的属性是普通类型改变之后新对象不会改变
obj.b.item = 'kk' //是引用类型改变后新对象也会改变
console.log(newObj.aa) //1
console.log(newObj.b.item)   //kk
```

#### （3）方法三

- 复制非继承属性（[`hasOwnProperty()`](https://blog.csdn.net/a791226606/article/details/110679991)）
- 只复制第一层

```js{5}
function shallowClone(obj) {
  let obj3 = {}
  for (let key in obj) {
    // for...in 循环遍历所有可枚举属性
    if (!obj.hasOwnProperty(key)) break //判断一个对象里是否含有某个非继承属性
    obj3[key] = obj[key]
  }
  return obj
}
```

### 2. 深拷贝：

#### （1）方法一

- `JSON.stringify()`：将 JavaScript 值转换为**JSON 字符串**。
- `JSON.parse:JSON.parse()` ：方法用于将一个**SON 字符串转换为对象**。

```js
let obj4 = JSON.parse(JSON.stringify(obj)) //弊端
```

#### （2）方法二

> - [JavaScript constructor 属性详解](https://www.cnblogs.com/chenweizhen/p/6422995.html)
> - prototype 的属性值中天生自带一个 constructor 属性， 其 constructor 属性值指向**当前原型所属的类**
> - 其实深拷贝可以拆分成 2 步：浅拷贝 + 递归；浅拷贝时判断属性值是否是对象，**如果是对象就进行递归操作**，两个一结合就实现了深拷贝。

**关键点：**

- 注意判断值类型和引用类型
  - 值类型（`typeof`）：直接返回
  - 引用类型（`instanceof`）：先判断其他具体的对象类型
- 引用类型，判断是数组还是对象
- 创建空对象 newObj，改变内存地址的指向
  - 数组：`newObj = []`
  - 对象：`newObj = new obj.constructor()`
- 遍历、递归
- 返回数据

```js{2,15,26,32,33}
function deepClone(obj) {
  // 【1】. 判断值类型和引用类型：
  //  非对象、数组：typeof来判断对象和数组，因为这种类型都会返回object
  if (obj === null || typeof obj !== 'object') return obj
  // 可通过 instanceof 操作符来判断对象的具体类型，或是否是某个对象的实例
  if (obj instanceof RegExp) {
    return new RegExp(obj) // 正则对象的实例
  }
  if (obj instanceof Date) {
    return new Date(obj) // 日期对象的实例
  }
  // function
  // ...

  // 【2】. 判断是数组还是对象
  let newObj // 创建空对象
  if (obj instanceof Array) {
    newObj = [] // 创建空数组，改变内存地址，不再指向被复制的内存地址
  } else {
    /*
      为什么不直接用“newObj= new Object();”创建空对象？
      目的：用constructor可以使克隆的结果和之前保持相同的所属类
      obj.constructor= Object
      */
    // let newObj = new obj.constructor;//既能克隆对象也能克隆实例；
    newObj = new obj.constructor() // 创建空对象，改变内存地址
  }

  for (let key in obj) {
    //保证key不是原型的属性
    if (obj.hasOwnProperty(key)) {
      // 【3】. 递归
      newObj[key] = deepClone(obj[key])
      //newObj[key] = arguments.callee(obj[key]);
      //使用arguments.callee就可以让函数逻辑与函数名解耦
    }
  }
  return newObj
}
```

**测试对象：**

```js
// 测试对象
let obj5 = deepClone(obj)
console.log(obj, obj5)
console.log('obj === obj5', obj === obj5) //false
console.log('obj.c === obj5.c', obj.c === obj5.c) //false
```

**测试数组：**

```js
//测试数组
let arr2 = deepClone(arr)
console.log(arr, arr2)
console.log('arr === arr2', arr === arr2) //false
console.log('arr[0] === arr2[0]', arr[0] === arr2[0]) //false
```
