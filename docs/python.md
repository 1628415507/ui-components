# Python 基础语法梳理

这份文档基于 当前项目目录 下的实战代码，为你梳理了其中用到的核心 Python 语法。适合不熟悉 Python 的开发者快速上手。

---

## 1. 注释 (Comments)
- 单行注释：Python 使用 `#` 来表示单行注释。
- 多行注释：三引号 `"""` 或 `'''` 常用于多行注释。

```python
# 这是单行注释
"""
这是多行注释
常用于文档说明
"""
```

## 2. 导入模块 (Import)
Python 通过 `import` 关键字来使用外部库或内置功能。

```python
import os              # 导入 os 模块（用于操作环境变量等）
import json            # 导入 json 模块（用于处理 JSON 数据）
from openai import OpenAI  # 从 openai 库中只导入 OpenAI 这个类
from dotenv import load_dotenv  # 从 .env 文件加载环境变量（AI 项目常用）
```

### 2.1 环境变量 (.env)
AI 项目通常把 API Key、模型名等敏感配置放在项目根目录的 `.env` 文件中，代码里用 `load_dotenv()` 加载后再读取。

```python
from dotenv import load_dotenv
import os

load_dotenv()  # 将 .env 中的键值对注入到 os.environ
model_name = os.getenv("TONGYI_CHAT_MODEL_NAME")  # 按名称读取；未设置时返回 None
```

典型用途：切换不同环境的模型配置，避免把密钥硬编码进源码。

## 3. 变量与赋值 (Variables)
Python 是动态类型语言，**不需要声明类型**。

```python
client = OpenAI(...)   # 赋值一个对象
is_answering = False   # 布尔值（True / False，注意首字母大写）
count = 10             # 整数
```

## 4. 基础数据结构 (Data Structures)
代码中频繁用到了以下四种结构：

### 4.1 字符串 (String)
可以使用单引号 `'` 或双引号 `"`。
- **f-string (格式化字符串)**：非常强大，允许**在字符串中嵌入变量**。
  ```python
  name = "AI"
  print(f"你好, {name}") # 输出: 你好, AI
  ```
- **字符串乘法**：用于快速生成重复字符。
  ```python
  print("=" * 20) # 输出 20 个等号
  ```
- **循环拼接 (`+=`)**：在循环中逐段追加字符串，适合把多个片段拼成一段文本。
  ```python
  reference_text = "["
  for doc in result:
      reference_text += doc.page_content
  reference_text += "]"
  ```
  典型用途：RAG 场景下，将向量检索返回的多个 `Document.page_content` 合并为提示词里的 `{context}` 参考资料。

### 4.2 列表 (List)
类似于数组，使用方括号 `[]`。
- **添加元素**：`list.append(item)`
- **索引访问**：`list[0]`
- **列表加法**：`list1 + list2` 会把两个列表合并成一个新列表。

### 4.3 字典 (Dictionary)
类似于键值对 (JSON 对象)，使用花括号 `{}`。
- **定义**：`{"role": "user", "content": "hello"}`
- **访问**：`data["role"]`
- **遍历键值对**：`for key, value in data.items():`

### 4.4 元组 (Tuple)
使用小括号 `()`，它是不可变的。
- **示例**：`("句子1", "句子2")`

---

## 5. 控制流 (Control Flow)
Python 严格依靠 **缩进** 来表示代码块（通常是 4 个空格）。

### 5.1 条件判断 (If)
```python
if hasattr(delta, "content") and delta.content:
    # 缩进部分是满足条件时执行的代码
    print(delta.content)
elif not is_answering:
    # 其他分支
    pass
else:
    # 默认分支
    pass
```

### 5.2 循环 (For)
Python 的 `for` 循环通常用于遍历列表、字典或生成器。
```python
# 遍历列表
for q in questions:
    print(q)

# 遍历流式返回的内容 (生成器)
for chunk in completion:
    # 每次循环拿到一块数据
    pass
```

---

## 6. 函数与自定义逻辑 (Functions)
Python 使用 `def` 关键字定义函数。

```python
def calculate_something(a, b):
    """这是函数文档字符串 (docstring)"""
    if a > b:
        return a + b
    return a * b

# 调用函数
result = calculate_something(10, 20)
```

- **副作用 + 原样返回**：函数可以先做打印等调试操作，再把入参返回，供后续步骤继续使用。
  ```python
  def print_prompt(prompt):
      print(prompt.to_string())
      print("=" * 20)
      return prompt  # 不改变数据，只「看一眼」后继续往下传
  ```
  典型用途：在 LangChain LCEL 管道（`A | B | C`）中插入调试步骤，打印中间提示词而不中断链路。

### 6.1 常用内置函数与技巧
- **print("内容", end="", flush=True)**：
    - `end=""`：表示打印后不换行（默认是 `\n`）。在流式输出（Stream）中非常常用，让字符逐个水平排列。
    - `flush=True`：表示立即刷新缓冲区，将内容输出到屏幕。在流式输出中，若不设置此参数，内容可能会被缓存而无法实时显示。
- **zip(list1, list2)**：同时遍历两个列表。
  ```python
  for a, b in zip(vec_a, vec_b):
    # vec_a[0],vec_b[0]
    # vec_a[1],vec_b[1]
    # vec_a[2],vec_b[2]
      dot_sum += a * b
  ```
- **len(obj)**：获取列表或字符串的长度。
- **raise ValueError("msg")**：手动抛出异常。

---

## 7. 模块与包 (Modules)
除了基础的 `import`，还有一些常用模式：

- **as 关键字 (别名)**：简化长模块名。
  ```python
  import numpy as np  # 之后可以用 np.sqrt() 代替 numpy.sqrt()
  ```
- **`if __name__ == '__main__'`:**：确保代码块仅在直接运行该脚本时执行，被导入时不执行。

---

## 8. JSON 与数据处理 (Data Handling)
AI 项目中经常涉及 JSON 的转换与数学计算：
- `json.dumps(obj, ensure_ascii=False)`：将 Python 对象转成 JSON 字符串（`ensure_ascii=False` 保证中文不乱码）。
- `json.loads(json_str)`：将 JSON 字符串转回 Python 对象。
- **数学运算**：`**` 表示幂运算（如 `x**2` 是平方），`+=` 是累加。

---

## 9. 进阶小技巧 (Specific Tips)
- **hasattr(obj, "attr")**：检查对象是否有某个属性。在处理大模型流式返回时很有用。
- **None**：Python 的空值（类似于 JS 的 `null`）。
- **对象属性访问**：使用点号 `.`，如 `chunk.choices[0].delta.content`。

---

希望这份梳理能帮你快速看懂现有的代码！如果有具体某一行不理解，随时问我。
