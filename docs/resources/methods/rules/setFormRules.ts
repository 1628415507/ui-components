// import i18n from '@/lang/index'
import { Ref, isRef, Reactive, isReactive } from 'vue'
import type { FormInstance, FormItemContext, FormRules } from 'element-plus'

// 类型定义
interface IExtendsObject extends Record<string, any> {
  [propName: string]: any
}

interface IExtendsFormInstance extends FormInstance {
  cacheArrayProps?: IExtendsObject //缓存数组格式的prop对应的标签
}

// 常量定义
const DEFAULT_ERROR_WIDTH = 150
const DEFAULT_SPACING = 10
const SAFETY_MARGIN = 50
const DEFAULT_FONT = '12px Arial'

/**
 * 设置表单校验规则
 */
export function setFormRules(
  $form: FormInstance,
  customRules: Ref<FormRules> | Reactive<FormRules>,
  formData: Record<string, any>,
  formItemProp?: string
): void {
  // 参数校验
  if (!$form) {
    console.warn('表单实例获取失败,请尝试将方法放到nextTick中调用')
    return
  }
  if (!isRef(customRules) && !isReactive(customRules)) {
    console.error('校验规则绑定的对象需为Ref类型或Reactive类型')
    return
  }
  // 添加样式类
  $form.$el.classList.add('custom-form-error')
  // 检查是否启用悬停显示
  const showMessageHover = $form.$el?.attributes['show-message-hover']?.value
  if (showMessageHover === 'false') {
    $form.$el.classList.add('show-message-default')
  }
  if (formItemProp) {
    const el = $form.fields?.find((it) => it.prop === formItemProp)
    if (el) {
      //设置错误提示位置
      if (showMessageHover !== 'false') {
        setErrorPosition(el as FormItemContext)
      }
      setFormItemRule($form, customRules, formData, el as FormItemContext)
    }
    return
  }
  // 处理每个表单字段
  $form.fields?.forEach((el) => {
    // 设置错误提示位置
    if (showMessageHover !== 'false') {
      setErrorPosition(el as FormItemContext)
    }
    setFormItemRule($form, customRules, formData, el as FormItemContext)
  })
}

export function setFormItemRule(
  $form: FormInstance,
  customRules: Ref<FormRules> | Reactive<FormRules>,
  formData: Record<string, any>,
  el: FormItemContext
) {
  const prop = el.prop as string

  // 获取已有的校验规则
  const existingRules = isRef(customRules) ? (customRules.value as any)[prop] : (customRules as any)[prop]
  const noRules = !existingRules || (Array.isArray(existingRules) && existingRules.length === 0)
  if (noRules) {
    if (isRef(customRules)) {
      ; (customRules.value as any)[prop] = createNewRule(el, $form as IExtendsFormInstance)
    } else if (isReactive(customRules)) {
      ; (customRules as any)[prop] = createNewRule(el, $form as IExtendsFormInstance)
    }
  } else if (Array.isArray(existingRules)) {
    // 如果已有规则,则合并从DOM属性读取的规则
    const domRules = createNewRule(el, $form as IExtendsFormInstance)
    if (isRef(customRules)) {
      ; (customRules.value as any)[prop] = [...existingRules, ...domRules]
    } else if (isReactive(customRules)) {
      ; (customRules as any)[prop] = [...existingRules, ...domRules]
    }
  }
  // 处理数组表单项
  if (isArrayProp(prop)) {
    addArrayItemRule($form, el, customRules, formData)
  }
}

// 工具函数
const isArrayProp = (prop: string): boolean => /[\[\]]/.test(prop)

const getArrayPropIndex = (prop: string): number => {
  const matches = prop.match(/\[(.*?)\]/)
  return Number(matches?.[1]) || 0
}

const measureTextWidth = (text: string | null, fontStyle = DEFAULT_FONT): number => {
  if (!text) return DEFAULT_ERROR_WIDTH
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) return DEFAULT_ERROR_WIDTH
  context.font = fontStyle
  return context.measureText(text).width
}

/**
 * 格式化校验提示语标签
 */
function formatLabel(el: FormItemContext, $form: IExtendsFormInstance): string {
  const ruleLabel = el.$el?.attributes['rule-label']?.value //当label为空时的占位符rule-label
  const label = ruleLabel || el.label
  const prop = el.prop as string
  let res = label
  // 处理带冒号的标签
  if (label && [':', '：'].includes(label?.slice(-1))) {
    res = label.substring(0, label.length - 1) //去除标签中的冒号
    // 缓存数组格式的prop(只缓存index为0的prop)
    if (prop && isArrayProp(prop) && getArrayPropIndex(prop) === 0) {
      if (!$form.cacheArrayProps) {
        $form.cacheArrayProps = {}
      }
      $form.cacheArrayProps[prop] = res
    }
  } else if (!label && prop) {
    // 只有prop没有标签时,从缓存中获取
    const firstIndexProp: string = prop?.replace(/\[\d+\]/g, `[0]`) //获取数组中第一条数据对应的prop
    if ($form.cacheArrayProps) {
      res = $form.cacheArrayProps[firstIndexProp] //匹配数组中第一条prop的标签
    }
  }
  return res || ''
}

