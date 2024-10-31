// {/* <template>
//   <div class="lr-container">
//     <!-- 左侧 -->
//     <div class="left-wrap">
//       <!-- 左侧-顶部-->
//       <div class="left-top">
//         <el-input v-model="searchName" placeholder="输入名称，按“回车”快速定位" @keyup.enter="handleSearch" />
//       </div>
//       <!-- 左侧-主体 -->
//       <div class="left-main">
//         <el-tree
//           ref="roleTreeRef"
//           class="ellipsis-tree"
//           :data="roleTreeData"
//           :props="defaultProps"
//           node-key="id"
//           :default-expanded-keys="defaultExpandKeys"
//           :current-node-key="roleCurrentNodeKey"
//           :highlight-current="true"
//           :default-expand-all="false"
//           :expand-on-click-node="false"
//           @node-click="clickRoleTree"
//           @node-expand="expandNode"
//           @node-collapse="collapseNode"
//         >
//           <template #default="{ node }">
//             <span class="tree-label" :title="node.label" :id="`treeNode${node.data.id}`">
//               {{ node.label }}
//             </span>
//           </template>
//         </el-tree>
//       </div>
//     </div>
//     <!-- 右侧 -->
//     <div class="right-wrap">
//       <!-- 右侧顶部 -->
//       <div class="right-top">
//         <el-button size="small" type="primary" @click="addSysRole()" v-hasPermi="['system:sysRoleManage:addSysRole']">
//           新增
//         </el-button>
//         <el-button size="small" type="primary" @click="save()">保存</el-button>
//         <el-button
//           size="small"
//           type="primary"
//           @click="importPopVisible()"
//           v-hasPermi="['system:sysRoleManage:importPopVisible']"
//         >
//           导入权限
//         </el-button>
//         <el-button size="small" type="danger" @click="deleted()" v-hasPermi="['system:sysRoleManage:deleted']">
//           删除角色
//         </el-button>
//         <el-button size="small" type="primary" @click="refreshRoleCache">单个角色刷新缓存</el-button>
//         <el-button size="small" type="primary" @click="refreshCurrentCache">当前及下级角色刷新缓存</el-button>
//         <el-button size="small" type="danger" @click="refreshAllCache">刷新所有缓存</el-button>
//       </div>
//       <div class="right-main">
//         <el-row class="mb-05">
//           <el-form
//             :model="sysRole"
//             ref="sysRoleRef"
//             :rules="sysRoleRules"
//             label-position="top"
//             size="small"
//             style="width: 100%"
//             :inline-message="true"
//           >
//             <el-row :gutter="20">
//               <el-col :span="6">
//                 <el-form-item label="角色代码" prop="roleCode">
//                   <el-input v-model="sysRole.roleCode" disabled clearable />
//                 </el-form-item>
//               </el-col>
//               <el-col :span="6">
//                 <el-form-item label="角色名称" prop="roleName">
//                   <el-input v-model.trim="sysRole.roleName" clearable />
//                 </el-form-item>
//               </el-col>
//               <el-col :span="6">
//                 <el-form-item label="上级角色" prop="parentRoleName">
//                   <el-input v-model="sysRole.parentRoleName" disabled clearable />
//                 </el-form-item>
//               </el-col>
//               <el-col :span="6">
//                 <el-form-item label="角色描述" prop="roleDesc">
//                   <el-input v-model="sysRole.roleDesc" clearable />
//                 </el-form-item>
//               </el-col>
//             </el-row>
//             <el-row :gutter="20">
//               <!--              <el-col :span="6">-->
//               <!--                <el-form-item label="主数据ID" prop="mdmId">-->
//               <!--                  <el-input v-model="sysRole.mdmId" clearable @input="validateSysRoleMdmIdInput" />-->
//               <!--                </el-form-item>-->
//               <!--              </el-col>-->
//               <el-col :span="6">
//                 <el-form-item label="授权组织" prop="officeMdmName">
//                   <el-tooltip effect="dark" placement="top">
//                     <template #content>
//                       {{ sysRole.officeMdmName }}
//                     </template>
//                     <j-office-associate
//                       v-model="sysRole.officeMdmId"
//                       :defValue="sysRole.officeMdmName"
//                       :key="settleOfficeKey"
//                       :isEdit="true"
//                       :isMuptiple="true"
//                       style="width: 100%"
//                       @getSelectVal="(val) => selectSettleOffice(val, sysRole)"
//                     ></j-office-associate>
//                   </el-tooltip>
//                 </el-form-item>
//               </el-col>
//             </el-row>
//           </el-form>
//         </el-row>
//         <el-row>
//           <el-col :span="24">
//             <el-tabs type="border-card">
//               <el-tab-pane label="操作权限">
//                 <el-row class="mb-05">
//                   <el-form label-position="top" size="small" class="custom-form">
//                     <el-row class="mb-4">
//                       <el-col :span="6">
//                         <el-form-item label="项目" prop="appCode">
//                           <j-apply-associate
//                             v-model="resourceAppCode"
//                             :defValue="resourceAppCodeName"
//                             :key="resourceApplyIdKey"
//                             ref="resourceAppRef"
//                             style="width: 100%"
//                             @handleAutoSelect="(val) => selectResourceApplyData(val)"
//                           ></j-apply-associate>
//                         </el-form-item>
//                       </el-col>
//                       <el-col :span="2"></el-col>
//                       <el-col :span="8" v-if="sysRole.checkedApplyCodes">
//                         <el-form-item label="已配置项目" prop="appCode">
//                           <el-checkbox-group v-model="sysRole.checkedApplyCodes" @change="handleCheckboxChange">
//                             <el-checkbox
//                               v-for="item in sysRole.checkedApplyList"
//                               :label="item.applyCode"
//                               :key="item.virtualId"
//                             >
//                               {{ item.applyName }}
//                             </el-checkbox>
//                           </el-checkbox-group>
//                         </el-form-item>
//                       </el-col>
//                     </el-row>
//                   </el-form>
//                 </el-row>
//                 <el-row class="mb-05">
//                   <el-button size="small" type="primary" @click="queryResource()">查询</el-button>
//                   <el-button size="small" type="primary" @click="expandOrCloseAllNodes(resourceTreeRef, 'expand')">
//                     展开节点
//                   </el-button>
//                   <el-button
//                     size="small"
//                     type="danger"
//                     @click="expandOrCloseAllNodes(resourceTreeRef, 'close')"
//                     v-hasPermi="['system:sysRoleManage:expandOrCloseAllNodes']"
//                   >
//                     收缩节点
//                   </el-button>
//                   <!--                  <el-button
//                     size="small"
//                     type="danger"
//                     @click="clearAllChoosedNodeRoleResource()"
//                     v-hasPermi="['system:sysRoleManage:clearAllChoosedNodeRoleResource']"
//                     >清空已选</el-button
//                   >-->
//                 </el-row>
//                 <div class="left-main">
//                   <el-tree
//                     ref="resourceTreeRef"
//                     class="filter-tree"
//                     :data="resourceTreeData"
//                     :default-expanded-keys="defaultExpandResourceKeys"
//                     :props="leafProps"
//                     :load="loadResourceNode"
//                     lazy
//                     :expand-on-click-node="false"
//                     node-key="id"
//                     highlight-current
//                     show-checkbox
//                     :check-strictly="true"
//                     @check="(nodeData, checkedInfo) => handleTreeCheck(resourceTreeRef, nodeData, checkedInfo)"
//                   />
//                 </div>
//               </el-tab-pane>
//               <el-tab-pane label="授权权限">
//                 <el-row class="mb-05">
//                   <el-form label-position="top" size="small" class="custom-form">
//                     <el-row class="mb-4">
//                       <el-col :span="6">
//                         <el-form-item label="项目" prop="appCode">
//                           <j-apply-associate
//                             v-model="grantAppCode"
//                             :defValue="grantAppCodeName"
//                             :key="grantApplyIdKey"
//                             ref="grantAppRef"
//                             style="width: 100%"
//                             @handleAutoSelect="(val) => selectGrantApplyData(val)"
//                           ></j-apply-associate>
//                         </el-form-item>
//                       </el-col>
//                       <el-col :span="2"></el-col>
//                       <el-col :span="8" v-if="sysRole.checkedGrandApplyCodes">
//                         <el-form-item label="已授权项目" prop="appCode">
//                           <el-checkbox-group
//                             v-model="sysRole.checkedGrandApplyCodes"
//                             @change="handleGrantCheckboxChange"
//                           >
//                             <el-checkbox
//                               v-for="item in sysRole.checkedGrandApplyList"
//                               :label="item.applyCode"
//                               :key="item.applyCode"
//                             >
//                               {{ item.applyName }}
//                             </el-checkbox>
//                           </el-checkbox-group>
//                         </el-form-item>
//                       </el-col>
//                     </el-row>
//                   </el-form>
//                 </el-row>
//                 <el-row class="mb-05">
//                   <el-button
//                     size="small"
//                     type="primary"
//                     @click="queryGrant()"
//                     v-hasPermi="['system:sysRoleManage:queryGrant']"
//                   >
//                     查询
//                   </el-button>
//                   <el-button
//                     size="small"
//                     type="primary"
//                     @click="expandOrCloseAllNodes(grantTreeRef, 'expand')"
//                     v-hasPermi="['system:sysRoleManage:expandOrCloseAllNodes']"
//                   >
//                     展开节点
//                   </el-button>
//                   <el-button
//                     size="small"
//                     type="danger"
//                     @click="expandOrCloseAllNodes(grantTreeRef, 'close')"
//                     v-hasPermi="['system:sysRoleManage:expandOrCloseAllNodes']"
//                   >
//                     收缩节点
//                   </el-button>
//                   <!--                  <el-button
//                     size="small"
//                     type="danger"
//                     @click="clearAllChoosedNodeRoleGrant()"
//                     v-hasPermi="['system:sysRoleManage:clearAllChoosedNodeRoleGrant']"
//                     >清空已选</el-button
//                   >-->
//                 </el-row>
//                 <div class="left-main">
//                   <!--
//                   :default-expanded-keys="defaultExpandGrantKeys"
//                   -->
//                   <el-tree
//                     ref="grantTreeRef"
//                     class="filter-tree"
//                     :data="grantTreeData"
//                     :props="leafProps"
//                     :expand-on-click-node="false"
//                     lazy
//                     node-key="id"
//                     highlight-current
//                     show-checkbox
//                     :load="loadGrantNode"
//                     :check-strictly="true"
//                     @check="(nodeData, checkedInfo) => handleTreeCheck(grantTreeRef, nodeData, checkedInfo)"
//                   />
//                 </div>
//               </el-tab-pane>
//               <el-tab-pane label="角色用户">
//                 <el-row class="mb-4">
//                   <el-button
//                     size="small"
//                     @click="addSysRoleUser()"
//                     type="primary"
//                     v-hasPermi="['system:sysRoleManage:addSysRoleUser']"
//                   >
//                     添加用户
//                   </el-button>
//                   <el-button
//                     size="small"
//                     @click="deleteSysRoleUsers()"
//                     type="danger"
//                     v-hasPermi="['system:sysRoleManage:deleteSysRoleUsers']"
//                   >
//                     移除用户
//                   </el-button>
//                 </el-row>
//                 <el-row style="margin-top: 10px">
//                   <el-table
//                     :data="roleUserData"
//                     ref="sysRoleUserTable"
//                     border
//                     size="small"
//                     auto-resize
//                     height="350"
//                     :highlight-current-row="true"
//                     align="left"
//                     stripe
//                     :loading="userLoading"
//                     :table-layout="tableLayout"
//                     style="width: 100%"
//                   >
//                     <el-table-column type="index" align="center" />
//                     <el-table-column type="selection" width="55" align="center" />
//                     <el-table-column prop="userName" label="登录账号" width="180" />
//                     <el-table-column prop="userNameCn" label="中文名称" width="180" />
//                     <el-table-column prop="creatorName" label="创建人" width="180" />
//                     <el-table-column prop="createTime" label="创建时间">
//                       <template #default="scope">
//                         <span>{{ parseTime(scope.row.createTime) }}</span>
//                       </template>
//                     </el-table-column>
//                     <el-table-column prop="lastModifierName" label="最后修改人" width="180" />
//                     <el-table-column prop="lastModifyTime" label="最后修改时间" width="180">
//                       <template #default="scope">
//                         <span>{{ parseTime(scope.row.lastModifyTime) }}</span>
//                       </template>
//                     </el-table-column>
//                   </el-table>
//                   <div class="page-pagination">
//                     <pagination
//                       :total="totalNum"
//                       v-model:page="queryForm.pageNumber"
//                       v-model:limit="queryForm.pageSize"
//                       @pagination="selectSysRoleUser"
//                     />
//                   </div>
//                 </el-row>
//               </el-tab-pane>
//             </el-tabs>
//           </el-col>
//         </el-row>
//       </div>
//     </div>
//     <RoleAddUserDialog
//       v-if="dialogFormVisible"
//       v-model="dialogFormVisible"
//       :roleId="roleId"
//       @confirm="confirmAddUserDialog"
//     ></RoleAddUserDialog>

