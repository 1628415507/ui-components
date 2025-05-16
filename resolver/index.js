/*
 * @Description: 
 * @Date: 2025-05-13 10:11:41
 * @LastEditTime: 2025-05-13 11:42:39
 */
// 下面的代码大概意思是，
// 解析到一个组件以“Z”开头时，
// 返回组件名称、组件位置、组件样式位置给unplugin-vue-components 和 unplugin-auto-import 自动导入。
function ZResolver() {
  const VITE_PACKAGE_NAME = 'z-ui-comp' //import.meta.env.VITE_APP_BASE_API
  console.log('【 ZResolver 】-6', VITE_PACKAGE_NAME)
  return {
    type: 'component',
    resolve: (name) => {
      if (name.startsWith('Z')) {
        //以Z开头的组件
        const partialName = name.slice(1) //组件名字Z开头后面的部分
        return {
          name: 'Z' + partialName,
          from: VITE_PACKAGE_NAME,
          sideEffects: `${VITE_PACKAGE_NAME}/es/${partialName}/src/style/index.css` //查找css的路径（暂时以form文件夹下的为路径）
        }
      
    }
  }
}

module.exports = {
  ZResolver
}
