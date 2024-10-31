/*
 * @Description: 配置markdown-it-container插件
 * @Date: 2024-06-27 09:31:59
 * @LastEditTime: 2024-10-30 18:21:41
 */

import path, { resolve } from 'path'
import fs from 'fs'
// @ts-ignore
import MarkdownIt from 'markdown-it'
// @ts-ignorez
import mdContainer from 'markdown-it-container' // 自定义markdown渲染机制
// @ts-ignore
import type Token from 'markdown-it/lib/token'
import { highlight } from '../utils/highlight'
import { docRoot } from './global'

const localMd = MarkdownIt()
interface ContainerOpts {
  marker?: string | undefined
  validate?(params: string): boolean
  render?(tokens: Token[], index: number): string
}

export const mdPlugin = (mdIt: MarkdownIt) => {
  const mdContainerName = 'example'
  mdIt.use(mdContainer, mdContainerName, {//注册名称为mdContainerName的自定义容器
    // 匹配mdContainerName名称
    validate(params) {
      const reg = new RegExp(`^${mdContainerName}\s*(.*)$`)
      return !!params.trim().match(reg)//匹配mdContainerName名称
    },
    // ？？？
    render(tokens, idx) {
      const reg = new RegExp(`^${mdContainerName}\s+(.*)$`)
      const m = tokens[idx].info.trim().match(reg)
      if (tokens[idx].nesting === 1) {
        /* means the tag is opening */
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        // 文件名称
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          // ☆ 从docs目录下中读取示列代码文件
          // path.resolve(docRoot, 'examples', `${sourceFile}.vue`),
          source = fs.readFileSync(
            path.resolve(docRoot, `${sourceFile}.vue`),
            'utf-8'
          )
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        // 起始标签（调用ExampleContainer组件，并传入值）
        // ExampleContainer组件已在docs\.vitepress\theme\index.ts全局注册
        return `<ExampleContainer
                  source="${encodeURIComponent(highlight(source, 'vue'))}"
                  path="${sourceFile}"
                  raw-source="${encodeURIComponent(source)}"
                  description="${encodeURIComponent(localMd.render(description))}">`
      } else {
        // 结尾标签
        return '</ExampleContainer>\n'
      }
    },
  } as ContainerOpts)
}
