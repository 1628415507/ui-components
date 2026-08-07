# Nacos 配置中心

Nacos（Dynamic Naming and Configuration Service）是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。在微服务架构中，它主要用于：

1. **配置管理**：动态管理所有微服务的配置，支持配置热更新（如数据库连接池、业务开关等）。
2. **服务发现与治理**：管理服务实例的注册与发现，支持健康检查、权重配置及路由转发。

![alt text](image-1.png)

## 核心注解汇总

| 名称 | 作用 | 示例 |
| :--- | :--- | :--- |
| `@EnableNacosConfig` | 开启 Nacos 配置管理功能，支持通过 `globalProperties` 配置全局连接属性。 | `[基础配置示例](#基础配置示例)` |
| `@NacosPropertySource` | 指定加载的配置源信息，包含 Data ID 映射及动态刷新行为。 | `@NacosPropertySource(dataId = "user.properties", autoRefreshed = true)` |
| `@NacosProperties` | 基础属性配置项，用于定义 `serverAddr`、`namespace` 等连接参数。 | `@NacosProperties(serverAddr = "127.0.0.1:8848")` |

## 配置接入实战

### 依赖包路径

在基于 Spring 的项目中，通常需要引入 Nacos Spring SDK，涉及的核心注解位于以下路径：

* `com.alibaba.nacos.api.annotation.NacosProperties`
* `com.alibaba.nacos.spring.context.annotation.config.EnableNacosConfig`
* `com.alibaba.nacos.spring.context.annotation.config.NacosPropertySource`

### 基础配置示例

通过 Java 配置类实现 Nacos 的无缝接入：

```java
@Configuration
@ComponentScan("com.zhouyu")
@EnableNacosConfig(globalProperties = @NacosProperties(serverAddr = "127.0.0.1:8848"))
@NacosPropertySource(dataId = "user.properties", autoRefreshed = true)
public class MyConfig {
}
```

### 关键配置项详解

* **serverAddr**：Nacos 服务端连接地址。
* **dataId**：配置集 ID，用于定位具体的配置文件（如 `user.properties`）。
* **autoRefreshed**：动态刷新开关。设置为 `true` 后，服务端配置变更将实时同步至 Spring 容器，无需重启应用。

## 控制台访问

* **本地访问地址**：[http://127.0.0.1:8848/nacos](http://127.0.0.1:8848/nacos)
* **默认账号密码**：`nacos`/`nacos`

## 配置管理高级特性

### 配置隔离结构

Nacos 通过三层结构实现逻辑隔离，满足不同环境（开发/测试/生产）和应用的需求：

* **Namespace (命名空间)**：最高层级隔离，通常用于区分不同环境（如 `dev`, `test`, `prod`）。可通过 `spring.cloud.nacos.config.namespace` 配置。
* **Group (分组)**：Data ID 之上的次级隔离，默认为 `DEFAULT_GROUP`。
* **Data ID (配置集 ID)**：具体的配置文件名。

### 配置拉取优先级

当应用启动时，会按以下顺序拉取配置，**优先级依次升高**（后者覆盖前者）：

1. 拉取 `dataId` 为 `user` 的配置（不含扩展名）。
2. 拉取 `dataId` 为 `user.properties` 的配置。
3. 拉取 `dataId` 为 `user-${spring.profiles.active}.properties` 的配置。
