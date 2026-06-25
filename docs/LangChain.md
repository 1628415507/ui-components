# LangChain 常用语法梳理

- 这份文档基于 当前项目目录 下的实战代码，为你梳理了 LangChain 的核心组件用法。
- 使用前需先配置电脑的环境变量： `OPENAI_API_KEY`和`DASHSCOPE_API_KEY`（电脑需重启）
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

### 1.4 调用方式 (Invocation)

#### 1.4.1 同步调用 (invoke)
**一次性**获取完整结果。
```python
res = model.invoke(input="你是谁？")
print(res)
```

#### 1.4.2 流式输出 (stream)
**实时获取**模型生成的文本块，逐段流式输出。

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

## 3. 环境配置
### 3.1 方式1 在系统环境变量中配置

### 3.2 方式2 env文件配置
通常使用 `.env` 文件管理 API Key，并通过 `dotenv` 加载。
```python
from dotenv import load_dotenv
load_dotenv() # 自动读取当前目录下的 .env 文件
# 使用环境变量
import os
model = ChatTongyi(model=os.getenv("TONGYI_CHAT_MODEL_NAME"))
```

---

## 4. 提示词模板 (Prompts)

在 LangChain 中，将变量注入提示词并调用模型主要有两种常见模式。

### 4.1 定义提示词模板 (PromptTemplate)
首先，我们需要定义一个包含变量（用 `{}` 包裹）的模板。

```python
from langchain_core.prompts import PromptTemplate

# 定义模板：支持 lastname 和 gender 两个变量
prompt_template = PromptTemplate.from_template("我的邻居姓{lastname}, 刚生了{gender}")
```

#### 4.1.1 模板方法：format vs invoke

`PromptTemplate` 继承 `Runnable`，注入变量有两种常用方式：

