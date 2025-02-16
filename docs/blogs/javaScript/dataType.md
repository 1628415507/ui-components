## （一）数据类型

### 1.JS 的数据类型都有哪些 ⚄

包括：6 种基本类型和引用类型

- 基本类型：`Number`、`String`、`Boolean`、`Null`、`Undefined`、`symbol`(es6 的新数据类型)
- 引用类型：统称为 Object（包括 Object、Array、Function（堆）、Date、RegExp()）

### 2. 基本类型和引用类型的区别

| 区别                 | 基本类型                 | 引用类型                 |
| -------------------- | ------------------------ | ------------------------ |
| 存放位置             | 基本类型是存放在**栈**里 | 引用类型值保存在**堆**里 |
| 是否可添加属性和方法 | 不可以                   | 可以                     |

- 在栈中保存数据的引用地址，这个引用地址指向的是对应的数据，以便快速查找到堆内存中的对象。
- **栈内存是自动分配内存的**。而**堆内存是动态分配内存的，不会自动释放**。（所以每次使用完对象的时候都要把它设置为 null，从而减少无用内存的消耗）

### [ 延伸问题 ]

### （1）[为什么 0.1+0.2>0.3](http://t.csdnimg.cn/q6f2d) ⚃

> 因为在 JS 底层中，每个变量是以**二进制**表示，固定长度为 64 位，其中第 1 位是符号位，再往后 11 位是指数位，最后 52 表示的是尾数位，`而0.1和0.2转为二进制的时候是无限循环小数，所以JS就会进行截取`，**截取以后 0.1 和 0.2 就不是他们本身了**，要比原来大 那么一丢丢，所以 0.1+0.2 就>0.3 了

```js
0.1 -> 0.0001100110011001...(无限循环)
0.2 -> 0.0011001100110011...(无限循环)
// 尾数位数限制，需要将后面多余的位截掉，这样在进制之间的转换中精度已经损失。
```

### （1-1）如何解决这个问题，使 0.1+0.2 等于 0.3？⚄

> A:先给他们放大倍数，随后再除以相应倍数

```js{5}
const a = 0.1;
const b = 0.2;

console.log(a + b === 0.3)   // false
console.log((a * 1000 + b * 1000) / 1000 === 0.3)  // true
```

### （2）[对象和数组的区别](https://blog.csdn.net/weixin_41807530/article/details/80829275)

| 区别               | 数组                             | 对象                     |
| ------------------ | -------------------------------- | ------------------------ |
| 顺序               | 数组是**有序数据**的集合         | 对象是**无序数据**的集合 |
| 长度               | 有长度                           | 对象**没有长度**         |
| 数据是否有 key 值  | 数组的数据没有名称，**只有下标** | 对象的数据需要指定名称。 |
| **key 值是否唯一** | 数组可以重复                     | 对象**键值唯一**         |

## （二）数据类型的判断方式 ⚄

| 方式                                | 描述                                                                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ①`typeof`                           | ① 对于**基本数据类型**来说，除了 `null` 都可以显示正确的类型<br> （`typeof null`的值为`Object`，无法分辨是`null`还是`Object`）；<br>② 对于**对象**来说，除了函数都会显示 object； |
| ②`instanceof`                       | 通过**原型链**来判断，只能判断某对象是否存在于目标对象得的原型链上                                                                                                                |
| ③`Object.prototype.toString.call()` | 可以检测**所有的数据类型**，可以区分 null 、string、number、undefined、array、function、object、date、math 数据类型。 <br>缺点：不能细分谁是谁的实例                              |
| ④ `constructor`                     | constructor 属性值指向**当前原型所属的类**（构造函数）                                                                                                                            |

**示例代码**

```js{4,9,21}
 // ------------------------------------typeof-----------------------------------------
 
typeof 5; // 'number'
typeof NaN; // 'number' ★★★
typeof '5'; // 'string'
typeof false; // 'boolean'
typeof Symbol(); // 'symbol'
typeof undefined; // 'undefined'
typeof null; // object ★★★ // typeof 对于对象来说，除了函数都会显示 objec；★★★
typeof Function; // ‘function'
typeof []; // 'object'
typeof {}; // 'object'

// -----------------------------------instanceof-------------------------------------
// instanceof 通过原型链来判断数据类型的
function Foo() {}
var f1 = new Foo();
var d = new Number(1);
console.log(f1 instanceof Foo); // true
console.log(d instanceof Number); //true
console.log(123 instanceof Number); //false   -->不能判断字面量的基本数据类型

// --------------------------Object.prototype.toString.call()-------------------------
// Object.prototype.toString.call()可以检测所有的数据类型，算是一个比较完美的方法了。
const obj = {};
const arr = [];
const date = new Date();
const reg = /[hbc]at/gi;
function fn() {}
console.log(Object.prototype.toString.call(obj)); //[object Object]
console.log(Object.prototype.toString.call(arr)); //[object Array]
console.log(Object.prototype.toString.call(fn)); // "[object Function]"
console.log(Object.prototype.toString.call(date)); // "[object Date]"
console.log(Object.prototype.toString.call(reg)); // "[object RegExp]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
console.log(Object.prototype.toString.call(123)); // "[object Number]"
console.log(Object.prototype.toString.call('abc')); // "[object String]"
console.log(Object.prototype.toString.call(true)); // "[object Boolean]"

// -------------------------------------constructor------------------------------------
var d = new Number(1);
var e = 1;
function fn() {}
var date = new Date();
var arr = [1, 2, 3];
var reg = /[hbc]at/gi;

console.log(d.constructor); //ƒ Number() { [native code] }
console.log(e.constructor.name); //Number
console.log(fn.constructor.name); // Function
console.log(date.constructor.name); // Date
console.log(arr.constructor.name); // Array
console.log(reg.constructor.name); // RegExp
```

