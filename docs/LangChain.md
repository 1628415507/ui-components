# LangChain 常用语法梳理

- 这份文档基于 当前项目目录 下的实战代码，为你梳理了 LangChain 的核心组件用法。
- 使用前需先配置环境变量： `OPENAI_API_KEY`和`DASHSCOPE_API_KEY`（电脑需重启）
---

## 1. 模型接入 (Models)

### 1.1 大语言模型 (LLM)
适用于简单的文本补全。

- **通义千问 (Tongyi)**：
LangChain 通过 `langchain_community` 提供了对通义千问的支持。
  ```python
  from langchain_community.llms.tongyi import Tongyi
  model = Tongyi(model="qwen-max")
  ```
- **Ollama (本地)**：
  ```python
  from langchain_ollama import OllamaLLM
  model = OllamaLLM(model="qwen3:4b")
  ```
- **方法**：使用 `invoke` 或 `stream`。

### 1.2 聊天模型 (Chat Model)
适用于**多轮对话**（支持 System/Human/AI 消息序列）。

- **通义千问 (Tongyi)**：
  ```python
  from langchain_community.chat_models.tongyi import ChatTongyi
  model = ChatTongyi(model="qwen3-max")
  ```
- **Ollama (本地)**：
  ```python
  from langchain_ollama import ChatOllama
  model = ChatOllama(model="qwen3:4b")
  ```
- **方法**：使用 `invoke` 或 `stream`。

### 1.3 嵌入模型 (Embeddings)
用于**将文本转化为向量**，常用于**向量搜索**。

- **阿里云 (DashScope)**：
  ```python
  from langchain_community.embeddings import DashScopeEmbeddings
  # 默认模型为 text-embeddings-v1
  model = DashScopeEmbeddings() 
  ```
- **Ollama (本地)**：
  ```python
  from langchain_ollama import OllamaEmbeddings
  model = OllamaEmbeddings(model="qwen3-embedding:4b")
  ```

- **方法** 
  嵌入模型**不使用** `invoke` 或 `stream`。
  - **embed_query(text)**：将**单个**查询字符串转化为向量。
  - **embed_documents(list)**：将一组文档字符串**批量**转化为向量列表。

```python
vector = model.embed_query("我喜欢你")
vectors = model.embed_documents(["我喜欢你", "我稀饭你"])
```

---

## 2. 消息类型 (Messages)
在聊天模型中，对话由不同类型的消息组成。

### 2.1 标准类形式
需要从 `langchain_core.messages` 导入。
- **SystemMessage**：系统指令，设定 AI 的角色或行为。
- **HumanMessage**：用户发送的消息。
- **AIMessage**：AI 的回复消息。

```python
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

messages = [
    SystemMessage(content="你是一个诗人。"),
    HumanMessage(content="写首诗吧"),
    AIMessage(content="..."),
    HumanMessage(content="再来一首")
]
```

### 2.2 简写形式 (元组)
- **推荐用法**：使用 `(角色, 内容)` 的元组形式，优点是不需要导入消息类，且**支持变量注入**。
- 角色关键字：`"system"`, `"human"`, `"ai"`。

```python
messages = [
    ("system", "你是一个诗人。"),
    ("human", "写一首唐诗。"),
    ("ai", "锄禾日当午..."),
    ("human", "再写一首。")
]
```

---

## 3. 模型调用方式 (Invocation)

### 3.1 同步调用 (invoke)
**一次性**获取完整结果。
```python
res = model.invoke(input="你是谁？")
print(res)
```

### 3.2 流式输出 (stream)
**实时获取**模型生成的文本块。

- **LLM 模式**：直接迭代 chunk。
  ```python
  res = model.stream(input="你是谁？")
  for chunk in res:
      print(chunk, end="", flush=True)
  ```
- **Chat 模式**：需要通过 `.content` 获取文本内容。
  ```python
  res = model.stream(input=messages)
  for chunk in res:
      print(chunk.content, end="", flush=True)
  ```

---

## 4. 环境配置
### 4.1 方式1 在系统环境变量中配置

### 4.2 方式2 env文件配置
通常使用 `.env` 文件管理 API Key，并通过 `dotenv` 加载。
```python
from dotenv import load_dotenv
load_dotenv() # 自动读取当前目录下的 .env 文件
```

---

## 5. 提示词模板 (Prompts)

在 LangChain 中，将变量注入提示词并调用模型主要有两种常见模式。

### 5.1 定义提示词模板 (PromptTemplate)
首先，我们需要定义一个包含变量（用 `{}` 包裹）的模板。

