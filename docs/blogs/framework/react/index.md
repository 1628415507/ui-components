# React
> https://zh-hans.react.dev/learn


## React.useEffect
React.useEffect相当于Vue的watch

 ```javascript
 React.useEffect(() => {
       if (!open) {
         setSearchKeyword("");
       } else {
         // 打开时，单选模式下如果当前有 label，则将其作为搜索关键字并触发查询
         // 多选模式下，不将已选值填入搜索框，直接查询全部（keyword为空）
         const initialKeyword = multiple ? "" : (label || "");
         setSearchKeyword(initialKeyword);
         setCurrentPage(1);
         fetchData(initialKeyword, 1);
       }
     }, [open, label, fetchData, multiple]);
 ```

## [createContext](https://zh-hans.react.dev/reference/react/createContext)
### 说明
- 相当于Vue的`provide('provideInfo', provideInfo)`、`inject('provideInfo', {})`
- 父级组件通过`createContext(defaultValue)`给子孙组件提供参数，
  - createContext 返回一个上下文对象。 该上下文对象本身不包含任何信息。一般来说，在组件上方使用 SomeContext 指定上下文的值，并在被包裹的下方组件内调用 useContext(SomeContext) 读取它
  - defaultValue是静态的，永远不会随时间改变。，
- 子孙组件通过`useContext(SomeContext)`给获取父级组件的参数
### 示例

```js
import { createContext } from 'react';

const ThemeContext = createContext('light')//类似于provide('light', '初始值')
// 父组件
function App() {
  const [theme, setTheme] = useState('light');
  return (
    // value：该值为想传递给所有处于这个 provider 内读取该参数的组件，无论它们处于多深的层级。参数的值可以为任何类型。provider 内的组件可通过调用 useContext(SomeContext) 获取上方距离它最近的上下文 provider 的 value。
    <ThemeContext value={theme}>
      <Page />
    </ThemeContext>
  );
}

// 子组件
// 当来自父组件的上下文发生变化时，React 会重新调用该函数。
function Button() {
  // ✅ 推荐方式
  const theme = useContext(ThemeContext);//类似于vue的inject：const provideInfo = inject('light', '')
  return <button className={theme} />;
}
```


## useReducer
### 说明
- useReducer 返回一个由两个值组成的数组：
  - 当前的 state。首次渲染时为你提供的初始值。
  - dispatch 函数。用于更新 state 并触发组件的重新渲染，
  - `dispatch(action)`：action为用户执行的操作。可以是任意类型的值，通常来说 action 是一个对象，其中 **type 属性标识类型**，其它属性携带额外信息。
- [useReducer 和 useState](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer) 非常相似，但是它可以让你把状态更新逻辑从事件处理函数中**移动到组件外部**，适合需要集中管理的情况 （有点类似vue的store）
- 通过 `dispatch({ type: 'incremented_age' })`中的type调用`reducer`中的对应逻辑
- useReducer 必须提前编写 reducer 函数和需要调度的 actions
### 示例
```ts
import { useReducer } from 'react';
// 修改useReducer的state的值
function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1 //修改state的值
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        //通过 `dispatch({ type: 'incremented_age' })`中的type调用reducer中的对应逻辑
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}

```
### 注意
dispatch 函数 是为下一次渲染而更新 state。因此**在调用 dispatch 函数后读取 state 并不会拿到更新后的值**，也就是说**只能获取到调用前的值**
## React.memo
### 说明
- `React.memo` 是一个高阶组件（HOC），用于性能优化。
- 相当于 Vue 的自动渲染优化机制。在 React 中，默认情况下父组件重渲染，所有子组件都会跟着重渲染。使用 `React.memo` 可以让子组件只有在 **props 发生变化**（浅比较）时才重新渲染。
- 它只进行**浅比较**。如果 props 是复杂对象、数组或函数，需确保引用一致性（通常配合 `useCallback` 或 `useMemo` 使用）。

### 示例
```js
import { memo, useState } from 'react';

// 子组件使用 memo 包裹
const ChildComponent = memo(function ChildComponent({ name }) {
  console.log("子组件渲染了");
  return <div>你好，{name}</div>;
});

// 父组件
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("张三");

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        点击增加次数：{count}
      </button>
      <button onClick={() => setName("李四")}>
        修改名字
      </button>
      {/* 
        当点击“增加次数”时，name 没变，
        因为 ChildComponent 被 memo 包裹，所以它不会重渲染。
      */}
      <ChildComponent name={name} />
    </>
  );
}
```

### 注意事项
- **引用一致性**：如果 `props` 包含函数，父组件每次渲染都会生成新的函数引用，导致 `memo` 失效。建议配合 `useCallback` 使用。
- **适用场景**：不要盲目给所有组件加 `memo`。缓存本身有开销。仅在组件渲染开销大或受父组件频繁重绘影响显著时使用。
