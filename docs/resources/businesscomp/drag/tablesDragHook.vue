<template>
  <div class="distribution-wrap flex-column">
    <div class="tables-wrap flex-sb flex-auto">
      <z-info-card header="已配" class="card-wrap">
        <vxe-table
          id="vxeTableId-assignedTable-01"
          ref="assignedTableRef"
          show-overflow
          :row-config="{ useKey: true }"
          min-height="200px"
          height="200px"
          size="mini"
          :data="assignedTableData"
          border
          resizable
          align="center"
        >
          <vxe-column type="seq" title="序号" width="60" align="center"></vxe-column>
          <vxe-column field="grossWeight" title="毛重"></vxe-column>
          <vxe-column field="num" title="件数"></vxe-column>
          <vxe-column field="volume" title="体积"></vxe-column>
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
          min-height="200px"
          height="200px"
          :row-config="{ useKey: true }"
          resizable
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
import { VxeTable, VxeColumn } from 'vxe-table'
import 'vxe-table/lib/style.css'
import { watch, ref, onMounted, nextTick } from 'vue'
import { tableData2 } from './mock/data.js'

import { useTablesDrag } from '../../../../src/hooks'

const assignedTableData = ref([])
const assignedTableRef = ref()
const unAssignedTableRef = ref()
const unAssignedTableData = ref(JSON.parse(JSON.stringify(tableData2)))
// 拖拽结束的时候触发的事件
function dragEndTable() {
  console.log('【 拖拽结束的时候触发的事件 】-111')
}
function initDrag() {
  useTablesDrag([assignedTableRef.value, unAssignedTableRef.value], {
    // 拖拽结束的时候触发的事件
    dragEnd: () => {
      dragEndTable()
    }
  })
}
watch([assignedTableRef, unAssignedTableRef], () => {
  if (assignedTableRef.value && unAssignedTableRef.value) {
    initDrag()
  }
})

onMounted(() => {
  nextTick(() => {
    initDrag()
  })
})
</script>

<style scoped lang="scss">
.distribution-wrap {
  height: 250px;
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
./tableDrag/useTablesDrag.js./mock/data.js
