/**
 * @Author: hongzf, 2个月前 • task#20251020 表单拖拽-添加ts
 * @Description: 拖拽表单配置类型定义统一导出
 */
import type { ElementConfig } from './element'
import type { ComputedRef } from 'vue'

// 配置状态接口
export interface ConfigState {
  hasRequest: boolean // 数据请求完毕
  isEditing: boolean // 是否处于编辑模式
  isModuleDraggable: boolean // 模块拖拽状态
  isElDraggable: boolean // 元素拖拽状态
}

// 模块配置属性
export interface ModuleIF {
  groupName: string // 拖拽分组名称,groupName相同可以互相拖拽
  moduleId: string // 模块唯一标识
  title: string // 模块标题
  span: number // 栅格占位
  elementLists: ElementConfig[] // 元素列表
  visible?: boolean // 是否可见
  class?: string // 自定义样式类名
}

// 模块配置属性(组件内部使用)
export interface ModuleIFPrivate extends ModuleIF {
  showElementLists: ElementConfig[] // 显示的元素列表(组件内使用)
  hiddenElementLists: ElementConfig[] // 隐藏的元素列表(组件内使用)
}

// 分组信息
export interface GroupIF {
  groupName: string
  moduleList: ModuleIF[]
}

// 拖拽配置接口
export interface DragConfig {
  activeGroupName: string // 当前活动分组名称
  groupInfo: Record<string, GroupIF> // 分组信息
  isEditing: boolean
}

// 拖拽配置接口(组件内部使用)
export interface DragConfigPrivate extends DragConfig {
  currentGroupInfo: Record<string, GroupIF> // 当前分组信息
}

// 提供给后代组件的信息
export interface ProvideDragConfig {
  refreshTrigger: number
  localGroupInfo: Record<string, GroupIF> //本地的分组信息
  storeGroupInfo: Record<string, GroupIF> //存储的分组信息
  currentGroupInfo: Record<string, GroupIF> //当前分组信息
  allLocalElementsMap: ComputedRef<Record<string, ElementConfig>> //所有本地元素列表
  allSystemElementsMap: ComputedRef<Record<string, ElementConfig>> // 所有系统级元素列表
  allTenantElementsMap: ComputedRef<Record<string, ElementConfig>> // 所有租户级元素列表
  activeTemplate: Object
  state: ConfigState // 配置状态
  changeModules: Record<string, Function> //判断数据是否变化
}

// 拖拽事件类型
export interface DragEvent {
  oldIndex: number // 原始索引
  newIndex: number // 新索引
  item: HTMLElement // 拖拽元素
  from: HTMLElement // 源容器
  to: HTMLElement // 目标容器
}

export interface Template {
  mdInterfaceTemplateId?: string | number
  templateName: string
  templateContent: string
  isDefault: number
  isEditing: boolean
  level: string
}

export interface LayoutTemplates {
  sysLevelTemplate: Template
  tenantLevelTemplates: Template[]
  userLevelTemplates: Template[]
  userType: string
}

// 导出所有类型
export * from './customLabel'
export * from './element'

