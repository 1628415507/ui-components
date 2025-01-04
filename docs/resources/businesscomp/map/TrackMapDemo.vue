<!--
 * @Description: 
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 18:12:52
-->
<template>
  <div class="map-example">
    <el-radio-group v-model="useMap">
      <el-radio-button label="AMap">AMap</el-radio-button>
      <el-radio-button label="Leaflet">Leaflet</el-radio-button>
    </el-radio-group>

    <div class="map-demo">
      <TrackMap v-if="useMap == 'AMap'" :useMap="useMap" />
      <TrackMap v-if="useMap == 'Leaflet'" :useMap="useMap" />
    </div>
  </div>
</template>

<script>
import TrackMap from './TrackMap/index.vue'

export default {
  components: {
    TrackMap
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
.map-demo {
  height: 100%;
  /* background: pink; */
}
</style>
