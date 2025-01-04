<!--
 * @Description: 全程轨迹-高德
 * @Date: 2023-09-25 18:02:44
 * @LastEditTime: 2024-01-08 14:25:15
-->

<template>
  <div class="amap-graspRoad">
    <div id="routeMapContainerId"></div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { getRandomColor } from './util.js'
import { AMAP_CONFIG } from '../../mapConfig.js'
import markerImg from '../static/marker.png'
// 地图对象
let AMap = null
let markerIcon = null
const imgW = 8
const imgH = 8
const amapKey = AMAP_CONFIG.key // '351871ec560c6c34e9bbe14131d01696';
window._AMapSecurityConfig = {
  serviceHost: 'http://127.0.0.1:9000/_AMapService',
  securityJsCode: AMAP_CONFIG.securityJsCode
}
const baseStyle = {
  strokeWeight: 7,
  strokeOpacity: 1
}
export default {
  name: 'AMapRoad',
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
      graspRoad: null,
      pop: null,
      marker: null //车辆标记点
      // 地图数据
    }
  },
  watch: {
    pathData: {
      // immediate: true,
      deep: true,
      handler(val) {
        console.log('【 watch-pathData 】-94', val)
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
      if (!AMap || !this.map) {
        return
      }
      pathGroup.forEach((item) => {
        this.drawLine(item)
      })
      this.$nextTick(() => {
        this.map.setFitView()
      })
    },
    // 绘制轨迹
    drawLine(list) {
      // 绘制实际轨迹
      const linePath = list || []
      let linePathArr = linePath.map((item) => {
        return [item.x, item.y]
      })
      const color = this.pathData.length > 1 ? getRandomColor() : '#036564'
      const routeLine = new AMap.Polyline({
        ...baseStyle,
        path: linePathArr,
        showDir: true, //显示箭头
        strokeColor: color
      })
      this.map.add(routeLine)
      this.setMarker(linePath) //设置骑车图标
    },
    // 车辆图标
    setMarker(linePathInfo) {
      linePathInfo.forEach((item, index) => {
        const point = [item.x, item.y]
        const marker = new AMap.Marker({
          map: this.map,
          position: point,
          icon: markerIcon,
          offset: new AMap.Pixel(-(imgW / 2), -(imgH / 2)) // 初始位置偏移
        })
        // marker.linePathInfo = item;
        marker.info = item
        marker.index = index
        // 绑定移入、移出事件
        marker.on('mouseover', this.markerMouseover)
        marker.on('mouseout', this.markerMouseout)
      })
    },
    markerMouseover(e) {
      const curMarker = e.target
      this.getPopup(curMarker.info)
      this.pop.open(this.map, curMarker.getPosition()) // marker移入出现弹窗
    },
    markerMouseout() {
      this.closeInfoWindow()
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
      this.pop = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: this.createPopup(title, content),
        offset: new AMap.Pixel(0, -10) //new AMap.Pixel(130, -15) //左、上
      })
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
      // popupTop.appendChild(popupTitle);
      // let closeX = document.createElement('img');
      // closeX.src = 'https://webapi.amap.com/images/close2.gif';
      // closeX.onclick = this.closeInfoWindow(); //点击关闭
      // popupTop.appendChild(closeX);//关闭按钮
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
    //关闭信息窗体
    closeInfoWindow() {
      this.map.clearInfoWindow()
    },
    initMap() {
      return new Promise((resolve, reject) => {
        AMapLoader.load({
          key: amapKey, //申请好的Web端开发者Key，首次调用 load 时必填
          version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins: [
            'AMap.InfoWindow', //自定义窗体
            'AMap.MoveAnimation', //动画
            'AMap.Polyline',
            'AMap.GraspRoad' //轨迹纠偏
            // 'AMap.Scale',
            // 'AMap.Geocoder'
            // 'AMap.Driving',
          ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((res) => {
            AMap = res
            //设置地图容器id
            this.map = new AMap.Map('routeMapContainerId', {
              resizeEnable: true,
              zoom: 12, //地图显示的缩放级别
              zIndex: 99
            })
            // const cityCode = '010';
            // var geocoder = new AMap.Geocoder({
            //     city: '010', //城市设为北京，默认：“全国”
            //     radius: 1000 //范围，默认：500
            // });
            // console.log('【  geocoder.getLocation 】-211', geocoder.getLocation);
            // geocoder.getLocation(cityCode, (status, result) => {
            //     console.log('【 status, result 】-211', status, result);
            //     if (status === 'complete' && result.info === 'OK') {
            //         console.log('【  result.geocodes 】-208', result.geocodes);
            //         var location = result.geocodes[0].location;
            //         // 在地图上添加标记
            //         var marker = new AMap.Marker({
            //             position: location,
            //             map: this.map
            //         });
            //         // 地图自适应显示标记
            //         this.map.setFitView();
            //     } else {
            //         console.error('获取经纬度失败');
            //     }
            // });
            // 初始化车辆轨迹
            this.graspRoad = new AMap.GraspRoad()
            markerIcon = new AMap.Icon({
              size: new AMap.Size(imgW, imgW),
              // image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
              image: markerImg, //require('../static/marker.png'),
              imageSize: new AMap.Size(imgW, imgW),
              imageOffset: new AMap.Pixel(0, 0) //解决图片只显示一半的问题
            })
            resolve()
          })
          .catch((e) => {
            reject(e)
            console.error('地图初始化失败', e)
          })
      })
    },
    destroyMap() {
      this.map?.destroy()
      console.log('地图已销毁')
    }
  }
}
</script>

<style lang="scss" scoped>
.amap-graspRoad {
  height: 100%;
  #routeMapContainerId {
    padding: 0px;
    margin: 0px;
    width: 100%;
    min-height: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss">
.popup-wrap {
  // background: #fff;
  text-align: left;
  width: 270px;
  font-size: 13px;
  .popup-top {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border-bottom: 1px solid #dcdfe6 !important;
    background: #fff;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .popup-content {
    // margin-top: 5px;
    padding: 5px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
    width: 0;
    height: 0;
    border-bottom: 10px solid transparent;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-top: 10px solid #fff;
  }
}
</style>
