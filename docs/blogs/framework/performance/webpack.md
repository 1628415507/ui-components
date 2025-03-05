# Webpack 有哪些优化项⽬的⼿段？

## 性能优化方式汇总

围绕 webpack 做性能优化，分为两个⽅⾯： **构建时间优化 、 构建体积优化**

- 构建时间优化
  - 缩⼩范围（`include` 、 `exclude`）
  - ⽂件后缀（`resolve.extensions`）
  - 定向查找第三⽅模块（`resolve.modules`）
  - 别名（`resolve.alias`）
  - 缓存（`cache-loader` `babel-loader`）
  - 并⾏构建（`thread-loader`）
- 构建结果优化
  - 压缩 js（`terser-webpack-plugin`）
  - 压缩 css（`css-minimizer-webpack-plugin`、`mini-css-extract-plugin`）
  - 压缩 html（`html-webpack-plugin`）
  - 压缩图⽚（ `image-webpack-loader` ）
  - 按需加载（`import()`）
  - preload、prefetch
  - 代码分割（`splitChunks`）
  - tree shaking（`purgecss-webpack-plugin`）
  - gzip（`compression-webpack-plugin`）
  - 作⽤域提升（`production`、`ModuleConcatenationPlugin`）

## 构建时间优化(如何提高 webpack 的构建速度?)

### 1. 缩⼩范围（`include` 、 `exclude`）

- 我们在使⽤ loader 时，可以配置 `include` 、 `exclude` 缩⼩ loader 对⽂件的搜索范围，以此来**提⾼构建速率**。
- 像 `/node_moudles `⽬录下的体积那么⼤，⼜是第三⽅包的存储⽬录，直接 `exclude` 掉可以节省⼀定的时间的。
- 当然 exclude 和 include 可以⼀起配置，⼤部分情况下都是只需要使⽤ loader 编译 src ⽬录下的代码
- 还需注意⼀个点就是要确保 loader 的 **准确性** ，⽐如不要使⽤ less-loader 去解析 css ⽂件

```js{3,8,10}
module.exports = {
  module: {
    rules: [
      {
        use: ['thread-loader', 'babel-loader'],
        test: /\.(|ts|tsx|js|jsx)$/, // 只解析 src ⽂件夹下的 ts、tsx、js、jsx ⽂件
        // include 可以是数组，表⽰多个⽂件夹下的模块都要解析
        include: path.resolve(__dirname, '../src'),
        //当然也可以配置 exclude，表⽰ loader 解析时不会编译这部分⽂件//同样 exclude 也可以是数组
        exclude: /node_modules/
      }
    ]
  }
}

```

### 2. ⽂件后缀（`resolve.extensions`）

- `resolve.extensions` 是我们常⽤的⼀个配置，他可以**在导⼊语句没有带⽂件后缀时，可以按照配置的列表，⾃动补上后缀**。
- 我们应该根据我们项⽬中⽂件的实际使⽤情况设置后缀列表，**将使⽤频率⾼的放在前⾯**，**同时后缀列表也要尽可能的少**，减少没有必要的匹配。
- 同时，我们在源码中写导⼊语句的时候，尽量带上后缀，避免查找匹配浪费时间。

```js{2,4}
module.export = {
  resolve: {
    // 按照 tsx、ts、jsx、js 的顺序匹配，若没匹配到则报错
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  }
}
```

### 3. 定向查找第三⽅模块（`resolve.modules`）

- `resolve.modules` 配置⽤于**指定 webpack 去哪些⽬录下寻找第三⽅模块**。默认值是['node_modules'] 。
- ⽽在引⼊模块的时候，会以 `node 核⼼模块 -----> node_modules------> node全局模块` 的顺序查找模块。
- 我们通过配置 resolve.modules 指定 webpack 搜索第三⽅模块的范围，提⾼构建速率

```js{2,4}
module.exports = {
  resolve: {
    // __dirname
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```

### 4. 别名（`resolve.alias`）

通过配置 `resolve.alias` 给一些常用的路径起一个别名，减少引⽤⽂件的路径复杂度,减少查找过程

```js{2,3,6}
module.exports = {
  resolve: {
    alias: {
      //把 src ⽂件夹别名为 @
      //引⼊ src 下的⽂件就可以 import xxx from '@/xxx'
      '@': path.join(__dirname, '../src')
    }
  }
}
```

### 5. 缓存`cache-loader` `babel-loader`

