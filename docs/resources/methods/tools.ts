import _ from 'lodash-es'

// 校验对象值是否变化
export function isEqual(newVal, oldVal, config?: {}) {
  if (oldVal) {
    const jsonParseNewVal = JSON.parse(JSON.stringify(newVal))
    const jsonParseOldVal = JSON.parse(JSON.stringify(oldVal))
    const newValue = removeCommonProperties(jsonParseNewVal, config)
    const oldValue = removeCommonProperties(jsonParseOldVal, config)
    // console.log(' 【newValue, oldValue】 -290', newValue, oldValue)
    return _.isEqual(newValue, oldValue)
  } else {
    return false
  }
}

export function removeCommonProperties(obj, config = {}) {
  const { ingoreProps = [], includesProps = [], propsDefaultValue = {} } = config
  const ingoreProperty = [
    'id',
    'createOrgId',
    'createOrgName',
    'createTime',
    'creator',
    'creatorName',
    'depId',
    'modifier',
    'modifierName',
    'modifyTime',
    'recVer',
    'rowState',
    'rowStatus',
    'operatorName',
    'operatorId',
    'operator',
    '_X_ROW_KEY',
    'rowUUID',
    'tempChecked',
    ...ingoreProps
  ]

  // if (Array.isArray(obj)) {
  //   if (obj.length === 0) {
  //     return obj
  //   }
  // }

  // obj = obj.filter((element) => {
  //   // console.log('【propsDefaultValue[key]】 -397', propsDefaultValue[key])
  //   // 有配置默认值
  //   // if (obj[key] === undefined && propsDefaultValue[key] !== undefined) {
  //   //   obj[key] = propsDefaultValue[key]
  //   // }
  // })

  // if (typeof element === 'object') {
  // }
  // for (const defKey in propsDefaultValue) {
  //   if (element[defKey] === undefined) {
  //     element[defKey] = propsDefaultValue[defKey]
  //     console.log('【defKey】-396', defKey, element)
  //   }
  // }
  // removeCommonProperties(element, config) // 递归处理嵌套对象
  // return Object.keys(element).length !== 0 // 过滤掉空对象

  for (const key in obj) {
    // console.log('【key】-408', key, obj[key])
    if (ingoreProperty.includes(key) || (includesProps.length && !includesProps.includes(key))) {
      delete obj[key]
    } else {
      if (isNumber(obj[key])) {
        obj[key] = parseFloat(obj[key])
      }
      if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
        delete obj[key]
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].filter((element) => {
          if (typeof element === 'object') {
            // 设置默认值
            for (const defKey in propsDefaultValue) {
              if (element[defKey] === undefined) {
                element[defKey] = propsDefaultValue[defKey]
              }
            }
            removeCommonProperties(element, config) // 递归处理嵌套对象
            return Object.keys(element).length !== 0 // 过滤掉空对象
          }
          return element !== undefined && element !== null && element !== '' // 过滤掉空元素和 null 值
        })
        if (obj[key].length === 0) {
          delete obj[key]
        }
      } else if (typeof obj[key] === 'object') {
        removeCommonProperties(obj[key], config) // 递归处理嵌套对象
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key] //如果嵌套对象也为空,则删除父级属性
        }
      }
    }
  }
  return obj
}

function isNumber(obj) {
  const numReg = /^\d+(\.\d+)?$/
  if (numReg.test(obj)) {
    return true
  }
  return false
}

