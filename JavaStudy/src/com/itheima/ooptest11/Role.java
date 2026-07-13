package com.itheima.ooptest11;

import java.util.Random;

public class Role {
    private String name;
    private int minAttack;
    private int maxAttack;
    private int defense;
    private int blood;

    public Role() {
    }

    public Role(String name, int minAttack, int maxAttack, int defense, int blood) {
        this.name = name;
        this.minAttack = minAttack;
        this.maxAttack = maxAttack;
        this.defense = defense;
        this.blood = blood;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMinAttack() {
        return minAttack;
    }

    public void setMinAttack(int minAttack) {
        this.minAttack = minAttack;
    }

    public int getMaxAttack() {
        return maxAttack;
    }

    public void setMaxAttack(int maxAttack) {
        this.maxAttack = maxAttack;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
    }

    public int getBlood() {
        return blood;
    }

    public void setBlood(int blood) {
        this.blood = blood;
    }

    public int currentAttack() {
        Random r = new Random();
        int attack = r.nextInt(minAttack, maxAttack + 1);
        return attack;
    }

    // 攻击别人  damage
    public boolean damage(Role r) {
        // 造成的伤害
        int value = this.currentAttack() - r.getDefense();
        // 被攻击者剩余的血量
        int tempBlood = r.getBlood() - value;
        // 判断一下
        if (tempBlood <= 0) {
            tempBlood = 0;
            // 攻击者胜利
            return true;
        }
        // 赋值最新血量
        r.setBlood(tempBlood);

        System.out.println(this.getName() + "攻击了" + r.getName() + "，造成伤害：" + value + "点伤害，" + r.getName() + "，剩余血量：" + tempBlood);
        // 攻击者还未胜利
        return false;
    }

}
