// import hasRole from './permission/hasRole'
// import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'
import draggable from './common/draggable'
import uppercase from './common/uppercase'
import keyFocus from './common/keyFocus'
import enterFocus from './common/enterFocus'
import clickSelectValue from './common/clickSelectValue'
import shortCutInput from './common/shortCutInput'
import clickOutside from './common/clickOutside'
import dragForbid from './common/dragForbid'
import lazyLoad from './common/lazyLoad'

export default function directive(app) {
  // app.directive('hasRole', hasRole)
  // app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('draggable', draggable)
  app.directive('uppercase', uppercase) //输入框小写转大写
  app.directive('keyFocus', keyFocus)
  app.directive('enterFocus', enterFocus) //回车切换输入框
  app.directive('click-select-value', clickSelectValue) //点击选中输入框内容
  app.directive('shortCutInput', shortCutInput)
  app.directive('clickOutside', clickOutside)
  app.directive('dragForbid', dragForbid) //禁止拖拽
  app.directive('lazyLoad', lazyLoad) //触底加载
}
