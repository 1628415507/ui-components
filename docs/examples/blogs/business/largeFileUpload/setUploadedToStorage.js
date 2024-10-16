// 分片上传
function submitUpload() {
  const chunkSize = 210241024;//分⽚⼤⼩ 2M
  const file = document.getElementById('f1').files[0];
  let chunks = [], //保存分⽚数据
    token = (+new Date()),//使用时间戳，⽤于标识⼀个完整的⽂件
    name = file.name,
    chunkCount = 0, //分片总数
    sendChunkCount = 0;//已发送分片数
  //拆分⽂件 像操作字符串⼀样
  if (file.size > chunkSize) {
    //拆分⽂件
    var start = 0, end = 0;
    while (true) {
      end += chunkSize;//截取的结束位置
      var blob = file.slice(start, end);//切割分片
      start += chunkSize;//截取的开始位置
      //截取的数据为空 则结束
      if (!blob.size) {
        //拆分结束
        break;
      }
      chunks.push(blob);//保存分段数据
    }
  } else {
    chunks.push(file.slice(0));
  }
  chunkCount = chunks.length;//分⽚的个数
  let uploadedInfo = getUploadedFromStorage();//获得已上传的分段信息
  for (let i = 0; i < chunkCount; i++) {
    console.log('index', i, uploadedInfo[i] ? '已上传过' : '未上传');
    if (uploadedInfo[i]) {  //对⽐分段
      sendChunkCount = i + 1;//记录已上传的索引
      continue;//如果已上传则跳过
    }
    const fd = new FormData(); //构造FormData对象
    fd.append('token', token);
    fd.append('f1', chunks[i]);
    fd.append('index', i);
    xhrSend(fd, function () {//保存分片成功的回调
      sendChunkCount += 1;//将成功信息保存到本地
      setUploadedToStorage(index);//记录已上传的数据
      //上传完成，发送合并请求
      if (sendChunkCount === chunkCount) {
        console.log('上传完成，发送合并请求');
        var formD = new FormData();
        formD.append('type', 'merge');
        formD.append('token', token);
        formD.append('chunkCount', chunkCount);
        formD.append('filename', name);
        xhrSend(formD);
      }
    });
  }
}
// 发送请求
function xhrSend(fd, cb) {
  var xhr = new XMLHttpRequest(); //创建对象
  xhr.open('POST', 'http://localhost:8100/', true);
  xhr.onreadystatechange = function () {
    console.log('state change', xhr.readyState);
    if (xhr.readyState == 4) {
      console.log(xhr.responseText);
      cb && cb();
    }
  }
  xhr.send(fd);//发送
}

//绑定提交事件
document.getElementById('btn-submit').addEventListener('click', submitUpload);



//获得本地缓存的数据
function getUploadedFromStorage() {
  return JSON.parse(localforage.getItem(saveChunkKey) || "{}");
}

//写⼊缓存
function setUploadedToStorage(index) {
  var obj = getUploadedFromStorage();
  obj[index] = true;
  localforage.setItem(saveChunkKey, JSON.stringify(obj));
}
