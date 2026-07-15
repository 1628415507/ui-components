package com.itheima.springbootquickstart.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
   // 启动后可以通过 http://localhost:8080/hello 访问
    @RequestMapping("/hello")
    public String hello(){
        return "hello world~";
    }
}
