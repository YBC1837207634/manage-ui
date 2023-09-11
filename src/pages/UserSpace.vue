<template>
    <div class="main clear-fiex">
        <div class="left-item left-float">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="item-card-title">个人信息</span>
                </div>
                <!-- 头像 -->
                <div class="head">
                    <el-avatar :size="100" fit="fill" :src="avatar"></el-avatar>
                </div>
                <!-- 内容区 -->
                <ul class="list-group">
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>昵称</b>
                        <div class="right-float">{{ user.nickname }}</div>
                    </li>
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>用户名</b>
                        <div class="right-float">{{ user.username }}</div>
                    </li>
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>手机号码</b>
                        <div class="right-float">{{ user.phone }}</div>
                    </li>
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>用户邮箱</b>
                        <div class="right-float">{{ user.mail }}</div>
                    </li>
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>所属角色</b>
                        <div class="right-float">{{ user.role }}</div>
                    </li>
                    <li class="list-group-item clear-fiex">
                        <i class="el-icon-edit left-float"></i><b>创建日期</b>
                        <div class="right-float">{{ user.createTime }}</div>
                    </li>
                </ul>
            </el-card>

        </div>

        <div class="right-item left-float">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="item-title">卡片名称</span>
                </div>
                <el-tabs value="userinfo">
                    <el-tab-pane label="基本信息" name="userinfo">
                        <UserForm :user="user" />
                    </el-tab-pane>
                    <el-tab-pane label="修改密码" name="resetPwd">
                        <PasswordForm />
                    </el-tab-pane>
                </el-tabs>
            </el-card>

        </div>


    </div>
</template>

<script>
import UserForm from '@/components/UserForm';
import PasswordForm from '@/components/PasswordForm';
import { getInfo } from '@/api/user';
import code from '@/config/code';
import config from '@/config';

export default {
    components: {
        UserForm, 
        PasswordForm
    },
    data() {
        return {
            user: {}
        }
    },
    created() {
        getInfo().then((response) => {
            if (response.data.code === code.SUCCESS) {
                this.user = response.data.data
            } else {
                console.warn('获取用户信息失败！' + response.status + response.data);
            }
        }).catch((error) => {
            console.warn(error);
        })
    },
    computed: {
        avatar() {
            return this.user.avatar || config.headImg
        },
    },
}
</script>

<style scoped>
.main {
    padding: 20px;
    /* width: 100%; */
    overflow-y: auto;
    font-size: 13px;

}

.left-item {
    width: 25%;
    padding-right: 20px;
    box-sizing: border-box;
}

.right-item {
    width: 75%;
}

.item {
    border-bottom: 1px black solid;
}

.clearfix {
    padding: 0;
}

.item-card-title {
    font-size: 16px;
}

/* 个人信息卡片 */
.head {
    text-align: center;
}

.list-group {
    display: block;
    padding: 0;
    list-style: none;
}

.list-group:last-child {
    border-bottom: 1px solid #e7eaec;
}

.list-group-item {
    padding: 10px 0;
    border-top: 1px solid #e7eaec;
}
</style>