---
name: python-syntax-curator
description: 从 Python 源文件中梳理出常用的语法模式并更新到 docs/python.md。当用户要求“梳理 python 语法”、“更新 python 文档”或基于某个文件提取语法知识点时使用。
---

# Python 语法梳理技能 (Python Syntax Curator)

## 核心任务
从给定的 Python 文件中识别核心语法、常用库用法及 AI/LangChain 相关模式，并增量更新至 `docs/python.md`。

## 执行流程
1. **分析源文件**：阅读用户提供的 Python 文件，识别其中的变量定义、数据结构、控制流、模块导入、错误处理、装饰器、类、以及 LLM 调用等关键语法。
2. **知识提取**：按类别梳理这些语法，并附上简短的代码示例和中文解释。
3. **更新文档**：
    - 读取 `docs/python.md`。
    - 将新发现的语法点按现有章节合并。
    - 如果是新章节，则在文档末尾或合适位置添加。
    - 保持文档风格简洁，专注于“实战常用”。

## 语法梳理规范
- **示例优先**：每个语法点必须配合一个极简的代码块示例。
- **关联场景**：标注该语法在 AI 项目中的典型用途（例如：`f-string` 用于构造提示词，`json.dumps` 用于格式化 LLM 输出）。
- **去重**：不要重复记录文档中已有的相同知识点，除非有更深入的用法。

## 常用章节参考
- 基础数据结构 (List, Dict, Tuple, Set)
- 字符串操作 (f-string, join, replace)
- 控制流与异常处理 (Try-Except, If-Else)
- 文件与路径操作 (os, pathlib)
- 异步编程 (async/await)
- 常用库 (openai, pydantic, json)
