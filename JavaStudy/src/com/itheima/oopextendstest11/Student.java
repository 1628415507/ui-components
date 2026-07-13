package com.itheima.oopextendstest11;

public class Student extends Person{
    private String grade;

    // 空参构造
    // 带全部参数的构造方法（父 + 子）
    public Student() {
    }

    public Student(String name, int age, String grade) {
        super(name, age);
        this.grade = grade;
    }

    // get/set
    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
    // 行为
    public void study(){
        System.out.println("学生正在学习~");
    }



}
