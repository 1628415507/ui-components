<!--
 * @Description: 
 * @Date: 2025-01-02 16:17:47
 * @LastEditTime: 2025-01-02 17:22:05
-->
<template>
  <div class="distribution-wrap flex-column">
    <vxe-toolbar ref="toolbarRef" class="custom-toolbar" custom style="margin-left: auto"></vxe-toolbar>
    <vxe-table
      id="vxeTableId-assignedTable-01"
      ref="xTableRef"
      show-overflow
      :row-config="{ useKey: true }"
      min-height="200px"
      height="200px"
      size="mini"
      :data="assignedTableData"
      border
      resizable
      align="center"
      :customConfig="(() => customConfig(xTableRef))()"
      @custom="toolbarCustomEvent"
      @resizable-change="resizableChange"
      @menuClick="menuConfig.menuClickEvent"
    >
      <vxe-column type="seq" title="序号" width="60" align="center"></vxe-column>
      <vxe-column field="grossWeight" title="毛重"></vxe-column>
      <vxe-column field="num" title="件数"></vxe-column>
      <vxe-column field="volume" title="体积"></vxe-column>
    </vxe-table>
  </div>
</template>
<script setup>
import { VxeToolbar, VxeTable, VxeColumn } from 'vxe-table'
import 'vxe-table/lib/style.css'
import { watch, ref, onMounted, nextTick } from 'vue'
import { tableData2 } from './mock/data.js'

import { useSaveTableParams } from '../../../../src/hooks'
const { initTableConfig, resizableChange, menuConfig, toolbarCustomEvent, customConfig } = useSaveTableParams()

const assignedTableData = ref(JSON.parse(JSON.stringify(tableData2)))
const xTableRef = ref()
const toolbarRef = ref()

onMounted(() => {
  initTableConfig(xTableRef.value, toolbarRef.value)
})
</script>

<style scoped lang="scss"></style>
