# 视频地址https://www.bilibili.com/video/BV1yjz5BLEoY/?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=66
from langchain.agents import create_agent
from model.factory import chat_model
from utils.prompt_loader import load_system_prompts
from agent.tools.agent_tools import (rag_summarize, get_weather, get_user_location, get_user_id,
                                     get_current_month, fetch_external_data, fill_context_for_report)
from agent.tools.middleware import monitor_tool, log_before_model, report_prompt_switch


class ReactAgent:
    # 初始化
    def __init__(self):
        # 创建Agent
        self.agent = create_agent(
            model=chat_model, # 模型
            system_prompt=load_system_prompts(), # 系统提示词
            tools=[rag_summarize, get_weather, get_user_location, get_user_id, # 工具
                   get_current_month, fetch_external_data, fill_context_for_report], # 工具列表
            middleware=[monitor_tool, log_before_model, report_prompt_switch], # 中间件
        )

    # 执行流式输出
    def execute_stream(self, query: str):
        input_dict = {
            "messages": [
                {"role": "user", "content": query},
            ]
        }

        # 第三个参数context就是上下文runtime中的信息，就是我们做提示词切换的标记
        for chunk in self.agent.stream(input_dict, stream_mode="values", context={"report": False}):
            latest_message = chunk["messages"][-1] # 拿取最新一条消息
            if latest_message.content:
                yield latest_message.content.strip() + "\n" # 返回最新一条消息的内容


if __name__ == '__main__':
    agent = ReactAgent()

    # for chunk in agent.execute_stream("扫地机器人在我所在的地区的气温下如何保养"):
    for chunk in agent.execute_stream("给我生成我的使用报告"):
        print(chunk, end="", flush=True)
