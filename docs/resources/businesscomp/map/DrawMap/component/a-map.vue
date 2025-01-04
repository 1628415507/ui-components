<!--
 * @Description: 高德地图
 * @Date: 2023-09-12 18:18:34
 * @LastEditTime: 2025-01-03 18:08:35
-->

<template>
  <div class="amap-wrap">
    <!-- 地图容器 -->
    <div id="drawMapContainerId"></div>
    <!-- 左侧部分 -->
    <LeftBox
      :AMap="AMap"
      :shapeInfo="districtItem"
      :dataList="dataList"
      :openAdministrativeArea="openAdministrativeArea"
      :openGeofencing="openGeofencing"
      @addGeofencing="addDistrictItem"
      @confirmGeofencing="confirmGeofencing"
      @cancelGeofencing="cancelGeofencing"
      @addDistrict="addDistrictItem"
      @confirmDistrict="confirmDistrict"
      @cancelDistrict="cancelDistrict"
      @changeDistrict="drawDistrict"
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
import AMapLoader from '@amap/amap-jsapi-loader'
import LeftBox from './left-box.vue'
// 常量
import { themeColor, AREA_TYPE, SHAPE } from '../config.js'
import { AMAP_CONFIG } from '../../mapConfig.js'
const aMapKey = AMAP_CONFIG.key
window._AMapSecurityConfig = {
  serviceHost: 'http://127.0.0.1:9000/_AMapService',
  securityJsCode: AMAP_CONFIG.securityJsCode
  // securityJsCode: '0dadd5bc9a65f75344ee87d1e1dc5672' // // key:'bf2b2192907b6eb2a0363dd9beb0aa60',请求行政区域数据需要
}

const num = 16
const offset = -(num / 2)
let nodeIcon

