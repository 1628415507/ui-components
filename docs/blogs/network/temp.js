// 打开或创建⼀个IndexedDB数据库
var request = indexedDB.open('myDatabase', 1);//open(name,version)
// 创建或更新数据库的对象存储空间
// 当你创建或升级一个现有的数据库版本的时候，将会触发一个onupgradeneeded事件
request.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStore = db.createObjectStore('resources', { keyPath: 'url' });
  objectStore.createIndex('url', 'url', { unique: true });
};
// 成功打开数据库后，将资源请求并存储在IndexedDB中
request.onsuccess = function (event) {
  var db = event.target.result;
  var transaction = db.transaction('resources', 'readwrite');
  var objectStore = transaction.objectStore('resources');
  resources.forEach(function (url) {
    // 发起资源请求
    fetch(url)
      .then(function (response) {
        // 检查请求是否成功
        if (!response.ok) {
          throw new Error('Request failed: ', response.status);
        }
        // 将响应数据存储在IndexedDB中
        return response.blob();
      })
      .then(function (data) {
        // 创建⼀个资源对象，以URL作为键名
        var resource = {
          url: url, data: data
        };
        // 将资源对象存储在IndexedDB中
        objectStore.put(resource);
        console.log('Resource cached: ', url);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
  // 完成事务
  transaction.oncomplete = function () {
    console.log('All resources cached in IndexedDB.');
  };
  transaction.onerror = function (event) {
    console.error('Transaction error:', event.target.error);
  };
}