//     <ExportResoueceDialog
//       v-if="popVisible"
//       v-model="popVisible"
//       :roleId="roleId"
//       :roleTreeData="roleTreeData"
//       @confirm="confirmPopDialog"
//     ></ExportResoueceDialog>
//   </div>
// </template>
// <script>
// export default {
//   name: 'SysRoleManage'
// }
// </script>
// <script setup>
// import ExportResoueceDialog from './exportResourceDialog'
// import RoleAddUserDialog from './roleAddUserDialog'
// import {
//   getSysRoleTree,
//   getSysRole,
//   getRoleGrantTree,
//   getResourceTree,
//   clearAllRoleGrant,
//   clearAllRoleResource,
//   updateRole,
//   saveRole,
//   deleteRole,
//   deleteRoleResourceByAppCodes,
//   deleteRoleGrantByAppCodes
// } from '@/api/sys-mgt/role'
// import { refreshCache, refreshSysRoleCache, refreshAllSysRoleCache, refreshCurrentRoleCache } from '@/api/sys-mgt/cache'
// import { getSysRoleUser, deleteSysRoleUser } from '@/api/sys-mgt/user'
// import { getCurrentInstance, nextTick, ref, watch } from 'vue'
// import { ElMessageBox, ElTree } from 'element-plus'
// import { scrollIntoView } from '@/views/sys-mgt/lib/utils'

