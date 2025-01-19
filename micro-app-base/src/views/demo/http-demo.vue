<!--
 * @Author: Hongzf
 * @Date: 2022-11-21 09:54:25
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 17:44:09
 * @Description:
-->
<template>
  <div>http</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { getMockInfo } from '@/api/mockApi'

const getData = () => {
  getMockInfo().then((res: Object) => {
    console.log(res)
  })
}
onMounted(() => {
  getData()
})
</script>

<style scoped></style>
