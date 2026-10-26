import os
from langchain_community.llms.tongyi import Tongyi

from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

# 不用qwen3-max，因为qwen3-max是聊天模型，qwen-max是大语言模型
model = Tongyi(model=os.getenv("MODEL_LLM"))

# 调用invoke向模型提问
res = model.invoke(input="你是谁呀能做什么？")

print(res)
