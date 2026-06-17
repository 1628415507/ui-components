---
name: langchain-syntax-curator
description: 从 LangChain 相关的 Python 文件中和图片中梳理出常用的组件用法和链式逻辑，并更新到 docs/LangChain.md。当用户提到“梳理 LangChain 语法”、“更新 LangChain 文档”或分析 LangChain 代码模式时使用。
---

# LangChain 语法梳理技能 (LangChain Syntax Curator)

## 核心任务
从 LangChain 源码或实战代码中提取核心组件 (Models, Prompts, Parsers, LCEL, Chains) 的用法，并同步到 `docs/LangChain.md`。

## 执行流程
1. **深度分析**：
    - 识别模型接口、Prompt 模板、OutputParser 及 LCEL 管道逻辑。
    - 提取 Runnable 接口调用（`invoke`, `stream`, `batch`）及多轮对话管理。
2. **分类同步**：
    - 将提取的知识点按模块（Models, Prompts, Chains 等）更新至 `docs/LangChain.md`。
    - 重点记录代码解决的特定问题及实现逻辑。

## 梳理规范
- **精准去重**：梳理描述应精准简洁，严禁出现意思相近的语句重复出现。
- **范围限制**：仅针对用户指定的文件进行梳理，严禁引入无关代码。
- **全量补全**：若示例中出现文档未涵盖的新方法（如 `to_string()`, `save()`），必须同步补充其功能与用法。
- **逻辑导向**：不仅记录“是什么”，更要通过 LCEL 序列展示“如何组合”以及“为什么这样设计”。
- **模块化组织**：严格遵循 LangChain 官方核心组件结构进行文档更新。

## 推荐章节
- Models (ChatModels, Embeddings)
- Prompts (Templates, Messages)
- Output Parsers
- LCEL (Chains & Composition)
- Memory & Context
- Agents & Tools
