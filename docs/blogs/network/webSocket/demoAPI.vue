<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="openWebSocket()">创建新连接</el-button>
  <el-button @click="closeAllWebSocket()">关闭所有连接</el-button>
  <div class="msg-wrap">
    服务端返回的消息：
    <div v-for="(item, index) in msgList" :key="index">{{ item }}</div>
  </div>
  <!-- 用户列表 -->
  <div v-for="(item, index) in clientList" :key="index">
    <el-divider>用户{{ index + 1 }}</el-divider>
    <el-input v-model="item.msg" placeholder="输入发送的消息"></el-input>
    <br />
    <el-button @click="sendMsg(item.client, item)" :disabled="!item.msg">发送</el-button>
    <el-button @click="closeWebSocket(item.client, index)">closeWebSocket</el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
// 接收客户端的消息
let msgList = ref([])
let clientList = ref([])

function openWebSocket() {
  const $ws = new WebSocket('ws://localhost:8080')
  //  // 当连接成功的时候执行
  $ws.onopen = function (e) {
    console.log('WebSocket连接成功')
    clientList.value.push({ client: $ws, msg: '' })
  }
  $ws.onmessage = function (e) {
    console.log('【 e 】-32', e)
    msgList.value.push(e.data)
    console.log('【 接收客户端的消息: 】-20', e.data, e)
  }
  // 连接关闭
  $ws.onclose = function (e) {
    console.log('【 e 】-32', e)
    msgList.value.push(e.data)
    console.log('【 连接关闭: 】-20', e.data, e)
  }
  console.log('【 clientList.value 】-42', clientList.value)
}
function sendMsg($client, item) {
  if (!$client) {
    return
  }
  $client.send(item.msg) //给服务端发消息
  // $client.send(JSON.stringify({ aa: 'sadsa', bb: 'sadsa' }))
  item.msg = ''
}
function closeWebSocket($client, index) {
  // 当连接成功的时候执行
  console.log('WebSocket关闭')
  $client.close() //给服务端发消息
  clientList.value.splice(index, 1)
}

function closeAllWebSocket() {
  // 当连接成功的时候执行
  console.log('WebSocket关闭')
  clientList.value.forEach((item) => {
    item.client.close() //给服务端发消息
  })
  clientList.value = []
  msgList.value = []
}
</script>

<style scoped>
.msg-wrap {
  border: 1px solid var(--themeColor);
  background: #bfc;
  padding: 5px;
  max-height: 150px;
  overflow: auto;
}
</style>
