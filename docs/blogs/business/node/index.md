<!--
 * @Description:
 * @Date: 2024-10-31 09:27:12
 * @LastEditTime: 2024-11-08 14:30:22
-->

## 【⽤ nodejs 统记某个⽬录下⾯指定文件的代码⾏数】

<!-- 【热度: 1,732】 -->

| fs 方法                                                                                      | 说明                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `fs.readdirSync(directoryPath)`                                                              | 同步读取当前目录下的所有文件和文件夹，返回数组 |
| `fs.readFileSync(filePath)`                                                                  | 读取文件内容                                   |
| [`stats=fs.statSync(filePath)`](https://blog.csdn.net/qq_42744920/article/details/123719169) | 同步方法，获取文件信息状态                     |
| `stats.isFile()`                                                                             | 如果是文件则返回 true,否则返回 false;          |
| `stats.isDirectiory()`                                                                       | 如果是目录则返回 true,否则返回 false;          |
| `path.extname(file)`                                                                         | 文件后缀                                       |

- 详见`docs\examples\blogs\business\line-counter.js`
- 执行示例,在终端执行`node line-counter.js ../business .js`
  - 其中 ../business 是要统计的⽬录路径，
  - .js 是要统计的⽂件扩展名。

```js{11,17,21,23,30}
import fs from 'fs'
import path, { resolve } from 'path'
// const fs = require('fs');
// const path = require('path');
// dirPath：目录路径
// fileExtension：文件扩展名
function countLinesInDirectory(dirPath, fileExtension) {
  let totalLines = 0
  // 统计文件行数
  function countLinesInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8') // 读取文件内容
    const lines = content.split('\n') //根据换行符分割
    totalLines += lines.length
  }
  // 遍历目录
  function processDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath)
    // console.log('【 files 】-20', files)
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      const stats = fs.statSync(filePath) // 获取文件信息状态
      // 判断是文件还是目录
      if (stats.isFile() && path.extname(file) === fileExtension) {
        countLinesInFile(filePath)
      } else if (stats.isDirectory()) {
        processDirectory(filePath)
      }
    })
  }
  processDirectory(dirPath)
  return totalLines
}

// 命令⾏参数，第⼀个参数是⽬录路径，第⼆个参数是⽂件扩展名
const [_, __, dirPath, fileExtension] = process.argv

const linesCount = countLinesInDirectory(dirPath, fileExtension)
console.log(`目录 ${dirPath}下${fileExtension}文件的代码共:${linesCount}行`)
```
