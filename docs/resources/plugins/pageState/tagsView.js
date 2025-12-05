// import _ from 'lodash-es'
// import emiter from '@/plugins/mitt.js'
// import modal from '@/plugins/modal'
// import pageState from '@/plugins/pageState'
// import i18n from '@/lang'
// const language = i18n.global.t
// const useTagsViewStore = defineStore('tags-view', {
//   state: () => ({
//     visitedViews: [],
//     cachedViews: [],
//     iframeViews: [],
//     emiterViews: [],
//     latestView: {} //记录最近打开的标签菜单，用于切换到在线查询时定位
//   }),
//   actions: {
//     setLatestView(view) {
//       // 只保存简单字段，避免循环引用
//       const { path, name, meta, fullPath, query, params } = view
//       this.latestView = { path, name, meta, fullPath, query, params }
//     },
//     addView(view) {
//       this.addVisitedView(view)
//       this.addCachedView(view)
//     },
//     // 添加监听页面
//     addEmiterView(view) {
//       const name = view.path
//       if (!this.emiterViews.includes(name)) {
//         this.emiterViews.push(name)
//       }
//     },
//     addIframeView(view) {
//       if (this.iframeViews.some(v => v.path === view.path)) return
//       this.iframeViews.push(
//         Object.assign({}, view, {
//           title: view.meta.title || 'no-name'
//         })
//       )
//     },
//     addVisitedView(view) {
//       if (this.visitedViews.some(v => v.path === view.path)) return
//       this.visitedViews.push(
//         Object.assign({}, view, {
//           title: view.meta.title || 'no-name'
//         })
//       )
//     },
//     addCachedView(view) {
//       if (this.cachedViews.includes(view.name)) return
//       if (!view.meta.noCache) {
//         this.cachedViews.push(view.name)
//       }
//     },
//     delView(view) {
//       return new Promise(resolve => {
//         const next = page => {
//           emiter.off(`beforeDelView_${page.path}`) // 卸载监听事件
//           this.delVisitedView(view)
//           this.delCachedView(view)
//           this.delEmiterView(view)
//           resolve({
//             visitedViews: [...this.visitedViews],
//             cachedViews: [...this.cachedViews],
//             emiterViews: [...this.emiterViews]
//           })
//         }
//         // 如果使用emiter的形式判断页面关闭，需要在页面初始化时调用onBeforeCloseView
//         if (
//           this.emiterViews.includes(view.path) &&
//           (this.cachedViews.includes(view.name) ||
//             this.cachedViews.includes(view.path))
//         ) {
//           emiter.emit(`beforeDelView_${view.path}`, async callback => {
//             callback(view, next) //挂载监听事件
//           })
//         } else {
//           // 使用pageState的形式判断页面关闭
//           this.checkNotSave(view).then(() => next(view))
//         }
//       })
//     },
//     delVisitedView(view) {
//       return new Promise(resolve => {
//         for (const [i, v] of this.visitedViews.entries()) {
//           if (v.path === view.path) {
//             this.visitedViews.splice(i, 1)
//             break
//           }
//         }
//         this.iframeViews = this.iframeViews.filter(
//           item => item.path !== view.path
//         )
//         resolve([...this.visitedViews])
//       })
//     },
//     delEmiterView(view) {
//       const viewName = view.path
//       return new Promise(resolve => {
//         const index = this.emiterViews.indexOf(viewName)
//         index > -1 && this.emiterViews.splice(index, 1)
//         resolve([...this.emiterViews])
//       })
//     },
//     delIframeView(view) {
//       return new Promise(resolve => {
//         this.iframeViews = this.iframeViews.filter(
//           item => item.path !== view.path
//         )
//         resolve([...this.iframeViews])
//       })
//     },
//     delCachedView(view) {
//       return new Promise(resolve => {
//         const index = this.cachedViews.indexOf(view.name)
//         if (index > -1) {
//           this.cachedViews.splice(index, 1)
//           pageState.instance(view).reset()
//         }
//         resolve([...this.cachedViews])
//       })
//     },
//     // 关闭其他
//     delOthersViews(view) {
//       return new Promise(resolve => {
//         const delViews = _.reject(this.visitedViews, item => {
//           return item?.affix || item.path === view.path
//         })
//         this.checkNotSave(delViews).then(() => {
//           this.delOthersVisitedViews(view)
//           this.delOthersCachedViews(view)
//           resolve({
//             visitedViews: [...this.visitedViews],
//             cachedViews: [...this.cachedViews]
//           })
//         })
//       })
//     },
//     delOthersVisitedViews(view) {
//       return new Promise(resolve => {
//         this.visitedViews = this.visitedViews.filter(v => {
//           return v.meta.affix || v.path === view.path
//         })
//         this.iframeViews = this.iframeViews.filter(
//           item => item.path === view.path
//         )
//         resolve([...this.visitedViews])
//       })
//     },
//     delOthersCachedViews(view) {
//       return new Promise(resolve => {
//         const index = this.cachedViews.indexOf(view.name)
//         if (index > -1) {
//           this.cachedViews = this.cachedViews.slice(index, index + 1)
//         } else {
//           this.cachedViews = []
//         }
//         resolve([...this.cachedViews])
//       })
//     },
//     // 全部关闭
//     delAllViews(view) {
//       return new Promise(resolve => {
//         const delViews = _.reject(this.visitedViews, (item, index) => {
//           return item?.affix
//         })
//         this.checkNotSave(delViews).then(() => {
//           this.delAllVisitedViews(view)
//           this.delAllCachedViews(view)
//           resolve({
//             visitedViews: [...this.visitedViews],
//             cachedViews: [...this.cachedViews]
//           })
//         })
//       })
//     },
//     delAllVisitedViews(view) {
//       return new Promise(resolve => {
//         const affixTags = this.visitedViews.filter(tag => tag.meta.affix)
//         this.visitedViews = affixTags
//         this.iframeViews = []
//         resolve([...this.visitedViews])
//       })
//     },
//     delAllCachedViews(view) {
//       return new Promise(resolve => {
//         this.cachedViews = []
//         resolve([...this.cachedViews])
//       })
//     },
//     updateVisitedView(view) {
//       for (let v of this.visitedViews) {
//         if (v.path === view.path) {
//           v = Object.assign(v, view)
//           break
//         }
//       }
//     },
//     delRightTags(view) {
//       return new Promise(resolve => {
//         const index = this.visitedViews.findIndex(v => v.path === view.path)
//         if (index === -1) {
//           return
//         }
//         const delViews = _.reject(this.visitedViews, (item, itemIndex) => {
//           return itemIndex <= index || item?.affix
//         })
//         this.checkNotSave(delViews).then(() => {
//           this.visitedViews = this.visitedViews.filter((item, idx) => {
//             if (idx <= index || (item.meta && item.meta.affix)) {
//               return true
//             }
//             const i = this.cachedViews.indexOf(item.name)
//             if (i > -1) {
//               this.cachedViews.splice(i, 1)
//             }
//             if (item.meta.link) {
//               const fi = this.iframeViews.findIndex(v => v.path === item.path)
//               this.iframeViews.splice(fi, 1)
//             }
//             return false
//           })
//           resolve([...this.visitedViews])
//         })
//       })
//     },
//     delLeftTags(view) {
//       return new Promise(resolve => {
//         const index = this.visitedViews.findIndex(v => v.path === view.path)
//         if (index === -1) {
//           return
//         }
//         const delViews = _.reject(this.visitedViews, (item, itemIndex) => {
//           return itemIndex >= index || item?.affix
//         })

//         this.checkNotSave(delViews).then(() => {
//           this.visitedViews = this.visitedViews.filter((item, idx) => {
//             if (idx >= index || (item.meta && item.meta.affix)) {
//               return true
//             }
//             const i = this.cachedViews.indexOf(item.name)
//             if (i > -1) {
//               this.cachedViews.splice(i, 1)
//             }
//             if (item.meta.link) {
//               const fi = this.iframeViews.findIndex(v => v.path === item.path)
//               this.iframeViews.splice(fi, 1)
//             }
//             return false
//           })
//           resolve([...this.visitedViews])
//         })
//       })
//     },
//     // 判断是否存在未保存的页面
//     checkNotSave(views) {
//       return new Promise((resolve, reject) => {
//         const modifyCount = _.chain([views])
//           .flatten()
//           .filter(view => {
//             return pageState.instance(view).modify()
//           })
//           .size()
//           .value()
//         if (modifyCount > 0) {
//           modal
//             .confirm('数据未保存，是否确认关闭')
//             .then(resolve, reject)
//         } else {
//           resolve()
//         }
//       })
//     }
//   }
// })

// export default useTagsViewStore
