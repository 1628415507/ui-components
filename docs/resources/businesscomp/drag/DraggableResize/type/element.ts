/**
 * @Author: hongzf
 * @Date: 2 months ago
 * @task: task#20251020
 * @Description: 表单拖拽-添加ts
 * @Description: 元素项配置
 */

import type { CustomLabel } from './customLabel'
import { EL_ENUM } from './type/elementEnum'

// 复选框选项
export interface CheckboxOption {
  label: string // 标签文本
  value: string | number // 选项值
}

// 元素属性基础接口(所有元素共有的属性)
interface BaseElementConfig {
  elementId: string // 元素唯一标识
  span: number // 栅格占位
  label: string // 标签文本
  isVisible?: boolean // 是否可见(控制显示隐藏)
  showLabel?: boolean // 是否显示标签文本
  deletable?: boolean // 是否允许删除
  customLabel?: CustomLabel // 自定义标签
  class?: string // 自定义样式类
  style?: string // 自定义样式类
  formItemClass?: string // 自定义formItem样式类
}

// 表单控件属性
interface ControlConfig extends BaseElementConfig {
  prop: string // 表单字段名
  required?: boolean // 业务的必填配置
  requiredable?: boolean // 是否允许配置必填
  disabled?: boolean // 是否禁用
  fieldProp?: string // 字段属性名(组件内使用)
  fieldPropName?: string // 字段名称属性(组件内使用)
  //...控件本身自带的属性默认支持
}

// 输入框属性 - uiType 为 INPUT 时有效
interface Input extends ControlConfig {
  uiType: EL_ENUM.INPUT // UI类型
  fieldLength?: number //字段长度限制
  uppercase?: boolean // 是否大写
  append?: string // 后置内容
  change?: (val: any) => void // 值变化回调
}

// 文本域属性 - uiType 为 TEXTAREA 时有效
interface Textarea extends ControlConfig {
  uiType: EL_ENUM.TEXTAREA // UI类型
  rows: number // 行数
  fieldLength?: number //字段长度限制
  uppercase?: boolean // 是否大写
  change?: (val: any) => void // 值变化回调
}

// 字典下拉属性- uiType 为 DICT_SELECT 时有效
interface DictSelect extends ControlConfig {
  uiType: EL_ENUM.DICT_SELECT // UI类型
  dictName: string
  dictOption: any[] //字典选项数据
  change?: (val: any) => void // 值变化回调
}

// 普通下拉属性 - uiType 为 SELECT 时有效
interface Select extends ControlConfig {
  uiType: EL_ENUM.SELECT // UI类型
  dictOption: any[] // 下拉选项数据
  change?: (val: any) => void // 值变化回调
}

// 联想控件属性- uiType 为 ASSOCIATE 时有效
interface Associate extends ControlConfig {
  uiType: EL_ENUM.ASSOCIATE // UI类型
  nameProp: string // 显示名称的属性
  componentName: string // 联想控件名称
  isMuptiple?: boolean // 是否多选
  onSelect?: (val: any) => void // 选择回调
  // 联想控件的一些自定义参数
  [customkey: string]: any
}

// 数值输入框属性 - uiType 为 NUMBER_INPUT 时有效
interface NumberInput extends ControlConfig {
  uiType: EL_ENUM.NUMBER_INPUT // UI类型
  precision?: number // 精度
  min?: number // 最小值
  max?: number // 最大值
  append?: string // 后置内容
  suffix?: string // 后缀内容
  change?: (val: any) => void // 值变化回调
  appendSelect?: boolean // 是否在后面添加下拉选择框
  appendSelectProp?: string // 下拉选择框绑定的字段
  appendSelectOptions?: any[] //下拉选择框的选项
  appendSelectWidth?: string // 下拉选择框的宽度
}

// 日期控件属性 - uiType 为 DATE 时有效
interface Date extends ControlConfig {
  uiType: EL_ENUM.DATE | EL_ENUM.DATETIME | EL_ENUM.MONTH | EL_ENUM.DATETIMERANGE // UI类型
  change?: (val: any) => void // 值变化回调
  format?: string
  valueFormat?: string
}

// 复选框属性 - uiType 为 CHECKBOX 时有效
interface Checkbox extends ControlConfig {
  uiType: EL_ENUM.CHECKBOX // UI类型
  checkboxLabel?: string // 复选框标签
  trueValue?: number // true 对应的值
  falseValue?: number // false 对应的值
  change?: (val: any) => void // 值变化回调
}

// 复选框组属性 - uiType 为 CHECKBOX_GROUP 时有效
interface CheckboxGroup extends ControlConfig {
  uiType: EL_ENUM.CHECKBOX_GROUP // UI类型
  checkboxOptions: CheckboxOption[] // 复选框选项
  change?: (val: any) => void // 值变化回调
}

// 分隔输入框属性 - uiType 为 DIVIDER_INPUT 时有效
interface DividerInput extends ControlConfig {
  uiType: EL_ENUM.DIVIDER_INPUT // UI类型
  rows: number // 行数
  refName?: string // 引用名称
}

// 插槽属性 - uiType 为 SLOT 时有效
interface Slot extends ControlConfig {
  uiType: EL_ENUM.SLOT // UI类型
}

// 组件类型属性 - uiType 为 COMPONENT 时有效
interface Component extends ControlConfig {
  uiType: EL_ENUM.COMPONENT // UI类型
  componentName?: string // 组件名称
  component?: import('vue').Component // Vue组件实例
  getRef?: Function
}

// 容器元素属性 (没有 uiType, 但有 childrens, childrens 为一组)
interface Childrens extends BaseElementConfig {
  childrens: ElementConfig[] // 子元素列表
}

// 容器元素属性(没有 uiType,但有 elementLists)
interface ElementLists extends BaseElementConfig {
  groupName: string // 分组名称
  elementLists: ElementConfig[] // 元素列表
  showElementLists?: ElementConfig[] //显示的元素列表(组件内使用)
  hiddenElementLists?: ElementConfig[] //隐藏的元素列表(组件内使用)
}

// 元素属性(联合类型) - 根据不同的 uiType 提供不同的属性
export type ElementConfig =
  | Component
  | DictSelect
  | Input
  | Associate
  | NumberInput
  | Date
  | Select
  | Textarea
  | Checkbox
  | CheckboxGroup
  | Slot
  | DividerInput
  | Childrens
  | ElementLists

