/*
 * @Description: 通过gulp打包
 * @Date: 2025-05-10 14:45:58
 * @LastEditTime: 2025-05-12 17:43:23
 */
// index.js
import gulp from 'gulp' //打包工具
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import shell from 'shelljs'

const componentPath = resolve(dirname(fileURLToPath(import.meta.url)), '../')
const distPath = componentPath

const { src, dest } = gulp
const sass = gulpSass(dartSass)

// 删除打包产物
export const removeDist = async () => {
  shell.rm('-rf', `${distPath}/lib`)
  shell.rm('-rf', `${distPath}/es`)
  shell.rm('-rf', `${distPath}/types`)
}

// 构建css
export const buildRootStyle = () => {
  return src(`${componentPath}/src/components/style.scss`)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest(`${distPath}/es`))
    .pipe(dest(`${distPath}/lib`))
}

// 构建每个组件下单独的css
export const buildStyle = () => {
  // 在路径模式中，** 是一个特殊的通配符，表示递归匹配任意深度的目录层级。，如
  // src/components/button/src/styles             ✓
  // src/components/any/depth/path/src/styles ✓

  return src(`${componentPath}/src/components/**/style/**.scss`)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest(`${distPath}/es`))
    .pipe(dest(`${distPath}/lib`))
}

// 打包组件
export const buildComponent = async () => {
  shell.cd(componentPath)
  shell.exec('vite build')
}
