<template>
  <div ref="list" :style="{ height }" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div ref="phantom" class="infinite-list-phantom"></div>
    <div ref="content" class="infinite-list">
      <div class="infinite-list-item" ref="items" :id="item._index" :key="item._index" v-for="item in visibleData">
        <slot ref="slot" :item="item.item">{{ item._index }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualList',
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => []
    },
    //预估高度
    estimatedItemSize: {
      type: Number,
      required: true
    },
    // 缓冲区数据与可视区数据的比例
    bufferScale: {
      type: Number,
      default: 1
    },
    //容器高度 100px or 50vh
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //起始索引
      start: 0,
      //结束索引
      end: 0,
      //用于列表项渲染后存储每一项的高度以及位置信息，
      positions: [
        // {
        //   top:0,
        //   bottom:100,
        //   height:100
        // }
      ]
    }
  },
  computed: {
    _listData() {
      return this.listData.map((item, index) => {
        return {
          _index: `_${index}`,
          item
        }
      })
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize)
    },
    // 可视区上方渲染条数
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount)
    },
    // 可视区下方渲染条数
    belowCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount)
    },
    // 真实渲染数据
    visibleData() {
      let start = this.start - this.aboveCount
      let end = this.end + this.belowCount
      return this._listData.slice(start, end)
    }
  },
  created() {
    this.initPositions()
    window.vm = this
  },
  mounted() {
    this.screenHeight = this.$el.clientHeight
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  // 由于需要在渲染完成后，获取列表每项的位置信息并缓存，所以使用钩子函数updated来实现
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return
      }
      //获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize()
      //更新列表总高度
      let height = this.positions[this.positions.length - 1].bottom //列表高度实际就等于列表中最后一项的底部距离列表顶部的位置。
      this.$refs.phantom.style.height = height + 'px'
      //更新真实偏移量
      this.setStartOffset()
    })
  },
  methods: {
    // 在初始时根据estimatedItemSize对positions进行初始化。
    initPositions() {
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize, //预估高度
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      }))
    },
    //获取列表起始索引
    getStartIndex(scrollTop = 0) {
      // 由于缓存数据本身就是有顺序的，所以获取开始索引的方法可以考虑通过二分查找的方式来降低检索次数：
      return this.binarySearch(this.positions, scrollTop) //二分法查找
      // 元素底部位置等于滚动条位置的时候，即索引开始位置
      // let item = this.positions.find((i) => i && i.bottom > scrollTop)
      // return item.index
    },
    binarySearch(list, value) {
      let start = 0
      let end = list.length - 1
      let tempIndex = null

      while (start <= end) {
        let midIndex = parseInt((start + end) / 2)
        let midValue = list[midIndex].bottom //
        if (midValue === value) {
          return midIndex + 1
        } else if (midValue < value) {
          start = midIndex + 1
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }
      return tempIndex
    },
    //获取列表项的当前尺寸
    updateItemsSize() {
      let nodes = this.$refs.items
      nodes.forEach((node) => {
        let rect = node.getBoundingClientRect()
        let height = rect.height
        let index = +node.id.slice(1)
        let oldHeight = this.positions[index].height
        let dValue = oldHeight - height
        //存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue
          this.positions[index].height = height
          // 更新后续项的位置信息
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom
            this.positions[k].bottom = this.positions[k].bottom - dValue
          }
        }
      })
    },
    //获取当前的偏移量
    setStartOffset() {
      let startOffset
      if (this.start >= 1) {
        let size =
          this.positions[this.start].top -
          (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0)
        startOffset = this.positions[this.start - 1].bottom - size
      } else {
        startOffset = 0
      }
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`
    },
    //滚动事件
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop
      // let startBottom = this.positions[this.start - ]
      //此时的开始索引
      this.start = this.getStartIndex(scrollTop)
      //此时的结束索引
      this.end = this.start + this.visibleCount
      console.log('【  this.end 】-172', this.end)
      //此时的偏移量
      this.setStartOffset()
    }
  }
}
</script>

<style scoped>
.infinite-list-container {
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

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
}

.infinite-list-item {
  padding: 5px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
  /* height:200px; */
}
</style>
