<!--
 * @Description: 路径规划
 * @Date: 2024-01-08 14:03:06
 * @LastEditTime: 2024-01-19 16:48:55
-->

<template>
  <div class="path-planning">
    <!-- 路径规划 -->
    <div>
      <div class="box-content">
        <div>路径规划</div>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="70px"
          label-position="top"
          :inline-message="true"
          :hide-required-asterisk="true"
          size="small"
        >
          <el-form-item prop="originName">
            <template slot="label">起点</template>
            <el-input id="originId" v-model="formData.originName" class="form-item__input"></el-input>
          </el-form-item>
          <el-form-item prop="destinationName">
            <template slot="label">终点</template>
            <el-input
              id="destinationId"
              v-model="formData.destinationName"
              maxlength="15"
              class="form-item__input"
            ></el-input>
          </el-form-item>
          <div class="passing-points">
            <div class="title">途经点</div>
            <div class="point-list">
              <div class="item flex-sb" v-for="(item, index) in pointList" :key="index">
                <div class="place" :title="item.name">{{ item.name || '-' }}</div>
                <div class="flex-sb">
                  <div class="icon-btn flex-sb">
                    <i
                      v-if="index !== pointList.length - 1"
                      class="el-icon-bottom"
                      style="margin-right: auto"
                      @click.stop="handleIndex('down', item, index)"
                    ></i>
                    <i
                      v-if="index !== 0"
                      style="margin-left: auto"
                      class="el-icon-top"
                      @click.stop="handleIndex('up', item, index)"
                    ></i>
                  </div>
                  <el-button type="text" size="mini" style="color: red" @click.stop="deleteListItem(item, index)">
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="box-footer">
        <el-button type="primary" size="mini" @click="handlePlanRoute">路径规划</el-button>
        <el-button size="mini" @click="close">清空</el-button>
      </div>
    </div>
    <!-- 路径规划结果 -->
    <div class="plan-route">
      <div class="title">规划的路径</div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="item in STRATEGY" :key="item.code" :label="item.name" :name="item.code"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="info flex-sb">
        <span>{{ routeInfo.timeDesc || '-' }}</span>
        <span>{{ routeInfo.kmDistance || 0 }}公里</span>
        <span>{{ routeInfo.trafficLights || 0 }}个红绿灯</span>
      </div>
      <div class="btn">
        <el-button type="primary" size="mini" @click="handlePlanRoute">保存</el-button>
      </div>
    </div>
  </div>
