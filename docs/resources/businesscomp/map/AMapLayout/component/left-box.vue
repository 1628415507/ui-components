<!--
 * @Description: 
 * @Date: 2024-01-08 14:03:06
 * @LastEditTime: 2024-01-19 16:37:58
-->
<template>
    <div class="left-box">
        <!-- 路径规划 -->
        <PathPlanning v-if="routePlanVisible" :AMap="AMap" />
    </div>
</template>

<script>
import PathPlanning from './path-planning.vue';

export default {
    name: 'LeftBox',
    components: {
        PathPlanning
    },
    props: {
        AMap: {
            type: Object,
            default: () => {} //地图对象
        },
        dataList: {
            type: Array,
            default: () => [] //全部区域数据集合
        }
    },
    data() {
        return {
            // 弹框
            routePlanVisible: false
        };
    },
    watch: {
        dataList: {
            deep: true,
            handler(val) {
                this.originList = val;
                this.searchList(val);
            }
        },
        AMap: {
            handler(val) {
                console.log('【 AMap-lb-val 】-87', val);
            }
        }
    },
    computed: {},
    mounted() {},
    methods: {
        openRoutePlan() {
            console.log('【 openRoutePlan 】-101');
            this.routePlanVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
$topIndex: 999;

.left-box {
    z-index: $topIndex;
    position: absolute;
    top: 0;
    left: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 300px;
    height: 100%;
}
</style>
