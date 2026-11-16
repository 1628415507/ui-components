import logging
from utils.path_tool import get_abs_path
import os
from datetime import datetime

# 日志保存的根目录
LOG_ROOT = get_abs_path("logs")

# 确保日志的目录存在
os.makedirs(LOG_ROOT, exist_ok=True) # exist_ok：如果目录存在，不报错

# 日志的格式配置  级别：error info debug
DEFAULT_LOG_FORMAT = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s'
)


def get_logger(
        name: str = "agent",
        console_level: int = logging.INFO, # 控制台日志级别
        file_level: int = logging.DEBUG, # 文件日志级别
        log_file = None, # 日志文件的存放路径
) -> logging.Logger:
    # 1. 创建日志管理器
    logger = logging.getLogger(name) # 获取日志器
    logger.setLevel(logging.DEBUG) # 设置日志级别

    # 避免重复添加Handler：如果已经添加了Handler，则不重复添加
    if logger.handlers:
        return logger

    # 2.控制台Handler
    console_handler = logging.StreamHandler() # 创建控制台Handler
    console_handler.setLevel(console_level) # 设置控制台日志级别
    console_handler.setFormatter(DEFAULT_LOG_FORMAT) # 设置控制台输出的日志格式

    logger.addHandler(console_handler) # 添加控制台Handler

    # 3.文件Handler
    if not log_file:        # 日志文件的存放路径
        log_file = os.path.join(LOG_ROOT, f"{name}_{datetime.now().strftime('%Y%m%d')}.log")

    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setLevel(file_level) # 设置文件日志级别
    file_handler.setFormatter(DEFAULT_LOG_FORMAT) # 设置文件日志格式

    logger.addHandler(file_handler) # 添加文件Handler
    
    # 4. 返回日志器
    return logger # 返回日志器

# 快捷获取日志器
logger = get_logger()


if __name__ == '__main__':
    logger.info("信息日志")
    logger.error("错误日志")
    logger.warning("警告日志")
    logger.debug("调试日志")
