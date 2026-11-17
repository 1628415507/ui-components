from abc import ABC, abstractmethod
from typing import Optional # 类型提示
from langchain_core.embeddings import Embeddings
from langchain_community.chat_models.tongyi import BaseChatModel
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_community.chat_models.tongyi import ChatTongyi
from utils.config_handler import rag_conf

# 1. 功能：抽象基类，定义生成模型的接口
class BaseModelFactory(ABC):
    @abstractmethod # abstractmethod:抽象方法，子类必须实现该方法
    def generator(self) -> Optional[Embeddings | BaseChatModel]: # Optional:可选类型，可以是Embeddings或BaseChatModel
        pass


# 2. 功能：聊天模型工厂
class ChatModelFactory(BaseModelFactory):
    def generator(self) -> Optional[Embeddings | BaseChatModel]:
        return ChatTongyi(model=rag_conf["chat_model_name"])

# 3. 功能：嵌入模型工厂
class EmbeddingsFactory(BaseModelFactory):
    def generator(self) -> Optional[Embeddings | BaseChatModel]:
        return DashScopeEmbeddings(model=rag_conf["embedding_model_name"])

# 获取类实力
chat_model = ChatModelFactory().generator() 
embed_model = EmbeddingsFactory().generator()
