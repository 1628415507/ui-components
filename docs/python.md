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
import hashlib         # 标准库：文件摘要（如 MD5）
import json            # 导入 json 模块（用于处理 JSON 数据）
import logging         # 标准库：分级日志
from datetime import datetime  # 从 datetime 包只导入 datetime 类
from openai import OpenAI  # 从 openai 库中只导入 OpenAI 这个类
from dotenv import load_dotenv  # 从 .env 文件加载环境变量（AI 项目常用）
from utils.path_tool import get_abs_path  # 项目内包：工程相对路径
from utils.logger_handler import logger  # 项目内包：默认日志器（见 §9）
```

### 2.1 环境变量 (.env)
- AI 项目通常把 API Key、模型名等敏感配置放在项目根目录的 `.env` 文件中，代码里用 `load_dotenv()` 加载后再读取。
- 安装:`pip install python-dotenv`
```python
from dotenv import load_dotenv
import os

load_dotenv()  # 将 .env 中的键值对注入到 os.environ
model_name = os.getenv("MODEL_CHAT")  # 按名称读取；未设置时返回 None
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

- **f-string + 时间格式化**：`datetime.now().strftime('%Y%m%d')` 生成按日期的文件名等。
  ```python
  from datetime import datetime
  log_file = f"agent_{datetime.now().strftime('%Y%m%d')}.log"
  ```
  典型用途：Agent 日志按天切分（与 [日志 (logging)](#9-日志-logging) 中 `FileHandler` 文件名一致）。
  
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

- **`str.endswith(后缀)`**：判断字符串是否以给定后缀结尾；传入 **元组** 时表示「匹配其中任意一个后缀」。
  ```python
  if f.endswith(allowed_types):
      files.append(os.path.join(path, f))
  ```
  典型用途：从知识库目录筛出 `.pdf`、`.txt` 等允许类型（见 [目录扫描与后缀过滤](#81-目录扫描与后缀过滤)）。

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
使用小括号 `()`，只读，它是**不可变**的。
- **示例**：`("句子1", "句子2")`
- **类型注解** `tuple[str]`：表示「元素均为 `str` 的元组」，常用于后缀白名单等入参（详见 [目录扫描与后缀过滤](#81-目录扫描与后缀过滤)）。
- **从列表构造**：`tuple(files)` 把可变列表固化为只读元组再返回。

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
Python 的 `for` 循环通常用于**遍历列表**、字典或生成器。
```python
# 遍历列表
for q in questions:
    print(q)

# 遍历流式返回的内容 (生成器)
for chunk in completion:
    # 每次循环拿到一块数据
    pass
```

### 5.3 异常处理与 `with` 打开文件

| 名称 | 作用 | 典型用法 |
| --- | --- | --- |
| `try` / `except` | 捕获运行期错误 | `except Exception as e:` 后 `str(e)` 写入 [日志](#9-日志-logging) |
| `with open(...)` | 上下文管理器，退出块时自动关闭文件 | `with open(filepath, "rb") as f:` |
| `open(..., "rb")` | 以**二进制**读模式打开（摘要、PDF 等） | 与分块 `read` 配合，避免整文件进内存 |

```python
# 06_Agent项目/utils/file_handler.py

    try:
        with open(filepath, "rb") as f:     # 必须二进制读取
            while chunk := f.read(chunk_size): #:= 是海象运算符，用于简化代码
                md5_obj.update(chunk)
            md5_hex = md5_obj.hexdigest() # 获取文件的md5的十六进制字符串
            return md5_hex
    except Exception as e:
        logger.error(f"计算文件{filepath}md5失败，{str(e)}")
        return None
```

更完整的分块摘要流程见 [二进制分片读与 MD5](#11-二进制分片读与-md5)。

### 5.4 海象运算符 `:=`

在 **表达式** 中赋值并复用，常用于 `while` 条件里「读一块、判非空、循环」。

```python
while chunk := f.read(chunk_size):
    md5_obj.update(chunk)
```

等价于先 `chunk = f.read(...)` 再 `while chunk:`。典型用途：大文件 MD5、流式处理（与 [§5.2 循环](#52-循环-for) 中的 `for chunk in ...` 生成器遍历对比理解）。

---

## 6. 函数与自定义逻辑 (Functions)
- Python 使用 `def` 关键字定义函数。

- 补充：`"""文档说明"""` 只有紧贴在 `def` / `class` **下一行**时才是 **docstring**；
  写在函数之间的三引号字符串只是被创建后丢弃的常量，不会成为函数说明。

```python
def calculate_something(a, b):
    """这是函数文档字符串 (docstring)"""
    if a > b:
        return a + b
    return a * b

# 调用函数
result = calculate_something(10, 20)
```

### 6.2 类型注解 (Type Hints)
在参数和返回值上标注类型，IDE 与静态检查更易读；**运行时不强制校验**，仍按动态类型执行。

```python
def get_abs_path(relative_path: str) -> str:
    return os.path.join(project_root, relative_path)
```

- `relative_path: str`：入参期望为字符串。
- `-> str`：表示函数返回字符串。
- `-> list[Document]`：表示返回 `Document` 对象列表（LangChain 文档加载，见 [LangChain 文档加载](#12-langchain-文档加载)）。
- **默认参数**、**`None` 默认**与 `-> logging.Logger` 的完整示例见 [日志 (logging)](#9-日志-logging)。

典型用途：Agent 工具函数（如统一路径解析、日志初始化）签名一目了然，便于团队协作与补全。

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

  | 参数 | 说明 |
  | --- | --- |
  | `end=""` | 打印后不换行（默认是 `\n`）。<br>在流式输出（Stream）中非常常用，让字符逐个水平排列。 |
  | `flush=True` | 立即刷新缓冲区，将内容输出到屏幕。<br/>在流式输出中，若不设置此参数，内容可能会被**缓存**而无法实时显示。 |
- **zip(list1, list2)**：同时遍历**两个列表**。
  
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
- **`if __name__ == '__main__'`:**：确保代码块仅在**直接运行该脚本时执行，被导入时不执行。**

### 7.1 包目录：`__init__.py` 与 `__pycache__`

本仓库的 `common/`（如 `common/dashscope_compat.py`）是**项目内自定义包**，子目录脚本在把项目根加入 `sys.path` 后可写：

```python
from common.dashscope_compat import create_chat_openai
```

| 文件 / 目录 | 作用 | 说明 |
| :--- | :--- | :--- |
| **`__init__.py`** | 把所在文件夹标记为 **Python 包** | 可为空；有它才能 `import common.xxx`。逻辑可放在同目录其它 `.py` 里（本仓库 `common/__init__.py` 为空，实现在 `dashscope_compat.py`）。若希望简写导入，可在 `__init__.py` 中再导出符号。 |
| **`__pycache__/`** | 解释器自动生成的**字节码缓存** | 首次 `import` 模块时生成 `*.pyc`，加快后续加载；**不是手写源码**，可删，运行时会重建；**不宜提交 Git**（建议在 `.gitignore` 中忽略 `__pycache__/`）。 |

---

## 8. 文件与路径操作 (os.path)

Agent 工程里配置、日志、向量库文件等路径应相对「工程根目录」解析，避免写死盘符。`06_Agent项目/utils/path_tool.py` 展示了常见写法。

| 用法 | 说明 |
| --- | --- |
| `__file__` | 当前 `.py` 源文件的路径（相对或绝对，视运行方式而定）。 |
| `os.path.abspath(path)` | 转为绝对路径。 |
| `os.path.dirname(path)` | 取路径中的**目录部分**（向上一级目录用对该路径再 `dirname` 一次）。 |
| `os.path.join(a, b, ...)` | 按系统规则拼接路径，自动处理分隔符。 |
| `os.path.exists(path)` | 路径是否存在。 |
| `os.path.isfile(path)` | 是否为普通文件。 |
| `os.path.isdir(path)` | 是否为目录。 |
| `os.listdir(path)` | 列出目录下条目名（不含父路径）。 |

### 8.1 目录扫描与后缀过滤

路径判断与遍历依赖上表中的 `isdir`、`listdir`、`join`；后缀匹配用 [§4.1 `endswith`](#41-字符串-string)。错误分支通过 [日志](#9-日志-logging) 的 `logger.error` 记录。

```python
# 06_Agent项目/utils/file_handler.py

def listdir_with_allowed_type(path: str, allowed_types: tuple[str]):        # 返回文件夹内的文件列表（允许的文件后缀）
    files = []

    if not os.path.isdir(path): # isdir：判断路径是否是文件夹
        logger.error(f"[listdir_with_allowed_type]{path}不是文件夹")
        return allowed_types

    for f in os.listdir(path):
        if f.endswith(allowed_types): # endswith：判断文件后缀是否是允许的文件后缀
            files.append(os.path.join(path, f)) # join：将路径和文件名拼接起来

    return tuple(files) # tuple：将列表转换为元组，转为元组后，不能修改，只能读取
```

典型用途：RAG 知识库目录枚举待嵌入的 PDF/TXT。

```python
import os

def get_project_root() -> str:
  # 从「当前模块文件」定位到工程根：utils -> 06_Agent项目
  current_file = os.path.abspath(__file__)
  current_dir = os.path.dirname(current_file)
  return os.path.dirname(current_dir)

def get_abs_path(relative_path: str) -> str:
  return os.path.join(get_project_root(), relative_path)

# 其它模块中：LOG_ROOT = get_abs_path("logs")
```

典型用途：`get_abs_path("config/...")` 加载提示词配置；`get_abs_path("logs")` 与 `os.makedirs(..., exist_ok=True)` 供 [日志 (logging)](#9-日志-logging) 模块落盘使用。

```python
os.makedirs(LOG_ROOT, exist_ok=True)  # 目录已存在时不抛异常
```

---

## 9. 日志 (logging)

Agent 工程用标准库 **logging** 同时输出到控制台与按日文件；目录与绝对路径依赖 [文件与路径操作](#8-文件与路径操作-ospath) 中的 `get_abs_path`、`os.makedirs`。

| 名称 | 作用 | 典型用法 |
| --- | --- | --- |
| `Logger` | 对外写日志的入口 | `logger.info("...")`、`logger.error("...")` |
| `Handler` | 输出目的地 | `StreamHandler`（控制台）、`FileHandler`（文件，`encoding='utf-8'`） |
| `Formatter` | 单行格式模板 | `logging.Formatter('%(asctime)s - %(name)s - ...')` |
| `level` | 过滤阈值（越低越详细） | `DEBUG` < `INFO` < `WARNING` < `ERROR`；Logger 与每个 Handler 可设不同级别 |

实现上为每个 `name` 配置一个 `Logger`，挂载控制台与文件两个 Handler；同一 `name` 再次调用 `get_logger` 时若已有 Handler 则直接返回，避免重复输出。模块 `import` 时执行 `logger = get_logger()`，其它文件可直接 `from utils.logger_handler import logger`。

**导入与目录**（与 [§6.2 默认参数](#62-类型注解-type-hints) 中的 `log_file=None`、`if not log_file:` 配合）：

```python
# 06_Agent项目/utils/logger_handler.py

import logging
from utils.path_tool import get_abs_path
import os
from datetime import datetime

# 日志保存的根目录
LOG_ROOT = get_abs_path("logs")

# 确保日志的目录存在
os.makedirs(LOG_ROOT, exist_ok=True) # exist_ok：如果目录存在，不报错

# 日志的格式配置  级别：error info debug
DEFAULT_LOG_FORMAT = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)
```

**`get_logger`：双 Handler 与防重复挂载**：

```python
# 06_Agent项目/utils/logger_handler.py

def get_logger(
        name: str = "agent",
        console_level: int = logging.INFO, # 控制台日志级别
        file_level: int = logging.DEBUG, # 文件日志级别
        log_file = None, # 日志文件的存放路径
) -> logging.Logger:
    # 1. 创建日志管理器
    logger = logging.getLogger(name) # 获取日志器
    logger.setLevel(logging.DEBUG) # 设置日志级别

    # 避免重复添加Handler：如果已经添加了Handler，则不重复添加
    if logger.handlers:
        return logger

    # 2.控制台Handler
    console_handler = logging.StreamHandler() # 创建控制台Handler
    console_handler.setLevel(console_level) # 设置控制台日志级别
    console_handler.setFormatter(DEFAULT_LOG_FORMAT) # 设置控制台输出的日志格式

    logger.addHandler(console_handler) # 添加控制台Handler

    # 3.文件Handler
    if not log_file:        # 日志文件的存放路径
        log_file = os.path.join(LOG_ROOT, f"{name}_{datetime.now().strftime('%Y%m%d')}.log")

    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(file_level) # 设置文件日志级别
    file_handler.setFormatter(DEFAULT_LOG_FORMAT) # 设置文件日志格式

    logger.addHandler(file_handler) # 添加文件Handler

    # 4. 返回日志器
    return logger # 返回日志器
```

**模块级默认实例与本地试跑**（参见 [§7 `if __name__`](#7-模块与包-modules)）：

```python
# 06_Agent项目/utils/logger_handler.py

# 快捷获取日志器
logger = get_logger()


if __name__ == '__main__':
    logger.info("信息日志")
    logger.error("错误日志")
    logger.warning("警告日志")
    logger.debug("调试日志")
```

典型用途：记录 LLM 请求、工具调用与 RAG 检索；控制台默认 `INFO` 便于日常开发，文件侧 `DEBUG` 便于按日落盘排障。

---

## 10. JSON、运算与对象访问 (Data & Objects)

AI 项目中常见的 JSON 转换、简单运算，以及调用大模型 API / 流式返回时的对象判断与取值：

| 用法 | 说明 |
| --- | --- |
| `json.dumps(obj, ensure_ascii=False)` | 将 Python 对象转成 JSON 字符串；`ensure_ascii=False` 保证中文不乱码。 |
| `json.loads(json_str)` | 将 JSON 字符串转回 Python 对象。 |
| **数学运算** | `**` 表示幂运算（如 `x**2` 是平方），`+=` 是累加。 |
| `hasattr(obj, "attr")` | 检查对象是否有某个属性。在处理大模型流式返回时很有用。 |
| `None` | Python 的空值（类似于 JS 的 `null`）。 |

---

## 11. 二进制分片读与 MD5

Agent / RAG 侧对知识库文件做指纹、去重或变更检测时，用 `hashlib` 对本地文件增量计算摘要；读文件方式与 [§5.3 `with` / `rb`](#53-异常处理与-with-打开文件) 一致。

| 名称 | 作用 | 典型用法 |
| --- | --- | --- |
| `hashlib.md5()` | 创建 MD5 摘要对象 | `md5_obj.update(chunk)` 可多次喂入分片 |
| `.hexdigest()` | 得到十六进制字符串 | 与数据库或配置中的指纹比对 |
| 分片大小 | 控制单次 `read` 字节数 | 源码使用 `4096`（4KB）降低内存峰值 |

校验路径是否为文件、是否存在时，配合 [§8](#8-文件与路径操作-ospath) 的 `exists`、`isfile`。

```python
# 06_Agent项目/utils/file_handler.py

def get_file_md5_hex(filepath: str):     # 获取文件的md5的十六进制字符串

    if not os.path.exists(filepath):
        logger.error(f"[md5计算]文件{filepath}不存在")
        return

    if not os.path.isfile(filepath):
        logger.error(f"[md5计算]路径{filepath}不是文件")
        return

    md5_obj = hashlib.md5()

    chunk_size = 4096       # 4KB分片，避免文件过大爆内存
```

`while chunk := f.read(chunk_size)` 与 `try/except` 片段见 [§5.3](#53-异常处理与-with-打开文件)、[§5.4](#54-海象运算符-)。

典型用途：知识库增量更新前比对文件 MD5，跳过未变更文档。

---

## 12. LangChain 文档加载

在 Python 侧通过 `langchain_community.document_loaders` 把磁盘文件解析为 `langchain_core.documents.Document` 列表，供切块与向量化。返回类型写法见 [§6.2](#62-类型注解-type-hints) 的 `list[Document]`。

| 名称 | 作用 | 典型用法 |
| --- | --- | --- |
| `PyPDFLoader` | 加载 PDF | `.load()` 得到 `list[Document]` |
| `TextLoader` | 加载纯文本 | 指定 `encoding="utf-8"` |
| `.load()` | 执行解析 | 链式：`PyPDFLoader(path).load()` |

```python
# 06_Agent项目/utils/file_handler.py

from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader, TextLoader

def pdf_loader(filepath: str, passwd=None) -> list[Document]:
    return PyPDFLoader(filepath, passwd).load()

def txt_loader(filepath: str) -> list[Document]:
    return TextLoader(filepath, encoding="utf-8").load()
```

典型用途：RAG 管线入口，与 [§8.1 目录扫描](#81-目录扫描与后缀过滤) 得到的绝对路径衔接。

---

希望这份梳理能帮你快速看懂现有的代码！若有某一行不理解，可以直接对照源文件提问。