/**
 * 生成校验规则
 */
function createNewRule(el: FormItemContext, $form: IExtendsFormInstance): any[] {
  // const { t } = i18n.global
  const t = (key: string, params?: any) => {
    // 临时实现，实际应该使用 i18n
    if (key === 'rules.required') return `【${params?.label}】不能为空`
    if (key === 'rules.maxLength') return `最大长度${params?.maxLength}`
    if (key === 'rules.minLength') return `最小长度${params?.minLength}`
    return key
  }
  let ruleLabel = formatLabel(el, $form)
  let rules: any[] = []
  const { required } = el
  // 必填校验
  if (required) {
    rules.push({
      required: true,
      message: t('rules.required', { label: ruleLabel }),
      trigger: ['blur', 'change']
    })
  }
  // 最大长度校验
  const maxAttr = el.$el?.attributes['max']?.value
  if (maxAttr !== undefined) {
    const maxLength = Number(maxAttr)
    rules.push({
      type: 'string',
      max: maxLength,
      message: t('rules.maxLength', { label: ruleLabel, maxLength }),
      trigger: ['blur', 'change'],
      transform: (value: any) => String(value ?? '')
    })
  }
  // 最小长度校验
  const minAttr = el.$el?.attributes['min']?.value
  if (minAttr !== undefined) {
    const minLength = Number(minAttr)
    rules.push({
      type: 'string',
      min: minLength,
      message: t('rules.minLength', { label: ruleLabel, minLength }),
      trigger: ['blur', 'change'],
      transform: (value: any) => String(value ?? '')
    })
  }
  return rules
}

/**
 * 添加数组表单项校验规则
 */
function addArrayItemRule(
  $form: FormInstance,
  el: FormItemContext,
  customRules: Ref<FormRules> | Reactive<FormRules>,
  formData: IExtendsObject
): void {
  const prop = el.prop as string
  const arrayName = prop.split('[')[0]
  const arrayLength = formData[arrayName]?.length || 0
  if (getArrayPropIndex(prop) < arrayLength - 1) {
    const newProp = prop.replace(/\[\d+\]/g, `[${arrayLength - 1}]`)
    // 添加校验规则
    if (isRef(customRules) && !(customRules.value as any)[newProp]) {
      ; (customRules.value as any)[newProp] = createNewRule(el, $form)
    } else if (isReactive(customRules) && !(customRules as any)[newProp]) {
      ; (customRules as any)[newProp] = createNewRule(el, $form)
    }
  }
}

/**
 * 计算错误提示的最佳显示位置
 */
function calculateErrorPosition(
  formItem: FormItemContext,
  rect: DOMRect,
  errorWidth: number
): 'right' | 'left' | 'bottom' {
  const leftSpace = rect.left
  const rightSpace = window.innerWidth - rect.right
  // 通用智能定位逻辑:优先考虑右侧空间不足的情况
  if (rightSpace < errorWidth + DEFAULT_SPACING + SAFETY_MARGIN) {
    if (leftSpace >= errorWidth + DEFAULT_SPACING + SAFETY_MARGIN) {
      return 'left'
    } else {
      return 'bottom'
    }
  }
  return 'right'
}

/**
 * 应用错误提示样式
 */
function applyErrorStyles(content: HTMLElement, position: string): void {
  const newClassName = `error-${position}`
  if (!content.classList.contains(newClassName)) {
    // 清除旧样式
    content.classList.remove('error-right', 'error-left', 'error-bottom')
    content.classList.add(newClassName)
  }
}

/**
 * 动态设置校验提示语的位置
 */
export function setErrorPosition(formItem: FormItemContext): void {
  const el = formItem.$el as HTMLElement
  const content = el.querySelector('.el-form-item__content') as HTMLElement
  const inputElement = content.querySelector('input, textarea') as HTMLInputElement
  let errorEl: HTMLElement
  // 聚焦时隐藏错误提示
  const onFocusListener = (): void => {
    if (errorEl) errorEl.style.display = 'none'
  }
  // 鼠标移入处理
  const handleMouseEnter = (): void => {
    errorEl = el.querySelector('.el-form-item__error') as HTMLElement
    if (inputElement) {
      inputElement.addEventListener('focusin', onFocusListener)
    }
    const isFocused = document.activeElement === inputElement
    const hasError = errorEl && el.classList.contains('is-error')
    // 如果聚焦中或没有错误,则不显示
    if (isFocused || !hasError) {
      return
    }
    // 计算位置
    const rect = el.getBoundingClientRect()
    const errorWidth = measureTextWidth(errorEl.textContent)
    const position = calculateErrorPosition(formItem, rect, errorWidth)
    // 应用样式
    applyErrorStyles(content, position)
    errorEl.style.display = 'inline-block'
  }
  // 鼠标移出处理
  const handleMouseLeave = (): void => {
    if (errorEl) errorEl.style.display = 'none'
    if (inputElement) inputElement.removeEventListener('focusin', onFocusListener)
  }
  el.setAttribute('hover-listener', 'true') //设置enterIndex属性
  // 绑定事件
  content?.addEventListener('mouseenter', handleMouseEnter)
  content?.addEventListener('mouseleave', handleMouseLeave)
}
