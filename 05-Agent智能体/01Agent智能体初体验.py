import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from common.dashscope_compat import create_chat_openai
from langchain.agents import create_agent
from langchain_core.tools import tool
model = create_chat_openai()  # 调用封装的create_chat_openai函数，创建一个OpenAI模型


@tool(description="查询天气")# 定义一个工具，用于查询天气
def get_weather() -> str: # 定义一个工具函数，用于查询天气
    return "晴天"


agent = create_agent(
    model=model,
    tools=[get_weather],
    system_prompt="你是一个聊天助手，可以回答用户问题。",
)

res = agent.invoke(
    {
        "messages": [
            {"role": "user", "content": "明天深圳的天气如何？"},
        ]
    }
)

for msg in res["messages"]:
    print(type(msg).__name__, msg.content)
