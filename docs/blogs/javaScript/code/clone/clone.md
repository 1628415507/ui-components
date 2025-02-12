## （一） [谈一谈深克隆和浅克隆](https://blog.csdn.net/sinat_17775997/article/details/70482279)

### （1）浅克隆（`只复制内存地址`）:

- 浅克隆：只是拷贝了**基本类型的数据**，而引用类型数据，复制后也是会发生引用
- 换句话说，浅复制仅仅是指向**被复制的内存地址**，如果原地址中对象被改变了，那么浅复制出来的对象也会相应改变。

### （2）深克隆（和原来的没关系， `创建一个新对象`）

- 属性中**引用的其他对象**也会被克隆，不再指向原有对象地址。
- `JSON.parse`、`JSON.stringify()`

## （二） 手写浅拷贝、深拷贝

### 1. 浅拷贝（和原来的有关系）：

只是把对象的属性和属性值拷贝到另一个对象中，**只克隆第一层**，没有克隆地址

#### （1）ES6-扩展运算符

```js
let obj2 = { ...obj }
console.log(obj, obj2)
```

#### （2）ES6-`Object.assign()`

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

#### （3）hasOwnProperty

- 复制非继承属性（[`hasOwnProperty()`](https://blog.csdn.net/a791226606/article/details/110679991)）

```js{8,10}
let obj = {
  name: 'obj的hasOwnProperty属性',
  //obj的hasOwnProperty属性
  eat: {
    eatname: '非obj的hasOwnProperty属性'
  }
}
console.log(obj.hasOwnProperty('name')) //true
console.log(obj.hasOwnProperty('eat')) //true
console.log(obj.hasOwnProperty('eatname')) //false
console.log(obj.eat.hasOwnProperty('eatname')) //true
```

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

#### （1）方法一: `JSON.parse(JSON.stringify(obj))`

- `JSON.stringify()`：将 JavaScript 值转换为**JSON 字符串**。
  - JSON.stringify() 接受第二个参数,可以传入一个数组或函数来指定要序列化的属性，或者传入一个数字来指定缩进空格数。
- `JSON.parse:JSON.parse()` ：方法用于将一个**SON 字符串转换为对象**。
- [`JSON.stringify(obj)`的缺点](https://www.cnblogs.com/ai888/p/18569179)

  - 无法序列化所有类型的数据： JSON.stringify() 无法处理一些 JavaScript 数据类型，例如：
    - 函数： 会被忽略或转换为 null。
    - Symbol： 会被忽略或转换为 null。
    - undefined： 在对象属性中会被忽略，在数组中会被转换为 null。
    - 循环引用： 会导致抛出 TypeError 异常。
    - BigInt： 一些旧的浏览器或 JavaScript 引擎不支持，可能会导致错误或丢失精度。
    - Map、Set、WeakMap、WeakSet： 需要先转换为数组或对象才能被序列化。
    - 自定义类实例： 默认情况下只会序列化其可枚举属性，并且通常**会丢失原型链信息**。
  - 丢失信息： 序列化过程中可能会丢失一些信息
    - 日期对象： 会被转换为字符串，而不是日期对象本身。
    - 正则表达式： 会被转换为空对象 {}。
      ::: example
      blogs/javaScript/code/clone/stringify
      :::

#### （2）方法二:递归

> - [JavaScript constructor 属性详解](https://www.cnblogs.com/chenweizhen/p/6422995.html)
> - prototype 的属性值中天生自带一个 constructor 属性， 其 constructor 属性值指向**当前原型所属的类**
> - 其实深拷贝可以拆分成 2 步：浅拷贝 + 递归；浅拷贝时判断属性值是否是对象，**如果是对象就进行递归操作**，两个一结合就实现了深拷贝。

**关键点：**

- 难点：处理循环引用问题
- 注意判断值类型和引用类型
  - 值类型（`typeof`）：直接返回
  - 引用类型（`instanceof`）：先判断其他具体的对象类型
- 引用类型，判断是数组还是对象
- 创建空对象 newObj，改变内存地址的指向
  - 数组：`newObj = []`
  - 对象：`newObj = new obj.constructor()`
- 遍历、递归
- 返回数据
  ::: example
  blogs/javaScript/code/clone/deepClone
  :::

```js{2,9,16,34,36,39,41,50}
export function deepClone(obj: any, weakMap = new WeakMap()) {
  // 【0】. 处理循环引用：
  if (getDataType(weakMap) !== 'WeakMap') {
    weakMap = new WeakMap() // 解决第二个参数初始不是weakMap类型的情况
  }
  // 判断是否存在循环引用
  if (weakMap.has(obj)) {
    console.log('【 存在循环引用 】-13')
    return weakMap.get(obj) //避免循环引用造成死循环
  }
  //【1】. 判断值类型和引用类型：
  // 非对象、数组：typeof来判断对象和数组，因为这种类型都会返回object
  if (obj === null || typeof obj !== 'object') {
    // 处理Symbol类型
    if (getDataType(obj) == 'Symbol') {
      return Symbol(obj.description) // Symbol基本数据类型,作为值时希望是独一无二的，所以需要重新创建
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
```

**测试对象：**

```js{13,14}
const obj1 = {}
const obj = {
  id: 1,
  code: 'AA',
  name: 'Example',
  symbolKey: Symbol('aa'), //Symbol
  undefinedKey: undefined, //undefined
  func: () => {}, //函数
  date: new Date() //日期
}
obj.else = obj1 //obj和obj2循环引用
obj1.else = obj //obj和obj2循环引用

function runDeepClone() {
  // 测试对象
  let objShadow = obj //浅拷贝
  let objClone = deepClone(obj) //深拷贝
  console.log('obj === objClone', obj === objClone, obj, objClone) //false
  objClone.id = 2 // 不会影响原对象obj
  objShadow.code = 'BB' // 会影响原对象obj
  console.log('obj.id === objClone.id', obj.id === objClone.id) //false
  console.log('obj.name === objClone.name', obj.name === objClone.name) //true
}
```

**测试数组：**

```js
//测试数组
let arr2 = deepClone(arr)
console.log(arr, arr2)
console.log('arr === arr2', arr === arr2) //false
console.log('arr[0] === arr2[0]', arr[0] === arr2[0]) //false
```

#### [（3）递归遇到循环引用怎么处理](https://blog.csdn.net/badbaby52906/article/details/135843123)

- js 中的循环引用是指**两个或多个对象之间相互引用**的情况。这种情况下，这些对象就不能被垃圾回收机制正常回收，会导致内存泄漏。
