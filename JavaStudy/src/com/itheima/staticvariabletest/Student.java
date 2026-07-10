package com.itheima.staticvariabletest;

public class Student {

    String name;// 姓名
    int age;// 年龄

    // 一个班级的学生共享一个老师
    // 类共享的数据使用static关键字修饰
    static String teacherName; // 老师的名字
}
