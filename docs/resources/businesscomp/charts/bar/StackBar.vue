<!--
 * @Description:
 * @Date: 2024-10-22 10:00:09
 * @LastEditTime: 2024-10-31 14:31:34
-->
<template>
  <div ref="barRef" style="width: 600px; height: 200px"></div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  components: {},
  data() {
    return {
      seriesBar: [
        {
          name: '项目1',
          data: [80, 87, 61]
        },
        {
          name: '项目2',
          data: [80, 70, 60]
        },
        {
          data: [82, 73, 40],
          name: '项目3'
        },
        {
          name: '项目4',
          data: [52, 90, 50]
        }
      ]
    }
  },
  methods: {
    // 柱状图
    renderBarChart() {
      const chart = echarts.init(this.$refs.barRef)
      const series = this.seriesBar
      const seriesMap = series.map((item) => {
        return {
          ...item,
          type: 'bar',
          stack: 'a',
          barWidth: '41px',
          barMaxWidth: '41px',
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontSize: 10,
            // verticalAlign: 'middle',
            // padding: 0,
            // margin: 0,
            // lineHeight:35,
            // fontFamily: 'SourceHanSans',
            formatter: (params) => {
              const { value, dataIndex } = params
              const item = series[dataIndex]
              // 获取当前柱体的所有数据
              let arr = series.map((item) => {
                return item.data[dataIndex]
              })
              const total = arr.reduce((preVal, curVal) => {
                return preVal + curVal
              }, 0)
              let percentage = ((value / total) * 100).toFixed(0)
              return percentage + '%'
            }
          }
        }
      })
      const options = {
        color: ['#ff8a4a', '#9594eb', '#66d1ba', '#4f4db2'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          selectedMode: false, //是否可点击
          top: 'bottom', //显示在底部
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 20, // 图例间距
          icon: 'circle', // 图例项的 icon的形状
          textStyle: {
            color: 'rgba(108, 116, 130, 1)',
            fontSize: 12,
            fontFamily: 'SourceHanSans'
          }
        },
        grid: {
          left: '1%',
          top: '3%',
          right: '1%',
          bottom: '33px',
          containLabel: true //宽度包括标签
        },
        xAxis: {
          type: 'category',
          data: ['类目1', '类目2', '类目3'],
          axisLabel: {
            interval: 0,
            color: '#383838',
            fontSize: 12,
            fontFamily: 'SourceHanSans',
            margin: 16, // 刻度标签与轴线之间的距离。
            formatter: (value, index) => {
              // // 获取当前柱体的所有数据
              let arr = series.map((item) => {
                return item.data[index]
              })
              const total = arr.reduce((preVal, curVal) => {
                return preVal + curVal
              }, 0)
              return `{labelStyle|${value}}{subLabelStyle|(${total})}`
            },
            rich: {
              labelStyle: {
                color: 'rgba(56, 56, 56, 1)',
                fontSize: 12,
                fontFamily: 'SourceHanSans'
              },
              subLabelStyle: {
                color: 'rgba(128, 128, 128, 1)',
                fontSize: 12,
                fontFamily: 'SourceHanSans'
              }
            }
          },
          axisLine: {
            show: true, // 是否显示坐标轴轴线。
            lineStyle: {
              color: '#e5e5e5'
            }
          },
          // 坐标轴刻度相关设置。
          axisTick: {
            show: false // 是否显示坐标轴刻度。
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1, // 自动计算的坐标轴最小间隔大小。
          axisLabel: {
            color: '#999999',
            fontSize: 12,
            // fontFamily: 'SourceHanSans',
            margin: 16 // 刻度标签与轴线之间的距离。
          },
          splitLine: {
            show: false // 坐标轴在 grid 区域中的分隔线。
          },
          axisLine: {
            show: true, // 是否显示坐标轴轴线。
            lineStyle: {
              color: '#e5e5e5' //轴线颜色
            }
          },
          // 坐标轴刻度相关设置。
          axisTick: {
            show: false // 是否显示坐标轴刻度。
          }
        },
        series: seriesMap
      }

      chart.setOption(options)
      window.addEventListener('resize', function () {
        chart.resize()
      })
    },
    getPiePercentage() {
      let val = 0
      const total = this.seriesPie.reduce((preVal, curItem) => {
        if (curItem.name == '中标') {
          val = curItem.value
        }
        return preVal + curItem.value
      }, 0)
      let percentage = ((val / total) * 100).toFixed(0)
      console.log('【 val / total 】-213', val, total)
      return percentage + '%'
    }
  },
  mounted() {
    this.renderBarChart()
  }
}
</script>

<style lang="scss" scoped></style>
