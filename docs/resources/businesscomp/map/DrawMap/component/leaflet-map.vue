<!--
 * @Description: 区域划分(leftlet)
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 18:15:04
-->

<template>
  <div class="leaflet-wrap">
    <!-- 地图容器 -->
    <div id="mapContainer"></div>
    <!-- 左侧部分 -->
    <LeftBox
      :shapeInfo="districtItem"
      :dataList="dataList"
      :openGeofencing="openGeofencing"
      @addGeofencing="addDistrictItem"
      @confirmGeofencing="confirmGeofencing"
      @cancelGeofencing="cancelGeofencing"
      @clickItem="drawDistrictItem"
      @deleteListItem="deleteDistrictItem"
    ></LeftBox>
    <div v-if="shapeVisible" class="shape-wrap">
      <el-radio-group v-model="shapeRadio" @change="changeShape">
        <el-radio-button :label="SHAPE.CIRCLE">圆形</el-radio-button>
        <el-radio-button :label="SHAPE.POLYGON">多边形</el-radio-button>
        <el-radio-button :label="SHAPE.RECTANGLE">矩形</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
// import '../static/leaflet/leaflet.css';

import L from 'leaflet'
// Leaflet的绘图插件
import '@geoman-io/leaflet-geoman-free' //  npm i @geoman-io/leaflet-geoman-free
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
// import 'leaflet.pm';
// import 'leaflet.pm/dist/leaflet.pm.css';

