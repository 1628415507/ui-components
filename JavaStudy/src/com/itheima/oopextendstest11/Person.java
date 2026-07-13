package com.itheima.oopextendstest11;

public class Person {
    private String name;
    private int age;


    // 构造方法
    //  空参构造
    public Person() {
    }
    //  带全部参数的构造
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    // get/set
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
    // 行为
    public void eat(){
        System.out.println("吃饭~");
    }

    public void sleep(){
        System.out.println("睡觉~");
    }

}
