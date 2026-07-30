---
name: maven-knowledge-curator
description: 从 Maven 工程（pom.xml、标准目录结构、settings 与常用命令）中梳理出核心知识点（坐标、依赖管理、构建生命周期、插件、仓库与多模块等），并更新到 文档/Maven.md。当用户提到“梳理 Maven 知识点”、“更新 Maven 文档”、分析 pom.xml 或 Maven 项目结构时使用。
---

# Maven 知识点梳理技能 (Maven Knowledge Curator)

## 前置依赖

执行前须先阅读并遵循 [knowledge-curator-base](../knowledge-curator-base/SKILL.md) 中的通用梳理规范。

## 核心任务

从 Maven 工程配置与标准目录中提取核心知识点（如 `pom.xml` 坐标与依赖、标准目录约定、构建生命周期与插件、仓库与镜像、多模块聚合等），并同步到 `文档/Maven.md`。

## 执行流程

1. **深度分析**：
    - 识别标准目录布局：`src/main/java`（主体 Java）、`src/main/resources`（配置/静态资源/模板）、`src/test/java`（单元测试）、根目录 `pom.xml`（Maven 工程标志与配置）。
    - 提炼 `pom.xml` 核心节点：`groupId` / `artifactId` / `version`（GAV 坐标）、`packaging`、`parent`、`properties`、`dependencies`、`dependencyManagement`、`build`/`plugins`、`modules` 等。
    - 分析依赖声明：坐标、`scope`（compile / provided / runtime / test / system）、传递依赖与冲突处理（就近原则、`exclusions`、`dependencyManagement` 锁版本）。
    - 梳理构建生命周期：`clean` / `validate` / `compile` / `test` / `package` / `install` / `deploy` 等阶段与常用命令（`mvn clean package`、`mvn install` 等）。
    - 提炼常用插件（如 `maven-compiler-plugin`、`maven-surefire-plugin`、`spring-boot-maven-plugin`）及其关键配置。
    - 归纳仓库体系：本地仓库、中央仓库、私服/镜像（`settings.xml` 中的 `mirror`、`profile`、`servers`）。
    - 区分单模块与多模块（`<modules>` 聚合、`<parent>` 继承）的职责边界。
2. **分类同步**：
    - 将提取的知识点按模块（环境与安装、标准目录、pom.xml 坐标与依赖、生命周期与命令、插件、仓库与镜像、多模块等）更新至 `文档/Maven.md`。
    - 重点记录配置解决的实际问题（版本冲突、测试隔离、打包产物、仓库加速等）及对应写法。

## 领域补充规范

- **模块化组织**：遵循 Maven 知识体系（约定优于配置 → 坐标与依赖 → 生命周期 → 插件与仓库 → 多模块）。
- **与 Spring Boot 文档分工**：Spring Boot 特有的 Starter、`spring-boot-starter-parent`、可执行 Jar 部署等，以 `文档/SpringBoot.md` 为准；在 `文档/Maven.md` 中仅保留 Maven 通用原理，并用行内链接交叉引用，避免两份文档大段重复。
- **范围限制**：只能从用户给定的 Maven 相关文件（或仓库内明确指定的工程，如含 `pom.xml` 的目录）中梳理知识点。
- **示例来源**：XML/命令示例**优先**取自项目内实战文件（如 `SpringBoot/springboot-quickstart/pom.xml`、`SpringBoot/big-event/pom.xml`）。
- **结构示意**：说明标准目录时，可用简洁目录树或用户提供的结构示意图（保存至 `文档/` 后用相对路径引用），并配表格说明各目录职责；包名与 `groupId` 的对应关系须写清。
- **属性表格化示例列**：`pom.xml` 节点、依赖 `scope`、生命周期阶段、插件配置项用「节点/属性 | 作用 | 示例」等形式。

## 建议文档大纲（写入 Maven.md 时可按此扩展，勿机械空章节）

1. 环境与安装（JDK、Maven、IDE 集成、本地仓库）
2. 标准目录结构（main / test / resources / pom.xml）
3. pom.xml 核心（GAV、parent、properties、dependencies、plugins）
4. 依赖管理（scope、传递依赖、冲突、dependencyManagement）
5. 构建生命周期与常用命令
6. 常用插件
7. 仓库、镜像与 settings.xml
8. 多模块工程（可选，有源码依据时再写）
