/*
 * @Author: Hongzf
 * @Date: 2022-11-17 16:36:23
 * @LastEditors: Hongzf
 * @LastEditTime: 2022-12-01 18:06:03
 * @Description:
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    // 'eslint:recommended',
    // "airbnb-base"
    'plugin:vue/vue3-essential',
    // 添加 prettier 插件,这样，我们在执行 eslint --fix 命令时，
    // ESLint 就会按照 Prettier 的配置规则来格式化代码，解决prettier/ESLint二者冲突问题。
    'plugin:prettier/recommended'
    // "plugin:@typescript-eslint/recommended"
  ],
  overrides: [],
  // "parser": "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    // 默认的eslint配置无法检测ts的语法，有些关键字会报错,解决interface关键字等识别报错的问题
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 我们主要使用以下规则配置
    // 错误急别分为三类
    // 1、off 或 0 表示关闭验证规则
    // 2、warn 或 1 表示开启警告验证规则
    // 3、error 或 2 表示开启错误验证规则，程序会报错退出
    semi: [2, 'never'], // 禁止尾部使用分号“ ; ”， 要求或禁止使用分号代替 ASI
    'no-var': 'error', // 禁止使用 var
    'no-unused-vars': 'warn',
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ],
    // quotes: [2, 'single'],
    quotes: [
      // 使用单引号，强制使用一致的反勾号、双引号或单引号
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: false
      }
    ],
    'no-dupe-keys': 2, // 对象唯一key值
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-mixed-spaces-and-tabs': 1, // 不能空格与tab混用
    eqeqeq: [
      // 要求使用 === 和 !==
      'error',
      'always',
      {
        null: 'ignore'
      }
    ],
    // vue template模板元素第一行最多10个属性
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10, // 一行最多可以放下10个属性
        multiline: {
          max: 1
          // allowFirstLine: false
        }
      }
    ],
    // 其它的规则可以去eslint查看，根据自己需要进行添加
    'vue/multi-word-component-names': 'off', // 关闭名称校验（使用大驼峰命名方式或者用“-”连接单词）
    'vue/html-closing-bracket-newline': 'off', // 不强制换行
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    // 'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'accessor-pairs': 2,
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    camelcase: [
      0,
      {
        properties: 'always'
      }
    ],
    'comma-dangle': [2, 'never'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'dot-location': [2, 'property'],
    'eol-last': 2,
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'handle-callback-err': [1, '^(err|error)$'], // err或者error需要用到或者处理
    'jsx-quotes': [2, 'prefer-single'],
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      }
    ],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty-pattern': 2,
    'no-eval': 1,
    'no-ex-assign': 2,
    'no-extend-native': 1,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 1,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      }
    ],
    'no-lone-blocks': 2,
    'no-multi-spaces': 2,
    'no-multi-str': 2,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1
      }
    ],
    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 1,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false
      }
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [
      2,
      {
        initialized: 'never'
      }
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'padded-blocks': [2, 'never'],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': [2, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    'prefer-const': 2,
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false
      }
    ],
    'array-bracket-spacing': [2, 'never']
  }
}
