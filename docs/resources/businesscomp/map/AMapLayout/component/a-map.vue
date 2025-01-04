<!--
 * @Description: 地图排线
 * @Date: 2023-09-25 18:02:44
 * @LastEditTime: 2024-01-19 16:40:09
-->

<template>
  <div class="amap-layout">
    <!-- 左侧部分 -->
    <LeftBox ref="leftBoxRef" :pointList="pathData" :AMap="AMap" :map="map"></LeftBox>
    <!-- 地图容器 -->
    <div id="container"></div>
    <!-- 按钮 -->
    <div class="btn-wrap">
      <el-button type="primary" size="mini" @click="handleLine">辅助排线</el-button>
    </div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { AMAP_CONFIG } from '../../mapConfig.js'
import LeftBox from './left-box.vue'
// 地图对象
let AMap = null
const imgW = 8
const imgH = 8
const amapKey = AMAP_CONFIG.key
window._AMapSecurityConfig = {
  serviceHost: 'http://127.0.0.1:9000/_AMapService',
  securityJsCode: AMAP_CONFIG.securityJsCode
}

export default {
  name: 'AMapLayout',
  components: { LeftBox },
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
      AMap: null,
      map: null,
      pop: null,
      marker: null //车辆标记点
    }
  },
  watch: {
    pathData: {
      deep: true,
      handler(val) {
        console.log('【 watch-pathData 】-94', val)
        this.setMarker(val)
      }
    }
  },
  beforeDestroy() {
    this.destroyMap()
  },
  async mounted() {
    await this.initMap()
    this.setMarker(this.pathData)
  },
  methods: {
    // 辅助排线
    handleLine() {
      this.$refs.leftBoxRef.openRoutePlan()
    },
    // 车辆图标
    setMarker(linePathInfo) {
      if (!AMap || !this.map) {
        return
      }
      linePathInfo.forEach((item, index) => {
        const point = [item.x, item.y]
        const marker = new AMap.Marker({
          map: this.map,
          position: point,
          // icon: imgIcon,
          offset: new AMap.Pixel(-(imgW / 2), -(imgH / 2)) // 初始位置偏移
        })
        // marker.linePathInfo = item;
        marker.info = item
        marker.index = index
        // 绑定移入、移出事件
        marker.on('mouseover', this.markerMouseover)
        marker.on('mouseout', this.markerMouseout)
      })
      this.map.setFitView()
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
            // 'AMap.InfoWindow', //自定义窗体
            // 'AMap.Polyline',
            // 'AMap.Scale',
            'AMap.Driving',
            'AMap.Geocoder', //反编码
            'AMap.AutoComplete', //自动提示
            'AMap.PlaceSearch' //搜素信息
          ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((res) => {
            AMap = res
            this.AMap = AMap
            console.log('【 AMap 】-196', AMap)

            //设置地图容器id
            this.map = new AMap.Map('container', {
              resizeEnable: true,
              zoom: 12, //地图显示的缩放级别
              zIndex: 99
            })

            //
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
            // 初始化自定义图标
            // imgIcon = new AMap.Icon({
            //     size: new AMap.Size(imgW, imgW),
            //     // image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
            //     image: require('../static/marker.png'),
            //     imageSize: new AMap.Size(imgW, imgW),
            //     imageOffset: new AMap.Pixel(0, 0) //解决图片只显示一半的问题
            // });
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
.amap-layout {
  height: 100%;
  position: relative;
  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    min-height: 100%;
    height: 100%;
  }
  .btn-wrap {
    position: absolute;
    right: 10px;
    bottom: 10px;
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
