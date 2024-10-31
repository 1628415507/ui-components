<template>
  <div class="percentage-bar">
    <div class="legend-wrap flex-sc">
      <div v-for="item in chartList" class="flex-sc legend-item">
        <div class="legend-dot" :style="{ background: item.color }"></div>
        {{ item.name }}
      </div>
    </div>
    <div class="bar-wrap flex-sc">
      <div
        v-for="(item, index) in chartList"
        class="flex-sc bar-item"
        :style="{
          width: getPercentage(item),
          'z-index': chartList.length - index,
          right: getOffset(item, index),
        }"
      >
        <div class="bar" :style="{ background: item.color }"></div>
      </div>
    </div>
    <div class="label-wrap flex-s">
      <div
        v-for="(item, index) in chartList"
        class="label-item flex-s"
        :style="{ width: getPercentage(item) }"
      >
        {{ item.value }} <span class="percentage">{{ getPercentage(item) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartList: [],
    };
  },
  watch: {
    list: {
      handler(newVal) {
        this.chartList = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    total() {
      return this.chartList.reduce((preVal, curItem) => {
        return preVal + curItem.value;
      }, 0);
    },
  },
  mounted() {},
  methods: {
    getOffset(item, index) {
      console.log('【 item, index 】-62', item, index);
    },
    getPercentage(item) {
      let percentage = ((item.value / this.total) * 100).toFixed(0);
      return percentage + '%';
    },
  },
};
</script>

<style scoped lang="scss">
.flex-s {
  display: flex !important;
  justify-content: flex-start;
}

.flex-sc {
  display: flex !important;
  align-items: center;
}
.percentage-bar {
  height: 75px;
  .legend-wrap {
    .legend-item {
      font-size: 12px;
      color: rgba(108, 116, 130, 1);
      margin-right: 20px;
      .legend-dot {
        border-radius: 50%;
        margin-right: 5px;
        width: 8px;
        height: 8px;
      }
    }
  }
  .bar-wrap {
    margin-top: 12px;
    width: 100%;
    .bar-item {
      position: relative;
      &:not(:first-child) {
        margin-left: -10px;
      }
      .bar {
        width: 100%;
        height: 14px;
        border-radius: 20px;
      }
    }
  }
  .label-wrap {
    margin-top: 15px;
    .label-item {
      margin-right: 5px;
      color: rgba(56, 56, 56, 1);
      font-size: 14px;
      line-height: 17px;
      min-width: 12px;
      &:nth-child(1) {
        min-width: 30px;
      }
      &:nth-child(2) {
        min-width: 50px !important;
      }
      &:last-child {
        justify-content: flex-end;
      }
      .percentage {
        margin-left: 6px;
        font-size: 12px;
        color: rgba(108, 116, 130, 1);
      }
    }
  }
}
</style>
