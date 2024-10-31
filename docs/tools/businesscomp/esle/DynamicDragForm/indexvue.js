// <!--
//  * @Description: 动态表单
//  * @Date: 2024-07-19 14:37:20
//  * @LastEditTime: 2024-08-26 13:23:28
// -->
// <template>
//   <el-form ref="dynamicFormRef" :model="formValue" label-position="top">
//     <!-- 1. 已筛选选项 -->
//     <div class="selected-box">
//       <!-- 1.1 左侧拖拽部分 -->
//       <draggable
//         ref="selectedBoxRef"
//         :disabled="dragDisabled"
//         itemKey="rtmDynaLayoutId"
//         :group="dragGroup"
//         :list="selectedConfigList"
//         ghost-class="ghost"
//         :handle="handleClassName"
//         filter=".forbid"
//         class="drag-content selected-box-left"
//         :force-fallback="true"
//         chosen-class="chosenClass"
//         animation="300"
//         :sort="true"
//         :fallback-class="true"
//         :fallback-on-body="true"
//         :touch-start-threshold="50"
//         :fallback-tolerance="50"
//         :move="onMove"
//         @start="startSelectedDrag"
//         @end="endSelectedDrag"
//       >
//         <template #item="{ element }">
//           <DragItem class="drag-item" :formValue="formValue" :element="element"></DragItem>
//         </template>
//       </draggable>
//       <!-- 1.2 右侧按钮 -->
//       <div class="selected-box-right">
//         <el-button type="primary" @click="handleQuery()">查询</el-button>
//         <el-button type="default" @click="handleReset">重置</el-button>
//         <el-button icon="Filter" style="width: 20px" @click="handleUnselectedBoxVisible"></el-button>
//         <el-popover popper-style="padding: 0 !important;" placement="bottom-start" :width="240" trigger="click">
//           <template #reference>
//             <el-button style="width: 18px">
//               <svg-icon icon-class="more" size="15px" />
//             </el-button>
//             <!-- <el-button icon="MoreFilled" style="width: 18px"></el-button> -->
//           </template>
//           <div class="template-popper">
//             <div class="template-popper-list">
//               <div v-for="(temp, index) in templateList" :key="temp.templateId" class="flex-sb template-popper-item">
//                 <span class="txt ellipsis" @click="clickTemplate(temp)">{{ temp.templateName }}</span>
//                 <div class="edit-icon" @click="editTemplate(temp)"></div>
//                 <el-icon class="icon-btn" @click.stop="deleteTemplate(temp, index)"><Delete /></el-icon>
//               </div>
//             </div>
//             <div class="template-popper-button">
//               <el-icon><CirclePlus /></el-icon>
//               <el-button type="primary" link @click="addTemplate('popover')">增加方案</el-button>
//             </div>
//           </div>
//         </el-popover>
//       </div>
//     </div>
//     <!-- 2. 未筛选选项 -->
//     <div v-show="unselectedBoxVisible" class="unselected-box">
//       <!-- 2.1 更多筛选 -->
//       <div class="box-title flex-sb" style="width: 200px">
//         更多筛选
//         <el-divider direction="vertical"></el-divider>
//         <span class="tips flex-sb">
//           <el-icon><Setting /></el-icon>
//           自定义顶部信息项
//         </span>
//       </div>
//       <draggable
//         :disabled="dragDisabled"
//         itemKey="rtmDynaLayoutId"
//         :group="groupName"
//         :list="unselectedConfigList"
//         ghost-class="ghost"
//         :handle="handleClassName"
//         filter=".forbid"
//         class="drag-content unselected"
//         :sort="true"
//         :force-fallback="true"
//         chosen-class="chosenClass"
//         animation="300"
//         :fallback-class="true"
//         :fallback-on-body="true"
//         :touch-start-threshold="50"
//         :fallback-tolerance="50"
//         :move="onMove"
//         @start="startUnselectedDrag"
//         @end="endUnselectedDrag"
//       >
//         <template #item="{ element }">
//           <DragItem class="drag-item" :formValue="formValue" :element="element"></DragItem>
//         </template>
//       </draggable>
//       <!-- 2.2 模板 -->
//       <div class="box-title">模板</div>
//       <div class="flex-sb">
//         <div class="template-list">
//           <div
//             v-for="(temp, index) in getTemplateList()"
//             :key="temp.templateId"
//             class="template-item flex-sb"
//             :class="{ active: activeTemplate == temp.templateId }"
//             @click="clickTemplate(temp)"
//           >
//             <div class="txt ellipsis">
//               <EditLabel v-model="temp.templateName" trigger="icon" />
//             </div>
//             <el-icon class="icon-btn" @click.stop="deleteTemplate(temp, index)"><Delete /></el-icon>
//           </div>
//         </div>
//         <!-- 2.3 按钮 -->
//         <div class="template-button">
//           <el-popover
//             v-if="templateList.length > tempLimit"
//             teleported
//             popper-style="padding: 0 !important;"
//             placement="bottom-start"
//             :width="240"
//             trigger="click"
//           >
//             <template #reference>
//               <el-button icon="CaretBottom" style="width: 18px"></el-button>
//             </template>
//             <div class="template-popper">
//               <div class="template-popper-list">
//                 <div
//                   v-for="(temp, index) in getTemplateList('more')"
//                   :key="temp.templateId"
//                   class="flex-sb template-popper-item"
//                 >
//                   <span class="txt ellipsis" @click="clickTemplate(temp)">{{ temp.templateName }}</span>
//                   <div class="edit-icon" @click="editTemplate(temp)"></div>
//                   <el-icon class="icon-btn" @click.stop="deleteTemplate(temp, index)"><Delete /></el-icon>
//                 </div>
//               </div>
//             </div>
//           </el-popover>
//           <el-popover :visible="tempNamePopoverVisible" width="220" placement="top">
//             <template #reference>
//               <el-button type="primary" link @click="addTemplate()">另存新模版</el-button>
//             </template>
//             <el-form
//               ref="tempNameFormRef"
//               :model="tempNameForm"
//               :rules="tempNameFormRules"
//               label-position="top"
//               class="template-name-popper"
//               hide-required-asterisk
//             >
//               <!-- <el-icon class="icon-btn" @click.stop="tempNamePopoverVisible = false"><Close /></el-icon> -->
//               <el-form-item label="模板名称" style="width: 100%" prop="templateName">
//                 <el-input v-model="tempNameForm.templateName" placeholder=" " style="width: 100%" />
//               </el-form-item>
//               <div style="float: right">
//                 <el-button type="primary" size="small" @click="confirmTempAdd()">确定</el-button>
//                 <el-button type="default" size="small" @click.stop="tempNamePopoverVisible = false">取消</el-button>
//               </div>
//             </el-form>
//           </el-popover>
//           <el-button type="primary" link @click="saveTemplate()" :disabled="activeTemplate == -1">保存</el-button>
//           <!-- <el-button type="primary" @click="handleQuery()">查询</el-button> -->
//           <el-button type="default" @click="handleCancel">取消</el-button>
//         </div>
//       </div>
//     </div>
//     <!-- 3.查询时显示有值的未筛选项 -->
//     <div v-show="!unselectedBoxVisible" class="query drag-content unselected">
//       <DragItem
//         v-for="element in unselectedConfigHasValueList"
//         class="drag-item"
//         :formValue="formValue"
//         :element="element"
//       ></DragItem>
//     </div>
//   </el-form>
// </template>
// <script setup lang="ts">
// import SvgIcon from '@/components/SvgIcon/index.vue'
// import { Ref, ref, defineEmits, defineProps, computed, onMounted } from 'vue'
// import draggable from 'vuedraggable' //导入draggable组件
// import EditLabel from './EditLabel.vue'
// import DragItem from './DragItem.vue'
// import { mockData, templateListMock } from './mock.js' //mock数据
// import type { FormInstance, FormRules } from 'element-plus'
// import { ElMessage, ElMessageBox } from 'element-plus'
// // const { proxy } = getCurrentInstance()
// // proxy.$modal.msgError('上传图片失败')

