package com.itheima.enumtest;

public enum OrderState {
    // 在枚举类的第一行，把所有的对象都罗列出来了
    PAYMENT_PENDING("待支付"),
    PROCESSING("处理中"),
    SHIPPED("已发货"),
    OUT_FOR_DELIVERY("配送中"),
    DELIVERED("已送达"),
    CANCELLED("已取消"); // 最后一个对象后面必须加分号，一个分号代表一行代码


    private String name;


    // 枚举类的构造方法默认使用private修饰，就算不写，虚拟机也会加上private
     OrderState(String name) {
        System.out.println("看看我执行了吗？" + name);
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
