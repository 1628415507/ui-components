# 函数

## 【this 的指向问题】

- 以函数形式调用时，this 永远都是 window
- 以方法的形式调用时，this 是 调用方法的对象
- 以构造函数的形式调用时，this 是 新创建的那个对象
- 使用 call 和 apply 调用时，this 是 指定的那个对象

## 【call apply bind 的区别】

- 相同点：都可以改变 this 的指向，传入的第一个参数都是绑定 this 的指向。
<!-- ### -->

### （1）call()和 apply()

- 相同点：

  1. `call()` 和 `apply()`的**第一个参数相同**，就是指定的对象。这个对象就是该函数的执行上下文。在不传入参数的情况下，call(obj)和 apply(obj)的作用是一样的
  1. 这两个方法都是函数对象的方法，需要通过**函数对象**来调用，当对**函数调用 call()和 apply()，函数都会立即执行**；
  1. 在调用 call()和 apply()可以一个对象指定为第一个参数，此时这个对象将会成为函数执行时的 this；

- 不同点(第二个开始的传参不同)
  1. call()在**第一个参数之后的后续所有参数**就是传入该函数的值。  
     `fn.call(thisTarget, param1, param2,...)`
  1. apply()**只有两个参数**，第一个是对象，**第二个是数组或类数组**，这个数组中的值为传入该函数的参数  
     `fn.apply([param1、param2、param3,······])`

### （2）[bind() 方法](https://www.bilibili.com/video/BV1Kt411w7MP?p=57)

- `fn.bind(thisTarget, param1, param2,...)`
- bind 的参数与 call 一致，
- bind 不会调用函数，而是返回一个**新的函数**，而前两者是直接执行该函数。

## 【箭头函数的特点】

（三没有、三不能）

- **没有 arguments 实参集合**，取而代之**用...剩余运算符解决** ;
- **没有自己的 this**。他的 this 是继承当前**上下文中的 this** ;
- **没有函数原型 prototype**
- **不能作为构造函数 new**， 因为箭头函数相当于**匿名函数**，不能被 new 箭头函数;
- **不能使用 call、apply、bind 改变箭头函数中 this 指向** ;
- 不能当做 Generator 函数，不能使用 yield 关键字;
