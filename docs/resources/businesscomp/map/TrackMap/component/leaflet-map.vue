<!--
 * @Description: 车辆轨迹(leaflet)
 * @Date: 2023-09-25 18:02:44
 * @LastEditTime: 2023-10-12 11:48:24
-->

<template>
  <div class="leaflet-graspRoad">
    <!-- 地图容器 -->
    <div id="container"></div>
    <!-- 轨迹回放控制 -->
    <ControlBox
      v-if="actualPathArr && actualPathArr.length"
      @start="startAnimation()"
      @pause="pauseAnimation()"
      @resume="resumeAnimation()"
      @stop="stopAnimation()"
    ></ControlBox>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-polylinedecorator' // 给线条添加箭头图标
import './MovingMarker.js' //图标移动工具
import ControlBox from './control-box.vue'

const baseStyle = {
  weight: 8,
  opacity: 1 // 定义线的透明度
}
// 图层层级(弹窗的默认层级是700)
const Z_INDEX = {
  MARKER: 203,
  PASSED: 202,
  ACTUAL: 201,
  PLAN: 200
}
let carIcon = null
export default {
  name: 'LeafletGraspRoad',
  components: { ControlBox },
  props: {
    pathData: {
      type: Object,
      default: () => {} //轨迹信息
    },
    popupData: {
      type: Array,
      default: () => [] //弹窗信息
    }
  },
  data() {
    return {
      // 地图、插件
      map: null,
      mapCenter: [40.02404009136253, 116.50641060224784],
      marker: null, //车辆标记点
      pop: null,
      // 地图数据
      passedPolyline: null, //动画轨迹
      actualPathInfo: {}, // 轨迹车辆信息
      actualPathArr: [], //实际轨迹数据
      moveIndex: 0
    }
  },
  watch: {
    pathData: {
      // immediate: true,
      deep: true,
      handler(val) {
        // console.log('【 watch-pathData 】-94', val);
        this.drawPathLine(val)
      }
    }
  },
  beforeDestroy() {
    this.destroyMap()
  },
  async mounted() {
    await this.initMap() //DOM初始化完成进行地图初始化
    this.drawPathLine(this.pathData)
  },
  methods: {
    // 绘制车辆轨迹
    drawPathLine(obj = {}) {
      if (!this.map) {
        return
      }
      console.log('【 obj 】-97', obj)
      // 绘制实际轨迹
      const actualPath = obj.actualPath?.path || []
      this.actualPathInfo = actualPath
      this.actualPathArr = actualPath?.map((item) => {
        return [item.y, item.x] //顺序和高德地图的相反
      })
      const actualLine = L.polyline(this.actualPathArr, {
        pane: 'actualPane',
        ...baseStyle,
        color: '#7277eb'
      }).addTo(this.map)
      this.map.fitBounds(actualLine?.getBounds()) //自适应
      this.setMarker() //设置车辆图标
      // 绘制计划轨迹
      const planPath = obj.planPath?.path || []
      const planPathArr = planPath.map((item) => {
        return [item.y, item.x]
      })
      const planLine = L.polyline(planPathArr, {
        pane: 'planPane',
        ...baseStyle,
        color: '#0091ea'
      }).addTo(this.map)
      // 绘制带箭头的线条（路径）
      L.polylineDecorator(planLine, {
        patterns: [
          {
            offset: 30, // 箭头起始位置距离线条两端的距离
            repeat: 60, // 箭头重复的间隔
            symbol: L.Symbol.arrowHead({
              pixelSize: 4, // 箭头大小
              headAngle: 75, // 角度
              polygon: false,
              pathOptions: {
                pane: 'planPane',
                stroke: true,
                weight: 2, // 箭头粗细
                color: '#fff' // 箭头颜色
              }
            })
          }
        ]
      }).addTo(this.map)
    },
    // 车辆图标
    setMarker() {
      if (this.marker) {
        this.map.removeLayer(this.marker)
      }
      // L.Marker.movingMarker(路径、速度、配置)
      // this.marker = L.marker(this.actualPathArr[0], {
      this.marker = L.Marker.movingMarker(this.actualPathArr, 5000, {
        pane: 'markerPane',
        autostart: false,
        loop: false,
        rotate: true,
        autoRotation: true, //行驶过程中自动改变角度
        icon: carIcon // 图标设置
        // zIndexOffset:Z_INDEX.MARKER
      }).addTo(this.map)
      // 设置初始角度
      this.marker?.setRotationAngle(
        this.actualPathArr[0][0],
        this.actualPathArr[0][1],
        this.actualPathArr[1][0],
        this.actualPathArr[1][1]
      )
      // 绑定移动、移入、移出事件
      this.marker.on('move', this.markerMoving)
      this.marker.on('mouseover', this.markerMouseover)
      this.marker.on('mouseout', this.markerMouseout)
      this.marker.on('end', (e) => {
        console.log('结束绘制过程')
      })
      this.marker.on('remove', (e) => {
        console.log('被移除')
      })
      // this.marker.bindPopup( this.getPopup())
    },
    markerMoving(e) {
      // console.log('【 e 】-192', e);
      this.passedPolyline?.addLatLng(e.latlng) //绘制行驶路径
    },
    markerMouseover(e) {
      // console.log('【 路程结束 】-192', this.marker.isProgressEnd());
      this.moveIndex = e.sourceTarget._currentIndex
      const lastMoveIndex = this.actualPathArr.length - 2 //移动的最后一段
      if (this.moveIndex === lastMoveIndex && this.marker.isProgressEnd()) {
        this.moveIndex = this.actualPathArr.length - 1
      }
      const popupContent = this.getPopup(this.moveIndex)
      this.pop = L.popup({
        closeButton: false,
        className: 'custom-popup',
        offset: [0, -15],
        maxWidth: 300
      }).setContent(popupContent)
      this.pop?.setLatLng(e.latlng).openOn(this.map)
    },
    markerMouseout() {
      this.map.removeLayer(this.pop)
    },
    // 开始动画
    startAnimation() {
      if (!this.actualPathArr?.length) {
        return
      }
      // this.marker.isRunning()、this.marker.isEnded()
      // if (!this.marker.isRunning()) {
      //     // console.log('【 重新开始 】-298');
      this.passedPolyline && this.map.removeLayer(this.passedPolyline)
      this.passedPolyline = null
      // }
      // 初始化动画轨迹
      if (!this.passedPolyline) {
        // console.log('【 初始化动画轨迹 】-187');
        this.passedPolyline = L.polyline([], {
          pane: 'passedPane',
          ...baseStyle,
          color: '#AF5'
        }).addTo(this.map)
      }
      if (!this.marker.isEnded()) {
        this.marker.stop(0)
      }
      this.marker.start()
    },
    // 暂停动画
    pauseAnimation() {
      this.marker.pause()
    },
    // 继续动画
    resumeAnimation() {
      this.marker.resume()
    },
    // 停止动画
    stopAnimation() {
      this.marker.stop(0) // 不传值点暂停再点停止会跳至下一段??
    },
    //实例化弹窗
    getPopup(index) {
      const info = []
      const popInfo = this.actualPathInfo[index].info || {}
      this.popupData.forEach((item) => {
        const subInfo = []
        item.forEach((subItem) => {
          const subItemDiv = `<div class="sub-item" style="width:${100 / item.length}%">${subItem.label}：${
            popInfo[subItem.value] || '-'
          }</div>`
          subInfo.push(subItemDiv)
        })
        info.push(`<div class="popup-content__item">${subInfo.join('')}</div>`)
      })
      let title = '<span style="popup-title">车辆信息</span>'
      const content = info.join('')
      return this.createPopup(title, content)
    },
    //构建自定义信息窗体
    createPopup(title, content) {
      let popup = document.createElement('div')
      popup.className = 'popup-wrap' //可以通过下面的方式修改自定义窗体的宽高
      // 定义顶部标题
      let popupTop = document.createElement('div')
      let popupTitle = document.createElement('div')
      popupTop.className = 'popup-top'
      popupTitle.innerHTML = title
      popupTop?.appendChild(popupTitle)
      let closeX = document.createElement('img')
      closeX.src = 'https://webapi.amap.com/images/close2.gif'
      // closeX.onclick = this.closePopup(); //点击关闭
      // popupTop.appendChild(closeX);//关闭按钮
      popup?.appendChild(popupTop)
      // 定义中部内容
      let popupMiddle = document.createElement('div')
      popupMiddle.className = 'popup-content'
      popupMiddle.innerHTML = content
      popup?.appendChild(popupMiddle)
      // 定义底部内容
      // let popupBottom = document.createElement('div');
      // popupBottom.className = 'popup-bottom';
      // let sharp = document.createElement('img');
      // sharp.src = 'https://webapi.amap.com/images/sharp.png';
      // popupBottom.appendChild(sharp);
      // popup.appendChild(popupBottom);
      return popup
    },
    //关闭窗体
    closePopup() {
      this.map.removeLayer(this.pop)
    },
    initMap() {
      return new Promise((resolve) => {
        this.map = L.map('container', {
          zoomControl: false //隐藏自带的缩放控件;
          // zoom: 6,
          // minZoom: 3
          // doubleClickZoom: false, // 禁用双击放大
        })
        this.map.setView(this.mapCenter, 13)
        let tileLayer = L.tileLayer(
          'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
        )
        // tileLayer.setZIndex(10); //TODO
        tileLayer.addTo(this.map)
        carIcon = L.icon({
          pane: 'markerPane',
          iconUrl: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          //   iconUrl: require('../static/car.png'), //'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          iconSize: [20, 40],
          // className：设置一个class自定义图标的CSS属性
          // TODO:适用性？
          iconAnchor: [10, 10] //图标相对其左上角的坐标，默认情况下，图标的左上角是标记的位置（[0,0]）
          // popupAnchor: [-3, -76]//弹出的窗口的坐标，相对于图标的描点而言，将在这里打开弹框 （[0,0]）
          // shadowUrl: 'my-icon-shadow.png',
          // shadowSize: [68, 95]
          // shadowAnchor: [22, 94]
        })
        // 设置图层层级
        this.map.createPane('markerPane') //标识层级
        this.map.getPane('markerPane').style.zIndex = Z_INDEX.MARKER
        this.map.createPane('passedPane') //实际轨迹层级
        this.map.getPane('passedPane').style.zIndex = Z_INDEX.PASSED
        this.map.createPane('actualPane') //实际轨迹层级
        this.map.getPane('actualPane').style.zIndex = Z_INDEX.ACTUAL
        this.map.createPane('planPane') //计划轨迹层级
        this.map.getPane('planPane').style.zIndex = Z_INDEX.PLAN
        resolve()
      })
    },
    destroyMap() {
      this.marker?.off('move', this.markerMoving)
      this.marker?.off('mouseover', this.markerMouseover)
      this.marker?.off('mouseout', this.markerMouseout)
      this.map = null
    }
  }
}
</script>

<style lang="scss" scoped>
.leaflet-graspRoad {
  height: 100%;
  #container {
    z-index: 99;
    padding: 0px;
    margin: 0px;
    width: 100%;
    min-height: 600px;
    height: 100%;
  }
}
</style>

<style lang="scss">
.custom-popup {
  .leaflet-popup-content-wrapper {
    border-radius: 0px !important;
  }
  .leaflet-popup-content {
    margin: 0px !important;
  }
  .popup-wrap {
    // background: #fff;
    padding: 5px;
    text-align: left;
    width: 270px;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .popup-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      border-bottom: 1px solid #dcdfe6 !important;
    }
    .popup-content {
      margin-top: 5px;
      .popup-content__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .popup-bottom {
      position: relative;
      top: 0px;
      margin: 0 auto;
    }
  }
}
</style>
