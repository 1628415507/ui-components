package com.itheima.ooptest10;

public class Test {
    public static void main(String[] args) {
     /*
        定义一个Javabean类描述学生：
            属性：姓名  年龄
            行为：学习，吃饭，睡觉
     */

        // 创建对象
        Student stu1 = new Student();
        stu1.setName("zhangsan");
        stu1.setAge(23);
        System.out.println(stu1.getName());
        System.out.println(stu1.getAge());
        stu1.study();
        stu1.eat();
        stu1.sleep();

        Student stu2 = new Student("lisi",24);
        System.out.println(stu2.getName());
        System.out.println(stu2.getAge());
        stu2.study();
        stu2.eat();
        stu2.sleep();


        System.out.println(stu1);


    }

}
