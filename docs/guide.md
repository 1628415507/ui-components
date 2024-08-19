<!--
 * @Description: 
 * @Date: 2024-07-26 15:49:43
 * @LastEditTime: 2024-07-26 15:50:23
-->
# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Syntax Highlighting

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

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
