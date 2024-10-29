/*
 * @Description: 
 * @Date: 2024-06-26 11:40:35
 * @LastEditTime: 2024-10-29 10:35:53
 */
// 声明类型
import ZInputNumber from "@/components/form/input-number/src/index.vue";
import ZInputDivider from "@/components/form/input-divider/src/index.vue" // 分割线文本域
import ZInputOrder from "@/components/form/input-order/src/index.vue" // 短杆分割线输入框
import ZInputExpand from "@/components/form/input-expand/src/index.vue"
import ZAssociateSelect from "@/components/form/associate-select/src/index.vue"
import ZExpandMore from "@/components/expand-more/src/index.vue"
import ZInfoCard from "@/components/info-card/src/index.vue"
import ZPlusminusButton from "@/components/plusminus-button/src/index.vue"
import ZRowSteps from "@/components/steps/row-steps/src/index.vue"
import ZVerticalSteps from "@/components/steps/vertical-steps/src/index.vue"
import ZCountdown from "@/components/countdown/src/index.vue"

declare module 'vue' {
    export interface GlobalComponents {
        ZInputDivider: typeof ZInputDivider,
        ZInputOrder: typeof ZInputOrder,
        ZInputExpand: typeof ZInputExpand,
        ZAssociateSelect: typeof ZAssociateSelect,
        ZExpandMore: typeof ZExpandMore,
        ZInfoCard: typeof ZInfoCard,
        ZPlusminusButton: typeof ZPlusminusButton,
        ZRowSteps: typeof ZRowSteps,
        ZVerticalSteps: typeof ZVerticalSteps,
        ZCountdown: typeof ZCountdown
    }
}
