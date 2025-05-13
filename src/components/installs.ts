/*
 * @Description: 将组件的默认导出，也就是经过withInstall处理的vue组件插件导入进来，封装成一个数组，给下面的入口文件使用
 * @Date: 2025-05-10 13:53:33
 * @LastEditTime: 2025-05-12 17:53:16
 */
// 表单控件
import ZInputNumber from "./form/input-number";
import ZInputDivider from "./form/input-divider" // 分割线文本域
import ZInputOrder from "./form/input-order" // 短杆分割线输入框
// import ZInputExpand from "./form/input-expand"
// import ZAssociateSelect from "./form/associate-select"
// import ZEditLabel from "./form/edit-label"
// import ZExpandMore from "./expand-more"
// import ZInfoCard from "./info-card"
// import ZPlusminusButton from "./plusminus-button"
// import ZRowSteps from "./steps/row-steps"
// import ZVerticalSteps from "./steps/vertical-steps"
// import ZCountdown from "./countdown"

export default [ZInputDivider, ZInputOrder, ZInputNumber];
