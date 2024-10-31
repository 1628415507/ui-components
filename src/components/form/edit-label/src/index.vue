<template>
  <div class="z-edit-label" :style="{ background: background }">
    <!-- 双击标签触发编辑 -->
    <span v-if="trigger == 'dblclick' && !editing" title="双击修改名称" @dblclick="openEdit" class="txt">
      {{ inputVal }}
    </span>
    <!-- 点击按钮图标触发编辑 -->
    <template v-if="trigger == 'icon' && !editing">
      <div class="img-icon" @click.stop="openEdit"></div>
      <span class="txt">
        {{ inputVal }}
      </span>
    </template>
    <!-- 输入框 -->
    <el-input
      v-show="editing"
      ref="inputRef"
      v-model="inputVal"
      size="small"
      style="width: 100%"
      :maxlength="maxlength"
      placeholder=" "
      @blur="handleBlur"
      @input="handleInput"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'ZEditLabel'
}
</script>
<script setup lang="ts">
import { ref, defineEmits, defineProps, computed, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    require: true
  },
  size: {
    type: String,
    default: '',
    require: false
  },
  // 是否只读，只读状态下只显示文本，不能编辑
  readonly: {
    type: Boolean,
    default: false
  },
  // 是否显示背景色
  background: {
    type: String,
    default: '#f5f7fa'
  },
  trigger: {
    type: String,
    default: 'dblclick', // 编辑的触发方式，按钮图标或双击标签
    validator(value, props) {
      // icon:按钮图标-触发编辑
      // dblclick:双击标签-触发编辑
      return ['icon', 'dblclick'].includes(value)
    }
  },
  maxlength: {
    type: [Number, String],
    default: undefined
  },
  beforeEditClose: {
    type: Function, // 编辑状态改变标识
    default: () => true,
    require: false
  }
})

const emits = defineEmits()
const inputRef = ref()
const editing = ref<boolean>(false) //是否在编辑中状态
const inputVal = computed<string>({
  get() {
    // emits('update:modelValue', props.modelValue)
    return props.modelValue //同步外部v-model的值
  },
  set(val) {
    emits('update:modelValue', val)
  }
})
// function
// 编辑
function openEdit() {
  if (props.readonly) {
    return
  }
  editing.value = true
  emits('update:editing', editing.value) // 更新编辑状态
  nextTick(() => {
    inputRef.value.focus()
  })
  // console.log('【 双击】-216', e)
}
// 失去焦点，恢复文字
function handleBlur(e) {
  const val = e.target.value
  if (!val) {
    ElMessage.warning('名称不能为空')
    return
  }
  if (props.beforeEditClose) {
    editing.value = !props.beforeEditClose(val)
  } else {
    editing.value = false
  }
  emits('update:editing', editing.value) // 更新编辑状态
}
function handleInput() {}
</script>
<style lang="scss" scoped>
.z-edit-label {
  position: relative;
  display: flex;
  align-items: center;
  margin: 5px 0;
  &.border {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
.txt {
  width: 100%;
  display: inline-block;
  min-width: 30px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  text-wrap: nowrap;
}
.img-icon {
  margin-right: 5px;
  height: 12px;
  width: 12px;
  background: url('./lib/editPen.svg') no-repeat center top / cover;
  cursor: pointer;
  &:hover {
    background: url('./lib/editPenHover.svg') no-repeat center top / cover;
  }
}
</style>
