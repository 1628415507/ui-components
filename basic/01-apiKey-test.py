# https://bailian.console.aliyun.com/cn-beijing/?tab=model#/model-market/detail/qwen3-max
# ↑ 上面是阿里云百炼控制台模型页面的链接，方便查阅 qwen3-max 模型说明

from openai import OpenAI
# ↑ 从 openai 包导入 OpenAI 类（兼容 OpenAI 接口的 SDK，可用来调用阿里云等兼容接口）

import os
# ↑ 导入 Python 标准库 os，用于读取环境变量等（本文件中未直接使用，注释里提到了 os.getenv）

client = OpenAI(
    # 从环境变量 OPENAI_API_KEY 读取；若未设置，可用下面注释方式写死（勿提交到 Git）
    api_key=os.getenv("OPENAI_API_KEY"),
    # ↑ api_key：调用 API 所需的密钥，这里写死；生产环境建议用 os.getenv("OPENAI_API_KEY") 从环境变量读取
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    # ↑ base_url：API 基础地址，阿里云 DashScope 的「兼容 OpenAI」端点
)
# ↑ 创建一个 OpenAI 客户端实例，用于后续发起聊天请求

# messages = [{"role": "user", "content": "你是谁"}]
# ↑ 上面是另一条示例问题（已注释），可替换下面 content 做测试

messages = [{"role": "user", "content": "你是谁？你能做什么？"}]
# ↑ 定义对话消息列表：每条消息是 dict，role 为 "user" 表示用户说的话，content 为具体内容

completion = client.chat.completions.create(
    # ↑ 调用「聊天补全」接口，返回一个「流式」迭代器，不是一次性返回整段回复
    model="deepseek-r1",  # 您可以按需更换为其它深度思考模型
    # ↑ model：指定使用的模型名称，qwen3-max 支持深度思考
    messages=messages,
    # ↑ 把上面的用户消息列表传给 API
    extra_body={"enable_thinking": True},
    # ↑ 额外参数：开启「思考过程」，模型会先输出推理再输出最终回答
    stream=True
    # ↑ stream=True 表示使用流式输出，数据会一块一块返回，适合实时打印
)
# ↑ completion 是一个「生成器/迭代器」，用 for 循环逐块取出内容

is_answering = False  # 是否进入回复阶段
# ↑ 标记：False 表示当前还在「思考过程」，True 表示已进入「最终回复」阶段

print("\n" + "=" * 20 + "思考过程" + "=" * 20)
# ↑ 先换行，再打印 20 个等号 + 标题「思考过程」+ 20 个等号；"=" * 20 即字符串重复 20 次

for chunk in completion:
    # ↑ 遍历流式返回的每一块数据，chunk 是服务端返回的一小段响应
    delta = chunk.choices[0].delta
    # ↑ choices 是数组，取第一个元素；delta 表示「本块」相对上一块的新增内容（角色、内容等）
    if hasattr(delta, "reasoning_content") and delta.reasoning_content is not None:
        # ↑ 判断本块是否有 reasoning_content 属性且不为空（即「思考过程」内容）
        if not is_answering:
            # ↑ 若还没进入正式回复阶段，则打印思考内容
            print(delta.reasoning_content, end="", flush=True)
            # ↑ 打印思考内容；end="" 不换行，flush=True 立即刷新到终端
    if hasattr(delta, "content") and delta.content:
        # ↑ 判断本块是否有 content 且非空（即「最终回复」的正文）
        if not is_answering:
            # ↑ 第一次出现 content 时，先打印「完整回复」分隔标题，并标记进入回复阶段
            print("\n" + "=" * 20 + "完整回复" + "=" * 20)
            is_answering = True
        print(delta.content, end="", flush=True)
        # ↑ 逐字/逐块打印最终回复内容，不换行并立即刷新
