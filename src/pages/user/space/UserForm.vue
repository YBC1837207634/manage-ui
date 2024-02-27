<template>
    <!-- 用户信息表单 -->
    <el-form :model="user" :rules="rules" ref='form' label-width="80px">
        <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="user.nickname" maxlength="30" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
            <el-input v-model="user.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="user.mail" maxlength="50" />
        </el-form-item>
        <el-form-item label="性别">
            <el-radio-group v-model="user.gender">
                <el-radio :label="'男'">男</el-radio>
                <el-radio :label="'女'">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
            <el-button type="danger" size="mini" @click="close">关闭</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { updateUserSpace } from '@/api/system/user';

export default {
    props: ['user'],
    data() {
        return {
            rules: {
                nickname: [
                    { required: true, message: '长度不能低于一个字符', trigger: 'blur', min: 1, max: 30},
                ],
            }
        }
    },
    methods: {
        // 提交表单
        submit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    updateUserSpace(this.user).then((response) => {
                        this.$message({
                            type: 'success',
                            message: response.data.msg
                        })
                        // location.reload()
                        //     // 更新失败
                    })
                    .catch((error) => {
                        this.$message.error(error)
                    })
                } else {
                    return false;
                }
            });
        },
        close() {
            this.$router.push('/index')
        }
    }
}
</script>

<style scoped></style>@/api/system/user