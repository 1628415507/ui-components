<!--
 * @Description: 
 * @Date: 2024-10-15 09:17:10
 * @LastEditTime: 2024-10-16 09:27:10
-->
<template>
  <el-button @click="hanldleCancelToken">取消请求方式1</el-button>
  <el-button @click="hanldleCancelToken2(0)">全部终止请求</el-button>
  <el-button @click="hanldleCancelToken2(3)">终止请求3</el-button>
  <el-button @click="hanldleCancelToken2(4)">终止请求4</el-button>
</template>

<script setup>
import axios from 'axios'
import { getCurrentInstance, ref, defineEmits } from 'vue'
// 方式1
function hanldleCancelToken() {
  const source = axios.CancelToken.source()
  console.log('【 source 】-10', source)
  //
  axios
    // 发送请求并关联取消标记
    .post('/user/aa', { name: 'new name' }, { cancelToken: source.token })
    //   请求被终止会进入catch
    .catch(function (thrown) {
      console.log('【 axios.isCancel(thrown) 】-19', thrown, axios.isCancel(thrown))
      if (axios.isCancel(thrown)) {
        console.log('请求1：', thrown.message)
      } else {
        // 处理错误
      }
    })
  //
  axios
    .post('/user/bb', { name: 'new name' }, { cancelToken: source.token })
    //   请求被终止会进入catch
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('请求2：', thrown.message)
      } else {
        // 处理错误
      }
    })
  // 终止请求
  source.cancel('终止请求信息')
}
// 方式2
function hanldleCancelToken2(type) {
  const CancelToken = axios.CancelToken
  let cancel
  axios
    .get('/user/cc', {
      cancelToken: new CancelToken(function executor(c) {
        // console.log('终止请求：', c)
        cancel = c
        if (type == 0 || type == 3) {
          c('终止请求信息3')
        }
      })
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('请求3：', thrown.message)
      } else {
        // 处理错误
      }
    })
  // 请求4
  axios
    .get('/user/dd', {
      cancelToken: new CancelToken(function executor(c) {
        // console.log('终止请求：')
        if (type == 0 || type == 4) {
          c('终止请求信息4')
        }
      })
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('请求4：', thrown.message)
      } else {
        // 处理错误
      }
    })
  // cancel('终止请求信息3')
}

</script>

<style lang="scss" scoped></style>
