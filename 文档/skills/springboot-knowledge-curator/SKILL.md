---
name: springboot-knowledge-curator
description: 从 Spring Boot 源码与配置文件中梳理出核心知识点（核心注解、IoC/DI 机制、Spring MVC、配置文件管理、Maven 打包部署、组件整合等），并更新到 文档/SpringBoot.md。当用户提到“梳理 Spring Boot 知识点”、“更新 Spring Boot 文档”、项目打包部署或分析 Spring Boot 代码与配置时使用。
---

# Spring Boot 知识点梳理技能 (Spring Boot Knowledge Curator)

## 前置依赖

执行前须先阅读并遵循 [knowledge-curator-base](../knowledge-curator-base/SKILL.md) 中的通用梳理规范。

## 核心任务

从 Spring Boot 源码与配置文件中提取核心知识点（如核心注解、控制反转与依赖注入、Spring MVC 路由与参数处理、配置文件管理、第三方组件如 MyBatis-Plus 整合等），并同步到 `文档/SpringBoot.md`。

## 执行流程

1. **深度分析**：
    - 识别 Spring Boot 核心与常用注解（如 `@SpringBootApplication`, `@RestController`, `@Autowired`, `@Component`, `@Service`, `@Configuration` 等）及其应用场景。
    - 分析控制反转 (IoC) 与依赖注入 (DI) 的实现逻辑与 Bean 生命周期管理。
    - 剖析 Spring MVC 的路由映射（如 `@RequestMapping`, `@GetMapping`, `@PostMapping` 等）和请求参数处理机制（如 `@RequestParam`, `@RequestBody`, `@PathVariable`）。
    - 提炼 `application.yml` 或 `application.properties` 中的核心配置项、多环境配置（`profiles`）及自定义配置读取方式。
    - 梳理 Maven (`pom.xml`) 中各类 Starter 的依赖关系和构建生命周期。
    - 提炼 `spring-boot-maven-plugin` 打包插件配置、`mvn package` 生成可执行 Jar 的流程，以及 `java -jar` 运行方式与服务器 JDK/JRE 环境要求。
    - 归纳 Jar 部署时的外部配置覆盖手段（Jar 同级 `application.yml`、操作系统环境变量、命令行参数）及配置优先级规则，并与 `文档/SpringBoot.md` 中「5.1 通用配置属性」「12.3 部署阶段配置覆盖」交叉引用。
2. **分类同步**：
    - 将提取的知识点按模块（环境配置、核心概念与注解、Web MVC 开发、配置管理、Maven 打包与部署、数据库与 ORM 整合等）更新至 `文档/SpringBoot.md`。
    - 重点记录实际代码与配置中所体现的最佳实践、异常处理以及核心原理。

## 领域补充规范

- **模块化组织**：遵循 Spring Boot 核心技术体系结构更新文档。
- **范围限制**：只能从用户给定的 Spring Boot 文件（或 `SpringBoot/` 项目下文件）中梳理知识点。
- **示例来源**：代码/配置块中的示例**优先**取自项目内（如 `SpringBoot/springboot-quickstart/` 目录下）的实战代码和配置文件。
- **属性表格化示例列**：注解、配置项、方法参数用「注解 | 作用 | 应用场景 | 示例」等形式。
