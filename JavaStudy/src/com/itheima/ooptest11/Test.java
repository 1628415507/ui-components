package com.itheima.ooptest11;

public class Test {
    public static void main(String[] args) {
        int countA = 0;
        int countB = 0;

        for (int i = 0; i < 100; i++) {
            Role r1 = new Role("叉子", 190, 220, 83, 1012);
            Role r2 = new Role("长手", 180, 210, 80, 1223);

            while (true) {
                if (r1.damage(r2)) {
                    countA++;
                    System.out.println(r1.getName() + "获得了胜利~");
                    break;
                }
                if (r2.damage(r1)) {
                    countB++;
                    System.out.println(r2.getName() + "获得了胜利~");
                    break;
                }
            }
        }

        System.out.println(countA);
        System.out.println(countB);


    }
}
