# DraggableResize 拖拽表单组件

## 📖 概述

`DraggableResize` 是一个功能强大的 Vue 3 拖拽表单组件，支持动态配置表单布局、元素拖拽排序、嵌套拖拽、模板保存等功能。组件采用配置驱动的方式，通过 JSON 配置即可快速构建复杂的动态表单。

## ✨ 核心特性

- ✅ **拖拽排序**：支持模块和元素的拖拽排序
- ✅ **嵌套拖拽**：支持最多两级嵌套拖拽
- ✅ **动态配置**：通过配置对象动态生成表单
- ✅ **多种控件**：支持输入框、下拉、日期、复选框等多种表单控件
- ✅ **自定义标签**：支持自定义标签，包含文本、链接、复选框、按钮等
- ✅ **插槽支持**：支持自定义插槽内容
- ✅ **模板管理**：支持模板保存、切换、删除等功能
- ✅ **表单验证**：集成 Element Plus 表单验证
- ✅ **响应式布局**：基于 Element Plus 栅格系统
- ✅ **宽度调整**：支持拖拽调整元素宽度
- ✅ **元素增加**：支持动态添加表单元素

## 📁 组件结构

```
DraggableResize/
├── index.vue                    # 主控制组件 (DraggableResizeControl)
├── DragModule.vue               # 模块拖拽组件
├── DragElement.vue              # 元素拖拽组件
├── Element.vue                  # 元素渲染组件
├── FormItem.vue                 # 表单项包装组件
├── ElementSetting.vue          # 元素设置组件（必填配置）
├── AddDrawer.vue                # 元素增加抽屉
├── AddDrawerDrag.vue            # 元素添加拖拽组件
├── SaveTemplateDialog.vue       # 保存模板对话框
├── SaveTemplateAsDialog.vue      # 另存为模板对话框
├── SwitchTemplateDialog.vue     # 切换模板对话框
├── TemplateAuthorizationDialog.vue # 模板授权对话框
├── utils/
│   └── useTemplate.ts           # 模板工具类
├── type/                         # 类型定义
│   ├── index.ts                 # 类型统一导出
│   ├── element.ts               # 元素配置类型
│   ├── elementEnum.ts           # 元素枚举
│   ├── customLabel.ts           # 自定义标签类型
│   └── SystemEnum.ts            # 系统枚举
└── demo/                         # 使用示例
    ├── index.vue                # 示例主文件
    ├── mainConfig.ts            # 主配置示例
    └── secondConfig.ts          # 次配置示例
```

## 🚀 快速开始

### 1. 基础使用

```vue
<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form
      ref="dragFormRef"
      :model="formData"
      :rules="formDataRules"
      :disabled="dragConfig.isEditing"
      label-position="top"
    >
      <!-- 基本信息模块 -->
      <z-info-card :header="'基本信息'" class="mt-10">
        <DragElement
          :groupName="GROUPNAME.MAIN"
          moduleId="basicInfoCard"
          :config="dragConfig"
          :formRef="dragFormRef"
          :formValue="formData"
          :formRules="formDataRules"
        />
      </z-info-card>
      
      <!-- 模块拖拽区域 -->
      <DragModule :groupName="GROUPNAME.MAIN" :config="dragConfig">
        <template #cargoInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement
              :groupName="GROUPNAME.MAIN"
              moduleId="cargoInfoId"
              :config="dragConfig"
              :formRef="dragFormRef"
              :formValue="formData"
              :formRules="formDataRules"
            />
          </z-info-card>
        </template>
      </DragModule>
    </el-form>
  </DraggableResizeControl>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import DraggableResizeControl from '../index.vue'
import DragModule from '../DragModule.vue'
import DragElement from '../DragElement.vue'
import { getModuleList } from './mainConfig.ts'

const GROUPNAME = {
  MAIN: 'mainGroupName',
  SECOND: 'secondGroupName'
}

// 表单数据
const formData = reactive({})

// 表单验证规则
const formDataRules = ref({})
const dragFormRef = ref(null)

// 组件参数
const componentParams = reactive({
  GROUPNAME,
  formData,
  readOnlyPage: false
})

// 拖拽配置
const dragConfig = reactive({
  activeGroupName: GROUPNAME.MAIN,
  groupInfo: {},
  isEditing: false,
  currentGroupInfo: {}
})

// 配置分组信息
const mainGroupNameConfig = reactive({
  groupName: GROUPNAME.MAIN,
  moduleList: computed(() => getModuleList(componentParams))
})
dragConfig.groupInfo[GROUPNAME.MAIN] = mainGroupNameConfig

onMounted(async () => {
  await nextTick(() => {
    mainGroupNameConfig.moduleList = computed(() => getModuleList(componentParams))
  })
})
</script>
```

