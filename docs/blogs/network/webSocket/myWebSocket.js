// import KdxfShare from 'KdxfShare'
// import Bus from 'Bus'
// 具体问题具体分析,把需要用到的方法暴露出去
// 代码：参考https://juejin.cn/post/7470362662599622695?searchId=2025021422535815C2C472CA67A3BF8D5D
const TIMEOUT = 10 * 1000 // 10秒一次心跳
export default class MyWebSocket {
    constructor(wsUrl, options) {
        this.wsUrl = wsUrl
        this.webSocketId = null
        this.$socket = null//保存WebSocket 实例
        this.timeoutServerHeartbeat = null // 服务心跳倒计时
        this.timeoutHeartbeat = null // 心跳倒计时
        this.lockReconnect = false // 是否真正建立连接
        this.timeoutReconnect = null // 断开 重连倒计时
        this.initWebSocket() // 执行初始化方法
    }
    // 【初始化】
    initWebSocket() {
        let id = new Date().getTime()
        this.webSocketId = id //生成实例的唯一id
        // let token = await KdxfShare.getKdxfToken()
        if ('WebSocket' in window) {
            // socket = new WebSocket(wsUrl, token)
            this.$socket = new WebSocket(this.wsUrl)
            console.log('【 this.$socket 】-26', this.$socket)
            this.$socket.customId = id
            this.$socket.onopen = this.openWebsocket.bind(this)//建立连接成功，开启心跳
            this.$socket.onmessage = this.onMessage
            this.$socket.onerror = this.onError
            this.$socket.onclose = this.closeWebsocket.bind(this)//监听关闭重连
        } else {
            throw new Error('您的浏览器不支持websocket，请更换Chrome或者Firefox')
        }
    }
    // 【建立连接】
    openWebsocket(e) {
        console.log(`【${this.webSocketId}】WebSocket连接成功`)
        this.startHeartbeat()//开启心跳监听
    }
    // 【开启心跳】
    startHeartbeat() {
        // 清空旧的定时器并重新开启定时器
        this.timeoutHeartbeat && clearTimeout(this.timeoutHeartbeat)
        // 定时检查连接状态
        this.timeoutHeartbeat = setInterval(() => {
            // 如果连接正常
            if (this.$socket.readyState == 1) {
                console.log(`心跳【${this.webSocketId}】正常连接`)
            } else {
                this.$socket.close()//否则重连（关闭时会触发$socket.onclose ，从而执行closeWebsocket）
            }
        }, TIMEOUT)
    }
    // 【发送数据】
    sendWebsocket(msg) {
        console.log('【 sendWebsocket 】-27', msg)
        this.$socket.send(msg)
    }
    // 【接收服务器返回的数据】
    onMessage(e) {
        console.log('【 接收服务器返回的数据 】-78', e.data)
        if (!e) {
            this.resetHeartbeat()//
            return
        }
        // Bus.$emit('getWebSocketOnMessage', e.data)
        return e
    }
    // 【获取id】
    getId() {
        return this.webSocketId
    }
    // 【断开连接】
    close() {
        console.log('【 close 】-76====')
        this.$socket.close() // WebSocket对象也有发送和关闭的两个方法，只需要在自定义方法中分别调用send()和close()即可实现。
    }
    // 【关闭连接-重连】
    closeWebsocket(e) {
        // 执行this.$socket.close()会触发closeWebsocket
        console.log('【 关闭连接-重连 】-80', e)
        this.reConnect()
    }
    // 连接出错时，重连
    onError(e) {
        console.log('【 onError 】-85', '连接出错时，重连')
        this.initWebSocket()
        this.reConnect()
    }
    // 重新连接
    reConnect() {
        console.log('【 重新连接 】-89')
        if (this.lockReconnect) {
            return
        }
        this.lockReconnect = true
        // 没连接上会一直重连，设置延迟避免请求过多
        this.timeoutReconnect && clearTimeout(this.timeoutReconnect)
        this.timeoutReconnect = setTimeout(() => {
            // 新连接
            this.initWebSocket()
            this.lockReconnect = false//重新连接成功，不成功的话会继续进入onError
        }, 1000)
    }
    // 【重置心跳】
    resetHeartbeat() {
        // 清除时间
        clearTimeout(this.timeoutHeartbeat)
        clearTimeout(this.timeoutServerHeartbeat)
        this.startHeartbeat()// 重启心跳
    }
}




