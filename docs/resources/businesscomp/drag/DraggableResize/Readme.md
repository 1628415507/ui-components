# DraggableResize 拖拽表单组件

## 概述

`DraggableResize` 是一个功能强大的 Vue 3 拖拽表单组件，支持动态配置表单布局、元素拖拽排序、嵌套拖拽、模板保存等功能。组件采用配置驱动的方式，通过 JSON 配置即可快速构建复杂的动态表单。

## 核心特性

- ✅ **拖拽排序**：支持模块和元素的拖拽排序
- ✅ **嵌套拖拽**：支持最多两级嵌套拖拽
- ✅ **动态配置**：通过配置对象动态生成表单
- ✅ **多种控件**：支持输入框、下拉、日期、复选框等多种表单控件
- ✅ **自定义标签**：支持自定义标签，包含文本、链接、复选框、按钮等
- ✅ **插槽支持**：支持自定义插槽内容
- ✅ **模板管理**：支持模板保存、切换、删除等功能
- ✅ **表单验证**：集成 Element Plus 表单验证
- ✅ **响应式布局**：基于 Element Plus 栅格系统

## 组件结构

```
DraggableResize/
├── index.vue              # 主控制组件
├── DragModule.vue         # 模块拖拽组件
├── DragElement.vue        # 元素拖拽组件
├── Element.vue            # 元素渲染组件
├── FormItem.vue           # 表单项组件
├── ElementSetting.vue     # 元素设置组件
├── AddDrawer.vue          # 元素添加抽屉
├── AddDrawerDrag.vue      # 元素添加拖拽组件
└── type/                  # 类型定义
    ├── index.ts
    ├── element.ts
    ├── elementEnum.ts
    ├── customLabel.ts
    └── SystemEnum.ts
```

## 快速开始

### 基础使用

```vue
<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form ref="formRef" :model="formData" :rules="formRules">
      <DragModule groupName="mainOrderTab" :config="dragConfig">
        <template #moduleId="{ element: moduleEl }">
          <DragElement
            groupName="mainOrderTab"
            moduleId="moduleId"
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
import { reactive, ref } from 'vue'
import DraggableResizeControl from '@/components/DraggableResize/index.vue'
import DragModule from '@/components/DraggableResize/DragModule.vue'
import DragElement from '@/components/DraggableResize/DragElement.vue'

// 表单数据
const formData = reactive({
  name: '',
  age: 0
})

// 表单验证规则
const formRules = ref({})
const formRef = ref(null)

// 拖拽配置
const dragConfig = reactive({
  activeGroupName: 'mainOrderTab',
  groupInfo: {
    mainOrderTab: {
      groupName: 'mainOrderTab',
      moduleList: [
        {
          groupName: 'mainOrderTab',
          moduleId: 'moduleId',
          title: '基本信息',
          span: 24,
          visible: true,
          elementLists: [
            {
              elementId: 'name',
              span: 12,
              prop: 'name',
              label: '姓名',
              uiType: 'input'
            }
          ]
        }
      ]
    }
  },
  currentGroupInfo: {}
})
</script>
```

## 核心组件

### DraggableResizeControl (index.vue)

主控制组件，提供编辑模式切换、模板管理等功能。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| config | 拖拽配置对象 | `DragConfigPrivate` | 必填 |

#### 配置对象 (DragConfigPrivate)

```typescript
interface DragConfigPrivate {
  activeGroupName: string              // 当前活动分组名称
  groupInfo: Record<string, GroupIF>   // 分组信息
  currentGroupInfo: Record<string, GroupIF> // 当前分组信息
  isEditing?: ComputedRef<boolean>      // 是否处于编辑模式
}
```

#### 功能

- **编辑模式切换**：点击锁图标切换编辑模式
- **模块拖拽**：开启后可以拖拽模块顺序
- **元素增加**：打开元素添加抽屉
- **模板管理**：保存、切换、删除模板

### DragModule