// const queryForm = ref({
//   urlTitle: '',
//   url: '',
//   urlType: '',
//   pageNumber: 1,
//   pageSize: 20
// })
// const totalNum = ref(0)
// const searchName = ref('')
// const roleTreeRef = ref()
// const sysRoleUserTable = ref()
// const addUserTable = ref()
// const resourceTreeRef = ref()
// const grantTreeRef = ref()
// const popVisible = ref(false)
// const dialogFormVisible = ref(false)
// const child = ref(false)
// const defaultProps = {
//   children: 'childrenNodes',
//   label: 'name',
//   disabled: 'disabled'
// }
// const leafProps = {
//   children: 'childrenNodes',
//   label: 'name',
//   disabled: 'disabled',
//   isLeaf: 'leaf',
//   indeterminate: 'indeterminate'
// }
// const { proxy } = getCurrentInstance()

// const roleTreeData = ref([])
// const roleUserData = ref([])
// const tableLayout = ref('fixed')
// const resourceTreeData = ref([])
// const grantTreeData = ref([])
// const loading = ref(false)
// const userLoading = ref(false)
// const roleId = ref(null)
// const rootId = ref(null)
// const parentRoleIdOld = ref(null)
// const parentRoleNameOld = ref(null)
// const roleCurrentNodeKey = ref(null)
// const defaultExpandKeys = ref([])
// const defaultExpandResourceKeys = ref([])
// const defaultExpandGrantKeys = ref([])
// let currentIndex = -1 // 记录当前匹配节点的索引
// const activeName = ref('first')
// const data = reactive({
//   parentForm: {},
//   sysRoleRules: {
//     roleName: [
//       { required: true, message: '角色名称不能为空', trigger: ['blur'] },
//       { max: 50, message: '长度不能超过50', trigger: ['blur', 'change'] },
//       {
//         pattern: /^[^\s_]+_[^\s_]+$/,
//         message: '角色名称格式不符，请使用如“分公司_角色名称”格式填写',
//         trigger: ['blur', 'change']
//       }
//     ],
//     roleDesc: [{ max: 200, message: '长度不能超过200', trigger: ['blur', 'change'] }],
//     mdmId: [{ max: 50, message: '长度不能超过50', trigger: ['blur', 'change'] }],
//     officeMdmId: [{ max: 500, message: '授权公司编码长度不能超过500', trigger: ['blur', 'change'] }]
//   },
//   parentRules: {
//     parentRoleId: [{ required: true, message: '上级公司不能为空', trigger: ['blur', 'change'] }]
//   },
//   sysRole: { pageNum: 1, pageSize: 10, postCode: undefined, postName: undefined, status: undefined }
// })
// const { parentForm, parentRules, sysRole, sysRoleRules } = toRefs(data)

// function validateSysRoleMdmIdInput() {
//   const regex = /^[A-Za-z0-9]+$/ // 正则表达式，只允许字母和数字
//   if (!regex.test(sysRole.value.mdmId)) {
//     sysRole.value.mdmId = sysRole.value.mdmId.replace(/[^A-Za-z0-9]+/g, '') // 去除非法字符
//   }
// }

