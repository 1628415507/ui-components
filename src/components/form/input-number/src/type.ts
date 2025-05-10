/*
 * @Description: 数值输入框
 * @Date: 2025-04-24 20:25:43
 * @LastEditTime: 2025-05-10 13:22:51
 */
import InputNumber from './index.vue';

/**
 * 定义props类型
 */
export interface InputNumberProps {
  modelValue: string | number;
  precision: number;
  min?: number;
  max?: number;
  maxlength?: number;
  width?: string;
  prefix?: string;// 自定义头部内容
  suffix?: string;// 自定义尾部内容
  prepend?: string; // 前缀
  append?: string;// 后缀
  slotAppend?: boolean;
  textAlign?: string;
  useGrouping?: boolean;// 是否默认分隔 如千分位
  zeroFill?: boolean; //是否小数位自动补0
  disabled?: boolean;
}

/**
 * 定义emit类型
 */
export type InputNumberEmits = {
  'update:modelValue': [value: string];
  // 'change': [value: function];
};

/**
 * 定义instance类型
 * 作用：InputInstance是用来干啥的？
 * 在写公共组件时，会使用defineExpose暴露一些方法。
 * 如在element-plus中，就会使用formRef.validate 来校验表单，
 * instance里就有暴露方法的类型签名。
 */
export type InputNumberInstance = InstanceType<typeof InputNumber>;