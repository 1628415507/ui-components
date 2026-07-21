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
		<!-- web起步依赖 -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-webmvc-test</artifactId>
			<!-- 仅在测试范围 -->
			<scope>test</scope>
		</dependency>
	</dependencies>
```

---

# 二、 核心注解 <a id="core-annotations"></a>

| 注解名称 | 作用 | 应用场景 | 示例 |
| :--- | :--- | :--- | :--- |
| `@SpringBootApplication` | 标识该类为 Spring Boot 的启动类，集成了自动配置、组件扫描和配置类声明。 | Spring Boot 项目**主入口**类。 | `com.itheima.springbootquickstart.SpringbootQuickstartApplication` |
| `@RestController` | 标识该类是一个 RESTful 风格的控制器，相当于 `@Controller` 与 `@ResponseBody` 的组合。返回值会直接作为 HTTP 响应体返回。 | Web 接口开发控制器类。 | `com.itheima.springbootquickstart.controller.HelloController` |
| `@RequestMapping` | 用于映射 Web 请求的 URL 路径到具体的方法上。 | 控制器内定义 API 路由。 | `@RequestMapping("/hello")` |
| [`@Value`](#541-value-单项注入) | 逐个读取并注入配置文件中的单个属性。 | 读取散落、单独的非结构化配置。 | `@Value("${email.user}")` |
| [`@ConfigurationProperties`](#542-configurationproperties-批量绑定) | 批量将指定前缀的配置项绑定到 JavaBean 实体的成员变量上。 | 批量、有结构的一组属性（如邮件、第三方账号配置等）绑定。 | `@ConfigurationProperties(prefix = "email")` |
| [`@Service`](#custom-bean-annotations) | 标识该类是 Spring 中的 Service **业务逻辑层组件**，并自动注册到 Spring 容器中。 | 业务逻辑实现类。 | `com.itheima.springbootmybatis.service.impl.UserServiceImpl` |
| [`@Autowired`](#di-annotations) | 声明自动注入依赖。Spring 会自动从 IoC 容器中按类型匹配并装配 Bean。 | 依赖注入组件（控制反转/依赖注入）。 | 成员变量或 setter 方法上 |
| [`@Mapper`](#mapper-declaration) | MyBatis 框架注解。标识该接口为**数据访问层**（Mapper）组件，运行时自动生成动态代理实现类并注册到 Spring 容器。 | MyBatis 数据持久层接口。 | `com.itheima.springbootmybatis.mapper.UserMapper` |
| [`@Component`](#custom-bean-annotations) | 声明 Bean 的基础注解。若某个类不属于控制层、服务层或持久层，使用此注解注册到 Spring 容器中。 | 通用组件、工具类等。 | 自定义公共工具类组件 |
| [`@Controller`](#custom-bean-annotations) | `@Component` 的衍生注解，标注在控制层类上，声明其为 Spring MVC 控制器。 | Spring MVC Web 控制器。 | `com.itheima.springbootquickstart.controller.HelloController` |
| [`@Bean`](#third-party-bean-annotations) | 标注在配置类的方法上，将该方法的返回值作为 Bean 注册到 Spring 容器中。主要用于整合并管理第三方类库提供的类。 | 注册第三方的非自定义类对象。 | 注入外部工具库、连接池等组件 |
| [`@Import`](#third-party-bean-annotations) | 用于在配置类上快速导入外部类. 可以导入普通的 Bean、配置类（`@Configuration`）或 `ImportSelector` 接口实现类。 | 模块化集成、快速引入第三方依赖包中的配置组件。 | `@Import({CommonConfig.class})` |
| [`@Repository`](#custom-bean-annotations) | `@Component` 的衍生注解，标注在数据访问层类上。由于常与 MyBatis 整合并使用 `@Mapper`，因此在现代 Spring Boot 开发中相对少用。 | 数据访问层/持久层实现组件。 | DAO 实现类 |
---

# 三、 启动入口

Spring Boot 项目的主入口通常包含一个带有 `@SpringBootApplication` 注解的类，并在 `main` 方法中调用 `SpringApplication.run()` 来引导项目。

```java
//启动类（带有 @SpringBootApplication 注解）
@SpringBootApplication
public class SpringbootQuickstartApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootQuickstartApplication.class, args);
	}
}
```

# 四、 Web 控制器开发

在 Spring Boot 中，编写一个 REST 控制器极其简便，只需在类上声明 `@RestController`，并在方法上声明 `@RequestMapping` 等路由注解。

## 4.1 编写 Controller 示例
- 当应用启动后，可以通过访问 `http://localhost:8080/hello` 来触发该方法，获取返回值。
- 若修改了默认的内嵌服务器端口或应用上下文路径，具体的访问 URL 规则可参考 [5.1 通用配置属性](#51-通用配置属性)。

```java 6:13:SpringBoot/springboot-quickstart/src/main/java/com/itheima/springbootquickstart/controller/HelloController.java
@RestController // 返回值会直接作为 HTTP 响应体返回
public class HelloController {

    @RequestMapping("/hello") // 启动后可以通过 http://localhost:8080/hello 访问
    public String hello(){
        return "hello world~";
    }
}
```

---

# 五、 配置文件

Spring Boot 提供了多种属性配置方式，最常用的两种格式是 `properties` 配置文件与 `yaml` 配置文件。它们通常存放于项目的 `src/main/resources` 目录下，用于定制服务的运行行为。

## 5.1 通用配置属性

无论是 `properties` 还是 `yaml` 格式，Spring Boot 底层的属性配置是完全相通的。以下是项目开发中核心且常用的基础配置项：

| 配置项 | 作用 | 配置值示例 (properties) | 配置值示例 (yaml) | 备注说明 |
| :--- | :--- | :--- | :--- | :--- |
| `spring.application.name` | 指定当前微服务的应用名称 | `springboot-quickstart` | `springboot-quickstart` | 用于服务注册、日志追踪及区分。 |
| `server.port` | 指定内嵌 Web 服务器（如 Tomcat）的监听端口号 | `9090` | `9191` | 默认端口为 `8080`。 |
| `server.servlet.context-path` | 指定 Web 应用的上下文访问路径（根路径） | `/start` | `/start2` | 配置后，所有接口路径前均需追加该路径作为前缀。 |

## 5.2 properties 配置文件

`properties` 配置文件通过经典的键值对 `key=value` 的形式进行配置，每一行都是一个独立的配置项，不具有层级结构。

在项目 `SpringBoot/springboot-quickstart` 中，其内置的配置文件格式与内容如下：

```properties 1:4:SpringBoot/springboot-quickstart/src/main/resources/application.properties
spring.application.name=springboot-quickstart
# server.port=9090
# server.servlet.context-path="start"
```


## 5.3 yaml 配置文件（常用）

`yaml`（YAML Ain't Markup Language，又称 `yml`）是一种直观的、以数据为中心的配置文件格式，其结构非常清晰，特别适合表示复杂的层级配置。

### 5.3.1 YAML 核心语法
1. **大小写敏感**：属性名称和属性值对大小写敏感。
2. **层级缩进**：使用**空格**缩进表示层级关系。**严禁使用 Tab 键**进行缩进。
3. **冒号后空格**：属性名与属性值之间通过 `冒号 + 空格` (`: `) 隔开，该空格不可省略。
4. **单行注释**：使用 `#` 标识。

### 5.3.2 示例配置
根据上述语法规则，通用属性在 `application.yml` 或 `application.yaml` 配置文件中的书写格式如下：

```yaml
server:
  port: 9191
  servlet:
    context-path: /start2
```

## 5.4 配置信息的获取与注入

在 Spring Boot 中，将配置文件（如 `application.yml`）中的自定义配置读取并注入到 Java Bean 中，主要有 `@Value` 和 `@ConfigurationProperties` 两种核心方式。

### 5.4.1 @Value 单项注入

`@Value` 注解适用于逐个注入配置文件中零散、单独的属性，通过 `${键名}` 的表达式从 Environment 中解析出对应的属性值并赋给目标字段。

#### 语法规则
1. **注入语法**：使用 `@Value("${键名}")` 标注在类成员变量上。
2. **应用场景**：配置项较少、结构松散，不属于某一个完整的配置实体。

#### 示例配置与代码
在 `application.yml` 中定义以下单项配置：

```yaml
# 示例：单个变量配置
my-app:
  owner: hzf
```

在 Java Bean 中注入：

```java
@Component
public class AppConfig {

    @Value("${my-app.owner}")
    private String owner;
}
```

---

### 5.4.2 @ConfigurationProperties 批量绑定

当配置项属于一组具有**相同前缀、结构复杂**的业务实体（例如邮件服务配置、阿里云 OSS 存储配置等）时，使用 `@ConfigurationProperties` 能够极其高效地进行对象级绑定。

#### 语法规则
1. **前缀绑定**：通过 `@ConfigurationProperties(prefix = "前缀")` 指定配置前缀。
2. **容器管理**：修饰的配置类必须是 Spring 容器管理的 Bean（例如使用 `@Component` 标注）。
3. **命名一致性**：Java Bean 的成员变量名（通常符合 camelCase 驼峰命名法）必须与配置文件中的属性键名保持一致。

#### 示例配置
在 `application.yml` 中定义邮件服务的批量配置：

```yaml
email:
  user: 593140521@qq.com
  code: jfejwezhcrzcbbbb
  host: smtp.qq.com
  auth: true
```

#### 配置实体类定义
将上述配置绑定到 `EmailProperties` 实体类：

```java
@Component
@ConfigurationProperties(prefix = "email")
public class EmailProperties {

    // 发件人邮箱
    public String user;

    // 授权码（邮件客户端使用）
    public String code;

    // 发件人邮箱对应的应用服务，如果是163邮箱: smtp.163.com
    public String host;

    // 发送邮件前，是否需要对发件人的信息做验证
    private boolean auth;
}
```

---

### 5.4.3 @Value 与 @ConfigurationProperties 的对比

为了更加直观地选择合适的获取方式，下表总结了两者在应用场景、松散绑定、SpEL、JSR-303 等级维度上的区别：

| 特性 / 维度 | `@Value` | `@ConfigurationProperties` |
| :--- | :--- | :--- |
| **功能定义** | 逐个注入单个属性（单项获取） | 批量属性与 JavaBean 绑定（对象化获取） |
| **前缀支持** | 不支持指定统一前缀 | 支持统一前缀过滤（如 `prefix = "email"`） |
| **松散绑定 (Relaxed Binding)** | 不支持（键名必须绝对精确一致） | **支持**（如配置文件中的 `user` 或松散格式可自动映射到驼峰命名变量上） |
| **JSR-303 数据校验** | 不支持 | **支持**（可配合 `@Validated` 对绑定数据进行规则校验） |
| **最佳实践** | 适合少量、临时、各不相干的散落配置项 | 适合面向业务、高度结构化的批量核心模块配置（推荐） |

---