### 2. 配置模块列表

创建 `mainConfig.ts` 文件：

```typescript
import { EL_ENUM } from '../type/elementEnum'
import type { ModuleIF } from '../type/index'

export function getModuleList(params: any): ModuleIF[] {
  const { GROUPNAME, readOnlyPage } = params
  
  // 基本信息模块
  const basicInfo: ModuleIF = {
    groupName: GROUPNAME.MAIN,
    moduleId: 'basicInfoCard',
    visible: false, // 不在 DragModule 中显示
    title: '基本信息',
    span: 24,
    elementLists: [
      {
        elementId: 'name',
        span: 6,
        prop: 'name',
        label: '姓名',
        uiType: EL_ENUM.INPUT,
        disabled: readOnlyPage
      },
      {
        elementId: 'age',
        span: 6,
        prop: 'age',
        label: '年龄',
        uiType: EL_ENUM.NUMBER_INPUT,
        min: 0,
        max: 150,
        disabled: readOnlyPage
      }
    ]
  }
  
  return [basicInfo]
}
```

## 📚 API 文档

### DraggableResizeControl (主组件)

#### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| config | 拖拽配置对象 | `DragConfigPrivate` | - | ✅ |

#### DragConfigPrivate 接口

```typescript
interface DragConfigPrivate {
  activeGroupName: string        // 当前活动分组名称
  groupInfo: Record<string, GroupIF>  // 所有分组信息
  isEditing: boolean             // 是否处于编辑模式
  currentGroupInfo: Record<string, GroupIF>  // 当前分组信息（组件内部使用）
}
```

#### 功能说明

- **编辑模式**：点击锁定/解锁图标进入/退出编辑模式
- **模块拖拽**：编辑模式下点击"版块拖动"按钮，可拖拽模块顺序
- **元素增加**：编辑模式下点击"元素增加"按钮，打开抽屉添加元素
- **模板管理**：支持保存、切换、删除模板（需要配置模板相关接口）

### DragModule (模块拖拽组件)

#### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| groupName | 拖拽分组名称 | `string` | - | ✅ |
| config | 拖拽配置对象 | `DragConfigPrivate` | - | ✅ |
| gap | 模块间距（px） | `number` | 10 | ❌ |

#### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 模块内容插槽 | `{ element: moduleEl }` - moduleEl 为模块配置对象 |

#### 功能说明

- 支持模块拖拽排序
- 自动计算模块间距
- 支持响应式布局（基于 Element Plus 栅格系统）

### DragElement (元素拖拽组件)

#### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| groupName | 拖拽分组名称 | `string` | - | ✅ |
| moduleId | 模块唯一标识 | `string` | - | ✅ |
| config | 拖拽配置对象 | `DragConfigPrivate` | - | ✅ |
| formRef | 表单实例 | `FormInstance` | - | ✅ |
| formValue | 表单数据对象 | `Record<string, any>` | `{}` | ✅ |
| formRules | 表单验证规则 | `FormRules` | - | ✅ |
| components | 自定义组件映射 | `Object` | - | ❌ |
| componentParams | 组件参数 | `Record<string, any>` | - | ❌ |
| level | 嵌套层级 | `number` | `1` | ❌ |
| parentCol | 父元素配置 | `ElementConfig` | - | ❌ |
| collapseHeight | 收缩高度 | `string` | `'110px'` | ❌ |
| collapsible | 是否可收缩 | `boolean` | `false` | ❌ |

#### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| [elementId] | 元素插槽，插槽名为 elementId | `{ element: colEl }` - colEl 为元素配置对象 |

#### 功能说明

- 支持元素拖拽排序
- 支持最多两级嵌套拖拽
- 支持拖拽调整元素宽度
- 支持元素删除（非必填且 deletable 不为 false）
- 支持展开/收缩（collapsible 为 true 时）

### Element (元素渲染组件)

#### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| formValue | 表单数据对象 | `Record<string, any>` | - | ✅ |
| config | 元素配置对象 | `ElementConfig` | - | ✅ |
| element | 元素配置对象 | `ElementConfig` | - | ✅ |

#### 支持的控件类型

| uiType | 说明 | 特殊属性 |
|--------|------|----------|
| `EL_ENUM.INPUT` | 输入框 | `fieldLength`, `uppercase`, `append` |
| `EL_ENUM.TEXTAREA` | 文本域 | `rows`, `fieldLength`, `uppercase` |
| `EL_ENUM.NUMBER_INPUT` | 数字输入框 | `precision`, `min`, `max`, `append`, `suffix`, `appendSelect` |
| `EL_ENUM.SELECT` | 普通下拉 | `options` |
| `EL_ENUM.DICT_SELECT` | 字典下拉 | `dictName`, `dictOption`, `multiple` |
| `EL_ENUM.DATE` | 日期选择器 | `format`, `valueFormat`, `rangeType` |
| `EL_ENUM.DATETIME` | 日期时间选择器 | `format`, `valueFormat` |
| `EL_ENUM.DATETIMERANGE` | 日期时间范围 | `valueFormat` |
| `EL_ENUM.CHECKBOX` | 复选框 | `checkboxLabel`, `trueValue`, `falseValue` |
| `EL_ENUM.CHECKBOX_GROUP` | 复选框组 | `checkboxOptions` |
| `EL_ENUM.DIVIDER_INPUT` | 35字符分隔输入框 | `rows`, `refName` |
| `EL_ENUM.SLOT` | 自定义插槽 | - |
| `EL_ENUM.COMPONENT` | 自定义组件 | `componentName`, `component` |
| `EL_ENUM.ASSOCIATE` | 联想控件 | `componentName`, `nameProp` |

### FormItem (表单项包装组件)

#### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| groupName | 拖拽分组名称 | `string` | - | ✅ |
| formValue | 表单数据对象 | `Record<string, any>` | - | ✅ |
| config | 拖拽配置对象 | `DragConfigPrivate` | - | ✅ |
| colEl | 元素配置对象 | `ElementConfig` | - | ✅ |

#### 功能说明

- 支持自定义标签（customLabel）
- 支持表单验证
- 支持嵌套对象字段（如 `user.name`）

## 🎨 配置详解

### ModuleIF (模块配置)

```typescript
interface ModuleIF {
  groupName: string              // 拖拽分组名称，相同 groupName 可互相拖拽
  moduleId: string               // 模块唯一标识
  title: string                  // 模块标题
  span: number                   // 栅格占位（1-24）
  elementLists: ElementConfig[]  // 元素列表
  visible?: boolean              // 是否在 DragModule 中显示为可拖拽卡片，false 时不在模块列表中显示
  class?: string                 // 自定义样式类名
}
```

### ElementConfig (元素配置)

#### 基础属性

```typescript
interface BaseElementConfig {
  elementId: string              // 元素唯一标识
  span: number                   // 栅格占位（1-24）
  label: string                  // 标签文本
  prop?: string                  // 表单字段名（支持嵌套，如 'user.name'）
  isVisible?: boolean            // 是否可见
  showLabel?: boolean            // 是否显示标签文本
  deletable?: boolean            // 是否允许删除（默认 true）
  required?: boolean             // 是否必填
  requiredable?: boolean         // 是否允许配置必填
  disabled?: boolean             // 是否禁用
  customLabel?: CustomLabel     // 自定义标签
  class?: string                // 自定义样式类
  style?: string                // 自定义样式
  formItemClass?: string        // formItem 样式类
  formItemStyle?: string        // formItem 样式
}
```

