<!--
 * @Description: 全程轨迹（leaflet）
 * @Date: 2023-10-19 10:03:38
 * @LastEditTime: 2023-11-15 17:54:42
-->

<template>
  <div class="leaflet-graspRoad">
    <div id="routeMapContainerId"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-polylinedecorator' // 给线条添加箭头图标
import { getRandomColor } from './util.js'
import markerImg from '../static/marker.png'

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
let markerIcon = null
const imgW = 8
const imgH = 8
export default {
  name: 'LeafletRoad',
  components: {},
  props: {
    pathData: {
      type: Array,
      default: () => [] // 轨迹信息
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
      pop: null
      // 地图数据
    }
  },
  watch: {
    pathData: {
      // immediate: true,
      deep: true,
      handler(val) {
        // console.log('【 watch-pathData 】-94', val);
        this.drawLineGroup(val)
      }
    }
  },
  beforeDestroy() {
    this.destroyMap()
  },
  async mounted() {
    await this.initMap() //DOM初始化完成进行地图初始化
    this.drawLineGroup(this.pathData)
  },
  methods: {
    // 获取随机颜色
    drawLineGroup(pathGroup) {
      console.log('【 pathGroup 】-79', pathGroup)
      if (!this.map) {
        return
      }
      pathGroup.forEach((item) => {
        this.drawLine(item)
      })
    },
    // 绘制车辆轨迹
    drawLine(list) {
      // 绘制实际轨迹
      const linePath = list || []
      const linePathArr = linePath?.map((item) => {
        return [item.y, item.x] //顺序和高德地图的相反
      })
      const color = this.pathData.length > 1 ? getRandomColor() : '#036564'

      const routeLine = L.polyline(linePathArr, {
        pane: 'linePane',
        ...baseStyle,
        color
      }).addTo(this.map)
      // 绘制带箭头的线条（路径）
      L.polylineDecorator(routeLine, {
        patterns: [
          {
            offset: 30, // 箭头起始位置距离线条两端的距离
            repeat: 60, // 箭头重复的间隔
            symbol: L.Symbol.arrowHead({
              pixelSize: 4, // 箭头大小
              headAngle: 75, // 角度
              polygon: false,
              pathOptions: {
                pane: 'linePane',
                stroke: true,
                weight: 2, // 箭头粗细
                color: '#fff' // 箭头颜色
              }
            })
          }
        ]
      }).addTo(this.map)
      // this.routeLineGroup.push(routeLine)
      this.map.fitBounds(routeLine?.getBounds()) //自适应
      this.setMarker(linePath) //设置车辆图标
    },
    // 图标
    setMarker(linePathInfo) {
      console.log('【 setMarker 】-102')
      linePathInfo.forEach((item, index) => {
        // console.log('【 item 】-103', item);
        const marker = L.marker([item.y, item.x], {
          pane: 'markerPane',
          icon: markerIcon // 图标设置
        }).addTo(this.map)
        // // 绑定移动、移入、移出事件
        marker.info = item
        marker.index = index
        marker.on('mouseover', this.markerMouseover)
        // marker.on('mouseout', this.markerMouseout);
      })
    },
    markerMouseover(e) {
      console.log('【 e 】-146', e)
      const curMarker = e.target
      const popupContent = this.getPopup(curMarker.info)
      this.pop = L.popup({
        closeButton: false,
        className: 'custom-popup',
        offset: [0, 0],
        maxWidth: 300
      }).setContent(popupContent)
      this.pop?.setLatLng(e.latlng).openOn(this.map)
    },
    markerMouseout() {
      this.map.removeLayer(this.pop)
    },
    //实例化弹窗
    getPopup(popInfo) {
      const info = []
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
      // let popupTop = document.createElement('div');
      // let popupTitle = document.createElement('div');
      // popupTop.className = 'popup-top';
      // popupTitle.innerHTML = title;
      // popupTop.appendChild(popupTitle);
      // let closeX = document.createElement('img');
      // closeX.src = 'https://webapi.amap.com/images/close2.gif';
      // // closeX.onclick = this.closePopup(); //点击关闭
      // // popupTop.appendChild(closeX);//关闭按钮
      // popup.appendChild(popupTop);
      // 定义中部内容
      let popupMiddle = document.createElement('div')
      popupMiddle.className = 'popup-content'
      popupMiddle.innerHTML = content
      popup.appendChild(popupMiddle)
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
        this.map = L.map('routeMapContainerId', {
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
        markerIcon = L.icon({
          pane: 'markerPane',
          iconUrl: markerImg, // require('../static/marker.png'), //'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
          iconSize: [imgW, imgW],
          iconAnchor: [imgW / 2, imgW / 2]
        })
        // 设置图层层级
        this.map.createPane('markerPane') //标识层级
        this.map.getPane('markerPane').style.zIndex = Z_INDEX.MARKER
        this.map.createPane('linePane') //实际轨迹层级
        this.map.getPane('linePane').style.zIndex = Z_INDEX.ACTUAL
        resolve()
      })
    },
    destroyMap() {
      // this.marker?.off('move', this.markerMoving);
      // this.marker?.off('mouseover', this.markerMouseover);
      // this.marker?.off('mouseout', this.markerMouseout);
      this.map = null
    }
  }
}
</script>

<style lang="scss" scoped>
.leaflet-graspRoad {
  height: 100%;
  #routeMapContainerId {
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
    padding: 0;
    border-radius: 0px !important;
    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.2) !important;
  }
  .leaflet-popup-content {
    margin: 0px !important;
  }
  .leaflet-popup-tip-container {
    display: none;
  }
  .popup-wrap {
    // background: #fff;
    padding: 0px;
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
