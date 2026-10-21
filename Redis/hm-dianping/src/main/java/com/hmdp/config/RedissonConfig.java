package com.hmdp.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient(){
        // 配置
        Config config = new Config();
        // useSingleServer：单节点模式
        // setAddress：设置地址
        // setPassword：设置密码
        // setDatabase：设置数据库
        // setTimeout：设置超时时间
        // setConnectionMinimumIdleSize：设置连接池最小空闲连接数
        // setConnectionPoolSize：设置连接池最大连接数
        // setConnectionTimeout：设置连接超时时间
        // setIdleTimeout：设置连接空闲时间
        // setPingTimeout：设置心跳超时时间
        config.useSingleServer().setAddress("redis://192.168.150.101:6379").setPassword("123321");
        // 创建RedissonClient对象
        return Redisson.create(config);
    }
}
