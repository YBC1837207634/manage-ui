<template>
    <div class="container">
        <div class="content">
            <div class="head">
                <h2>登陆</h2>
            </div>
            <div class="form">
                <el-form :model="userForm" :rules="rules" ref='form' label-width="80px" 
                    @keyup.enter.native="send">
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="userForm.nickname" maxlength="30" prefix-icon="el-icon-user-solid" />
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username" maxlength="30" prefix-icon="el-icon-user-solid" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password" >
                        <el-input type="password" show-password v-model="userForm.password" maxlength="30"
                            prefix-icon="el-icon-key" />
                    </el-form-item>
                    <el-form-item style="padding-right: 80px;">
                        <el-button type="primary" size="medium" @click="send" style="width: 120px;">注册</el-button>
                        <el-button type="danger" size="medium" @click="back"
                            style="float: right; width: 120px;">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { register } from '@/api/user'
import code from '@/config/code'

export default {
    data() {
        return {
            userForm: {
                username: '',
                password: '',
                nickname: ''
            },
            rules: {
                nickname: [
                    { required: true, message: '昵称不能为空', trigger: 'blur', min: 1, max: 30 },
                ],
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
        back() {
            this.$router.push('/login')
        },
        send() {
            register(this.userForm).then(res=>{
                if(res.data.code === code.SUCCESS) {
                    this.$message.success(res.data.msg)
                    this.$router.replace('/login')
                    // 注册失败或是该用户已经被注册
                } else if (res.data.code === code.WARN) {
                    if (res.data.msg == '约束冲突') {
                        this.$message.error('用户名已存在')
                    }
                    console.log(res.data.msg);
                }
            }).catch(error=>{
                console.error(error.message);
            }) 
        }
    }
}
</script>

<style scoped>
.container {
    /* background-color: aquamarine; */
    background-image: url("../assets/r.jpg");
    background-size: cover;
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
    box-shadow: 0px 0 16px 1px rgb(0 21 41 / 35%);
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