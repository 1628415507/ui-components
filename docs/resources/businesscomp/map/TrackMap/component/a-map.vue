<!--
 * @Description: 车辆轨迹（高德）
 * @Date: 2023-09-25 18:02:44
 * @LastEditTime: 2023-10-19 10:54:28
-->

<template>
  <div class="amap-graspRoad">
    <!-- 地图容器 -->
    <div id="trackMapContainerId"></div>
    <!-- 轨迹回放控制 -->
    <ControlBox
      v-if="actualPathArr && actualPathArr.length"
      @start="startAnimation()"
      @pause="pauseAnimation()"
      @resume="resumeAnimation()"
      @stop="stopAnimation()"
    ></ControlBox>
    <!-- 事件绑定 -->
    <!-- <div class="input-item">
            <button class="btn" id="add-marker" style="margin-right: 1rem">添加Marker</button>
            <button class="btn" id="remove-marker">删除Marker</button>
        </div> -->
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import ControlBox from './control-box.vue'
import { AMAP_CONFIG } from '../../mapConfig.js'
// 地图对象
let AMap = null
let carIcon = null
const amapKey = AMAP_CONFIG.key //'bf2b2192907b6eb2a0363dd9beb0aa60'
const baseStyle = {
  strokeWeight: 8,
  strokeOpacity: 1
}
// 图层层级
const Z_INDEX = {
  PASSED: 999,
  ACTUAL: 998,
  PLAN: 997
}
export default {
  name: 'AMapGraspRoad',
  components: { ControlBox },
  props: {
    pathData: {
      type: Object,
      default: () => {} // 轨迹信息
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
      marker: null, //车辆标记点
      // 地图数据
      passedPolyline: null, //动画轨迹
      actualPathInfo: {}, // 轨迹车辆信息
      actualPathArr: [], //实际轨迹数据
      moveIndex: 0,
      moveProgress: 0,
      isAnimationStop: false //动画是否停止
    }
  },
  watch: {
    pathData: {
      // immediate: true,
      deep: true,
      handler(val) {
        console.log('【 watch-pathData 】-94', val)
        this.drawPathLine(val)
      }
    }
  },
  beforeDestroy() {
    this.destroyMap()
  },
  async mounted() {
    try {
      await this.initMap() //DOM初始化完成进行地图初始化
      this.drawPathLine(this.pathData)
    } catch {
      console.error('mounted-地图初始化失败111')
    }
  },
  methods: {
    // 绘制车辆轨迹
    drawPathLine(obj) {
      if (!AMap || !this.map) {
        return
      }
      // 绘制实际轨迹
      const actualPath = obj.actualPath.path || []
      this.actualPathInfo = actualPath
      this.actualPathArr = actualPath.map((item) => {
        return [item.x, item.y]
      })
      const actualLine = new AMap.Polyline({
        ...baseStyle,
        path: this.actualPathArr,
        strokeColor: '#7277eb',
        zIndex: Z_INDEX.ACTUAL
      })
      this.map.add(actualLine)
      this.setMarker() //设置骑车图标

      // 计划轨迹
      const planPath = obj.planPath.path
      const planPathArr = planPath.map((item) => {
        return [item.x, item.y]
      })
      const planLine = new AMap.Polyline({
        ...baseStyle,
        path: planPathArr,
        strokeColor: '#0091ea',
        showDir: true, //显示箭头
        zIndex: Z_INDEX.PLAN
      })
      this.map.add(planLine)
      this.map.setFitView()
      // 获取计划轨迹
      // this.graspRoad.driving(actualPath, (error, result) => {
      //     if (!error) {
      //         const planPath = result.data.points;
      //         console.log('【 planPath 】-117', planPath);
      //         const planPathArr = planPath.map(item => {
      //             return [item.x, item.y];
      //         });
      //         const planLine = new AMap.Polyline({
      //             ...baseStyle,
      //             path: planPathArr,
      //             strokeColor: '#0091ea',
      //             showDir: true, //显示箭头
      //             zIndex: Z_INDEX.PLAN
      //         });
      //         this.map.add(planLine);
      //         this.map.setFitView();
      //     } else {
      //         this.map.setFitView();
      //         console.error('【 获取计划轨迹失败 】-168');
      //     }
      // });
    },
    // 车辆图标
    setMarker() {
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.actualPathArr[0],
        icon: carIcon,
        offset: new AMap.Pixel(-10, -10) // 初始位置偏移
      })
      // 动画轨迹
      if (!this.passedPolyline) {
        console.log('【 初始化动画轨迹 】-187')
        this.passedPolyline = new AMap.Polyline({
          map: this.map,
          ...baseStyle,
          strokeColor: '#AF5', //线颜色
          zIndex: Z_INDEX.PASSED
        })
      }
      // 绑定移动、移入、移出事件
      this.marker.on('moving', this.markerMoving)
      this.marker.on('mouseover', this.markerMouseover)
      this.marker.on('mouseout', this.markerMouseout)
    },
    markerMoving(e) {
      // console.log('【 e 】-184', e);
      this.moveIndex = e.index
      this.moveProgress = e.progress
      this.passedPolyline.setPath(e.passedPath)
      // this.map.setCenter(e.target.getPosition(), true);//根据行驶移动地图位置
    },
    markerMouseover() {
      const lastMoveIndex = this.actualPathArr.length - 2 //移动的最后一段
      if (this.moveIndex === lastMoveIndex && this.moveProgress === 1) {
        this.moveIndex = this.actualPathArr.length - 1
      }
      this.getPopup(this.moveIndex)
      this.pop.open(this.map, this.marker.getPosition()) // marker移入出现弹窗
    },
    markerMouseout() {
      this.closeInfoWindow()
    },
    // 开始动画
    startAnimation() {
      this.isAnimationStop = false
      if (!this.actualPathArr?.length) {
        return
      }
      this.marker.moveAlong(this.actualPathArr, {
        // duration: 1000, // 每一段的时长，可根据实际采集时间间隔设置
        speed: 500, // 小车移动速度-均速
        autoRotation: true // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
      })
    },
    // 暂停动画
    pauseAnimation() {
      this.marker.pauseMove()
    },
    // 继续动画
    resumeAnimation() {
      if (this.isAnimationStop) {
        return
      }
      this.marker.resumeMove()
    },
    // 停止动画
    stopAnimation() {
      this.marker.stopMove()
      this.isAnimationStop = true
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
      popupTop.appendChild(popupTitle)
      // let closeX = document.createElement('img');
      // closeX.src = 'https://webapi.amap.com/images/close2.gif';
      // closeX.onclick = this.closeInfoWindow(); //点击关闭
      // popupTop.appendChild(closeX);//关闭按钮
      popup.appendChild(popupTop)
      // 定义中部内容
      let popupMiddle = document.createElement('div')
      popupMiddle.className = 'popup-content'
      popupMiddle.innerHTML = content
      popup.appendChild(popupMiddle)
      // 定义底部内容
      let popupBottom = document.createElement('div')
      popupBottom.className = 'popup-bottom'
      // let sharp = document.createElement('img');
      // sharp.src = 'https://webapi.amap.com/images/sharp.png';
      // popupBottom.appendChild(sharp);
      popup.appendChild(popupBottom)
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
            // 'AMap.Driving',
          ] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        })
          .then((res) => {
            AMap = res
            //设置地图容器id
            this.map = new AMap.Map('trackMapContainerId', {
              resizeEnable: true,
              zoom: 12, //地图显示的缩放级别
              zIndex: 99
            })
            // 初始化车辆轨迹
            this.graspRoad = new AMap.GraspRoad()
            // 初始化汽车图标
            carIcon = new AMap.Icon({
              size: new AMap.Size(20, 40),
              image: 'https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png',
              // image: require('../static/car.png'),
              imageSize: new AMap.Size(20, 40),
              imageOffset: new AMap.Pixel(0, 0) //解决图片只显示一半的问题
            })
            resolve()
            /* ---------------------------------- 添加Marker 自定义窗体---------------------------------- */

            // // 构造点标记
            // let marker = new AMap.Marker({
            //     icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            //     position: [116.405467, 39.907761],
            //     anchor: 'bottom-center'
            // });
            // //事件绑定
            // document.querySelector('#add-marker').onclick = () => {
            //     //鼠标点击marker弹出自定义的信息窗体
            //     marker.on('click', () => {
            //         this.pop.open(this.map, marker.getPosition());
            //     });

            //     this.map.add(marker);
            //     this.map.setFitView();
            // };
            // document.querySelector('#remove-marker').onclick = () => {
            //     this.map.remove(marker);
            //     this.map.setFitView();
            // };
            // /* ---------------------------------- end 添加Marker ---------------------------------- */
            // this.map.on('click', () => {});
            /* ------------------------------ Autocomplete ------------------------------ */
          })
          .catch((e) => {
            // reject(e)
            // console.error('地图初始化失败', e)
          })
      })
    },
    destroyMap() {
      this.marker?.off('moving', this.markerMoving)
      this.marker?.off('mouseover', this.markerMouseover)
      this.marker?.off('mouseout', this.markerMouseout)
      this.map?.destroy()
      console.log('地图已销毁')
    }
  }
}
</script>

<style lang="scss" scoped>
.amap-graspRoad {
  height: 100%;
  #trackMapContainerId {
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