#### 输入框 (INPUT)

```typescript
{
  uiType: EL_ENUM.INPUT,
  prop: string,              // 表单字段名
  fieldLength?: number,      // 字段长度限制
  uppercase?: boolean,       // 是否大写
  append?: string,          // 后置内容
  change?: (val: any) => void,
  required?: boolean,        // 是否必填
  disabled?: boolean        // 是否禁用
}
```

#### 文本域 (TEXTAREA)

```typescript
{
  uiType: EL_ENUM.TEXTAREA,
  prop: string,
  rows: number,             // 行数
  fieldLength?: number,
  uppercase?: boolean,
  change?: (val: any) => void
}
```

#### 数字输入框 (NUMBER_INPUT)

```typescript
{
  uiType: EL_ENUM.NUMBER_INPUT,
  prop: string,
  precision?: number,       // 精度
  min?: number,            // 最小值
  max?: number,            // 最大值
  append?: string,         // 后置内容
  suffix?: string,         // 后缀内容
  appendSelect?: boolean,  // 是否在后面添加下拉选择框
  appendSelectProp?: string,
  appendSelectOptions?: any[],
  appendSelectWidth?: string
}
```

#### 日期选择器 (DATE / DATETIME)

```typescript
{
  uiType: EL_ENUM.DATE | EL_ENUM.DATETIME,
  prop: string,
  format?: string,         // 显示格式
  valueFormat?: string,    // 值格式
  change?: (val: any) => void
}
```

#### 下拉选择 (SELECT)

```typescript
{
  uiType: EL_ENUM.SELECT,
  prop: string,
  options: any[] | (() => any[]), // 选项数据
  dictCode?: string,       // 选项值字段名
  dictTableName?: string,  // 选项标签字段名
  change?: (val: any) => void
}
```

#### 字典下拉 (DICT_SELECT)

```typescript
{
  uiType: EL_ENUM.DICT_SELECT,
  prop: string,
  dictName: string,        // 字典编码
  dictOption: any[],       // 字典数据
  multiple?: boolean,      // 是否多选
  change?: (val: any) => void
}
```

#### 复选框 (CHECKBOX)

```typescript
{
  uiType: EL_ENUM.CHECKBOX,
  prop: string,
  checkboxLabel?: string,   // 复选框标签
  trueValue?: any,         // true 对应的值
  falseValue?: any,        // false 对应的值
  change?: (val: any) => void
}
```

#### 复选框组 (CHECKBOX_GROUP)

```typescript
{
  uiType: EL_ENUM.CHECKBOX_GROUP,
  prop: string,
  checkboxOptions: Array<{
    label: string,
    value: string | number
  }>,
  change?: (val: any) => void
}
```

#### 联想控件 (ASSOCIATE)

```typescript
{
  uiType: EL_ENUM.ASSOCIATE,
  prop: string,
  nameProp: string,        // 显示名称的字段
  componentName: string,    // 联想控件组件名称
  select?: (val: any) => void, // 选择回调
  // 其他联想控件自定义参数
  [key: string]: any
}
```

#### 自定义标签 (CustomLabel)

```typescript
interface CustomLabel {
  items: CustomLabelItem[]       // 标签项列表
}

// 标签项类型
type CustomLabelItem = 
  | { type: 'text', text: string }                    // 文本
  | { type: 'link', text: string, linkType?: string } // 链接
  | { type: 'button', text: string, buttonType?: string } // 按钮
  | { type: 'checkbox', prop: string, label?: string }   // 复选框
  | { type: 'svgIcon', iconName: string }            // SVG图标
```

#### 示例：自定义标签

