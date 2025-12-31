import { ComponentInternalInstance } from 'vue'
import { VxeTableInstance } from 'vxe-table'

// 继承表格的原有实例并扩展
export interface IExtendsVxeTableInstance extends VxeTableInstance {
  hasEditData: Function //判断数据是否修改
  reset: Function //重置表格
}

/**
 * 暴露 vxe-table 的所有方法到父组件
 * @param tableRef 表格实例引用
 * @param instance Vue 组件实例
 */
export function exposeVxeTableMethods(
  tableRef: IExtendsVxeTableInstance | undefined,
  instance: ComponentInternalInstance | null
) {
  if (!tableRef || !instance) return

  // 确保 exposed 存在
  if (!instance.exposed) {
    instance.exposed = {}
  }

  // 获取表格实例的所有属性
  const tableEntries = Object.entries(tableRef)

  // 暴露所有属性
  for (const [key, value] of tableEntries) {
    if (typeof value === 'function') {
      // 对于方法,需要绑定正确的 this 上下文
      instance.exposed[key] = (...args: any[]) => {
        return (value as Function).apply(tableRef, args)
      }
    } else {
      // 对于属性,直接暴露
      instance.exposed[key] = value
    }
  }

  // 暴露原型方法
  const proto = Object.getPrototypeOf(tableRef)
  if (proto) {
    const protoEntries = Object.getOwnPropertyNames(proto)
    for (const key of protoEntries) {
      if (key !== 'constructor' && typeof proto[key] === 'function' && !instance.exposed[key]) {
        instance.exposed[key] = (...args: any[]) => {
          return proto[key].apply(tableRef, args)
        }
      }
    }
  }
}

/**
 * 检查表格实例是否有效
 */
export function isValidTableInstance(
  tableRef: IExtendsVxeTableInstance | undefined
): tableRef is IExtendsVxeTableInstance {
  return !!tableRef && typeof tableRef === 'object'
}

