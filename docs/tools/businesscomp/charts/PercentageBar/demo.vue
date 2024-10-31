<!--
 * @Description:
 * @Date: 2024-10-22 10:00:09
 * @LastEditTime: 2024-10-31 13:09:01
-->
<template>
  <PercentageBar :list="list" />
</template>
<script>
import PercentageBar from './PercentageBar.vue'

export default {
  components: {
    PercentageBar
  },
  data() {
    return {
      list: [
        { name: '投标盘', value: 312, color: '#1d96f2' },
        { name: '中标盘', value: 34, color: '#7cc5fc' },
        { name: '询价盘', value: 128, color: '#f7baba' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