- 在优化的⽅案中，缓存也是其中重要的⼀环。在构建过程中，开启缓存提升⼆次打包速度。
- 在项⽬中，js ⽂件是占⼤头的，当项⽬越来越⼤时，如果每次都需要去编译 JS 代码，那么构建的速度肯定会很慢的，所以我们可以配置 `babel-loader` 的缓存配置项 `cacheDirectory` 来缓存没有变过的 js 代码

```js{8,10}
module.exports = {
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  }
}
```

- 上⾯的缓存优化只是针对像 babel-loader 这样可以配置缓存的 loader，**没有缓存配置的 loader**可以使⽤缓存 `cache-loader`
- 在一些性能**开销较大的 loader 之前**添加`cache-loader`，以将结果缓存到磁盘里，显著提升二次构建速度
- 保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader

```js{6}
module.exports = {
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: ['cache-loader', 'babel-loader', ...loaders]
      }
    ]
  }
}
```

编译后同样多⼀个 `/node_modules/.cache/cache-loader` 缓存⽬录

- 当然还有⼀种⽅式， webpack5 直接提供了 `cache` 配置项，开启后即可缓存

```js{3}
module.exports = {
  cache: {
    type: 'filesystem'
  }
}

```

编译后会多出 `/node_modules/.cache/webpack` 缓存⽬录

### 6. 并⾏构建（`thread-loader`）

⾸先，运⾏在 Node ⾥的 webpack 是**单线程**的，所以⼀次性只能⼲⼀件事，那如果利⽤电脑的多核优势，也能提⾼构建速度 。`thread-loader`可以开启多进程打包

```js{8,10,14}
module.exports = {
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包。
            options: {
              workers: 3 // 开启3个进程
            }
          },
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
```

- 放置在这个 `thread-loader 之后的 loader` 就会在⼀个单独的 `worker` 池(worker pool) 中运⾏。
- 每个 worker 都是⼀个单独的有 600ms 限制的 node.js 进程。同时跨进程的数据交换也会被限制。
- 所以建议仅在耗时的 loader 上使⽤。**若项⽬⽂件不算多就不要使⽤**，毕竟开启多个线程也会存在性能开销。

## 构建结果优化(优化前端性能?)

关于 webpack 对前端性能的优化，可以通过**文件体积大小**入手，其次还可通过**分包的形式、减少 http 请求次数**等方式，实现对前端性能的优化

### 7. 压缩 js（`terser-webpack-plugin`）

- `webpack5`的话通过 `terser-webpack-plugin` 来压缩 JS，**但在配置了 `mode: production`时，会默认开启**

```js{1,6}
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  optimization: {
    // 开启压缩
    minimize: true, // 压缩⼯具
    minimizer: [new TerserPlugin({})]
  }
}

```

- 需要注意⼀个地⽅：**⽣产环境**会默认配置 `terser-webpack-plugin` ，所以如果你还有其它压缩插件使⽤的话，需要将 TerserPlugin **显⽰配置或者使⽤** ，**否则 terser-webpack-plugin 会被覆盖。**

```js{6,7,9}
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({}), // 显⽰配置
      // "...",  或者使⽤展开符，启⽤默认插件
      // 其它压缩插件
      new CssMinimizerPlugin()
    ]
  }
}
```

### 8. 压缩 css（`css-minimizer-webpack-plugin`、`mini-css-extract-plugin`）

- 压缩 css 我们使⽤ `css-minimizer-webpack-plugin`，
- 同时，应该使⽤ `mini-css-extract-plugin`把 css **提取成单独的⽂件**，这样 JS 和 CSS 可以作为 2 个请求**并行下载**，页面打开速度可以再快一些。

```js{10,18,25}
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取成单独的⽂件
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩 css

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取成单独的⽂件
          'css-loader'
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'asset/css/main.css' // 定义输出⽂件名和⽬录
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({}) // 压缩 css
    ]
  }
}
```

### 9. 压缩 html（`html-webpack-plugin`）

- 压缩 html 使⽤的还是 `html-webpack-plugin` 插件。该插件⽀持配置⼀个 `minify` 对象，⽤来
  配置压缩 html 。

```js{3,7,8,9}
module.export = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 动态⽣成 html ⽂件
      // 压缩HTML
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空⽩符与换⾏符
        minifyCSS: true // 压缩内联css
      }
    })
  ]
}
```

### 10. 压缩图⽚（ `image-webpack-loader` ）

- 一般来说在打包之后，一些图片文件的大小是远远要比 js 或者 css 文件要来的大，所以图片压缩较为重要
- 可以通过 `image-webpack-loader` 来实现

