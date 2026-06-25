from pathlib import Path
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_community.embeddings import DashScopeEmbeddings
from langchain_community.document_loaders import CSVLoader

DATA_DIR = Path(__file__).resolve().parent / "data"
# 创建vector_store：向量存储对象
# InMemoryVectorStore：内存存储，临时的
vector_store = InMemoryVectorStore(
    embedding=DashScopeEmbeddings() #模型对象
)


loader = CSVLoader(
    file_path=str(DATA_DIR / "info.csv"),
    encoding="utf-8",
    source_column="source",     # 指定本条数据的来源是哪里
)

documents = loader.load()
# print(documents[0])

# id1 id2 id3 id4 ...
# 向量存储的 新增、删除、检索
vector_store.add_documents(
    documents=documents,        # 被添加的文档，类型：list[Document]
    ids=["id"+str(i) for i in range(1, len(documents)+1)] # 给添加的文档提供id（字符串）  list[str]，如["id1", "id2",...]用来根据id删除
)

# 删除  传入[id, id...]
vector_store.delete(["id1", "id2"])

# 检索 返回类型list[Document]
result = vector_store.similarity_search(
    "Python是不是简单易学",
    # "瑞达法",
    3       # 检索的结果要几个
)

print(result)
