---
name: langchain-syntax-curator
description: 从 LangChain 相关的 Python 文件中梳理出常用的组件用法和链式逻辑，并更新到 docs/LangChain.md。当用户提到“梳理 LangChain 语法”、“更新 LangChain 文档”或分析 LangChain 代码模式时使用。
---

# LangChain 语法梳理技能 (LangChain Syntax Curator)

## 核心任务
从 LangChain 源码或实战代码中提取核心组件 (Models, Prompts, Parsers, LCEL, Chains) 的用法，并同步到 `docs/LangChain.md`。

## 执行流程
1. **组件识别**：
    - 识别使用的模型接口 (ChatOpenAI, Ollama, etc.)。
    - 识别 PromptTemplate 和 Message 类型。
    - 识别 OutputParser (StrOutputParser, JsonOutputParser)。
    - 识别 LCEL (LangChain Expression Language) 的 `|` 管道用法。
2. **逻辑提取**：提取 Chain 的组合方式、Runnable 接口的调用 (`invoke`, `stream`, `batch`) 以及多轮对话管理。
3. **更新文档**：
    - 读取 `docs/LangChain.md`。
    - 按 LangChain 的核心模块 (Models, Prompts, Chains, etc.) 进行分类整理。
    - 重点记录该代码解决的特定问题（例如：如何处理流式输出，如何进行结构化输出）。

## 梳理规范
- **聚焦原则**：如果用户提供了具体的文件路径，则仅针对这些文件进行语法梳理和文档更新。严禁将工作区内其他无关文件纳入梳理范围。
- **全量提取**：如果示例文件中出现了文档中尚未整理的方法（例如 `to_string()`、`save()` 等），必须将其功能介绍及详细用法同步补充到 `docs/LangChain.md` 的相关章节中。
- **模块化**：按 LangChain 官方文档的核心组件结构进行组织。
- **LCEL 重点**：详细记录 `Runnable` 序列的管道式拼接方式。
- **实战导向**：不仅记录“是什么”，还要记录“为什么这么连”。

## 推荐章节
- Models (ChatModels, Embeddings)
- Prompts (Templates, Messages)
- Output Parsers
- LCEL (Chains & Composition)
- Memory & Context
- Agents & Tools