```typescript
{
  elementId: 'mawbNo',
  span: 4,
  prop: 'order.mawbNo',
  label: '主单号',
  uiType: EL_ENUM.INPUT,
  customLabel: {
    items: [
      { type: 'text', text: '主单号' },
      {
        type: 'checkbox',
        prop: 'order.isUseMawbList',
        style: 'margin-left:auto;',
        change: (val) => {
          console.log('复选框变化', val)
        }
      },
      {
        type: 'link',
        text: '挑选主单号',
        disabled: readOnlyPage,
        click: () => {
          openMawbDialog()
        }
      }
    ]
  }
}
```

### 嵌套拖拽配置

支持最多两级嵌套，通过 `elementLists` 属性实现：

```typescript
{
  elementId: 'cargoInfo_left',
  span: 16,
  label: '货物信息-左侧',
  requiredable: false,
  deletable: false,
  elementLists: [  // 第二层嵌套
    {
      elementId: 'custBizNo',
      span: 6,
      prop: 'order.custBizNo',
      label: '客户订单号',
      uiType: EL_ENUM.INPUT
    },
    {
      elementId: 'goodsName',
      span: 12,
      prop: 'order.goodsName',
      label: '品名',
      uiType: EL_ENUM.TEXTAREA,
      rows: 3
    }
  ]
}
```

### 插槽使用

#### 1. 模块插槽（DragModule）

```vue
<DragModule :groupName="GROUPNAME.MAIN" :config="dragConfig">
  <template #cargoInfoId="{ element: moduleEl }">
    <z-info-card :header="moduleEl.title">
      <DragElement
        :groupName="GROUPNAME.MAIN"
        moduleId="cargoInfoId"
        :config="dragConfig"
        :formRef="formRef"
        :formValue="formData"
        :formRules="formRules"
      />
    </z-info-card>
  </template>
</DragModule>
```

#### 2. 元素插槽（DragElement）

```typescript
// 配置中设置 uiType 为 EL_ENUM.SLOT
{
  elementId: 'cargoInfo_right',
  span: 8,
  prop: '',
  label: '货物信息-右侧',
  requiredable: false,
  deletable: false,
  uiType: EL_ENUM.SLOT  // 插槽类型不支持跨模块拖拽
}
```

```vue
<DragElement
  :groupName="GROUPNAME.MAIN"
  moduleId="cargoInfoId"
  :config="dragConfig"
  :formRef="formRef"
  :formValue="formData"
  :formRules="formRules"
>
  <template #cargoInfo_right="{ element }">
    <!-- 自定义右侧信息内容 -->
    自定义内容
  </template>
</DragElement>
```

### 自定义组件

#### 方式一：直接引用组件

```typescript
import CustomComponent from './CustomComponent.vue'

{
  elementId: 'customComponent',
  span: 12,
  prop: '',
  label: '自定义组件',
  uiType: EL_ENUM.COMPONENT,
  component: CustomComponent  // 直接引用
}
```

#### 方式二：通过 componentName

```typescript
{
  elementId: 'customComponent',
  span: 12,
  prop: '',
  label: '自定义组件',
  uiType: EL_ENUM.COMPONENT,
  componentName: 'CustomComponent'  // 组件名称
}
```

```vue
<DragElement
  :components="{
    CustomComponent: () => import('./CustomComponent.vue')
  }"
  :componentParams="componentParams"
/>
```

## 📝 完整示例

### 示例 1：基础表单