### [ 延伸问题 ]

### [（1）为什么要用 Object.prototype.toString.call()，而不用 Array.prototype.toString.call()?⚁](https://blog.csdn.net/qq_38845858/article/details/124344500)

- **toString() 为 Object 的原型方法**，如果没有被重写，调用 toString() 返回 `"[object type]"`，其中 type 是对象的具体类型。
- 而默认情况下 `Array` `、Function` 等类型作为 Object 的实例，都**重写**了 toString 方法。
- 所以除了 Object 类型的对象外，其他类型直接使用  `toString`  方法时，根据原型链的知识，调用的是对应的重写之后的 toString 方法（Function 类型返回函数体的字符串，Array 类型返回元素组成的字符串…）
- 所以我们需要使用 `call` 或者 `apply` 方法来改变 toString 方法的执行上下文。
  > 因为只有 Object.prototype.toString.call()返回的是**统一格式**，  
  > 而且 Array.prototype.toString.call()的部分类型（如 undefined、null）无法检验。
  >
  > ```js{6,7}
  >     function fn() {}
  >     var date = new Date();
  >     var arr = [1, 2, 3];
  >     var reg = /[hbc]at/gi;
  >
  >     console.log(Array.prototype.toString.call(undefined)); // 报错
  >     console.log(Array.prototype.toString.call(null)); // 报错
  >     console.log(Array.prototype.toString.call(123)); // "[object Number]"
  >     console.log(Array.prototype.toString.call("abc")); // "[object String]"
  >     console.log(Array.prototype.toString.call(true)); // "[object Boolean]"
  >     console.log(Array.prototype.toString.call(fn)); // "[object Function]"
  >     console.log(Array.prototype.toString.call(date)); // "[object Date]"
  >     console.log(Array.prototype.toString.call(arr)); // "1,2,3"
  >     console.log(Array.prototype.toString.call(reg));// "[object RegExp]"
  > ```

### （4）为什么 typeof null 是 Object?⚄

> 因为在 JavaScript 中，不同的对象都是使用**二进制存储**的，如果**二进制前三位都是 0 的话，系统会判断为是 Object 类型**，而**null 的二进制全是 0**，自然也就判断为 Object，这个 bug 是初版本的 JavaScript 中留下的  
> 扩展一下其他五种标识位:
> | 标识位 | 类型 |
> | --- | --- |
> | 000 | **对象** |
> | 1 |整型|
> | 010 | 双精度类型 |
> | 100 | 字符串 |
> | 110 | 布尔类型 |

### （5）==和===区别是什么？⚄

> - ===是严格意义上的相等，会比较两边的**数据类型和值大小**。 \
>   只要**数据类型不一样**，就返回 false；
>
> - ==是非严格意义上的相等，两边类型相同，比较大小；\
>   如果是不同类型的数据进行比较，会默认进行数据类型之间的转换；\
>   两边类型不同，根据下方表格，再进一步进行比较。

| 1. 两边类型相同                | 比较大小                                     |
| ------------------------------ | -------------------------------------------- |
| 对象 == 对象                   | **对象**数据类型的比较，比较的是**空间地址** |
| 2. **两边类型不同**            | **结果**                                     |
| Null == Undefined              | true                                         |
| String == Number               | 先将 String 转为 Number，再比较大小          |
| Boolean == Number              | 现将 Boolean 转为 Number，再进行比较         |
| Object == String/Number/Symbol | Object 转化为原始类型，再进行比较            |

### （6）(面试题)NaN == NaN 的结果是什么？为什么?⚄

> - NaN == NaN 的执行结果是 false。因为 JavaScript 规定，`NaN表示的是非数字`，但是这个**非数字也是不同的**，因此 NaN 不等于 NaN，两个 NaN 永远不可能相等。
> - 判断是否为`NaN`用一个函数  `isNaN`来判断；
>   - `isNaN`传入的如果是其他数据类型，那么现将它使用`Number()`转为**数字类型**再进行判断

### （7）[typeof 和 instanceof 检测数据类型有什么区别？](https://www.cnblogs.com/chorkiu/p/10369653.html)

> - 相同点： 都常用来判断一个变量是否为空，或者是什么类型的。
> - 不同点：
>   - typeof 返回值是一个字符串，用来说明变量的**数据类型**
>   - instanceof 用于判断**一个变量是否属于某个对象的实例**.

### （8）[如何判断一个变量是对象还是数组？](https://blog.csdn.net/qq_38845858/article/details/124344500)

> 可以用`Object.prototype.toString.call()`

### （8-1）为什么该方法可以

> - toString 为 Object 的原型方法，**而 Array 、Function 等类型作为 Object 的实例，都重写了 toString 方法。**
> - 由于 Object.prototype.toString()本身允许被修改，像 Array、Boolean、Number 的 toString 就被重写过，所以需要调用 Object.prototype.toString.call(arg)来判断 arg 的类型，**call 将 arg 的上下文指向 Object**，所以 arg 执行了 Object 的 toString 方法。
