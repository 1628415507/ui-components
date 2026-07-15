# CargoNova 后端开发学习计划（前端转后端）

本计划旨在帮助前端开发人员快速掌握 `cargonova-common` 项目所涉及的后端技术栈，最终目标是能够独立完成简单的业务开发（CRUD）。

## 1. 项目技术栈分析

`cargonova-common` 是一个基于 Spring Boot 3 的微服务基础模块，核心技术栈如下：

- **开发语言**: Java 17 (强类型、面向对象)
- **核心框架**: Spring Boot 3.x (自动配置、依赖注入)
- **微服务治理**: Spring Cloud Alibaba (Nacos 用于配置中心和服务发现)
- **持久层框架**: MyBatis-Plus (简化 SQL 操作，支持 Lambda 查询)
- **数据库**: PostgreSQL
- **API 文档**: SpringDoc OpenAPI (Swagger)
- **项目管理**: Maven (依赖管理、构建)
- **规范约束**: 严格的命名规范、Javadoc 要求、逻辑删除 (`is_deleted`) 机制。

---

## 2. 学习路径与周期（预计 4 周）

### 第一周: Java 基础与环境准备
**目标**: 熟悉 Java 语法，理解面向对象编程，配置开发环境。

- **知识点**:
  - Java 基础语法: 变量类型、控制流、异常处理。
  - **面向对象 (OOP)**: 类 (Class)、接口 (Interface)、继承 (Inheritance)、多态 (Polymorphism)。
  - **集合框架**: `List`、`Map`、`Set`（对比 JS 的 Array 和 Object）。
  - **Java 8+ 特性**: Lambda 表达式、Stream API（非常重要，用于数据处理）、Optional。
  - **Maven**: 理解 `pom.xml`，了解依赖管理和构建生命周期。
- **参考资料**:
  - [廖雪峰 Java 教程](https://www.liaoxuefeng.com/wiki/1252599548343744)
  - [Maven 简明教程](https://maven.apache.org/guides/getting-started/index.html)

### 第二周: Spring Boot 核心
**目标**: 理解 Spring 的核心机制，能够编写简单的 RESTful API。

- **知识点**:
  - **IoC 与 DI**: 理解依赖注入 (`@Autowired`) 和控制反转。
  - **常用注解**: `@Component`、`@Service`、`@Repository`、`@Controller`、`@RestController`。
  - **Spring MVC**: 路由映射 (`@RequestMapping`)，请求参数处理 (`@RequestParam`、`@RequestBody`、`@PathVariable`)。
  - **配置管理**: `application.yml` 的使用。
- **实践**:
  - 在 `cargonova-common-business` 中尝试添加一个简单的 Controller，返回 "Hello World"。

### 第三周: 数据访问 (MyBatis-Plus & PostgreSQL)
**目标**: 掌握数据库操作，理解实体映射和查询构造。

- **知识点**:
  - **MyBatis-Plus 核心**: `BaseMapper` 和 `IService` 接口的使用。
  - **查询构造器**: `QueryWrapper` 和 `LambdaQueryWrapper` (推荐使用 Lambda 方式)。
  - **实体类 (Entity)**: 注解 `@TableName`、`@TableId`、`@TableField`。
  - **分页插件**: 如何实现后端分页。
  - **PostgreSQL**: 基础 SQL 语法，了解项目中的逻辑删除 (`is_deleted = 0`) 规范。
- **实践**:
  - 参照现有代码，尝试编写一个简单的单表查询接口。

### 第四周: CargoNova 规范与业务实战 (CRUD)
**目标**: 遵循项目规范，完成一个完整的业务功能开发。

- **知识点**:
  - **命名规范**: 严禁缩写，主键 ID 必须为 String。
  - **Javadoc 规范**: 所有方法必须包含 `@author majf` 及功能描述。
  - **项目结构**: `api` (定义 DTO/Feign)，`business` (实现逻辑)，`server` (启动类)。
  - **异常处理**: 严禁 `catch` 块，使用全局拦截器。
  - **国际化 (i18n)**: 了解后端如何处理错误消息的国际化。
- **实践任务**:
  1. 数据库建表 (DDL)。
  2. 使用 `table-to-crud` 技能或手动创建 Entity, Mapper, Service, Controller。
  3. 实现 增 (Save)、删 (Delete)、改 (Update)、查 (List/Get) 功能。
  4. 通过 Swagger 界面进行接口测试。

---

## 3. 核心参考文档 (必须阅读)

在开发前，请务必阅读以下位于项目 `.cursor/rules` 和 `skills` 目录下的规范文档：

1. **核心开发协议**: `.cursor/rules/00-dev-core.mdc` (首席架构师总控准则)。
2. **后端开发规范**: `.cursor/skills/dev-core/SKILL.md` (命名、注释、性能红线)。
3. **MyBatis-Plus 规范**: `.cursor/skills/query-is-deleted-default/SKILL.md` (查询必须带 `is_deleted = 0`)。
4. **命名手册**: `.cursor/skills/dev-core/references/naming.md`。

## 4. 学习建议

1. **多看代码**: 模仿 `cargonova-common-business` 中已有的成熟模块（如 `MdCarrier` 等基础资料模块）。
2. **利用 AI 助手**: 在编写代码时，多使用 Cursor 的 `table-to-crud` 或 `design-to-code` 技能，观察生成的代码结构。
3. **先跑通再深究**: 先保证接口能跑通，再去深入理解 Spring 的底层原理。
4. **关注日志**: 后端开发中，控制台日志是排查问题的关键，习惯查看 SQL 输出。

---

**目标**: 4 周后，能够独立承担基础资料类页面的后端开发任务。