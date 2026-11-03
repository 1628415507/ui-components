import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
        # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx"
        api_key=os.getenv("DASHSCOPE_KEY"),
        base_url=os.getenv("BASE_URL"),
)
stream = client.chat.completions.create(
    # 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    model=os.getenv("MODEL_LLM"),
    messages=[
        {"role": "user", "content": "你是谁呀能做什么？"},
    ],
    stream=True,  # 开启流式输出
)

# 逐块接收并打印，end="" 让结果不换行
for chunk in stream:
    # 注意：最后一个/心跳 chunk 的 choices 可能是空列表，直接取 [0] 会报 IndexError
    if not chunk.choices:
        continue
    # 每个 chunk.choices[0].delta.content 是当前片段的内容，首尾块的 content 可能为 None
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
