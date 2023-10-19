<template>
    <div class="asideNav" :style="`width: ${asideWidth}`">
        <div class="logo">
           <img src="../../../assets/logo.svg" alt="logo" :width="this.$store.state.isCollapse ? '62px' : '80px'">
        </div>
        <el-scrollbar >
        <el-aside>
        
        <!-- 侧边菜单 -->
        <el-menu
            router
            :default-active="$store.getters.activeMenu"
            class="el-menu-vertical-demo"
            :collapse="$store.state.isCollapse"
            :collapse-transition="false"
            background-color="#001529"
            text-color="#fff"
            size="medium"
            active-text-color="#fff"
            >
            <el-menu-item index="/index">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <MenuItem :asideRouter="$store.getters.asideRouter"></MenuItem>
        </el-menu>
    </el-aside>
    </el-scrollbar>
    </div>
</template>

<script>
import MenuItem from './MenuItem';
export default {
    components: { MenuItem },
    computed: {
        asideWidth() {
            return this.$store.state.isCollapse ? '65px': '200px'
        },
        
    }
}
</script>

<style scoped>
.asideNav {
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: #001529;
    transition: width 0.33s;
    width: 200px;
    z-index: 1000;
    box-shadow: 3px 0 6px rgb(0 21 41 / 35%);
}
.logo {
    text-align: center;
    /* height: 80px; */
    background-color: rgb(0, 0, 0);
}

.el-menu-item {
    border-radius: 8px;
    /* margin: 0 4px; */
}
.is-active {
    border-radius: 8px;
    /* padding-left: 45px !important; */
    background-color: #1677ff !important ;
    margin: 0 5px ;
    transition: 0.5s 0s ease all;
}

.el-aside {
    color: #333;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: #001529;
    height: 100%;
    width: 100% !important;
}
.el-scrollbar {
    min-width: 200px;
    width: 100%;
}
/* .el-scrollbar__wrap {
    width: 200px;
} */

.el-menu {
    width: 100%;
}

@media (max-width: 900px) {
    .asideNav {
        /* position: fixed;
        visibility: hidden; */
        display: none;
    }
}
.icon {
    margin: auto;
}
</style>