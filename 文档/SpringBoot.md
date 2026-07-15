# 一、 Maven 依赖管理(pom.xml)

在 Spring Boot 项目中，依赖管理通过父工程（`spring-boot-starter-parent`）和各种起步依赖（`starter`）来简化。

## 1.1 父工程 (Parent POM)
父工程用于统一管理所有起步依赖的版本，避免版本冲突。

```xml 5:11:SpringBoot/springboot-quickstart/pom.xml
    <!-- boot工程的父工程。用于管理起步依赖的版本-->
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>4.1.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
```

## 1.2 起步依赖 (Starters)
通过引入一个 Starter，即可自动引入该功能所需的所有相关依赖。

| 依赖名称 | 作用 | 对应配置项 / 备注 |
| :--- | :--- | :--- |
| `spring-boot-starter-webmvc` | 引入 Web 开发所需的 Spring MVC 核心组件及 Tomcat 容器。 | Web 核心，集成了 MVC 的基本配置。 |
| `spring-boot-starter-webmvc-test` | 引入用于 Web 应用测试的依赖。 | 仅在测试范围 (`scope: test`) 使用。 |

```xml 33:45:SpringBoot/springboot-quickstart/pom.xml
	<dependencies>
		<!-- web起步依赖		-->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
```

---

# 二、 核心注解

| 注解名称 | 作用 | 应用场景 | 示例 |
| :--- | :--- | :--- | :--- |
| `@SpringBootApplication` | 标识该类为 Spring Boot 的启动类，集成了自动配置、组件扫描和配置类声明。 | Spring Boot 项目主入口类。 | `com.itheima.springbootquickstart.SpringbootQuickstartApplication` |
| `@RestController` | 标识该类是一个 RESTful 风格的控制器，相当于 `@Controller` 与 `@ResponseBody` 的组合。返回值会直接作为 HTTP 响应体返回。 | Web 接口开发控制器类。 | `com.itheima.springbootquickstart.controller.HelloController` |
| `@RequestMapping` | 用于映射 Web 请求的 URL 路径到具体的方法上。 | 控制器内定义 API 路由。 | `@RequestMapping("/hello")` |

---

# 三、 启动入口

Spring Boot 项目的主入口通常包含一个带有 `@SpringBootApplication` 注解的类，并在 `main` 方法中调用 `SpringApplication.run()` 来引导项目。

```java 5:13:SpringBoot/springboot-quickstart/src/main/java/com/itheima/springbootquickstart/SpringbootQuickstartApplication.java
//启动类（带有 @SpringBootApplication 注解）
@SpringBootApplication
public class SpringbootQuickstartApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootQuickstartApplication.class, args);
	}

}
```

---

# 四、 Web 控制器开发

在 Spring Boot 中，编写一个 REST 控制器极其简便，只需在类上声明 `@RestController`，并在方法上声明 `@RequestMapping` 等路由注解。

## 4.1 编写 Controller 示例
当应用启动后，可以通过访问 `http://localhost:8080/hello` 来触发该方法，获取返回值。

```java 6:13:SpringBoot/springboot-quickstart/src/main/java/com/itheima/springbootquickstart/controller/HelloController.java
@RestController // 返回值会直接作为 HTTP 响应体返回
public class HelloController {
   // 启动后可以通过 http://localhost:8080/hello 访问
    @RequestMapping("/hello")
    public String hello(){
        return "hello world~";
    }
}
```
