<!--
 * @Description: 地图排线
 * @Date: 2024-01-08 14:03:06
 * @LastEditTime: 2024-01-19 16:05:52
-->

<template>
    <div class="map-wrap">
        <AMapLayer ref="aMapRef" :pathData="pathData" :popupData="windowData"></AMapLayer>
    </div>
</template>

<script>
import { tempData, windowData } from './tempData.js';
import AMapLayer from './component/a-map.vue';

export default {
    name: 'AMapLayout',
    components: {
        AMapLayer
    },
    props: {
        dataList: {
            type: Array,
            default: () => [] //全部区域数据集合
        },
        tempList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            windowData,
            pathData: []
        };
    },
    watch: {
        dataList: {
            deep: true,
            handler(val) {
                console.log('【 dataList 】-58', val);
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
            this.pathData = tempData;
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
