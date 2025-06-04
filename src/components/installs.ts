/*
 * @Description: 将组件的默认导出，也就是经过withInstall处理的vue组件插件导入进来，封装成一个数组，给下面的入口文件使用
 * @Date: 2025-05-10 13:53:33
 * @LastEditTime: 2025-05-15 15:03:35
 */
// 表单控件
import ZInputNumber from "./input-number";
import ZInputDivider from "./input-divider" // 分割线文本域
import ZInputOrder from "./input-order" // 短杆分割线输入框
import ZInputExpand from "./input-expand"
import ZAssociateSelect from "./associate-select"
import ZEditLabel from "./edit-label"
import ZExpandMore from "./expand-more"
import ZInfoCard from "./info-card"
import ZPlusminusButton from "./plusminus-button"
import ZRowSteps from "./steps/row-steps"
import ZVerticalSteps from "./steps/vertical-steps"
import ZCountdown from "./countdown"

export default [
  ZInputDivider, ZInputOrder, ZInputNumber,
  ZInputExpand,
  ZAssociateSelect,
  ZEditLabel,
  ZExpandMore,
  ZInfoCard,
  ZPlusminusButton,
  ZRowSteps,
  ZVerticalSteps,
  ZCountdown
];