```vue
<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form ref="formRef" :model="formData" :rules="formRules">
      <DragModule :groupName="GROUPNAME.MAIN" :config="dragConfig">
        <template #basicInfo="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title">
            <DragElement
              :groupName="GROUPNAME.MAIN"
              moduleId="basicInfo"
              :config="dragConfig"
              :formRef="formRef"
              :formValue="formData"
              :formRules="formRules"
            />
          </z-info-card>
        </template>
      </DragModule>
    </el-form>
  </DraggableResizeControl>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import DraggableResizeControl from '../index.vue'
import DragModule from '../DragModule.vue'
import DragElement from '../DragElement.vue'
import { EL_ENUM } from '../type/elementEnum'
import type { ModuleIF } from '../type/index'

const GROUPNAME = { MAIN: 'mainGroup' }

const formData = reactive({
  name: '',
  age: 0,
  email: ''
})

const formRules = ref({})
const formRef = ref(null)

const dragConfig = reactive({
  activeGroupName: GROUPNAME.MAIN,
  groupInfo: {},
  isEditing: false,
  currentGroupInfo: {}
})

// 模块配置
const moduleConfig: ModuleIF = {
  groupName: GROUPNAME.MAIN,
  moduleId: 'basicInfo',
  title: '基本信息',
  span: 24,
  elementLists: [
    {
      elementId: 'name',
      span: 8,
      prop: 'name',
      label: '姓名',
      uiType: EL_ENUM.INPUT,
      required: true,
      fieldLength: 50
    },
    {
      elementId: 'age',
      span: 8,
      prop: 'age',
      label: '年龄',
      uiType: EL_ENUM.NUMBER_INPUT,
      min: 0,
      max: 150
    },
    {
      elementId: 'email',
      span: 8,
      prop: 'email',
      label: '邮箱',
      uiType: EL_ENUM.INPUT
    }
  ]
}

dragConfig.groupInfo[GROUPNAME.MAIN] = {
  groupName: GROUPNAME.MAIN,
  moduleList: [moduleConfig]
}
</script>
```

### 示例 2：多分组切换

```vue
<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form ref="formRef" :model="formData" :rules="formRules">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane label="主单" :name="GROUPNAME.MAIN" />
        <el-tab-pane label="分单" :name="GROUPNAME.SECOND" />
      </el-tabs>
      
      <!-- 主单分组 -->
      <div v-show="activeTab === GROUPNAME.MAIN">
        <DragModule :groupName="GROUPNAME.MAIN" :config="dragConfig">
          <template #mainModule="{ element: moduleEl }">
            <DragElement
              :groupName="GROUPNAME.MAIN"
              moduleId="mainModule"
              :config="dragConfig"
              :formRef="formRef"
              :formValue="formData"
              :formRules="formRules"
            />
          </template>
        </DragModule>
      </div>
      
      <!-- 分单分组 -->
      <DragModule v-show="activeTab === GROUPNAME.SECOND" :groupName="GROUPNAME.SECOND" :config="dragConfig">
        <template #secondModule="{ element: moduleEl }">
          <DragElement
            :groupName="GROUPNAME.SECOND"
            moduleId="secondModule"
            :config="dragConfig"
            :formRef="formRef"
            :formValue="formData"
            :formRules="formRules"
          />
        </template>
      </DragModule>
    </el-form>
  </DraggableResizeControl>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'

const GROUPNAME = {
  MAIN: 'mainGroup',
  SECOND: 'secondGroup'
}

const activeTab = ref(GROUPNAME.MAIN)

const dragConfig = reactive({
  activeGroupName: GROUPNAME.MAIN,
  groupInfo: {},
  isEditing: false,
  currentGroupInfo: {}
})

// 监听 Tab 切换，同步更新 activeGroupName
watch(activeTab, (val) => {
  dragConfig.activeGroupName = val
})

function handleTabChange(tab: any) {
  dragConfig.activeGroupName = tab.name
}
</script>
```

### 示例 3：嵌套拖拽

```typescript
const nestedModule: ModuleIF = {
  groupName: GROUPNAME.MAIN,
  moduleId: 'nestedModule',
  title: '嵌套模块',
  span: 24,
  elementLists: [
    {
      elementId: 'simpleField',
      span: 6,
      prop: 'simpleField',
      label: '简单字段',
      uiType: EL_ENUM.INPUT
    },
    {
      elementId: 'nestedContainer',
      span: 18,
      label: '嵌套容器',
      requiredable: false,
      deletable: false,
      elementLists: [  // 第二层嵌套
        {
          elementId: 'nestedField1',
          span: 8,
          prop: 'nested.field1',
          label: '嵌套字段1',
          uiType: EL_ENUM.INPUT
        },
        {
          elementId: 'nestedField2',
          span: 8,
          prop: 'nested.field2',
          label: '嵌套字段2',
          uiType: EL_ENUM.INPUT
        },
        {
          elementId: 'nestedField3',
          span: 8,
          prop: 'nested.field3',
          label: '嵌套字段3',
          uiType: EL_ENUM.INPUT
        }
      ]
    }
  ]
}
```

