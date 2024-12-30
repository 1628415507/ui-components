<!--
 * @Description:
 * @Date: 2024-10-22 10:00:09
 * @LastEditTime: 2024-12-30 17:04:34
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
        { name: '指标1', value: 312, color: '#1d96f2' },
        { name: '指标2', value: 34, color: '#7cc5fc' },
        { name: '指标3', value: 128, color: '#f7baba' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