模块拖拽组件，用于渲染和管理可拖拽的模块列表。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| groupName | 分组名称 | `string` | 必填 |
| config | 拖拽配置对象 | `DragConfigPrivate` | 必填 |
| gap | 模块间距 | `number` | 10 |

#### 插槽

- `#[moduleId]`：模块内容插槽，`moduleId` 对应配置中的 `moduleId`

```vue
<DragModule groupName="mainOrderTab" :config="dragConfig">
  <template #moduleId="{ element: moduleEl }">
    <div>{{ moduleEl.title }}</div>
  </template>
</DragModule>
```

### DragElement

元素拖拽组件，用于渲染和管理表单元素。

#### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| groupName | 分组名称 | `string` | 必填 |
| moduleId | 模块ID | `string` | 必填 |
| config | 拖拽配置对象 | `DragConfigPrivate` | 必填 |
| formRef | 表单引用 | `FormInstance` | - |
| formValue | 表单数据 | `Record<string, any>` | 必填 |
| formRules | 表单验证规则 | `Ref<FormRules>` | - |
| componentParams | 组件参数 | `Record<string, any>` | - |
| components | 自定义组件映射 | `Record<string, Component>` | - |
| level | 嵌套层级 | `number` | 0 |
| collapsible | 是否可折叠 | `boolean` | false |
| collapseHeight | 折叠高度 | `string` | '200px' |

#### 插槽

- `#[elementId]`：元素内容插槽，用于自定义元素渲染

```vue
<DragElement
  groupName="mainOrderTab"
  moduleId="basicInfo"
  :config="dragConfig"
  :formRef="formRef"
  :formValue="formData"
>
  <template #customElement="{ element }">
    <div>自定义内容</div>
  </template>
</DragElement>
```

## 配置说明

### ModuleIF 模块配置

```typescript
interface ModuleIF {
  groupName: string        // 拖拽分组名称，相同 groupName 可以互相拖拽
  moduleId: string         // 模块唯一标识，对应 DragElement 的 moduleId
  title: string           // 模块标题
  span: number            // 栅格占位（1-24）
  elementLists: ElementConfig[] // 元素列表
  visible?: boolean       // 是否可见，false 时不在 DragModule 中显示
  class?: string          // 自定义样式类名
}
```

### ElementConfig 元素配置

元素配置是一个联合类型，根据 `uiType` 的不同，支持的属性也不同。

#### 基础属性 (BaseElementConfig)

所有元素共有的属性：

```typescript
{
  elementId: string           // 元素唯一标识
  span: number                // 栅格占位（1-24）
  label: string               // 标签文本
  isVisible?: boolean         // 是否可见
  showLabel?: boolean         // 是否显示标签
  deletable?: boolean         // 是否允许删除
  customLabel?: CustomLabel   // 自定义标签
  class?: string             // 自定义样式类
  style?: string             // 自定义样式
  formItemClass?: string     // 自定义 formItem 样式类
}
```

#### 控件类型 (EL_ENUM)

