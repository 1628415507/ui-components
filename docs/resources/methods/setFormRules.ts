// import i18n from '@/lang/index'
import { nextTick, Ref } from 'vue'
import type { FormInstance, FormItemContext, FormRules } from 'element-plus'
interface IExtendsObject extends Object {
  [propName: string]: any // 给接口添加索引标签
}

// 继承form的原有实例并扩展
interface IExtendsFormInstance extends FormInstance {
  cacheArrayProps?: IExtendsObject //缓存数组格式的prop对应的标签
}

// 设置数组的校验
export function setFormRules($form: FormInstance, customRules: Ref<FormRules>, formData: Object) {
  // 获取必填的表单项， 重新格式化校验提示语
  if (!$form) {
    console.error('【 setFormRules 】 表单实例不能为空')
    return
  }
  if (!$form.fields) {
    console.error('element-plus版本需大于2.7.3')
    return
  }
  // 是否移入时显示提示语
  const showMessageHover = $form.$el?.attributes['show-message-hover']?.value
  if (showMessageHover === 'false') {
    $form.$el.classList.add(`show-message-default`);
  }
  // console.log('【  $form.fields 】-173', $form.fields)
  $form.fields?.forEach((el: FormItemContext) => {
    if (showMessageHover !== 'false') {
      setErrorPosition(el)
    }
    const prop = el.prop as string
    // 添加到自定义校验规则中( 如果传入的customRules中已经有自定义校验，则以传入的自定义校验为主)
    if (!customRules.value[prop]) {
      customRules.value[prop] = createNewRule(el, $form)
    }
    // 将动态新增的数组表单项添加到校验规则中
    isArrayProp(prop) && addArrayItemRule($form, el, customRules, formData)
  })
  // console.log('【 customRules.value 】-25', customRules.value)
}

export type RuleFunc = (options: any) => boolean;

// 判断是否是数组格式的prop (mfCtnRequestDetails[0].ctnSizeType)
function isArrayProp(prop: string): boolean {
  return /[\[\]]/.test(prop)
}

// 获取数组格式prop中的index
function getArrayPropIndex(prop: string): number {
  const regex = /\[(.*?)\]/;
  const matches = prop.match(regex); // 返回匹配到的结果数组 "[1]"=>1
  const result = matches ? matches[1] : 0;
  return Number(result) || 0
}

// 重新格式化校验提示语
function formatLabel(el: FormItemContext, $form: IExtendsFormInstance): string {
  const ruleLabel = el.$el?.attributes['rule-label']?.value//当label为空时的占位符rule-label
  const label = ruleLabel || el.label
  const prop = el.prop as string
  let res = label
  // 判断标签是否有冒号
  if (label && [':', '：'].includes(label?.slice(-1))) {
    res = label.substring(0, label.length - 1)//去除标签中的冒号
    // 缓存数组格式的prop(只缓存index为0的prop)
    if (prop && isArrayProp(prop) && getArrayPropIndex(prop) === 0) {
      if (!$form.cacheArrayProps) {
        $form.cacheArrayProps = {}
      }
      $form.cacheArrayProps[prop] = res
    }
  } else if (!label && prop) {
    // 只有prop没有标签
    const firstIndexProp: string = prop?.replace(/\[\d+\]/g, `[0]`);//获取数组中第一条数据对应的prop
    if ($form.cacheArrayProps) {
      res = $form.cacheArrayProps[firstIndexProp] //匹配数组中第一条prop的标签
    }
  }
  return res || ''
}

// 生成校验规则
function createNewRule(el: FormItemContext, $form: IExtendsFormInstance) {
  // const { t } = i18n.global;
  let ruleLabel = formatLabel(el, $form)
  let rules = []
  const { required } = el
  // 必填
  if (required) {
    rules.push({ required: true, message: `【${ruleLabel}】不能为空`, trigger: ['blur', 'change'] })
  }
  // 最大长度限制
  const max = el.$el?.attributes['max']?.value
  if (max !== undefined) {
    rules.push({ max: Number(max), message: `最大长度${max}`, trigger: ['blur', 'change'] })
  }
  // 最小长度限制
  const min = el.$el?.attributes['min']?.value
  if (min !== undefined) {
    rules.push({ min: Number(min), message: `最小长度${min}`, trigger: ['blur', 'change'] })
  }
  // const customRule = el.$el?.attributes['custom-rule']?.value
  // const customRule = el.$el?.getAttribute['rule']?.value
  // console.log('【 customRule 】-57', el.prop, customRule, el)
  // if (customRule) {
  //   let obj
  //   try {
  //     obj = JSON.parse(customRule)
  //     console.log('【 obj 】-69', obj)
  //   } catch {
  //     console.log('【 error 】-72',)
  //   }
  // }
  return rules
}

// 将新增的表单项添加到校验规则中
function addArrayItemRule($form: FormInstance, el: FormItemContext, customRules: Ref<FormRules>, formData: IExtendsObject) {
  const prop = el.prop as string
  // console.log('【 addArrayItemRule 】-62', prop)
  const arrayName = prop.split('[')[0]
  const len = formData[arrayName]?.length || 0
  if (getArrayPropIndex(prop) < len - 1) {
    let newProp: string = prop.replace(/\[\d+\]/g, `[${len - 1}]`)//添加新的prop
    // console.log('【 newProp 】-67', newProp)
    // 添加校验规则
    if (!customRules.value[newProp]) {
      customRules.value[newProp] = createNewRule(el, $form)
    }
  }
}
// 动态设置校验提示语的位置
function setErrorPosition(formItem: FormItemContext) {
  const el = formItem.$el as HTMLElement
  const content = el.querySelector('.el-form-item__content') as HTMLElement;
  // 鼠标移入时计算位置
  const handleMouseEnter = (isInit: boolean) => {
    // 等待DOM更新完成
    nextTick(() => {
      const errorEl = el.querySelector('.el-form-item__error');
      // 移入&如果存在错误提示元素且表单项处于错误状态
      if (!isInit && !(errorEl && el.classList.contains('is-error'))) {
        return
      }
      // 获取表单控件位置信息
      const rect = el.getBoundingClientRect();
      // 默认错误提示宽度(可根据实际情况调整)
      const errorWidth = 150;
      // const errorHeight = 30; // 估计的错误提示高度
      const spacing = 10; // 间距
      const viewportWidth = window.innerWidth;
      // const viewportHeight = window.innerHeight;

      // 找出四个方向的可用空间
      // const leftSpace = rect.left;
      const rightSpace = viewportWidth - rect.right;
      // const topSpace = rect.top;
      // const bottomSpace = viewportHeight - rect.bottom;
      let errorPosition
      // 确定最佳位置
      if (rightSpace >= errorWidth + spacing) {
        errorPosition = 'right';
      } else {
        errorPosition = 'bottom';
      }
      content.classList.add(`error-${errorPosition}`);

      // if (rightSpace >= errorWidth + spacing) {
      //   errorPosition = 'right';
      // }else if (leftSpace >= errorWidth + spacing && leftSpace >= rightSpace) {
      //   errorPosition = 'left';
      // } else  if (bottomSpace >= errorHeight + spacing) {
      //   errorPosition = 'bottom';
      // } else {
      //   errorPosition = 'top';
      // }
      // // 强制重新计算样式
      // errorEl.style.display = 'none';
      // requestAnimationFrame(() => {
      //   errorEl.style.display = '';
      // });
    });
  };
  handleMouseEnter(true)
  // content?.addEventListener('mouseenter', handleMouseEnter);
}