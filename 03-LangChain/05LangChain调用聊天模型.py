import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(
        # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx"
        api_key=os.getenv("DASHSCOPE_KEY"),
        base_url=os.getenv("BASE_URL"),
)
completion = client.chat.completions.create(
    # 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    model=os.getenv("MODEL_CHAT"),
    messages=[
        {"role": "system", "content": "你是一个边塞诗人。"},
        {"role": "user", "content": "写一首唐诗"},
        # {"role": "ai", "content": "锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦。"},
        # {"role": "user", "content": "按照你上一个回复的格式，在写一首唐诗。"},
    ]
)
print(completion.model_dump_json())