# 业务表单联动唯一性校验性能优化实践

## 背景描述
在复杂业务表单（如航班管理、订单录入）中，经常需要对某个字段执行“唯一性校验”。这种校验通常不仅仅取决于字段自身（如航班号），还依赖于其他背景字段（如承运人 ID、有效期等）。

在初始实现过程中，我们遇到了严重的性能瓶颈和数据一致性问题，主要体现在重复请求、旧值校验以及联动失效三个方面。

---

## 核心问题与优化过程

### 1. 数据闭包导致的“旧值校验”问题
**问题现象**：  
在 Zod 校验规则中定义的参数通过闭包捕获了父组件的 `state`。由于 `react-hook-form` 的触发时机往往早于父组件 `state` 的异步更新，导致发送给接口的校验参数依然是上一次的值。

**优化方案**：  
引入 `latestValuesRef` 机制。通过 `form.watch` 实时维护表单的最新状态引用。**在执行接口调用前，动态从该引用中提取最新值覆盖 `params` 中的旧值**。

- **效果**：确保了无论用户输入多快，发送给后端的参数永远是界面上绝对最新的内容。

### 2. 字段变动未触发联动校验
**问题现象**：  
当校验参数依赖于其他字段（如 `carrierId`）时，修改 `carrierId` 不会触发 `flightNo` 的重新校验，导致校验结果在逻辑上已失效。

**优化方案**：  
在 `Form` 组件内部实现“依赖分析”逻辑。
- **实现**：自动解析所有唯一性校验规则中的 `params`。
- **联动**：当被依赖字段发生 `change` 时，自动调用 `form.trigger(targetField)` 强制触发目标字段重查。

### 3. ⚠️ILP 组件联动导致的“高频重复请求”
**问题现象**：  
复杂的联想控件（如 `ILPMdCarrier`）在选中项后会同时更新 `id`、`code`、`name` 等多个字段。由于 `react-hook-form` 的机制，这会连续触发多次校验流程，导致同一个校验接口在 50ms 内被并发调用 3-4 次。

**优化方案**：  
实施了双层优化策略：

1.  **防抖处理 (Debounce)**：增加 200ms 的触发延迟，合并极短时间内的多次字段变更。
2.  **异步请求锁 (Promise Lock)**：在缓存中不仅存储 `result`（结果），还存储 `promise`（过程）。
    - 如果第二个请求发起时，发现相同参数的第一个请求仍在 `pending` 状态，则直接 `await` 第一个请求的 `promise`。
- **效果**：并发的网络请求被严格限制为 1 次，大幅减轻后端压力。

---

## 技术方案总结（核心代码逻辑）

```typescript
// 1. 请求去重与锁机制
const fieldCacheKey = `${field}_unique`;
if (cache && cache[fieldCacheKey]?.payload === payloadStr) {
  // 如果有正在进行的相同请求，直接等待它
  if (cache[fieldCacheKey].promise) {
    isUnique = await cache[fieldCacheKey].promise;
  } else {
    // 如果已有缓存结果，直接使用
    isUnique = cache[fieldCacheKey].result;
  }
} else {
  // 发起新请求并加锁
  const checkPromise = $common.post("validation/unique", payload);
  cache[fieldCacheKey] = { payload: payloadStr, result: true, promise: checkPromise };
  isUnique = await checkPromise;
  // 释放锁
  cache[fieldCacheKey].promise = undefined;
  cache[fieldCacheKey].result = isUnique;
}
```

## 最佳实践建议
1.  **必传 entityName**：唯一性校验必须明确指定所属实体，防止后端映射错误。
2.  **依赖解耦**：校验参数应由 `Form` 组件在运行时自动合并，而非在页面定义处硬编码绑定。
3.  **用户体验**：异步校验应配合 `Tooltip` 悬浮提示，避免在输入过程中直接弹窗打断操作流。

---
*记录时间：2026-02-06*
