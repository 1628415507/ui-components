
"""
总结服务类：用户提问，搜索参考资料，将提问和参考资料提交给模型，让模型总结回复
"""
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from rag.vector_store import VectorStoreService
from utils.prompt_loader import load_rag_prompts
from langchain_core.prompts import PromptTemplate
from model.factory import chat_model


def print_prompt(prompt):
    print("="*20)
    print(prompt.to_string())
    print("="*20)
    return prompt

# 总结服务类
class RagSummarizeService(object):
    # 1. 功能：初始化
    def __init__(self):
        self.vector_store = VectorStoreService() # 向量库服务
        self.retriever = self.vector_store.get_retriever() # 检索器
        self.prompt_text = load_rag_prompts() # 加载提示词
        self.prompt_template = PromptTemplate.from_template(self.prompt_text) # 提示词模板
        self.model = chat_model # 模型
        self.chain = self._init_chain() # 初始化链

    # 2. 功能：初始化链
    def _init_chain(self):
        chain = self.prompt_template | print_prompt | self.model | StrOutputParser()
        return chain

    # 3. 功能：检索文档
    def retriever_docs(self, query: str) -> list[Document]:
        return self.retriever.invoke(query) # 检索文档

    # 4. 功能：总结
    def rag_summarize(self, query: str) -> str:

        context_docs = self.retriever_docs(query)

        context = ""
        counter = 0
        for doc in context_docs:
            counter += 1
            context += f"【参考资料{counter}】: 参考资料：{doc.page_content} | 参考元数据：{doc.metadata}\n"

        return self.chain.invoke(
            {
                "input": query,
                "context": context,
            }
        )


if __name__ == '__main__':
    rag = RagSummarizeService()

    print(rag.rag_summarize("小户型适合哪些扫地机器人"))
