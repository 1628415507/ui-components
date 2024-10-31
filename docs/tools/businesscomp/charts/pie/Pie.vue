<!--
 * @Description:
 * @Date: 2024-10-22 10:00:09
 * @LastEditTime: 2024-10-31 14:41:37
-->
<template>
  <div ref="pieRef" style="width: 600px; height: 200px"></div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  components: {},
  data() {
    return {
      seriesPie: [
        { name: '项目1', value: 38 },
        { name: '项目2', value: 12 }
      ]
    }
  },
  methods: {
    getPiePercentage() {
      let val = 0
      const total = this.seriesPie.reduce((preVal, curItem) => {
        if (curItem.name == '项目1') {
          val = curItem.value
        }
        return preVal + curItem.value
      }, 0)
      let percentage = ((val / total) * 100).toFixed(0)
      console.log('【 val / total 】-213', val, total)
      return percentage + '%'
    },
    // 饼图
    renderPieChart() {
      const chart = echarts.init(this.$refs.pieRef)
      const seriesMap = this.seriesPie
      const options = {
        color: ['#4f4db2', '#9594eb'],
        tooltip: {
          trigger: 'item'
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
        title: {
          text: this.getPiePercentage(),
          subtext: '项目1',
          left: 'center',
          top: '31%',
          textStyle: {
            fontSize: 23,
            color: 'rgba(56, 56, 56, 1)',
            align: 'center'
          },
          subtextStyle: {
            fontFamily: 'SourceHanSans',
            lineHeight: 0,
            fontSize: 14,
            color: 'rgba(56, 56, 56, 1)'
          }
        },
        series: {
          name: '统计',
          type: 'pie',
          radius: ['50%', '70%'], //饼图的半径
          center: ['50%', '40%'], // 调整饼图位置
          avoidLabelOverlap: true,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: seriesMap
        }
      }

      chart.setOption(options)
      window.addEventListener('resize', function () {
        chart.resize()
      })
    }
  },
  mounted() {
    this.renderPieChart()
  }
}
</script>

<style lang="scss" scoped></style>