// const emits = defineEmits()
// const props = defineProps({
//   formValue: {
//     type: Object,
//     default: () => {}
//   }
// })
// // ---------------- 筛选框 ----------------
// interface ConfigIF {
//   rtmDynaLayoutId: number // | string
//   rtmDynamicLayoutElementLists: any[]
// }
// const RANGE_TYPE = {
//   start: 'Start',
//   end: 'End'
// }
// const dynamicFormRef = ref<FormInstance>()
// const allConfigList = ref<ConfigIF[]>([]) //所有筛选项列表
// const selectedConfigList = ref<ConfigIF[]>([]) //已筛选列表
// const selectedLimit = 10 //可挑选的数量
// const unselectedConfigList = ref<ConfigIF[]>([]) //未筛选列表
// const unselectedConfigHasValueList = ref<ConfigIF[]>([]) //未筛选列表中有值的选项
// const unselectedBoxVisible = ref<boolean>(false) //筛选框是否显示
// // 已筛选的选项id
// const selectedIds = computed<number[]>(() => {
//   return selectedConfigList.value.map((item) => item.rtmDynaLayoutId)
// })
// // 获取表单项绑定的字段
// function getFormProps(list: ConfigIF[]) {
//   let arr: string[] = []

//   list.forEach((item) => {
//     item.rtmDynamicLayoutElementLists.forEach((it) => {
//       arr.push(`${it.fieldProp}${RANGE_TYPE[it.rangeType] || ''}`)
//     })
//   })
//   return arr
// }
// // 已筛选的表单项字段
// const selectedProps = computed<string[]>(() => {
//   return getFormProps(selectedConfigList.value)
// })
// // 未筛选的表单项字段
// const unselectedProps = computed<string[]>(() => {
//   return getFormProps(unselectedConfigList.value)
// })
// // 获取未筛选列表中有值的选项
// function getHasValueList() {
//   return unselectedConfigList.value.filter((item: ConfigIF) => {
//     return item.rtmDynamicLayoutElementLists.some((it) => {
//       return props.formValue[it.fieldProp]
//     })
//   })
// }

