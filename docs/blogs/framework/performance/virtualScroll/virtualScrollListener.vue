<template>
  <!-- 可视区域的容器 -->
  <div ref="listRef" class="infinite-list-container" @scroll="scrollEvent($event)">
    <!-- 【容器内的占位，高度为总列表高度，用于形成滚动条】 -->
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>
    <!-- 【列表项的渲染区域】 -->
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        ref="itemsRef"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirtualList',
  props: {
    // //所有列表数据
    // listData: {
    //   type: Array,
    //   default: () => []
    // },
    // 【每项高度】
    itemSize: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      //
      listData: [], //所有列表数据
      //
      screenHeight: 0, //可视区域高度
      startOffset: 0, //偏移量
      start: 0, //起始索引
      end: null //结束索引
    }
  },
  computed: {
    // 【列表总高度=数据总数*每项的高度】
    listHeight() {
      return this.listData.length * this.itemSize
    },
    // 【可显示的列表项数=屏幕高度/每项的高度】
    visibleCount() {
      return Math.ceil(this.screenHeight / this.itemSize) // Math.ceil对一个数进行上舍入,返回值大于或等于给定的参数
    },
    // 偏移量对应的style
    getTransform() {
      // transform: translate3d(x, y, z);
      return `translate3d(0,${this.startOffset}px,0)` // 【向上平移的距离】
    },
    // 获取真实显示列表数据：截取开始索引到结束索引之间的数据
    visibleData() {
      return this.listData.slice(this.start, Math.min(this.end, this.listData.length))
    }
  },
  mounted() {
    this.initData()
    this.screenHeight = this.$refs.listRef.clientHeight //可视区域高度固定
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  methods: {
    initData() {
      for (let i = 0; i < 1000; i++) {
        this.listData.push({ id: i, value: i })
      }
    },
    // 滚动事件
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.listRef.scrollTop //滚动条滚动的距离
      console.log('【 scrollTop 】-81', scrollTop)
      //此时的开始索引=滚动条已经滚动的高度/数据项的高度
      this.start = Math.floor(scrollTop / this.itemSize)
      //此时的结束索引=开始索引+列表可显示数量
      this.end = this.start + this.visibleCount
      //此时的偏移量=滚动的高度-滚动的高度%每项的高度
      this.startOffset = scrollTop - (scrollTop % this.itemSize) //
      // 直接写成this.startOffset = scrollTop就没有滚动上去的动画效果????
      console.log('【 scrollTop % this.itemSize 】-88', scrollTop % this.itemSize)
      console.log('【 this.end 】-89', scrollTop, this.end, this.startOffset)
    }
  }
}
</script>

<style scoped lang="scss">
.infinite-list-container {
  height: 300px;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;

  .infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
  }

  .infinite-list {
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    text-align: center;

    .infinite-list-item {
      padding: 0 10px;
      color: #555;
      box-sizing: border-box;
      border-bottom: 1px solid #999;
    }
  }
}
</style>
