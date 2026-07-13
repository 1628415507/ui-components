package com.itheima.oopextendstest11;

public class MatserStudent extends Student{

    public MatserStudent() {
    }

    public MatserStudent(String name, int age, String grade) {
        super(name, age, grade);
    }

    @Override
    public void study() {
        System.out.println("硕士研究生的同学正在攻读硕士内容~");
    }

    // 过了一段时间，硕士研究生住宿条件升级，在豪华版学生公寓睡觉
    @Override
    public void sleep() {
        System.out.println("硕士研究生住宿条件升级，在豪华版学生公寓睡觉~");
    }
}
