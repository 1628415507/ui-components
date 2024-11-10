<template>
  <div>
    <el-button @click="nextSteps">下一步</el-button>
    <z-row-steps :active="active" :stepList="getStepsList()"></z-row-steps>
    <z-row-steps :active="1" :stepList="errorStepList"></z-row-steps>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const active = ref(1)//当前激活的步骤
const errorStepList= ref([
    {
        "title": "项目公告",
        "status": "finish "
    },
    {
        "title": "项目报价",
        "status": "finish "
    },
    {
        "title": "开标谈判",
        "status": "error"
    },
    {
        "title": "定标",
        "status": "wait"
    }
])
function nextSteps() {
  if (active.value < 4) {
    active.value++
  } else {
    active.value = 0
  }
}
function getStepsList(isError) {
  const nowStep = active.value
  let list = [{ title: '项目公告' }, { title: '项目报价' }, { title: '开标谈判' }, { title: '定标' }]
   list.map((item, index) => {
    if (index < nowStep) {
      item.status = 'finish ' //已完成
    } else if (index == nowStep) {
      item.status = 'process' //进行中
    } else {
      item.status = 'wait' //未开始
    }
    if (isError && index == nowStep) {
      item.status = 'error'
    }
    return item
  })
  console.log('【 list 】-24', list)
  return list
}
</script>