```typescript
enum EL_ENUM {
  INPUT = 'input',                    // 输入框
  TEXTAREA = 'textarea',              // 文本域
  NUMBER_INPUT = 'number',             // 数字输入框
  DIVIDER_INPUT = 'dividerInput',     // 35字符分割线输入框
  SELECT = 'select',                  // 普通下拉
  DICT_SELECT = 'dictionary',         // 字典下拉
  DATE = 'date',                      // 日期
  DATETIME = 'datetime',              // 日期时间
  DATETIMERANGE = 'datetimerange',   // 日期时间范围
  MONTH = 'month',                    // 月份
  CHECKBOX = 'checkbox',              // 复选框
  CHECKBOX_GROUP = 'checkbox_group',  // 复选框组
  ASSOCIATE = 'associate',            // 联想控件
  AUTOCOMPLETE = 'autocomplete',      // 自动完成
  SLOT = 'slot',                      // 自定义插槽
  COMPONENT = 'component',            // 自定义组件
  CUSTOM = 'custom'                   // 自定义插槽（同 SLOT）
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

#### 自定义组件 (COMPONENT)

```typescript
{
  uiType: EL_ENUM.COMPONENT,
  componentName?: string,   // 组件名称（从 components 映射中获取）
  component?: Component,    // 直接引用组件
  getRef?: Function         // 获取组件引用的回调
}
```

#### 插槽 (SLOT)

```typescript
{
  uiType: EL_ENUM.SLOT,
  elementId: string        // 插槽名称，对应模板中的 #elementId
}
```

#### 嵌套元素 (ElementLists)

支持嵌套拖拽的元素：

```typescript
{
  elementId: string,
  span: number,
  label: string,
  groupName: string,        // 分组名称
  elementLists: ElementConfig[], // 子元素列表
  requiredable?: boolean,   // 是否允许配置必填
  deletable?: boolean       // 是否允许删除
}
```

### CustomLabel 自定义标签

支持在表单项标签位置自定义内容：

```typescript
interface CustomLabel {
  items: CustomLabelItem[]
}

type CustomLabelItem = 
  | { type: 'text', text: string }                    // 文本
  | { type: 'link', text: string, click?: () => void } // 链接
  | { type: 'button', text: string, buttonType?: string } // 按钮
  | { type: 'checkbox', prop: string, change?: (val: any) => void } // 复选框
  | { type: 'svgIcon', iconName: string }             // SVG图标
```

示例：

```typescript
{
  elementId: 'mawbNo',
  prop: 'mawbNo',
  label: '单号',
  uiType: EL_ENUM.INPUT,
  customLabel: {
    items: [
      { type: 'text', text: '单号' },
      { 
        type: 'checkbox', 
        prop: 'isUseMawbList',
        style: 'margin-left:auto;'
      },
      {
        type: 'link',
        text: '文字链接',
        click: () => openDialog()
      }
    ]
  }
}
```

## 完整示例

### 配置示例

```typescript
// moduleListConfig.ts
import { EL_ENUM } from '../type/elementEnum'
import type { ModuleIF } from '../type/index'

