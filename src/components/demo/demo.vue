<!--
 * @Description: 
 * @Date: 2025-04-24 20:28:59
 * @LastEditTime: 2025-04-24 20:29:50
-->
<!--
 * @Description: 
 * @Date: 2025-04-24 20:28:59
 * @LastEditTime: 2025-04-24 20:29:30
-->
<template>
  <div class="gie-input">
      <input
          v-model="state"
          ref="inputRef"
          class="gie-input__control"
          type="text"
          :disabled="props.disabled"
      />
  </div>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import type { InputEmits, InputProps } from './Input';

  defineOptions({
      name: 'GieInput',
  });

  const emit = defineEmits<InputEmits>();

  const props = withDefaults(defineProps<InputProps>(), {
      modelValue: '',
      disabled: false,
  });

  const state = computed({
      get: () => props.modelValue,
      set: (val) => {
          emit('update:modelValue', val);
      },
  });

  const inputRef = ref<HTMLInputElement>();

  function focus() {
      inputRef.value?.focus();
  }

  defineExpose({
      focus,
  });
</script>