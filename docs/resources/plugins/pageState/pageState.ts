// import { ref, Ref, isRef } from "vue";
// import router from "@/router";
// import _ from "lodash-es";

// export default class pageState {
//     private static stateMap = new Map();
//     // 默认按页面的路由来记录页面状态，
//     // 如果是独立的弹窗状态，不与页面关联,初始化时可以传入弹窗标识，如{ name: 'transceiverDialog' }
//     static instance(tagView?: TagView): pageState {
//         console.log('【 tagView 】-9', tagView)
//         if (_.isUndefined(tagView)) {
//             tagView = { ...router.currentRoute.value };
//         }
//         const route = tagView
//         if (!route) {
//             return new pageState();
//         }
//         const mapKey = tagView?.path || tagView?.name
//         if (!pageState.stateMap.has(mapKey)) {
//             pageState.stateMap.set(mapKey, new pageState());
//         }
//         console.log('【 stateMap 】-20', pageState.stateMap, pageState.stateMap.get(mapKey))
//         return pageState.stateMap.get(mapKey);
//     }

//     private isModify: boolean = false;

//     private diffFunctionObject: {} = {};
//     private diffFunctionList: Function[] = [];
//     private diffTargetList: Object[] = [];

//     reset(): pageState {
//         this.diffFunctionList = []
//         this.diffTargetList = []
//         this.diffFunctionObject = {}
//         this.modify(false);
//         return this;
//     }

//     modify(isModify?: boolean): boolean | pageState {
//         console.log('【 isModify 】-35', isModify, this.diffFunctionList)
//         if (_.isUndefined(isModify)) {
//             const hasListChange = this.diffFunctionList.some(hasItemChange => {
//                 return hasItemChange() === true
//             })
//             // 
//             let hasObjectChange = false
//             const hasDiffFunctionObject = Object.keys(this.diffFunctionObject).length > 0
//             if (hasDiffFunctionObject) {
//                 hasObjectChange = Object.keys(this.diffFunctionObject).some(function (key) {
//                     const hasItemChange = this.diffFunctionObject[key]
//                     return hasItemChange() === true
//                 });
//             }

//             return this.diffFunctionList.length || hasDiffFunctionObject ? hasListChange || hasObjectChange : this.isModify;
//         }
//         this.isModify = Boolean(isModify);
//         return this;
//     }

//     isEmpty(value: any): boolean {
//         return _.isNull(value) || _.isUndefined(value) || value === "";
//     }

//     addWatch(target: object,ignoreDeleteItemName:string) {
//         console.log('【 target 】-200', target)
//         const hasChange = function (): Function {
//             const val = isRef(target) ? target.value : target
//             const oldVal = JSON.parse(JSON.stringify(val))
//             const newVal = target
//             return function () {
//                 const val = isRef(newVal) ? newVal.value : newVal
//                 if(ignoreDeleteItemName){
//                     return !isGEqualNoDeleteItem(val, oldVal,ignoreDeleteItemName)
//                 }
//                 return !isGEqual(val, oldVal)
//             }
//         }
//         this.diffFunctionList.push(hasChange())
//         this.diffTargetList.push(target)
//     }

//     // key,value的形式添加监听对象的属性变化
//     setWatchByKey(key: string, target: Object) {
//         const val = isRef(target) ? target.value : target
//         const oldVal = JSON.parse(JSON.stringify(val))
//         this.diffFunctionObject[key].oldVal = oldVal
//         this.diffFunctionObject[key].target = target
//         const hasChange = function (): Function {
//             const newVal = target
//             const oldVal = this.diffFunctionObject[key].oldVal
//             return function () {
//                 const val = isRef(newVal) ? newVal.value : newVal
//                 return !isGEqual(val, oldVal)
//             }
//         }
//         this.diffFunctionObject[key].hasChange = hasChange()
//     }
//     // 更新旧值
//     resetWatchByKey(key: string) {
//         const target = this.diffFunctionObject[key].target
//         const val = isRef(target) ? target.value : target
//         const oldVal = JSON.parse(JSON.stringify(val))
//         this.diffFunctionObject[key].oldVal = oldVal
//     }
//     // 移除监听
//     removeWatchByKey(key: string) {
//         if (this.diffFunctionObject[key]) {
//             delete this.diffFunctionObject[key]
//         }
//     }
// }
// // 比较数据是否相等
// function isGEqual(newVal: any, oldVal: any) {
//     console.log('【 isGEqual 】-282', newVal, oldVal)
//     if (oldVal) {
//         const jsonParseNewVal = JSON.parse(JSON.stringify(newVal))
//         const jsonParseOldVal = JSON.parse(JSON.stringify(oldVal))
//         const newValue = removeCommonProperties(jsonParseNewVal)
//         const oldValue = removeCommonProperties(jsonParseOldVal)
//         return _.isEqual(newValue, oldValue)
//     } else {
//         return false
//     }
// }
// // 比较数据是否相等，忽略删除的元素
// function isGEqualNoDeleteItem(newVal: any, oldVal: any, ignoreDeleteItemName: string) {
//     if (oldVal) {
//         const jsonParseNewVal = JSON.parse(JSON.stringify(newVal))
//         const jsonParseOldVal = JSON.parse(JSON.stringify(oldVal))
        
//         // 传入ignoreDeleteItemName，让removeCommonProperties知道要保留哪个数组的id
//         const newValue = removeCommonProperties(jsonParseNewVal, ignoreDeleteItemName)
//         const oldValue = removeCommonProperties(jsonParseOldVal, ignoreDeleteItemName)
        