// 绘制图层的公共样式配置
const baseStyle = {
  cursor: 'pointer', //绘制区域的箭头样式
  strokeColor: themeColor,
  strokeOpacity: 0.8,
  // strokeStyle: 'dashed', // strokeStyle还支持 solid
  strokeWeight: 4,
  fillColor: themeColor,
  fillOpacity: 0.4
}
export default {
  name: 'DrawAMap',
  components: {
    LeftBox
  },
  props: {
    dataList: {
      type: Array,
      default: () => [] //全部区域数据集合
    },
    openAdministrativeArea: {
      type: Boolean,
      default: false //打开新增行政区域按钮
    },
    openGeofencing: {
      type: Boolean,
      default: false //打开新增GIS地理围栏按钮
    }
  },
  data() {
    return {
      SHAPE,
      // 地图插件
      AMap: {},
      mouseTool: '',
      districtSearch: null,
      isInitComplete: false,
      // 弹框
      shapeVisible: false,
      // 列表
      districtItem: {},
      // 地理围栏
      shapeRadio: '',
      shape: '',
      // 图形编辑器
      layers: {}, //所有图层集合
      listLayerKeys: [],
      circleEditor: null,
      rectangleEditor: null,
      polygonEditor: null
    }
  },
  watch: {
    dataList: {
      // immediate: true,
      deep: true,
      handler(val) {
        // TODO:每次更新都会重新渲染??
        if (this.isInitComplete && !this.layers[val[0]?.layerKey]) {
          this.drawDistrictItem(val[0])
        }
        console.log('【 val 】-110', val)
        this.listLayerKeys = val.map((item) => item.layerKey.toString())
      }
    }
  },
  computed: {},
  mounted() {
    this.initMap() //DOM初始化完成进行地图初始化
    this.listLayerKeys = this.dataList.map((item) => item.layerKey.toString())
  },
  beforeDestroy() {
    this.destroyMap()
  },
  methods: {
    // beforeDraw() {},
    // 点击、编辑列表项
    drawDistrictItem(item = {}, isEdit = false) {
      console.log('【 item 】-118', item)
      this.districtItem = JSON.parse(JSON.stringify(item))
      this.closeEditor() //关闭编辑状态
      this.removeUnSaveLayer() // 移除未保存的图层
      const { layerKey, areaType, shape } = item
      // 点击转换显示、隐藏(只读&&不是编辑状态)
      if (this.layers[layerKey]?.layer && !isEdit && this.layers[layerKey]?.editable !== true) {
        if (areaType === AREA_TYPE.AREA && this.layers[layerKey]?.layer.length) {
          this.removeDistrict(layerKey)
          // this.districtItem = {};
          return
        }
        if (areaType === AREA_TYPE.GIS) {
          this.removeShape(shape, layerKey)
          // this.districtItem = {};
          return
        }
      }
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
      }
      this.layers[layerKey].editable = isEdit
      // 行政区域
      if (areaType === AREA_TYPE.AREA) {
        this.shapeVisible = false
        this.drawDistrict(item) //绘制区域
      }
      // 电子围栏
      if (areaType === AREA_TYPE.GIS) {
        this.shapeVisible = isEdit
        this.shape = shape
        if (isEdit) {
          this.shapeRadio = shape
        }
        if (shape === SHAPE.CIRCLE) {
          const circle = this.drawCircle(item.center, item.radius, isEdit)
          isEdit && this.editCircle(circle) //开启编辑
        }
        if (shape === SHAPE.RECTANGLE) {
          const rectangle = this.drawRectangle(item.southWest, item.northEast)
          isEdit && this.editRectangle(rectangle) //开启编辑
        }
        if (shape === SHAPE.POLYGON) {
          const polygon = this.drawPolygon(item.path)
          isEdit && this.editPolygon(polygon) //开启编辑
        }
      }
    },
    // setFitAllView() {
    //     this.map.setFitView(); //地图自适应
    //     // console.log('【 this.layers 】-141', this.layers);
    //     // let fitView = [];
    //     // for (let layerKey in this.layers) {
    //     //     if (Array.isArray(this.layers[layerKey].layer)) {
    //     //         fitView.push([...this.layers[layerKey].layer]);
    //     //     } else {
    //     //         fitView.push(this.layers[layerKey].layer);
    //     //     }
    //     // }
    //     // console.log('【 fitView 】-142', fitView);
    //     // this.map.setFitView(fitView); //地图自适应
    // },
    // 列表项-删除
    deleteDistrictItem(obj) {
      if (obj.areaType === AREA_TYPE.GIS) {
        this.removeShape(obj.shape, obj.layerKey) //删除对应图层
      } else {
        this.removeDistrict(obj.layerKey)
      }
      if (this.districtItem.areaId === obj.areaId) {
        this.shapeVisible = false
      }
      delete this.layers[obj.layerKey]
      this.$emit('handleDelete', obj)
    },
    // 列表项-添加
    addDistrictItem(newObj) {
      // this.clearLayers(); // TODO:新增是否清除地图上的所有覆盖物
      this.closeEditor()
      this.shapeRadio = ''
      this.districtItem = newObj
      this.shapeVisible = newObj.areaType === AREA_TYPE.GIS
    },
    // 移除区域轮廓
    removeDistrict(layerKey) {
      console.log('【 removeDistrict 】-127')
      this.layers[layerKey]?.layer?.forEach((item) => {
        item.setMap(null)
      })
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
        this.layers[layerKey].layer = []
      } else {
        this.layers[layerKey].layer = []
      }
    },
    // 绘制区域轮廓
    drawDistrict(item) {
      console.log('【 drawDistrict 】-207')
      const { layerKey, provinceCode, cityCode, districtCode } = item
      this.removeDistrict(layerKey) //清除上一个绘制区域
      // 重新获取数据绘制
      let adcode = '中国'
      let level = 'country'
      if (districtCode) {
        adcode = districtCode
        level = 'district'
      } else if (cityCode) {
        adcode = cityCode
        level = 'city'
      } else if (provinceCode) {
        adcode = provinceCode
        level = 'province'
      } else {
        adcode = '中国'
        level = 'country'
      }
      this.districtSearch.setLevel(level) //设置行政区级别
      this.districtSearch.setExtensions('all')
      this.districtSearch.search(adcode, (status, result) => {
        if (status === 'complete') {
          const data = result.districtList[0]
          const bounds = data.boundaries // 处理获取到的省市区数据
          if (bounds) {
            for (let i = 0, l = bounds.length; i < l; i++) {
              let polygon = new this.AMap.Polygon({
                map: this.map,
                path: bounds[i],
                strokeWeight: 1,
                strokeColor: themeColor,
                fillColor: themeColor, //#80d8ff',
                fillOpacity: 0.3
              })
              this.layers[layerKey].layer.push(polygon)
            }
            // this.map.setFitView(); //地图自适应
            this.map.setFitView(this.layers[layerKey].layer) //地图自适应
          }
        } else {
          this.$message.error(`获取行政区域数据失败`)
          console.error('获取省市区数据失败', result)
        }
      })
    },
    cancelDistrict() {
      this.removeDistrict(this.districtItem.layerKey)
    },
    // 行政区域-保存
    confirmDistrict(obj) {
      this.$emit('handleDistrictSave', obj)
    },
    // 地理围栏-保存
    confirmGeofencing(obj) {
      console.log('【 obj 】-268', obj)
      if (obj.areaId) {
        this.closeEditor()
      } else {
        this.removeShape(this.shape, this.districtItem.layerKey) // TODO:新的图层保存后是否清空对象
      }
      this.shape = ''
      this.shapeVisible = false
      this.$emit('handleGeofencingSave', obj)
    },
    // 地理围栏-取消
    cancelGeofencing() {
      // 未保存的图层-删除
      if (!this.districtItem.areaId) {
        this.removeShape(this.shape, this.districtItem.layerKey)
      }
      // this.removeUnSaveLayer();
      // this.closeEditor();
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
      // 圆形：绑定地图的点击事件触发
    },
    // 关闭所有的编辑器
    closeEditor() {
      this.circleEditor?.close() //结束编辑
      this.rectangleEditor?.close() //结束编辑
      this.polygonEditor?.close() //结束编辑
      this.mouseTool.close() // 关闭 MouseTool
    },
    // 移除指定图层
    removeLayer(layerKey) {
      if (!this.layers[layerKey]?.layer) {
        return
      }
      if (Array.isArray(this.layers[layerKey].layer)) {
        this.removeDistrict(layerKey)
      } else {
        this.layers[layerKey].layer.setMap(null) //移除圆形
        this.map.remove(this.layers[layerKey].layer)
        this.layers[layerKey].layer = null
      }
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
    // clearLayers() {
    //     for (let layerKey in this.layers) {
    //         if (Array.isArray(this.layers[layerKey].layer)) {
    //             this.layers[layerKey].layer = [];
    //         } else {
    //             this.layers[layerKey].layer = null;
    //         }
    //     }
    //     this.map?.clearMap(); // TODO清除地图上的所有覆盖物
    //     this.closeEditor();
    // },
    // 结束绘制
    removeShape(shape, layerKey) {
      // 删除对应图层
      this.removeLayer(layerKey)
      this.districtItem.center = {}
      this.districtItem.radius = null
      this.districtItem.southWest = null
      this.districtItem.northEast = null
      this.districtItem.path = null
      if (shape === SHAPE.CIRCLE) {
        // console.log('【 清除圆形 】-185');
        this.circleEditor?.close() //结束编辑
      }
      if (shape === SHAPE.RECTANGLE) {
        // console.log('【 清除矩形 】-185');
        this.rectangleEditor?.close() //结束编辑
        this.mouseTool.close() // 关闭 MouseTool
      }
      if (shape === SHAPE.POLYGON) {
        // console.log('【 清除多边形 】-185');
        this.polygonEditor?.close() //结束编辑
        this.mouseTool.close() // 关闭 MouseTool
      }
    },
    layerClick(e) {
      // console.log('【 layerClick 】-371', e);
      // const layerInfo = e.target.layerInfo;
      // console.log('【 layerInfo 】-369', layerInfo);
      // if (this.layers[layerInfo.layerKey].editable) {
      //     console.log('【 编辑状态 】-371');
      //     return;
      // } else {
      //     var infoWindow = new this.AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
      //     const infoWindowContent = `<div className="custom-infowindow input-card">
      //            <input id="lnglat2container" type="button" class="btn" value="删除" onclick="deleteLayers()"/>
      //         </div>`;
      //     infoWindow.setContent(infoWindowContent);
      //     infoWindow.open(this.map, e.lnglat);
      // }
    },
    // deleteLayers() {
    //     console.log('【 deleteLayers 】-393');
    // },
    startDrawCircle() {
      // 重新开始绘制
      // console.log('【 重新开始绘制 】-92');
      this.mouseTool.circle({
        ...baseStyle
      })
    },
    // 圆形-绘制(默认长度为100，且可编辑)
    drawCircle(centerInfo = {}, radius = 100, editable = true) {
      console.log('【 centerInfo 】-409', centerInfo)
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.CIRCLE, layerKey) // 先清空上一个绘制的圆形
      this.$set(this.districtItem, 'center', centerInfo)
      this.$set(this.districtItem, 'radius', radius)
      const { lng, lat } = centerInfo
      // 重新开始绘制
      const newCircle = new this.AMap.Circle({
        ...baseStyle,
        center: [lng, lat], // new AMap.LngLat("116.403322", "39.920255")
        radius,
        borderWeight: 3,
        strokeDasharray: [10, 10],
        zIndex: 50
      })
      // newCircle.layerInfo = this.districtItem;
      // newCircle.on('click', this.layerClick);
      this.layers[layerKey].layer = newCircle
      this.map.add(newCircle)
      this.map.setFitView([newCircle]) // 缩放地图到合适的视野级别
      return newCircle
    },
    editCircle(curShape = {}) {
      console.log('【 编辑圆 】-423', curShape)
      const layerKey = this.districtItem.layerKey
      // console.info('矩形绘制完成', curShape);
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
      }
      this.layers[layerKey].layer = curShape
      this.$set(this.districtItem, 'center', curShape.getCenter())
      this.$set(this.districtItem, 'radius', curShape.getRadius())
      // 开启编辑
      // console.log('【 marker 】-453', marker);
      this.circleEditor = new this.AMap.CircleEditor(this.map, this.layers[layerKey].layer, {
        editOptions: baseStyle,
        movePoint: {
          icon: nodeIcon,
          offset: new AMap.Pixel(offset, offset)
        },
        resizePoint: {
          icon: nodeIcon,
          offset: new AMap.Pixel(offset, offset)
        }
      })
      const newCircleEditor = this.circleEditor
      newCircleEditor.open() //开始绘制
      // 监听移动事件
      newCircleEditor.on('move', (event) => {
        console.log('【 event-move 】-436', event)
        const editedCircle = event.target
        this.districtItem.center = editedCircle.getCenter()
        this.districtItem.radius = editedCircle.getRadius()
      })
      // 监听调整事件
      newCircleEditor.on('adjust', (event) => {
        console.log('【 event-adjust 】-441', event)
        const editedCircle = event.target
        this.districtItem.center = editedCircle.getCenter()
        this.districtItem.radius = editedCircle.getRadius()
      })
      // 监听结束事件
      // newCircleEditor.on('end', event => {
      //     // console.log('【 圆形-编辑结束 】-113', event);
      //     // event.target 即为编辑后的圆形对象
      // });
    },
    // 开始绘制多边形
    startDrawPolygon() {
      const layerKey = this.districtItem.layerKey
      // 先清空上一个绘制的图形
      this.removeShape(SHAPE.POLYGON, layerKey) //结束绘制,清空图形
      // 重新开始绘制
      this.mouseTool.polygon({
        ...baseStyle
      })
    },
    drawPolygon(path) {
      const layerKey = this.districtItem.layerKey
      // 先清空上一个绘制的多边形
      this.removeShape(SHAPE.POLYGON, layerKey) //结束绘制,清空图形
      let polygon = new this.AMap.Polygon({
        ...baseStyle,
        path: path,
        strokeDasharray: [5, 5]
      })
      // polygon.layerInfo = this.districtItem;
      // polygon.on('click', this.layerClick);
      this.layers[layerKey].layer = polygon
      this.map.add(polygon)
      this.map.setFitView([polygon]) // 缩放地图到合适的视野级别
      return polygon
    },
    // 编辑多边形
    editPolygon(curShape = {}) {
      console.info('多边形绘制完成', curShape)
      const layerKey = this.districtItem.layerKey
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
      }
      this.layers[layerKey].layer = curShape
      this.$set(this.districtItem, 'path', curShape?._opts?.path)
      this.map.setFitView([curShape]) // 缩放地图到合适的视野级别
      // 开始编辑
      this.polygonEditor = new this.AMap.PolyEditor(this.map, this.layers[layerKey].layer, {
        editOptions: baseStyle,
        controlPoint: {
          strokeColor: themeColor
        },
        midControlPoint: {
          fillColor: themeColor // 节点的边线颜色
        }
      })
      this.polygonEditor.open()
      this.polygonEditor.on('addnode', (event) => {
        console.log('【 event 】-523', event)
        this.$set(this.districtItem, 'path', event?.target._opts?.path)
        // console.log('【 添加多边形节点 】-486', event);
      })

      this.polygonEditor.on('adjust', (event) => {
        this.$set(this.districtItem, 'path', event?.target._opts?.path)
        // console.log('【 调整多边形 】-486', event);
      })
      this.polygonEditor.on('end', (event) => {
        // console.log('【 调整多边形结束 】-486', event);
        // event.target 即为编辑后的矩形对象
      })
    },
    // 开始绘制矩形
    startDrawRectangle() {
      // 清除上一个矩形
      // this.removeShape(SHAPE.RECTANGLE, this.districtItem.layerKey); //结束绘制,清空图形
      // 重新开始绘制
      // console.log('【 重新开始绘制 】-92');
      this.mouseTool.rectangle({
        ...baseStyle
      })
    },
    // 绘制矩形
    drawRectangle(southWest, northEast) {
      console.log('【 southWest, northEast 】-469', southWest, northEast)
      const layerKey = this.districtItem.layerKey
      this.removeShape(SHAPE.RECTANGLE, layerKey) //结束绘制,清空图形
      const sW = new this.AMap.LngLat(southWest.lng, southWest.lat)
      const nW = new this.AMap.LngLat(northEast.lng, northEast.lat)
      const bounds = new this.AMap.Bounds(sW, nW)
      let rectangle = new this.AMap.Rectangle({
        bounds: bounds,
        ...baseStyle,
        strokeDasharray: [30, 10],
        zIndex: 50
      })
      // rectangle.layerInfo = this.districtItem;
      // rectangle.on('click', this.layerClick);
      this.map.add(rectangle)
      this.map.setFitView([rectangle]) // 缩放地图到合适的视野级别
      this.layers[layerKey].layer = rectangle
      return rectangle
    },
    // 绘制矩形完成
    editRectangle(curShape = {}) {
      console.log('【 curShape 】-547', curShape)
      const layerKey = this.districtItem.layerKey
      // console.info('矩形绘制完成', curShape);
      if (!this.layers[layerKey]) {
        this.layers[layerKey] = {}
      }
      this.layers[layerKey].layer = curShape
      const { northEast, southWest } = curShape?._opts?.bounds
      this.$set(this.districtItem, 'northEast', northEast)
      this.$set(this.districtItem, 'southWest', southWest)
      this.map.setFitView([curShape]) // 缩放地图到合适的视野级别
      // 开始编辑
      this.rectangleEditor = new this.AMap.RectangleEditor(this.map, this.layers[layerKey].layer, {
        editOptions: baseStyle,
        southWestPoint: {
          icon: nodeIcon,
          offset: new AMap.Pixel(offset, offset)
        },
        northEastPoint: {
          icon: nodeIcon,
          offset: new AMap.Pixel(offset, offset)
        }
      })
      this.rectangleEditor.open() //开始编辑矩形
      this.rectangleEditor.on('adjust', (event) => {
        // console.log('【 调整矩形 】-486', event);
        const { northEast, southWest } = event?.bounds
        this.$set(this.districtItem, 'northEast', northEast)
        this.$set(this.districtItem, 'southWest', southWest)
      })
      // this.rectangleEditor.on('end', event => {
      //     // console.log('【 调整矩形结束 】-486', event);
      //     // event.target 即为编辑后的矩形对象
      // });
    },
    // 监听地图单击
    // mapClick(e) {
    // const { lng, lat } = e.lnglat; // 触发事件的地理坐标，AMap.LngLat 类型
    // if (this.shape === SHAPE.CIRCLE && !this.layers[this.districtItem.layerKey]?.layer) {
    //     this.layers[this.districtItem.layerKey] = {};
    //     this.drawCircle(e.lnglat);
    // }
    // var target = e.target;// 触发事件的对象
    // var pixel = e.pixel;// 触发事件的像素坐标，AMap.Pixel 类型
    // var type = e.type;// 触发事件类型
    // },
    // 初始化绘制工具
    initMouseTool() {
      // this.map.on('click', this.mapClick);
      this.mouseTool = new this.AMap.MouseTool(this.map)
      this.mouseTool.on('draw', (event) => {
        // console.log('【 结束绘制======= 】-474', event);
        this.mouseTool.close() // 关闭 MouseTool
        if (this.shape === SHAPE.CIRCLE) {
          this.editCircle(event?.obj)
        }
        if (this.shape === SHAPE.RECTANGLE) {
          this.editRectangle(event?.obj)
        }
        if (this.shape === SHAPE.POLYGON) {
          this.editPolygon(event?.obj)
        }
      })
    },
    initMap() {
      AMapLoader.load({
        key: aMapKey, //bf2b2192907b6eb2a0363dd9beb0aa60 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        plugins: [
          'AMap.DistrictSearch', //区域查询
          'AMap.MouseTool', //绘制图形
          'AMap.CircleEditor', //编辑圆形
          'AMap.RectangleEditor', //编辑矩形
          'AMap.PolyEditor', //编辑多边形
          'AMap.Scale', //比例尺
          'AMap.ToolBar' //缩放控件
          // 'AMap.Geocoder',
          // 'AMap.Driving',
          // 'AMap.AutoComplete',
          // 'AMap.PlaceSearch',
          // 'AMap.InfoWindow'
        ]
      })
        .then((AMap) => {
          this.AMap = AMap
          // ---------- 初始化地图容器id ----------
          this.map = new AMap.Map('drawMapContainerId', {
            resizeEnable: true,
            zoom: 12 //地图显示的缩放级别
          })
          this.map.addControl(new AMap.Scale())
          this.map.addControl(new AMap.ToolBar())
          // ---------- 初始行政区域查询 ----------
          this.districtSearch = new this.AMap.DistrictSearch({
            subdistrict: 1, //显示下级行政区级数，1表示返回下一级行政区
            showbiz: false //最后一级返回街道信息
            // extensions: 'all' //返回行政区边界坐标组等具体信息
            // level: 'country'   //[ city ,] 关键字对应的行政区级别，country表示国家
          })
          // ---------- 初始化绘制工具 ----------
          this.initMouseTool() //
          this.isInitComplete = true
          // this.$nextTick(() => {
          //     console.log('【 加载第一个 】-120');
          this.drawDistrictItem(this.dataList[0], false)
          // });
          // ---------- 设置公共节点样式 ----------
          nodeIcon = new AMap.Icon({
            size: new AMap.Size(num, num),
            image: require('../static/node.png'),
            imageSize: new AMap.Size(num, num),
            imageOffset: new AMap.Pixel(0, 0) //解决图片只显示一半的问题
          })
        })
        .catch((e) => {
          console.log('【 地图初始化失败 】-630', e)
        })
    },
    destroyMap() {
      this.map?.destroy()
      this.map.off('click', this.mapClick)
      // console.log('地图已销毁');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.amap-wrap {
  height: 100%;
  // 地图容器
  #drawMapContainerId {
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
    text-align: center;
  }
}
</style>
