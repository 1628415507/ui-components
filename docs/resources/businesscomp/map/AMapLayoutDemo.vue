<!--
 * @Description: 
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 18:12:52
-->
<template>
  <div class="map-example">
    <div class="map-use">
      <AMapLayout />
    </div>
  </div>
</template>

<script>
import AMapLayout from './AMapLayout/index.vue'

export default {
  components: {
    AMapLayout
  },
  data() {
    return {
      radio: 'AMapLayout',
      useMap: 'AMap' // Leaflet 、 AMap
    }
  }
}
</script>
<style scoped>
.map-example {
  height: 100vh;
  background: #ededed;
  padding: 10px;
}
.top-wrap {
  z-index: 1000;
  position: absolute;
  top: 5px;
  right: 10px;
}
.map-use {
  height: 100%;
  /* background: pink; */
}
</style>
