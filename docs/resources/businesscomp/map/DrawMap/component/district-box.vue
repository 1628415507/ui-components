<!--
 * @Description: 行政区域弹框
 * @Date: 2023-09-22 15:57:35
 * @LastEditTime: 2023-10-11 15:09:05
-->
<template>
  <div class="area-box-wrap">
    <div class="box-content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="70px"
        label-position="left"
        :inline-message="true"
        :hide-required-asterisk="true"
        size="small"
      >
        <el-form-item prop="areaName">
          <template slot="label">
            片区名称
            <span style="color: red">*</span>
          </template>
          <el-input v-model="formData.areaName" maxlength="15" class="form-item__input"></el-input>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select v-model="formData.countryCode" placeholder="请选择" class="form-item__input">
            <el-option label="中国" value="中国"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省市区" prop="provinceCode">
          <el-select
            v-model="formData.provinceCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changeProvince"
            class="form-item__input"
          >
            <el-option
              v-for="item in provincesList"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地级市" prop="cityCode">
          <el-select
            v-model="formData.cityCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changeCity"
            class="form-item__input"
          >
            <el-option v-for="item in cityList" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区县" prop="districtCode">
          <el-select
            v-model="formData.districtCode"
            placeholder="请选择"
            clearable
            filterable
            @change="changeDistrict"
            class="form-item__input"
          >
            <el-option
              v-for="item in districtList"
              :key="item.adcode"
              :label="item.name"
              :value="item.adcode"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="box-footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">保存</el-button>
    </div>
  </div>
</template>
<script>
import { AREA_TYPE, LEVEL } from '../config.js'
export default {
  name: 'AreaBox',
  props: {
    AMap: {
      type: Object,
      default: () => {} //地图对象
    },
    // 编辑信息
    editData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 地图
      district: null,
      // 下拉数据
      provincesList: [], // 存储省份数据
      cityList: [],
      districtList: [],
      // 表单
      formData: {
        areaName: '',
        areaType: AREA_TYPE.AREA,
        countryCode: '中国',
        provinceCode: '',
        cityCode: '',
        districtCode: ''
      },
      rules: {
        areaName: [{ required: true, message: '请输入片区名称', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    editData: {
      deep: true,
      handler(obj) {
        console.log('【 watch-editData 】-114', obj)
        this.initData(obj)
      }
    }
  },
  mounted() {
    // 初始化地图查询  //注意：需要使用插件同步下发功能才能这样直接使用
    this.district = new this.AMap.DistrictSearch({
      subdistrict: 1, //返回下一级行政区
      showbiz: false //最后一级返回街道信息
    })
    // 初始化数据
    this.initData(this.editData)
  },
  methods: {
    // 初始化数据
    async initData(obj) {
      if (obj.areaId) {
        // 编辑-获取下拉信息
        // this.$refs['formRef'].resetFields();
        const { provinceCode, cityCode, districtCode, ...rest } = obj
        this.formData = rest
        await this.initSelectList()
        this.formData = JSON.parse(JSON.stringify(obj))
      } else {
        this.getProvinces() // 在组件挂载后调用获取省份数据的方法
        this.formData = JSON.parse(JSON.stringify(obj))
        this.resetNextLevelInfo(LEVEL.PROVINCE)
      }
    },
    emitEvent() {
      this.$emit('changeSelect', this.formData)
    },
    // 初始化下拉数据
    initSelectList() {
      return new Promise(async (resolve) => {
        const selectListInfo = [
          // { level: LEVEL.COUNTRY, levelEn: 'country', listName: 'countryList', prop: 'countryCode', parentProp: '' },
          {
            level: LEVEL.PROVINCE,
            levelEn: 'province',
            listName: 'provincesList',
            prop: 'provinceCode',
            parentProp: 'countryCode'
          },
          { level: LEVEL.CITY, levelEn: 'city', listName: 'cityList', prop: 'cityCode', parentProp: 'provinceCode' },
          {
            level: LEVEL.DISTRICT,
            levelEn: 'district',
            listName: 'districtList',
            prop: 'districtCode',
            parentProp: 'cityCode'
          }
        ]
        let flag = LEVEL.COUNTRY
        let level = ''
        selectListInfo.forEach(async (item) => {
          if (this.editData[item.parentProp]) {
            level = item.level
            this[item.listName] = await this.getAMapData(this.editData[item.parentProp], item.levelEn)
            flag++
          }
          if (flag === level) {
            // 获取已选下拉的下一级下拉数据
            if (level < LEVEL.DISTRICT) {
              const nextLevelItem = selectListInfo[level] || {}
              this[nextLevelItem.listName] = await this.getAMapData(
                this.editData[nextLevelItem.parentProp],
                nextLevelItem.levelEn
              )
            }
            resolve()
          }
        })
      })
    },
    // 重置下级信息
    resetNextLevelInfo(level) {
      // 省级不需要重置
      // 重置省级以下信息
      if (level < LEVEL.CITY) {
        this.formData.cityCode = ''
        this.cityList = []
      }
      if (level < LEVEL.DISTRICT) {
        this.formData.districtCode = ''
        this.districtList = []
      }
    },
    // 获取省市区下拉
    async getProvinces(countryCode = '中国') {
      this.provincesList = await this.getAMapData(countryCode, 'province')
    },
    // 省市区-变化
    async changeProvince(provinceCode) {
      this.resetNextLevelInfo(LEVEL.PROVINCE)
      this.emitEvent()
      this.cityList = await this.getAMapData(provinceCode, 'city')
    },
    // 地级市-变化
    async changeCity(cityCode) {
      this.resetNextLevelInfo(LEVEL.CITY)
      this.emitEvent()
      this.districtList = await this.getAMapData(cityCode, 'district')
    },
    // 区县-变化
    changeDistrict(districtCode) {
      this.emitEvent()
    },
    //行政区域下拉查询
    getAMapData(adcode = '中国', level = 'country') {
      return new Promise(async (resolve) => {
        if (!adcode) {
          resolve([])
          return
        }
        this.district.setLevel(level) //设置行政区级别
        this.district.search(adcode, (status, result) => {
          if (status === 'complete') {
            resolve(result.districtList[0].districtList)
          } else {
            const info = {
              province: '省市区',
              city: '地级市',
              district: '区县'
            }
            this.$message.error(`获取${info[level]}数据失败`)
            // this.getAMapData(adcode, level);
            console.error(`获取 ${info[level]} 数据失败`, adcode)
            resolve([])
          }
        })
      })
    },
    // 关闭弹框
    close() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
      this.formData = {}
    },
    // 确定
    handleConfirm() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.formData)
          this.$emit('update:visible', false)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.area-box-wrap {
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #dcdfe6 !important;
  .form-item__input {
    width: 100% !important;
  }
  .box-footer {
    text-align: center;
  }
  // 覆盖原有样式 /deep/
  .el-form-item {
    margin-bottom: 10px !important;
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
</style>
