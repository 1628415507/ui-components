package com.itheima.method;

public class MethodDemo6 {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        System.out.println(getSum(a, b));// 优先调用 实参、形参一一对应的那个方法

        // 方法的重载,我们一般不会写成顺序不同的方式
    }

    public static double getSum(int a, int b) {
        return a + b;
    }

   public static double getSum(int a, double b) {
        return a + b;
    }

    public static double getSum(double a, int b) {
        return a + b;
    }


    public static double getSum(double a, double b) {
        return a + b;
    }


}
