> - [JAVA学习视频](https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=4)
> - [视频配套笔记](https://heuqqdmbyk.feishu.cn/docx/Zx5tdqkrpoVXFuxTPBSc5cEhnuJ)

# 环境配置
## 安装JDK
1. [下载JDK](https://www.oracle.com/java/technologies/downloads/#jdk25-windows) -> (配置环境变量)[https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=5]

## [安装IDEA](https://www.bilibili.com/video/BV1TJxCzSEEZ?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=6)


# 关键字
| 关键字 | 作用 | 示例 |
| :--- | :--- | :--- |
| package | 表示当前的类定义在哪个包下 | `package com.deepinsights.ilp.system.utils;` |
| public static void main | 表示Java程序的主入口，当程序开始运行的时候，会从主入口开始逐行往下执行 | `public static void main(String[] args) { ... }` |

# 数据类型

## 分类
- **基本数据类型**
- **引用数据类型**

## 基本数据类型（四类八种）
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

# 字面量
| 字面量类型 | 数据类型 | 说明 | 举例 |
| :--- | :--- | :--- | :--- |
| 整数类型 | [`byte`](#基本数据类型四类八种)、[`short`](#基本数据类型四类八种)、[`int`](#基本数据类型四类八种)、[`long`](#基本数据类型四类八种) | 直接写 | 18, -88 |
| 小数类型 | [`double`](#基本数据类型四类八种)、[`float`](#基本数据类型四类八种) | 直接写，加上小数点 | 1.93, -5.21 |
| 字符串类型 | `String` | 用双引号引起 | "尼古拉斯·纯情·暖男·天真·阿玮" |
| 字符类型 | [`char`](#基本数据类型四类八种) | 用单引号引起，**内容只能有一个** | '男', 'A', '0' |
| 布尔类型 | [`boolean`](#基本数据类型四类八种) | 布尔值，表示真假 | true, false |
| 空类型 | - | 一个特殊的值，空值 | null |

# 常用 API

## Scanner (键盘录入)

`Scanner` 类用于获取用户的键盘输入。

### 使用步骤
1. **导包**：`import java.util.Scanner;`（必须放在类定义的上面）
2. **创建对象**：`Scanner sc = new Scanner(System.in);`
3. **接收数据**：根据需要调用对应的方法。

### 常用方法
| 方法名 | 作用 | 示例 |
| :--- | :--- | :--- |
| `nextInt()` | 接收键盘录入的一个[整数](#基本数据类型四类八种) | `int i = sc.nextInt();` |
| `nextDouble()` | 接收键盘录入的一个[小数](#基本数据类型四类八种) | `double d = sc.nextDouble();` |

# 运算符

## 算术运算符

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

## 类型转换

在 Java 中，当不同类型的数据进行运算时，需要转换为同一类型。

### 1. 隐式转换 (自动提升)
**规则**：取值范围小的类型，自动提升为取值范围大的类型。
- `byte` / `short` / `char` 参与运算时，首先提升为 `int`。
- 转换层级：`byte` -> `short` -> `int` -> `long` -> `float` -> `double`。

### 2. 强制转换 (手动转换)
**格式**：`目标数据类型 变量名 = (目标数据类型) 被强转的数据;`
> **风险**：可能会导致精度丢失或数据溢出。

```11:25:JavaStudy/src/com/itheima/operator/OperatorDemo4.java
        // 请说出下面代码在计算的时候，类型转换的情况
        /*
        *   1. b + s
        *   先把byte类型的100，和short类型的200   提升为int类型
        *   结果：300（int）
        *
        *
        *   2.300（int） + d
        *   int类型的300会提升为double类型，变成300.0
        *   结果：320.3（double）
        *
        *
        * */
```

## 字符串拼接

当 `+` 运算符左右两边出现字符串时，其作用变为**拼接**。
- **规则**：任意数据类型与字符串拼接，结果都是一个新的字符串。
- **示例**：`"个位是：" + ge` -> `"个位是：3"`

## 赋值运算符

| 符号 | 作用 | 示例 | 说明 |
| :--- | :--- | :--- | :--- |
| `=` | 赋值 | `int a = 10;` | 将右边的值交给左边 |
| `+=` | 加后赋值 | `a += b;` | 相当于 `a = a + b;` |
| `-=` | 减后赋值 | `a -= b;` | 相当于 `a = a - b;` |
| `*=` | 乘后赋值 | `a *= b;` | 相当于 `a = a * b;` |
| `/=` | 除后赋值 | `a /= b;` | 相当于 `a = a / b;` |
| `%=` | 取模后赋值 | `a %= b;` | 相当于 `a = a % b;` |

## 关系运算符 (比较运算符)

| 符号 | 作用 | 结果类型 |
| :--- | :--- | :--- |
| `==` | 判断是否相等 | `boolean` |
| `!=` | 判断是否不等 | `boolean` |
| `>` | 大于 | `boolean` |
| `>=` | 大于等于 | `boolean` |
| `<` | 小于 | `boolean` |
| `<=` | 小于等于 | `boolean` |

## 逻辑运算符

| 符号 | 名称 | 作用 |
| :--- | :--- | :--- |
| `&` | 逻辑与 | 且（两边都为真才为真） |
| `\|` | 逻辑或 | 或（只要有一个为真即为真） |
| `!` | 逻辑非 | 取反 |

### 短路逻辑运算符
- `&&` (短路与)：如果左边为假，右边不再执行。
- `||` (短路或)：如果左边为真，右边不再执行。

## 三元运算符

**格式**：`关系表达式 ? 表达式1 : 表达式2;`
- **执行流程**：计算关系表达式，若为 `true` 则取 `表达式1` 的值，若为 `false` 则取 `表达式2` 的值。

```12:15:JavaStudy/src/com/itheima/operator/OperatorDemo14.java
        // 2.利用三元运算符，求两个整数的较大值
        // 格式： 关系表达式 ? 表达式1 ： 表达式2；
        int max = a > b ?  a : b;
        System.out.println(max);
```

### 实战示例

```14:20:JavaStudy/src/com/itheima/variable/VariableDemo7.java
        // 1.找到Scanner这个打工人
        Scanner sc = new Scanner(System.in); // 获取键盘对象

        // 2.让Scanner干活
        System.out.println("请键盘录入第一个整数:");
        int num1 = sc.nextInt(); // 获取键盘输入的值
        System.out.println(num1);
```

```12:18:JavaStudy/src/com/itheima/variable/VariableDemo8.java
        Scanner sc = new Scanner(System.in);
        System.out.println("请输入您的体重：");
        double weight = sc.nextDouble();

        // 2. 键盘录入身高 M
        System.out.println("请输入您的身高：");
        double height = sc.nextDouble();
```

# 流程控制语句
## 判断语句——if
## 选择语句——switch
1. 表达式：结果（字符/整数byte short int/枚举/字符串）--- 跳转表，索引不支持小数，也不支持大的整数long
2. case：被匹配的值，只能是真实的数据 --- 不能写变量的
3. case：值不允许重复
4. break：表示中断，结束的意思，结束switch语句 --- break关键字，作用结束switch语句,在我们写代码的时候，如果break没有写，此时就会触发case穿透现象
5. default：所有情况都不匹配，执行该处的内容 --- if里面的else是非常类似的
6. switch新特性: 
    - 箭头标签
    - case后面可以写多个值
    - switch可以有运行结果
    - yield 关键字

## 循环语句

### 1. for 循环
用于已知循环次数的场景。

### 2. while 循环
用于不确定循环次数，仅需满足条件的场景。


### 3. for 与 while 的对比
- 相同点：先判断后执行
- 不同点：

| 特性 | `for` 循环 | `while` 循环 |
| :--- | :--- | :--- |
| **相同点** | 运行规则一致（初始化 -> 判断 -> 执行 -> 迭代） | 运行规则一致 |
| **变量作用域** | 控制循环的变量归属于 `for` 语法结构，**循环结束后无法访问**。 | 控制循环的变量不归属于其语法结构，**循环结束后仍可继续使用**。 |

### 4. do...while 循环
**特点**：先执行后判断，循环体**至少执行一次**。

### 5. 无限循环 (死循环)
循环条件永远为 `true`，导致循环永不停止。
| 格式 | 语法结构 | 说明 |
| :--- | :--- | :--- |
| `for` 格式 | `for ( ; ; ) { ... }` | 最为简洁的格式 |
| `while` 格式 | `while (true) { ... }` | **最常用**的格式 |
| `do...while` 格式 | `do { ... } while (true);` | 较少使用 |

> **注意**：在无限循环的**下方**不能编写任何其他代码，因为程序永远无法执行到该位置。