```js{8,15,18,22,26,31,35}
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩jpeg的配置
              mozjpeg: {
                progressive: true
              },
              // 压缩png
              optipng: {
                enabled: false
              },
              // 压缩png
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              // 压缩gif
              gifsicle: {
                interlaced: false
              },
              // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
              webp: {
                quality: 75
              }
            }
          }
        ],
        exclude: /node_modules/ //排除 node_modules ⽬录
      }
    ]
  }
}
```

### 11. 按需加载（`import()`）

很多时候我们不需要⼀次性加载所有的 JS ⽂件，⽽应该在不同阶段去加载所需要的代码。

- 将路由⻚⾯/触发性功能单独打包为⼀个⽂件，使⽤时才加载，好处是 **减轻⾸屏渲染的负担** 。因为项⽬功能越多其打包体积越⼤，导致⾸屏渲染速度越慢。
- 实际项⽬中⼤部分是对**懒加载路由**，⽽懒加载路由可以打包到⼀个 chunk ⾥⾯。
  > ⽐如某个列表⻚和编辑⻚它们之间存在相互跳转，如果对它们拆分成两个 `import() js` 资源加载模块，在跳转过程中视图会出现 **⽩屏切换过程**。  
  >  因为在跳转期间，浏览器会动态创建 `script` 标签来加载这个 `chunk` ⽂件，在这期间，⻚⾯是没有任何内容的。  
  >  所以 **⼀般会把路由懒加载打包到⼀个 chunk ⾥⾯**

```js
// 把路由懒加载打包到⼀个 chunk ⾥⾯
const List = lazyComponent('list', () => import(/* webpackChunkName: "list" */ '@/pages/list'))
const Edit = lazyComponent('edit', () => import(/* webpackChunkName: "list" */ '@/pages/edit'))
```

- 但需要注意⼀点：动态导⼊`import()` ⼀个模块，这个模块就不能再出现被其他模块使⽤ **同步 import** ⽅式导⼊。
  > ⽐如，⼀个路由模块在注册`<Route />` 时采⽤动态`import()` 导⼊，  
  > 但在这个模块对外暴露了⼀些变量⽅法供其他⼦模块使⽤，在这些 **⼦模块** 中使⽤了**同步** `ESModule import` ⽅式引⼊，这就造成了动态 import() 的失效。

### 12. 预加载 preload、prefetch

对于某些较⼤的模块，如果点击时再加载，那可能响应的时间反⽽延⻓。我们可以使⽤`prefetch` 、`preload` 去加载这些模块，只需要通过 **魔法注释** 即可实现
|属性|描述|
|---|----|
|`prefetch`|将来可能需要⼀些模块资源（⼀般是其他⻚⾯的代码），在核⼼代码加载完成之后,**`带宽空闲` 的时候再去加载需要⽤到的模块代码。**|
|`preload` |当前核⼼代码加载期间可能需要模块资源（当前⻚⾯需要的但暂时还没使⽤到的），是和核⼼代码⽂件⼀起去加载的。|

- 以 prefetch 为例

```js{3,4}
document.getElementById('btn1').onclick = function () {
  import(
    /*_ webpackChunkName: "btnChunk"*/   // 单独拆⼀个 chunk，叫做 btnChunk
    /* webpackPrefetch: true*/  // 魔法注释:在浏览器空闲时加载
    './module1.js'
  ).then((fn) => fn.default())
}
```

- 这⾏代码表⽰**在浏览器空闲时加载`module1.js`模块**，并且单独拆⼀个 chunk，叫做 btnChunk
- 可以看到，在 `head` ⾥⾯，我们的懒加载模块被直接引⼊了，并且加上了 `rel='prefetch'` 。
- 这样，⻚⾯⾸次加载的时候，浏览器空闲的时候会提前加载 module1.js 。当我们点击按钮的时
  候，会直接从缓存中读取该⽂件，因此速度⾮常快。

### 13. 代码分割（`splitChunks`）

- 在项⽬中，⼀般是使⽤同⼀套技术栈和公共资源。如果每个⻚⾯的代码中都有这些公开资源，就会导
  致资源的浪费。在每⼀个⻚⾯下都会加载重复的公共资源，⼀是会浪费⽤⼾的流量，⼆是不利于项⽬
  的性能，造成⻚⾯加载缓慢，影响⽤⼾体验。
- ⼀般是把不变的**第三⽅库**、⼀些 **公共模块（⽐如 util.js）** 这些单独拆成⼀个 chunk，在访问⻚⾯的时候，就可以⼀直使⽤**浏览器缓存中的资源**
- webpack ⾥⾯通过 `splitChunks` 来分割代码

