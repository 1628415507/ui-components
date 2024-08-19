/*
 * @Description: 
 * @Date: 2024-08-16 09:42:51
 * @LastEditTime: 2024-08-16 16:31:50
 */
import InputDivider from './index.vue';

/**
 * 定义props类型
 */
export interface InputDividerProps {
    modelValue: string;
    disabled?: boolean;
}

/**
 * 定义emit类型
 */
export type InputDividerEmits = {
    'update:modelValue': [value: string];
};

/**
 * 定义instance类型
 */
// InputInstance是用来干啥的？ 
// 在写公共组件时，会使用defineExpose暴露一些方法。
// 如在element-plus中，就会使用formRef.validate 来校验表单，instance里就有暴露方法的类型签名。

export type InputDividerInstance = InstanceType<typeof InputDivider>;