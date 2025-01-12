<!--
 * @Description: 车辆轨迹
 * @Date: 2023-09-20 15:30:47
 * @LastEditTime: 2023-10-12 11:36:25
-->

<template>
    <div class="map-wrap">
        <!-- 地图容器 -->
        <AMapLayer v-if="useMap === MAP_TYPE.AMap" ref="aMapRef" :pathData="pathData" :popupData="windowData"></AMapLayer>
        <LeafletMapLayer
            v-if="useMap === MAP_TYPE.Leaflet"
            ref="leafletMapRef"
            :pathData="pathData"
            :popupData="windowData"
        ></LeafletMapLayer>
    </div>
</template>

<script>
import { tempData, windowData } from './tempData.js';
import AMapLayer from './component/a-map.vue';
import LeafletMapLayer from './component/leaflet-map.vue';
const MAP_TYPE = {
    AMap: 'AMap',
    Leaflet: 'Leaflet'
};
const PATH_TYPE = {
    PLAN: '1', //计划轨迹
    ACTUAL: '2' //实际轨迹
};
export default {
    name: 'TrackMap',
    components: {
        AMapLayer,
        LeafletMapLayer
    },
    props: {
        useMap: {
            type: String,
            default: 'AMap' // 地图类型 2.Leaflet 、 1.AMap
        },
        tracksData: {
            type: Array,
            default: () => [] //全部区域数据集合
        },
        tempList: {
            type: Array,
            default: () => [] //全部区域数据集合
        }
    },
    data() {
        return {
            windowData,
            pathData: {},
            MAP_TYPE
        };
    },
    watch: {
        tracksData: {
            deep: true,
            handler(val) {
                console.log('【 tracksData 】-58', val);
                this.initDataList();
            }
        }
    },
    computed: {},
    mounted() {
        this.initDataList();
    },
    methods: {
        // 获取列表数据
        initDataList() {
            const pathData = tempData;
            const actualPath = pathData.find(item => {
                return item.type === PATH_TYPE.ACTUAL;
            });
            const planPath = pathData.find(item => {
                return item.type === PATH_TYPE.PLAN;
            });
            this.pathData = { actualPath, planPath };
            console.log('【  this.pathData 】-73', this.pathData);
            // if (this.useMap === MAP_TYPE.Leaflet) {
            // }
            // if (this.useMap === MAP_TYPE.AMap) {
            // }
        }
    }
};
</script>

<style lang="scss">
.map-wrap {
    height: 100%;
}
</style>