## 🔧 高级功能

### 1. 表单验证

组件集成了 Element Plus 的表单验证功能。可以通过 `setFormRules` 方法动态设置验证规则：

```typescript
import { setFormRules } from '@/methods/rules/setFormRules'

onMounted(async () => {
  await nextTick(() => {
    setFormRules(formRef.value, formRules, formData)
  })
})
```

### 2. 模板管理

组件支持模板的保存、切换、删除等功能。需要配置 `useTemplate` 工具类：

```typescript
import useTemplate from './utils/useTemplate'

const templateUtils = new useTemplate(config, url)
```

### 3. 元素增加

编辑模式下，点击"元素增加"按钮，打开抽屉，可以选择隐藏的元素添加到表单中。

### 4. 宽度调整

编辑模式下，可以拖拽元素右侧的调整手柄来调整元素宽度。

### 5. 必填配置

编辑模式下，鼠标悬停在元素上，会出现设置图标，可以配置元素是否必填。

## ⚠️ 注意事项

1. **分组名称**：相同 `groupName` 的元素可以互相拖拽，不同 `groupName` 的元素不能互相拖拽。

2. **插槽限制**：`uiType` 为 `EL_ENUM.SLOT` 的元素不支持跨模块拖拽，只能在当前模块内移动。

3. **嵌套层级**：最多支持两级嵌套，超过两级将不会渲染。

4. **模块可见性**：`visible: false` 的模块不会在 `DragModule` 中显示为可拖拽卡片，但仍可以通过 `DragElement` 直接使用。

5. **表单数据**：支持嵌套对象结构，如 `user.name`，组件会自动处理嵌套对象的访问。

6. **编辑模式**：编辑模式下，表单会被禁用（`dragConfig.isEditing` 控制）。

7. **模板保存**：模板保存功能需要后端接口支持，详见 `useTemplate.ts`。

## 🐛 常见问题

### Q: 如何实现多分组切换？

A: 使用 `el-tabs` 组件配合 `v-show` 指令，监听 Tab 切换事件，同步更新 `dragConfig.activeGroupName`。

### Q: 如何自定义元素样式？

A: 在元素配置中添加 `class`、`style`、`formItemClass`、`formItemStyle` 属性。

### Q: 如何实现动态添加元素？

A: 编辑模式下点击"元素增加"按钮，在抽屉中选择要添加的元素，点击保存即可。

### Q: 如何配置元素必填？

A: 编辑模式下，鼠标悬停在元素上，点击设置图标，可以切换必填状态。

### Q: 如何实现自定义组件？

A: 有两种方式：
1. 直接引用组件：`component: CustomComponent`
2. 通过 componentName：在 `DragElement` 的 `components` prop 中传入组件映射

## 📄 类型定义

详细的类型定义请参考 `type/` 目录下的文件：

- `type/index.ts` - 主要类型定义
- `type/element.ts` - 元素配置类型
- `type/elementEnum.ts` - 元素枚举
- `type/customLabel.ts` - 自定义标签类型
- `type/SystemEnum.ts` - 系统枚举

## 📚 相关文档

- [Element Plus 表单文档](https://element-plus.org/zh-CN/component/form.html)
- [Vue Draggable 文档](https://github.com/SortableJS/vue.draggable.next)

## 📝 更新日志

### v1.0.0
- ✅ 初始版本
- ✅ 支持模块和元素拖拽
- ✅ 支持嵌套拖拽（最多两级）
- ✅ 支持多种表单控件
- ✅ 支持自定义标签
- ✅ 支持模板管理
- ✅ 支持表单验证

---

**作者**: hongzf  
**最后更新**: 2025-01-XX
