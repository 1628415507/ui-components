package com.hmdp.utils;

import cn.hutool.core.lang.UUID;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

public class SimpleRedisLock implements ILock {

    private String name;// 锁的名称。不同业务，不同的锁名称
    private StringRedisTemplate stringRedisTemplate;// 操作redis的工具

    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    private static final String KEY_PREFIX = "lock:";
    private static final String ID_PREFIX = UUID.randomUUID().toString(true) + "-";// 锁的唯一标识。不同线程，不同的锁标识
    private static final DefaultRedisScript<Long> UNLOCK_SCRIPT; // 解锁脚本
    static {
        UNLOCK_SCRIPT = new DefaultRedisScript<>(); // 加载lua脚本
        UNLOCK_SCRIPT.setLocation(new ClassPathResource("unlock.lua")); // 设置lua脚本路径
        UNLOCK_SCRIPT.setResultType(Long.class); // 设置返回类型
    }

    @Override
    public boolean tryLock(long timeoutSec) {
        // 获取线程标识
        String threadId = ID_PREFIX + Thread.currentThread().getId();
        // 获取锁
        Boolean success = stringRedisTemplate.opsForValue()
                .setIfAbsent(KEY_PREFIX + name, threadId, timeoutSec, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success); // 判断是否获取锁成功
    }

    @Override
    public void unlock() {
        // 调用lua脚本,释放锁,一行代码即可，防止误删他人锁
        stringRedisTemplate.execute(
                UNLOCK_SCRIPT,
                Collections.singletonList(KEY_PREFIX + name),//singletonList:将一个元素转换为只包含该元素的列表
                ID_PREFIX + Thread.currentThread().getId());
    }
    /*@Override
    public void unlock() {
        // 获取线程标示
        String threadId = ID_PREFIX + Thread.currentThread().getId();
        // 获取锁中的标示
        String id = stringRedisTemplate.opsForValue().get(KEY_PREFIX + name);
        // 判断标示是否一致，是否是同一个线程
        if(threadId.equals(id)) {
            // 释放锁
            stringRedisTemplate.delete(KEY_PREFIX + name);
        }
    }*/
}
