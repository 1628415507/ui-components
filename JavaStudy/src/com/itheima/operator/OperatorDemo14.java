package com.itheima.operator;

public class OperatorDemo14 {
    public static void main(String[] args) {
        // 利用三元运算符，求两个整数的较大值


        // 1.定义两个变量，记录整数
        int a = 30;
        int b = 20;

        // 2.利用三元运算符，求两个整数的较大值
        // 格式： 关系表达式 ? 表达式1 ： 表达式2；
        int max = a > b ?  a : b;
        System.out.println(max);


        System.out.println(a > b ?  a : b);

    }
}