</template>
<!-- <script src="//webapi.amap.com/ui/1.1/main-async.js"></script> -->
<script>
import { AMAP_CONFIG } from '../../mapConfig.js'
const amapKey = AMAP_CONFIG.key
import axios from 'axios'
export default {
  name: 'PathPlanning',
  props: {
    // pointList: {},
    AMap: {
      type: Object,
      default: () => {} //地图对象
    },
    map: {
      type: Object,
      default: () => {} //地图对象
    }
  },
  data() {
    return {
      // 表单
      formData: {
        originName: '',
        origin: [116.481028, 39.989643], // 起点经纬度
        destinationName: '',
        destination: [116.434446, 39.90816] // 终点经纬度
      },
      pointList: [
        { x: 118.054397, y: 24.409059, name: '厦门东渡同益码头-新港城客运站' },
        { x: 118.070377, y: 24.450229, name: '厦门轮渡码头2号厅-鼓浪屿三丘田码头' },
        { x: 118.181027, y: 24.490482, name: '吉联' },
        { x: 118.180426, y: 24.52169, name: '五缘湾' }
      ],
      rules: {
        originName: [{ required: true, message: '起点不能为空', trigger: 'blur' }],
        destinationName: [{ required: true, message: '终点不能为空', trigger: 'blur' }]
      },
      // 地图
      driving: null,
      placeSearch: null,
      // 驾车算路策略
      routeInfo: {},
      activeName: '32',
      STRATEGY: [
        { code: '32', name: '推荐路线', desc: '默认,高德推荐,同高德地图APP默认' },
        {
          code: '2',
          name: '最短路线',
          desc: '距离优先（只返回一条路线），仅走距离最短的路线，但是可能存在穿越小路/小区的情况'
        },
        { code: '35', name: '不走高速', desc: '' },
        { code: '0', name: '速度优先', desc: '（只返回一条路线）此路线不一定距离最短' },
        { code: '1', name: '费用优先', desc: '（只返回一条路线），不走收费路段，且耗时最少的路线' },
        { code: '3', name: '不走快速路', desc: '速度优先（只返回一条路线），不走快速路，例如京通快速路' },
        { code: '33', name: '躲避拥堵', desc: '' },
        { code: '34', name: '高速优先', desc: '' },
        { code: '36', name: '少收费', desc: '' },
        { code: '37', name: '大路优先', desc: '' },
        { code: '38', name: '速度最快', desc: '' },
        { code: '39', name: '躲避拥堵＋高速优先', desc: '' },
        { code: '40', name: '躲避拥堵＋不走高速', desc: '' },
        { code: '41', name: '躲避拥堵＋少收费', desc: '' },
        { code: '42', name: '少收费＋不走高速', desc: '' },
        { code: '43', name: '躲避拥堵＋少收费＋不走高速', desc: '' },
        { code: '44', name: '躲避拥堵＋大路优先', desc: '' },
        { code: '45', name: '躲避拥堵＋速度最快', desc: '' }
      ]
    }
  },
  computed: {},
  watch: {
    // pointList: {
    //     deep: true,
    //     handler(val) {
    //         // console.log('【 watch-editData 】-114', val);
    //         // this.initData(val);
    //     }
    // },
    AMap: {
      immediate: true,
      handler(val) {
        // console.log('【 driving 】-122', val);
        this.initDriving()
        this.initAutoComplete()
      }
    }
  },
  mounted() {},
  methods: {
    // 删除途经点
    deleteListItem(item, index) {
      this.$confirm('是否确认删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pointList.splice(index, 1)
      })
    },
    // 途经点排序
    handleIndex(type, item, index) {
      // console.log('【 handleIndex 】-202');
      // 向上移动
      if (type === 'up') {
        if (index === 0) {
          return
        }
        this.pointList.splice(index, 1)
        this.pointList.splice(index - 1, 0, item)
      }
      // 向下移动
      if (type === 'down') {
        if (index === this.pointList.length - 1) {
          return
        }
        this.pointList.splice(index, 1)
        this.pointList.splice(index + 1, 0, item)
      }
    },
    // 选择起点
    async handleOriginSelect(e, result) {
      // console.log('【 e,result 】-185', e, result);
      const res = await this.handelPlaceSearch(e)
      const { lat, lng } = res.location
      this.formData.origin = [lng, lat]
      // console.log('【 this.formData 】-221', this.formData);
    },
    // 选择终点
    async handleDestinationSelect(e, result) {
      // console.log('【 e,result 】-185', e, result);
      const res = await this.handelPlaceSearch(e)
      // console.log('【 handleDestinationSelect-res 】-208', res);
      const { lat, lng } = res.location
      this.formData.destination = [lng, lat]
      // console.log('【 this.formData 】-221', this.formData);
    },
    // 查询地址经纬度
    handelPlaceSearch(e) {
      return new Promise((resolve) => {
        this.placeSearch.setCity(e.poi.adcode)
        this.placeSearch.search(e.poi.name, (status, result) => {
          // console.log('【 status, result 】-211', status, result);
          if (status != 'complete') {
            // console.log('请求服务器超时');
            resolve({})
            return
          }
          const pois = result.poiList.pois
          resolve(pois[0])
        })
      })
    },
    // 输入框-地址查询
    initAutoComplete() {
      if (!this.AMap) {
        return
      }
      this.$nextTick(() => {
        this.placeSearch = new this.AMap.PlaceSearch({}) //构造地点查询类
        // 起点
        const originInput = new this.AMap.AutoComplete({
          input: 'originId'
        })
        // console.log('【 originInput 】-189', originInput);
        originInput.on('select', this.handleOriginSelect) //注册监听，当选中某条记录时会触发
        // 终点
        const destinationInput = new this.AMap.AutoComplete({
          input: 'destinationId'
        })
        // console.log('【 destinationInput 】-220', destinationInput);
        destinationInput.on('select', this.handleDestinationSelect) //注册监听，当选中某条记录时会触发
      })
    },
    initDriving() {
      if (!this.AMap) {
        return
      }
      // console.log('【  】-212');
      // 路径规划
      this.driving = new this.AMap.Driving({
        extensions: 'all',
        show_fields: 'traffic_lights',
        output: 'json'
        // show_fields: ['cost', 'traffic_lights'],
        // show_fields: 'cost', // ['cost.traffic_lights', 'distance', 'time', 'instruction', 'image'],
        // showTraffic: true // 是否显示实时交通图层
        // map: this.map,
        //驾车策略，包括 LEAST_TIME，LEAST_FEE, LEAST_DISTANCE,REAL_TRAFFIC
        // policy: AMap.DrivingPolicy.LEAST_TIME //时间最短
      })
      // console.log('【   路径规划-this.driving  】-207', this.driving);
    },
    handleClick(obj) {
      // console.log('【 handleClick 】-170', obj.name);
      // this.getPlanRoute();
      this.getRouteInfo()
    },
    // 初始化数据
    async initData(val) {
      this.pointList = val
    },
    // 关闭弹框
    close() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
      this.formData = {}
    },
    // 获取路径信息
    getRouteInfo() {
      const origin = this.formData.origin.join(',') // '116.481028,39.989643';
      const destination = this.formData.destination.join(',') //'116.434446,39.90816';
      const waypointsList = this.pointList.map((item) => `${item.x},${item.y}`)
      const waypoints = waypointsList.join(';') //'116.473168,39.993015;116.447126,39.953386'; // JSON.stringify(this.pointList); //'116.473168,39.993015;116.447126,39.953386'
      console.log('【 waypoints 】-296', waypoints)
      const queryStr = `&waypoints=${waypoints}&strategy=${this.activeName}&origin=${origin}&destination=${destination}&extensions=all`
      // &sdkversion=2.0.5.21&appname=http%253A%252F%252Flocalhost%253A9000%252F%2523%252F&csid=2120BBB2-3C76-49E5-BD20-2F459BC42339&jscode=eee454defe396cb372e260d7af55afd0&s=rsv3&ferry=0
      // `https://restapi.amap.com/v3/direction/driving?platform=JS&s=rsv3&logversion=2.0&key=${amapKey}&sdkversion=2.0.5.21&appname=http%253A%252F%252Flocalhost%253A9000%252F%2523%252F&csid=2120BBB2-3C76-49E5-BD20-2F459BC42339&jscode=eee454defe396cb372e260d7af55afd0&s=rsv3&ferry=0&callback=jsonp_251530_1704769022544_${queryStr}`
      axios
        .get(
          `https://restapi.amap.com/v3/direction/driving?platform=JS&s=rsv3&logversion=2.0&key=${amapKey}&sdkversion=2.0.5.21&csid=2120BBB2-3C76-49E5-BD20-2F459BC42339&jscode=eee454defe396cb372e260d7af55afd0&s=rsv3&ferry=0&callback=jsonp_251530_1704769022544_${queryStr}`
        )
        .then((response) => {
          const jsonp = response.data
          // // console.log('【 res 】-236', res);
          // 截取json内容
          const str1 = jsonp.substr(jsonp.indexOf('(') + 1)
          const str2 = str1.substr(0, str1.lastIndexOf(')'))
          const _res = JSON.parse(str2)
          // console.log('【 _res 】-241', _res);
          if (_res.status == '1') {
            // this.routeInfo = data.route;
            const info = _res.route.paths[0]
            const timeDesc = this.getTime(info.duration)
            const kmDistance = info.distance / 1000
            const trafficLights = info.traffic_lights
            // console.log('【   info 】-220', info);
            this.routeInfo = { timeDesc, kmDistance, trafficLights }
          } else {
            this.$message.error('获取规划路径失败')
          }

          // 请求成功，更新数据
        })
        .catch((error) => {
          // 请求失败，处理错误
          console.error('请求失败：', error)
        })
    },
    getTime(seconds) {
      const hour = Math.floor(seconds / 3600)
      const min = Math.floor((seconds % 3600) / 60)
      return `${hour}小时${min}分钟`
    },
    // getPlanRoute() {
    //     this.driving.setPolicy(this.activeName);
    //     this.driving.search(
    //         this.formData.origin,
    //         this.formData.destination,
    //         {
    //             extensions: 'all',
    //             output: 'json',
    //             show_fields: 'traffic_lights', // ['cost', 'traffic_lights'],
    //             waypoints: this.pointList //最多支持16个途径点
    //         },
    //         //  status为complete时，result为DrivingResult；
    //         // 当status为error时，result为错误信息info；当status为no_data时，代表检索返回0结果。
    //         (status, result) => {
    //             // console.log('【 result 】-218', result);
    //             // console.log('【 status, result 】-180', status, result);
    //             if (status === 'complete') {
    //                 const info = result.routes[0];
    //                 const timeDesc = this.getTime(info.time);
    //                 const kmDistance = info.distance / 1000;
    //                 const trafficLights = ''; //info.traffic_lights;
    //                 // console.log('【   info 】-220', info);
    //                 this.routeInfo = { timeDesc, kmDistance, trafficLights };
    //             } else {
    //                 //     this.map.setFitView();

    //                 console.error('【 获取规划路径失败 】-168');
    //             }
    //         }
    //     );
    // },
    // 路径规划
    handlePlanRoute() {
      // console.log('【 handlePlanRoute 】-164', this.driving);
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          // this.getPlanRoute();
          this.getRouteInfo()
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$themeColor: #008474;

.flex-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.path-planning {
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #dcdfe6 !important;
  font-size: 14px;
  line-height: 30px !important;
  .passing-points {
    margin-top: 20px;
    .title {
      line-height: 18px;
      border-left: 2px solid $themeColor;
      padding-left: 5px;
    }
    .point-list {
      .item {
        .place {
          overflow: hidden;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .icon-btn {
          margin: auto 10px;
          color: $themeColor;
          width: 30px;
        }
      }
    }
  }
  .box-footer {
    // text-align: center;
  }
  .form-item__input {
    width: 100% !important;
  }
  // 覆盖原有样式 /deep/
  .el-form-item {
    margin-bottom: 0px !important;
    .el-form-item__label {
      float: left !important;
      padding: 0px !important;
      // width: 100% !important;
    }
    .el-form-item__content {
      line-height: 14px !important;
      .el-form-item__error--inline {
        margin-left: 0px !important;
        text-align: left !important;
        width: 100% !important;
      }
    }
  }
}
.plan-route {
  .btn {
    width: 100%;
    text-align: right;
  }
}
</style>
