package com.itheima.oopextendstest11;

public class Test {
    public static void main(String[] args) {
        /*
            本科学生：
                属性：姓名、年龄、年级
                行为：吃饭、睡觉、学习（攻读学士学位）

            专业课老师：
                属性：姓名、年龄、学科
                行为：吃饭、睡觉、教书（教专业课知识）

            硕士研究生：
                属性：姓名、年龄、年级
                行为：吃饭、睡觉、学习（攻读硕士学位）

            通识课老师：
                属性：姓名、年龄
                行为：吃饭、睡觉、教书（教通识课知识）

            过了一段时间，硕士研究生住宿条件升级，在豪华版学生公寓睡觉
        */

        // 创建对象
        BachelorStudent bs = new BachelorStudent("小诗诗", 18, "大一新生");
        System.out.println(bs.getName() + ", " + bs.getAge() + ", " + bs.getGrade());
        bs.eat();
        bs.sleep();
        bs.study();
    }
}
