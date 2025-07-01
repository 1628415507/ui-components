# 函数

## [【this 的指向问题】](https://blog.csdn.net/yexudengzhidao/article/details/100851105)

### 1. 普通函数形式调用

- 以普通函数形式调用时，this 永远都是 `window`

  ```js
  function getVal() {
    console.log(this) //window
  }
  ```

### 2. 以对象方法的形式调用

- 以对象方法的形式调用时，this 是 调用方法的对象

```js{8}
var name = '卡卡'
var cat = {
  name: '有鱼',
  eat: function () {
    console.log(this.name) //有鱼,this指向调用它的对象obj
  }
}
cat.eat() //以方法的形式调用时，this 是 调用方法的对象cat
```

- 多层作用域链时，this 指的是距离方法**最近的一层对象**

```js{11}
var name = '卡卡'
var cat = {
  name: '有鱼',
  eat1: {
    name: '年年',
    eat2: function () {
      console.log(this.name) //年年
    }
  }
}
cat.eat1.eat2()//this指向eat1
```

- 注意

```js{1}
var eat3 = cat.eat1.eat2
eat3() // 卡卡
```

经过赋值操作时，并未发起函数调用，eat3()这个才是真正的调用（相当于只是获取 eat2 的函数形成新的函数），而发起这个调用的是根对象 window，所以 this 指的就是 window，this.name=卡卡

- Object.definePropert 在 get 和 set 函数中，this 关键字指向的是被定义或修改的对象本身

```js
const person = {}
Object.defineProperty(person, 'age', {
  get() {
    return this._age // this 指向 person 对象
  },
  set(value) {
    if (value > 0) {
      this._age = value // this 指向 person 对象
    } else {
      console.log('年龄必须大于0')
    }
  },
  enumerable: true,
  configurable: true
})

person._age = 25 // 需要手动设置 _age，因为 get 和 set 没有自动初始化 _age
console.log(person.age) // 输出: 25
person.age = 30 // 设置 age 为 30
console.log(person.age) // 输出: 30
```

### 3. 以构造函数的形式调用

- 以构造函数的形式调用时，this 是 新创建的那个对象

  ```js{5}
  function Person(name) {
    this.name = name
  }
  // this指向新创建的对象p
  const p = new Person('xiaoming')
  console.log(p.name)
  ```

### 4. 使用 call 和 apply 调用

- 使用 call 和 apply 调用时，this 是 **指定的**那个对象

## 【call apply bind 的区别】

- 相同点：都可以改变 this 的指向，传入的第一个参数都是绑定 this 的指向。
<!-- ### -->

|          | call                   | apply                    | bind                   |
| -------- | ---------------------- | ------------------------ | ---------------------- |
| 相同点   | 是                     | 是                       | 是                     |
| 立即执行 | 是                     | 是                       | **否**                 |
| 参数     | 第一个参数后的所有参数 | 第二个参数用数组或类数组 | 第一个参数后的所有参数 |

### 1. call()和 apply()

- 相同点：

  1. `call()` 和 `apply()`的**第一个参数相同**，就是指定的对象。这个对象就是该函数的执行上下文。在不传入参数的情况下，call(obj)和 apply(obj)的作用是一样的
  1. 这两个方法都是函数对象的方法，需要通过**函数对象**来调用，当对**函数调用 call()和 apply()，函数都会立即执行**；
  1. 在调用 call()和 apply()可以一个对象指定为第一个参数，此时这个对象将会成为函数执行时的 this；

- 不同点(第二个开始的传参不同)
  1. call()在**第一个参数之后的后续所有参数**就是传入该函数的值。  
     `fn.call(thisTarget, param1, param2,...)`
  1. apply()**只有两个参数**，第一个是对象，**第二个是数组或类数组**，这个数组中的值为传入该函数的参数  
     `fn.apply(thisTarget,[param1、param2、param3,······])`

### 2. [bind() 方法](https://www.bilibili.com/video/BV1Kt411w7MP?p=57)

- `fn.bind(thisTarget, param1, param2,...)`
- bind 的参数与 call 一致，
- bind 不会调用函数，而是返回一个**新的函数**，而前两者是直接执行该函数。

## 【箭头函数的特点】

### 1.三没有、三不能：

1. **没有 `arguments` 实参集合**，取而代之用`...`剩余运算符解决 ;
1. **没有自己的 this**。他的 this 是继承当前**上下文中的 `this`** ;
1. **不能使用 `call`、`apply`、`bind` 改变箭头函数中 this 指向** ;
1. **没有函数原型 `prototype`**
1. **不能作为构造函数 `new`**， 因为箭头函数相当于**匿名函数**，不能被 new 箭头函数;
1. 不能当做 `Generator` 函数，不能使用 `yield` 关键字;

### 2.[箭头函数和普通函数的区别？箭头函数可以当做构造函数 new 吗？](https://segmentfault.com/a/1190000021380336)

| 区别           | 箭头函数                                           | 普通函数         |
| -------------- | -------------------------------------------------- | ---------------- |
| 函数提升       | 不会                                               | 会               |
| arguments 对象 | 没有，如果要获取参数的话可以使用 `rest` 运算符     | 有 `arguments`   |
| this 指向问题  | 指向它定义时所在的对象                             | 指向调用它的对象 |
| `yield` 属性   | 没有 `yield` 属性，不能作为生成器 `Generator` 使用 | 有               |

- 不能 new，原因:
  - 没有自己的 this，不能调用 call 和 apply
  - 没有 prototype，new 关键字内部需要把新对象的*proto*指向函数的 prototype

### 3.arguments

#### 特点

| 特点             | 描述                                                                                |
| ---------------- | ----------------------------------------------------------------------------------- |
| 类数组           | arguments 是一个**类数组对象** ‌，但它并不是真正的数组                              |
| 长度属性`length` | 可以通过`arguments[n]`来访问对应的单个参数值，不具备数组的所有方法，如 forEach 等 ‌ |
| 动态特性         | arguments 对象存储的是实际传递给函数的参数，包括那些未在函数定义中声明的参数 ‌      |
| 不可显式创建     | arguments 对象不能通过常规方法显式创建，它是在函数被调用时自动创建的 ‌              |

#### [arguments](https://cloud.tencent.com/developer/article/1869307) 的用途

- ‌ 增强函数灵活性 ‌：在不确定实参个数的情况下，**可以使用 arguments 对象来处理不同数量的参数**，增强函数的适应性和灵活性 ‌
- ‌ 调试和错误处理 ‌：可以**用来检测函数调用时实参和形参是否一致**，如果不一致则抛出异常，帮助调试和错误处理 ‌

::: example
blogs/javaScript/arguments
:::
