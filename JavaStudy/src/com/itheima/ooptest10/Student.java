package com.itheima.ooptest10;

public class Student {
    // 姓名  年龄
    private String name;
    private int age;

    // 构造方法
    // alt + (Fn) +insert
    public Student() {
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // set/get
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

    // 行为：学习，吃饭，睡觉
    public void study(){
        System.out.println(name + "正在学习~");
    }
    public void eat(){
        System.out.println(name + "正在吃饭~");
    }
    public void sleep(){
        System.out.println(name + "正在睡觉~");
    }
}
