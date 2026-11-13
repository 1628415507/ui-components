import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] # 取当前文件的上一级目录，即项目根 ui-components-ai
if str(ROOT) not in sys.path: # 如果该目录不在 sys.path 中，则插入到最前面
    sys.path.insert(0, str(ROOT)) # 把该目录插到 sys.path 最前面，优先从这里找模块

from common.dashscope_compat import create_chat_openai
from langchain.agents import create_agent
from langchain_core.tools import tool


@tool(description="获取股价，传入股票名称，返回字符串信息")
def get_price(name: str) -> str:
    return f"股票{name}的价格是20元"


@tool(description="获取股票信息，传入股票名称，返回字符串信息")
def get_info(name: str) -> str:
    return f"股票{name}，是一家A股上市公司，专注于IT职业教育。"


agent = create_agent(
    model=create_chat_openai(),
    tools=[get_price, get_info],
    system_prompt="你是一个智能助手，可以回答股票相关问题，记住请告知我思考过程，让我知道你为什么调用某个工具"
)

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "传智教育股价多少，并介绍一下"}]},
    stream_mode="values"
):
    latest_message = chunk['messages'][-1] # 获取最新消息，最后一条

    if latest_message.content:
        print(type(latest_message).__name__, latest_message.content)

    try:
        if latest_message.tool_calls: #打印工具调用，工具名称
            print(f"工具调用： { [tc['name'] for tc in latest_message.tool_calls]  }") # 打印工具调用，工具名称
    except AttributeError as e: # 处理 AttributeError 异常，即 latest_message 没有 tool_calls 属性
        pass # 什么都不做
