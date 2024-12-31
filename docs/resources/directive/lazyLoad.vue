<template>
  <div class="flex flex-wrap">
    触底：{{ count }}
    <el-select
      v-lazyLoad="{
        selector: `.${customSelector} .el-select-dropdown .el-select-dropdown__wrap`,
        loadMethod: handleScroll
      }"
      :popper-class="customSelector"
      v-model="value"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="Please enter a keyword"
      :remote-method="remoteMethod"
      style="width: 240px"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const customSelector = 'custom-select-popper'
interface ListItem {
  value: string
  label: string
}

const list = ref<ListItem[]>([])
const options = ref<ListItem[]>([])
const value = ref<string[]>([])
const loading = ref(false)

onMounted(() => {
  list.value = states.map((item) => {
    return { value: `value:${item}`, label: `label:${item}` }
  })
})
const count = ref(0)
function handleScroll() {
  console.log('触底加载')
  count.value++
}
const remoteMethod = (query: string) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    options.value = list.value.filter((item) => {
      return item.label.toLowerCase().includes(query.toLowerCase())
    })
  }, 200)
}

const states = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
]
</script>