```python
from langchain_core.prompts import PromptTemplate

# 定义模板：支持 lastname 和 gender 两个变量
prompt_template = PromptTemplate.from_template("我的邻居姓{lastname}, 刚生了{gender}")
```

### 5.2 方式 1：手动格式化 (Manual Format)
**流程**：手动调用 `.format()` 生成最终字符串，再将其传给模型。

- **代码示例**：
  ```python
  # 1. 格式化为最终字符串 (注入变量)
  prompt_text = prompt_template.format(lastname="张", gender="女儿")
  
  # 2. 将字符串直接传给模型 invoke
  res = model.invoke(input=prompt_text)
  ```
- **特点**：逻辑解耦，你可以先打印 `prompt_text` 检查内容是否正确再进行模型调用。

### 5.3 方式 2：构建 LCEL 执行链 (Chain)
- LCEL (LangChain Expression Language) 是 LangChain 推荐的构建复杂链条的方式。
- **流程**：使用 `|` 管道操作符将模板和模型物理“连接”在一起，形成一个整体。
- A|B : **上一个组件A的输出**作为**下一个组件B的输入**
- **代码示例**：
  ```python
  # 1. 定义执行链 (模板 | 模型)
  chain = prompt_template | model # 链：上一个组件（prompt_template）的输出作为下一个组件（model）的输入
  
  # 2. 调用链：直接传入变量字典 (自动完成注入与调用)
  # 注意：此时 invoke 的输入是字典，而非字符串！
  res = chain.invoke(input={"lastname": "张", "gender": "女儿"})
  ```

### 5.4 少样本提示词模板 (FewShotPromptTemplate)
适用于通过**提供少量示例**来引导模型生成特定格式或逻辑的回复。

- **核心组件**：
  - `example_prompt`: 单个示例的模板。
  - `examples`: 示例数据列表（List of Dict）。
  - `prefix`: 示例前的引导语。
  - `suffix`: 示例后的后缀，通常包含最终要注入的变量。
  - `input_variables`: 声明在前缀或后缀中需要注入的变量名。

- **代码示例**：
  ```python
  from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
  
  # 1. 定义单个示例的模板
  example_template = PromptTemplate.from_template("单词：{word}, 反义词：{antonym}")
  
  # 2. 准备示例数据
  examples_data = [
      {"word": "大", "antonym": "小"},
      {"word": "上", "antonym": "下"},
  ]
  
  # 3. 构建 FewShotPromptTemplate
  few_shot_template = FewShotPromptTemplate(
      example_prompt=example_template,
      examples=examples_data,
      prefix="告知我单词的反义词，我提供如下的示例：",
      suffix="基于前面的示例告知我，{input_word}的反义词是？",
      input_variables=['input_word']
  )
  
  # 4. 生成提示词并调用
  prompt_text = few_shot_template.invoke(input={"input_word": "左"}).to_string()
  res = model.invoke(input=prompt_text)
  ```

### 5.5 提示词值转换 (PromptValue Methods)
当对提示词模板调用 `.invoke()` 时，返回的不是单纯的字符串，而是一个 `PromptValue` 对象（如 `StringPromptValue`）。为了将其传递给需要字符串输入的组件（如某些 LLM 或打印调试），可以使用以下方法：

- **to_string()**：
  - **功能**：将提示词对象转换为纯文本字符串。
  - **使用场景**：当你需要查看生成的最终提示词内容，或者需要手动将提示词传给 `model.invoke(input=prompt_text)` 时使用。
  - **示例**：
    ```python
    # 转换为字符串
    text = prompt_template.invoke({"var": "value"}).to_string()
    print(text)
    ```
- **to_messages()**：
  - **功能**：将提示词对象转换为消息列表（List of BaseMessage）。
  - **使用场景**：当使用 `ChatPromptTemplate` 且需要将结果传给聊天模型（ChatModel）时使用。

---

## 6. 核心对比：为什么推荐方式 2？

| 维度 | 方式 1 (Manual) | 方式 2 (LCEL Chain) |
| :--- | :--- | :--- |
| **操作符** | 使用 `.format()` 方法 | 使用 `|` 管道操作符 |
| **invoke 输入** | 必须传入**字符串** (String) | 必须传入**变量字典** (Dict) |
| **代码量** | 较多 (需手动管理中间变量) | 极简 (一行构建链) |
| **可扩展性** | 难。若增加 Parser 需手动嵌套 | 易。可继续拼接 `\| parser` |
| **推荐场景** | 仅用于调试或简单的提示词生成 | **生产环境、复杂逻辑链条** |
