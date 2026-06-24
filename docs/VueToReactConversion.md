# 🛠️ Skill: CargoNova 前端规范化转换指南 (Vue to React)

本指南旨在指导 AI 助手和开发者将旧有的 Vue 页面高效、规范地转换为 CargoNova 的 React 标准架构。

---

## 1. 核心转换原则 (The Golden Rules)

### 🚫 审计红线 (Absolute Red Lines)
*   **SSOT 一致性**：前端 Interface 字段名必须 100% 对齐 SQL 驼峰化后的定义。
*   **主键安全**：所有主键 ID 必须声明为 `string`，严禁使用 `Number()` 或 `parseInt()`。
*   **零导包**：严禁手动 `import` 已 auto-import 的组件（如 `Button`, `Input`, `useState`, `TanstackTable` 等）。
*   **国际化零容忍**：所有文本必须包裹 `t('key', 'Default English')`。
*   **样式隔离**：禁止在公共组件上添加布局无关的 `className` (如 `p-4`)，必须使用语义类。

### 🏗️ 布局规范
*   **全量类名驱动**：必须直接在 HTML 标签上使用 `.page-layout`, `.page-section`, `.form-panel`, `.page-toolbar` 等 CSS 语义类。
*   **高度自适应 (⚠️ 强制)**：管理页必须使用 `flex flex-col h-screen` 并配合 `overflow-hidden`，确保查询区固定、表格区自适应滚动且不出现全局双滚动条。

---

## 2. 转换工作流 (Workflow)

### 2.1 单表管理页标准布局 (Standard Single-Table Layout)
对于标准的管理列表页（如国家管理、消息宏管理），必须遵循以下嵌套结构以实现最佳的响应式效果：

```tsx
<div className="page-layout">
  <main className="page-layout-container flex flex-col h-screen" style={{ minHeight: "calc(100vh - 64px)", height: "calc(100vh - 64px)" }}>
    {/* 1. 查询过滤区 (固定高度) */}
    <section className="page-section flex-shrink-0">
      <DynamicDragForm {...bind} />
    </section>

    {/* 2. 数据展示区 (自适应余下高度) */}
    <section className="page-section flex flex-col flex-1 min-h-0 mb-0 overflow-hidden">
      {/* 操作工具栏 */}
      <div className="page-toolbar justify-between flex-shrink-0 mb-2">
        <div className="page-toolbar">
          <Button ...>新增</Button>
          <Button ...>保存</Button>
        </div>
      </div>

      {/* 表格容器 (必须嵌套 wrapper 并设为 flex-1 min-h-0 以支撑内部 TanstackTable 滚动) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TanstackTable ... className="flex-1 min-h-0 h-full" />
      </div>
    </section>
  </main>
</div>
```

**布局核心要点：**
1.  **容器高度**：`main` 容器使用 `h-screen` 和 `calc(100vh - 64px)` (减去 Tab 高度) 锁定高度。
2.  **查询区固定**：`flex-shrink-0` 确保表单不会被压缩。
3.  **展示区自适应**：`flex-1` 让表格占据所有剩余空间。
4.  **滚动控制**：通过 `min-h-0` 和 `overflow-hidden` 强制让滚动发生在表格内部而非页面级别。
5.  **默认值继承**：在 `add{Entity}` 方法中，优先调用 `getFormValues()` 从查询表单中提取字段值作为新增行的默认初始值。

---

### 第一步：数据架构分析 (Architecture Analysis)
在编写代码前，必须识别页面的 **“数据生命周期”** 和 **“层级关系”**：
1.  **单表模式**：仅一个 `TanstackTable`。使用 `useTanstackInstance`。
2.  **主从联动模式**：上下结构。主表用 `useTanstackInstance`，从表强制使用 `useTanstackCascadeInstance`。
3.  **聚合编辑模式**：主表表单 + 多个子表页签。核心是 `Form` + `Tabs`，采用 **“聚合保存”**（一次性提交主实体 + 子实体数组）。

### 第二步：定义 API 层 (`src/api/{module}/{entity}.ts`)
1.  **Interface 定义**：
    *   主实体包含所有物理字段（驼峰命名）。
    *   包含 `rowStatus?: number` (2:未变, 4:新增, 8:删除, 16:修改)。
    *   强耦合从表必须在主实体的 API 文件中定义 Interface。
2.  **API 封装**：使用 `$common`, `$fms` 等全局实例，封装标准 CRUD 方法。

### 第三步：构建页面 (`src/pages/{module}/{Entity}Manage.tsx`)
1.  **状态初始化**：
    *   分页状态：`currentPage`, `pageSize`, `totalCount` (初始 `undefined`)。
    *   字典加载：页面顶层调用 `usePageDicts("CODE1,CODE2")`。
2.  **查询表单 (DynamicDragForm)**：
    *   使用 `useDynamicForm` Hook。
    *   联想控件使用 `uiType: 'associate'` 并配置 `slot`。
3.  **表格配置 (TanstackTable)**：
    *   必须配置全局唯一 `tableId`。
    *   列定义上方必须有单行注释（如 `{/* 字段名 */}`）。
    *   校验逻辑集中在 `editRules` 中。

---

## 3. 常用代码模式对照表

| 功能场景 | Vue (旧模式) | React (规范模式) |
| :--- | :--- | :--- |
| **页签跳转** | `router.push('/path?id=1')` | `addTab({ url: '/path?id=1', sysResourceId: '1' })` |
| **删除确认** | `ElMessageBox.confirm(...)` | `await message.confirm(t('msg.confirm', '...'), { type: 'danger' })` |
| **消息提示** | `ElMessage.success(...)` | `toast.success(t('msg.success', '...'))` |
| **数据字典** | `formatterDict('CODE', val)` | `<TanstackDictColumn code="CODE" ... />` |
| **按钮权限** | `v-per="'code'"` | `<Button customPer="Page:method" ... />` |
| **主子联动** | 手写 `row-click` 加载 | `useTanstackCascadeInstance` + `parentInstance` |

---

## 4. 转换检查清单 (Checklist)

- [ ] **命名**：文件名是否为 `{Entity}Manage.tsx`？`export const` 是否与之一致？
- [ ] **主键**：Interface 中的 ID 字段是否全部为 `string`？
- [ ] **Import**：是否删除了所有 auto-import 组件的冗余导入？
- [ ] **i18n**：所有的 `t()` 是否都带了第二个英文默认值？
- [ ] **tableId**：所有的 `TanstackTable` 是否都配置了唯一的 `tableId`？
- [ ] **注释**：所有的 `Button` 和 `TanstackColumn` 上方是否有单行注释？
- [ ] **分页**：是否实现了 `fetchTotalCount` 懒加载总条数逻辑？

---

### 💡 如何触发此 Skill？
在 Cursor 中向 AI 发送指令：
> “请参考 **@docs/skills/VueToReactConversion.md**，将指定的 Vue 文件转换为 React规范代码。优先进行数据架构分析，确保主键为 String，严格遵守零导包和布局语义化规范。”
