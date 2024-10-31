<!--
 * @Description: 双击可编辑输入框
 * @Author: Hongzf
 * @Date: 2022-12-30 09:12:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-26 14:46:51
-->
<template>
  <div class="edit-label">
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
<script setup lang="ts">
import { ref, defineEmits, defineProps, computed, onMounted } from 'vue'
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
  editStatus: {
    type: Function, // 编辑状态改变标识
    default: null,
    require: false
  },
  // 是否只读，只读状态下只显示文本，不能编辑
  readonly: {
    type: Boolean,
    default: false
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
    default: 10
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
    // console.log('【  this.$refs[`inputRef${index}`] 】-218', this.$refs.inputRef)
    // 第二层nextTick才有效？
    // this.$nextTick(() => {
    //   // 设置聚焦
    //   // const ref =this.$refs.inputRef
    //   // ref[index].focus()
    //   // ref[index].focused = true
    // })
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
  if (props.editStatus) {
    editing.value = !props.editStatus(val)
  } else {
    editing.value = false
  }
  emits('update:editing', editing.value) // 更新编辑状态
}
function handleInput() {}
</script>
<style lang="scss" scoped>
.edit-label {
  position: relative;
  display: flex;
  align-items: center;
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
  margin-right: 3px;
  height: 12px;
  width: 12px;
  background: url('./lib/editPen.svg') no-repeat center top / cover;
  &:hover {
    background: url('./lib/editPenHover.svg') no-repeat center top / cover;
  }
}
</style>
