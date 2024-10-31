<!--
 * @Description: 2d地图
 * @Date: 2023-02-15 09:33:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-10-31 14:20:55
-->
<template>
  <div class="map2D-wrap">
    <!-- 显示层级 -->
    <div class="level-list">
      <!-- {{ info.curName }} -->
      <!-- {{ tooltipIndex }} -->
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
    <div class="map2D-box">
      <div id="map2DId" ref="chartRef" style="width: 100%; height:700px" />
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import echartsTheme from '../static/echartsTheme.json'
import axios from 'axios'
import chinaJson from '../static/china.json' // 中国地图数据
import mapBg from '../static/map-bg.png' // 地图背景图
import toastBg from '../static/toast-bg.svg'
import toastIcon from '../static/circle.svg' 
// const toastBg = require('../static/toast-bg.svg')
// const toastIcon = require('../static/circle.svg')
// const mapBg= require('../static/map-bg.png')
// 优化1--不要在data里创建，影响性能
let echartsMap = null
// 定义图层中心坐标
// const x = '50%'; y = '52.5%'; ; yGeo1 = '53.9%'; yGeo2 = '54.9%'
export default {
  data() {
    return {
      // 定义图层中心坐标
      axis: {
        x: '50%',
        y: '52.5%',
        yGeo1: '53.9%',
        yGeo2: '54.9%'
      },
      // echartsMap: null,
      levelList: ['中国'], // 层级
      // 定时器
      tooltipIndex: 0,
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
    // map数据
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
    },
    // scatter3D数据
    scatterData() {
      return [
        {
          name: '福建省',
          value: [119.306239, 26.075302, 5]
        }
      ]
    }
  },
  mounted() {
    echartsMap && echartsMap.dispose() // 优化2--防止重复创建
    this.initMap(this.rootName)
  },
  beforeDestroy() {
    // 清空图层
    if (!echartsMap) {
      return
    }
    echartsMap.off('georoam') // 优化，避免重复绑定多个事件
    echartsMap.off('dblclick') // 点击前解绑，防止点击事件触发多次
    echartsMap.off('mouseover')
    echartsMap.off('mouseout')
    // 优化3--销毁地图组件，释放内存
    echartsMap.clear() // 清空图例数据
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
          // console.log('【 chinaJson 】-114', chinaJson)
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
    // 渲染地图
    async initMap(mapName = this.rootName) {
      this.curMapName = mapName
      // 获取地图编码、数据
      this.curMapCode = this.mapCode[mapName]
      this.curMapJson = await this.getGeoJson(this.curMapCode)
      console.log('【 curMapInfo 】-127', mapName, this.curMapCode, this.curMapJson)
      // 注册地图数据
      mapName && this.curMapJson && echarts.registerMap(mapName, { geoJSON: this.curMapJson }) // 获取对应的json数据
      echarts.registerTheme('echartsTheme', echartsTheme)

      echartsMap = echarts.init(document.getElementById('map2DId'), echartsTheme)
      // 公共配置
      const comConfig = {
        // center: [105.194115019531, 35.582111640625], // 城市经纬度
        map: mapName,
        roam: true, // 开启鼠标事件，scale缩放、move移动
        silent: true, // geo层不响应鼠标事件
        zoom: 0.7, //this.curMapName === this.rootName ? 1.15 : 0.7, // 1,
        aspectScale: 0.9, // 长宽比
        scaleLimit: {
          min: 0.7, // 最小的缩放值
          max: 1.3 // 最大的缩放值
        },
        layoutSize: '100%', // 保持地图宽高比
        // 优化4：给所有层记得加上 animationDurationUpdate:0, 不然会有同步延迟和卡顿
        animation: true,
        animationDurationUpdate: 0
      }
      // 图表配置项
      const mapOption = {
        // 图表标题
        title: {
          show: false,
          text: '地图',
          textStyle: {
            color: '#fff'
          }
        },
        // grid: {
        //   top: -200 // grid 组件离容器上侧的距离。
        // },
        // 悬浮提示
        tooltip: {
          trigger: 'item',
          // position: ['50%', '50%'],//提示框浮层的位置，默认不设置时位置会跟随鼠标的位置。
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)',
          // extraCssText: 'box-shadow: 0 0 0 rgba(0, 0, 0, 0);',
          extraCssText: 'width:100px;height:40px;',
          zIndex: 400,
          formatter: '', // 另外赋值
          // 优化5：Tooltip卡顿情况优化
          enterable: true, // 鼠标是否可进入提示框浮层中
          axisPointer: {
            animation: false
          }
        },
        // 地图配置
        geo: [
          // 基础层，设置地图外边框样式
          {
            zlevel: 1, // 99,
            name: '基础层，设置地图外边框样式',
            ...comConfig,
            // 样式
            layoutCenter: this.curMapName === this.rootName ? [this.axis.x, this.axis.y] : [this.axis.x, '36%'], // 设置后left/right/top/bottom等属性无效
            itemStyle: {
              areaColor: {
                image: mapBg, // 背景图
                repeat: 'repeat' // 是否平铺，可以是 'repeat-x', 'repeat-y', 'no-repeat'
              },
              // borderColor: '#00D9FF' // rgba(99,173,208,1)'
              borderColor: '#6FFDFF', // 'rgba(192,245,249,.8)',
              borderWidth: 3,
              shadowColor: '#6FFDFF',
              shadowOffsetY: 0,
              shadowBlur: 7
            },
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                opacity: 0
                // areaColor: 'red', // 地图区域高亮颜色
                // // areaColor: 'rgba(4, 28, 79,0.5)' // 地图区域高亮颜色
                // // borderColor: 'rgba(2, 170, 205,0.6)' // 边框样式
                // borderWidth: 0,
                // shadowBlur: 10
              }
            },
            regions: this.getRegions('border')
          },
          // 第二层,对地图进行偏移，设置第二层阴影
          {
            zlevel: -2,
            name: '设置第二层阴影',
            ...comConfig,
            // 第二层-样式
            layoutCenter: this.curMapName === this.rootName ? [this.axis.x, this.axis.yGeo1] : [this.axis.x, '37.4%'],
            itemStyle: {
              normal: {
                areaColor: '#105780', // '#257AB2',
                borderColor: 'rgba(35, 161, 184,0.6)',
                shadowColor: 'rgba(35, 161, 184,0.8)',
                shadowOffsetY: 7,
                shadowBlur: 10 // 15
                // shadowColor: 'rgba(3, 155, 192, 0.4)',
                // // shadowColor: 'rgba(138, 248, 239, 0.5)',
              }
            },
            // 第二层-高亮样式
            emphasis: {
              itemStyle: {
                opacity: 0
              }
            },
            regions: this.getRegions() // 隐藏部分区域
          },
          // 第三层， 最后一层样式
          {
            zlevel: -3,
            name: '最后一层样式',
            ...comConfig,
            // 第三层-样式
            // layoutCenter: [this.axis.x, this.axis.yGeo2],
            layoutCenter: this.curMapName === this.rootName ? [this.axis.x, this.axis.yGeo2] : [this.axis.x, '38.4%'],
            itemStyle: {
              normal: {
                // borderColor: 'rgba(7, 65, 117,0.5)',
                areaColor: '#0A2763', // '#0A2763',
                borderColor: 'rgba(35, 161, 184,0.6)',
                shadowColor: 'rgba(7, 65, 117,0.6)', // 'rgba(7, 65, 117,0.8)',
                shadowOffsetY: 13, // 15
                shadowBlur: 3 // 8
                // shadowColor: 'rgba(60,160,208,0.6)',
              }
            },
            // 第三层-高亮样式
            emphasis: {
              itemStyle: {
                opacity: 0
              }
            },
            regions: this.getRegions() // 隐藏部分区域
          }
        ],
        series: [
          {
            // 最上层，用于触发事件
            zlevel: 100,
            // geoIndex: 0, // 指定要用哪个geo的配置，这里使用第一个geo，因为第一个geo的显示级别zlevel更高，展示数据需要在最顶层展示
            type: 'map',
            coordinateSystem: 'geo', // 该系列使用的坐标系:使用地理坐标系
            ...comConfig,
            data: this.seriesData, // 设置地图数据
            silent: false, // 开启响应鼠标事件
            selectedMode: false, // 不让单独选中
            // 图形上的文本标签
            label: {
              show: false,
              color: '#000a3c'
            },
            // 最顶层样式
            // layoutCenter: [this.axis.x, this.axis.y],
            layoutCenter: this.curMapName === this.rootName ? [this.axis.x, this.axis.y] : [this.axis.x, '36%'],
            itemStyle: {
              areaColor: {
                image: mapBg, // 背景图
                repeat: 'repeat' // 是否平铺，可以是 'repeat-x', 'repeat-y', 'no-repeat'
              },
              color: '#fff',
              borderColor: 'rgba(128, 217, 248, 0.6)', // '#00D9FF #32CBE0',
              borderWidth: 1.1
            },
            emphasis: {
              itemStyle: {
                opacity: 0,
                areaColor: 'rgba(74,151,243,0.1)'
              },
              label: {
                show: false
              }
            }
          }
          // 打点
          // {
          //   zlevel: 101,
          //   type: 'effectScatter',
          //   coordinateSystem: 'geo',
          //   symbolSize: [20, 20],
          //   // symbolOffset: [],
          //   itemStyle: {
          //     normal: {
          //       color: 'rgba(255, 178, 76, 1)'
          //     }
          //   },
          //   data: this.scatterData,
          //   showEffectOn: 'render',
          //   rippleEffect: {
          //     brushType: 'stroke'
          //   },
          //   hoverAnimation: true
          // }
        ]
      }
      // 绘制图表
      mapOption && mapOption.tooltip && (mapOption.tooltip.formatter = this.formatTooltip) // 加载页面时候替换tooltip的formatter
      echartsMap.setOption(mapOption)
      // 绑定事件
      // this.autoShowTip() // 自动轮播
      this.handleTooltip() // 绑定事件-轮播
      this.echartsMapClick() // 绑定事件-双击下钻
      this.handleGeoRoam() // 绑定事件-拖曳、缩放
      // 适应窗口变化
      window.addEventListener('resize', () => {
        echartsMap && echartsMap.resize()
      })
    },
    // 区域样式设置
    getRegions(type) {
      return [
        {
          name: '南海诸岛',
          itemStyle: {
            normal: {
              opacity: type === 'border' ? 1 : 0, // 为 0 时不绘制该图形, // 隐藏地图
              borderColor: '#6FFDFF', // 'rgba(111, 253, 255,.7)', // 'red', // '#6FFDFF', // 'rgba(111, 253, 255,.6)',
              borderWidth: 2,
              shadowColor: '#6FFDFF',
              shadowOffsetY: 0,
              shadowBlur: 0
            }
          },
          label: {
            show: false // 隐藏文字
          }
        },
        {
          name: '海南省',
          itemStyle: {
            normal: {
              opacity: type === 'border' ? 1 : 0, // 为 0 时不绘制该图形
              borderColor: 'rgba(111, 253, 255,.3)', // 'red', // '#6FFDFF', // 'rgba(111, 253, 255,.6)',
              borderWidth: 2.5,
              shadowColor: '#6FFDFF',
              shadowOffsetY: 0,
              shadowBlur: 0
            }
          },
          label: {
            show: false // 隐藏文字
          }
        },
        {
          name: '台湾省',
          itemStyle: {
            normal: {
              opacity: type === 'border' ? 1 : 0, // 为 0 时不绘制该图形
              borderColor: 'rgba(111, 253, 255,.5)', // 'rgba(192,245,249,.8)',
              borderWidth: 3,
              shadowColor: '#6FFDFF',
              shadowOffsetY: 0,
              shadowBlur: 0
            }
          },
          label: {
            show: false // 隐藏文字
          }
        }
      ]
    },
    // 双击-下钻
    echartsMapClick() {
      // 单击事件有时会无法生效(估计可能和拖拽有冲突)，故改成了双击下钻
      echartsMap.off('dblclick') // 点击前解绑，防止点击事件触发多次
      echartsMap.on('dblclick', (params) => {
        // 绑定单击下钻
        const mapName = params.name
        // this.timeFn && clearTimeout(this.timeFn);
        // this.timeFn = setTimeout(() => {
        // 只下钻到省级，如果当前是最后一级(省级)，那就直接return，不继续下钻
        if (!mapName || this.levelList.length > 1) {
          // alert('已经是最后一级');
          return
        }
        // 单击切换到省级地图，当mapData有值,说明可以切换到下级地图
        // const curMapCode = this.mapCode[mapName];
        // const mapData = await this.getGeoJson(curMapCode);
        // if (!mapData) {
        //   this.$message.warning('无此区域地图显示');
        //   //  alert('无此区域地图显示');
        //   return;
        // }
        this.levelList.push(mapName) // 记录下钻层级
        echartsMap && echartsMap.clear() // 清空图例数据，不影响图例的resize，而且能够释放内存，切换的时候就很顺畅
        this.tooltipIndex = 0
        this.initMap(mapName)
        // }, 100);
      })
    },
    // 返回上一级
    handleBack(mapName) {
      if (mapName !== '中国') {
        return
      }
      this.levelList.pop()
      this.tooltipIndex = 0
      echartsMap && echartsMap.clear() // 清空画布，重新绘制
      this.initMap(this.rootName)
    },
    // 自定义Tooltip样式
    formatTooltip(params) {
      // this.tooltipIndex = params.dataIndex
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
    },
    // 拖曳移动
    handleGeoRoam() {
      echartsMap.off('georoam') // 优化，避免重复绑定多个事件
      echartsMap.on('georoam', (params) => {
        const option = echartsMap.getOption() // 获得option对象
        const target = option.series || [] // option.geo
        if (!target.length) {
          return
        }
        let geo1Center = [this.axis.x, this.axis.yGeo1]
        let geo2Center = [this.axis.x, this.axis.yGeo2]
        if (target[0].center && target[0].center.length) {
          const x = target[0].center[0]
          const y = target[0].center[1]
          geo1Center = [x, y + 0.014]
          geo2Center = [x, y + 0.024]
        }
        if (params.zoom != null && params.zoom !== undefined) {
          // 捕捉到缩放时
          // 下层geo的缩放等级跟着顶层一起改变
          const zoom = target[0].zoom
          option.geo[0].zoom = zoom
          option.geo[1].zoom = zoom
          option.geo[2].zoom = zoom
          // 下层的geo的中心位置随着顶层一起改变
          // option.series[0].center = target[0].center;
          option.geo[0].center = target[0].center
          option.geo[1].center = geo1Center
          option.geo[2].center = geo2Center
        } else {
          // 捕捉到拖曳时，下层的geo的中心位置随着顶层一起改变
          option.geo[0].center = target[0].center
          option.geo[1].center = geo1Center
          option.geo[2].center = geo2Center
        }
        echartsMap.setOption(option) // 设置option
      })
    },
    // echarts事件处理
    handleTooltip() {
      // 图表上的事件
      // 鼠标悬浮，停止轮播
      echartsMap.off('mouseover')
      echartsMap.on('mouseover', (params) => {
        // 清除其他地方的高亮
        if (this.tooltipIndex !== params.dataIndex) {
          echartsMap &&
            echartsMap.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              dataIndex: this.tooltipIndex
            })
        }
        clearInterval(this.intervalFn)
      })
      // 鼠标离开，开始轮播
      echartsMap.off('mouseout')
      echartsMap.on('mouseout', () => {
        this.autoShowTip() // 开始轮播
      })
      // 图表容器的事件（包括图表上的空白处）
      const zRender = echartsMap.getZr()
      // 鼠标在容器上移动
      // zRender.on('mousemove', () => {
      //    clearInterval(this.intervalFn);
      // });
      // 移出图表容器
      zRender.on('globalout', () => {
        this.autoShowTip() // 开始轮播
      })
    },
    // 自动轮播
    autoShowTip() {
      clearInterval(this.intervalFn)
      // 用定时器控制高亮
      this.intervalFn = setInterval(() => {
        if (!echartsMap) {
          return
        }
        // 清除上一个地图区块的高亮
        echartsMap.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.tooltipIndex
        })
        this.tooltipIndex++
        // 当前地图区块高亮
        echartsMap.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.tooltipIndex
        })
        // 当前tooltip 跟随显示
        echartsMap.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.tooltipIndex
        })
        const dataLength = this.curMapJson.features.length
        if (this.tooltipIndex > dataLength) {
          this.tooltipIndex = 0
        }
      }, 3000)
    }
  }
}
</script>
<style lang="scss">
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
.map2D-wrap {
  color: rgba(138, 248, 239, 0.548);
  position: relative;
  width: 100%;
  .level-list {
    position: absolute;
    top: 0;
    left: 0;
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

    // 背景
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
.map2D-box {
  background: #000;
  width: 100%;
  height: 750px;
  overflow: hidden;
  /* transform: skew(10deg, 10deg); */
  /* transform:rotateX(3deg); */
}
</style>
