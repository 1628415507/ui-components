---
name: java-knowledge-curator
description: 从 Java 源码中梳理出核心知识点（关键字、语法、设计模式、常用 API 等），并更新到 文档/JAVA.md。当用户提到“梳理 Java 知识点”、“更新 Java 文档”或分析 Java 代码逻辑时使用。
---

# Java 知识点梳理技能 (Java Knowledge Curator)

## 前置依赖

执行前须先阅读并遵循 [knowledge-curator-base](../knowledge-curator-base/SKILL.md) 中的通用梳理规范。

## 核心任务

从 Java 源码中提取核心知识点（如关键字用法、面向对象特性、集合框架、多线程、JVM 配置等），并同步到 `文档/JAVA.md`。

## 执行流程

1. **深度分析**：
    - 识别 Java 关键字（如 `package`, `public`, `static`, `final` 等）及其应用场景。
    - 提取类结构、继承关系、接口实现及常用设计模式。
    - 分析常用 API（如 `java.util`, `java.io`, `java.nio` 等）的调用逻辑。
2. **分类同步**：
    - 将提取的知识点按模块（环境配置、关键字、面向对象、集合等）更新至 `文档/JAVA.md`。
    - 重点记录代码解决的特定问题及实现逻辑。

## 领域补充规范

- **范围限制**：只能从用户给定的 Java 文件中梳理知识点，严禁梳理关联的其他本地文件内容。
- **示例来源**：代码块中的示例**优先**取自项目内的 Java 实战文件。
- **属性表格化示例列**：关键字、方法参数等用「关键字 | 作用 | 示例」等形式。
