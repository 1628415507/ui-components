<template>
  <el-button @click="hanldleCancelToken">取消请求1</el-button>
  <el-button @click="hanldleCancelToken2">取消请求2</el-button>
</template>

<script setup>
import axios from 'axios'
import { getCurrentInstance, ref, defineEmits } from 'vue'
function hanldleCancelToken() {
  const source = axios.CancelToken.source()
  console.log('【 source 】-10', source)
  axios
    // 发送请求并关联取消标记
    .post('/user/12345', { name: 'new name' }, { cancelToken: source.token })
    //   请求被终止会进入catch
    .catch(function (thrown) {
      console.log('【 axios.isCancel(thrown) 】-19', thrown, axios.isCancel(thrown))
      if (axios.isCancel(thrown)) {
        console.log('终止请求：', thrown.message)
      } else {
        // 处理错误
      }
    })
  axios
    .post('/user/55', { name: 'new name' }, { cancelToken: source.token })
    //   请求被终止会进入catch
    .catch(function (thrown) {
      console.log('【 axios.isCancel(thrown) 】-19', thrown, axios.isCancel(thrown))
      if (axios.isCancel(thrown)) {
        console.log('终止请求2：', thrown.message)
      } else {
        // 处理错误
      }
    })
  // 终止请求
  source.cancel('终止请求信息')
}

function hanldleCancelToken2() {
  const CancelToken = axios.CancelToken
  let cancel
  axios
    .get('/user/12345', {
      cancelToken: new CancelToken(function executor(c) {
        // console.log('终止请求：', c)
        cancel = c
      })
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('终止请求2：', thrown.message)
      } else {
        // 处理错误
      }
    })
  cancel('终止请求信息2')
}
</script>

<style lang="scss" scoped></style>
