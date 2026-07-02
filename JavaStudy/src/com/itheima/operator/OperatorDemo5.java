package com.itheima.operator;

public class OperatorDemo5 {
    public static void main(String[] args) {
           /*  类型转换练习二：
        检查下面代码，程序运行的时候是否会报错，如果会，请说明错误原因*/
        short s1 = 100;
        short s2 = 200;
        // int + int = int
        // 修改方案1：有可能会导致精度丢失
        //      300 ：二进制 00000000 00000000 00000001 00101100
        //      强制转换byte: 00101100(44)
        byte result1 = (byte) (s1 + s2); // 错误原因：s1 + s2 的结果是int类型，需要强制转换为byte类型
        System.out.println(result1);


        // 修改方案2：直接赋值给一个int类型的变量
        int result2 = s1 + s2;
        System.out.println(result2); // 300
    }
}
