from langchain_chroma import Chroma
from langchain_core.documents import Document
from utils.config_handler import chroma_conf # 获取Chroma的配置项
from model.factory import embed_model # 导入嵌入模型实例
from langchain_text_splitters import RecursiveCharacterTextSplitter # 文本分片器
from utils.path_tool import get_abs_path # 路径工具
from utils.file_handler import pdf_loader, txt_loader, listdir_with_allowed_type, get_file_md5_hex # 文件处理工具
from utils.logger_handler import logger # 日志处理工具
import os # 操作系统

# 创建向量服务
class VectorStoreService:
    # 1. 功能：初始化向量库和文本分片器
    def __init__(self):
        # 创建向量库
        self.vector_store = Chroma(
            collection_name=chroma_conf["collection_name"], # 向量库名称
            embedding_function=embed_model, # 嵌入模型
            persist_directory=chroma_conf["persist_directory"], # 向量库存储路径
        )

        # 创建文本分片器
        self.spliter = RecursiveCharacterTextSplitter(
            chunk_size=chroma_conf["chunk_size"], # 每个分片的字数
            chunk_overlap=chroma_conf["chunk_overlap"], # 分片重叠字数
            separators=chroma_conf["separators"], # 分片分隔符
            length_function=len, # 分片长度函数
        )
    # 2. 功能：获取检索器
    def get_retriever(self):
        return self.vector_store.as_retriever(search_kwargs={"k": chroma_conf["k"]}) # 返回检索器

    # 3. 功能：加载文档
    def load_document(self):
        """
        从数据文件夹内读取数据文件，转为向量存入向量库
        要计算文件的MD5做去重
        :return: None
        """
        # 3.1 功能：检查MD5值 ================================================
        def check_md5_hex(md5_for_check: str):
            if not os.path.exists(get_abs_path(chroma_conf["md5_hex_store"])): # 如果文件不存在，则创建文件
                # 创建文件
                open(get_abs_path(chroma_conf["md5_hex_store"]), "w", encoding="utf-8").close()
                return False            # md5 没处理过

            with open(get_abs_path(chroma_conf["md5_hex_store"]), "r", encoding="utf-8") as f:
               # 读取文件的所有行，并去除空格
                for line in f.readlines():
                    line = line.strip() # 去除空格
                    if line == md5_for_check: # 如果MD5值相同，则返回True   
                        return True     # md5 处理过
                return False            # md5 没处理过
        
        # 3.2 功能：保存MD5值 ================================================
        def save_md5_hex(md5_for_check: str):
            with open(get_abs_path(chroma_conf["md5_hex_store"]), "a", encoding="utf-8") as f:
                f.write(md5_for_check + "\n")

        # 3.3 功能：获取文件文档 ================================================
        def get_file_documents(read_path: str):
            if read_path.endswith("txt"): # 如果文件是txt，则返回txt_loader(read_path)
                return txt_loader(read_path)

            if read_path.endswith("pdf"): # 如果文件是pdf，则返回pdf_loader(read_path)
                return pdf_loader(read_path) 

            return []

        # 3.4 功能：获取允许的文件类型路径 ================================================
        allowed_files_path: list[str] = listdir_with_allowed_type(
            get_abs_path(chroma_conf["data_path"]),
            tuple(chroma_conf["allow_knowledge_file_type"]),
        )
        # 3.5 功能：遍历允许的文件类型路径 ================================================
        for path in allowed_files_path:  
            # 获取文件的MD5
            md5_hex = get_file_md5_hex(path) # 获取文件的MD5

            if check_md5_hex(md5_hex):
                logger.info(f"[加载知识库]{path}内容已经存在知识库内，跳过")
                continue
 
            try:
                documents: list[Document] = get_file_documents(path) # 获取文件文档

                if not documents: # 如果文件文档为空，则跳过
                    logger.warning(f"[加载知识库]{path}内没有有效文本内容，跳过")
                    continue
                # 将文件文档分片
                split_document: list[Document] = self.spliter.split_documents(documents) 

                if not split_document:
                    logger.warning(f"[加载知识库]{path}分片后没有有效文本内容，跳过")
                    continue

                # 将内容存入向量库
                self.vector_store.add_documents(split_document)

                # 记录这个已经处理好的文件的md5，避免下次重复加载
                save_md5_hex(md5_hex)

                logger.info(f"[加载知识库]{path} 内容加载成功")
            except Exception as e:
                # exc_info为True会记录详细的报错堆栈，如果为False仅记录报错信息本身
                logger.error(f"[加载知识库]{path}加载失败：{str(e)}", exc_info=True)
                continue

# 测试=================================================================================
if __name__ == '__main__':
    vs = VectorStoreService() # 创建向量服务实例

    vs.load_document() # 加载文档

    retriever = vs.get_retriever() # 获取检索器

    res = retriever.invoke("迷路")
    for r in res:
        print(r.page_content)
        print("-"*20)


