<template>
    <div>
        <!-- 头部上半部分  -->
        <div class="header-top clear-fiex">
            <span class="icon-click">
                <i :class="iconName" style="padding: 0px 15px; font-size: 20px;" @click="asideSwith"></i>
            </span>

            <!-- 右侧头像区域 -->
            <div class="top-right-item right-float">
                <span class="userName ">{{ nickname }}</span>
                <!-- 右侧头像区域 -->
                <el-avatar :src="headImage" :size="50" shape="square" class="head-icon">
                </el-avatar>
                <!-- 下拉菜单 -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="space">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="out" divided>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

            </div>
        </div>

        <!-- 头部下半部分 -->
        <div class="header-bottom">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>


            </el-breadcrumb>
        </div>
    </div>
</template>

<script>
import config from '@/config'

export default {
    props: {
        userInfo: Object
    },
    data() {
        return {
            iconStyle: {
                true: 'el-icon-s-unfold',
                false: 'el-icon-s-fold'
            },
        }
    },
    methods: {
        // 收缩侧边栏
        asideSwith() {
            this.$store.commit('asideSwitch')
        },
        handleCommand(value) {
            if (value === 'out') {
                this.userExit()
            } else if (value === 'space') {
                this.$router.push('/user/space')
            }
        },
        userExit() {
            sessionStorage.removeItem('token')
            this.$router.replace('/login')
            this.$message({
                type: 'success',
                message: '已退出帐号!'
            })
        }
    },
    computed: {
        iconName() {
            return this.iconStyle[this.$store.state.isCollapse]
        },
        headImage() {
            return this.userInfo.image || config.headImg
        },
        nickname() {
            return this.userInfo.nickname
        }
    }
}
</script>

<style scoped>


/* 头部区域 */
.header-top {
    height: 60px;
    line-height: 60px;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
}

.header-bottom {
    padding-top: 10px;
    padding-left: 10px;
}

.icon-click:hover {
    cursor: pointer;
    background-color: rgba(224, 224, 224, 0.651);
    transition: background-color .3s, color .3s;
    float: left;
}

.head-icon {
    border: 1px black solid;
    margin-top: 4px;
    /* margin-right: 5px; */
}

.el-icon-arrow-down {
    font-size: 16px;
    margin-right: 10px;

}

.el-dropdown {
    line-height: 0;
}

.userName {
    font-size: 14px;
    padding-right: 10px;
}

.top-right-item {
    height: 60px;
}</style>