<template>
    <div class="main">
        <div class="container" id="container" ref="container">
            <div class="form-container sign-up">
                <el-form 
                    v-if="!isLogin"
                    :model="registerForm" 
                    :rules="registerRules" 
                    ref='regitserF' 
                    >
                    <!-- 图标 -->
                    <div class="social-icons">
                        <!-- <a href="#" class="icon">
                            <i class="fa-brands fa-google-plus-g"></i>
                        </a> -->
                    </div>
                    <el-form-item  prop="username" style="width: 304px;">
                        <input type="text" placeholder="帐号" v-model="registerForm.username" maxlength="30" >
                    </el-form-item>
                    <el-form-item prop="password" style="width: 304px;">
                        <input type="password" placeholder="密码" v-model="registerForm.password" maxlength="20" >
                    </el-form-item>
                    <el-form-item prop="checkPass" style="width: 304px;">
                        <input type="password" placeholder="再次输入密码" v-model="registerForm.checkPass" maxlength="20" >
                    </el-form-item>
                    <el-form-item>
                        <button @click.prevent="registerSend">注册</button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 登录 -->
            <div class="form-container sign-in">
                <el-form 
                    v-if="isLogin"
                    :model="userForm" 
                    :rules="rules" 
                    ref='form' 
                    hide-required-asterisk 
                    >
                    <el-form-item  prop="username" style="width: 304px;">
                        <input type="text" placeholder="帐号" v-model="userForm.username" maxlength="30">
                    </el-form-item>
                    <el-form-item  prop="password" style="width: 304px;">
                        <input type="password" placeholder="密码" v-model="userForm.password" maxlength="20" autocomplete>
                    </el-form-item>
                    <el-form-item>
                        <button @click.prevent="loginSend">登录</button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 登录注册切换 -->
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">
                        <h1>创建账号</h1>
                        <p>输入您的个人详细信息以使用网站的所有功能</p>
                        <button class="hidden" id="login" @click="checkLogin">登录</button>
                    </div>
                    <div class="toggle-panel toggle-right">
                        <h1>用户登录</h1>
                        <p>填写账号信息登录网站</p>
                        <button class="hidden" id="register" @click="checkRegister">注册</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { login, register } from '@/api/user.js'
import { setToken } from '@/utils/auth'

export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
            if (this.registerForm.checkPass !== '') {
                this.$refs.form.validateField('checkPass');
            }
            callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            isLogin: true,
            userForm: {
                username: '',
                password: '',
            },
            registerForm: {
                username: '',
                password: '',
                checkPass: ''
            },
            rules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur', min: 1, max: 30 },
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur', min: 1, max: 20 },
                ],
            },
            registerRules: {
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur', min: 1, max: 30 },
                ],
                password: [
                    { required: true, validator: validatePass, trigger: 'blur', min: 1, max: 20 }
                ],
                checkPass: [
                    { required: true,  validator: validatePass2, trigger: 'blur',min: 1, max: 20 }
                ],
            }
        }
    },
    methods: {
        loginSend() {
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
        registerSend() {
            this.$refs['regitserF'].validate((valid) => {
                if (valid) {
                    register(this.registerForm).then(res=>{
                        this.$message.success(res.data.msg)
                        this.checkLogin()
                        this.registerForm = {}
                    }).catch(error=>{
                        this.registerForm = {}
                        this.$message.error(error)
                    }) 
                } else {
                    return false;
                }
            });   
        },
        checkRegister() {
            this.isLogin = false
            // this.$router.push('/register')
            this.$refs['container'].classList.add('active')
        },
        checkLogin() {
            this.isLogin = true
            this.$refs['container'].classList.remove('active')
        }

    }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.main {
    font-family: 'Montserrat', sans-serif;
    background-color: #c9d6ff;
    background: linear-gradient(to right, #e2e2e2, #c9d6ff);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
}

.container {
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, .35);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
}

.container p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    margin: 20px 0;
}

.container span {
    font-size: 12px;
}

.container a {
    color: #333;
    font-size: 13px;
    text-decoration: none;
    margin: 15px 0 10px;
}

.container button {
    background-color: #512da8;
    color: #fff;
    font-size: 12px;
    padding: 10px 45px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-top: 10px;
    cursor: pointer;
}

.container button.hidden {
    background-color: transparent;
    border-color: #fff;
}


.container form {
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 40px;
    height: 100%;
}

.container input {
    background-color: #eee;
    border: none;
    margin: 8px 0;
    padding: 10px 15px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
    outline: none;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all .6s ease-in-out;
}

.sign-in {
    left: 0;
    width: 50%;
    z-index: 2;
}

.container.active .sign-in {
    transform: translateX(100%);
}

.sign-up {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
}

.container.active .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: move .6s;
}

@keyframes move {

    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }

    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}

.social-icons {
    margin: 20px 0;
}

.social-icons a {
    border: 1px solid #ccc;
    border-radius: 20%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 3px;
    width: 40px;
    height: 40px;
}

.toggle-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all .6s ease-in-out;
    border-radius: 150px 0 0 100px;
    z-index: 1000;
}

.container.active .toggle-container {
    transform: translateX(-100%);
    border-radius: 0 150px 100px 0;
}

.toggle {
    background-color: #512da8;
    height: 100%;
    background: linear-gradient(to right, #5c6bc0, #512da8);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: all .6s ease-in-out;
}

.container.active .toggle {
    transform: translateX(50%);
}

.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 30px;
    text-align: center;
    top: 0;
    transform: translateX(0);
    transition: all .6s ease-in-out;
}

.toggle-left {
    transform: translateX(-200%);
}

.container.active .toggle-left {
    transform: translateX(0);
}

.toggle-right {
    right: 0;
    transform: translateX(0);
}

.container.active .toggle-right {
    transform: translateX(200%);
}

.el-form-item {
    margin: 10px 0 !important; 
}
</style>