/*
 * @Description:
 * @Date: 2024-10-17 09:03:22
 * @LastEditTime: 2024-10-18 16:46:10
 */
// 分片上传
export function sliceUpload(file) {
  console.log('【 file 】-41', file)
  const num = 10 //分⽚⼤⼩10M
  const chunkSize = num * 1024 * 1024 //10M
  let chunks = [], //保存分⽚数据
    fileTag = +new Date(), //使用时间戳，⽤于标识⼀个完整的⽂件
    name = file.name,
    chunkCount = 0, //分片总数
    sendChunkCount = 0 //已发送分片数
  // 超过大小进行文件拆分
  if (file.size > chunkSize) {
    let start = 0
    let end = 0
    //拆分⽂件
    while (end < file.size) {
      end += chunkSize //截取的结束位置
      let blob = file.slice(start, end) //切割分片
      start += chunkSize //截取的开始位置
      //截取的数据为空 则结束
      if (!blob.size) {
        break //拆分结束
      }
      chunks.push(blob) //保存分段数据
    }
  } else {
    console.log('【 未达到分片大小 】-50')
    chunks.push(file.slice(0))
  }
  console.log('【 chunks 】-64', chunks)
  chunkCount = chunks.length //分⽚的个数
  //没有做并发限制，较⼤⽂件导致并发过多，
  // tcp 链接被占光 ，需要做下并发控制，⽐如只有4个在请求在发送
  for (let i = 0; i < chunkCount; i++) {
    const fd = new FormData() //构造FormData对象
    fd.append('f1', chunks[i])
    fd.append('index', i)
    xhrSend(fd, function () {
      //保存分片成功的回调
      sendChunkCount += 1
      //上传完成，发送合并请求
      if (sendChunkCount === chunkCount) {
        console.log('上传完成，发送合并请求')
        var formD = new FormData()
        formD.append('type', 'merge')
        formD.append('fileTag', fileTag)
        formD.append('chunkCount', chunkCount)
        formD.append('filename', name)
        xhrSend(formD)
      }
    })
  }
}
// 发送请求
function xhrSend(fd, cb) {
  var xhr = new XMLHttpRequest() //创建对象
  xhr.open('POST', 'http://localhost:8100/', true)
  xhr.onreadystatechange = function () {
    console.log('state change', xhr.readyState)
    if (xhr.readyState == 4) {
      console.log(xhr.responseText)
      cb && cb()
    }
  }
  xhr.send(fd) //发送
}

//绑定提交事件
// document.getElementById('btn-submit').addEventListener('click', sliceUpload)