// let oldSearchName = ref('')
// let searchIndex = -1
// let searchNodes = [] //查询的节点
// function getSearchIds(treeData, arr = []) {
//   treeData.forEach((item) => {
//     if (item.name.includes(searchName.value)) {
//       arr.push(item)
//     }
//     if (item.childrenNodes.length > 0) {
//       getSearchIds(item.childrenNodes, arr)
//     }
//   })
//   return arr
// }
// function handleSearch() {
//   let val = searchName.value
//   // 重新查询
//   if (oldSearchName.value != val) {
//     searchIndex = 0
//     oldSearchName.value = val
//     searchNodes = getSearchIds(roleTreeData.value)
//   } else {
//     searchIndex++
//     if (searchIndex > searchNodes.length - 1) {
//       searchIndex = 0
//     }
//   }
//   if (!searchNodes.length) {
//     return
//   }
//   roleId.value = searchNodes[searchIndex]?.id
//   roleTreeRef.value.setCurrentKey(roleId.value)
//   const currentNode = roleTreeRef.value.getCurrentNode(rootId.value)
//   const currentNodeElement = document.getElementById(`treeNode${currentNode.id}`)
//   scrollIntoView(currentNodeElement)
//   const param = {
//     sysRoleId: roleId.value
//   }
//   selectSysRole(param)
// }
// const selectType = ref()
// /** 查询角色信息 */
// function selectSysRole(param) {
//   getSysRole(param).then((res) => {
//     if (res.success != undefined && res.success == true) {
//       sysRole.value = res.data
//       roleCurrentNodeKey.value = sysRole.value.sysRoleId
//       roleTreeRef.value?.setCurrentKey(roleCurrentNodeKey.value)
//       child.value = false
//       settleOfficeKey.value++
//       if (!(selectType.value != null && selectType.value === 'save')) {
//         proxy.$refs['resourceAppRef'].clearSelectValue()
//         resourceApplyIdKey.value++
//         proxy.$refs['grantAppRef'].clearSelectValue()
//         grantApplyIdKey.value++
//       }
//       selectType.value = null
//       defaultExpandResourceKeys.value = []
//       defaultExpandGrantKeys.value = []
//       selectResourceTree(param)
//       selectRoleGrantTree(param)
//       selectSysRoleUser()
//       proxy.$refs['sysRoleRef'].validate()
//     }
//   })
// }
// /** 获取角色树 */
// function getRoleTree() {
//   getSysRoleTree().then((res) => {
//     if (res.data.result.length > 0) {
//       const result = res.data.result
//       roleTreeData.value = result
//       result.forEach((item) => {
//         defaultExpandKeys.value.push(item.id)
//       })
//       const param = {
//         sysRoleId: undefined
//       }
//       if (roleId.value == null) {
//         param.sysRoleId = result[0].id
//         roleId.value = result[0].id
//         rootId.value = result[0].rootId
//       } else {
//         param.sysRoleId = roleId.value
//       }
//       selectSysRole(param)
//     } else {
//       roleTreeData.value = []
//     }
//   })
// }
// getRoleTree()
// /** 角色树点击事件 */
// function clickRoleTree(data) {
//   const nodeId = data.id
//   roleId.value = data.id
//   rootId.value = data.rootId
//   const param = {
//     sysRoleId: undefined
//   }
//   param.sysRoleId = nodeId || ''
//   loading.value = true
//   selectSysRole(param)
// }

// /** 角色树展开事件 */
// function expandNode(data) {
//   defaultExpandKeys.value.push(data.id)
// }
// /** 角色树收缩事件 */
// function collapseNode(data) {
//   let index = defaultExpandKeys.value.indexOf(data.id)
//   if (index != null && index > 0) {
//     defaultExpandKeys.value.splice(index)
//   }
// }
// /** 删除角色 */
// function deleted() {
//   if (sysRole.value.sysRoleId == null) {
//     proxy.$modal.msgWarning('请先保存记录！')
//     return
//   }
//   proxy.$modal.confirm('确认删除?').then(function () {
//     const param = {
//       sysRoleId: undefined
//     }

//     param.sysRoleId = roleId.value
//     deleteRole(param).then((res) => {
//       if (res.success != undefined && res.success == true) {
//         proxy.$modal.msgSuccess('删除成功')
//         roleId.value = null
//         getRoleTree()
//       }
//     })
//   })
// }
// /** 新增 */
// function addSysRole() {
//   if (sysRole.value.sysRoleId == null) {
//     parentRoleIdOld.value = sysRole.value.parentRoleId
//     parentRoleNameOld.value = sysRole.value.parentRoleName
//   } else {
//     parentRoleIdOld.value = sysRole.value.sysRoleId
//     parentRoleNameOld.value = sysRole.value.roleName
//   }

//   // $scope.Form_SysRole_F0_0_0_1_2.$validator.disable();
//   sysRole.value = {
//     parentRoleId: parentRoleIdOld.value,
//     parentRoleName: parentRoleNameOld.value,
//     isDeleted: '0',
//     sysRoleIdParam: '-9999'
//   }
//   roleUserData.value = null
//   clearChoosedNodeRoleResource(null)
//   clearChoosedNodeRoleGrant(null)
//   roleCurrentNodeKey.value = null
//   proxy.$refs['sysRoleRef'].validate()
// }

// /** 保存 */
// function save() {
//   const apiName = sysRole.value.sysRoleId == null ? saveRole : updateRole
//   proxy.$refs['sysRoleRef'].validate((valid) => {
//     if (valid) {
//       const param = {
//         sysRole: undefined,
//         operaAuthChecks: [],
//         roleGrantChecks: [],
//         resourceAppCode: null,
//         grantAppCode: null
//       }

