<!--
 * @Description: 
 * @Date: 2023-10-09 17:38:03
 * @LastEditTime: 2023-10-09 17:43:52
-->
<template>
  <div class="control-box">
    <div class="control-box__top">
      <div class="top-item">
        <span class="label">实际轨迹：</span>
        <span class="line" style="background: #7277eb"></span>
      </div>
      <div class="top-item">
        <span class="label">预计轨迹：</span>
        <span class="line" style="background: #409eff"></span>
      </div>
    </div>
    <div class="control-box__bottom">
      轨迹回放控制
      <div class="control-box__content">
        <el-button round size="small" @click="emitEvent('start')">开始动画</el-button>
        <el-button round size="small" @click="emitEvent('pause')">暂停动画</el-button>
        <el-button round size="small" @click="emitEvent('resume')">继续动画</el-button>
        <el-button round size="small" @click="emitEvent('stop')">停止动画</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ControlBox',
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {},
  methods: {
    emitEvent(eventName) {
      console.log('【 eventName 】-42', eventName)
      this.$emit(eventName)
    }
  }
}
</script>
<style lang="scss" scoped>
.control-box {
  z-index: 100;
  position: absolute;
  right: 10px;
  bottom: 20px;
  width: 300px;
  padding: 15px;
  background: white;
  border: 1px solid #dcdfe6 !important;
  font-size: 14px;
  .control-box__top {
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    .top-item {
      span {
        display: inline-block;
      }
      .label {
        width: 80px;
      }
      .line {
        height: 8px;
        width: 100px;
      }
    }
  }
  .control-box__bottom {
    text-align: left;
    line-height: 30px;
    .control-box__content {
      .el-button:first-child {
        margin-left: 10px;
      }
      display: grid;
      grid-template-columns: 49% 49%;
      grid-template-rows: 2;
      grid-gap: 10px;
    }
  }
}
</style>
