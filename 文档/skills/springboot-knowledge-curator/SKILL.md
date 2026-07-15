---
name: springboot-knowledge-curator
description: 从 Spring Boot 源码与配置文件中梳理出核心知识点（核心注解、IoC/DI 机制、Spring MVC、配置文件管理、组件整合等），并更新到 文档/SpringBoot.md。当用户提到“梳理 Spring Boot 知识点”、“更新 Spring Boot 文档”或分析 Spring Boot 代码与配置时使用。
---

# Spring Boot 知识点梳理技能 (Spring Boot Knowledge Curator)

## 核心任务
从 Spring Boot 源码与配置文件中提取核心知识点（如核心注解、控制反转与依赖注入、Spring MVC 路由与参数处理、配置文件管理、第三方组件如 MyBatis-Plus 整合等），并同步到 `文档/SpringBoot.md`。

## 执行流程
1. **深度分析**：
    - 识别 Spring Boot 核心与常用注解（如 `@SpringBootApplication`, `@RestController`, `@Autowired`, `@Component`, `@Service`, `@Configuration` 等）及其应用场景。
    - 分析控制反转 (IoC) 与依赖注入 (DI) 的实现逻辑与 Bean 生命周期管理。
    - 剖析 Spring MVC 的路由映射（如 `@RequestMapping`, `@GetMapping`, `@PostMapping` 等）和请求参数处理机制（如 `@RequestParam`, `@RequestBody`, `@PathVariable`）。
    - 提炼 `application.yml` 或 `application.properties` 中的核心配置项、多环境配置（`profiles`）及自定义配置读取方式。
    - 梳理 Maven (`pom.xml`) 中各类 Starter 的依赖关系和构建生命周期。
2. **分类同步**：
    - 将提取的知识点按模块（环境配置、核心概念与注解、Web MVC 开发、配置管理、数据库与 ORM 整合等）更新至 `文档/SpringBoot.md`。
    - 重点记录实际代码与配置中所体现的最佳实践、异常处理以及核心原理。

## 梳理规范

### 内容与结构
- **精准去重**：表述简洁准确，禁止语义相近的句子重复出现。
- **合并梳理**：待补充内容与已有知识点属同一属性或主题时，在原条目下合并补充，禁止另起新条目；保持结构单一、信息集中。
- **模块化组织**：遵循 Spring Boot 核心技术体系结构更新文档。
- **属性表格化**：注解、配置项、方法参数优先用 Markdown 表格呈现（如「注解 | 作用 | 应用场景 | 示例」），避免多级无序列表逐条罗列。
- **通用先行**：同一主题下多个具体组件或配置共用的属性、方法、接口，须先整理为「通用」小节（置于各具体实现小节**之前**）。

### 交叉引用
文档内已有相关知识点时，**优先在正文出现处直接加链接**。
- **行内链接（优先）**：在名称首次出现处用 Markdown 链接包裹，锚点指向已有说明所在小节。
- **引用块（补充说明时）**：仅当需要附加说明性文字时使用。

### 范围与限制
- **范围限制**：只能从用户给定的 Spring Boot 文件（或 `SpringBoot/` 项目下文件）中梳理知识点，严禁自造无源码/配置依据的内容。
- **禁止修改代码**：**严禁修改任何 Spring Boot 源码与配置文件**；技能的核心任务是“提取”与“梳理”知识并更新至文档。
- **JavaDoc 规范**：
    - 在提取或生成代码示例到 `文档/SpringBoot.md` 时，**严禁**包含 `@author` 等个人信息，保持文档简洁。
    - 在其他场景（如生成新的 Java 源码文件）下，必须遵循项目规范，在所有类和方法的 JavaDoc 中包含 `@author majf`。

### 代码与配置块
- **示例来源**：代码/配置块中的示例**优先**取自项目内（如 `SpringBoot/springboot-quickstart/` 目录下）的实战代码和配置文件。
- **关键片段**：只截取与本节知识点直接相关的代码段或配置段（如 yml 局部片段），**禁止整文件搬入**。
- **保留注释**：截取片段内已有的注释（含 JavaDoc、行内注释以及 xml/yml 中的注释说明）须原样保留。
