<template>
  <div class="search-tree">
    <div class="tree-top">
      <el-input
        v-model="searchName"
        @keyup.enter="handleSearch"
        v-uppercase="upperCase"
      />
    </div>
    <div class="tree-main">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :check-strictly="checkStrictly"
        :default-expand-all="defaultExpandAll"
        :default-expanded-keys="expandKeys"
        :default-checked-keys="defaultCheckedKeys"
        :highlight-current="true"
        :current-node-key="currentNodeKey"
        :expand-on-click-node="false"
        :show-checkbox="showCheckbox"
        @node-click="clickNode"
        @node-expand="expandNode"
        @node-collapse="collapseNode"
        @check="handleTreeCheck"
      >
        <template #default="{ node }">
          <span class="tree-label" :title="node.label" :id="`treeNode${node.data.id}`">
            {{ node.label }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, nextTick, onMounted, getCurrentInstance, watch } from 'vue'
import _ from 'lodash-es'

// 检查元素是否在视口中
function isElementInViewport($el: HTMLElement | null): boolean {
  if (!$el) return false
  const rect = $el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// 滚动元素到视图中
function scrollIntoView($el: HTMLElement | null) {
  nextTick(() => {
    !isElementInViewport($el) &&
      $el?.scrollIntoView({
        alignToTop: true,
        behavior: 'smooth', // 平滑滚动
        block: 'center', // 元素垂直居中
        inline: 'start' // 元素水平对齐父容器的起始位置
      })
  })
}

const { proxy } = getCurrentInstance()

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array,
    default: () => []
  },
  defaultCheckedKeys: {
    type: Array,
    default: () => []
  },
  defaultExpandAll: {
    type: Boolean,
    default: true
  },
  checkStrictly: {
    type: Boolean,
    default: false //是否取消关联
  },
  currentNodeKey: {
    type: String,
    default: null
  },
  upperCase: {
    type: Boolean,
    default: false
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
})

const defaultProps = { label: 'name', disabled: 'disabled' }

let treeData = ref([])
let expandKeys = ref([])

watch(
  () => props.data,
  (val) => {
    treeData.value = val
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => props.defaultExpandedKeys,
  (val) => {
    expandKeys.value = val
    // console.log(' expandKeys.value 】 -72', expandKeys.value)
  },
  {
    immediate: true,
    deep: true
  }
)

const emit = defineEmits(['search', 'nodeClick', 'check'])

// 搜索
const treeRef = ref()
const searchName = ref('')
let searchIndex = -1
let oldSearchName = ref('')
let searchNodes = []

function getSearchIds(treeData, arr = []) {
  treeData.forEach((item) => {
    if (item.name.includes(searchName.value)) {
      arr.push(item)
    }
    if (item.children?.length > 0) {
      getSearchIds(item.children, arr)
    }
  })
  return arr
}

// 原始搜索逻辑
function doSearch(e) {
  console.log('handleSearch', e)
  // 防止事件冒泡和默认行为
  e?.preventDefault()
  e?.stopPropagation()
  let val = searchName.value
  // 重新查询
  if (oldSearchName.value != val) {
    searchIndex = 0
    oldSearchName.value = val
    searchNodes = getSearchIds(treeData.value)
  } else {
    searchIndex++
  }
  if (searchIndex >= searchNodes.length) {
    searchIndex = 0
  }
  if (!searchNodes.length) {
    return
  }
  const obj = searchNodes[searchIndex]
  treeRef.value.setCurrentKey(obj.id)
  emit('search', searchNodes[searchIndex])
  const currentNode = treeRef.value.getCurrentNode(obj.id)
  const currentNodeElement = document.getElementById(`treeNode${currentNode.id}`)
  nextTick(() => {
    scrollIntoView(currentNodeElement)
  })
}

// 防抖处理的搜索函数
const handleSearch = _.debounce(doSearch, 300)

function clickNode(data) {
  emit('nodeClick', data)
}

function expandNode(data) {
  expandKeys.value.push(data.id)
}

function collapseNode(data) {
  let index = expandKeys.value.indexOf(data.id)
  if (index != null && index > 0) {
    expandKeys.value.splice(index)
  }
}

function handleTreeCheck(data, checkedInfo) {
  emit('check', data, checkedInfo)
}

function setCurrentKey(key) {
  nextTick(() => {
    treeRef.value.setCurrentKey(key)
  })
}

function getCurrentNode() {
  return treeRef.value.getCurrentNode()
}

function getCheckedKeys() {
  return treeRef.value.getCheckedKeys()
}

function getCheckedNodes() {
  return treeRef.value.getCheckedNodes()
}

function setCheckedKeys(keys) {
  treeRef.value.setCheckedKeys(keys)
}

// 重置树的状态到默认
function resetTreeState() {
  searchName.value = ''
  oldSearchName.value = ''
  searchNodes = []
  searchIndex = -1
  expandKeys.value = [...props.defaultExpandedKeys]
  if (treeRef.value) {
    treeRef.value.setCurrentKey(null)
  }
}

defineExpose({
  setCurrentKey,
  getCurrentNode,
  getCheckedKeys,
  setCheckedKeys,
  resetTreeState,
  getCheckedNodes
})
</script>

<style lang="scss" scoped>
.search-tree {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tree-top {
  margin-bottom: 5px;
}

.tree-main {
  flex: 1; //撑开
  overflow: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 和 Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari 和 Opera */
  }
}
</style>

