package com.itheima.array;


import java.util.Random;

public class Test5 {
    public static void main(String[] args) {
        // 需求：获取10个1-100之间的随机数并存入到数组当中,要求保证数据是唯一的
        // 核心思路:
        //      如果存在,就不存,继续生成下一个随机数
        //      如果不存在,就存入到数组当中

        // 1.创建数组
        int[] arr = new int[10];
        // 2.生成随机数
        Random r = new Random();
        for (int i = 0; i < arr.length; ) {
            int num = r.nextInt(100) + 1;
            // 对num进行判断, 存在---不存  不存在---存入
            int count = 0;
            for (int j = 0; j < arr.length; j++) {
                if(num == arr[j]){
                    count++;
                    // 跳出内循环
                    break;
                }
            }
            // 对count进行判断
            if(count == 0){
                arr[i] = num;
                // 只有生成一个满足要求的随机数,索引才会自增
                i++;
            }
        }
        // 3.遍历
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}
