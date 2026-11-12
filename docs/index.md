# gemini
https://gemini.google.com/
# AI大模型
>
> 脑图：<https://docs.qq.com/mind/DWkdKVnhQUWtrYmtJ>
> 课程： <https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=2>
> 配套资料：<https://pan.baidu.com/s/1kQ-Q7UFWuHEbawQ4SStNSQ?pwd=1234>
> API： <https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key>
![alt text](img/ollama-intro-slide.png)
------------------------------

## 01 ApiKey调用

- Python安装openai： `pip install openai -i  https://pypi.tuna.tsinghua.edu.cn/simple`
- [pycharm安装](img/https://www.runoob.com/w3cnote/pycharm-windows-install.html)

------------------------------

## [02 Ollama](img/https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=5)

### Ollama简介

- 开源软件，支持在本地运行模型
![alt text](img/ollama-intro-slide.png)
![alt text](img/ollama-download-mascot.png)

- 蒸馏模型，参数量越大，效果越好，但是也更吃电脑性能（性能支持越好，回答问题的速度越快）
![alt text](img/ollama-model-size-performance-1.png)
![alt text](img/ollama-model-size-performance-2.png)

### 本地如何使用Ollama

- 启动Ollama
- 调整本地配置文件的`base_url`和`model`

------------------------------

## 03 [OpenAI库的基础使用](img/https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=8)

### 常见命令

1. 查看当前安装的模型名称：`ollama list`
2. 删除问题模型：`ollama rm <模型名称>`
3. 重新下载模型：`ollama pull <模型名称>`

- 回复越多，消耗的tokens越多
![alt text](img/openai-completion-tokens-demo-1.png)
![alt text](img/openai-completion-tokens-demo-2.png)
![alt text](img/openai-completion-tokens-demo-3.png)

### [OpenAI库的流式输出](img/https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=9)

- 配置`stream=True`, 然后for循环输出
- 可以让结果一段段输出

### openai-附带历史消息调用模型

- 通过多条message记录历史消息
![alt text](img/openai-chat-messages-history-1.png)
![alt text](img/openai-chat-messages-history-2.png)

------------------------------

## 04 prompt提示工程

### 提示词技巧/提问技巧

1. 详细描述
2. 让模型充当某个角色
3. 分隔符说明内容
4. 指定步骤
5. 提供示例
6. 使用参考文本（给出参考范围，降低幻觉）
![alt text](img/prompt-engineering-six-techniques.png)

### 提示词思想

- [Zero-shot “零样本”](img/https://www.bilibili.com/video/BV1yjz5BLEoY/?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=12)
- 基于已经训练好的能力，从已知的属性，类推识别新的类别
![alt text](img/prompt-zero-shot-example.png)

- Few-show “少样本”
- 给出示例
![alt text](img/prompt-few-shot-examples-1.png)
![alt text](img/prompt-few-shot-examples-2.png)

### JSON数据格式

![alt text](img/prompt-json-response-format.png)

## 05 [langchain](img/https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.videopod.episodes&vd_source=9d75580d0b23d1137d56e03a996ac726&p=17)

### 简介和功能
![alt text](img/langchain-framework-modules-1.png)
![alt text](img/langchain-framework-modules-2.png)
![alt text](img/langchain-framework-modules-3.png)
![alt text](img/langchain-framework-modules-4.png)
### 安装
- 安装  `pip install langchain langchain-community langchain-ollama langchain-chroma dashscope chromadb  bs4 jq`(代理到阿里云： `-i https://pypi.tuna.tingh.ua.edu.cn/simple`)
![alt text](img/langchain-pip-install-dependencies.png)
### RAG
- 检索增强生成技术
![alt text](img/rag-retrieval-augmented-intro.png)

## LangChain
- 可以在本地配置调用ollama
### 流式输出
![alt text](img/image-20.png)

### 聊天模型（HumanMessage）
![alt text](img/langchain-human-message-chat.png)

![alt text](img/langchain-api-tongyi-ollama-imports.png)

## 通用提示词模板
![alt text](img/langchain-prompt-template-generic.png)
