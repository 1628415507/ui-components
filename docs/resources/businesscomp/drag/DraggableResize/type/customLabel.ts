/**
 * @Author: hongzf
 * @Date: 2 months ago
 * @task: task#20251020
 * @Description: 表单拖拽-添加ts
 * @Description: 自定义标签项配置
 */

// 基础标签项配置属性
interface BaseConfig {
  visible?: boolean // 是否可见
  disabled?: boolean // 是否禁用
  style?: string // 自定义样式
  class?: string // 自定义样式类
  click?: (item?: any) => void // 点击事件
}

// 文本类型标签
interface Text extends BaseConfig {
  type: 'text' // 标签类型
  text: string // 文本内容
}

// SVG图标类型标签
interface SvgIcon extends BaseConfig {
  type: 'svgIcon' // 标签类型
  iconName: string // 图标名称
}

// 链接类型标签
interface Link extends BaseConfig {
  type: 'link' // 标签类型
  text: string // 链接文本
  linkType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' // 链接类型
}

// 复选框类型标签
interface Checkbox extends BaseConfig {
  type: 'checkbox' // 标签类型
  prop: string // 表单字段名
  label?: string // 复选框标签
  trueValue?: number // 默认true值
  falseValue?: number // 默认false值
  change?: (val: any) => void // 值变化回调
}

// 按钮类型标签
interface Button extends BaseConfig {
  type: 'button' // 标签类型
  text: string // 按钮文本
  circle?: boolean
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' // 按钮类型
}

// 自定义标签项配置(联合类型)
export type CustomLabelItem = Text | SvgIcon | Link | Checkbox | Button

// 自定义标签配置
export interface CustomLabel {
  items: CustomLabelItem[] // 标签项列表
}

