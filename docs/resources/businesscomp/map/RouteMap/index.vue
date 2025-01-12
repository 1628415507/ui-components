<!--
 * @Description: 全程轨迹、空运轨迹
 * @Date: 2023-10-19 10:03:38
 * @LastEditTime: 2023-11-17 17:02:01
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
import { tempData, tempData1, windowData } from './tempData.js';
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
            pathData: [],
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
            this.pathData = tempData1;
            const windowData = [
                {
                    label: '里程',
                    value: 'speed'
                },
                {
                    label: '时间',
                    value: 'speed'
                }
            ];
            console.log('【 windowData 】-77', JSON.stringify(windowData));
        }
    }
};
</script>

<style lang="scss">
.map-wrap {
    height: 100%;
}
</style>
