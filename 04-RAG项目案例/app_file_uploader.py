"""
基于Streamlit框架完成WEB网页上传服务

pip install streamlit

Streamlit：当WEB页面元素发生变化，则代码重新执行一遍

# 在当前文件所在的目录下运行：streamlit run app_file_uploader.py
# 如果上述运行报错先执行：python -m streamlit run app_file_uploader.py（）
"""
import streamlit as st #起别名：st
from knowledge_base import KnowledgeBaseService

# 1.添加网页标题
st.title("知识库更新服务")

# 2.添加文件上传服务
# file_uploader：获取文件上传框
uploader_file = st.file_uploader(
    "请上传TXT文件",
    type=['txt'],#文件类型
    accept_multiple_files=False,    # False表示仅接受一个文件的上传
)

# session_state就是一个字典
if "service" not in st.session_state:
    st.session_state["service"] = KnowledgeBaseService()


if uploader_file is not None:
    # 提取文件的信息
    file_name = uploader_file.name
    file_type = uploader_file.type
    file_size = uploader_file.size / 1024    # KB

    st.subheader(f"文件名：{file_name}") # 设置子标题
    st.write(f"格式：{file_type} | 大小：{file_size:.2f} KB")
    
    # 提取文件的内容
#     # get_value -> bytes -> decode('utf-8')
    text = uploader_file.getvalue().decode("utf-8") #decode("utf-8")
    st.write(text) #输出文件内容

    with st.spinner("载入知识库中。。。"):       # 在spinner内的代码执行过程中，会有一个转圈动画
        result = st.session_state["service"].upload_by_str(text, file_name)
        st.write(result)