//       param.sysRole = sysRole.value
//       param.operaAuthChecks = getChangeNodes(resourceTreeRef.value, resourceTreeData.value)
//       param.roleGrantChecks = getChangeNodes(grantTreeRef.value, grantTreeData.value)
//       param.resourceAppCode = resourceAppCode.value
//       param.grantAppCode = grantAppCode.value
//       proxy.setPageLoading(true)
//       apiName(param)
//         .then((res) => {
//           proxy.setPageLoading(false)
//           if (res.success != undefined && res.success == true) {
//             proxy.$modal.msgSuccess('保存成功')
//             const selectparam = {
//               sysRoleId: undefined
//             }
//             roleId.value = res.data.sysRoleId
//             selectparam.sysRoleId = roleId.value
//             roleCurrentNodeKey.value = roleId.value
//             selectType.value = 'save'
//             getRoleTree()
//           }
//         })
//         .catch((error) => {
//           proxy.setPageLoading(false)
//         })
//     }
//   })
// }
// /** 单个角色缓存刷新 */
// function refreshRoleCache() {
//   const node = roleTreeRef.value.getCurrentNode()
//   if (node == null || node.id == null) {
//     proxy.$modal.msgWarning('请选择要刷新缓存的树节点')
//     return
//   }
//   let alertName = node.name
//   let paramsObj = { num: alertName }
//   proxy.$modal.confirm('确认刷新角色名:' + alertName + '的缓存?').then(function () {
//     let params = {
//       roleId: node.id,
//       appCode: ''
//     }
//     refreshCache(params).then((res) => {
//       if (res.success != undefined && res.success == true) {
//         refreshSysRoleCache({ ids: node.id }).then((res) => {
//           proxy.$modal.msgSuccess(alertName + '刷新成功')
//         })
//       }
//     })
//   })
// }

// /**
//  * 当前及下级角色刷新缓存
//  */
// function refreshCurrentCache() {
//   const node = roleTreeRef.value.getCurrentNode()
//   if (node == null || node.id == null) {
//     proxy.$modal.msgWarning('请选择要刷新缓存的树节点')
//     return
//   }
//   proxy.$modal.confirm('确认刷新当前及以下角色的缓存?').then(function () {
//     proxy.setPageLoading(true)
//     let params = {
//       roleId: node.id,
//       appCode: ''
//     }
//     refreshCache(params).then((res) => {
//       if (res.success != undefined && res.success == true) {
//         refreshCurrentRoleCache({ ids: node.id })
//           .then((res) => {
//             proxy.$modal.msgSuccess('缓存刷新成功')
//           })
//           .finally((error) => {
//             proxy.setPageLoading(false)
//           })
//       }
//     })
//   })
// }
// /** 刷新所有缓存 */
// function refreshAllCache() {
//   proxy.$modal.confirm('确认刷新所有缓存?').then(function () {
//     proxy.setPageLoading(true)
//     refreshCache({ roleId: '' })
//       .then((res) => {
//         if (res.success != undefined && res.success == true) {
//           refreshAllSysRoleCache()
//             .then((res) => {
//               proxy.setPageLoading(false)
//               proxy.$modal.msgSuccess('缓存刷新成功')
//             })
//             .finally((error) => {
//               proxy.setPageLoading(false)
//             })
//         } else {
//           proxy.setPageLoading(false)
//         }
//       })
//       .finally((error) => {
//         proxy.setPageLoading(false)
//       })
//   })
// }

// const resourceAppCode = ref(null)
// const resourceAppCodeName = ref(null)
// const oldResourceAppCode = ref(null)
// function queryResource() {
//   if (resourceAppCode.value == null) {
//     proxy.$modal.msgWarning('请先选择项目')
//     return
//   }
//   let operaAuthChecks = getChangeNodes(resourceTreeRef.value, resourceTreeData.value)
//   if (operaAuthChecks.length > 0) {
//     proxy.$modal
//       .confirm('数据有修改，是否需要保存？')
//       .then(function () {
//         save()
//       })
//       .catch(() => {
//         // 用户点击了取消按钮，执行相应的操作
//         selectResourceTree()
//       })
//     return
//   } else {
//     selectResourceTree()
//   }
// }

// //查询操作权限
// function selectResourceTree() {
//   getResourceTree({
//     sysRoleId: roleId.value,
//     pid: rootId.value,
//     appCode: resourceAppCode.value
//   }).then((res) => {
//     if (res.success) {
//       oldResourceAppCode.value = resourceAppCode.value
//       res.data.result.forEach((item) => {
//         item.leaf = !item.hasChildren
//       })
//       const arr = formatNodeData(res.data.result || [])
//       resourceTreeData.value = arr
//       nextTick(() => {
//         resourceTreeData.value.forEach((item) => {
//           setNodesByLoadStatus(resourceTreeRef.value, item)
//         })
//       })
//     }
//   })
// }
// //查询授权权限
// const grantAppCode = ref(null)
// const grantAppCodeName = ref(null)
// const oldGrantAppCode = ref(null)
// function queryGrant() {
//   if (grantAppCode.value == null) {
//     proxy.$modal.msgWarning('请先选择项目')
//     return
//   }
//   let operaAuthChecks = getChangeNodes(grantTreeRef.value, grantTreeData.value)
//   if (operaAuthChecks.length > 0) {
//     proxy.$modal
//       .confirm('数据有修改，是否需要保存？')
//       .then(function () {
//         save()
//       })
//       .catch(() => {
//         // 用户点击了取消按钮，执行相应的操作
//         selectRoleGrantTree()
//       })
//     return
//   } else {
//     selectRoleGrantTree()
//   }
// }
// function selectRoleGrantTree() {
//   getRoleGrantTree({
//     sysRoleId: roleId.value,
//     pid: rootId.value,
//     appCode: grantAppCode.value
//   }).then((res) => {
//     if (res.success) {
//       oldGrantAppCode.value = grantAppCode.value
//       res.data.result.forEach((item) => {
//         item.leaf = !item.hasChildren
//       })
//       const arr = formatNodeData(res.data.result || [])
//       grantTreeData.value = arr
//       nextTick(() => {
//         grantTreeData.value.forEach((item) => {
//           setNodesByLoadStatus(grantTreeRef.value, item)
//         })
//       })
//     }
//   })
// }

