package com.itheima.finaltest;

public class Circle {
    // 属性
    private double radii; // 半径
    private final double PI = 3.14; // π

    // 构造方法

    public Circle() {
    }

    public Circle(double radii) {
        this.radii = radii;
    }

    // GET/SET
    public double getRadii() {
        return radii;
    }

    public void setRadii(double radii) {
        this.radii = radii;
    }

    public double getPI() {
        return PI;
    }

    // 行为
    // 计算圆的面积
    public double getArea() {
        return PI * radii * radii;
    }

    // 计算圆的周长
    public double getLength() {
        return PI * radii * 2;
    }

}