// // ---------------- 模板列表 ---------------
// interface TemplateIF {
//   templateId: number
//   templateName: string
//   childrenRtmDynamicLayouts: ConfigIF[]
// }
// const templateList = ref<TemplateIF[]>([]) //模板列表
// const activeTemplate = ref<number>(-1) //当前激活的模板
// let tempLimit = 6
// // ---------------- 模板名称弹窗 ----------------
// interface TemplateFormIF {
//   templateName: string
// }
// const tempNameFormRef = ref<FormInstance>()
// const tempNamePopoverVisible = ref<boolean>(false) //模板名称弹窗
// const tempNameForm = ref<TemplateFormIF>({ templateName: '' })
// const groupName: string = 'dragGroup' //拖拽组名称
// const tempNameFormRules = ref<FormRules<TemplateFormIF>>({
//   templateName: [{ required: true, message: '值不能为空' }]
// })

// // ---------------- 拖拽配置 ----------------
// const selectedBoxRef = ref()
// const handleClassName = '.el-form-item__label'
// //是否禁用拖拽
// const dragDisabled = computed<boolean>(() => {
//   return !unselectedBoxVisible.value
// })
// const dragGroup = ref({
//   name: groupName,
//   //是否允许拖入
//   put: () => {
//     return selectedConfigList.value.length < selectedLimit //最多maxNum个
//   },
//   pull: () => {
//     return selectedConfigList.value.length > 1 // 至少留一个
//   }
// })
// let dragFlag = 0 //判断拖拽的时候是否已经满10个
// // 判断鼠标是否在div内
// function isInside(event: MouseEvent, $target: Ref) {
//   // console.log('【 event, $el 】-266', event, $target.$el)
//   const { clientX, clientY } = event // 获取鼠标相对于页面的位置
//   let targetEl = $target.$el
//   const rect = targetEl?.getBoundingClientRect() // 获取div的位置和大小
//   const { left, right, top, bottom } = rect
//   // 判断鼠标是否在div内
//   return clientX >= left && clientX <= right && clientY >= top && clientY <= bottom
// }
// // 已筛选框-拖拽开始的事件
// const startSelectedDrag = (event) => {
//   console.log('【 event 】-302', event)
//   if (selectedConfigList.value.length == 1) {
//     ElMessage.warning('至少需要1个选项')
//   }
//   event.originalEvent.preventDefault()
//   console.log('已筛选框-拖拽开始的事件')
// }

