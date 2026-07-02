package com.itheima.variable;

import java.util.Scanner;

public class VariableDemo8 {
    public static void main(String[] args) {

        // BMI = 体重 / 身高的平方


        // 1. 键盘录入体重 KG  69.3
        Scanner sc = new Scanner(System.in);

         // 整数
        // // 2.让Scanner干活
        // System.out.println("请键盘录入第一个整数:");
        // int num1 = sc.nextInt(); // 获取键盘输入的值
        // System.out.println(num1);


        // // 3. 让Scanner再次接收第二个整数
        // System.out.println("请键盘录入第二个整数");
        // int num2 = sc.nextInt();
        // System.out.println(num2);

        // // 4.求和
        // int result = num1 + num2;
        // System.out.println(result);

        // 小数
        System.out.println("请输入您的体重：");
        double weight = sc.nextDouble();

        // 2. 键盘录入身高 M
        System.out.println("请输入您的身高：");
        double height = sc.nextDouble();

        // 3. 计算BMI
        double bmi = weight / (height * height);
        System.out.println(bmi);

       


    }
}
