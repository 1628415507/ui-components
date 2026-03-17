# 调用本地的ollama
from openai import OpenAI

import os

client = OpenAI(
    base_url="http://localhost:11434/v1", #调用本地的ollama
    api_key="ollama", # 必填，即使是本地模型也要填一个占位符
)

messages = [{"role": "user", "content": "你是谁？你能做什么？"}]

completion = client.chat.completions.create(
    model="gemma3:1b",  # 需要本地已有的模型名，例如 gemma3:1b
    messages=messages,
    # extra_body={"enable_thinking": True}, # qwen2.5 普通版不支持 enable_thinking
    stream=True
)

is_answering = False  # 是否进入回复阶段
print("\n" + "=" * 20 + "回答内容" + "=" * 20)

for chunk in completion:
    # ↑ 遍历流式返回的每一块数据，chunk 是服务端返回的一小段响应
    delta = chunk.choices[0].delta
    if hasattr(delta, 'content') and delta.content:
        print(delta.content, end="", flush=True)