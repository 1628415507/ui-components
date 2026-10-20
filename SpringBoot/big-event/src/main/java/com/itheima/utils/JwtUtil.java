package com.itheima.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;
import java.util.Map;

public class JwtUtil {
    // JWT（JSON Web Token）: 是一种把「谁登录了、有哪些声明信息」打成 **一串可校验的字符串** 的开放标准，
    // 常在前后端分离里当 登录凭证 用
    private static final String KEY = "itheima";
	
	//接收业务数据,生成token并返回
    // claims: 声明信息，可以包含用户名、角色、权限等
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims) // 设置声明信息
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 )) // 设置过期时间
                .sign(Algorithm.HMAC256(KEY)); // 生成token
    }

	//接收token,验证token,并返回业务数据
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(KEY))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }

}