// 组件
import LeftBox from './left-box.vue'
import GeofencingBox from './geofencing-box.vue'
// 常量
import { themeColor, AREA_TYPE, SHAPE } from '../config.js'
const baseStyle = {
  cursor: 'pointer', //绘制区域的箭头样式
  color: themeColor, // 边线颜色
  weight: 4, // 边线宽度
  fillColor: themeColor, // 填充颜色
  fillOpacity: 0.4 // 填充透明度
}
const editStyle = {
  templineStyle: {
    // 临时线段的样式
    color: themeColor, // 线段颜色
    weight: 4 // 线段宽度
  },
  hintlineStyle: {
    // 提示线段的样式
    color: themeColor, // 线段颜色
    weight: 4 // 线段宽度
  }
}
// 绘制图层的公共样式配置
export default {
  name: 'DrawLeaflet',
  components: {
    LeftBox,
    GeofencingBox
  },
  props: {
    dataList: {
      type: Array,
      default: () => {} //全部区域数据集合
    },
    openGeofencing: {
      type: Boolean,
      default: false //打开新增GIS地理围栏按钮
    }
  },
  data() {
    return {
      SHAPE,
      // 地图\图层
      isInitComplete: false,
      map: null,
      mapCenter: [40.02404009136253, 116.50641060224784], //TODO
      layers: {}, //所有图层集合
      listLayerKeys: [],
      // 弹框
      shapeVisible: false,
      shapeRadio: '',
      shape: '',
      // 列表
      districtItem: {}
    }
  },
  watch: {
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('【 val 】-106', val)
        // TODO:每次更新都会重新渲染??
        // if (this.isInitComplete && !this.layers[val[0]?.layerKey]) {
        //   this.drawDistrictItem(val[0])
        // }
        this.listLayerKeys = val.map((item) => item.layerKey.toString())
      }
    }
  },
  computed: {},
  mounted() {
    this.initMap() //DOM初始化完成进行地图初始化
    this.listLayerKeys = this.dataList.map((item) => item.layerKey.toString())
    // console.log('【 加载列表第一个 】-120');
    this.drawDistrictItem(this.dataList[0], false)
  },
  beforeDestroy() {
    this.destroyMap()
  },
  methods: {
    // 列表项-点击、编辑
    drawDistrictItem(item = {}, isEdit = false) {
      if (item.areaType !== AREA_TYPE.GIS) {
        return
      }
      this.districtItem = JSON.parse(JSON.stringify(item))
      const { layerKey, shape } = item
      this.closeEditor() //关闭编辑状态
      this.removeUnSaveLayer() // 移除未保存的图层
      // 点击转换显示、隐藏
      if (this.layers[layerKey]?.layer && !isEdit && this.layers[layerKey]?.editable !== true) {
        this.removeShape(shape, layerKey)
        // this.districtItem = {};
        return
      }
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
      }
      this.layers[layerKey].editable = isEdit
      this.shape = shape
      this.shapeVisible = isEdit
      if (isEdit) {
        this.shapeRadio = shape
      }
      if (shape === SHAPE.CIRCLE) {
        this.drawCircle(item.center, item.radius, isEdit)
      }
      if (shape === SHAPE.RECTANGLE) {
        const { southWest, northEast } = item
        this.drawRectangle(southWest, northEast, isEdit)
      }
      if (shape === SHAPE.POLYGON) {
        this.drawPolygon(item.path, isEdit)
      }
    },
    // 列表项-删除
    deleteDistrictItem(obj) {
      this.removeShape(obj.shape, obj.layerKey) //删除对应图层
      if (this.districtItem.areaId === obj.areaId) {
        this.shapeVisible = false
      }
      delete this.layers[obj.layerKey]
      this.$emit('handleDelete', obj)
    },
    // 列表项-新增
    addDistrictItem(newObj) {
      // this.clearLayers(); // TODO:新增是否清除地图上的所有覆盖物
      this.closeEditor()
      this.shapeRadio = ''
      this.districtItem = newObj
      this.shapeVisible = true
    },
    // 关闭所有的编辑器
    closeEditor() {
      for (let layerKey in this.layers) {
        this.layers[layerKey].layer?.pm.disable() //结束编辑
      }
      // this.map.pm.disableDraw('Circle'); //结束编辑
      // this.map.pm.disableDraw('Rectangle');
      // this.map.pm.disableDraw('Polygon');
    },
    // 移除指定图层
    removeLayer(layerKey) {
      if (!this.layers[layerKey]?.layer) {
        return
      }
      this.layers[layerKey].layer.pm.disable() //结束编辑
      this.map.removeLayer(this.layers[layerKey].layer)
      this.layers[layerKey].layer = null
    },
    // 移除未保存的图层
    removeUnSaveLayer() {
      for (let layerKey in this.layers) {
        if (!this.listLayerKeys.includes(layerKey.toString())) {
          this.removeLayer(layerKey)
          delete this.layers[layerKey]
        }
      }
    },
    // 清除所有图层
    clearLayers() {
      for (let layerKey in this.layers) {
        this.removeLayer(layerKey)
      }
      this.districtItem.center = {}
      this.districtItem.southWest = null
      this.districtItem.northEast = null
      this.districtItem.path = null
      this.closeEditor()
    },
    // 地理围栏-保存
    confirmGeofencing(obj) {
      if (obj.areaId) {
        this.closeEditor()
      } else {
        this.removeShape(this.shape, this.districtItem.layerKey)
      }
      this.shape = ''
      this.shapeVisible = false
      this.$emit('handleGeofencingSave', obj)
    },
    // 地理围栏-取消
    cancelGeofencing() {
      if (!this.districtItem.areaId) {
        this.removeShape(this.shape, this.districtItem.layerKey)
      }
      // this.removeUnSaveLayer();
      this.layers[this.districtItem.layerKey]?.layer?.pm.disable() //结束编辑
      this.shape = ''
      this.shapeVisible = false
    },
    // 切换绘制图形
    changeShape(val) {
      this.removeShape(this.shape, this.districtItem.layerKey) //清除上一个绘制的图形
      this.shape = val
      this.districtItem.shape = val
      if (this.shape === SHAPE.CIRCLE) {
        this.startDrawCircle()
      }
      if (this.shape === SHAPE.RECTANGLE) {
        this.startDrawRectangle()
      }
      if (this.shape === SHAPE.POLYGON) {
        this.startDrawPolygon()
      }
    },
    // 移出指定图形
    removeShape(shape, layerKey) {
      // console.log('【 开始清除..... 】-456');
      this.removeLayer(layerKey)
      this.districtItem.center = {}
      this.districtItem.southWest = null
      this.districtItem.northEast = null
      this.districtItem.path = null
    },
    // 圆形-开始绘制
    startDrawCircle() {
      this.removeShape(SHAPE.CIRCLE, this.districtItem.layerKey) // 清除上一个圆形
      this.map.pm.enableDraw('Circle', {
        ...editStyle,
        snappable: true,
        snapDistance: 20
      })
    },
    // 修改半径颜色( // TODO :能否通过属性设置)
    setRadiusColor() {
      const elements = document.querySelectorAll('.leaflet-interactive')
      // console.log('【 elements 】-328', elements);
      // 遍历元素集合
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        // 检查元素的类名列表中是否包含目标类名
        if (element.classList.contains('leaflet-interactive')) {
          // 修改元素的属性值
          element.setAttribute('stroke', themeColor)
        }
      }
    },
    // 圆形-绘制(默认长度为100，且可编辑)
    drawCircle(centerInfo, radius = 100, editable) {
      console.log('【 drawCircle 】-235', centerInfo, radius, editable)
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.CIRCLE, layerKey) // 先清空上一个绘制的圆形
      this.$set(this.districtItem, 'center', centerInfo)
      this.$set(this.districtItem, 'radius', radius)
      const { lat, lng } = centerInfo
      const center = [lat, lng]
      // 重新开始绘制
      this.layers[layerKey].layer = L.circle(center, {
        ...baseStyle,
        radius: radius
      }).addTo(this.map)
      // this.map.setView(center, 15); //
      this.map.fitBounds(this.layers[layerKey].layer.getBounds()) //缩放地图到合适的视野级别
      // 开启编辑
      editable && this.editShape(this.layers[layerKey].layer, SHAPE.CIRCLE)
    },
    editShape(targetShape = {}, shape) {
      // console.log('【 开始编辑 】-450', targetShape);
      if (shape === SHAPE.CIRCLE) {
        this.$set(this.districtItem, 'center', targetShape.getLatLng())
        this.$set(this.districtItem, 'radius', targetShape.getRadius())
      }
      if (shape === SHAPE.RECTANGLE) {
        const { _northEast, _southWest } = targetShape?._bounds
        this.$set(this.districtItem, 'northEast', _northEast)
        this.$set(this.districtItem, 'southWest', _southWest)
      }
      if (shape === SHAPE.POLYGON) {
        const path = targetShape?._latlngs[0]?.map((item) => {
          return [item.lat, item.lng]
        })
        this.$set(this.districtItem, 'path', path)
      }
      targetShape.pm.enable({
        allowSelfIntersection: shape === SHAPE.POLYGON, // 设置是否允许自交叉
        dragHandleOptions: {
          draggable: true // 设置拖动手柄选项
        },
        editOptions: {
          draggable: true // 设置编辑选项
        }
      })
      this.setRadiusColor() // TODO:修改半径颜色
      targetShape.on('pm:edit', (e) => {
        const editLayer = e.target || {}
        // console.log('【 编辑... 】-463', e);
        if (shape === SHAPE.CIRCLE) {
          // const latlng = editLayer._latlng;
          // const radius = editLayer._radius;
          this.districtItem.center = editLayer.getLatLng()
          this.districtItem.radius = editLayer.getRadius()
          // // console.log('【 编辑圆形 】-387', lat, lng, this.districtItem);
        }
        if (shape === SHAPE.RECTANGLE) {
          const { _northEast, _southWest } = editLayer._bounds
          this.$set(this.districtItem, 'northEast', _northEast)
          this.$set(this.districtItem, 'southWest', _southWest)
        }
        if (shape === SHAPE.POLYGON) {
          const path = editLayer._latlngs[0]?.map((item) => {
            return [item.lat, item.lng]
          })
          this.$set(this.districtItem, 'path', path)
        }
      })
    },
    // 多边形-开始绘制
    startDrawPolygon() {
      this.removeShape(SHAPE.POLYGON, this.districtItem.layerKey) //清空图形上一个图形
      // 重新开始绘制
      this.map.pm.enableDraw('Poly', {
        ...editStyle,
        snappable: true,
        snapDistance: 20
      })
    },
    // 多边形-绘制
    drawPolygon(latlngs, editable) {
      console.log('【 latlngs 】-364', latlngs)
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.POLYGON, layerKey) //结束绘制,清空图形
      this.layers[layerKey].layer = L.polygon(latlngs, baseStyle).addTo(this.map)
      console.log('【  this.layers[layerKey].layer  】-367', this.layers[layerKey].layer)
      this.map.fitBounds(latlngs)
      // 编辑
      editable && this.editShape(this.layers[layerKey].layer, SHAPE.POLYGON)
    },
    // 矩形-开始绘制
    startDrawRectangle() {
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.RECTANGLE, layerKey) // 清除上一个矩形
      // 重新开始绘制
      this.map.pm.enableDraw('Rectangle', {
        snappable: true,
        snapDistance: 20,
        pathOptions: baseStyle
      })
    },
    // 矩形-绘制
    drawRectangle(southWest, northEast, editable) {
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.RECTANGLE, layerKey) //结束绘制,清空图形
      this.$set(this.districtItem, 'northEast', northEast)
      this.$set(this.districtItem, 'southWest', southWest)
      // 重新开始绘制
      const bounds = [southWest, northEast]
      this.layers[layerKey].layer = L.rectangle(bounds, baseStyle).addTo(this.map)
      this.map.fitBounds(bounds)
      // 开启编辑
      editable && this.editShape(this.layers[layerKey].layer, SHAPE.RECTANGLE)
    },
    initMap() {
      this.map = L.map(
        'mapContainer',
        { zoomControl: false } //隐藏自带的缩放控件;
      )
      // 添加缩放控件
      L.control
        .zoom({
          position: 'bottomright'
        })
        .addTo(this.map)
      // 添加比例尺
      L.control
        .scale({
          position: 'bottomleft',
          metric: true, //是否显示公制单位（米、千米）。默认为 true
          imperial: false // 是否显示英制单位（英尺、英里）
        })
        .addTo(this.map)

      this.map.setView(this.mapCenter, 13)
      const OSMUrl = 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      let tileLayer = L.tileLayer(OSMUrl)
      tileLayer.addTo(this.map)
      // 绘制事件监听
      // this.map.on('pm:drawstart', e => {
      //     // console.log(e, '绘制开始第一个点');
      // });
      // this.map.on('pm:drawend', e => {
      //     // console.log(e, '禁⽌绘制、绘制结束');
      // });
      this.isInitComplete = true
      this.map.on('pm:create', (e) => {
        console.log('initMap-绘制完成', e)
        const layerKey = this.districtItem.layerKey
        this.removeShape(SHAPE.CIRCLE, layerKey) // 先清空上一个绘制的圆形
        if (!this.layers[layerKey]) {
          this.layers[layerKey] = {}
        }
        const layer = e.layer
        layer.setStyle(baseStyle)
        this.layers[layerKey].layer = layer
        //   圆形
        if (e.shape === 'Circle') {
          this.editShape(this.layers[layerKey].layer, SHAPE.CIRCLE)
        }
        // 矩形
        if (e.shape === 'Rectangle') {
          this.editShape(this.layers[layerKey].layer, SHAPE.RECTANGLE)
        }
        // 多边形
        if (e.shape === 'Polygon') {
          this.editShape(this.layers[layerKey].layer, SHAPE.POLYGON)
        }
      })
      // 清除图层时触发
      // this.map.on('pm:globalremovalmodetoggled', e => {
      //     // console.log(e, '清除图层时调用');
      // });
    },
    destroyMap() {
      // this.map && this.map.destroy();
      // // console.log('地图已销毁');
    }
  }
}
</script>

<style lang="scss">
$topIndex: 999;
.v-modal {
  background: transparent !important;
}
.leaflet-wrap {
  height: 100%;
  // 地图容器
  #mapContainer {
    padding: 0px;
    margin: 0px;
    width: 100%;
    min-height: 600px;
    height: 100%;
  }
  // 图形选择
  .shape-wrap {
    position: fixed;
    bottom: 20px;
    width: 100%;
    z-index: $topIndex - 1;
    text-align: center;
  }
  // TODO 覆盖原生样式
  .leaflet-pane {
    .marker-icon {
      border: 1px solid #036564 !important;
    }
  }
}
</style>
