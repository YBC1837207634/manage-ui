<template>
    <div class="main clear-fiex">
        <div class="left-item left-float">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span class="item-card-title">个人信息</span>
                </div>
                <!-- 头像 -->
                <el-upload class="avatar-uploader head" 
                    action="http://localhost:8080/file/upload"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="avatar" :src="avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
                        <i class="el-icon-edit left-float"></i><b>性别</b>
                        <div class="right-float">{{ user.gender }}</div>
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
import { mapActions } from 'vuex';
import UserForm from './UserForm';
import PasswordForm from './PasswordForm';
import { userSpace } from '@/api/user';

export default {
    components: {
        UserForm,
        PasswordForm
    },
    data() {
        return {
            user: {},
        }
    },
    created() {
        userSpace().then((response) => {
            this.user = response.data.data
        }).catch((error) => {
            console.error(error);
        })
    },
    computed: {
        avatar() {
            return this.user.avatar
        },
    },
    methods: {
        handleAvatarSuccess(res) {
            if (res.code === 200 && res.msg && res.msg != null) {
                this.user.avatar = res.msg;
                this.UpdateAvatar(res.msg)
            } else {
                this.$message.error('头像更新失败！');
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 5MB!');
            }
            return isJPG && isLt2M;
        },
        ...mapActions('user', ['UpdateAvatar'])
    }
}
</script>

<style scoped>
.main {
    /* padding: 20px; */
    font-size: 14px;
}

.left-item {
    width: 25%;
    min-width: 200px;
    padding-right: 20px;
    box-sizing: border-box;

}

.right-item {
    width: 75%;
    min-width: 180px;
    /* min-width: 300px; */
    box-sizing: border-box;

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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    border-radius: 360px;
    width: 120px;
    display: block;
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