import fs from 'fs'
import path, { resolve } from 'path'
// const fs = require('fs');
// const path = require('path');
// dirPath：目录路径 
// fileExtension：文件扩展名
function countLinesInDirectory(dirPath, fileExtension) {
  let totalLines = 0;
  // 统计文件行数
  function countLinesInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');// 读取文件内容    
    const lines = content.split('\n');//根据换行符分割
    totalLines += lines.length;
  }
  // 遍历目录
  function processDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    // console.log('【 files 】-20', files)
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);// 获取文件信息状态  
      // 判断是文件还是目录
      if (stats.isFile() && path.extname(file) === fileExtension) {
        countLinesInFile(filePath);
      } else if (stats.isDirectory()) {
        processDirectory(filePath);
      }
    });
  }
  processDirectory(dirPath);
  return totalLines;
}

// 命令⾏参数，第⼀个参数是⽬录路径，第⼆个参数是⽂件扩展名
const [_, __, dirPath, fileExtension] = process.argv;

const linesCount = countLinesInDirectory(dirPath, fileExtension);
console.log(`目录 ${dirPath}下${fileExtension}文件的代码共:${linesCount}行`);