export function getModuleList(params: any): ModuleIF[] {
  const { orderData, readOnlyPage, dicts, openMawbDialog, selectCarrier } = params
  
  // 基本信息模块
  const basicInfo: ModuleIF = {
    groupName: 'mainOrderTab',
    moduleId: 'basicInfoCard',
    visible: true,
    title: '基本信息',
    span: 24,
    elementLists: [
      // 输入框示例
      {
        elementId: 'name',
        span: 6,
        prop: 'orderData.name',
        label: '姓名',
        uiType: EL_ENUM.INPUT,
        required: true,
        fieldLength: 50
      },
      // 日期选择器示例
      {
        elementId: 'date',
        span: 6,
        prop: 'orderData.date',
        label: '日期',
        uiType: EL_ENUM.DATE,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD'
      },
      // 字典下拉示例
      {
        elementId: 'status',
        span: 6,
        prop: 'orderData.status',
        label: '状态',
        uiType: EL_ENUM.DICT_SELECT,
        dictName: 'ORDER_STATUS',
        dictOption: dicts?.ORDER_STATUS || []
      },
      // 自定义标签示例
      {
        elementId: 'mawbNo',
        span: 6,
        prop: 'orderData.mawbNo',
        label: '单号',
        uiType: EL_ENUM.INPUT,
        customLabel: {
          items: [
            { type: 'text', text: '单号' },
            {
              type: 'link',
              text: '选择',
              click: openMawbDialog
            }
          ]
        }
      }
    ]
  }
  
  // 货物信息模块（支持嵌套）
  const cargoInfo: ModuleIF = {
    groupName: 'mainOrderTab',
    moduleId: 'cargoInfoId',
    title: '货物信息',
    span: 24,
    elementLists: [
      // 嵌套拖拽区域
      {
        elementId: 'cargoInfo_left',
        span: 16,
        label: '货物信息-左侧',
        groupName: 'mainOrderTab',
        requiredable: false,
        deletable: false,
        elementLists: [
          {
            elementId: 'goodsName',
            span: 12,
            prop: 'orderData.goodsName',
            label: '货物名称',
            uiType: EL_ENUM.INPUT
          },
          {
            elementId: 'weight',
            span: 6,
            prop: 'orderData.weight',
            label: '重量',
            uiType: EL_ENUM.NUMBER_INPUT,
            precision: 2
          }
        ]
      },
      // 插槽区域
      {
        elementId: 'cargoInfo_right',
        span: 8,
        prop: '',
        label: '货物信息-右侧',
        uiType: EL_ENUM.SLOT,
        requiredable: false,
        deletable: false
      }
    ]
  }
  
  return [basicInfo, cargoInfo]
}
```

### 使用示例

```vue
<template>
  <DraggableResizeControl :config="dragConfig">
    <el-form
      ref="mainOrderTabRef"
      :model="orderData"
      :rules="orderDataRules"
      :disabled="dragConfig.isEditing"
    >
      <!-- 基本信息模块 -->
      <z-info-card header="基本信息" class="mt-10">
        <DragElement
          groupName="mainOrderTab"
          moduleId="basicInfoCard"
          :config="dragConfig"
          :formRef="mainOrderTabRef"
          :formValue="orderData"
          :formRules="orderDataRules"
          :componentParams="componentParams"
        />
      </z-info-card>
      
      <!-- 模块拖拽区域 -->
      <DragModule groupName="mainOrderTab" :config="dragConfig">
        <!-- 货物信息模块 -->
        <template #cargoInfoId="{ element: moduleEl }">
          <z-info-card :header="moduleEl.title" class="mt-10">
            <DragElement
              groupName="mainOrderTab"
              moduleId="cargoInfoId"
              :config="dragConfig"
              :formRef="mainOrderTabRef"
              :formValue="orderData"
              :formRules="orderDataRules"
            >
              <!-- 自定义插槽内容 -->
              <template #cargoInfo_right="{ element }">
                <div>自定义右侧内容</div>
              </template>
            </DragElement>
          </z-info-card>
        </template>
      </DragModule>
    </el-form>
  </DraggableResizeControl>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import DraggableResizeControl from '@/components/DraggableResize/index.vue'
import DragModule from '@/components/DraggableResize/DragModule.vue'
import DragElement from '@/components/DraggableResize/DragElement.vue'
import { getModuleList } from './moduleListConfig.ts'
import { setFormRules } from '@/methods/rules/setFormRules'

// 表单数据
const orderData = reactive({
  name: '',
  date: '',
  status: '',
  mawbNo: '',
  goodsName: '',
  weight: 0
})

// 表单验证规则
const orderDataRules = ref({})
const mainOrderTabRef = ref(null)

// 组件参数
const componentParams = reactive({
  orderData,
  readOnlyPage: false,
  dicts: {
    ORDER_STATUS: [
      { dictCode: '1', dictTableName: '待处理' },
      { dictCode: '2', dictTableName: '处理中' }
    ]
  },
  openMawbDialog: () => {
    console.log('打开主单号选择弹窗')
  },
  selectCarrier: (val) => {
    console.log('航司选择回调', val)
  }
})

// 拖拽配置
const dragConfig = reactive({
  activeGroupName: 'mainOrderTab',
  groupInfo: {},
  currentGroupInfo: {}
})

// 主单Tab配置
const mainOrderTabConfig = reactive({
  groupName: 'mainOrderTab',
  moduleList: computed(() => getModuleList(componentParams))
})

dragConfig.groupInfo.mainOrderTab = mainOrderTabConfig

onMounted(async () => {
  // 初始化表单验证规则
  await nextTick(() => {
    setFormRules(mainOrderTabRef.value, orderDataRules, orderData)
  })
})
</script>
```

## 表单验证

组件集成了 `setFormRules` 方法，可以自动根据元素配置生成表单验证规则。

### 使用 setFormRules

```typescript
import { setFormRules } from '@/methods/rules/setFormRules'

