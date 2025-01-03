<!--
 * @Description: 区域划分
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 17:58:45
-->

<template>
    <div class="map-wrap">
        <AMapLayer
            v-if="useMap === MAP_TYPE.AMap"
            ref="aMapRef"
            :dataList="originList"
            :openAdministrativeArea="openAdministrativeArea"
            :openGeofencing="openGeofencing"
            @handleDistrictSave="setDistrictSave"
            @handleGeofencingSave="setGeofencingSave"
            @handleDelete="setDeleteEvent"
        ></AMapLayer>
        <LeafletMapLayer
            v-if="useMap === MAP_TYPE.Leaflet"
            ref="leafletMapRef"
            :dataList="originList"
            :openAdministrativeArea="openAdministrativeArea"
            :openGeofencing="openGeofencing"
            @handleGeofencingSave="setGeofencingSave"
            @handleDelete="setDeleteEvent"
        ></LeafletMapLayer>
    </div>
</template>

<script>
import { drawTempData } from './tempData.js';
import AMapLayer from './component/a-map.vue';
import LeafletMapLayer from './component/leaflet-map.vue';
import { AREA_TYPE, SHAPE } from './config.js';
// import { EventBusEvent } from './event-bus-event';

const MAP_TYPE = {
    AMap: 'AMap',
    Leaflet: 'Leaflet'
};
export default {
    name: 'DrawMap',
    components: {
        AMapLayer,
        LeafletMapLayer
    },
    props: {
        useMap: {
            type: String,
            default: MAP_TYPE.AMap // 地图类型 Leaflet 、 AMap
        },
        dataList: {
            type: Array,
            default: () => [] //区域数据集合
        },
        openAdministrativeArea: {
            type: Boolean,
            default: true //打开新增行政区域按钮
        },
        openGeofencing: {
            type: Boolean,
            default: true //打开新增GIS地理围栏按钮
        }
    },
    data() {
        return {
            MAP_TYPE,
            originList: [] // 列表
        };
    },
    watch: {
        dataList: {
            // immediate: true,
            deep: true,
            handler(val) {
                this.initDataList(val);
            }
        }
    },
    computed: {},
    mounted() {
        this.initDataList(this.dataList);
    },
    methods: {
        // 获取列表数据
        initDataList(list) {
            console.log('【 initDataList-list 】-84', list);
            let arr = [...drawTempData]; // list
            // Leaflet地图 // 高德和Leaflet的经纬度读取顺序是 相反的
            if (this.useMap === MAP_TYPE.Leaflet) {
                this.originList = arr
                    .map(item => {
                        if (item.shape === SHAPE.POLYGON) {
                            item.path = item.path.map(subItem => {
                                return [subItem.lat, subItem.lng];
                            });
                        }
                        item.layerKey = item.areaId;
                        return item;
                    })
                    .filter(item => {
                        return item.areaType === AREA_TYPE.GIS;
                    });
                console.log('【  this.originList 】-75', this.originList);
            }
            if (this.useMap === MAP_TYPE.AMap) {
                this.originList = arr.map(item => {
                    if (item.shape === SHAPE.POLYGON) {
                        item.path = item.path.map(subItem => {
                            return [subItem.lng, subItem.lat];
                        });
                    }
                    item.layerKey = item.areaId;
                    return item;
                });
                console.log('【  this.originList 】-75', this.originList);
            }
        },
        // 发送删除事件
        setDeleteEvent(obj) {
            this.setSourceEvent('afterDelete', [obj]);
            // TODO:测试：模拟删除数据
            this.originList = this.originList.filter(item => {
                return item.areaId !== obj.areaId;
            });
        },
        // 保存行政区域
        setDistrictSave(obj) {
            console.log('【 setDistrictSave-obj 】-130', obj);
            this.setSourceEvent('saveDistrict', [obj]);
            // TODO:测试：模拟编辑和添加数据
            if (obj.areaId) {
                this.originList = this.originList.map(item => {
                    if (item.areaId === obj.areaId) {
                        return { ...item, ...obj };
                    } else {
                        return item;
                    }
                });
            } else {
                obj.areaId = Math.random();
                this.originList.unshift(obj); // this.initDistrictList()   // TODO:重新调取数据
            }
        },
        // 保存地理围栏
        setGeofencingSave(obj) {
            console.log('【setGeofencingSave- obj 】-154', obj);
            if (this.useMap === MAP_TYPE.Leaflet) {
                if (obj.shape === SHAPE.POLYGON) {
                    obj.path = obj.path.map(subItem => {
                        return { lat: subItem[0], lng: subItem[1] }; // [subItem.lat, subItem.lng];
                    });
                }
            }
            if (this.useMap === MAP_TYPE.AMap) {
                if (obj.shape === SHAPE.POLYGON) {
                    // obj.center = null;
                    obj.path = obj.path.map(subItem => {
                        return { lat: subItem[1], lng: subItem[0] }; // [subItem.lat, subItem.lng];
                    });
                }
            }
            console.log('【setGeofencingSave- obj2 】-154', obj);
            // 处理数据后发送
            this.setSourceEvent('saveGeofencing', [obj]);
            // TODO:测试：模拟编辑和添加数据
            if (obj.areaId) {
                this.originList = this.originList.map(item => {
                    if (item.areaId === obj.areaId) {
                        //
                        return { ...item, ...obj };
                    } else {
                        return item;
                    }
                });
            } else {
                obj.areaId = Math.random();
                this.originList.unshift(obj); // this.initDistrictList()   // TODO:重新调取数据
            }
        },
        // 发送事件
        setSourceEvent(eventName, parameters) {
            // const runtimeContextProvider = luban.core.getProvider('RuntimeContextProviderIdentity');
            // const runtimeContext = runtimeContextProvider.getRuntimeContext();
            // const sourceEventProvider = luban.core.getProvider('RuntimeSourceEventProviderIdentity');
            // sourceEventProvider.setSourceEvent(new EventBusEvent(eventName, parameters, runtimeContext), 'LB_EVENT_BUS');
            // //
            // const eventBusProvider = window.EventDriver.runtimeDataProviderHolder.getDataProvider('EventBusProviderIdentity');
            // eventBusProvider.emitGlobal(eventName, parameters);
        }
    }
};
</script>

<style lang="scss">
.map-wrap {
    position: relative;
    height: 100%;
    overflow: auto;
}
</style>