| 方法 | 返回值 | 典型用途 |
| :--- | :--- | :--- |
| **`.format(**kwargs)`** | `str` | 手动生成最终字符串，再传给 `model.invoke(input=prompt_text)` |
| **`.invoke(input=dict)`** | `PromptValue`（如 `StringPromptValue`） | 作为 Runnable 调用；需字符串时配合 [4.1.2](#412-promptvalue-转换) 的 `.to_string()`，或接入 [§5 LCEL](#5-lcel-chains--composition) 链 |

```python
template = PromptTemplate.from_template("我的邻居是：{lastname}，最喜欢：{hobby}")

res = template.format(lastname="张大明", hobby="钓鱼")
print(res, type(res))  # str

res2 = template.invoke({"lastname": "周杰轮", "hobby": "唱歌"})
print(res2, type(res2))  # PromptValue（如 StringPromptValue）
```

#### 4.1.2 PromptValue 转换

对模板调用 `.invoke()` 后得到 `PromptValue` 对象，可进一步转换为字符串或消息列表：

- **to_string()**：
  - **功能**：将提示词对象转换为纯文本字符串。
  - **使用场景**：查看最终提示词内容，或手动将提示词传给 `model.invoke(input=prompt_text)`。
  - **示例**：
    ```python
    text = prompt_template.invoke({"var": "value"}).to_string()
    print(text)
    ```
- **to_messages()**：
  - **功能**：将提示词对象转换为消息列表（List of BaseMessage）。
  - **使用场景**：配合 [§4.4 ChatPromptTemplate](#44-聊天提示词模板-chatprompttemplate) 将结果传给聊天模型（ChatModel）时。

### 4.2 方式 1：手动格式化 (Manual Format)

**流程**：通过 `.format()` 生成最终字符串，再将其传给模型。

- **代码示例**：
  ```python
  # 1. 格式化为最终字符串 (注入变量)
  prompt_text = prompt_template.format(lastname="张", gender="女儿")
  
  # 2. 将字符串直接传给模型 invoke
  res = model.invoke(input=prompt_text)
  ```
- **特点**：逻辑解耦，你可以先打印 `prompt_text` 检查内容是否正确再进行模型调用。

> 方式 2（LCEL 执行链）见 [§5 LCEL](#5-lcel-chains--composition)。

### 4.3 少样本提示词模板 (FewShotPromptTemplate)
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

### 4.4 聊天提示词模板 (ChatPromptTemplate)

面向**聊天模型**的提示词模板，通过 `from_messages` 组装消息序列；输出为消息列表，而非 `PromptTemplate` 的纯文本字符串。

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.chat_models.tongyi import ChatTongyi

chat_prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一个边塞诗人，可以作诗。"),
        MessagesPlaceholder("history"), # 声明参数history
        ("human", "请再来一首唐诗"),
    ]
)

history_data = [
    ("human", "你来写一个唐诗"),
    ("ai", "床前明月光，疑是地上霜，举头望明月，低头思故乡"),
    ("human", "好诗再来一个"),
    ("ai", "锄禾日当午，汗滴禾下锄，谁知盘中餐，粒粒皆辛苦"),
]

# StringPromptValue    to_string()
prompt_text = chat_prompt_template.invoke({"history": history_data}).to_string()# 传入参数history

model = ChatTongyi(model="qwen-max")
res = model.invoke(prompt_text)
print(res.content, type(res))
```

- **MessagesPlaceholder**：在模板中声明占位变量（如 `"history"`），调用 `.invoke()` 时传入对应消息列表（元组或 `BaseMessage` 均可）。
- **与 PromptTemplate 的区别**：`ChatPromptTemplate` 面向 Chat Model，输出消息序列；`PromptTemplate` 输出纯文本，见 [§4.1](#41-定义提示词模板-prompttemplate)。

---

## 5. LCEL (Chains & Composition)

LCEL (LangChain Expression Language) 是 LangChain 推荐的构建复杂链条的方式，通过 `|` 管道将 Prompt、Model、Parser 等 Runnable 组件串联为可执行链。

### 5.1 管道语法 (`|`)

- **流程**：使用 `|` 管道操作符将组件连接为一个整体；`A | B` 表示 **A 的输出**作为 **B 的输入**。
- **代码示例**（以提示词模板 + 模型为例）：
  ```python
  # 1. 定义执行链 (模板 | 模型)
  chain = prompt_template | model
  
  # 2. 调用链：直接传入变量字典 (自动完成注入与调用)
  # 注意：此时 invoke 的输入是字典，而非字符串！
  res = chain.invoke(input={"lastname": "张", "gender": "女儿"})
  ```

### 5.2 Manual vs LCEL 对比

| 维度 | 方式 1 (Manual) | 方式 2 (LCEL Chain) |
| :--- | :--- | :--- |
| **操作符** | 使用 `.format()` 方法 | 使用 `|` 管道操作符 |
| **invoke 输入** | 必须传入**字符串** (String) | 必须传入**变量字典** (Dict) |
| **代码量** | 较多 (需手动管理中间变量) | 极简 (一行构建链) |
| **可扩展性** | 难。若增加 Parser 需手动嵌套 | 易。可继续拼接 `\| parser` |
| **推荐场景** | 仅用于调试或简单的提示词生成 | **生产环境、复杂逻辑链条** |

### 5.3 链式逻辑与兼容性 (LCEL Compatibility)

在构建 LCEL 链时，必须确保前后组件的**输入和输出类型兼容**。

| 组件 | 输入要求 | 输出类型 |
| :--- | :--- | :--- |
| **提示词模板 (PromptTemplate)** | 字典 (`dict`) | `PromptValue` 对象 |
| **模型 (Model)** | `PromptValue` / 字符串 / 消息序列 (`BaseMessage`, `list`, `tuple`, `str`, `dict`) | `AIMessage` |
| **StrOutputParser** | `AIMessage` | 字符串 (`str`) |
| **JsonOutputParser** | `AIMessage` | 字典 (`dict`) |

**核心原则**：上一个组件的**输出**必须符合下一个组件的**输入要求**。

### 5.4 自定义逻辑 (RunnableLambda)

如果你需要在 LCEL 链中加入自定义的 Python 函数逻辑，可以使用 `RunnableLambda`。

- **核心用法**：
    - **手动封装**：使用 `RunnableLambda(your_function)` 将函数封装为 Runnable 对象。
    - **自动转换（推荐）**：在 `|` 管道中直接使用函数或 `lambda` 表达式，LangChain 会自动将其转换为 `RunnableLambda`。
    - **无缝集成**：封装后的函数遵循 `Runnable` 接口，支持 `invoke`, `stream`, `batch` 等方法，并能完美融入 LCEL 管道。

- **应用场景：类型适配桥梁**：
  ```python
  from langchain_core.runnables import RunnableLambda
  
  # 定义一个简单的 lambda 函数，将 AIMessage 转换为 PromptTemplate 需要的字典
  # 输入：ai_msg (AIMessage)
  # 输出：{"name": ai_msg.content} (dict)
  chain = (
      first_prompt 
      | model 
      | (lambda ai_msg: {"name": ai_msg.content}) # 自动转换为 RunnableLambda
      | second_prompt 
      | model 
      | str_parser
  )
  
  res = chain.invoke({"lastname": "曹", "gender": "女孩"})
  ```

### 5.5 多模型级联 (Multi-step Chain)

若需**将一个模型的输出作为另一个模型的输入**，通常须先通过 Output Parser 将其转换为字符串或字典（各 Parser 用法见 [§6 输出解析器](#6-输出解析器-output-parsers)）。

```python
# 1. 第一个模型生成 JSON 格式的名字
# 2. JsonOutputParser 将其转换为字典 {"name": "..."}
# 3. 第二个提示词模板接收该字典作为输入变量 {name}
# 4. 第二个模型解析名字含义
chain = first_prompt | model | json_parser | second_prompt | model | str_parser

for chunk in chain.stream({"lastname": "张", "gender": "女儿"}):
    print(chunk, end="", flush=True)
```

> 各组件输入/输出类型须匹配，详见 [5.3 链式逻辑与兼容性](#53-链式逻辑与兼容性-lcel-compatibility)。

### 5.6 [LCEL 底层原理：Python 或运算符重写](https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=32)

LCEL 的 `|` 管道语法之所以能工作，是因为 LangChain 的组件（如 PromptTemplate, Model, OutputParser）都继承自 `Runnable` 类，并重写了 Python 的魔术方法 `__or__`。

- **原理**：在 Python 中，`a | b` 实际上会触发 `a.__or__(b)`。
- **实现逻辑**：当调用 `a | b` 时，它并不立即执行，而是返回一个新的 `RunnableSequence` 对象，该对象记录了执行顺序。

**简化版实现示例**：
```python
class Test:
    def __init__(self, name):
        self.name = name

    def __or__(self, other):
        # 当执行 a | b 时，返回一个包含两者的序列对象，self 表示a（发起者），other表示b
        return MySequence(self, other)
    # 原__str__方法的输出的是内存地址，重写__str__使其输出原值
    def __str__(self): 
        return self.name

class MySequence:
    def __init__(self, *args):
        self.sequence = list(args)

    def __or__(self, other):
        # 支持链式拼接：(a | b) | c
        self.sequence.append(other) #将 | 后的数值追加到sequence数组中
        return self

    def run(self):
        # 模拟链式执行
        for item in self.sequence:
            print(f"执行组件: {item.name}")

# 实战：
a, b, c = Test('Prompt'), Test('Model'), Test('Parser')
chain = a | b | c  # 触发 __or__
chain.run()
```

---

## 6. 输出解析器 (Output Parsers)

输出解析器将模型输出的 `AIMessage` 转换为更易处理的纯文本或结构化数据。

> 链式拼接与类型兼容见 [§5 LCEL](#5-lcel-chains--composition)。

### 6.1 字符串解析器 (StrOutputParser)

输入 `AIMessage`，输出 `str`。

- **代码示例**：
  ```python
  from langchain_core.output_parsers import StrOutputParser
  
  parser = StrOutputParser()
  
  # 在链中使用
  chain = prompt | model | parser
  res = chain.invoke({"var": "value"})
  # 此时 res 是 str 类型，而不是 AIMessage
  ```

### 6.2 JsonOutputParser 解析器

输入 `AIMessage`，输出 `dict`。

- **代码示例**：
  ```python
  from langchain_core.output_parsers import JsonOutputParser
  
  json_parser = JsonOutputParser()
  
  # 在链中使用
  chain = prompt | model | json_parser
  res = chain.invoke({"lastname": "张", "gender": "女儿"})
  # 此时 res 是 dict 类型，例如: {"name": "张若曦"}
  ```

---

## 7. 会话记忆 (Memory & Context)

在多轮对话中，模型本身不会记住之前的上下文，需要借助**消息历史**机制，在每次调用时将过往对话注入提示词。实现方式分为两类：**临时记忆**（内存存储，进程结束即丢失）与**长期记忆**（文件持久化，跨重启保留）。两者共享同一套提示词模板与链式封装逻辑，仅在 `get_history` 返回的历史存储实现上不同。

### 7.1 公共知识点

以下配置对临时记忆与长期记忆**完全通用**，切换存储方式时无需修改。

#### 7.1.1 ChatPromptTemplate + MessagesPlaceholder

> `ChatPromptTemplate` 基础用法见 [§4.4 ChatPromptTemplate](#44-聊天提示词模板-chatprompttemplate)；运行时填充的历史消息类型见 [§2 消息类型](#2-消息类型-messages)。

Memory 场景下，在模板中通过 `MessagesPlaceholder` 预留历史位置，由 `RunnableWithMessageHistory` 自动读写：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "你需要根据会话历史回应用户问题。对话历史："),
    MessagesPlaceholder("chat_history"),   # 历史消息占位符，运行时由 RunnableWithMessageHistory 自动填充
    ("human", "请回答如下问题：{input}")
])
```

- **MessagesPlaceholder**：声明变量名（如 `chat_history`），运行时替换为实际消息列表。

#### 7.1.2 RunnableWithMessageHistory

`RunnableWithMessageHistory` 是 `Runnable` 接口的实现，用于给已有 LCEL 链**自动附加历史消息**能力：每次调用前读取历史、调用后将本轮问答写回存储。

```python
from langchain_core.runnables.history import RunnableWithMessageHistory

base_chain = prompt | model | str_parser

conversation_chain = RunnableWithMessageHistory(
    base_chain,
    get_history,                        # 工厂函数：根据 session_id 返回 BaseChatMessageHistory 实例
    input_messages_key="input",         # 对应模板中用户输入的占位符变量名
    history_messages_key="chat_history" # 对应 MessagesPlaceholder 的变量名
)
```

- **get_history**：工厂函数，接收 `session_id`，返回 `BaseChatMessageHistory` 的具体实现（临时记忆用 `InMemoryChatMessageHistory`，长期记忆用自定义 `FileChatMessageHistory`，见下文）。
- **input_messages_key / history_messages_key**：分别映射用户当前输入与历史消息在模板中的变量名，两者必须与 `ChatPromptTemplate` 中的占位符一致（模板定义见 [§4.4](#44-聊天提示词模板-chatprompttemplate)）。

#### 7.1.3 按 session_id 隔离会话

调用带历史的链时，需通过 `config` 传入 `session_id`，不同 id 对应独立的历史记录。

```python
session_config = {
    "configurable": {
        "session_id": "user_001"
    }
}

res = conversation_chain.invoke({"input": "小明有2个猫"}, session_config)
res = conversation_chain.invoke({"input": "小刚有1只狗"}, session_config)
res = conversation_chain.invoke({"input": "总共有几个宠物"}, session_config)  # 可引用前两轮上下文
```

#### 7.1.4 链内调试：打印 Prompt 的透传函数

若需在链执行过程中打印最终 Prompt（`.invoke()` 或 `.stream()` 时），可在链中插入自定义函数，**打印后原封不动返回输入**，避免破坏后续组件的数据流。

```python
def print_prompt(full_prompt):
    print("=" * 20, full_prompt.to_string(), "-" * 20)
    return full_prompt  # 必须原样返回，不可修改

base_chain = prompt | print_prompt | model | str_parser
```

> 透传函数会被自动包装为 `RunnableLambda`，遵循 `Runnable` 接口。（见 [5.4 自定义逻辑](#54-自定义逻辑-runnablelambda)）。
> `full_prompt` 为 `PromptValue` 对象，调用 `.to_string()` 可查看完整提示词文本。（见 [4.1.2 PromptValue 转换](#412-promptvalue-转换)）。

### 7.2 临时会话记忆 (InMemoryChatMessageHistory)

数据保存在进程内存中，**程序重启后历史丢失**，适合开发调试与单次运行。

```python
from langchain_core.chat_history import InMemoryChatMessageHistory

store = {}  # key: session_id, value: InMemoryChatMessageHistory 实例

def get_history(session_id):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]
```

- **InMemoryChatMessageHistory**：LangChain 内置实现，开箱即用，无需自定义序列化逻辑。
- **store 字典**：以 `session_id` 为 key 缓存历史对象，实现多用户会话隔离。

### 7.3 长期会话记忆 (FileChatMessageHistory)

数据序列化后写入本地 JSON 文件，**程序重启后历史保留**，适合生产环境与多用户持久会话。除 `get_history` 的实现外，其余链式配置（`base_chain`、`input_messages_key`、`history_messages_key`、`session_config`）与临时记忆完全一致。

#### 7.3.1 消息序列化工具

`BaseMessage` 对象无法直接用 `json` 写入文件，需借助官方转换函数：

| 函数 | 作用 |
| :--- | :--- |
| `message_to_dict(message)` | 单个 `BaseMessage` 实例 → 字典 |
| `messages_from_dict(data)` | `[字典, ...]` → `[BaseMessage, ...]` |

`AIMessage`、`HumanMessage`、`SystemMessage` 均为 `BaseMessage` 的子类（类型说明见 [§2.1 标准类形式](#21-标准类形式)），均可被上述函数处理。

```python
from langchain_core.messages import message_to_dict, messages_from_dict, BaseMessage
```

#### 7.3.2 自定义 FileChatMessageHistory

继承 `BaseChatMessageHistory` 后，需实现三个核心成员：

- **`add_messages(messages)`**：读取已有历史，合并新消息，序列化后写回文件。
- **`messages`（property）**：从文件读取 JSON，反序列化为消息列表；文件不存在时返回 `[]`。
- **`clear()`**：清空历史（写入空列表）。

```python
import os, json
from typing import Sequence
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import message_to_dict, messages_from_dict, BaseMessage

class FileChatMessageHistory(BaseChatMessageHistory):
    def __init__(self, session_id, storage_path):
        self.session_id = session_id
        self.storage_path = storage_path
        self.file_path = os.path.join(self.storage_path, self.session_id)
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

    def add_messages(self, messages: Sequence[BaseMessage]) -> None:
        all_messages = list(self.messages)
        all_messages.extend(messages)
        new_messages = [message_to_dict(message) for message in all_messages]
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(new_messages, f)

    @property
    def messages(self) -> list[BaseMessage]:
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                messages_data = json.load(f)
                return messages_from_dict(messages_data)
        except FileNotFoundError:
            return []

    def clear(self) -> None:
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump([], f)
```

#### 7.3.3 get_history 接入

每个 `session_id` 对应 `storage_path` 下的一个独立文件。

```python
def get_history(session_id):
    return FileChatMessageHistory(session_id, "./chat_history")
```

### 7.4 临时 vs 长期记忆对比

| 维度 | 临时记忆 (InMemoryChatMessageHistory) | 长期记忆 (FileChatMessageHistory) |
| :--- | :--- | :--- |
| **存储位置** | 内存（`dict` 缓存） | 本地文件（JSON） |
| **程序重启** | 历史丢失 | 历史保留 |
| **实现成本** | 开箱即用 | 需继承 `BaseChatMessageHistory` 自定义 |
| **适用场景** | 开发调试、单次运行 | 生产环境、多用户持久会话 |
| **切换方式** | 仅替换 `get_history` 的返回值 | 仅替换 `get_history` 的返回值 |

---

## 8. 文档加载器 (Document Loaders)

LangChain 内置多种文档加载器，用于将外部数据源（CSV、PDF、网页等）读入为统一的 `Document` 对象，供后续分块、向量化或检索使用。

### 8.1 通用特性 (BaseLoader)

所有文档加载器均继承自 `BaseLoader`，返回类型为 `Document`（含 `page_content` 与 `metadata`）。不同加载器的初始化参数各异，但加载接口统一：

| 方法 | 返回值 | 适用场景 |
| :--- | :--- | :--- |
| **`load()`** | `list[Document]`，一次性全部载入内存 | 小文件、需一次性处理全部文档 |
| **`lazy_load()`** | 生成器，逐条 `yield Document` | 大文件，避免一次性加载导致 OOM |

```python
# 批量加载
documents = loader.load()  # [Document, Document, ...]

# 懒加载（推荐用于大文件）
for document in loader.lazy_load():
    print(document)
```

#### 8.1.1 通用初始化参数

多个加载器共用的初始化参数：

- **`file_path`**：源文件路径（字符串或 `Path`）。
- **`encoding`**：文件编码；中文场景常用 `"utf-8"`，避免乱码。

### 8.2 CSVLoader

`CSVLoader` 用于加载 CSV 文件，底层通过 Python 标准库 `csv.DictReader` 解析，每行 CSV 对应一个 `Document`。

```python
from pathlib import Path
from langchain_community.document_loaders import CSVLoader

DATA_DIR = Path(__file__).resolve().parent / "data"

loader = CSVLoader(
    file_path=str(DATA_DIR / "stu.csv"),
    csv_args={
        "delimiter": ",",       # 列分隔符
        "quotechar": '"',       # 含分隔符字段的引号字符
        # 仅当 CSV 无表头时使用 fieldnames；有表头时勿设，否则首行会被当作数据
        # "fieldnames": ["name", "age", "gender", "hobby"],
    },
    encoding="utf-8"            # 文件编码
)

documents = loader.load()
```

#### 8.2.1 初始化参数

> `file_path`、`encoding` 见 [8.1.1 通用初始化参数](#811-通用初始化参数)。

- **`csv_args`**：传给 `csv.DictReader` 的字典，常用键如下：

| 键 | 作用 |
| :--- | :--- |
| **`delimiter`** | 列分隔符，默认 `","`。 |
| **`quotechar`** | 字段引号字符，默认 `'"'`。 |
| **`fieldnames`** | 列名列表；**仅用于无表头的 CSV**。若文件已有表头行，设置此项会把表头当作第一条数据。 |
| **`source_column`** | 指定 CSV 中哪一列作为 `Document.metadata["source"]`（数据来源标识），便于检索结果溯源。 |

### 8.3 JSONLoader

`JSONLoader` 用于加载 JSON 数据并封装为 `Document`。底层依赖跨平台 JSON 解析库 **`jq`**，需先安装：

```bash
pip install jq
```

信息抽取通过 **`jq_schema`**（jq 语法字符串）指定。
> `load()` / `lazy_load()` 用法同 [8.1 通用特性](#81-通用特性-baseloader)。

#### 8.3.1 jq_schema 常用语法

| 语法 | 含义 | 示例 JSON | 抽取结果 |
| :--- | :--- | :--- | :--- |
| `.` | 根节点（整个 JSON 对象） | `{"name": "周杰伦", ...}` | 整个对象 |
| `.name` | 根对象的 `name` 字段 | 同上 | `"周杰伦"` |
| `.hobby` | 数组字段 | `"hobby": ["唱", "跳", "RAP"]` | `["唱", "跳", "RAP"]` |
| `.hobby[1]` | 数组下标元素 | 同上 | `"跳"` |
| `.other.addr` | 嵌套字段 | `"other": {"addr": "深圳"}` | `"深圳"` |
| `.[]` | 数组中每个对象 | `[{...}, {...}]` | 多个独立对象 |
| `.[].name` | 数组中每个对象的 `name` | 学生数组 | 多个姓名字符串 |

#### 8.3.2 初始化参数

| 参数 | 作用 |
| :--- | :--- |
| **`file_path`** | 见 [8.1.1 通用初始化参数](#811-通用初始化参数) |
| **`jq_schema`** | jq 抽取语法（必填）。 |
| **`text_content`** | 抽取结果是否为字符串，默认 `True`。抽取对象、数组等非字符串时需设为 `False`。 |
| **`json_lines`** | 是否为 JSONLines 格式（每行一个独立 JSON 对象），默认 `False`。 |

#### 8.3.3 三种常见场景

**单个 JSON 对象**（如 `stu.json`）：用 `.` 取整对象，需 `text_content=False`。

```python
from pathlib import Path
from langchain_community.document_loaders import JSONLoader

DATA_DIR = Path(__file__).resolve().parent / "data"

loader = JSONLoader(
    file_path=str(DATA_DIR / "stu.json"),
    jq_schema=".",           # 获取 JSON 对象本身
    text_content=False,      # 抽取内容不是字符串
)
documents = loader.load()
```

**JSON 数组**（如 `stus.json`）：`.[]` 取每个元素，`.[].name` 取每个元素的 `name` 字段。

```python
loader = JSONLoader(
    file_path=str(DATA_DIR / "stus.json"),
    jq_schema=".[].name",    # 获取数组中每个对象的 name
    text_content=False,
)
documents = loader.load()
```

**JSONLines 文件**（如 `stu_json_lines.json`，每行一个 JSON 对象）：需 `json_lines=True`。

```python
loader = JSONLoader(
    file_path=str(DATA_DIR / "stu_json_lines.json"),
    jq_schema=".name",
    text_content=False,
    json_lines=True,         # 每行是独立的 JSON 对象
)
documents = loader.load()
```

### 8.4 TextLoader
`TextLoader` 用于加载**纯文本文件**（如 `.txt`），是最简单的文档加载器之一。

```python
from pathlib import Path
from langchain_community.document_loaders import TextLoader

DATA_DIR = Path(__file__).resolve().parent / "data"

loader = TextLoader(
    str(DATA_DIR / "Python基础语法.txt"),
    encoding="utf-8"            # 中文场景常用 UTF-8
)

docs = loader.load()            # [Document]，整份文件对应列表中的 1 个 Document
```

#### 8.4.1 返回值特点

- **`load()`** 返回 `list[Document]`，但**整份文本文件只对应 1 个 `Document`**（`page_content` 为全文，`metadata` 通常含 `source` 路径）。

> 若需将长文本切分为多个小块供向量化或检索，加载后配合 [§9.1 RecursiveCharacterTextSplitter](#91-recursivecharactertextsplitter) 使用。

### 8.5 PyPDFLoader

`PyPDFLoader` 用于加载 **PDF 文件**并封装为 `Document`。

> `load()` / `lazy_load()` 用法同 [8.1 通用特性](#81-通用特性-baseloader)。

```python
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

DATA_DIR = Path(__file__).resolve().parent / "data"

loader = PyPDFLoader(
    file_path=str(DATA_DIR / "pdf2.pdf"),
    mode="single",          # 见下方 mode 说明
    password="itheima"      # 加密 PDF 的打开密码
)

for doc in loader.lazy_load():
    print(doc)
```

#### 8.5.1 初始化参数

> `file_path` 见 [8.1.1 通用初始化参数](#811-通用初始化参数)。

- **`mode`**：控制多页 PDF 如何映射为 `Document`，默认 `"page"`。
  - **`"page"`**（默认）：每一页生成 **1 个** `Document`。
  - **`"single"`**：无论多少页，**合并为 1 个** `Document`（`page_content` 为全文）。
- **`password`**：PDF 有密码保护时传入打开密码；无加密时可省略。

---

## 9. 文本分割器 (Text Splitters)

RAG 流程中，加载器读入的 `Document` 往往过长，需先**分块 (Chunking)** 再嵌入或检索。LangChain 提供多种文本分割器；其中 **`RecursiveCharacterTextSplitter`** 是官方文档推荐的默认字符分割器，能按自然段落递归切分，在**保持上下文完整**与**控制片段大小**之间取得较好平衡，开箱即用。

依赖包（与 `langchain_community` 分离）：

```bash
pip install langchain_text_splitters
```

### 9.1 RecursiveCharacterTextSplitter

按 `separators` 列表**优先级递归**尝试切分：优先在 `\n\n`（段落）处分割，仍超长则尝试 `\n`、句号、问号等，最后才按空格或单字符硬切。

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,         # 每段最大字符数
    chunk_overlap=50,       # 相邻段之间的重叠字符数，保留上下文衔接
    separators=["\n\n", "\n", "。", "！", "？", ".", "!", "?", " ", ""],
    length_function=len,    # 统计长度的函数，默认 len（按字符数）
)

split_docs = splitter.split_documents(docs)   # docs 来自 TextLoader 等加载器
print(len(split_docs))
```

#### 9.1.1 初始化参数

| 参数 | 作用 |
| :--- | :--- |
| **`chunk_size`** | 每个分块允许的最大长度（由 `length_function` 计量）。 |
| **`chunk_overlap`** | 相邻分块重叠的字符数，避免语义在边界处被截断。 |
| **`separators`** | 分割符列表，**按顺序**尝试；列表末尾的 `""` 表示必要时按单字符硬切。 |
| **`length_function`** | 计算文本长度的函数，默认 `len`；可换为按 token 计数的函数。 |

#### 9.1.2 常用方法

- **`split_documents(documents)`**：输入 `list[Document]`，输出切分后的 `list[Document]`，**保留原 `metadata`**（如 `source`）。
- **`split_text(text)`**：直接对纯字符串分块，返回 `list[str]`（不涉及 `Document` 封装）。

#### 9.1.3 典型链路

```text
TextLoader.load()  →  [Document]（1 个，全文）
        ↓
RecursiveCharacterTextSplitter.split_documents()
        ↓
[list[Document]]（多个小块）→ [§10 向量存储](#10-向量存储-vector-stores)
```

---

## 10. 向量存储 (Vector Stores)

向量存储用于**持久化嵌入向量**并执行**相似性检索**，是 RAG 流程的核心环节之一。

**典型 RAG 两阶段流程**：

| 阶段 | 流程 |
| :--- | :--- |
| **索引（存储）** | `Document` → 嵌入模型 → 嵌入向量 → 写入向量存储 |
| **查询（检索）** | 查询文本 → 嵌入模型 → 查询向量 → 相似性搜索 → Top-k 结果 |

> 嵌入模型初始化见 [§1.3 嵌入模型](#13-嵌入模型-embeddings)；文档加载见 [§8 文档加载器](#8-文档加载器-document-loaders)。

LangChain 中常用的向量存储实现：

| 实现 | 导入 | 特点 |
| :--- | :--- | :--- |
| **`InMemoryVectorStore`** | `langchain_core.vectorstores` | 内存存储（**临时的**），进程退出后数据不保留，适合调试 |
| **`Chroma`** | `langchain_chroma` | 轻量级外部向量数据库，数据**持久化**到磁盘 |

### 10.1 通用 API

| 方法 | 作用 | 主要参数 | 返回值 |
| :--- | :--- | :--- | :--- |
| **`add_documents`** | 将文档写入向量存储（内部自动嵌入） | `documents`：`list[Document]`；`ids`：可选，每条文档的唯一字符串 ID | 写入的 ID 列表 |
| **`delete`** | 按 ID 删除已存储的向量 | `ids`：`list[str]` | — |
| **`similarity_search`** | 按查询文本做相似性检索，返回最相关的文档 | 第 1 个参数：查询字符串；第 2 个参数：`k`，返回条数；`Chroma` 另支持 `filter` 按 metadata 过滤（见 [§10.3.2](#1032-similarity_search-扩展参数)） | `list[Document]` |

### 10.2 InMemoryVectorStore（临时存储）

`InMemoryVectorStore` 将向量保存在**进程内存**中，适合本地调试与临时场景；进程退出后数据不保留。

```python
from pathlib import Path
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_community.document_loaders import CSVLoader

DATA_DIR = Path(__file__).resolve().parent / "data"
# 创建vector_store：向量存储对象
# InMemoryVectorStore：内存存储，临时的
vector_store = InMemoryVectorStore(
    embedding=DashScopeEmbeddings() #模型对象
)

loader = CSVLoader(
    file_path=str(DATA_DIR / "info.csv"),
    encoding="utf-8",
    source_column="source",     # 指定本条数据的来源是哪里
)

documents = loader.load()
# print(documents[0])

# id1 id2 id3 id4 ...
# 向量存储的 新增、删除、检索
vector_store.add_documents(
    documents=documents,        # 被添加的文档，类型：list[Document]
    ids=["id"+str(i) for i in range(1, len(documents)+1)] # 给添加的文档提供id（字符串）  list[str]
)

# 删除  传入[id, id...]
vector_store.delete(["id1", "id2"])

# 检索 返回类型list[Document]
result = vector_store.similarity_search(
    "Python是不是简单易学",
    # "瑞达法",
    3       # 检索的结果要几个
)

print(result)
```

#### 10.2.1 初始化参数

| 参数 | 作用 |
| :--- | :--- |
| **`embedding`** | 嵌入模型实例；索引与检索时均用它将文本转为向量，须与业务侧使用的模型一致。 |

#### 10.2.2 典型链路

```text
CSVLoader.load()  →  list[Document]
        ↓
InMemoryVectorStore.add_documents(documents, ids)
        ↓
similarity_search(query, k)  →  list[Document]（Top-k 相关片段）
```

### 10.3 Chroma（持久化存储）

`Chroma` 是轻量级外部向量数据库，向量数据写入 `persist_directory` 指定目录，重启后仍可检索。

依赖包（需提前安装）：

```bash
pip install langchain-chroma chromadb
```

```python
from pathlib import Path
from langchain_chroma import Chroma
from langchain_community.embeddings import DashScopeEmbeddings

CHROMA_DIR = Path(__file__).resolve().parent / "chroma_db"

# Chroma 向量数据库（轻量级的）
vector_store = Chroma(
    collection_name="test",     # 当前向量存储起个名字，类似数据库的表名称
    embedding_function=DashScopeEmbeddings(),       # 嵌入模型
    persist_directory=str(CHROMA_DIR)     # 指定数据存放的文件夹
)

# 检索 返回类型list[Document]
result = vector_store.similarity_search(
    "Python是不是简单易学呀",
    3,        # 检索的结果要几个
    filter={"source": "黑马程序员"} # 根据source的值过滤
)

print(result)
```

#### 10.3.1 初始化参数

| 参数 | 作用 |
| :--- | :--- |
| **`collection_name`** | 集合名称，类似数据库中的**表名**；同一目录下可区分多个集合。 |
| **`embedding_function`** | 嵌入模型实例（Chroma 使用此参数名；`InMemoryVectorStore` 对应参数为 `embedding`）。 |
| **`persist_directory`** | 向量数据持久化目录；首次写入后会在该路径下生成数据库文件。 |

> `add_documents` / `delete` 用法同 [§10.2 InMemoryVectorStore](#102-inmemoryvectorstore临时存储) 示例；首次写入后，后续运行可直接加载同一 `persist_directory` 做检索，无需重复导入文档。

#### 10.3.2 similarity_search 扩展参数

| 参数 | 作用 |
| :--- | :--- |
| **`filter`** | 按 `Document.metadata` 字段过滤结果，如 `filter={"source": "黑马程序员"}` 仅返回 `metadata["source"]` 匹配的记录。 |

---
