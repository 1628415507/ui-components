// node服务端处理

//⼆次处理⽂件，修改名称
app.use((ctx) => {
  var body = ctx.request.body;
  var files = ctx.request.files ? ctx.request.files.f1 : [];//文件分片
  //得到上传⽂件的数组
  var result = [];
  var fileToken = ctx.request.body.token;//完整文件的标识
  // ⽂件标识
  var fileIndex = ctx.request.body.index;//⽂件顺序
  if (files && !Array.isArray(files)) {//单⽂件上传容错
    files = [files];
  }
  files && files.forEach(item => {
    var path = item.path;
    var fname = item.name;//原⽂件名
    var nextPath = path.slice(0, path.lastIndexOf('/') + 1) + fileIndex + '-' + fileToken;
    if (item.size > 0 && path) {
      //得到扩展名
      var extArr = fname.split('.');
      var ext = extArr[extArr.length - 1];//
      var nextPath = path + '.' + ext;

      fs.renameSync(path, nextPath);  //重命名⽂件
      result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1));
    }
  });
  if (body.type === 'merge') {
    //合并分⽚⽂件
    var filename = body.filename,
      chunkCount = body.chunkCount,
      folder = path.resolve(__dirname, '../static/uploads') + '/';
    var writeStream = fs.createWriteStream(`${folder}${filename}`);
    var cindex = 0;
    //合并⽂件
    function fnMergeFile() {
      var fname = `${folder}${cindex}-${fileToken}`;
      var readStream = fs.createReadStream(fname);
      // 合并⽂件使⽤ stream pipe 实现，
      readStream.pipe(writeStream, { end: false });
      readStream.on("end", function () {
        fs.unlink(fname, function (err) {
          if (err) {
            throw err;
          }
        });
        if (cindex + 1 < chunkCount) {
          cindex += 1;
          fnMergeFile();
        }
      });
    }
    fnMergeFile();
    ctx.body = 'merge ok 200';
  }
});
