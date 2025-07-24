<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="formRules" label-width="auto" :inline-message="true">
    <el-form-item label="自定义校验" prop="customValid">
      <el-input v-model="ruleForm.customValid" clearable />
    </el-form-item>
    <el-form-item label="最大最小长度min/max" prop="name" min="6" max="10">
      <el-input v-model="ruleForm.name" clearable />
    </el-form-item>
    <el-form-item label="必填required" prop="region" required>
      <el-select v-model="ruleForm.region" placeholder="Activity zone" clearable>
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="校验标签占位rule-label" required>
      <el-col :span="11">
        <el-form-item rule-label="校验标签" prop="date1" required>
          <el-date-picker
            v-model="ruleForm.date1"
            type="date"
            aria-label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <div class="flex-c">-</div>
      </el-col>
      <el-col :span="11">
        <el-form-item rule-label="校验标签2" prop="date2" required>
          <el-time-picker
            v-model="ruleForm.date2"
            aria-label="Pick a time"
            placeholder="Pick a time"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="Activity type" prop="type" required>
      <el-checkbox-group v-model="ruleForm.type">
        <el-checkbox value="Online activities" name="type">Online activities</el-checkbox>
        <el-checkbox value="Promotion activities" name="type">Promotion activities</el-checkbox>
        <el-checkbox value="Offline activities" name="type">Offline activities</el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type">Simple brand exposure</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources" prop="resource" required>
      <el-radio-group v-model="ruleForm.resource">
        <el-radio value="Sponsorship">Sponsorship</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">校验</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { setFormRules } from './setFormRules'
interface RuleForm {
  customValid: string
  name: string
  region: string
  date1: string
  date2: string
  type: string[]
  resource: string
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  customValid: '',
  name: 'Hello',
  region: '',
  date1: '',
  date2: '',
  type: [],
  resource: ''
})

const formRules = ref<FormRules<RuleForm>>({
  // ...其他校验规则在el-form-item上设置
  customValid: [{ required: true, message: '自定义优先级更高', trigger: 'blur' }]
})

const submitForm = async () => {
  if (!ruleFormRef.value) return
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.resetFields()
}

onMounted(() => {
  setFormRules(ruleFormRef.value, formRules, ruleForm)
})
</script>
