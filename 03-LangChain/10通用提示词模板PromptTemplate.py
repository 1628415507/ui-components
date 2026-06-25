import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_community.llms.tongyi import Tongyi

load_dotenv()

# zero-shot
prompt_template = PromptTemplate.from_template(
    "我的邻居姓{lastname}, 刚生了{gender}, 你帮我起个名字，简单回答。"
)
model = Tongyi(model=os.getenv("TONGYI_LLM_MODEL_NAME"))
# ===================方式1=========================
# 方式1：调用.format方法注入信息即可
prompt_text = prompt_template.format(lastname="张", gender="女儿")
# print(prompt_text)
# res = model.invoke(input=prompt_text) #
# print(res)

# ===================方式2=========================
# 方式2：构建执行链条chain对象
chain = prompt_template | model # prompt_template | model 表示把提示词prompt_template传给model

res = chain.invoke(input={"lastname": "张", "gender": "女儿"}) # 需使用字典
print(res)
