<template>
    <el-container class="container">
        <!-- 侧边菜单 -->
        <AsideNav></AsideNav>
        <el-scrollbar style="height: 100%; width: 100%;">
            <!-- 右半部分 -->
            <el-container class="right-item">
                <el-header height="80px">
                    <HeaderNav></HeaderNav>
                </el-header>
                <el-main class="clear-margin-padding main">
                    <transition name="fade-transform" mode="out-in">
                        <keep-alive :include="$store.state.permissions.caches">
                            <router-view></router-view>
                        </keep-alive>
                    </transition>
                </el-main>
            </el-container>
        </el-scrollbar>
    </el-container>
</template>

<script>
import AsideNav from './AsideNav.vue'
import HeaderNav from './HeaderNav'

export default {
    components: {
        AsideNav,
        HeaderNav
    },
    created: function () {
        this.$store.dispatch('user/GetUserInfo')
    },
}
</script>

<style scoped>
/* This only changes this particular animation duration */
.animate__animated.animate__bounce {
    --animate-duration: 1s;
}

.container {
    /* position: fixed; */
    font-size: 20px;
    height: 100%;
    width: 100%;
}

.el-header {
    background-color: #ffffff;
    padding: 0;
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    text-align: left;
    font-size: 20px !important;
}

.main {
    height: 100%;
    position: relative;
    min-height: calc(100vh - 80px);
    overflow: hidden;

}

/* fade-transform */
.fade-transform--move,
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all .3s;
}

.fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>