# AI大模型
> 脑图：https://docs.qq.com/mind/DWkdKVnhQUWtrYmtJ
> 课程： https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=2
> API： https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key

![alt text](image.png)
------------------------------

## 01 apiKey调用
- Python安装openai： `pip install openai -i  https://pypi.tuna.tsinghua.edu.cn/simple`
- [pycharm安装](https://www.runoob.com/w3cnote/pycharm-windows-install.html)

------------------------------
## [02 Ollama](https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=5)
### Ollama简介
- 开源软件，支持在本地运行模型
![alt text](image.png)
![alt text](image-1.png)

- 蒸馏模型，参数量越大，效果越好，但是也更吃电脑性能（性能支持越好，回答问题的速度越快）
![alt text](image-2.png)
![alt text](image-3.png)

### 本地如何使用Ollama
- 启动Ollama
- 调整配置文件的`base_url`和`model`

------------------------------
## 03 [OpenAI库的基础使用](https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=8)
- 回复越多，消耗的tokens越多
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-7.png)

## 04 [OpenAI库的流式输出](https://www.bilibili.com/video/BV1yjz5BLEoY?spm_id_from=333.788.player.switch&vd_source=9d75580d0b23d1137d56e03a996ac726&p=9)
- 配置`stream=True `, 然后for循环输出
- 可以让结果一段段输出