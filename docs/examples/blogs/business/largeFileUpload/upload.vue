<!--
 * @Description: 
 * @Date: 2024-10-17 09:03:22
 * @LastEditTime: 2024-10-18 16:50:40
-->
<template>
  <el-upload
    ref="uploadRef"
    v-model="fileList"
    action="/"
    class="upload-area"
    drag
    :show-file-list="false"
    :http-request="handleHttpRequest"
    :on-change="onChange"
    multiple
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500KB.</div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { sliceUpload } from './sliceUpload'
import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])
function onChange(uploadFile, uploadFiles) {
  console.log('【 onChange 】-37', uploadFile, uploadFiles)
}

// 接口上传
function handleHttpRequest(uploadObject) {
  sliceUpload(uploadObject.file)
}

</script>
