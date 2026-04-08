# LangChain 常用语法梳理

这份文档基于 `03-LangChain` 目录下的实战代码，为你梳理了 LangChain 的核心组件用法。

---

## 1. 模型接入 (Models)

### 1.1 通义千问 (Tongyi)
LangChain 通过 `langchain_community` 提供了对通义千问的支持。

- **大语言模型 (LLM)**：适用于简单的文本补全。
  ```python
  from langchain_community.llms.tongyi import Tongyi
  model = Tongyi(model="qwen-max")
  ```
- **聊天模型 (Chat Model)**：适用于多轮对话。
  ```python
  from langchain_community.chat_models.tongyi import ChatTongyi
  model = ChatTongyi(model="qwen3-max")
  ```

### 1.2 Ollama (本地模型)
用于调用本地运行的 LLM。
```python
from langchain_ollama import OllamaLLM
model = OllamaLLM(model="qwen3:4b")
```

---

## 2. 消息类型 (Messages)
在聊天模型中，对话由不同类型的消息组成：

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

---

## 3. 模型调用方式 (Invocation)

### 3.1 同步调用 (invoke)
一次性获取完整结果。
```python
res = model.invoke(input="你是谁？")
print(res)
```

### 3.2 流式输出 (stream)
实时获取模型生成的文本块。

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
通常使用 `.env` 文件管理 API Key，并通过 `dotenv` 加载。
```python
from dotenv import load_dotenv
load_dotenv() # 自动读取当前目录下的 .env 文件
```
