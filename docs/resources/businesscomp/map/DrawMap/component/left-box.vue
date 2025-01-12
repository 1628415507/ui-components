<!--
 * @Description: 区域划分-左侧部分
 * @Date: 2023-09-25 11:50:19
 * @LastEditTime: 2025-01-03 18:21:05
-->

<template>
  <div class="left-box">
    <!-- 查询 -->
    <div class="top-wrap">
      <div class="search-wrap">
        <el-input v-model="keyword" clearable placeholder="请输入区域名称查询" size="small">
          <!-- <el-button slot="append" type="primary" size="small" icon="el-icon-search" @click="searchList()"></el-button> -->
        </el-input>
        <el-button type="primary" size="small" style="width: 100%; margin-top: 5px" @click="searchList()">查询 </el-button>
      </div>
      <!-- 按钮 -->
      <div class="btn-wrap area-item">
        <div>
          共
          <span style="color: #036564">{{ districtList ? districtList.length : 0 }}</span>
          片区域
        </div>
        <div class="flex-sb">
          <el-button
            v-if="openAdministrativeArea"
            type="primary"
            size="small"
            style="width: 47%"
            @click="addDistrictItem()"
          >
            新增行政区域
          </el-button>
          <el-button v-if="openGeofencing" type="primary" size="small" @click="addGeofencing()" style="width: 47%">
            新增GIS地理围栏
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list-wrap">
      <div
        v-for="(item, index) in districtList"
        :key="item.areaId + index"
        @click="clickDistrictItem(item)"
        class="area-item"
        :class="{ active: districtItem.areaId === item.areaId }"
      >
        <div class="ellipsis" :title="item.areaName">范围名称：{{ item.areaName }}</div>
        <div>范围类型：{{ AREA_TYPE_CN[item.areaType] }}</div>
        <div v-if="item.areaType === AREA_TYPE.AREA">行政区域级别：{{ AREA_TYPE_CN[item.areaType] }}</div>
        <div v-if="item.areaType === AREA_TYPE.GIS">GIS类型：{{ SHAPE_CN[item.shape] }}</div>
        <div class="item-btn">
          <el-button type="text" style="color: #036564" @click.stop="clickDistrictItem(item, true)">编辑</el-button>
          <el-button type="text" style="color: red" @click.stop="deleteListItem(item)">删除</el-button>
        </div>
      </div>
    </div>
    <!-- 弹框 -->
    <div class="bottom-wrap">
      <DistrictBox
        v-if="areaVisible"
        :visible.sync="areaVisible"
        :AMap="AMap"
        :editData="districtItem"
        @confirm="confirmDistrict"
        @changeSelect="changeDistrict"
        @cancel="cancelDistrict"
      />
      <GeofencingBox
        v-if="lnglatVisible"
        :info="districtItem"
        @confirm="confirmGeofencing"
        @cancel="cancelGeofencing"
      />
    </div>
  </div>
</template>

<script>
import DistrictBox from './district-box.vue'
import GeofencingBox from './geofencing-box.vue'
import { AREA_TYPE, AREA_TYPE_CN, SHAPE, SHAPE_CN } from '../config.js'

