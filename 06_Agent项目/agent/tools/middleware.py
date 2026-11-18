from typing import Callable
from utils.prompt_loader import load_system_prompts, load_report_prompts
from langchain.agents import AgentState
from langchain.agents.middleware import wrap_tool_call, before_model, dynamic_prompt, ModelRequest
from langchain.tools.tool_node import ToolCallRequest
from langchain_core.messages import ToolMessage
from langgraph.runtime import Runtime
from langgraph.types import Command
from utils.logger_handler import logger

# 中间件1：监控工具执行
@wrap_tool_call
def monitor_tool(
        # 请求的数据封装
        request: ToolCallRequest, #ToolCallRequest：工具调用的请求
        # 执行的函数本身，入参为request， Callable：表示可调用的对象
        handler: Callable[[ToolCallRequest], ToolMessage | Command],
) -> ToolMessage | Command:             # 工具执行的监控
    logger.info(f"【tool monitor】执行工具：{request.tool_call['name']}")
    logger.info(f"【tool monitor】传入参数：{request.tool_call['args']}")

    try:
        # 执行工具函数，返回ToolMessage或Command
        result = handler(request)
        logger.info(f"【tool monitor】工具{request.tool_call['name']}调用成功")

        # 如果名称为fill_context_for_report的工具被调用，则设置报告生成场景标志
        if request.tool_call['name'] == "fill_context_for_report": 
            request.runtime.context["report"] = True # 注入值为true,设置报告生成场景标志,说明fill_context_for_report被调用

        return result
    except Exception as e:
        logger.error(f"工具{request.tool_call['name']}调用失败，原因：{str(e)}")
        raise e # 抛出异常


@before_model
def log_before_model(
        state: AgentState,          # 整个Agent智能体中的状态记录
        runtime: Runtime,           # 记录了整个执行过程中的上下文信息
):         # 在模型执行前输出日志
    logger.info(f"【log_before_model】即将调用模型，带有{len(state['messages'])}条消息。")
    logger.debug(f"【log_before_model】{type(state['messages'][-1]).__name__} | {state['messages'][-1].content.strip()}")

    return None

# 动态切换提示词，每一次在生成提示词之前，调用此函数
@dynamic_prompt               
def report_prompt_switch(request: ModelRequest): 
    is_report = request.runtime.context.get("report", False) #  如果为false,获取报告生成场景标志,
    if is_report:               # 如果为true,是报告生成场景，返回报告生成提示词内容
        print("【report_prompt_switch】************************切换提示词*************************")
        return load_report_prompts() # 返回报告生成提示词内容

    return load_system_prompts() # 返回系统提示词内容
