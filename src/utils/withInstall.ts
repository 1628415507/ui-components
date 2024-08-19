/*
 * @Description: 
 * @Date: 2024-08-16 10:33:58
 * @LastEditTime: 2024-08-16 11:58:20
 */
// 这个withInstall函数的作用就是把组件封装成了一个可被安装，带install方法的vue插件，
// 这个函数是直接从element-plus项目复制的😂。
import { App, Plugin } from 'vue'
type SFCWithInstall<T> = T & Plugin
export const withInstall = <T, E extends Record<string, any>>(
    main: T,
    extra?: E
) => {
    (main as SFCWithInstall<T>).install = (app: App) => {
        for (const comp of [main, ...Object.values(extra ?? {})]) {
            app.component(comp.name, comp)
        }
    }
    if (extra) {
        for (const [compName, comp] of Object.entries(extra)) {
            ; (main as Record<string, any>)[compName] = comp
        }
    }
    // 将 T 断言为具体的类型 T & plugin & Record<string, any>
    return main as SFCWithInstall<T> & E
}