onMounted(async () => {
  await nextTick(() => {
    setFormRules(formRef.value, formRules, formData)
  })
})
```

### 验证规则配置

验证规则会根据元素的以下属性自动生成：

- `required`：必填验证
- `max`：最大长度验证（通过 DOM 属性 `max` 设置）
- `min`：最小长度验证（通过 DOM 属性 `min` 设置）

### 自定义验证规则

可以通过 `formRules` 手动添加自定义验证规则：

```typescript
const formRules = ref({
  'orderData.name': [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
})
```

## 编辑模式

组件支持编辑模式，在编辑模式下可以：

1. **拖拽模块**：点击"版块拖动"按钮，可以拖拽模块顺序
2. **拖拽元素**：在编辑模式下，可以拖拽元素顺序
3. **添加元素**：点击"元素增加"按钮，打开元素添加抽屉
4. **删除元素**：在编辑模式下，可以删除非必填元素
5. **调整宽度**：拖拽元素右侧的调整手柄可以调整元素宽度

### 切换编辑模式

点击右下角的锁图标可以切换编辑模式。

## 模板管理

组件支持模板的保存、切换、删除等功能。

### 保存模板

在编辑模式下，点击"保存模板"可以保存当前配置。

### 切换模板

点击"模板选择"可以切换不同的模板。

### 删除模板

在模板选择对话框中可以删除不需要的模板。

## 注意事项

1. **嵌套层级限制**：组件最多支持两级嵌套拖拽
2. **插槽限制**：插槽类型（`SLOT`）不支持跨模块拖拽
3. **groupName 相同**：只有 `groupName` 相同的元素才能互相拖拽
4. **表单引用**：使用表单验证时，需要正确传递 `formRef`
5. **响应式数据**：`formValue` 必须是响应式对象（使用 `reactive` 创建）
6. **配置更新**：修改 `groupInfo` 后，组件会自动更新

## API 参考

### 类型定义

详细的类型定义请参考 `type/` 目录下的文件：

- `type/index.ts`：主要类型定义
- `type/element.ts`：元素配置类型
- `type/elementEnum.ts`：枚举定义
- `type/customLabel.ts`：自定义标签类型
- `type/SystemEnum.ts`：系统枚举

### 工具函数

#### isEqual

比较两个对象是否相等（忽略某些属性）：

```typescript
import { isEqual } from '@/methods/tools'

const isChanged = !isEqual(newVal, oldVal, {
  ingoreProps: ['id', 'createTime'],
  includesProps: ['name', 'age'],
  propsDefaultValue: { status: 'active' }
})
```

#### removeCommonProperties

移除对象中的通用属性：

```typescript
import { removeCommonProperties } from '@/methods/tools'

const cleaned = removeCommonProperties(obj, {
  ingoreProps: ['id', 'createTime'],
  includesProps: ['name', 'age']
})
```

## 常见问题

### Q: 如何自定义元素渲染？

A: 使用插槽（`SLOT`）类型，在 `DragElement` 中通过 `#[elementId]` 插槽自定义内容。

### Q: 如何添加自定义组件？

A: 使用 `COMPONENT` 类型，通过 `component` 属性直接引用组件，或通过 `componentName` 从 `components` 映射中获取。

### Q: 如何实现联动？

A: 在元素的 `change` 回调中处理联动逻辑，修改 `formValue` 中的其他字段。

### Q: 如何控制元素的显示隐藏？

A: 设置元素的 `isVisible` 属性为 `false`，或设置模块的 `visible` 为 `false`。

### Q: 如何实现表单验证？

A: 使用 `setFormRules` 方法自动生成验证规则，或手动配置 `formRules`。

## 更新日志

- **v1.0.0**：初始版本
  - 支持基础拖拽功能
  - 支持多种表单控件
  - 支持嵌套拖拽
  - 支持模板管理

## 许可证

MIT License

