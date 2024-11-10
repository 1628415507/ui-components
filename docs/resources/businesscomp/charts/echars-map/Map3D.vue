<template>
  <div class="map3d-wrap">
    <!-- 显示层级 -->
    <div class="level-list">
      <!-- {{ info.curName }} -->
      <div v-for="(item, level) in levelList" :key="item">
        <span v-if="level === levelList.length - 1">
          {{ item }}
        </span>
        <!-- 不是最后一级 -->
        <span v-else @click="handleBack(item)">
          {{ item }}
          <i class="el-icon-arrow-right" />
        </span>
      </div>
    </div>
    <!-- 显示地图 -->
    <div id="mapId" ref="mapRef" class="map-box" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import echartsTheme from '../static/echartsTheme.json'

// import 'echarts-gl'
import axios from 'axios'
import chinaJson from '../static/china.json' // 中国地图数据
import mapBg from '../static/map-bg.png' // 地图背景图
import toastBg from '../static/toast-bg.svg'
import toastIcon from '../static/circle.svg'
let echartsMap
export default {
  props: {},
  data() {
    return {
      info: {
        curName: '福建'
      },
      levelList: ['中国'], // 层级
      // echartsMap: '',
      // 定时器
      tooltipIndex: 0,
      timeFn: null,
      intervalFn: null,
      // 地图数据
      rootName: '中国', // 最上级地图名称
      curMapName: '中国', // 当前地图名称
      curMapJson: {}, // 当前地图数据
      mapCode: { 中国: 100000 }, // 加载地图地图编码
      curMapCode: 100000
    }
  },
  computed: {
    // map3D数据
    seriesData() {
      return [
        {
          adcode: 350000, // 根据code绑定数据
          name: '福建省',
          lng: '119.053576',
          lat: '29.887459',
          wcs: 10,
          mbs: 50,
          wcl: 100
        }
      ]
    }
  },
  mounted() {
    echartsMap && echartsMap.dispose() // 优化2--防止重复创建
    this.initMap(this.rootName)
  },
  beforeDestroy() {
    if (!echartsMap) {
      return
    }
    echartsMap.clear()
    echartsMap.dispose()
    echartsMap = null
    clearInterval(this.intervalFn) // 清除定时器
  },
  methods: {
    // 获取GeoJson
    getGeoJson(code = 100000) {
      return new Promise(async (resolve) => {
        const mapCode = { 中国: 100000 }
        let res = {}
        if (code === 100000) {
          res.data = chinaJson
        } else {
          res = await axios.get(`https://geo.datav.aliyun.com/areas/bound/${code}_full.json`)
        }
        const _res = res ? res.data : {}
        _res.features.forEach((item) => {
          mapCode[item.properties.name] = item.properties.adcode
        })
        this.mapCode = mapCode
        resolve(_res)
      })
    },
    // 单击-下钻
    echartsMapClick(params) {
      // this.timeFn && clearTimeout(this.timeFn);
      const mapName = params.name
      // this.timeFn = setTimeout(() => {
      // 如果当前是最后一级(省级)，那就直接return，不继续下钻
      if (!mapName || this.levelList.length > 1) {
        // alert('已经是最后一级');
        return
      }
      // 单击切换到省级地图，当mapData有值,说明可以切换到下级地图
      // const mapData = this.mapJson[mapName];
      // if (!mapData) {
      //   this.$message.warning('无此区域地图显示');
      //   return;
      // }
      this.levelList.push(mapName) // 记录下钻层级
      // this.$nextTick(() => {
      echartsMap && echartsMap.clear() // 清空画布，重新绘制
      echartsMap && echartsMap.dispose()
      this.tooltipIndex = 0
      this.initMap(mapName)
      // });
      // }, 100);
    },
    // 返回上一级
    handleBack(mapName) {
      console.log('【 mapName 】-80', mapName)
      if (mapName !== '中国') {
        return
      }
      clearTimeout(this.timeFn)
      this.levelList.pop()
      this.tooltipIndex = 0
      echartsMap && echartsMap.clear() // 清空画布，重新绘制
      this.initMap(this.rootName)
    },
    // 绘制地图
    async initMap(mapName = this.rootName) {
      echartsMap && echartsMap.off('click')
      this.curMapName = mapName
      // 获取地图编码、数据
      this.curMapCode = this.mapCode[mapName]
      this.curMapJson = await this.getGeoJson(this.curMapCode)
      console.log('【 curMapInfo 】-127', mapName, this.curMapCode, this.curMapJson)
      // 注册地图数据
      mapName && this.curMapJson && echarts.registerMap(mapName, { geoJSON: this.curMapJson }) // 获取对应的json数据,最主要的
      // echartsMap = echarts.init(this.$refs.mapRef);
      echarts.registerTheme('echartsTheme', echartsTheme)
      echartsMap = echarts.init(document.getElementById('mapId'), echartsTheme)
      //  公共配置
      const commonConfig = {
        type: 'map3D',
        map: mapName,
        zoom: 1, //1.2, // this.curMapName === this.rootName ? 1.2 : 0.9, // 放大比例
        coordinateSystem: 'geo3D', // 该系列使用的坐标系
        boxWidth: 85, // 三维地图在三维场景中的宽度
        boxDepth: 80, // 地图倾斜度
        regionHeight: 4, // 地图厚度
        center: ['50%', '50%'],
        // 【视角控制】用于鼠标的旋转，缩放等视角控制
        viewControl: {
          center: [0, 0, 0], // 中心点：旋转也会围绕这个中心点旋转，默认为[0,0,0]。
          projection: 'perspective', // 投影方式
          // 缩放操作
          zoomSensitivity: 1, // 缩放
          distance: this.curMapName === this.rootName ? 70 : 100, // 地图视角-控制初始大小(值越小，图越大)//在 projection 为'perspective'的时候有效。
          minDistance: 50, // 视角通过鼠标控制，能拉近到主体的最小距离
          maxDistance: 100, // 视角通过鼠标控制，能拉远到主体的最大距离
          // 平移操作
          panSensitivity: 1, // 默认为1，设置为0后无法旋转。
          panMouseButton: 'left', // 平移操作使用的鼠标按键（！！！需要把旋转的鼠标按键设置成其他的，否则会冲突失效）
          // 旋转操作
          rotateSensitivity: 0, // 默认为1，设置为0后无法旋转。
          rotateMouseButton: 'middle', // 旋转操作使用的鼠标按键(不能设置和平移操作一样)
          // 视角-绕 x 轴
          alpha: 65, // 视角绕 x 轴，即上下旋转的角度。值越大，初始视角越正，配合 beta 可以控制视角的方向。[ default: 40 ]
          // minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
          // maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
          // 视角-绕 y 轴
          beta: 0 // 视角绕 y 轴，即左右旋转的角度。[ default: 0 ]
          // minBeta: -80, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
          // maxBeta: 80 // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
        }
      }
      // 地图配置
      const mapOption = {
        tooltip: {
          show: false,
          trigger: 'item',
          enterable: false, // true, tooltip可以点击
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          formatter: ''
          // extraCssText: 'width:100px;height:40px;',
        },
        // 【三维的地理坐标系组件】
        // 这里之所以要加个geo3D是为了让series中的其他系列坐标跟map3D的坐标系保持一致，鼠标旋转过程中不会出现分离
        geo3D: {
          ...commonConfig,
          zlevel: -1,
          show: true,
          // 【地图区域的设置】
          regions: [
            {
              name: '福建省',
              show: true,
              // data: ['fujian'],
              itemStyle: {
                // color: 'red', // 图形的颜色
                margin: 30,
                marginLeft: 20,
                opacity: 1,
                borderWidth: 1,
                borderColor: '#fff'
              },
              height: 6,
              label: {
                // opacity: 0,
                show: true,
                backgroundColor: {
                  image: mapBg,
                  opacity: 1
                },
                padding: [15, 0, 0, 30], // 内边距属性
                width: 300, // 宽属性
                height: 200, // 高属性
                offset: [10, 30],
                position: 'bottom',
                // margin: [10, 10, 10, 10],
                // margin: 30, // 字体
                color: '#fff', // '#a8f2ff',
                lineHeight: 31,
                left: 100,
                fontSize: 20,
                // textAlign: 'center',
                rich: {
                  name: {
                    fontSize: 30,
                    color: '#fff'
                  },
                  value: {
                    fontSize: 30,
                    color: '#5c8ef3'
                  }
                },
                distance: 2,
                formatter: (params) => {
                  const list = [
                    { name: '供应商', val: '6', count: '19' },
                    { name: '承运商', val: '100', count: '18.3' },
                    { name: '检测中心', val: '60', count: '18' },
                    { name: '仓储基地', val: '55', count: '19.3' }
                  ]
                  const arr = list.map((item) => {
                    return `${item.name}${item.val}家    ${item.count}t`
                  })
                  // console.log('【 arr 】-185', arr)
                  // const listStr = `供应商 ${6}家        ${18.3}t\n承运商 ${100}家        ${19.3}t\n检测中心 ${60}家        ${19.3}t\n仓储基地 ${550}家        ${50}t`
                  const str = `        ${params.name}${this.info.adcode || ''}` + '\n' + '\n' + arr.join('\n')
                  return str
                }
              }
            }
          ],
          // 【标签的相关设置】
          label: {
            // show: true
            // textStyle: {
            //   color: '#fff', // 文字颜色
            //   fontSize: 16, // 文字大小
            //   fontFamily: '微软雅黑',
            //   backgroundColor: 'rgba(0,0,0,0)' // 透明度0清空文字背景
            // }
          },
          // 【视觉属性】三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等
          // itemStyle: {
          // color: 'red',
          // color: 'transparent',
          // color: '[1,1,1,0]'
          // opacity: 1,
          // borderWidth: 1,
          // borderColor: 'rgba(0,255,255,.1)'// '#00D9FF'// #4772a2'
          // },
          // 鼠标 hover 高亮时图形和标签的样式。
          emphasis: {
            // 当鼠标放上去  地区区域是否显示名称
            label: {
              show: false
            }
          },
          // 【真实感材质相关配置】 shading: 'realistic'时有效
          shading: 'realistic',
          realisticMaterial: {
            detailTexture: mapBg, // 材质细节的纹理贴图。!!!必须配置shading: 'realistic'时才有效
            textureTiling: 1, // 材质细节纹理的平铺。1是拉伸，也就是拉伸填满；数字表示纹理平铺次数，相当于背景图repeat的次数
            roughness: 0, // 材质粗糙度，0完全光滑，1完全粗糙
            roughnessAdjust: 0, // 粗糙度调整,0的时候为完全光滑，1的时候为完全粗糙
            metalness: 0 // 0材质是非金属 ，1金属
          },
          // 【光源设置】
          light: {
            // 场景主光源的设置
            main: {
              color: '#00D9FF', // '#00D9FF', // 主光源的颜色。
              intensity: 5, // 主光源的强度。
              shadow: false, // 主光源是否投射阴影。默认为关闭
              shadowQuality: 'medium', // 'ultra', // 阴影的质量
              alpha: 0, // 主光源绕 x 轴，即上下旋转的角度//值越大越往上，90，顶部光照，0，底部发光
              beta: 0 // 主光源绕 y 轴，即左右旋转的角度。
            },
            // 全局的环境光设置。
            ambient: {
              color: '#fff', // 主光源的颜色。
              intensity: 1
            },
            // ambientCubemap 会使用纹理作为环境光的光源
            ambientCubemap: {
              color: '#fff', // 主光源的颜色。
              intensity: 1
            }
          }
          // 【后处理特效的相关配置】，后处理特效可以为画面添加高光、景深、环境光遮蔽（SSAO）、调色等效果
          // postEffect: {
          //   enable: true, // 是否开启后处理特效。默认关闭
          //   bloom: {// 高光特效
          //     enable: true,
          //     bloomIntensity: 0.1
          //   }
          // },
          // data: this.seriesData
        },
        series: [
          {
            ...commonConfig,
            data: this.seriesData,
            zlevel: 100,
            // left: '0',
            // top: '10%',
            // right: '8%',
            // bottom: '0',
            // boundingCoords: [
            //   [-180, 90],
            //   [180, -90]
            // ],
            // 【标签的相关设置】
            label: {
              show: true,
              formatter: '{b} ', // 必须有空格，不然一级不显示名称
              //  (params) => { // '{a}', // '{a}:{b}: {c}',
              //   console.log('【 params 】-288', params.name)
              //   return params.name
              // },
              textStyle: {
                fontSize: 14,
                color: '#ffffff' // #bfdaff
              }
            },
            // 【视觉属性】三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等
            itemStyle: {
              // color: 'red',
              // color: 'transparent',
              color: [1, 1, 1, 0],
              opacity: 0,
              borderWidth: 1,
              borderColor: 'rgba(0,255,255,.1)'
              // borderColor: '#00D9FF'// #4772a2'// [255, 255, 255, 0.5] // 'rgba(255,255,255,0.5)'// '#00ffff'
            },
            // 鼠标 hover 高亮时图形和标签的样式。
            emphasis: {
              // 当鼠标放上去  地区区域是否显示名称
              label: {
                show: false,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(0,23,11,0)'
                }
              },
              itemStyle: {
                color: [1, 1, 1, 0],
                opacity: 0.6
                // borderWidth: 1,
                // borderColor: 'rgb(62,215,213)'
              }
            }
          }
        ]
      }
      // this.autoShowTip(mapOption) //轮播
      this.handleRegionsActive(mapOption)
      // 设置自定义弹框
      // mapOption &&
      //   mapOption.tooltip &&
      //   (mapOption.tooltip.formatter = this.formatTooltip); // 加载页面时候替换tooltip的formatter
      // echartsMap.getZr().on('click', params => {
      //   console.log('【 getZr 】-329', params)
      //   // if (params.target == undefined) { // 点击空白处调用方法
      //   //   alert('11111')
      //   // } else { // 点击空白处调用方法
      //   //   myChart.on('click', (params) => {
      //   //     console.log(params)
      //   //   })
      //   // }
      // })

      // mapOption &&
      //   mapOption.geo3D &&
      //   (mapOption.geo3D.label = this.formatTooltip); // 加载页面时候替换tooltip的formatter
      //  label
      // 设置地图配置
      echartsMap && echartsMap.setOption(mapOption)
      // echartsMap.setOption(mapOption, true);/// 加上true可以防止开启geo中roam导致的重绘位置偏移
      //  绑定事件
      // this.$nextTick(() => {
      // 点击前解绑，防止点击事件触发多次
      echartsMap && echartsMap.off('click')
      echartsMap && echartsMap.on('click', this.echartsMapClick) // 绑定单击下钻
      // });
      // window.onresize = echartsMap.resize();
    },
    // echarts事件处理
    handleRegionsActive(mapOption) {
      // 鼠标悬浮，停止轮播
      echartsMap.off('mouseover')
      echartsMap.on('mouseover', (params) => {
        // console.log('【 鼠标移入 】-411', params.name, params)
        clearInterval(this.intervalFn)
        // 高亮当前移入区域
        // if (this.tooltipIndex !== params.dataIndex) {
        const mapData = this.curMapJson.features || []
        if (!mapData.length) {
          return
        }
        // 设置编码
        const curName = params.name
        const filterList = mapData.filter((item) => {
          return item.properties.name === curName
        })
        const adcode = filterList[0].properties.adcode
        this.$set(this.info, 'adcode', adcode)
        // 设置名称
        mapOption.geo3D.regions[0].name = curName // mapData[curIndex].properties.name;
        this.$set(this.info, 'curName', curName)
        echartsMap && echartsMap.setOption(mapOption)
        // }
      })
      // 鼠标离开，开始轮播
      echartsMap.off('mouseout')
      echartsMap.on('mouseout', (params) => {
        console.log('【 鼠标离开 】-411', params)
        this.autoShowTip(mapOption) // 开始轮播
      })
      // 图表容器的事件（包括图表上的空白处）
      const zRender = echartsMap.getZr()
      // console.log('【 zRender 】-422', zRender)
      // 鼠标在容器上移动
      // zRender.on('mousemove', (params) => {
      //   console.log('【 mousemove 】-423', params)
      //   clearInterval(this.intervalFn);
      // });
      // 移出图表容器
      zRender.on('globalout', (params) => {
        this.autoShowTip(mapOption) // 开始轮播
      })
    },
    // 区域轮播设置
    autoShowTip(mapOption) {
      clearInterval(this.intervalFn)
      // console.log('【 mapOption 】-422', mapOption)
      this.intervalFn = setInterval(() => {
        const mapData = this.curMapJson.features
        if (!mapData.length) {
          return
        }
        // console.log('【 mapData 】-463', mapData)
        mapOption.geo3D.regions[0].name = mapData[this.tooltipIndex].properties.name
        // this.curName = mapOption.geo3D.regions[0].name
        this.$set(this.info, 'curName', mapOption.geo3D.regions[0].name)
        this.$set(this.info, 'adcode', mapData[this.tooltipIndex].properties.adcode)
        echartsMap && echartsMap.setOption(mapOption)
        // alert(mapOption.geo3D.regions[0].name);
        this.tooltipIndex++
        const dataLength = this.curMapJson.features.length
        if (this.tooltipIndex === dataLength) {
          this.tooltipIndex = 0
        }
      }, 3000)
    },
    // 自定义Tooltip样式
    formatTooltip(params) {
      console.log('【 params 】-494', params)
      // 由于是写在最外层的所以需要判断一下当前鼠标是在地图上还是散点上悬浮
      // if (params.componentSubType === 'scatter') {
      const areaName = params.name
      if (!areaName) {
        return
      }
      const str = `
                <div class="tooltip-box" >
                  <div class="com-txt title">
                    ${areaName}
                  </div>
                  <div class="content">
                    <div class="list">
                      <div v-for="(item, index) in 4" :key="index" class="item">
                        <div class="com-txt">检测中心 1家</div>
                        <div class="value">19.1 t</div>
                      </div>
                    </div>
                  </div>
                  <img src="${toastIcon}" class="circle">
                  <img src="${toastBg}" class="img">
                </div>`
      return str
      // }
    }
  }
}
</script>

