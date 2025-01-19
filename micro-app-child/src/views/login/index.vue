<!--
 * @Description: 登录页
 * @Author: Hongzf
 * @Date: 2022-11-25 09:22:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-17 17:11:37
-->
<template>
  <div class="login-wrap">
    <microTest />
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="120px"
      class="loginForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="loginForm.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import microTest from './microTest.vue'
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { login } from '@/api/user'
import { removeToken, setToken } from '@/utils/cookies'
// import qs from 'qs'

// 定义表单数据
const loginForm = reactive({
  account: 'test', // 账号
  password: '123456' // 密码
})
// 定义表单验证规则
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入'))
  } else {
    callback()
  }
}
const rules = reactive({
  account: [{ validator: validatePass, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }]
})
// 提交表单
const loginFormRef = ref<FormInstance>()
const router = useRouter() // useRoute相当于以前的this.$route
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 获取和保存菜单数据
      // store.commit('SET_ROUTES', asyncRoutes)
      // 菜单数据存vuex页面刷新就没了，2种解决方法：
      // ① 刷新之后重新获取接口（可以在路由守卫那边处理）https://www.jb51.net/article/256122.htm
      // ② 或者存到localStorage
      // localStorage.setItem('menus', JSON.stringify(asyncRoutes))
      // 跳转页面
      const params = JSON.stringify({
        username: loginForm.account, // 账号
        password: loginForm.password // 密码
      })

      login(params).then((res) => {
        console.log('【 login-res 】-68', res)
        router.push('./home')
        setToken(res.data.accessToken)
        console.log('登录成功!')
      })
    } else {
      console.log('登录失败!')
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: $themeColor;
}
</style>
