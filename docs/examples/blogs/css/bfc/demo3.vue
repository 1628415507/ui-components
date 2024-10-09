<!--
 * @Description: 阻止外边距折叠
 * @Date: 2024-10-09 16:28:17
 * @LastEditTime: 2024-10-09 17:48:11
-->
<template>
  <div style="min-height: 150px">
    <el-divider>同一个BFC</el-divider>
    <div>
      <p>AAA</p>
      <p>BBB</p>
    </div>

    <el-divider>不同一个BFC</el-divider>
    <div>
      <p>AAA</p>
      <div class="bfc">
        <p>BBB</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const flag = ref(false)
</script>
<style lang="scss" scoped>
p {
  color: var(--theme-color);
  background: #ccc;
  width: 200px;
  line-height: 20px;
  text-align: center;
  margin: 20px;
}

.bfc {
  overflow: hidden;
}
</style>
