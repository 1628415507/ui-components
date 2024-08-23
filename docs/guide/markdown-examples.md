<!--
 * @Description:
 * @Date: 2024-08-14 17:01:52
 * @LastEditTime: 2024-08-16 17:57:50
-->

# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## 高亮代码行

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题
- 无序列表  
----
1. 有序列表
1. 有序列表

分割线
***  
分割线
--- 

$$文字$$ 方程式 latex

**加粗字体**
_斜体_
`代码块`
> 引用