```js{4,14,18}
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 值有 all，async 和 initial，表示对同步代码还是异步代码进行处理
      minSize: 20000, // 拆分包的大小（以 bytes 为单位），至少为minSize，如何包的大小不超过minSize，这个包不会拆分
      maxSize:50000,//将大于maxSize的包，拆分为不小于minSize的包
      minRemainingSize: 0,
      minChunks: 1, // 拆分前必须共享模块的最⼩ chunks 数。//被引入的次数，默认是1
      maxAsyncRequests: 30, // 按需加载时的最⼤并⾏请求数。
      maxInitialRequests: 30, // ⼊⼝点的最⼤并⾏请求数。
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\/]node_modules[\/]/, //第三⽅模块拆出来
          priority: -10,
          reuseExistingChunk: true
        },
        'util.vendors': {
          test: /[\/]utils[\/]/, //公共模块拆出来
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

### 14. tree shaking（`purgecss-webpack-plugin`）

- `tree shaking` 的原理细节可以看这篇⽂章：[# webpack tree-shaking 解析](https://juejin.cn/post/7246219936594821180)
- `tree shaking` **在⽣产模式下已经默认开启了**
- 只是需要注意下⾯⼏点：
  1. 只对 `ESM` ⽣效
  2. 只能是 **静态声明和引⽤** 的 ES6 模块，不能是动态引⼊和声明的。
  3. 只能处理**模块级别**，不能处理函数级别的冗余。
  4. 只能处理 `JS` 相关冗余代码，不能处理 CSS 冗余代码。
- ⽽可能**样式⽂件**⾥⾯有些代码我们也没有使⽤，我们可以通过 `purgecss-webpack-plugin` 插件来对 css 进⾏ tree shaking

```js{7,8}
const path = require('path')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob') // ⽂件匹配模式
module.exports = {
  //...
  plugins: [
    // ...
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATH.src}/**/*`, { nodir: true })
    })
    // Add your plugins here// Learn more about plugins fromhttps://webpack.js.org/configuration/plugins/
  ]
}
```

### 15. gzip（`compression-webpack-plugin`）

- 前端除了在打包的时候将⽆⽤的代码或者 console 、注释剔除之外。我们还可以使⽤ Gzip 对资
  源进⾏进⼀步压缩。那么浏览器和服务端是如何通信来⽀持 Gzip 呢？
  1. 当⽤⼾访问 web 站点的时候，会在 `request header` 中设置 `accept-encoding:gzip` ，
     **表明浏览器是否⽀持 Gzip** 。
  2. 服务器在收到请求后，判断如果需要返回 Gzip 压缩后的⽂件那么服务器就会**先将我们的 JS\CSS 等其他资源⽂件进⾏ Gzip 压缩后再传输到客⼾端**，同时将 `response headers`设置 `content-encoding:gzip` 。反之，则返回源⽂件。
  3. 浏览器在接收到服务器返回的⽂件后，判断服务端返回的内容是否为压缩过的内容，是的话则进⾏
     **解压操作**。
- ⼀般情况下我们并不会让服务器实时 Gzip 压缩，⽽是**利⽤ webpack 提前将静态资源进⾏ Gzip 压缩**，然后将 Gzip 资源放到服务器，当请求需要的时候直接将 Gzip 资源发送给客⼾端。
- 我们只需要安装 `compression-webpack-plugin` 并在 plugins 配置就可以了

```js{4}
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 需要安装
module.exports = {
  plugins: [
    new CompressionWebpackPlugin( {
      test:/\.(css|js)$/， // 哪些文件需要压缩
      threshold:500，// 设置文件多大开始压缩
      minRatio:0.7，//至少压缩的比例
      algorithm:"gzip"，//采用的压缩算法
    })
  ]
}
```

<!--
### 16. 作⽤域提升（`production`、`ModuleConcatenationPlugin`）

`Scope Hoisting` 可以让 webpack 打包出来的代码⽂件体积更⼩，运⾏更快。
在开启 Scope Hoisting 后，构建后的代码会按照**引⼊顺序**放到⼀个函数作⽤域⾥，通过适当重命名某些变量以防⽌变量名冲突，从⽽减少函数声明和内存花销。

- 需要注意： Scope Hoisting 需要分析模块之间的依赖关系，所以源码必须采⽤ **ES6 模块化语法**
- Scope Hoisting 是 webpack **内置功能**，只需要在 plugins ⾥⾯使⽤即可，或者**直接开启⽣产环境也可以让作⽤域提升⽣效**。

```js{2,6}
module.exports = {
  //⽅式1
  mode: 'production',
  //⽅式2
  plugins: [
    webpack.optimize.ModuleConcatenationPlugin()// 开启 Scope Hoisting 功能new
  ]
}
``` -->
