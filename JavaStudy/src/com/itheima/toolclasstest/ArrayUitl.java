package com.itheima.toolclasstest;

public class ArrayUitl {
    // private修饰，私有化构造方法，目的：不让外界创建对象
    private ArrayUitl(){}


    // 定义方法（静态）：工具类里的所有方法都要写成静态的
    /*提供一个方法printArr，用于遍历数组。
    格式如下：[10, 20, 50, 34, 100]（只考虑整数数组）*/
    public static String printArr(int[] arr){
        /*System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            if(i == arr.length - 1){
                System.out.println(arr[i] + "]");
            }else{
                System.out.print(arr[i] + ", ");
            }
        }*/

        String result = "[";
        for (int i = 0; i < arr.length; i++) {
            if(i == arr.length - 1){
                result = result + arr[i] + "]";
            }else{
                result = result + arr[i] + ", ";
            }
        }
        return result;
    }


    public static double getAverage(int[] arr){
        // 求和
        int sum = 0;
        // 遍历数组
        for (int i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
        // 求平均分
        // 1 2 3 4 7
        // 17 / 5 = 3
        return sum * 1.0  / arr.length;
    }





}
