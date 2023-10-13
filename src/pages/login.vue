<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <h2>登陆</h2>
            </div>
            <div class="form">
                <el-form :model="userForm" :rules="rules" ref='form' label-width="80px" hide-required-asterisk
                    @keyup.enter.native="send">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username" maxlength="30" prefix-icon="el-icon-user-solid" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password" style="margin-top: 30px;">
                        <el-input type="password" show-password v-model="userForm.password" maxlength="30"
                            prefix-icon="el-icon-key" />
                    </el-form-item>
                    <el-form-item style="margin-top: 30px; padding-right: 80px;">
                        <el-button type="primary" size="medium" @click="send" style="width: 120px;">登陆</el-button>
                        <el-button type="danger" size="medium" @click="register"
                            style="float: right; width: 120px;">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { login } from '@/api/user.js'
import { setToken } from '@/utils/auth'

export default {
    data() {
        return {
            userForm: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur', min: 1, max: 30 },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur', min: 1, max: 30 },
                ],
            }
        }
    },
    methods: {
       send() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                     login(this.userForm.username, this.userForm.password).then(res => {
                        setToken(res.data.token)
                        this.$message.success(res.data.msg)
                        this.$router.push('/index')
                    }).catch(error => {
                        this.$message.error(error);
                    })
                } else {
                    return false;
                }
            });
        },
        register() {
            this.$router.push('/register')
        },
        
    }
}
</script>
<style scoped>
.container {
    background: linear-gradient(to bottom right, #ff5f6d, #ffc371);
    position: relative;
    height: 100%;
    font-size: 18px;
}

.content {
    background-color: #fff;
    border-radius: 18px;
    position: absolute;
    width: 500px;
    height: 320px;
    min-width: 500px;
    min-height: 260px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    box-shadow: 0px 0 16px rgb(0 21 41 / 35%);
}

.head {
    text-align: center;
    margin-top: 40px;
}

.info {
    width: 60%;
    /* margin-top: 20px; */
    margin-bottom: 20px;
    margin-left: 10px;
}

.form {
    padding: 0 30px;
}

.confirm {
    text-align: center;
}

.button-w {
    width: 20em;
    /* margin-left: 1.5em; */
}
</style>