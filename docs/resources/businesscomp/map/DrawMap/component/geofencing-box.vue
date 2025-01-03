<template>
    <div class="geofencing-box-wrap">
        <div class="box-content">
            <el-form
                ref="formRef"
                :model="formData"
                :rules="rules"
                :inline-message="true"
                :hide-required-asterisk="true"
                label-position="top"
                size="small"
            >
                <el-form-item prop="areaName">
                    <template slot="label"> 片区名称<span style="color: red"> *</span></template>
                    <el-input v-model="formData.areaName" maxlength="15"></el-input>
                </el-form-item>
                <div class="tip">选择围栏类型，并用鼠标在地图上划定范围</div>
                <el-form-item label="经纬度" prop="lnglat">
                    <el-input
                        type="textarea"
                        v-model="formData.lnglat"
                        :maxlength="200"
                        :show-word-limit="true"
                        resize="none"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="box-footer">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button type="primary" size="mini" @click="handleConfirm">保存</el-button>
        </div>
    </div>
</template>
<script>
import { SHAPE } from '../config.js';
export default {
    name: 'GeofencingBox',
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            formData: {
                areaName: '',
                lnglat: ''
            },
            rules: {
                areaName: [
                    { required: true, message: '请输入片区名称', trigger: 'blur' }
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
                // lnglat: [{ required: true, message: '经纬度不能为空', trigger: ['blur', 'change'] }]
            }
        };
    },
    computed: {},
    watch: {
        info: {
            immediate: true,
            deep: true,
            handler(obj) {
                this.formData = obj;
                this.setLnglat(obj);
            }
        }
    },
    mounted() {},
    created() {},
    methods: {
        // 设置经纬的值
        setLnglat(obj) {
            const shape = obj.shape;
            let arr = [];
            if (shape === SHAPE.CIRCLE && obj.center) {
                const { lng, lat } = obj.center;
                arr = [[lng, lat] || []];
            }
            if (shape === SHAPE.RECTANGLE && obj.southWest && obj.northEast) {
                const { northEast = {}, southWest = {} } = obj;
                arr = [
                    [northEast.lng, northEast.lat],
                    [southWest.lng, southWest.lat]
                ];
            }
            if (shape === SHAPE.POLYGON && obj.path) {
                arr = obj.path || [];
            }
            const list = arr.map(item => {
                return item.join(',');
            });
            this.$set(this.formData, 'lnglat', list?.join('；'));
        },
        // 关闭弹框
        close() {
            this.$emit('cancel');
            this.formData = {};
        },
        // 确定
        handleConfirm() {
            this.$refs['formRef'].validate(valid => {
                if (valid) {
                    const obj = {
                        ...this.info,
                        ...this.formData
                    };
                    this.$emit('confirm', obj);
                    this.$refs['formRef'].resetFields();
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss">
.geofencing-box-wrap {
    width: 100%;
    padding: 10px 15px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #dcdfe6 !important;
    .box-footer {
        text-align: center;
    }
    .tip {
        color: #ccc;
        font-size: 13px;
        text-align: left;
        // margin: 10px auto;
    }
    // 覆盖原有样式
    .el-form-item {
        margin-bottom: 10px !important;
        .el-form-item__label {
            padding: 0px;
            width: 100%;
        }
        .el-form-item__content {
            line-height: 14px !important;
            .el-form-item__error--inline {
                margin-left: 0px;
                text-align: left;
                width: 100%;
            }
        }
    }
}
</style>
