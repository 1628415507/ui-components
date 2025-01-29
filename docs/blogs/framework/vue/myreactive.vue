<template>
  <el-button @click="handleProxy('get')">get</el-button>
  <el-button @click="handleProxy('set')">set</el-button>
  <el-button @click="handleProxy('add')">add</el-button>
  <el-button @click="handleProxy('delete')">delete</el-button>
  <el-button @click="handleProxy2(' ')">测试嵌套</el-button>
</template>
<script setup>
function myReactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      // return res //这里直接return 复杂嵌套（ state2.bar.a ）无法触发set
      // 解决嵌套无法进入代理set的问题，需要在 get 之上再进行一层代理 myReactive(res)
      return typeof res == 'object' ? myReactive(res) : res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })
  return observed
}
const state = myReactive({ foo: 'foo' })
function handleProxy(type) {
  switch (type) {
    // 1.获取
    case 'get':
      console.log('【 state 】-44', state)
      break
    // 2.设置已存在属性
    case 'set': //
      state.foo = 'foooooo' // ok
      break
    // 3.添加新属性
    case 'add':
      state.dong = 'dong' // ok
      break
    //4.删除属性
    case 'delete':
      delete state.dong // ok
      break
  }
}
// 测试复杂嵌套
const state2 = myReactive({ bar: { a: 1 } })
function handleProxy2() {
  state2.bar.a = 10
}
</script>

<style scoped></style>