// // 设置父节点的选中状态-递归
// // function initParentNodeCheckedStatus(targetRefVal, pid) {
// //   const parentNode = targetRefVal.getNode(pid)
// //   const parentNodeData = parentNode.data
// //   setNodesByLoadStatus(targetRefVal, parentNodeData)
// //   if (parentNodeData.pid) {
// //     initParentNodeCheckedStatus(targetRefVal, parentNodeData.pid)
// //   }
// // }
// // 组装数据
// function formatNodeData(arr) {
//   const newArr = arr.map((item) => {
//     const { indeterminate, hasCheckd } = item
//     item.initIndeterminate = indeterminate && hasCheckd
//     if (!item.initIndeterminate) {
//       item.initHasChecked = hasCheckd
//     } else {
//       item.initHasChecked = false
//     }

//     if (item.childrenNodes?.length) {
//       item.childrenNodes = formatNodeData(item.childrenNodes)
//     }
//     return item
//   })
//   return newArr
// }
// // 根据当前节点的勾选状态-设置子节点的选中状态
// const setNodesByCheckStatus = (targetRefVal, childrenNodesData = [], checkStatus) => {
//   // checked:true  + indeterminate:undefined/false = 勾选
//   // checked:true  + indeterminate:true = 半选
//   // checked:false + indeterminate:false = 不勾选
//   // console.log('【 childrenNodesData 】-879', childrenNodesData)
//   childrenNodesData.forEach((item) => {
//     const node = targetRefVal.getNode(item)
//     console.log('【 node 】-875', node)
//     if (node) {
//       node.checked = checkStatus
//       node.indeterminate = false // 设置子节点不存在半选中状态，只有勾选和不勾选
//     }
//     if (item.childrenNodes?.length) {
//       setNodesByCheckStatus(targetRefVal, item.childrenNodes, checkStatus)
//     }
//   })
// }
// // 根据接口返回结果-设置子节点的选中状态
// function setNodesByLoadStatus(targetRefVal, item) {
//   const childrenNode = targetRefVal.getNode(item)
//   const { indeterminate, hasCheckd } = item
//   childrenNode.indeterminate = indeterminate && hasCheckd
//   if (!indeterminate) {
//     childrenNode.checked = hasCheckd
//   }
// }
// // 递归设置父节点
// function setParentNodeStatus(targetRefVal, data) {
//   const parentNode = targetRefVal.getNode(data.pid)
//   // console.log('【 setParentNodeStatus 】-892', parentNode, parentNode.childNodes)
//   // 判断下级是否全部勾选
//   const allCheck = parentNode.childNodes.every((item) => {
//     return item.checked && !item.indeterminate //勾选且不是半选
//   })
//   if (allCheck) {
//     parentNode.checked = true
//     parentNode.indeterminate = false
//   } else {
//     // 半选中
//     parentNode.checked = true
//     parentNode.indeterminate = true
//   }
//   if (parentNode.data?.pid) {
//     const parentParentNode = targetRefVal.getNode(parentNode.data.pid)
//     // console.log('【 parentParentNode 】-911', parentParentNode)
//     // 上级和上上级勾选状态不一致
//     if (parentParentNode.checked != parentNode.checked || parentParentNode.indeterminate != parentNode.indeterminate) {
//       setParentNodeStatus(targetRefVal, parentNode.data)
//     }
//   }
// }
// /** 节点勾选事件 */
// function handleTreeCheck(targetRefVal, nodeData, checkedInfo) {
//   // console.log('【 handleTreeCheck 】-873', nodeData, checkedInfo)
//   const isChecked = checkedInfo.checkedKeys.includes(nodeData.id)
//   if (nodeData?.pid) {
//     setParentNodeStatus(targetRefVal, nodeData)
//   }
//   setNodesByCheckStatus(targetRefVal, nodeData.childrenNodes, isChecked)
// }
// // 设置新加载的子节点状态
// const setNodeStatus = (targetRefVal, curNode, data) => {
//   if (!curNode.indeterminate) {
//     // 非半选中，子节点全部勾选或不勾选
//     setNodesByCheckStatus(targetRefVal, [data], curNode.checked)
//   } else {
//     // 半选中，子节点勾选状态按接口返回结果初始化
//     setNodesByLoadStatus(targetRefVal, data)
//   }
// }
// //操作权限 展开加载事件
// const loadResourceNode = async (node, resolve) => {
//   // let clickIndeterminate = node.indeterminate //记录点击时的半选中状态
//   // console.log('【 loadResourceNode 】-728', node, node.indeterminate, clickIndeterminate)
//   if (!node.data) {
//     return
//   }
//   try {
//     const children = await loadChildrenNode('resource', node) // 加载子节点
//     node.data.childrenNodes = children
//     resolve(children)
//     // if (clickIndeterminate) {
//     //设置当前节点
//     setNodeStatus(resourceTreeRef.value, node, node.data)
//     //设置子节点
//     children.forEach((item) => {
//       setNodeStatus(resourceTreeRef.value, node, item)
//     })
//     //设置父节点
//     // if (node.data.pid) {
//     //   setParentNodeStatus(resourceTreeRef.value, node.data)
//     //   // initParentNodeCheckedStatus(resourceTreeRef.value, node.data.pid)
//     // }
//   } catch (error) {
//     console.error('【 error-loadResourceNode 】-970', error)
//     // 在这里你可以选择如何处理错误，例如提供一个默认的空数组
//     resolve([])
//   }
// }

