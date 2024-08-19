<!--
 * @Description:
 * @Date: 2024-07-30 14:36:00
 * @LastEditTime: 2024-08-15 13:33:16
-->

# 使用

## 完整引入
<!-- ts{4,5,8}高亮代码行 -->
```ts{4,5,8}
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import ZUiComp from 'z-ui-comp'
import 'z-ui-comp/style.css'

const app = createApp(App)
app.use(ZUiComp)
app.mount('#app')
```

## 按需引入
- 全局引入样式
```ts{4}
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'z-ui-comp/style.css' // 引入全局样式

const app = createApp(App)
app.mount('#app')
```
- 按需引入组件
```html{3,8}
<template>
  <div>
    <z-input-number v-model="inputVal"></z-input-number>
    <br />
  </div>
</template>
<script setup lang="ts">
  import { ZInputNumber } from 'z-ui-comp'
  import { Ref, ref } from 'vue'
  const inputVal: Ref<string> = ref('')
</script>
```

## 全局配置

具体的传参可根据实际项目，结合组件库进行调整进行调整

```ts{4,5,8}
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import ZUiComp from 'z-ui-comp'
import 'z-ui-comp/style.css'

const app = createApp(App)
app.use(ZUiComp, {
  // 环境变量（根据实际项目传参）
  env: {
    // VITE_API_IS_DECRYPT: import.meta.env.VITE_APP_ENCRYPT_ENABLED,
    // VITE_API_PARTNER_CODE: import.meta.env.VITE_APP_ENCRYPT_PARTNER_CODE,
    // VITE_API_DECRYPT_KEY: import.meta.env.VITE_APP_ENCRYPT_AES_KEY,
    // VITE_API_SECURITY_KEY: import.meta.env.VITE_APP_ENCRYPT_SECURET_KEY,
    // VITE_APP_CODE: import.meta.env.VITE_APP_CODE,
    // BASE_API: import.meta.env.VITE_APP_BASE_API,
    // TOKEN_NAME_KEY: 'token',
    // USER_ID_KEY: 'id',
    // USER_CODE_KEY: 'name',
    // COMPANY_CODE_KEY: 'currentCompanyCode'
  },
  // store的值（根据实际项目传参）
  store: store.state.value
})
app.mount('#app')
```
