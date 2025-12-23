export interface ILayout {
  layoutCode: string // 唯一标识、插槽名称(使用插槽时生效)
  elementLists: IElement[]
  isDefault?: boolean //默认显示
}

export interface IElement {
  elementCode: string
  layoutCode: string
  uiType: string
  fieldText: string
  fieldProp: string
  fieldLength?: string
  defaultValue?: string
  operation?: string
  rangeType?: 'start' | 'end' //日期的开始、结束类型
}

// 控件类型枚举
export const enum EL_ENUM {
  INPUT = 'input', // 输入框
  DIVIDER_INPUT = 'dividerInput', //35字符分割线输入框
  NUMBER_INPUT = 'number', // 数字输入框
  TEXTAREA = 'textarea', // 文本域
  DATE = 'date', // 日期
  DATETIME = 'datetime', // 日期时间
  MONTH = 'month', // 日期月份
  ASSOCIATE = 'associate', // 联想控件
  SELECT = 'select', //普通下拉
  DICT_SELECT = 'dictionary', //字典下拉
  SLOT = 'slot', //自定义插槽
  DATETIMERANGE = 'datetimerange',
  AUTOCOMPLETE = 'autocomplete', //自动完成
  CUSTOM = 'custom', // 自定义插槽
  COMPONENT = 'component', //组件
  CHECKBOX = 'checkbox', //复选框
  CHECKBOX_GROUP = 'checkbox_group' //复选框组
}

export const enum RANGE_TYPE {
  Start = 'start',
  End = 'end'
}

