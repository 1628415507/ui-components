<!--
 * @Description: 
 * @Date: 2024-11-04 11:08:49
 * @LastEditTime: 2025-01-06 17:27:40
-->
<template>
  <el-button @click="initWebSocket()">创建新连接</el-button>
  控制台每10 秒心跳一次
  <!-- 用户列表 -->
  <div v-for="(item, index) in clientList" :key="index">
    <el-divider>用户{{ item.id }}</el-divider>
    <el-input v-model="item.msg" placeholder="输入发送的消息"></el-input>
    <br />
    <el-button @click="sendMsg(item.client, item)" :disabled="!item.msg">发送</el-button>
    <el-button @click="closeWebSocket(item.client, index)">closeWebSocket</el-button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import myWebSocket from './myWebSocket'

let clientList = ref([])
// 【建立连接】
function initWebSocket() {
  const $ws = new myWebSocket('ws://localhost:8080', {})
  console.log('【 $ws 】-39', $ws)
  clientList.value.push({ client: $ws, msg: '', id: $ws.getId() })
  console.log('【 clientList.value 】-42', clientList.value)
}
// 【发送数据】
function sendMsg($client, item) {
  if (!$client) {
    return
  }
  $client.sendWebsocket(item.msg) //给服务端发消息
  item.msg = ''
}
function closeWebSocket($client, index) {
  // 当连接成功的时候执行
  console.log('WebSocket关闭')
  $client.close() //关闭
  clientList.value.splice(index, 1)
}
</script>

<style scoped></style>
