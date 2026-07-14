- [JAVA学习视频](https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=4)
- [视频配套笔记](https://heuqqdmbyk.feishu.cn/docx/Zx5tdqkrpoVXFuxTPBSc5cEhnuJ)

# 一、环境配置
## 1.1 安装JDK
1. [下载JDK](https://www.oracle.com/java/technologies/downloads/#jdk25-windows) -> (配置环境变量)[https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=5]

## 1.2 [安装IDEA](https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=6)


# 二、关键字
| 关键字 | 作用 | 示例 |
| :--- | :--- | :--- |
| package | 表示当前的类定义在哪个包下 | `package com.deepinsights.ilp.system.utils;` |
| public | 访问权限修饰符，表示公开的 | `public class MethodDemo1 { ... }` |
| static | 静态修饰符，表示类级别的，被类所有对象共享 | `static String teacherName;` |
| final | 表示最终，不可变。可修饰类、方法、变量 | `final int NUMBER = 100;` |
| [abstract](#1010-抽象类与抽象方法-abstract-class--method) | 抽象修饰符，用于声明抽象类和抽象方法 | `public abstract class Animal { ... }` |
| void | 表示方法没有返回值 | `public static void printArr(int[] arr) { ... }` |
| return | 用于结束方法，并将结果返回给调用处 | `return sum;` |
| public static void main | 表示Java程序的主入口，当程序开始运行的时候，会从主入口开始逐行往下执行 | `public static void main(String[] args) { ... }` |
| [enum](#107-枚举-enum) | 用于定义枚举类，表示一种特殊的、包含固定常量的类 | `public enum OrderState { ... }` |
| [interface](#1011-接口-interface) | 声明接口的关键字 | `public interface MyInter { ... }` |
| [implements](#1011-接口-interface) | 用于类实现接口的关键字 | `public class MyInterImpl implements MyInter { ... }` |

# 三、数据类型

## 3.1 分类
- **基本数据类型**
- **引用数据类型**: 除了基本数据类型(四类八种)，其他所有的数据类型都是引用类型

## 3.2 基本数据类型（四类八种）
| 分类 | 数据类型 | 关键字 | 说明 |
| :--- | :--- | :--- | :--- |
| 整数 | 字节型 | `byte` | - |
| | 短整型 | `short` | - |
| | 整型 | `int` | 默认类型 |
| | 长整型 | `long` | 需加 `L` 后缀 |
| 浮点数 | 单精度浮点数 | `float` | 需加 `F` 后缀 |
| | 双精度浮点数 | `double` | 默认类型 |
| 字符 | 字符型 | `char` | - |
| 布尔 | 布尔型 | `boolean` | - |

> **取值范围大小关系**：`double` > `float` > `long` > `int` > `short` > `byte`

# 四、字面量
| 字面量类型 | 数据类型 | 说明 | 举例 |
| :--- | :--- | :--- | :--- |
| 整数类型 | [`byte`](#基本数据类型四类八种)、[`short`](#基本数据类型四类八种)、[`int`](#基本数据类型四类八种)、[`long`](#基本数据类型四类八种) | 直接写 | 18, -88 |
| 小数类型 | [`double`](#基本数据类型四类八种)、[`float`](#基本数据类型四类八种) | 直接写，加上小数点 | 1.93, -5.21 |
| 字符串类型 | `String` | 用双引号引起 | "尼古拉斯·纯情·暖男·天真·阿玮" |
| 字符类型 | [`char`](#基本数据类型四类八种) | 用单引号引起，**内容只能有一个** | '男', 'A', '0' |
| 布尔类型 | [`boolean`](#基本数据类型四类八种) | 布尔值，表示真假 | true, false |
| 空类型 | - | 一个特殊的值，空值 | null |

# 五、常用 API

## 5.1 Scanner (键盘录入)

`Scanner` 类用于获取用户的键盘输入。

### 5.1.1 使用步骤
1. **导包**：`import java.util.Scanner;`（必须放在类定义的上面）
2. **创建对象**：`Scanner sc = new Scanner(System.in);`
3. **接收数据**：根据需要调用对应的方法。

### 5.1.2 常用方法
| 方法名 | 作用 | 示例 |
| :--- | :--- | :--- |
| `nextInt()` | 接收键盘录入的一个[整数](#基本数据类型四类八种) | `int i = sc.nextInt();` |
| `nextDouble()` | 接收键盘录入的一个[小数](#基本数据类型四类八种) | `double d = sc.nextDouble();` |

### 5.1.3 实战示例

```java 14:20:JavaStudy/src/com/itheima/variable/VariableDemo7.java
        // 1.找到Scanner这个打工人
        Scanner sc = new Scanner(System.in); // 获取键盘对象

        // 2.让Scanner干活
        System.out.println("请键盘录入第一个整数:");
        int num1 = sc.nextInt(); // 获取键盘输入的值
        System.out.println(num1);
```

```java 12:18:JavaStudy/src/com/itheima/variable/VariableDemo8.java
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入您的体重：");
        double weight = sc.nextDouble();

        // 2. 键盘录入身高 M
        System.out.println("请输入您的身高：");
        double height = sc.nextDouble();
```

## 5.2 Random (产生随机数)

`Random` 类用于在指定的范围内产生随机数。

### 5.2.1 使用步骤
1. **导包**：`import java.util.Random;`
2. **创建对象**：`Random r = new Random();`
3. **生成随机数**：调用对应的方法获取随机数。

### 5.2.2 常用方法
| 方法名 | 作用 | 说明 |
| :--- | :--- | :--- |
| `nextInt()` | 生成 `int` 范围内的随机数 | 包含正数、负数和零 |
| `nextInt(int n)` | 生成 `[0, n)` 范围内的随机数 | **包含 0，不包含 n** |
| `nextInt(int a, int b)` | 生成 `[a, b)` 范围内的随机数 | **JDK 17 新特性**，包含 a，不包含 b |

# 六、运算符

## 6.1 算术运算符

| 符号 | 作用 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| `+` | 加 | 相加操作 | `3 + 2 = 5` |
| `-` | 减 | 相减操作 | `3 - 2 = 1` |
| `*` | 乘 | 相乘操作 | `3 * 2 = 6` |
| `/` | 除 | 相除操作 | `10 / 3 = 3` (整数相除结果为商) |
| `%` | 取模 | 求余数 | `10 % 3 = 1` |

> **注意**：
> 1. **整数相除**：结果只能得到商，余数被舍弃。若想得到小数，必须有浮点数参与运算。
> 2. **浮点运算**：在计算机中，小数直接参与计算可能会出现[精度不精确](#常用-api)的情况。

## 6.2 类型转换

在 Java 中，当不同类型的数据进行运算时，需要转换为同一类型。

### 6.2.1 隐式转换 (自动提升)
**规则**：取值范围小的类型，自动提升为取值范围大的类型。
- `byte` / `short` / `char` 参与运算时，首先提升为 `int`。
- 转换层级：`byte` -> `short` -> `int` -> `long` -> `float` -> `double`。

### 6.2.2 强制转换 (手动转换)
**格式**：`目标数据类型 变量名 = (目标数据类型) 被强转的数据;`
> **风险**：可能会导致精度丢失 or 数据溢出。

```java 11:25:JavaStudy/src/com/itheima/operator/OperatorDemo4.java
        // 请说出下面代码在计算的时候，类型转换的情况
        /*
        *   1. b + s
        *   先把byte类型的100，和short类型的200   提升为int类型
        *   结果：300（int）
        *
        *   2.300（int） + d
        *   int类型的300会提升为double类型，变成300.0
        *   结果：320.3（double）
        *
        *
        * */
```

## 6.3 字符串拼接

当 `+` 运算符左右两边出现字符串时，其作用变为**拼接**。
- **规则**：任意数据类型与字符串拼接，结果都是一个新的字符串。
- **示例**：`"个位是：" + ge` -> `"个位是：3"`

## 6.4 逻辑运算符

| 符号 | 名称 | 作用 |
| :--- | :--- | :--- |
| `&` | 逻辑与 | 且（两边都为真才为真） |
| `|` | 逻辑或 | 或（只要有一个为真即为真） |
| `!` | 逻辑非 | 取反 |

### 6.4.1 短路逻辑运算符
- `&&` (短路与)：如果左边为假，右边不再执行。
- `||` (短路或)：如果左边为真，右边不再执行。

# 七、流程控制语句
## 7.1 判断语句——if
## 7.2 选择语句——switch
1. 表达式：结果（字符/整数byte short int/[枚举](#107-枚举-enum)/字符串）--- 跳转表，索引不支持小数，也不支持大的整数long
2. case：被匹配的值，只能是真实的数据 --- 不能写变量的
3. case：值不允许重复
4. break：表示中断，结束的意思，结束switch语句 --- break关键字，作用结束switch语句,在我们写代码的时候，如果break没有写，此时就会触发case穿透现象
5. default：所有情况都不匹配，执行该处的内容 --- if里面的else是非常类似的
6. switch新特性: 
    - 箭头标签
    - case后面可以写多个值
    - switch可以有运行结果
    - yield 关键字

## 7.3 循环语句

### 7.3.1 for 循环
用于已知循环次数的场景。

### 7.3.2 while 循环
用于不确定循环次数，仅需满足条件的场景。


### 7.3.3 for 与 while 的对比
- 相同点：先判断后执行
- 不同点：

| 特性 | `for` 循环 | `while` 循环 |
| :--- | :--- | :--- |
| **相同点** | 运行规则一致（初始化 -> 判断 -> 执行 -> 迭代） | 运行规则一致 |
| **变量作用域** | 控制循环的变量归属于 `for` 语法结构，**循环结束后无法访问**。 | 控制循环的变量不归属于其语法结构，**循环结束后仍可继续使用**。 |

### 7.3.4 do...while 循环
**特点**：先执行后判断，循环体**至少执行一次**。

### 7.3.5 无限循环 (死循环)
循环条件永远为 `true`，导致循环永不停止。
| 格式 | 语法结构 | 说明 |
| :--- | :--- | :--- |
| `for` 格式 | `for ( ; ; ) { ... }` | 最为简洁的格式 |
| `while` 格式 | `while (true) { ... }` | **最常用**的格式 |
| `do...while` 格式 | `do { ... } while (true);` | 较少使用 |

> **注意**：在无限循环的**下方**不能编写任何其他代码，因为程序永远无法执行到该位置。

## 7.4 循环控制语句

在循环执行过程中，可以使用 `break` 和 `continue` 关键字来控制循环的跳转和结束。

### 7.4.1 关键字对比

| 关键字 | 作用 | 使用范围 |
| :--- | :--- | :--- |
| **`break`** | **跳出并结束**当前所在循环（或 `switch` 语句） | `switch` 或 循环语句中 |
| **`continue`** | **跳过本次循环**，直接开始下一次循环 | 仅限循环语句中 |

> **注意**：这两个关键字都不能单独书写（即不能脱离循环或 `switch` 结构单独使用）。

### 7.4.2 实战示例
![alt text](image.png)

# 八、数组

## 8.1 数组的定义与初始化

### 8.1.1 静态初始化
在创建数组时，直接给数组赋值。适用于**已知具体数据**的场景。

| 格式 | 语法结构 | 示例 |
| :--- | :--- | :--- |
| **完整格式** | `数据类型[] 数组名 = new 数据类型[]{元素1, 元素2, ...};` | `int[] arr = new int[]{1, 2, 3};` |
| **简写格式** | `数据类型[] 数组名 = {元素1, 元素2, ...};` | `int[] arr = {1, 2, 3};` |

### 8.1.2 动态初始化
在创建数组时，只指定数组长度，由系统给出默认初始化值。适用于**只知道数据个数，不知道具体值**的场景。

| 格式 | 语法结构 | 示例 |
| :--- | :--- | :--- |
| **标准格式** | `数据类型[] 数组名 = new 数据类型[数组长度];` | `int[] arr = new int[5];` |

> **默认初始化值**：
>
> | 数据类型分类 | 具体类型 | 默认初始化值 |
> | :--- | :--- | :--- |
> | 整数类型 | [`byte`](#基本数据类型四类八种), [`short`](#基本数据类型四类八种), [`int`](#基本数据类型四类八种), [`long`](#基本数据类型四类八种) | `0` |
> | 浮点数类型 | [`float`](#基本数据类型四类八种), [`double`](#基本数据类型四类八种) | `0.0` |
> | 字符类型 | [`char`](#基本数据类型四类八种) | `'\u0000'` (空格) |
> | 布尔类型 | [`boolean`](#基本数据类型四类八种) | `false` |
> | 引用数据类型 | `String` 等 | `null` |

## 8.2 常见问题

### 8.2.1 索引越界 (ArrayIndexOutOfBoundsException)
访问了不存在的索引（如负数或 `>= 数组长度` 的索引）。

### 8.2.2 双指针去重 (有序数组)
利用快慢指针在原地修改数组以去除重复项。

```java 9:21:JavaStudy/src/com/itheima/array/Test6.java
/**
 * 有序数组去重（双指针）
 * @author majf
 */
// 1. 定义两个指针
int slow = 0;
int fast = 1;

// 2.利用循环不断的移动快慢指针,找不重复的元素
while (fast < arr.length){
    if(arr[slow] != arr[fast]){
        slow++;
        arr[slow] = arr[fast];
    }
    fast++;
}
```

# 九、方法

## 9.1 方法的定义与调用

方法是具有独立功能的代码块，通过将其封装可以提高代码的复用性。

### 9.1.1 定义格式

| 组成部分 | 说明 | 示例 |
| :--- | :--- | :--- |
| **修饰符** | 目前固定写法 `public static` | `public static` |
| **返回值类型** | 方法运行结果的数据类型，若无结果则用 [`void`](#关键字) | `int`, `double`, `void` |
| **方法名** | 遵循小驼峰命名法，见名知意 | `getSum`, `printArr` |
| **参数列表** | 方法执行所需的外部数据（形参） | `(int a, int b)` |
| **方法体** | 具体业务逻辑代码 | `{ int sum = a + b; ... }` |
| **return** | 结束方法并返回结果给调用处 | `return sum;` |

```java
public static 返回值类型 方法名(参数1, 参数2...) {
        方法体
        return 返回值;
}
```
### 9.1.2 调用方式

1. **直接调用**：仅执行方法，不处理结果。`方法名(实参);`
2. **赋值调用**：将结果存入变量。`数据类型 变量名 = 方法名(实参);`
3. **输出调用**：直接打印结果。`System.out.println(方法名(实参));`

## 9.2 方法重载 (Overload)

在同一个类中，定义了多个**同名**的方法，但其**参数列表不同**，这些方法构成了重载关系。

### 9.2.1 判定标准

| 维度 | 要求 | 示例 |
| :--- | :--- | :--- |
| **类** | 必须在同一个类中 | - |
| **方法名** | 必须完全相同 | `getSum` |
| **参数列表** | 必须不同（个数、类型、顺序） | `(int a)` vs `(int a, int b)` |
| **返回值** | **无关** | `void getSum(int a)` 与 `int getSum(int a)` 不构成重载 |
- 示例代码
```java 12:27:JavaStudy/src/com/itheima/method/MethodDemo6.java
    public static double getSum(int a, int b) {
        return a + b;
    }

   public static double getSum(int a, double b) {
        return a + b;
    }

    public static double getSum(double a, int b) {
        return a + b;
    }

    public static double getSum(double a, double b) {
        return a + b;
    }
```

## 9.3 注意事项

1. **平级关系**：方法与方法之间是平级关系，**不能嵌套定义**。
2. **被动执行**：方法不会自动运行，必须被调用。
3. **参数匹配**：调用时实参的个数与类型必须与形参一一对应。
4. **返回值处理**：如果方法有返回值，必须通过 `return` 关键字返回；如果是 `void`，则不能返回具体值。

# 十、面向对象 (OOP)

## 10.1 static 静态变量与静态方法

`static` 是静态修饰符，用于修饰成员变量和成员方法。

### 10.1.1 静态变量

| 特点 | 说明 |
| :--- | :--- |
| **共享性** | 该变量被当前类的所有对象共享。 |
| **归属** | 不属于对象，属于类。 |
| **加载时机** | 随着类的加载而加载，优先于对象而存在。 |

**调用方式**：
1. **类名调用（推荐）**：`类名.变量名`
2. **对象名调用**：`对象名.变量名`
> **注意**：赋值只要赋值一次，只要有一个对象修改了静态变量，其他对象再次访问的时候就是修改之后的结果了。

### 10.1.2 静态方法

| 特点 | 说明 |
| :--- | :--- |
| **定义** | 使用 `static` 修饰的方法称为静态方法。 |
| **应用场景** | 多用于**测试类**和**工具类**中；JavaBean 类中很少使用。 |
| **调用方式** | 1. **类名调用（推荐）**：`类名.方法名()` <br> 2. **对象名调用**：`对象名.方法名()` |

### 10.1.3 工具类 (Utility Class)

工具类不是用来描述一类事物的，而是为了帮我们做一些事情的类。

**设计规范**：
1. **类名见名知意**：如 `ArrayUtil`, `MathUtil`。
2. **私有化构造方法**：使用 `private` 修饰构造方法，防止外部创建对象。
3. **方法定义为静态**：方便通过类名直接调用。

```java 3:11:JavaStudy/src/com/itheima/toolclasstest/ArrayUitl.java
public class ArrayUitl {
    // private修饰，私有化构造方法，目的：不让外界创建对象
    private ArrayUitl(){}


    // 定义方法（静态）：工具类里的所有方法都要写成静态的
    /*提供一个方法printArr，用于遍历数组。
    格式如下：[10, 20, 50, 34, 100]（只考虑整数数组）*/
    public static String printArr(int[] arr){
```

### 10.1.4 静态注意事项

1. **静态只能访问静态**：静态方法只能访问静态变量和其他静态方法。
2. **非静态可以访问所有**：非静态方法可以访问静态变量/方法，也可以访问非静态的成员变量/方法。
3. **静态方法中没有 `this` 关键字**：因为静态方法是随着类的加载而加载的，此时还没有对象，而 `this` 代表当前对象。

### 10.1.5 重新认识 main 方法

```java
public static void main(String[] args) { ... }
```
- **public**：被 JVM 调用，访问权限必须最大。
- **static**：被 JVM 调用，通过类名访问，无需创建对象。
- **void**：不需要给 JVM 返回值。
- **main**：固定的名字，被 JVM 识别。
- **String[] args**：用于接收运行程序时传入的命令行参数。

## 10.2 final 关键字

`final` 表示最终，不可变。可以修饰变量、类、方法。

### 10.2.1 修饰变量 (常量)

当 `final` 修饰变量时，该变量被称为**常量**。

| 特点 | 说明 |
| :--- | :--- |
| **唯一赋值** | 只能被赋值一次，一旦赋值，无法再次修改。 |
| **命名规范** | 常量名全部**大写**，多个单词之间用**下划线**隔开（如 `MAX_VALUE`）。 |

#### 核心细节

| 数据类型 | 限制内容 | 说明 |
| :--- | :--- | :--- |
| **基本数据类型** | **真实数据**不可变 | 记录的数值无法发生改变。 |
| **引用数据类型** | **内存地址**不可变 | 记录的对象地址无法改变，但**对象内部的属性值可以改变**。 |

> **总结**：`final` 修饰哪个变量，该变量记录的内容就无法再次发生改变。

### 10.2.2 修饰类与方法

| 修饰对象 | 限制效果 | 说明 |
| :--- | :--- | :--- |
| **修饰类** | **最终类，不能被继承** | `final` 修饰的类为最终类，无法作为父类被其他类继承（如 `String` 类）。其内部所有方法默认无法被[重写](#1084-继承中成员方法的访问特点与方法重写)。 |
| **修饰方法** | **最终方法，不能被重写** | `final` 修饰的方法为最终方法，子类可以继承并调用，但不能被[重写](#1084-继承中成员方法的访问特点与方法重写)。 |

## 10.3 类与对象

- **[JavaBean](#类与对象)类**：描述一类事物的类，可以编写属性和行为，通常包含私有化属性和对应的 `get/set` 方法。
- **测试类**：带有 [`main`](#关键字) 方法的类，用于创建对象并调用其功能。

## 10.4 封装 (Encapsulation)

封装是面向对象的三大特征之一，通过将数据和操作数据的方法绑定在一起，隐藏内部实现细节。

### 10.4.1 `private` 关键字

| 关键字 | 作用 | 特点 |
| :--- | :--- | :--- |
| **`private`** | 权限修饰符，可修饰成员变量 and 方法 | **只能在本类中访问** |

### 10.4.2 `set/get` 方法

针对 `private` 修饰的成员变量，必须提供公共的 `get/set` 方法，以确保数据的安全性。

```java
    /**
     * 设置年龄并进行校验
     */
    // age
    // num:表示将来要赋的值 2岁
    public void setAge(int num) {
        // 给对象中的属性进行赋值
        if (num >= 0 && num <= 15) {
            age = num;
        } else {
            System.out.println("当前的" + num + "不在合理范围之内");
        }
    }

    /**
     * 获取年龄
     */
    public int getAge() {
        return age;
    }
```

## 10.5 `this` 关键字与就近原则
- this的本质：代表所在方法调用者的**内存地址**
### 10.5.1 就近原则
在方法中使用变量名时，遵循“先局部，后成员”的查找顺序。

### 10.5.2 `this` 的作用
用于**区分成员变量和局部变量**。当局部变量与成员变量重名时，使用 `this.变量名`显式访问成员变量。

```java
/**
 * 演示 this 关键字区分变量
 */
public class Student {
    private int age;

    public void setAge(int age) {
        // 此时左边的 age 触发就近原则，是局部变量；
        // 使用 this.age 才能访问成员变量
        this.age = age; 
    }
}
```

## 10.6 构造方法 (Constructor)

构造方法是一种特殊的方法，用于在创建对象时初始化对象。

### 10.6.1 特点与执行时机

| 维度 | 说明 |
| :--- | :--- |
| **方法名** | 必须与**类名完全相同**（大小写敏感） |
| **返回值** | **没有返回值类型**，连 `void` 都没有 |
| **return** | 不能由 `return` 语句带回具体结果数据 |
| **执行时机** | 在创建对象（`new`）时由虚拟机自动调用，每创建一次对象就调用一次 |
| **调用限制** | 不能手动调用构造方法 |

### 10.6.2 实例化示例

```java
// 1. 调用空参构造创建对象
Student s1 = new Student();

// 2. 调用带参构造创建对象
Student s2 = new Student("张三", 23);
```

### 10.6.3 注意事项

- **默认构造**：如果没有定义任何构造方法，系统将给出一个默认的**无参数构造方法**。
- **覆盖规则**：如果手动编写了任意构造方法，系统将**不再提供**默认的构造方法。
- **构造重载**：带参构造与无参构造方法名相同但参数不同，这称为构造方法的重载。建议在编写带参构造时，也手动提供一个空参构造。

### 10.6.4 实战示例

```java
/**
 * 学生类
 */
public class Student {
    private String name;
    private int age;

    /**
     * 空参构造方法
     */
    public Student() {
    }

    /**
     * 带全部参数的构造方法
     */
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

## 10.7 枚举 (Enum)

枚举（Enum）是一种特殊的类，用于表示一组固定的常量。

### 10.7.1 核心特点与注意事项

| 特点 | 说明 | 示例 / 细节 |
| :--- | :--- | :--- |
| **定义方式** | 使用 `enum` 关键字代替 `class` | `public enum OrderState { ... }` |
| **枚举项对象** | 每一个枚举项都是该枚举类的对象 | `PAYMENT_PENDING` 是 `OrderState` 类型的对象 |
| **底层实现** | 枚举项在底层是常量，默认用 [`public static final`](#102-final-关键字) 修饰 | 随着类的加载而加载，全局唯一 |
| **首行声明** | 枚举类的第一行**必须**是枚举项，多个枚举项用逗号隔开，分号结尾 | `PAYMENT_PENDING, PROCESSING;`（有后续成员时分号不可省略） |
| **构造方法** | 默认且**必须**使用 [`private`](#1041-private-关键字) 修饰，禁止外部创建对象 | `private OrderState(String name) { ... }`（不写时默认也是 `private`） |
| **编译器方法** | 编译器会自动为枚举类添加 `values()` 和 `valueOf()` 默认方法 | 详见 [10.7.3 常用编译器方法](#1073-常用编译器方法) |

### 10.7.2 实战定义与成员声明

枚举类中可以定义成员变量、构造方法和成员方法。

```java 3:26:JavaStudy/src/com/itheima/enumtest/OrderState.java
public enum OrderState {
    // 在枚举类的第一行，把所有的对象都罗列出来了
    PAYMENT_PENDING("待支付"),
    PROCESSING("处理中"),
    SHIPPED("已发货"),
    OUT_FOR_DELIVERY("配送中"),
    DELIVERED("已送达"),
    CANCELLED("已取消"); // 最后一个对象后面必须加分号，一个分号代表一行代码


    private String name;


    // 枚举类的构造方法默认使用private修饰，就算不写，虚拟机也会加上private
     OrderState(String name) {
        System.out.println("看看我执行了吗？" + name);
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
```

### 10.7.3 常用编译器方法

编译器会为所有枚举类自动新增以下两个默认方法：

| 方法名 | 作用 | 示例 |
| :--- | :--- | :--- |
| `values()` | 获取该枚举类中所有枚举项的数组 | `OrderState[] arr = OrderState.values();` |
| `valueOf(String name)` | 根据传入的字符串（**必须与枚举项名称完全一致**，例如 `"SHIPPED"`，传入属性值 `"已发货"` 会抛出异常）获取对应的枚举项 | `OrderState shipped = OrderState.valueOf("SHIPPED");` |

#### 方法与 [switch](#72-选择语句switch) 应用示例

```java 16:30:JavaStudy/src/com/itheima/enumtest/EnumTest1.java
        // 获取枚举类的对象
        // 细节：
        //     所有的枚举项，默认使用public static final修饰的
        OrderState o1 = OrderState.PAYMENT_PENDING;
        System.out.println(o1.getName());

        // 匹配
        switch (o1){
            case PAYMENT_PENDING -> System.out.println("待支付状态");
            case PROCESSING -> System.out.println("处理中");
            case SHIPPED -> System.out.println("已发货");
            case OUT_FOR_DELIVERY -> System.out.println("配送中");
            case DELIVERED -> System.out.println("已送达");
            case CANCELLED -> System.out.println("已取消");
        }
```

## 10.8 继承 (Inheritance)

### 10.8.1 什么是继承与继承的好处

#### 1. 什么是继承？
继承是面向对象三大特征（封装、继承、多态）之一。它是类与类之间的一种**父子关系**。
Java 中使用关键字 `extends` 来建立子类与父类的继承关系。

* **格式**：`public class 子类 extends 父类 {}`

#### 2. 继承的好处
* **提高代码复用性**：可以把多个子类中重复的代码抽取到父类中，子类直接继承父类的属性和方法。
* **提高代码的扩展性与维护性**：子类可以在父类的基础上增加自己特有的功能，使得子类更加强大，同时修改父类代码可全局生效。

---

### 10.8.2 Java 继承的特点

1. **单继承限制**：Java 只支持**单继承**，不支持多继承（即一个类只能有一个直接父类）。
2. **多层继承支持**：Java 支持**多层继承**（子类可以继承父类，父类还可以继承它的父类）。
3. **祖先类 `Object`**：Java 中所有的类都直接或者间接继承于 `java.lang.Object` 类。
4. **概念区分**：
   * **直接父类**：直接 `extends` 的父类。
   * **间接父类**：继承链条上更上层的父类（如爷爷类、外公类等）。

#### 实战结构示例：智能设备多层继承
在 `com.itheima.oopextendstest2` 包中，设计了如下的继承结构：
* `SmartDevice` (直接父类) -> `Phone` & `Laptop` (子类)
* `Phone` (直接父类) -> `Android` & `IOS` (子类)
* 此时 `SmartDevice` 是 `Android`/`IOS` 的间接父类。

> 具体代码实现详见 `oopextendstest2` 

---

### 10.8.3 继承中成员变量的访问特点与书写规则

#### 1. 书写规则：抽取共性
#### 2. 访问特点：就近原则
在子类中访问一个变量时，Java 遵循**就近原则**。查找顺序如下：
局部位置→本类成员位置→直接父类成员位置→间接父类成员位置→$cdots

#### 3. 变量重名问题
如果子类和父类中出现了重名的成员变量，可以通过不同的**关键字**进行区分：

| 访问方式 | 含义 | 查找起始位置 |
| :--- | :--- | :--- |
| `name` | 直接访问 | 从局部位置（方法内的局部变量/形参）开始往上找 |
| `this.name` | 访问本类成员 | 从本类（子类）成员变量位置开始往上找 |
| `super.name` | 访问父类成员 | 从直接父类成员变量位置开始往上找 |

---

### 10.8.4 继承中成员方法的访问特点与方法重写

#### 1. 成员方法的设计与调用规则

| 规则维度 | 核心规则 | 说明 / 细节 |
| :--- | :--- | :--- |
| **书写规则** | **抽取共性方法** | 把多个子类中共性的成员方法抽取到父类当中，提高代码复用性。 |
| **调用规则** | **遵守就近原则** | 在子类中调用方法时，默认遵循就近原则。<br>• **`this` 调用**：先访问本类，本类没有再访问父类。<br>• **`super` 调用**：直接访问父类。 |

#### 2. 什么是方法重写 (Method Overriding)？
* **定义**：在继承体系中，子类出现了和父类中**一模一样的方法声明**，我们就称子类的这个方法是重写的方法。
* **使用场景**：当父类的方法不能满足子类的要求了，子类中可以把该方法再写一遍（例如对功能进行升级）。

#### 3. `@Override` 注解
* **概念**：写在重写的方法上方。
* **作用**：是一个给编译器（虚拟机）看的标示，用于校验重写的语法是否正确。如果不满足重写规则，编译器将直接报错。

> 示例，详见com.itheima.oopextendstest6

#### 4. 方法重写注意事项和要求

| 维度 | 要求与规则 | 说明 / 细节 |
| :--- | :--- | :--- |
| **基本要求** | **名称与形参列表必须一致** | 重写方法的名称、形参列表必须与父类中的完全一致。方法体按照实际需求书写。 |
| **访问权限** | **子类权限 >=父类权限** | 子类重写父类方法时，访问权限子类必须大于等于父类（`空着不写(package-private)` < `protected` < `public`）。 |
| **返回值类型** | **子类返回值<=父类返回值** | 子类重写父类方法时，返回值类型子类必须小于等于父类（例如子类返回 `Student`，父类返回 `Person`）。 |
| **申明建议** | **保持一致** | **建议**：重写的方法申明和父类保持一致即可。 |
| **重写限制** | **特定方法不能重写** | 1. **`private` 私有方法**不能被重写（因为子类无法访问）。<br>2. **`static` 静态方法**不能被重写（静态方法属于类，不参与多态）。<br>3. **`final` 最终方法**不能被重写（参见 [final 关键字](#102-final-关键字)）。 |
| **类限制** | **`final` 修饰的类不能被继承** | [final 修饰的类](#1022-修饰类与方法)为最终类，不能被继承，因此里面所有的方法都不能被重写。 |

---

### 10.8.5 继承中构造方法的访问特点

#### 1. 核心访问规则
* **子类的所有构造方法，默认都会先访问父类的无参构造方法。**
* **原因**：因为子类会继承父类的数据，甚至可能会使用到父类的数据。因此在子类初始化之前，必须先完成父类数据的初始化。
* **实现机制**：Java 虚拟机会在子类构造方法的第一行默认加上一句话：`super();`（**即便不写，也是默认存在的**）。

#### 2. 如果父类没有无参构造怎么办？
如果父类只定义了带参构造，系统将不再提供默认的无参构造。此时子类构造方法第一行的默认 `super();` 将无法编译通过。

**解决方案**：

* 必须在子类构造方法的第一行，手动使用 `super(参数1, 参数2...);` 显式调用父类的带参构造。

#### 实战示例：通过 `super` 调用父类构造
在 `com.itheima.oopextendstest11` 中，`Teacher` 继承了 `Person`。因为 `Person` 具有属性 `name` 和 `age`，子类 `Teacher` 需要通过 `super` 构造方法将这些共性数据传递给父类进行初始化：

```java 3:13:JavaStudy/src/com/itheima/oopextendstest11/Teacher.java
public class Teacher extends Person{
    private String subject;

    public Teacher() {
    }
    
    public Teacher(String name, int age, String subject) {
        super(name, age); // 通过super调用父类构造
        this.subject = subject;
    }
}
```

### 10.8.6 this 和 super 关键字对比与总结

#### 1. 核心概念与维度理解

| 关键字 | 内存的角度 | 代码的角度 |
| :--- | :--- | :--- |
| **`this`** | 代表所在方法调用者的**内存地址值**。 | 可以直接调用本类成员（包括：成员变量、成员方法、构造方法等）。 |
| **`super`** | - | 代表使用父类中的内容。 |

#### 2. `this` 与 `super` 的用法对比表格

| 关键字 | 成员变量 | 成员方法 | 构造方法 |
| :--- | :--- | :--- | :--- |
| **`this`** | `this.成员变量`<br>（访问本类成员变量） | `this.成员方法(...)`<br>（访问本类成员方法） | `this(...)`<br>（访问本类构造方法） |
| **`super`** | `super.成员变量`<br>（访问父类成员变量） | `super.成员方法(...)`<br>（访问父类成员方法） | `super(...)`<br>（访问父类构造方法） |

> **核心细节与限制**：
> 1. **`this(...)` 和 `super(...)` 必须放在构造方法的第一行**，因此它们**不能同时存在**于同一个构造方法中。
> 2. 如果构造方法中写了 `this(...)`，则该构造方法内不能再写 `super(...)`，JVM 也不会再自动添加默认的 `super()`。
> 3. 子类中如果存在多个构造方法，不能全部用 `this(...)` 互相调用（会导致死循环调用），一定要预留至少一个构造方法去调用父类的构造方法（通过 `super(...)` 或默认的 `super()`）。

#### 3. 实战示例

在 `com.itheima.oopextendstest10` 中，通过 `this(...)` 实现构造方法重载与默认值设定：

```java 3:17:JavaStudy/src/com/itheima/oopextendstest10/Student.java
public class Student {
    String name;
    int age;

    public Student() {
        this("同学",18); // 调用本类带参构造，设定默认值
        System.out.println("Student无参构造执行了~");
    }

    public Student(String name, int age) {
        super(); // 调用父类 Object 的构造方法
        this.name = name;
        this.age = age;
    }
}
```

## 10.9 多态 (Polymorphism)

### 10.9.1 什么是多态与表现形式

#### 1. 什么是多态？
多态是指**事物的多种形态**（即同一种事物在不同时刻表现出来的多种形态）。例如，学生既是学生，也是人类；猫和狗既是宠物，也都是动物。它们既能表现为通用的父类特征，也能在不同场景下表现为各自特有的子类特征。

#### 2. 表现形式
```java
父类类型 对象名称 = 子类对象;
```
* **经典示例**：
  ```java
  Fu f = new Zi();
  Person p = new Student();
  ```

---

### 10.9.2 多态的前提条件

| 前提条件 | 状态 | 详细说明 |
| :--- | :--- | :--- |
| **有继承/实现关系** | **必须** | 子类继承父类（`extends`）或实现类[实现接口](#1011-接口-interface)（`implements`）。 |
| **父类引用指向子类对象** | **必须** | 如 `Fu f = new Zi();` 或 `Person p = new Student();`。 |
| **有方法重写** | *可选（强烈推荐）* | 子类重写父类的方法。如果子类不重写方法，多态下的调用将直接执行父类逻辑，多态也将失去实际的业务意义。 |

---

### 10.9.3 多态中成员的访问特点

在多态形式下，对成员变量和成员方法的访问逻辑具有不同的特性。其核心规律可以总结为：

> **多态成员调用极简口诀**：
> - **变量调用**：编译看左边，运行也看左边。
> - **方法调用**：编译看左边，运行看右边。

| 成员类型 | 编译期间特点 (左边) | 运行期间特点 (左边/右边) | 核心机制与原因 |
| :--- | :--- | :--- | :--- |
| **成员变量** (变量调用) | **看左边**<br>（父类中必须存在该变量，否则编译报错） | **看左边**<br>（实际获取的是父类的成员变量值） | **成员变量不支持重写**。多态对象在编译期和运行期均绑定到声明类型（左边父类）的变量上。 |
| **成员方法** (方法调用) | **看左边**<br>（父类中必须存在该方法，否则编译报错） | **看右边**<br>（实际执行的是子类重写后的方法） | **成员方法支持重写**。在运行期，JVM 通过**动态绑定**（Dynamic Binding）机制，根据具体指向的实际子类对象来调用其重写后的方法。 |

---

### 10.9.4 多态的好处与弊端

| 维度 | 特点 | 说明与业务场景 | 应对与解决方式 |
| :--- | :--- | :--- | :--- |
| **好处 (利)** | **方法形参多态**<br>*(好处一)* | **方法中使用父类类型作为参数，可接收父类对象 + 所有子类对象**。<br>定义方法时，将参数类型声明为父类，即可同时接收父类本身及该父类的所有子类对象。大幅提升了代码的可扩展性与复用性。 | - |
| | **行为动态绑定**<br>*(好处二)* | **如果进行方法重写，利用多态调用方法，可以调用不同子类中重写的方法**。<br>利用多态调用方法时，会根据实际传入的子类对象类型，自动调用对应的子类重写方法，实现了业务逻辑与具体实现的解耦。 | - |
| **弊端 (弊)** | **无法直接访问子类特有成员** | 编译期间“看左边”，如果父类中没有子类特有的成员变量或方法，直接调用会产生编译错误。 | **向下转型（强制类型转换）**<br>格式：`子类类型 变量 = (子类类型) 父类引用;`<br>推荐在转型前使用 `instanceof` 关键字进行安全判断。 |

---

### 10.9.5 转型安全机制：`instanceof` 关键字

为了避免向下转型时抛出类型转换异常（`ClassCastException`），在强转前必须对实际类型进行校验。

#### 1. 传统安全强转
先使用 `instanceof` 判断类型，然后再进行手动强转：
```java
if (p instanceof Student) {
    Student s = (Student) p;
    s.study(); // 成功调用子类特有方法
}
```

#### 2. JDK 14+ 模式匹配写法（推荐）
在判断的同时自动完成转型，省去了手动声明和强转的代码：
```java
if (p instanceof Student s) {
    s.study(); // 一步到位，直接使用已转型好的 s 变量
}
```

---

### 10.9.6 实战示例：多态在方法形参中的应用

在项目 `com.itheima.oopextendstest11` 中，[`Student`](#1086-this-和-super-关键字对比与总结) 和 [`Teacher`](#1085-继承中构造方法的访问特点) 均继承自 [`Person`](#1085-继承中构造方法的访问特点)。
通过定义一个接收 `Person` 作为参数的通用方法，可灵活接收任何子类对象，并根据动态绑定执行各自重写的方法：

```java
public class PolymorphismDemo {
    public static void main(String[] args) {
        // 父类引用指向子类对象
        Person p1 = new Student("小明", 18, "高一");
        Person p2 = new Teacher("马老师", 35, "Java");

        // 统一调用通用的多态方法
        register(p1);
        register(p2);
    }

    // 多态的好处：接收父类类型，支持所有子类对象传入
    public static void register(Person p) {
        p.eat(); // 编译看左边（Person有eat），运行看右边（调用子类重写或继承的eat）
        p.sleep();
        
        // 解决多态弊端：通过 instanceof 转型安全调用子类特有成员
        if (p instanceof Student s) {
            s.study(); // 调用 Student 特有方法
        } else if (p instanceof Teacher t) {
            t.teach(); // 调用 Teacher 特有方法
        }
    }
}
```

## 10.10 抽象类与抽象方法 (Abstract Class & Method)

### 10.10.1 什么是抽象类和抽象方法

在面向对象的设计中，当多个子类拥有共同的行为，但每个子类的具体实现逻辑完全不同时，我们可以在父类中声明该行为，但无法确定具体的方法体。这种**没有方法体的方法**就是**抽象方法**，而**包含抽象方法的类**必须声明为**抽象类**。

* **设计初衷**：
  * **统一规范**：强制子类必须按照父类定义的格式进行[方法重写](#1084-继承中成员方法的访问特点与方法重写)，起到规范和约束的作用。
  * **代码复用**：将共性声明抽取到父类中，提高系统的可扩展性与可维护性。

---

### 10.10.2 抽象类与抽象方法的定义格式与特点

#### 1. 核心概念对比表格

| 概念 | 定义格式 | 核心特点与限制 | 作用/设计初衷 |
| :--- | :--- | :--- | :--- |
| **抽象方法** | `public abstract 返回值类型 方法名(参数列表);` | 1. 只有方法签名，**没有方法体** `{}`，以分号 `;` 结尾。<br>2. 强制子类按照该格式进行[重写](#1084-继承中成员方法的访问特点与方法重写)。 | 当多个子类有共性行为，但每个子类的具体实现不同时，在父类中无法确定具体方法体，故定义为抽象方法。 |
| **抽象类** | `public abstract class 类名 { ... }` | 1. **不能被实例化**（无法创建对象）。<br>2. 拥有抽象方法的类**必须**声明为抽象类。<br>3. 抽象类中不一定有抽象方法。<br>4. 可以拥有[构造方法](#106-构造方法-constructor)。 | 1. 作为子类的通用模板，约束子类的行为。<br>2. 抽象类中不写抽象方法时，纯粹是为了不让外界创建该类的对象。 |

#### 2. 深入理解核心注意事项

* **为什么抽象类不能实例化？**
  * *原因*：如果允许创建抽象类的对象，那么用该对象调用一个没有方法体的抽象方法是没有任何实际意义的。
* **抽象类中为什么可以有构造方法？**
  * *原因*：抽象类虽然不能直接实例化，但它的子类在创建对象时，仍需要通过 `super()` 调用父类的[构造方法](#106-构造方法-constructor)来完成父类成员变量的初始化（赋值）。
* **抽象类中不写抽象方法有什么作用？**
  * *原因*：当一个类中没有任何抽象方法，但被声明为 `abstract` 时，其唯一目的就是**禁止外界创建该类的对象**，通常用于纯工具类或基类设计。

---

### 10.10.3 继承抽象类时的子类选择

当一个具体类继承抽象类时，子类面临以下两种选择：

| 子类类型 | 处理方式 | 核心机制与后续影响 | 实用性与建议 |
| :--- | :--- | :--- | :--- |
| **具体子类** | **重写**父类中的**所有**抽象方法。 | 子类重写了所有抽象方法后，成为普通类，**可以被实例化**。 | **最常用、最推荐**。这是面向对象[多态](#109-多态-polymorphism)与模板设计模式的核心实现方式。 |
| **抽象子类** | 子类本身也声明为 **`abstract`**。 | 子类不需要重写父类的抽象方法，但该子类也**无法被实例化**。 | **较少使用**。后续仍需要一个具体的“孙子类”去继承该子类并重写所有抽象方法，外界才能创建孙子类对象。 |

---

### 10.10.4 实战示例

下面以经典的 `Animal` 体系为例，展示抽象类、抽象方法、构造方法初始化以及子类重写的完整实现：

```java
// 抽象父类
public abstract class Animal {
    private String name;
    private int age;

    // 抽象类中可以有构造方法，作用是给成员变量赋值
    public Animal() {
    }

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 抽象方法：只有方法签名，没有方法体，强制子类重写
    public abstract void eat();

    // 抽象类中也可以有普通方法，供子类继承
    public void drink() {
        System.out.println("动物在喝水");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

// 具体子类：必须重写父类的所有抽象方法
public class Dog extends Animal {
    public Dog() {
    }

    public Dog(String name, int age) {
        super(name, age); // 调用父类构造方法初始化成员变量
    }

    @Override
    public void eat() {
        System.out.println("狗吃骨头");
    }
}

// 具体子类：必须重写父类的所有抽象方法
public class Frog extends Animal {
    public Frog() {
    }

    public Frog(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println("青蛙吃害虫");
    }
}

// 测试类
public class Test {
    public static void main(String[] args) {
        // Animal a = new Animal(); // 编译报错：抽象类不能实例化

        // 通过多态创建子类对象
        Animal dog = new Dog("旺财", 3);
        Animal frog = new Frog("呱呱", 1);

        System.out.println(dog.getName() + "今年" + dog.getAge() + "岁了：");
        dog.eat();
        dog.drink();

        System.out.println("--------------------");

        System.out.println(frog.getName() + "今年" + frog.getAge() + "岁了：");
        frog.eat();
        frog.drink();
    }
}
```

## 10.11 接口 (Interface)

### 10.11.1 什么是接口与定义格式

- **概念**：接口就是一个**规则**，而且是**独立于继承体系以外的规则**（可以理解为“干爹”）。当一个类需要遵守某种规则，或者需要拥有某些**非继承链条上的行为**时，可以实现该接口。
- **定义格式**：使用 `interface` 关键字来定义。
  ```java
  public interface 接口名 {
      // 属性和方法声明
  }
  ```
- **使用（实现）格式**：使用 `implements` 关键字表示类和接口之间的实现关系。
  ```java
  public class 类名 implements 接口名 {
      // 重写接口中的抽象方法
  }
  ```

---

### 10.11.2 接口中成员的特点

接口中定义的成员有其独特的默认修饰符和限制：

| 成员类型 | 是否拥有 / 特点 | 默认修饰符 | 核心细节与版本特性 |
| :--- | :--- | :--- | :--- |
| **成员变量** | **只能是常量** | `public static final` | 即使不写，系统也会默认加上。必须在声明时赋值，不可再次修改。 |
| **构造方法** | **没有** | - | 接口不能实例化，且没有成员变量需要通过构造方法初始化，因此没有构造方法。 |
| **成员方法** | **主要是抽象方法** | `public abstract` | 随着 JDK 版本演进，新增了具有方法体的方法类型：<br>• **JDK 7 以前**：接口中只能定义抽象方法。<br>• **JDK 8 新特性**：允许定义**有方法体的方法**（**默认方法**和**静态方法**）。<br>• **JDK 9 新特性**：允许定义**私有方法**（`private`）。 |

---

### 10.11.3 接口的三个核心注意点

1. **不能实例化**：接口无法直接通过 `new` 创建对象。
2. **实现类要求**：接口的子类（实现类），要么**重写接口中所有的抽象方法**，要么该实现类**本身必须声明为抽象类**（`abstract`）。
3. **多实现与多继承**：一个类可以实现多个接口，也可以在继承一个类的同时，实现多个接口。
   ```java
   public class 类名 implements 接口1, 接口2 { ... }
   public class 类名 extends 父类 implements 接口1, 接口2 { ... }
   ```

---

### 10.11.4 类、接口之间的关系与核心机制

在 Java 中，类与类、类与接口、接口与接口之间的关系及限制如下：

| 关系类型 | 涉及对象 | 关系关键字 | 数量限制 | 核心机制与细节注意点 |
| :--- | :--- | :--- | :--- | :--- |
| **类与类** | 类 与 类 | `extends` (继承) | **单继承** | 只能单继承，不能多继承，但是可以**多层继承**。 |
| **类与接口** | 类 与 接口 | `implements` (实现) | **多实现** | 可以单实现，也可以多实现，还可以在**继承一个类的同时实现多个接口**。<br>**注意点**：<br>1. 如果父类是抽象类，且子类是具体类，那么子类中需要把父类的所有抽象方法以及接口中的所有抽象方法都进行重写，要么子类本身必须是抽象类。<br>2. 如果在重写的时候，父类和接口（或多个接口之间）出现了**重复的抽象方法**，此时在子类中**只要重写一次**即可。 |
| **接口与接口** | 接口 与 接口 | `extends` (继承) | **多继承** | 可以单继承，也可以**多继承**。<br>**注意点**：<br>1. 如果一个接口 A 继承了多个接口（如 B, C），此时相当于把多个接口（B, C）中的所有抽象方法全部继承下来。<br>2. 以后任何具体的实现类在实现接口 A 时，必须重写 A 及其所有父接口（B, C）中**所有的抽象方法**。 |

---

### 10.11.5 接口中方法的新特性（JDK 8 & JDK 9）

随着 JDK 版本的演进，接口不仅能定义 `public abstract` 的抽象方法，更可以编写具有方法体的方法，以支持**接口升级**和**接口内部的代码复用**需求。

#### 1. 新增方法类型一览表

| 方法类型 | 引入版本 | 格式 | 核心作用与设计初衷 | 核心限制与注意事项 |
| :--- | :--- | :--- | :--- | :--- |
| **默认方法** | **JDK 8** | `public default 返回值类型 方法名(参数列表) { ... }` | **为了接口升级而存在**。允许直接在已有接口中添加新功能而**不会影响**现有实现类，实现类可以直接继承或选择性重写，防止了实现类成批报错的升级灾难。 | 1. 默认方法不是抽象方法，不强制重写。<br>2. 若实现类选择重写，重写时**必须去掉 `default` 关键字**。<br>3. `public` 可以省略，`default` 不能省略。<br>4. 接口多实现时，若多个接口中存在同名默认方法（接口冲突），实现类**必须重写该方法**。 |
| **静态方法** | **JDK 8** | `public static 返回值类型 方法名(参数列表) { ... }` | **为了接口升级而存在**。使接口具备类似工具类的辅助功能，不依赖实现类对象，属于接口本身。 | 1. **静态方法只能通过接口名调用**，绝对不能通过实现类名或实现类对象名调用。<br>2. `public` 可以省略，`static` 不能省略。 |
| **普通私有方法** | **JDK 9** | `private 返回值类型 方法名(参数列表) { ... }` | 服务于本接口内的**默认方法**。用于抽取并复用默认方法之间的共性代码，实现隐藏细节和代码复用。 | 只能在本接口内部调用，不对外暴露。 |
| **静态私有方法** | **JDK 9** | `private static 返回值类型 方法名(参数列表) { ... }` | 既可服务于本接口内的**静态方法**，也可服务于默认方法。用于抽取并复用静态方法之间的重复代码。 | 只能在本接口内部调用，不对外暴露。由于静态成员无法直接访问非静态成员，因此静态方法内的代码抽取必须放在静态私有方法中。 |

#### 2. 实战片段：接口新特性与私有抽取

```java
public interface Inter {
    // 抽象方法 (JDK 7以前)
    void show();

    // 默认方法 (JDK 8新特性)：实现类可直接继承或按需重写
    public default void defaultMethod1() {
        System.out.println("默认方法1开始执行...");
        logTemplate(); // 抽取私有复用
    }

    public default void defaultMethod2() {
        System.out.println("默认方法2开始执行...");
        logTemplate(); // 抽取私有复用
    }

    // 静态方法 (JDK 8新特性)：只能通过接口名直接调用，不能通过实现类或对象调用
    public static void staticMethod1() {
        System.out.println("静态方法1开始执行...");
        staticLogTemplate(); // 抽取静态私有复用
    }

    public static void staticMethod2() {
        System.out.println("静态方法2开始执行...");
        staticLogTemplate(); // 抽取静态私有复用
    }

    // 普通私合方法 (JDK 9新特性)：辅助默认方法
    private void logTemplate() {
        System.out.println("【日志记录】接口非静态辅助逻辑被触发");
    }

    // 静态私有方法 (JDK 9新特性)：辅助静态方法 (也可用于默认方法)
    private static void staticLogTemplate() {
        System.out.println("【日志记录】接口静态辅助逻辑被触发");
    }
}

// 具体实现类
public class InterImpl implements Inter {
    @Override
    public void show() {
        System.out.println("实现类重写了抽象方法 show");
    }
    // 默认方法 defaultMethod1 / defaultMethod2 可以直接继承，无需强制重写
}

// 测试类
public class Test {
    public static void main(String[] args) {
        InterImpl impl = new InterImpl();
        impl.show();
        impl.defaultMethod1(); // 通过对象调用继承过来的默认方法

        // 静态方法的调用验证：
        Inter.staticMethod1(); // 正确：只能通过【接口名.静态方法名】方式调用
        // impl.staticMethod1(); // 编译报错：无法通过实现类对象调用接口中的静态方法
        // InterImpl.staticMethod1(); // 编译报错：无法通过实现类名调用接口中的静态方法
    }
}
```

---

### 10.11.6 实战示例：继承与实现并存

以下示例接续 [10.10.4 抽象类与抽象方法实战](#10104-实战示例)，引入一个 `Swim`（游泳）接口，使部分能游泳的动物（如青蛙、狗）实现该游泳规则：

```java
// 定义游泳接口（独立于动物继承体系之外的规则）
public interface Swim {
    // 接口中的成员变量默认是 public static final 的常量
    int WATER_TEMPERATURE_LIMIT = 15; // 限制游泳的最低水温

    // 接口中的成员方法默认是 public abstract 的抽象方法
    void swim();
}

// 青蛙：继承 Animal 并实现 Swim 接口
public class Frog extends Animal implements Swim {
    public Frog() {
    }

    public Frog(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println("青蛙吃害虫");
    }

    @Override
    public void swim() {
        System.out.println("青蛙用蛙泳在水中畅游");
    }
}

// 狗：继承 Animal 并实现 Swim 接口
public class Dog extends Animal implements Swim {
    public Dog() {
    }

    public Dog(String name, int age) {
        super(name, age);
    }

    @Override
    public void eat() {
        System.out.println("狗吃骨头");
    }

    @Override
    public void swim() {
        System.out.println("狗在用狗刨式游泳");
    }
}

// 测试类
public class Test {
    public static void main(String[] args) {
        // 多态形式创建实现类对象
        Swim swimmer1 = new Frog("呱呱", 1);
        Swim swimmer2 = new Dog("旺财", 3);

        // 调用接口方法
        swimmer1.swim();
        swimmer2.swim();

        System.out.println("安全水温限制：" + Swim.WATER_TEMPERATURE_LIMIT + "℃");
    }
}
```

## 10.12 内部类 (Inner Class)

### 10.12.1 什么是内部类与使用场景

- **什么是内部类**：写在一个类里面的类就叫做内部类。包裹内部类的类称为**外部类**。
- **使用场景**：一个类表示的事物是另一个类的一部分，且该事物**单独存在没有意义**。
  - *典型实例*：汽车与发动机（Engine）、人与心脏（Heart）。

---

### 10.12.2 内部类的分类

根据定义的位置和修饰符的不同，Java 中的内部类可分为以下四类：

| 内部类类型 | 定义位置 | 特点与要求级别 | 后续发展与延伸 |
| :--- | :--- | :--- | :--- |
| [**成员内部类**](#10123-成员内部类核心要点) | 成员位置（类中方法外，与成员变量平级） | 属于外部类的成员，了解即可 | - |
| [**静态内部类**](#10124-静态内部类核心要点) | 成员位置，且使用 `static` 修饰 | 属于外部类本身，了解即可 | - |
| [**局部内部类**](#10125-局部内部类核心要点) | 方法内部 | 只能在定义它的方法内使用，了解即可 | - |
| **匿名内部类** | 任意可创建对象或作为参数的位置 | **核心重点，必须掌握** | 是后续学习 **Lambda 表达式**和**方法引用**的关键基石。 |

---

### 10.12.3 成员内部类核心要点

成员内部类是最基础的内部类，具有以下核心语法和版本特性：

#### 1. 成员修饰符支持
成员内部类作为外部类的成员，可以被任意成员访问权限修饰符修饰，包括 `private`、`默认`、`protected`、`public` 等。


#### 3. 获取成员内部类对象的两种方式

根据内部类的访问修饰符是否为 `private`，获取其对象有以下两种主要方式：

| 场景（修饰符） | 获取对象方式 | 语法格式与范例 | 核心机制 / 适用场景 |
| :--- | :--- | :--- | :--- |
| **被 `private` 修饰时** | **通过外部类方法间接获取** | **外部类提供获取方法**：<br>```public Inner getInstance() {                 return new Inner(); } ``` | 隐藏内部类的实现细节，不允许外部直接 `new` 内部类，属于高封装性场景。 |
| **被非私有修饰时** | **直接创建对象** | **格式**：`外部类名.内部类名 对象名 = new 外部类().new 内部类();`<br>**范例**：`Outer.Inner oi = new Outer().new Inner();` | 外部可直接调用内部类行为的简易场景。 |

##### 示例：获取成员内部类对象的两种方式

###### 场景一：被 `private` 修饰时（汽车与私有发动机的高封装性）

```java
// 外部类：汽车
public class Car {
    private String carName;
    private int carAge;
    private String carColor;

    public Car(String carName, int carAge, String carColor) {
        this.carName = carName;
        this.carAge = carAge;
        this.carColor = carColor;
    }

    // 外部类提供方法，启动发动机并间接运行其逻辑
    public void startCar() {
        Engine engine = new Engine();
        engine.engineName = "V8 双涡轮增压发动机";
        engine.show();
    }

    // 私有成员内部类：发动机（高封装性，外界无法直接访问）
    private class Engine {
        private String engineName;

        public void show() {
            System.out.println("汽车型号：" + carName + "，车龄：" + carAge + "年，颜色：" + carColor);
            System.out.println("发动机型号：" + engineName + "，正在启动...");
        }
    }
}

// 测试类
public class TestCar {
    public static void main(String[] args) {
        // 调用汽车示例，启动并间接运行私有内部类逻辑
        Car myCar = new Car("保时捷911", 2, "熔岩橙");
        myCar.startCar();
    }
}
```

###### 场景二：被非私有修饰时（直接创建非私有内部类对象）

```java
// 外部类
public class Outer {
    // 非私有成员内部类
    public class Inner {
        public void show() {
            System.out.println("非私有成员内部类的方法被调用");
        }
    }
}

// 测试类
public class TestOuter {
    public static void main(String[] args) {
        // 直接创建非私有内部类对象
        Outer.Inner oi = new Outer().new Inner();
        oi.show();
    }
}
```

#### 4. 成员变量重名时的访问机制 (`Outer.this`)
当外部类的成员变量和内部类的成员变量出现**重名**时，如果在内部类方法中直接访问该变量，默认遵循**就近原则**（优先访问内部类成员或局部变量）。
若想在**内部类中显式访问外部类的同名成员变量**，必须使用以下格式：

```java
外部类名.this.变量名
```
- *底层原理*：`外部类名.this` 代表当前正在访问的外部类对象的内存地址。

##### 示例：成员变量重名时的访问机制

```java
// 外部类
public class Outer {
    private String name = "外部类变量";

    // 成员内部类
    public class Inner {
        private String name = "内部类变量";

        public void show() {
            String name = "方法局部变量";
            
            System.out.println(name);             // 局部变量（就近原则）："方法局部变量"
            System.out.println(this.name);        // 内部类成员变量："内部类变量"
            System.out.println(Outer.this.name);  // 外部类成员变量："外部类变量"
        }
    }
}

// 测试类
public class TestShadow {
    public static void main(String[] args) {
        Outer.Inner oi = new Outer().new Inner();
        oi.show();
    }
}
```

---

### 10.12.4 静态内部类核心要点

静态内部类是一种特殊的成员内部类，使用 `static` 关键字修饰。它属于外部类本身，而不属于外部类的某个具体对象。

#### 1. 成员访问规则

静态内部类在访问外部类成员时，具有以下限制：

| 外部类成员类型 | 访问规则 | 核心机制与原因 |
| :--- | :--- | :--- |
| **静态成员** | **直接访问** | 静态内部类与外部类的静态成员同属于类级别，可直接调用。 |
| **非静态成员** | **间接访问（需创建外部类对象）** | 静态内部类加载时可能还没有外部类对象，因此无法直接访问非静态成员，必须通过外部类对象实例访问。 |

#### 2. 对象创建与方法调用

静态内部类对象的创建不依赖于外部类对象。其调用规则如下：

| 方法类型 | 调用方式 | 语法格式与示例 |
| :--- | :--- | :--- |
| **非静态方法** | 先创建静态内部类对象，再通过对象调用。 | **创建对象**：`外部类名.内部类名 对象名 = new 外部类名.内部类名();`<br>**示例**：`Outer.Inner oi = new Outer.Inner(); oi.show();` |
| **静态方法** | 无需创建对象，直接通过类名调用。 | **格式**：`外部类名.内部类名.方法名();`<br>**示例**：`Outer.Inner.showStatic();` |

##### 示例：静态内部类的对象创建与方法调用

```java
// 外部类
public class Outer {
    private static String staticField = "外部类静态变量";
    private String instanceField = "外部类普通变量";

    // 静态内部类
    public static class StaticInner {
        // 静态内部类中的非静态方法
        public void show() {
            System.out.println(staticField); // 直接访问外部类静态成员
            
            // System.out.println(instanceField); // 编译报错：无法直接访问外部类非静态成员
            Outer outer = new Outer();
            System.out.println(outer.instanceField); // 间接访问外部类非静态成员
        }

        // 静态内部类中的静态方法
        public static void showStatic() {
            System.out.println("静态内部类的静态方法被调用");
        }
    }
}

// 测试类
public class TestStatic {
    public static void main(String[] args) {
        // 1. 创建静态内部类对象并调用非静态方法
        Outer.StaticInner oi = new Outer.StaticInner();
        oi.show();

        // 2. 直接通过类名调用静态内部类的静态方法
        Outer.StaticInner.showStatic();
    }
}
```

---

### 10.12.5 局部内部类核心要点

局部内部类是定义在**方法内部**的类，其作用域和生命周期仅限于该方法内，类似于方法中的局部变量。

#### 1. 核心特性与限制

局部内部类具有以下核心规则：

| 维度 | 规则与限制 | 核心机制与细节 |
| :--- | :--- | :--- |
| **生命周期与作用域** | **仅限方法内部** | 外界无法直接使用局部内部类。必须在定义它的方法内部创建其对象并使用。 |
| **外部类成员访问** | **直接访问** | 局部内部类可以直接访问外部类的所有成员（包括私有、静态与非静态成员）。 |
| **局部变量访问** | **直接访问（但变量必须是 final 或实际不可变）** | 局部内部类可以直接访问方法内的局部变量，但该变量在 JDK 8 之前必须显式声明为 `final`；JDK 8 及之后必须是实际不可变（effectively final，即值不发生改变）。 |

---
#### 2. 示例：局部内部类的定义与局部变量访问

```java
// 外部类
public class Outer {
    private String outerField = "外部类变量";

    public void method() {
        int localVal = 100; // 方法内的局部变量

        // 局部内部类：定义在方法内部
        class LocalInner {
            public void show() {
                System.out.println(outerField); // 直接访问外部类成员
                System.out.println(localVal);   // 直接访问方法内的局部变量
            }
        }

        // 必须在方法内部创建对象并使用
        LocalInner li = new LocalInner();
        li.show();
    }
}

// 测试类
public class Test {
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.method(); // 调用方法，间接执行局部内部类逻辑
    }
}
```

---

### 10.12.6 匿名内部类核心要点

匿名内部类是**没有名字的内部类**。它是一种特殊的[局部内部类](#10125-局部内部类核心要点)，通常在需要临时实现某个[接口](#1011-接口-interface)或[继承](#108-继承-inheritance)某个类，且该实现类**只使用一次**的场景下使用。

#### 1. 核心定义与等价关系

匿名内部类的本质是一个**一步到位**的语法糖。其核心定义与底层逻辑如下表所示：

| 维度 | 说明 | 核心要点与细节 |
| :--- | :--- | :--- |
| **什么是匿名内部类** | 隐藏了名字的内部类。 | 既可以定义在外部类的**成员位置**，也可以定义在方法内部的**局部位置**。 |
| **底层等价关系** | 是一套合并操作的语法糖。 | 等效于：**没有名字的 Java 类** + **实现接口/继承父类** + **重写方法** + **创建该类对象**。 |
| **核心使用场景** | **实现类只要使用一次**。 | 当某个接口或父类的实现类仅需要临时、单次使用时，可以用匿名内部类极大地简化代码，省去单独创建实体类的步骤。 |

---

#### 2. 语法格式

匿名内部类的语法结构高度紧凑，其核心格式剖析如下：

```java
new 类名或者接口名() {
    // 重写方法
};
```

##### 语法结构详解

| 组成部分 | 作用与机制 | 详细说明 |
| :--- | :--- | :--- |
| **`new`** | 创建对象的关键字 | 匿名内部类在定义的同时就会直接创建出其唯一的实例对象。 |
| **`类名或者接口名`** | 指定要继承的父类或实现的接口 | - 若指定的是类（具体类/抽象类），则代表匿名内部类继承该类。<br>- 若指定的是[接口](#1011-接口-interface)，则代表匿名内部类实现该接口。 |
| **`()`** | 构造器调用参数列表 | - 继承父类时，此处可传入参数以调用父类有参构造器。<br>- 实现接口时，此处必须保持为空括号 `()`。 |
| **`{ ... }`** | 类体（Class Body） | 在其中编写需要重写（Override）的方法。对于继承的抽象类或实现的接口，必须重写其所有的抽象方法。 |
| **`;`** | 分号结束符 | **绝对不能省略**。因为匿名内部类整体是一个创建对象并赋值（或作为参数传递）的表达式语句。 |

---

#### 3. 示例：匿名内部类的基本使用

以下示例展示了通过实现[接口](#1011-接口-interface)来创建和使用匿名内部类的完整流程。

##### 示例：通过实现接口使用匿名内部类

```java
/**
 * 游泳接口
 */
public interface Swim {
    /**
     * 游泳抽象方法
     */
    void swimming();
}

/**
 * 测试匿名内部类
 */
public class TestAnonymous {
    /**
     * 主方法
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        // 1. 使用匿名内部类实现接口并创建对象
        Swim s = new Swim() {
            /**
             * 重写接口方法
             */
            @Override
            public void swimming() {
                System.out.println("正在快乐地游泳...");
            }
        };

        // 调用方法
        s.swimming();

        // 2. 匿名内部类作为方法参数传递（最常用的场景）
        goSwimming(new Swim() {
            /**
             * 重写接口方法
             */
            @Override
            public void swimming() {
                System.out.println("小明正在游泳...");
            }
        });
    }

    /**
     * 统一调用游泳的方法
     * 
     * @param s 游泳接口实例
     */
    public static void goSwimming(Swim s) {
        s.swimming();
    }
}
```

---

#### 4. 匿名内部类的局限性

虽然匿名内部类极大地方便了单次多态场景下的代码编写，但其在结构和灵活性上存在以下硬性局限：

| 局限性维度 | 规则与限制 | 核心原因与机制 |
| :--- | :--- | :--- |
| **复用性限制** | **只能使用一次** | 由于没有具名的类名，无法在其他地方通过 `new 类名()` 重复创建不同的对象。 |
| **构造器限制** | **不能定义构造方法** | 构造器名称必须与类名相同。由于匿名内部类没有类名，因此无法显式声明构造方法。若需要初始化，只能使用实例初始化块 `{ ... }` |
| **承载性限制** | **只能继承一个类或实现一个接口** | 语法上限制了其只能在 `new` 后面指定唯一的一个父类或唯一的一个接口，无法同时多继承或多实现。 |
| **变量访问限制** | **只能访问有效 final 的局部变量** | 与[局部内部类](#10125-局部内部类核心要点)一致，在方法中访问的局部变量必须是实际不可变（effectively final，即其值在初始化后绝不改变）。 |