// // 已筛选框-拖拽结束的事件
// const endSelectedDrag = () => {
//   if (selectedConfigList.value.length < selectedLimit) {
//     dragFlag = 0
//   }
//   console.log('已筛选框-拖拽结束的事件', selectedConfigList.value, unselectedConfigList.value)
// }
// // 未筛选框-拖拽开始的事件
// const startUnselectedDrag = () => {
//   // console.log('未筛选框-拖拽开始的事件', selectedConfigList.value.length)
// }
// // 未筛选框-拖拽结束的事件
// const endUnselectedDrag = (params: any) => {
//   let $target = selectedBoxRef.value
//   if (isInside(params.originalEvent, $target) && selectedConfigList.value.length == selectedLimit) {
//     dragFlag++
//     if (dragFlag > 1) {
//       ElMessage.warning(`最多${selectedLimit}个选项`)
//     }
//   }
//   console.log('未筛选框-拖拽结束的事件', selectedConfigList.value.length)
// }
// const onMove = (e, originalEvent: MouseEvent) => {
//   //不允许停靠
//   if (e?.relatedContext?.element?.disabledPark == true) return false
//   return true
// }

// // 初始化数据
// function init() {
//   // 获取筛选数据
//   const formConfig: any[] = []
//   mockData.forEach((item) => {
//     item.childrenRtmDynamicLayouts.forEach((subItem) => {
//       subItem.rtmDynamicLayoutElementLists = subItem.rtmDynamicLayoutElementLists.map((element) => {
//         //  组装绑定的字段
//         element.fieldProp = `${element.propertyName}${RANGE_TYPE[element.rangeType] || ''}`
//         return element
//       })
//       formConfig.push(subItem)
//     })
//   })
//   allConfigList.value = JSON.parse(JSON.stringify(formConfig))
//   selectedConfigList.value = JSON.parse(JSON.stringify(formConfig.splice(0, 5)))
//   unselectedConfigList.value = allConfigList.value.filter((item) => !selectedIds.value.includes(item.rtmDynaLayoutId))
//   // 获取模板数据
//   templateList.value = templateListMock as any
//   // templateList.value = [...templateListMock, ...templateListMock, ...templateListMock, ...templateListMock] as any
// }
// // 重置
// function handleReset() {
//   dynamicFormRef.value?.resetFields()
// }
// function getTemplateList(type?: string) {
//   if (type == 'more') {
//     return templateList.value.slice(tempLimit, templateList.value.length)
//   } else {
//     return templateList.value.slice(0, tempLimit)
//   }
// }
// // 模版-点击
// function clickTemplate(temp: TemplateIF) {
//   activeTemplate.value = temp.templateId
//   selectedConfigList.value = JSON.parse(JSON.stringify(temp.childrenRtmDynamicLayouts))
//   const list = allConfigList.value.filter((item) => !selectedIds.value.includes(item.rtmDynaLayoutId))
//   unselectedConfigList.value = JSON.parse(JSON.stringify(list))
// }
// // 模板-编辑
// function editTemplate(item: TemplateIF) {
//   clickTemplate(item)
//   unselectedBoxVisible.value = true
// }
// // 模版-新增
// function addTemplate(type?: string) {
//   // console.log('【 selectedConfigList 】-263', selectedConfigList)
//   if (type == 'popover') {
//     // 增加方案
//     unselectedBoxVisible.value = true
//   } else {
//     tempNamePopoverVisible.value = true // 另存新模板
//   }
// }
// // 模版-新增-确认
// function confirmTempAdd() {
//   console.log('【 selectedConfigList 】-307', selectedConfigList)
//   tempNameFormRef.value?.validate((valid: boolean, fields) => {
//     if (!valid) {
//       return
//     }
//     const newTemplate: TemplateIF = {
//       templateId: Math.random(),
//       templateName: tempNameForm.value.templateName,
//       childrenRtmDynamicLayouts: selectedConfigList
//     }
//     templateList.value.push(newTemplate)
//     activeTemplate.value = newTemplate.templateId
//     tempNamePopoverVisible.value = false
//     tempNameFormRef.value?.resetFields()
//     ElMessage.success('保存成功')
//   })
// }
// // 模板-删除
// function deleteTemplate(item: TemplateIF, index: number) {
//   ElMessageBox.confirm('是否确认删除？', '提示', {
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//     type: 'Warning'
//   })
//     .then(() => {
//       templateList.value.splice(index, 1)
//       ElMessage.success('删除成功')
//     })
//     .catch(() => {})
// }

