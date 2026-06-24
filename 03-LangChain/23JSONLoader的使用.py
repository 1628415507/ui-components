from pathlib import Path
from langchain_community.document_loaders import JSONLoader

DATA_DIR = Path(__file__).resolve().parent / "data"
# ======== json对象 ========
# loader = JSONLoader(
#     file_path=str(DATA_DIR / "stu.json"),
#     # jq_schema=".name",
#     # .表示获取json对象本身，需配置text_content=False,
#     jq_schema=".", 
#     text_content=False,     # 告知JSONLoader 我抽取的内容不是字符串
# )

# ======== json数组 ========
# loader = JSONLoader(
#     file_path=str(DATA_DIR / "stus.json"),
#     # jq_schema=".[]",  #获取所有数组
#     jq_schema=".[].name",  #获取所有数组中的name
#     text_content=False,     # 告知JSONLoader 我抽取的内容不是字符串
# )

# ======== 不是标准json文件 ========
loader = JSONLoader(
    file_path=str(DATA_DIR / "stu_json_lines.json"),
    jq_schema=".name",
    text_content=False,     # 告知JSONLoader 我抽取的内容不是字符串
    json_lines=True         # 告知JSONLoader 这是一个JSONLines文件（每一行都是一个独立的标准JSON）
)

document = loader.load()
print(document)
