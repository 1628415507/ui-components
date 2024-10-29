<!--
 * @Description: 
 * @Date: 2024-10-28 09:50:13
 * @LastEditTime: 2024-10-29 10:33:58
-->
<template>
  <div class="z-countdown-wrap">
    <div class="countdown">
      <span class="num">{{ hour }}</span>
      <span class="delimiter">:</span>
      <span class="num">{{ min }}</span>
      <span class="delimiter">:</span>
      <span class="num">{{ second }}</span>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, defineProps, computed, defineEmits, onMounted, onUnmounted, nextTick } from 'vue'
const props = defineProps({
  endTime: {
    type: String,
    default: ''
  },
  endText: {
    type: String,
    default: '活动已结束'
  }
})

const timer = ref(null)
const hour = ref('')
const min = ref('')
const second = ref('')
const finish = ref(false)
watch(
  () => props.endTime,
  (newVal) => {
    clearInterval(timer.value)
    countdown(props.endTime)
  },
  { immediate: true, deep: true }
)
function countdown(timestamp) {
  timer.value = setInterval(() => {
    let nowTime = new Date()
    let endTime = new Date(timestamp)
    let diff = endTime.getTime() - nowTime.getTime()
    if (diff > 0) {
      let day = Math.floor(diff / 86400000)
      let h = Math.floor((diff / 3600000) % 24)
      let m = Math.floor((diff / 60000) % 60)
      let sec = Math.floor((diff / 1000) % 60)
      h = day * 24 + h
      h = h < 10 ? '0' + h : h
      m = m < 10 ? '0' + m : m
      sec = sec < 10 ? '0' + sec : sec
      hour.value = h
      min.value = m
      second.value = sec
    } else {
      hour.value = '00'
      min.value = '00'
      second.value = '00'
      clearInterval(timer.value)
      this.finish = true
    }
  }, 1000)
}
onMounted(() => {
  countdown(props.endTime)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
.z-countdown-wrap {
  width: 200px;
  .countdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 29.5px;
    height: 39px;
    .num {
      font-family: var(--iv-font);
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      height: 39px;
      border-radius: 6.55px;
      background: rgba(235, 87, 87, 1);
      padding: 3px 7px 3px 7px;
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
