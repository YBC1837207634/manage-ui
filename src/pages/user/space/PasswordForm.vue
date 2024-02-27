<template>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { updateUserPwd } from '@/api/system/user';

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.ruleForm.checkPass !== '') {
                this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                password: '',
                checkPass: ''
            },
            rules: {
                password: [
                    { required: true, validator: validatePass, trigger: 'blur',min: 1, max: 20 }
                ],
                checkPass: [
                    { required: true,  validator: validatePass2, trigger: 'blur',min: 1, max: 20 }
                ],
            }

        }
    },
    methods: {
        submit() {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    // 修改密码
                    updateUserPwd(this.ruleForm.password).then(res=>{
                        this.$message.success(res.data.msg)
                        this.$store.dispatch('user/Exit')
                    }).catch(error=>{
                        this.$message.error(error)
                    })
                } else {
                    return false;
                }
            });
        },
        reset() {
            this.$refs['ruleForm'].resetFields();
        }
    }
}
</script>

<style scoped></style>@/api/system/user