import dashscope
from http import HTTPStatus
from dotenv import load_dotenv

load_dotenv()

dashscope.base_http_api_url = "https://ws-78j32b28bvlgsgf2.cn-beijing.maas.aliyuncs.com/api/v1"

input_texts = "衣服的质量杠杠的，很漂亮，不枉我等了这么久啊，喜欢，以后还来这里买"

resp = dashscope.TextEmbedding.call(
    model="qwen3.7-text-embedding",
    input=input_texts
)
print(resp)