// //授权权限-展开加载事件
// const loadGrantNode = async (node, resolve) => {
//   // let clickIndeterminate = node.indeterminate //记录点击时的半选中状态
//   // console.log('【 loadResourceNode 】-728', node, node.indeterminate, clickIndeterminate)
//   if (!node.data) {
//     return
//   }
//   try {
//     // 加载其他节点的子节点
//     const children = await loadChildrenNode('grant', node)
//     node.data.childrenNodes = children
//     resolve(children)
//     // if (clickIndeterminate) {
//     //设置当前节点
//     setNodeStatus(grantTreeRef.value, node, node.data)
//     //设置子节点
//     children.forEach((item) => {
//       setNodeStatus(grantTreeRef.value, node, item)
//     })
//     //设置父节点
//     // if (node.data.pid) {
//     //   setParentNodeStatus(resourceTreeRef.value, node.data)
//     //   // initParentNodeCheckedStatus(resourceTreeRef.value, node.data.pid)
//     // }
//   } catch (error) {
//     console.error('【 error-loadGrantNode 】-970', error)
//     // 在这里你可以选择如何处理错误，例如提供一个默认的空数组
//     resolve([])
//   }
// }
// // 点击加载子节点
// const loadChildrenNode = async (type, node, isAllChild = false) => {
//   let apiName = type == 'resource' ? getResourceTree : getRoleGrantTree
//   let appCode = type == 'resource' ? oldResourceAppCode.value : oldGrantAppCode.value
//   return new Promise((resolve) => {
//     apiName({
//       checked: node?.checked,
//       child: isAllChild || undefined, //是否获取全部子节点
//       clickCheck: node.data?.clickCheck,
//       id: node.data?.id,
//       sysRoleId: roleId.value,
//       pid: rootId.value,
//       appCode: appCode
//     })
//       .then((res) => {
//         if (res.success) {
//           const list = res.data.result || []
//           if (list.length > 0) {
//             list.forEach((item) => {
//               item.leaf = !item.hasChildren
//             })
//             const arr = formatNodeData(list)
//             resolve(arr)
//           }
//         }
//       })
//       .catch((error) => {
//         resolve([])
//       })
//   })
// }

// // 递归展开子节点
// function expandAllNodes(targetRefVal, nodes) {
//   nodes.forEach((node) => {
//     setNodeStatus(targetRefVal, node, node.data)
//     // setNodesByLoadStatus(targetRefVal, node.data)
//     if (node.data.hasChildren) {
//       node.expand(() => {
//         let childNodes = node.childNodes
//         if (childNodes?.length) {
//           expandAllNodes(targetRefVal, childNodes) //递归展开
//         }
//       })
//     }
//   })
// }
// //操作权限、授权权限-展开/收缩节点
// function expandOrCloseAllNodes(targetRefVal, type) {
//   const data = targetRefVal.getCurrentNode()
//   if (type === 'expand') {
//     if (!data) {
//       proxy.$modal.msgWarning('请选择需要展开的节点')
//       return
//     }
//     const node = targetRefVal.getNode(data)
//     expandAllNodes(targetRefVal, [node])
//     // node.loaded = false
//     // node.childNodes.splice(0, node.childNodes.length)
//   } else if (type === 'close') {
//     if (data == null) {
//       proxy.$modal.msgWarning('请选择需要收缩的节点')
//       return
//     }
//     let node = targetRefVal.getNode(data)
//     if (node.expanded) {
//       targetRefVal.getNode(data).collapse()
//     } else {
//       proxy.$modal.msgWarning('无需收缩，请重新选择')
//       return
//     }
//     // TODO  node.childNodes??
//     // if (node.childNodes != null && node.childNodes.length > 0) {
//     //
//     // } else {
//     //
//     // }
//   }
// }
// //清空已选
// function clearAllChoosedNodeRoleResource() {
//   resourceTreeData.value.forEach((data) => {
//     const record = resourceTreeRef.value.getNode(data)
//     if ((record.checked || record.indeterminate) && record.level == 1) {
//       record.checked = false
//       record.selected = false
//       record.clickCheck = true
//     }
//   })
//   resourceTreeRef.value.setCheckedKeys([], false)
// }
// //清空已选
// // function clearAllChoosedNodeRoleGrant() {
// //   let dataTree = grantTreeData.value
// //   grantTreeData.value.forEach((data) => {
// //     const record = grantTreeRef.value.getNode(data)
// //     if ((record.checked || record.indeterminate) && record.level == 1) {
// //       record.checked = false
// //       record.selected = false
// //       record.clickCheck = true
// //     }
// //   })
// //   grantTreeRef.value.setCheckedKeys([], false)
// // }
// //清空已选
// function clearChoosedNodeRoleResource(isDel) {
//   let dataTree = resourceTreeData.value
//   resourceTreeRef.value.setCheckedKeys([], false)

//   if (sysRole.value.sysRoleId && isDel) {
//     let param = { roleId: sysRole.value.sysRoleId }
//     proxy.$modal.confirm('是否清空该角色下所有权限?').then(function () {
//       clearAllRoleResource(param).then((res) => {
//         proxy.$modal.msgSuccess(res.msg)
//         selectResourceTree()
//       })
//     })
//   }
// }
// //清空已选
// function clearChoosedNodeRoleGrant(isDel) {
//   let dataTree = grantTreeData.value
//   grantTreeRef.value.setCheckedKeys([], false)
//   if (sysRole.value.sysRoleId && isDel) {
//     let param = { roleId: sysRole.value.sysRoleId }
//     proxy.$modal.confirm('是否清空该角色下所有权限?').then(function () {
//       clearAllRoleGrant(param).then((res) => {
//         proxy.$modal.msgSuccess(res.msg)
//         selectRoleGrantTree()
//       })
//     })
//   }
// }

