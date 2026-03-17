# https://bailian.console.aliyun.com/cn-beijing/?tab=model#/model-market/detail/qwen3-max
# ↑ 上面是阿里云百炼控制台模型页面的链接，方便查阅 qwen3-max 模型说明

from openai import OpenAI
# ↑ 从 openai 包导入 OpenAI 类（兼容 OpenAI 接口的 SDK，可用来调用阿里云等兼容接口）

import os
# 1.获取client对象
client = OpenAI(
    # 在电脑的环境变量中配置 OPENAI_API_KEY和DASHCOPE_KEY（电脑需重启），代码会自动读取；若未设置，可用下面注释方式写死（勿提交到 Git）
    api_key=os.getenv("OPENAI_API_KEY"),
    # ↑ api_key：调用 API 所需的密钥，这里写死；生产环境建议用 os.getenv("OPENAI_API_KEY") 从环境变量读取
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    # ↑ base_url：API 基础地址，阿里云 DashScope 的「兼容 OpenAI」端点
)

# 2.调用模型
completion = client.chat.completions.create(
    model="qwen3-max",  # 您可以按需更换为其它深度思考模型
    messages= [
       {"role":"system","content":"你是一个Python编程专家，并且不说废话简单回答"},#设置ai的全局特征
       {"role":"assistant","content":"好的，我是编程专家，并且话不多，你要问什么?"},#设置ai的自我意识
       {"role":"user","content":"输出1-10的数字，使用python代码"} 
    ]
)
# 3.处理结果
print(completion.choices[0].message.content)
