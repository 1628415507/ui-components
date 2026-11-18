# 执行本文件：streamlit run app.py

import time

import streamlit as st
from agent.react_agent import ReactAgent

# 标题
st.title("智扫通机器人智能客服")
st.divider()

if "agent" not in st.session_state:
    st.session_state["agent"] = ReactAgent()

if "message" not in st.session_state:
    st.session_state["message"] = []

# 显示历史消息
for message in st.session_state["message"]:
    st.chat_message(message["role"]).write(message["content"])

# 用户输入提示词
prompt = st.chat_input()

# 如果用户输入提示词，则显示用户输入的提示词
if prompt:
    st.chat_message("user").write(prompt)
    st.session_state["message"].append({"role": "user", "content": prompt})

    response_messages = []
    with st.spinner("智能客服思考中..."):
        res_stream = st.session_state["agent"].execute_stream(prompt) #调用ReactAgent
        
        # 捕获流式输出：将流式输出转换为字符串，缓存到response_messages列表中
        def capture(generator, cache_list):

            for chunk in generator:
                cache_list.append(chunk)

                for char in chunk:
                    time.sleep(0.01) # 模拟流式输出，每个字符间隔0.01秒
                    yield char # 一个字符一个字符地返回字符

        st.chat_message("assistant").write_stream(capture(res_stream, response_messages))
        st.session_state["message"].append({"role": "assistant", "content": response_messages[-1]})
        st.rerun() # 每次新的回答，都重新运行整个应用。刷新页面，显示新的回答。
