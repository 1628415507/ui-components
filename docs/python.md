# Python 基础语法梳理（AI 项目实战版）

这份文档基于 `01-basic` 和 `02-prompt` 目录下的 Python 代码，为你梳理了其中用到的核心 Python 语法。适合不熟悉 Python 的开发者快速上手。

---

## 1. 注释 (Comments)
Python 使用 `#` 来表示单行注释。三引号 `"""` 或 `'''` 常用于多行注释。

```python
# 这是单行注释
"""
这是多行注释
常用于文档说明
"""
```

## 2. 导入模块 (Imports)
Python 通过 `import` 关键字来使用外部库或内置功能。

```python
import os              # 导入 os 模块（用于操作环境变量等）
import json            # 导入 json 模块（用于处理 JSON 数据）
from openai import OpenAI  # 从 openai 库中只导入 OpenAI 这个类
```

## 3. 变量与赋值 (Variables)
Python 是动态类型语言，不需要声明类型。

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

## 6. 函数与方法调用 (Functions)
```python
print("内容", end="", flush=True) 
# print 是内置函数
# end="" 表示打印后不换行
# flush=True 表示立即刷新显示到屏幕上

os.getenv("KEY") # 获取环境变量
```

## 7. JSON 处理 (JSON Handling)
AI 项目中经常涉及 JSON 的转换：
- `json.dumps(obj, ensure_ascii=False)`：将 Python 对象转成 JSON 字符串（`ensure_ascii=False` 保证中文不乱码）。
- `json.loads(json_str)`：将 JSON 字符串转回 Python 对象（字典或列表）。

---

## 8. 进阶小技巧 (Specific Tips)
- **hasattr(obj, "attr")**：检查对象是否有某个属性。在处理大模型流式返回时很有用。
- **None**：Python 的空值（类似于 JS 的 `null`）。
- **对象属性访问**：使用点号 `.`，如 `chunk.choices[0].delta.content`。

---

希望这份梳理能帮你快速看懂现有的代码！如果有具体某一行不理解，随时问我。