<style lang="scss">
// scoped：加了scoped tooltip中的样式会不生效
// @mixin方法
// 渐变字体
@mixin GradientFont($endColor, $deg: 180deg, $startColor: #fff, $startPercent: 30%) {
  background-image: linear-gradient($deg, $startColor $startPercent, $endColor 100%);
  // background-image: linear-gradient(to bottom, #fff, red);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /*需要文字透明*/
  color: transparent;
}
.map3d-wrap {
  position: relative;
  color: #fff;
  .level-list {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    z-index: 99;
    font-size: 17px;
    color: #fff;
    span {
      display: inline-block;
      cursor: pointer;
      &:last-child {
        cursor: default;
      }
    }
  }
  .map-box {
    background: #000;
    margin: 0 auto;
    width: 100%;
    height: 750px;
    overflow: hidden;
    color: #7e9cbd;
  }
  // tooltip
  .tooltip-box {
    width: 340px;
    height: 210px;
    color: #ffffff;
    position: relative;
    .com-txt {
      font-family: 'Microsoft YaHei Bold';
      color: #a8f2ff;
      font-size: 20px;
      letter-spacing: 0.1px;
    }
    // 标题
    .title {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 58px;
      line-height: 62px;
      text-align: center;
    }
    // 内容
    .content {
      position: absolute;
      z-index: 1;
      top: 52px;
      box-sizing: border-box;
      width: 100%;
      padding: 10px 36px;
      overflow: hidden;
      .list {
        .item {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }
        .value {
          align-items: right;
          font-weight: bold;
          font-size: 22px;
          @include GradientFont($endColor: #ff5858);
        }
      }
    }

    // 图标
    .circle {
      z-index: 1;
      position: absolute;
      top: 7px;
      left: 32px;
      width: 42px;
      height: 42px;
    }
    .img {
      z-index: 0;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
