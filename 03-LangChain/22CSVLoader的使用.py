from pathlib import Path
from langchain_community.document_loaders import CSVLoader
DATA_DIR = Path(__file__).resolve().parent / "data"

loader = CSVLoader(
    # file_path="./data/stu.csv",
    file_path=str(DATA_DIR / "stu.csv"),
    csv_args={
        "delimiter": ",",       # 指定分隔符
        "quotechar": '"',       # 指定带有分隔符文本的引号包围是单引号还是双引号
        # 如果数据原本有表头，就不要下面的代码，如果没有可以使用
        "fieldnames": ['name', 'age', 'gender', '爱好']
    },
    encoding="utf-8"            # 指定编码为UTF-8
)

# 批量加载 .load()   ->  [Document, Document, ...]
documents = loader.load()
# print(documents)

# 循环打印
# for document in documents:
#     print(type(document), document)

# 懒加载  .lazy_load()  迭代器[Document]
for document in loader.lazy_load():
    print(document)