// // 模版-保存
// function saveTemplate() {
//   templateList.value.forEach((item: TemplateIF) => {
//     console.log('【 item 】-333', item)
//     if (item.templateId == activeTemplate.value) {
//       item.childrenRtmDynamicLayouts = selectedConfigList.value
//     }
//   })
//   ElMessage.success('保存成功')
// }
// function handleUnselectedBoxVisible() {
//   unselectedBoxVisible.value = !unselectedBoxVisible.value
// }
// // 获取选项值
// function getPropsValue(propsList: string[]) {
//   const obj = reactive<any>({})
//   for (let prop of propsList) {
//     if (props.formValue[prop]) {
//       obj[prop] = props.formValue[prop]
//     }
//   }
//   return obj
// }
// // 查询
// function handleQuery() {
//   let selectedData = getPropsValue(selectedProps.value) // 已筛选的选项值
//   let unselectedData = getPropsValue(unselectedProps.value) // 未筛选的选项值
//   const params = {
//     fullData: props.formValue, //所有值
//     selectedData, // 已筛选的选项值
//     unselectedData // 未筛选的选项值
//   }
//   unselectedConfigHasValueList.value = getHasValueList()
//   unselectedBoxVisible.value = false

//   emits('query', params)
// }
// // 取消
// function handleCancel() {
//   unselectedBoxVisible.value = false
// }
// onMounted(() => {
//   init()
//   //解决拖动会选中文字的问题
//   document.onselectstart = function () {
//     console.log('【 onselectstart 】-320')
//     return false
//   }
// })
// </script>
// <style lang="scss" scoped>
// $themeColor: #2b8181;
// .el-button + .el-button {
//   margin-left: 6px;
// }

// /* .itxst {
//   background-color: #f1f1f1;
//   padding: 20px;
// } */
// // 已筛选样式
// @media (max-width: 1366px) {
//   .selected-box-left {
//     width: calc(100% - 220px) !important;
//     // overflow: hidden;
//   }
//   .selected-box-right {
//     width: 220px !important;
//     margin-top: 22px;
//     text-align: right;
//   }
// }

// .selected-box {
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   // $rightW: 210px;
//   $rightW: 275px;
//   .selected-box-left {
//     width: calc(100% - $rightW);
//     // overflow: hidden;
//   }
//   .selected-box-right {
//     width: $rightW;
//     margin-top: 22px;
//     text-align: right;
//   }
// }
// .flex-sb {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

// .template-popper {
//   .template-popper-list {
//     max-height: 230px;
//     overflow: auto;
//   }
//   .template-popper-item {
//     padding: 0px 16px;
//     box-sizing: border-box;
//     width: 100%;
//     height: 46px;
//     line-height: 46px;
//     font-size: 14px;

