package com.itheima.oopextendstest11;

public class BachelorStudent extends Student{

    // 私有化成员变量 不写 没有独有的


    // 空参构造
    // 带全部参数的构造（间接父类 + 直接父类 + 自己）
    public BachelorStudent() {
    }

    public BachelorStudent(String name, int age, String grade) {
        super(name, age, grade);
    }

    // get / set

    // 重写学习的方法

    @Override
    public void study() {
        System.out.println("本科的同学正在攻读本科内容~");
    }
}
