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

    <div class="map-use">
      <!-- <OrderTracking v-if="radio === 'OrderTracking'" /> -->
      <RouteMap v-if="useMap == 'AMap'" :useMap="useMap" />
      <RouteMap v-if="useMap == 'Leaflet'" :useMap="useMap" />
    </div>
    <!-- <LeafletMap v-if="radio === 'Leaflet'"></LeafletMap>
      <LeafletMapDemo v-if="radio === 'LeafletMapDemo'"></LeafletMapDemo> -->
  </div>
</template>

<script>
// import TrackMap from '@/components/TrackMap/index.vue';
import RouteMap from './RouteMap/index.vue'
// import AMapLayout from '@/components/AMapLayout/index.vue';

// import OrderTracking from '@/components/OrderTracking/index.vue';
// import AmapDrawMap from '@/components/map/index.vue';
// import LeafletMap from '@/components/LeafletMap/index.vue';
// import LeafletMapDemo from '@/components/LeafletMapDemo/index.vue';

export default {
  components: {
    RouteMap
    // OrderTracking
    // AmapDrawMap
    // LeafletMap,
    // LeafletMapDemo
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