//     .txt {
//       width: calc(100% - 50px);
//     }
//     &:hover {
//       background: #eff6f7;
//       cursor: pointer;
//     }
//   }
//   .template-popper-button {
//     margin: auto 20px;
//     padding: 5px 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-top: 1px solid rgba(240, 240, 240, 1);
//     text-align: center;
//     color: $themeColor;
//     .edit-icon:hover {
//       color: $themeColor !important;
//     }
//   }
// }
// // 超出省略号
// .ellipsis {
//   overflow: hidden;
//   display: inline-block;
//   text-overflow: ellipsis;
//   text-wrap: nowrap;
// }

// .edit-icon {
//   top: 1px;
//   margin-right: 3px;
//   height: 12px;
//   width: 12px;
//   background: url('./lib/editPen.svg') no-repeat center top / cover;
//   &:hover {
//     background: url('./lib/editPenHover.svg') no-repeat center top / cover;
//   }
// }
// .icon-btn {
//   color: rgba(51, 54, 61, 0.65);
//   &:hover {
//     color: $themeColor !important;
//     cursor: pointer;
//   }
// }
// .template-name-popper {
//   position: relative;
//   .icon-btn {
//     position: absolute;
//     top: 0px;
//     right: 0px;
//   }
// }
// // 未筛选样式
// .unselected-box {
//   margin-top: 12px;
//   padding: 10px 16px;
//   box-sizing: border-box;
//   width: 100%;
//   background: #ffffff;
//   border: 1px solid #f0f0f0;
//   // 标题
//   .box-title {
//     margin-bottom: 5px;
//     position: relative;
//     font-size: 16px;
//     font-weight: 500;
//     letter-spacing: 0px;
//     color: rgba(79, 79, 79, 1);
//     padding-left: 8px;

//     &::before {
//       content: '';
//       position: absolute;
//       left: 0px;
//       top: 5px;
//       width: 4px;
//       height: 13px;
//       background: $themeColor;
//     }
//     .tips {
//       width: 110px;
//       font-size: 12px;
//       font-weight: 400;
//       color: rgba(128, 128, 128, 1);
//     }
//   }
//   // 模板
//   $btnW: 250px;
//   .template-list {
//     display: flex;
//     // flex-wrap: wrap;
//     // background: #eeeeee;
//     width: calc(100% - $btnW);
//     .template-item {
//       margin-right: 20px;
//       // margin-bottom: 10px;
//       box-sizing: border-box;
//       padding: 0px 10px;
//       width: calc(100% / 6); // 147px;
//       height: 40px;
//       line-height: 40px;
//       border-radius: 4px;
//       font-size: 14px;
//       border: 1px solid rgba(51, 54, 61, 0.25);

//       .txt {
//         width: calc(100% - 20px);
//       }
//       &.active,
//       &:hover {
//         background: #eff6f7;
//         border: 1px solid $themeColor;
//         color: #2b8181 !important;
//         cursor: pointer;
//       }
//     }
//   }

//   .template-button {
//     // padding-top: 10px;
//     // border-top: 1px solid rgba(217, 217, 217, 1);
//     width: $btnW;
//     text-align: right;
//     .icon {
//       color: rgba(51, 54, 61, 0.65);
//     }
//   }
// }
// .drag-content {
//   width: 100%;
//   display: grid;
//   grid-template-columns: repeat(5, 19.4%);
//   gap: 0px 9px;
//   &.unselected {
//     grid-template-columns: repeat(6, 16.2%);
//   }
//   &.query {
//     // width: calc(100% - 41px);
//   }
//   :deep(.el-form-item) {
//     margin-bottom: 1px !important;
//   }
// }

// // .item > label:hover {
// //   cursor: move;
// // }

// // 元素放置时的样式
// .ghost {
//   border: dashed 1px $themeColor !important;
//   background: #eff6f6;
// }
// // 被选中目标的样式元素拖动时的样式
// .chosenClass {
//   opacity: 1;
//   cursor: move !important;
//   // border: solid 1px red;
// }
// // .fallbackClass {
// //   background-color: aquamarine;
// // }
// </style>