// // 获取变化的节点
// function getChangeNodes(targetRefVal, treeData, arr = []) {
//   treeData.forEach((item) => {
//     const node = targetRefVal.getNode(item.id)
//     const { checked, indeterminate, expanded } = node
//     const { initHasChecked, initIndeterminate } = item
//     if (indeterminate != initIndeterminate || checked != initHasChecked) {
//       const obj = {}
//       obj[item.id] = indeterminate || checked
//       obj.isExpand = expanded
//       arr.push(obj)
//     }
//     if (item.childrenNodes?.length) {
//       getChangeNodes(targetRefVal, item.childrenNodes, arr)
//     }
//   })
//   return arr
// }
// //角色用户列表查询
// function selectSysRoleUser() {
//   let param = queryForm.value
//   param.sysRoleId = roleId.value
//   userLoading.value = true
//   getSysRoleUser(param)
//     .then((res) => {
//       userLoading.value = false
//       if (res.success != undefined && res.success == true) {
//         roleUserData.value = res.data.rows
//         totalNum.value = res.data.total
//       }
//     })
//     .catch(() => {
//       userLoading.value = false
//     })
// }

// //添加用户
// function addSysRoleUser() {
//   if (sysRole.value.sysRoleId == null) {
//     proxy.$modal.msgWarning('请先保存记录！')
//     return
//   }
//   dialogFormVisible.value = true
// }
// //删除用户
// function deleteSysRoleUsers() {
//   const checkRows = sysRoleUserTable.value.getSelectionRows()
//   if (checkRows.length === 0) {
//     proxy.$modal.msgWarning('请选择记录！')
//     return
//   }
//   const sysRoleUserIds = []
//   for (let i = 0; i < checkRows.length; i++) {
//     sysRoleUserIds.push(checkRows[i].sysRoleUserId)
//   }

//   proxy.$modal.confirm('是否批量删除所选的角色用户？').then(function () {
//     const param = {
//       sysRoleId: undefined
//     }
//     param.sysRoleId = roleId.value
//     deleteSysRoleUser(sysRoleUserIds, param)
//       .then((res) => {
//         if (res.success != undefined && res.success == true) {
//           proxy.$modal.msgSuccess('删除成功')
//           selectSysRoleUser()
//         }
//       })
//       .catch((error) => {})
//   })
// }

// //导入权限
// function importPopVisible() {
//   if (sysRole.value.sysRoleId == null) {
//     proxy.$modal.msgWarning('请先保存记录！')
//     return
//   }
//   popVisible.value = true
// }
// const confirmAddUserDialog = (val) => {
//   selectSysRoleUser()
// }

// const confirmPopDialog = (val) => {
//   const param = {
//     sysRoleId: roleId.value
//   }
//   selectSysRole(param)
// }

// //结算公司联想控件
// const settleOfficeKey = ref(0)

// function selectSettleOffice(item, row) {
//   if (item && item.length > 0) {
//     let codeText = ''
//     let nameText = ''
//     for (let i = 0; i < item.length; i++) {
//       codeText = `${codeText + item[i].mdmId};`
//       nameText = `${nameText + item[i].officeName};`
//     }
//     row.officeMdmId = codeText
//     row.officeMdmName = nameText
//   } else {
//     row.officeMdmId = ''
//     row.officeMdmName = ''
//   }
// }
// //项目联想控件
// const sysApplyIdKey = ref(0)
// const grantApplyIdKey = ref(0)
// const resourceApplyIdKey = ref(0)

// function selectResourceApplyData(item) {
//   if (item != null && item.applyCode != null) {
//     resourceAppCode.value = item.applyCode
//     resourceAppCodeName.value = item.applyName
//   } else {
//     resourceAppCode.value = null
//     resourceAppCodeName.value = null
//   }
// }
// function focusResource() {}
// function selectGrantApplyData(item, data) {
//   if (item != null && item.applyCode != null) {
//     grantAppCode.value = item.applyCode
//     grantAppCodeName.value = item.applyName
//   } else {
//     grantAppCode.value = null
//     grantAppCodeName.value = null
//   }
// }

// function handleCheckboxChange(newVal) {
//   let previousCheckedList = [...sysRole.value.checkedApplyList]

//   // 找出被去除的 checkbox
//   let removedCheckboxes = previousCheckedList
//     .filter((item) => !newVal.includes(item.applyCode))
//     .map((obj) => obj.applyCode)

//   console.log('被去除的 checkbox:', removedCheckboxes)
//   //sysRole.value.checkedApplyCodes = newVal;
//   let params = {}
//   params.appCodes = removedCheckboxes
//   params.sysRoleId = roleId.value
//   proxy.$modal
//     .confirm('是否确认删除操作权限？')
//     .then(function () {
//       return deleteRoleResourceByAppCodes(params)
//     })
//     .then((res) => {
//       if (res.success != undefined && res.success == true) {
//         getRoleTree()
//       }
//     })
//     .catch((err) => {
//       if (err === 'cancel') {
//         getRoleTree()
//       }
//     })
// }

// function handleGrantCheckboxChange(newVal) {
//   let previousCheckedList = [...sysRole.value.checkedGrandApplyList]

//   // 找出被去除的 checkbox
//   let removedCheckboxes = previousCheckedList
//     .filter((item) => !newVal.includes(item.applyCode))
//     .map((obj) => obj.applyCode)

//   console.log('被去除的 checkbox:', removedCheckboxes)
//   let params = {}
//   params.appCodes = removedCheckboxes
//   params.sysRoleId = roleId.value
//   proxy.$modal
//     .confirm('是否确认删除授权权限？')
//     .then(function () {
//       return deleteRoleGrantByAppCodes(params)
//     })
//     .then((res) => {
//       if (res.success != undefined && res.success == true) {
//         getRoleTree()
//       }
//     })
//     .catch((err) => {
//       if (err === 'cancel') {
//         getRoleTree()
//       }
//     })
// }
// </script>

// <style lang="scss" scoped>
// .left-content {
//   overflow: auto;
// }
// .custom-form {
//   width: 100%;
// }
// .red-text {
//   color: red;
// }
// </style> */}
