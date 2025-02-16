## （一）[说说 vue 的生命周期？](https://segmentfault.com/a/1190000018331135)

总共分为 8 个阶段**创建前/后，载入前/后，更新前/后，销毁前/后**。

- 创建前/后：（数据 data 和 Method 的差别）

  - ① `beforeCreate`：  
     创建之前，**此时还没有 data 和 Method**，vue 实例的挂载元素 el 和数据对象 data 都是 undefined，还没有初始化。
  - ② `created`：
    - 创建完成，此时**data 和 Method 可以使用**了（请求数据 data），可以访问里面的数据和方法
    - 未挂载到 DOM，el 还没有，
      在 Created 之后 beforeMount 之前如果没有 el 选项的话那么此时生命周期结束，停止编译，如果有则继续

- 载入前/后：（虚拟 DOM 节点的差别）
  - ③ `beforeMount`：  
     在渲染之前，vue 实例的 el 和 data 都初始化了，但是挂载之前为**虚拟的 dom 节点**；
  - ④`mounted`：
    - vue 实例挂载到真实 DOM 上，**数据完成双向绑定，页面已经渲染完成**，并且`vm`实例中已经添加完`$el`了，已经替换掉那些 DOM 元素了（双括号中的变量），这个时候**可以操作 DOM**了 ，**可以使用$refs 属性对 Dom 进行操作**。
    - 但是是获取不了元素的高度等属性的，如果想要获取，需要使用`nextTick()`
    - mounted 不会保证所有的子组件也都一起被挂载。如果要等到整个视图都渲染完毕，等子组件完全挂载之后再执行操作。可以在 mounted 内部使用  [`vm.$nextTick`](https://cn.vuejs.org/v2/api/#vm-nextTick)
- 更新前/后：（新旧 DOM）

  - ⑤`beforeUpdate`：
    - **响应式数据更新时调用**，发生在虚拟 DOM 打补丁之前，
    - 适合**在更新之前访问现有的 DOM**，比如手动移除已添加的事件监听器
  - ⑥`updated`：
    - data 改变后，对应的组件重新渲染完成，
    - 避免在这个钩子函数中操作数据，防止死循环

- 销毁前/后：(监听事件)
  - ⑦`beforeDestroy`：
    - 实例销毁前调用，实例还可以用，**this 能获取到实例**，
    - 常用于**销毁定时器，解绑事件**
    - 更新的数据必须是被渲染在模板上的(el、template、render 之一)
    - **此时 view 层还未更新**
    - 若在 beforeUpdate 中再次修改数据，不会再次触发更新方法
  - ⑧ `destroyed`：实例销毁后调用，调用后**所有事件监听器会被移除**，所有的**子实例都会被销毁**
- 缓存
  - activated：keep-alive 缓存的组件激活时
  - deactivated:keep-alive 缓存的组件停用时调用
- errorCaptured: 捕获一个来自**子孙组件**的错误时被调用

## （二）简单描述每个周期具体适合哪些场景？

| 周期          | 场景                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------- |
| beforeCreate  | 可以在这加个`loading`事件，在加载实例时触发                                                       |
| created       | 初始化完成时的事件写在这里，如在这**结束 loading 事件**，**异步请求**(服务端渲染)也适宜在这里调用 |
| mounted       | 挂载元素，获取到 DOM 节点                                                                         |
| updated       | 如果**对数据统一处理**，在这里写上相应函数                                                        |
| beforeDestroy | 可以做一个**确认停止事件的确认框**                                                                |
| nextTick      | 更新数据后立即操作 dom;                                                                           |

## （三）vue 中父子组件的生命周期 ⭐⭐⭐⭐⭐

父子组件的生命周期是一个嵌套的过程  
**组件的调用顺序都是先父后子，渲染完成的顺序是先子后父。**  
**组件的销毁操作是先父后子，销毁完成的顺序是先子后父。**

- 生命周期（父子组件）：父组件更新前，子组件先销毁 ⭐
  - 父组件 beforeCreate --> 父组件 created --> 父组件 beforeMount -->
  - **子组件 beforeCreate --> 子组件 created** -->
  - **子组件 beforeMount --> 子组件 mounted** -->
  - 父组件 mounted -->
  - 父组件 beforeUpdate ⭐ -->
  - **子组件 beforeDestroy--> 子组件 destroyed** ⭐ -->
  - 组件 updated ⭐

---

- 渲染的过程（子组件先 mounted，父组件再 mounted）
  - 父 beforeCreate->父 created->父 beforeMount->
  - **子 beforeCreate->子 created->子 beforeMount->子 mounted->**
  - 父 mounted

---

- 挂载阶段
  - 父 created->子 created->子 mounted->父 mounted

---

- 子组件更新过程（子组件先 updated，父组件再 updated）
  - 父 beforeUpdate->
  - **子 beforeUpdate->子 updated->**
  - 父 updated
- 父组件更新过程  
  父 beforeUpdate->父 updated

---

- 销毁过程 （子组件先 destroyed，父组件再 destroyed）
  - 父 beforeDestroy->
  - **子 beforeDestroy->子 destroyed->**
  - 父 destroyed
