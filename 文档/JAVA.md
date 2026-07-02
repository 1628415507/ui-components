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
