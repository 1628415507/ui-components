<!--
 * @Description: 
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 18:12:52
-->
<template>
  <div class="map-demo">
    <el-radio-group v-model="useMap">
      <el-radio-button label="AMap">AMap</el-radio-button>
      <el-radio-button label="Leaflet">Leaflet</el-radio-button>
    </el-radio-group>
    <!-- <div class="top-wrap">
        
          ==
          <el-radio-group v-model="radio">
              <el-radio-button label="DrawMap">区域划分</el-radio-button>
              <el-radio-button label="TrackMap">车辆轨迹</el-radio-button>
          </el-radio-group> 
      </div>-->
    <div class="map-demo">
      <!-- <OrderTracking v-if="radio === 'OrderTracking'" /> -->
      <DrawMap v-if="useMap == 'AMap'" :useMap="useMap" />
      <DrawMap v-if="useMap == 'Leaflet'" :useMap="useMap" />
    </div>
    <!-- <LeafletMap v-if="radio === 'Leaflet'"></LeafletMap>
      <LeafletMapDemo v-if="radio === 'LeafletMapDemo'"></LeafletMapDemo> -->
  </div>
</template>

<script>
// @ is an alias to /src
import DrawMap from './DrawMap/index.vue'
// import TrackMap from '@/components/TrackMap/index.vue';
// import RouteMap from '@/components/RouteMap/index.vue';
// import AMapLayout from '@/components/AMapLayout/index.vue';

// import OrderTracking from '@/components/OrderTracking/index.vue';
// import AmapDrawMap from '@/components/map/index.vue';
// import LeafletMap from '@/components/LeafletMap/index.vue';
// import LeafletMapDemo from '@/components/LeafletMapDemo/index.vue';

export default {
  components: {
    DrawMap
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
.map-demo {
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
