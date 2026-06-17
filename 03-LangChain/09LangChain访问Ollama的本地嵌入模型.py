import os
from dotenv import load_dotenv
from langchain_ollama import OllamaEmbeddings

load_dotenv()

model = OllamaEmbeddings(model=os.getenv("OLLAMA_EMBEDDING_MODEL_NAME"))

# 不用invoke stream
# embed_query、embed_documents
print(model.embed_query("我喜欢你"))
print(model.embed_documents(["我喜欢你", "我稀饭你", "晚上吃啥"]))
