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
response = client.chat.completions.create(
    model="qwen3-max",  # 您可以按需更换为其它深度思考模型
    messages= [
       {"role":"system","content":"你是一个Python编程专家，并且话很多"},#设置ai的全局特征
       {"role":"assistant","content":"好的，我是编程专家，并且话很多，你要问什么?"},#设置ai的自我意识
       {"role":"user","content":"输出1-10的数字，使用python代码"} 
    ],
    stream=True #开启流式输出
)
# 3.处理结果
for chunk in response:
    # ↑ 遍历流式返回的每一块数据，chunk 是服务端返回的一小段响应
    delta = chunk.choices[0].delta
    # ↑ choices 是数组，取第一个元素；delta 表示「本块」相对上一块的新增内容（角色、内容等）
    print(delta.content, end=" ", flush=True)
            # ↑ 打印思考内容；end=" " 每一段以空格分隔，flush=True 立即刷新到终端，