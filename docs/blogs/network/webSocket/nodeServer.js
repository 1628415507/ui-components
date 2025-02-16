
/* 
- 安装npm install ws
- 启动：定位到当前文件下运行： node nodeServer.js 或nodemon nodeServer.js (安装 npm i -g nodemon)
- 参考地址：https://blog.csdn.net/m0_37911706/article/details/128057137
*/
//创建一个WebSocket服务器，在8080端口启动
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080//绑定服务器的端口号
});

server.on('open', function open(message) {
    console.log('【 open======= 】-58', message)
});
// 关闭WebSocket服务器：通过监听close事件关闭服务器
server.on('close', function close() {
    console.log(`关闭连接========`, ws, req)
});

// 只要有WebSocket连接到该服务器，就会触发'connection'事件；req对象可以用来获取客户端的信息，如ip、端口号
// 获取所有已连接的客户端信息，则可以使用server.clients数据集
server.on('connection', function connection(ws, req) {
    const ip = req.socket.remoteAddress
    const port = req.socket.remotePort
    const clientName = ip + '_' + port
    console.log(`编号为【${clientName}】的用户，连接成功`)
    ws.send(`你好，编号为【${clientName}】的用户`)

    // 接收数据：ws通过message事件来接收数据。当客户端有消息发送给服务器时，服务器就能够触发该消息
    ws.on('message', function incoming(message) {
        ws.send(`【${clientName}】${message}`)
        console.log(`来自【${clientName}】的消息${message}`);
        // 使用server.clients 获取所有已连接的客户端信息
        // server.clients.forEach(function each(client) {
        //     if (client.readyState === WebSocket.OPEN) {
        //         client.send(clientName + " -> " + message)
        //     }
        // })
    });
    // 关闭连接
    ws.on('close', function close() {
        console.log(`用户【${clientName}】关闭连接`)
    });
    ws.on('error', function open() {
        console.log('error');
        ws.send('ws.on-error');
    });
});


console.log('WebSocket server is running on ws://localhost:8080');