<!--
 * @Description: 前端⽇志埋点 SDK 设计思路：https://zhuanlan.zhihu.com/p/497413927t
 * @Date: 2024-08-23 16:49:49
 * @LastEditTime: 2024-10-08 18:01:43
-->
<template>
  <div>
    <el-button @click="openIndexedDB">打开或创建一个数据库</el-button>
    <el-button @click="addIndexedDB">增加数据</el-button>
    <el-button @click="queryIndexedDB">查询数据</el-button>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
const resourcesData = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'stroke-width='1.6'viewBox='0 0 20 20'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' d='m14.386 14.386 4.088 4.088-4.088-4.088A7.533 7.533 0 1 1 3.733 3.733a7.533 7.533 0 0 1 10.653 10.653z'/%3E%3C/svg%3E"
]
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" };
// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
const dbName = 'myDatabase'
let dbVersion = 1
// 打开或创建一个数据库
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion)
    request.onerror = function (event) {
      reject()
      console.log('【打开连接失败  】-69')
    }

    request.onsuccess = function (event) {
      let db = event.target.result
      resolve(db)
      console.log('【打开连接成功  】-69')
    }
    request.onupgradeneeded = function (event) {
      console.log('Database onupgradeneeded successfully')
      let db = event.target.result
      resolve(db)
      // 创建了一个名为 customers 的对象存储空间，并指定了一个自增的键
      const objectStore = db.createObjectStore('customers', {
        keyPath: 'id', //主键
        autoIncrement: true //自增
      })
    }
  })
}
// 添加
async function addIndexedDB() {
  const db = await openIndexedDB()
  const transaction = db.transaction(['customers'], 'readwrite') //通过 transaction() 方法创建一个事务
  const objectStore = transaction.objectStore('customers') //通过 objectStore() 方法获取到了名为 customers 的对象存储空间
  const customer = { name: 'Alice', email: 'alice@example.com' }
  const request = objectStore.add(customer) //通过 add() 方法将该对象添加到对象存储空间中
  request.onsuccess = function (event) {
    console.log('【 添加数据成功 】-84')
  }
  request.onerror = function (event) {
    console.log('【 添加数据失败 】-84')
  }
}
// 查询
async function queryIndexedDB() {
  const db = await openIndexedDB()
  const transaction = db.transaction(['customers'], 'readonly')
  const objectStore = transaction.objectStore('customers')
  console.log('【 objectStore 】-64', objectStore)
  const request = objectStore.get(1)//查询了键为 1 的数据项
  request.onsuccess = function (event) {
    const customer = event.target.result
    console.log(customer)
  }
}
// 删除
async function delIndexedDB() {
  const db = await openIndexedDB()
  const transaction = db.transaction(['customers'], 'readonly')
  const objectStore = transaction.objectStore('customers')
  console.log('【 objectStore 】-64', objectStore)
  const request = objectStore.get(1)//查询了键为 1 的数据项
  request.onsuccess = function (event) {
    const customer = event.target.result
    console.log(customer)
  }
}
onMounted(() => {})
</script>