//         // 如果基本相等，直接返回true
//         if (_.isEqual(newValue, oldValue)) {
//             return true
//         }
        
//         // 如果不相等，检查差异是否只是指定数组中的对象减少
//         if (ignoreDeleteItemName && typeof ignoreDeleteItemName === 'string') {
//             return isOnlyArrayItemReduced(newValue, oldValue, ignoreDeleteItemName)
//         }
        
//         return false
//     } else {
//         return false
//     }
// }

// // 检查差异是否只是指定数组中的对象减少
// function isOnlyArrayItemReduced(newValue: any, oldValue: any, arrayPropertyName: string): boolean {
//     // 检查新旧值是否都有指定的数组属性
//     if (!newValue[arrayPropertyName] || !oldValue[arrayPropertyName]) {
//         return false
//     }
    
//     const newArray = newValue[arrayPropertyName]
//     const oldArray = oldValue[arrayPropertyName]
    
//     // 确保都是数组
//     if (!Array.isArray(newArray) || !Array.isArray(oldArray)) {
//         return false
//     }
    
//     // 找出oldArray中有但newArray中没有的项（被删除的项）
//     const removedItems = oldArray.filter((oldItem: any) => {
//         return !newArray.some((newItem: any) => {
//             return oldItem.id && newItem.id && oldItem.id === newItem.id
//         })
//     })
    
//     // 找出newArray中有但oldArray中没有的项（新增的项）
//     const addedItems = newArray.filter((newItem: any) => {
//         return !oldArray.some((oldItem: any) => {
//             return oldItem.id && newItem.id && oldItem.id === newItem.id
//         })
//     })
    
//     // 检查数组内部对象的数据是否发生了变化
//     const hasInternalDataChange = checkArrayInternalDataChange(newArray, oldArray)
    
//     // 检查其他属性是否相等（排除指定的数组属性）
//     const newValueWithoutArray = { ...newValue }
//     const oldValueWithoutArray = { ...oldValue }
//     delete newValueWithoutArray[arrayPropertyName]
//     delete oldValueWithoutArray[arrayPropertyName]
    
//     const otherPropertiesEqual = _.isEqual(newValueWithoutArray, oldValueWithoutArray)
    
//     // 只有当其他属性相等，数组内部数据无变化，且只是指定数组中的项减少（没有新增项）时，才返回true
//     return otherPropertiesEqual && !hasInternalDataChange && addedItems.length === 0 && removedItems.length > 0
// }

// // 检查数组内部对象的数据是否发生变化
// function checkArrayInternalDataChange(newArray: any[], oldArray: any[]): boolean {
//     // 遍历新数组中的每个对象
//     for (const newItem of newArray) {
//         // 在旧数组中找到对应的对象
//         const oldItem = oldArray.find(item => item.id && newItem.id && item.id === newItem.id)
//         if (oldItem) {
//             // 比较对象内部数据是否相等（排除id字段）
//             const newItemWithoutId = { ...newItem }
//             const oldItemWithoutId = { ...oldItem }
//             delete newItemWithoutId.id
//             delete oldItemWithoutId.id
            
//             if (!_.isEqual(newItemWithoutId, oldItemWithoutId)) {
//                 return true // 有内部数据变化
//             }
//         }
//     }
//     return false // 没有内部数据变化
// }
// function isNumber(obj) {
//     const numReg = /^\d+(\.\d+)?$/
//     if (numReg.test(obj)) {
//         return true
//     }
//     return false
// }
// function removeCommonProperties(obj, preserveIdArrayName?: string, parentKey?: string) {
//     // 忽略比较的字段
//     const ingoreProperty: [] = [
//         'id', // 默认忽略id
//         'createOrgId',
//         'createOrgName',
//         'createTime',
//         'creator',
//         'creatorName',
//         'depId',
//         'modifier',
//         'modifierName',
//         'modifyTime',
//         'recVer',
//         'rowState',
//         'rowStatus',
//         'operatorName',
//         'operatorId',
//         'operator',
//         '_X_ROW_KEY',
//         'rowUUID',
//         'normalType'
//     ]
    
//     for (const key in obj) {
//         if (ingoreProperty.includes(key)) {
//             // 如果是id字段，且当前对象在指定的数组中，则不删除
//             if (key === 'id' && preserveIdArrayName && parentKey === preserveIdArrayName) {
//                 // 只有当父级键名等于preserveIdArrayName时，才保留id
//                 continue
//             }
//             delete obj[key]
//         } else {
//             if (isNumber(obj[key])) {
//                 obj[key] = parseFloat(obj[key])
//             }
//             if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
//                 delete obj[key]
//             } else if (Array.isArray(obj[key])) {
//                 obj[key] = obj[key].filter((element) => {
//                     if (typeof element === 'object') {
//                         removeCommonProperties(element, preserveIdArrayName, key)
//                         return Object.keys(element).length !== 0
//                     }
//                     return element !== undefined && element !== null && element !== '' // 过滤掉空元素和 null 值
//                 })
//                 if (obj[key].length === 0) {
//                     delete obj[key]
//                 }
//             } else if (typeof obj[key] === 'object') {
//                 removeCommonProperties(obj[key], preserveIdArrayName, null)
//                 if (Object.keys(obj[key]).length === 0) {
//                     delete obj[key] // 如果嵌套对象也为空，则删除父级属性
//                 }
//             }
//         }
//     }
//     return obj
// }
