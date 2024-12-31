<template>
  <div class="distribution-wrap flex-column">
    <div class="tables-wrap flex-sb flex-auto">
      <z-info-card header="已配" class="card-wrap">
        <vxe-table
          id="vxeTableId-assignedTable-01"
          ref="assignedTableRef"
          show-overflow
          :row-config="{ useKey: true }"
          height="200px"
          size="mini"
          :data="assignedTableData"
          border
          resizable
          align="center"
          :showFooter="true"
        >
          <vxe-column type="seq" title="序号" width="60" align="center"></vxe-column>
          <vxe-column field="grossWeight" title="毛重" width="60px"></vxe-column>
          <vxe-column field="num" title="件数" width="60px"></vxe-column>
          <vxe-column field="volume" title="体积" width="60px"></vxe-column>
        </vxe-table>
      </z-info-card>
      <z-info-card header="未配" class="card-wrap">
        <vxe-table
          id="vxeTableId-unAssignedTable-01"
          ref="unAssignedTableRef"
          show-overflow
          :data="unAssignedTableData"
          size="mini"
          border
          align="center"
          height="200px"
          :row-config="{ useKey: true }"
          resizable
          :showFooter="true"
        >
          <vxe-column type="seq" title="序号" width="60" align="center"></vxe-column>
          <vxe-column field="grossWeight" title="毛重"></vxe-column>
          <vxe-column field="num" title="件数"></vxe-column>
          <vxe-column field="volume" title="体积"></vxe-column>
        </vxe-table>
      </z-info-card>
    </div>
  </div>
</template>
<script setup>
import { reactive, watch, ref, onMounted, onUnmounted, nextTick } from 'vue'
// 引入vxe-table的公共配置方法
import { tableData2 } from './tableDrag/data.js'
import { initTablesDrag } from './tableDrag/tablesDrag.js'
import { VXETable, VxeTable, VxeColumn } from 'vxe-table'

const assignedTableData = ref([])
const assignedTableRef = ref()
const unAssignedTableRef = ref()
const unAssignedTableData = ref(JSON.parse(JSON.stringify(tableData2)))
onMounted(() => {})
// 计算列表
function calculateList() {
  console.log('【 calculateList 】-111')
}
function initDrag() {
  initTablesDrag([assignedTableRef.value, unAssignedTableRef.value], {
    // 拖拽结束的时候触发的事件
    dragEnd: () => {
      calculateList()
    }
  })
}
watch([assignedTableRef, unAssignedTableRef], () => {
  if (assignedTableRef.value && unAssignedTableRef.value) {
    initDrag()
  }
})
</script>

<style scoped lang="scss">
.distribution-wrap {
  height: 300px;
  overflow: hidden;
  .tables-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .card-wrap {
      width: 49.5%;
      height: calc(100% - 10px);
    }
  }
}
</style>
