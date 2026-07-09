package com.itheima.ooptest9;

public class Test {
    public static void main(String[] args) {
        /*
         * 构造方法的注意事项:
         * 1. 如果没有定义构造方法，系统将给出一个默认的无参数构造方法
         * 2. 如果自己写了任意构造方法，系统将不再提供默认的构造方法
         * 3. 带参构造方法和无参数构造方法，两者方法名相同，但是参数不同，这叫做构造方法的重载
         * 4. 习惯：无论是否使用，都手动书写无参数构造方法，和带全部参数的构造方法
         * 
         */

        // 创建对象
        Student s = new Student();//默认调用空参的构造方法
        System.out.println(s.getName());
        System.out.println(s.getAge());
        System.out.println(s.getGender());
        System.out.println(s.getHeight());

        // 创建对象，调用带全部参数的构造方法
        Student ss = new Student("zhangsan", 23, "男", 175);
        System.out.println(ss.getName());
        System.out.println(ss.getAge());
        System.out.println(ss.getGender());
        System.out.println(ss.getHeight());

    }
}