export default {
  name: 'LeftBox',
  components: {
    DistrictBox,
    GeofencingBox
  },
  props: {
    AMap: {
      type: Object,
      default: () => {} //地图对象
    },
    shapeInfo: {
      type: Object,
      default: () => {} //图形信息
    },
    dataList: {
      type: Array,
      default: () => [] //全部区域数据集合
    },
    openAdministrativeArea: {
      type: Boolean,
      default: false //打开新增行政区域按钮
    },
    openGeofencing: {
      type: Boolean,
      default: false //打开新增GIS地理围栏按钮
    }
  },
  data() {
    return {
      SHAPE,
      SHAPE_CN,
      AREA_TYPE,
      AREA_TYPE_CN,
      // 弹框
      isEditing: false,
      areaVisible: false,
      lnglatVisible: false,
      // 列表
      keyword: '',
      originList: [],
      districtList: [],
      originDistrictItem: {}, //当前点击对象未编辑前的数据
      districtItem: {} //当前点击对象的数据
    }
  },
  watch: {
    shapeInfo: {
      deep: true,
      handler(val) {
        this.districtItem = val
      }
    },
    dataList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.originList = val
        this.searchList(val)
      }
    }
  },
  computed: {},
  mounted() {
    this.initDistrictList()
  },
  methods: {
    // 获取列表数据
    initDistrictList() {
      this.originList = this.dataList
      this.districtList = this.dataList
    },
    // 列表-查询
      searchList() {
      if (this.keyword) {
        this.districtList = this.originList.filter((item) => {
          return item.areaName.indexOf(this.keyword) > -1
        })
      } else {
        this.districtList = this.originList
        console.log('【 this.districtList 】-166', this.districtList)
      }
    },
    // 行政区域-新增
    async addDistrictItem() {
      let isContinue = await this.beforeClick()
      if (!isContinue) {
        return
      }
      this.isEditing = true
      this.districtItem = {
        layerKey: Math.random(),
        areaName: '',
        areaType: AREA_TYPE.AREA,
        countryCode: '中国',
        provinceCode: '',
        cityCode: '',
        districtCode: ''
      }
      this.areaVisible = true
      this.lnglatVisible = false
      this.$emit('addDistrict', this.districtItem)
    },
    // 行政区域-下拉变化
    changeDistrict(obj) {
      this.$emit('changeDistrict', obj)
    },
    // 行政区域-保存
    confirmDistrict(obj) {
      this.isEditing = false
      this.$emit('confirmDistrict', obj)
    },
    cancelDistrict() {
      if (this.districtItem.areaId) {
        this.$emit('clickItem', this.originDistrictItem, false)
      }
      this.isEditing = false
      this.$emit('cancelDistrict')
    },
    // 地理围栏-新增
    async addGeofencing() {
      let isContinue = await this.beforeClick({})
      if (!isContinue) {
        return
      }
      this.isEditing = true
      this.districtItem = {
        layerKey: Math.random(),
        areaType: AREA_TYPE.GIS,
        center: {},
        radius: '',
        path: [],
        southWest: {},
        northEast: {}
      }
      this.areaVisible = false
      this.lnglatVisible = true
      this.$emit('addGeofencing', this.districtItem)
    },
    // 地理围栏-保存
    confirmGeofencing(saveObj) {
      this.isEditing = false
      this.lnglatVisible = false
      this.$emit('confirmGeofencing', saveObj)
    },
    // 地理围栏-取消
    cancelGeofencing() {
      //已存在的图层-恢复原样
      if (this.districtItem.areaId) {
        this.$emit('clickItem', this.originDistrictItem, false)
      }
      this.isEditing = false
      this.lnglatVisible = false
      this.$emit('cancelGeofencing')
    },
    beforeClick(item = {}) {
      return new Promise((resolve) => {
        const originDistrictItem = this.originDistrictItem || {}
        console.log('【 beforeClick-originDistrictItem 】-220', originDistrictItem, item)
        //  && this.districtItem.layerKey !== item.layerKey
        if (this.isEditing) {
          this.$confirm('当前操作未保存，是否确认取消？', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          })
            .then((res) => {
              debugger
              if (item?.areaId && originDistrictItem?.areaId !== item?.areaId) {
                this.$emit('clickItem', originDistrictItem, false)
                resolve(true)
              } else {
              }
              resolve(true)
              // this.$emit('clickItem', this.districtItem, false);
            })
            .catch(() => {
              resolve(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    // 列表项-点击、编辑
    async clickDistrictItem(item, isEdit = false) {
      // debugger;
      let isContinue = await this.beforeClick(item)
      if (!isContinue) {
        return
      }
      this.originDistrictItem = { ...item } //JSON.parse(JSON.stringify(item));
      this.districtItem = { ...item } //JSON.parse(JSON.stringify(item));
      this.isEditing = isEdit
      if (item.areaType === AREA_TYPE.GIS) {
        this.lnglatVisible = isEdit
        this.areaVisible = false
      } else {
        this.lnglatVisible = false
        this.areaVisible = isEdit
      }
      this.$emit('clickItem', item, isEdit)
    },
    // 列表项-删除
    deleteListItem(item) {
      this.$confirm('是否确认删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.districtItem.areaId === item.areaId) {
          this.lnglatVisible = false
          this.areaVisible = false
        }
        this.$emit('deleteListItem', item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$topIndex: 999;
$topH: 180px;
$bottomH: 270px;

.left-box {
  z-index: $topIndex;
  position: absolute;
  top: 0;
  left: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 300px;
  height: 100%;
  // background: red;
  line-height: 30px !important;
  .top-wrap {
    height: $topH;
    // background: red;
    .search-wrap {
      margin: 10px auto;
    }
    .btn-wrap {
      text-align: left;
    }
  }
  .active {
    border: 1px solid #036564 !important;
  }
  .area-item {
    cursor: pointer;
    margin: 10px auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    padding: 10px 15px;
    min-height: 90px;
    line-height: 25px;
    box-sizing: border-box;
    width: 100%;
    box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.3);
    border: 1px solid #fff;
    .ellipsis {
      width: 100%;
      // overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .list-wrap {
    margin: 10px auto;
    margin-top: 0px;
    width: 100%;
    min-height: 100px;
    height: 100%;
    // max-height: calc(100% - $topH - $bottomH - 40px);
    overflow: auto;
    text-align: left;
    .area-item {
      .item-btn {
        text-align: right;
        line-height: 17px;
        .el-button {
          padding: 0px !important;
        }
      }
    }

    // background: yellow;
  }
  .bottom-wrap {
    // margin-top: 20px;
    // position: absolute;
    // bottom: 10px;
    width: 100%;
    // height: $bottomH;
    // background: red;
  }
}
.flex-sb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<style lang="scss">
.v-modal {
  background: transparent !important;
}
</style>
