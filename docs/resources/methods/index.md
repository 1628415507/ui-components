## 表单基础校验设置

- element-plus 版本需大于`2.7.3`

### 方法调用

- setFormRules(表单实例, 表单校验对象, 表单数据对象)

```js
setFormRules(ruleFormRef.value, formRules, ruleForm)
```

### FormItem 扩展属性

| 属性名     | 说明                                |
| ---------- | ----------------------------------- |
| required   | 必填                                |
| min        | 最小长度                            |
| max        | 最大长度                            |
| rule-label | 当 label 为空时，校验显示的占位标签 |

### 使用示例

::: example
resources/methods/formRule
:::
