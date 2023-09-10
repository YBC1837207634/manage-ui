<template>
    <el-container class="container">
        <!-- 侧边菜单 -->
        <AsideNav></AsideNav>
        <!-- 右半部分 -->
        <el-container class="right-item">
            <el-header>
                <HeaderNav :userInfo="userInfo"></HeaderNav>
            </el-header>
            <el-main class="clear-margin-padding">          
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AsideNav from '@/components/AsideNav'
import HeaderNav from '@/components/HeaderNav'
import { getInfo } from '@/api/user'
import code from '@/config/code'

export default {
    components: {
        AsideNav,
        HeaderNav
    },
    data() {
        return {
            userInfo: {}
        }
    },
    created: async function() {
        await getInfo().then((response)=> {
            if (response.data.code === code.SUCCESS) {
                this.userInfo = response.data.data
            } else {
                console.warn('获取用户信息失败！'+ response.status);
            }
        }).catch((error)=> {
            console.warn(error);
        })
    },
    
}
</script>

<style scoped>
.container {
    position: fixed;
    font-size: 20px;
    height: 100%;
    width: 100%;
}

.el-header {
    background-color: #ffffff;
    padding: 0;
    color: #333;
    border-bottom: rgb(53, 53, 53) 0.5px solid;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    text-align: left;
    font-size: 20px !important;
    height: 90px !important;

}
/* .el-menu .el-menu-item.is-hover{
    background-color: rgba(224, 224, 224, 0.651);
    transition: background-color .3s,color .3s;
} */
</style>