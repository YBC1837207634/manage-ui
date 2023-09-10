<template>
    <el-aside :width="asideWidth">
            <!-- 侧边菜单 -->
            <el-menu 
                class="el-menu-vertical-demo" 
                :collapse="$store.state.isCollapse"
                :collapse-transition="false"
                style="background-color: rgb(48, 65, 86) !important;"
                text-color="#fff"
                router
                active-text-color="#ffd04b"
                >
                <el-menu-item index="/index">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页</span>
                </el-menu-item>

            </el-menu>
        </el-aside>


</template>

<script>
    export default {
        data() {
            return {

            }
        },
        computed: {
            asideWidth() {
                return this.$store.state.isCollapse ? '66px': '180px'
            },
        }
    }
</script>

<style  scoped>
.el-aside {
    color: #333;
    overflow-x: hidden;
    background-color: rgb(48, 65, 86);
    box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
    z-index: 100;
    -webkit-transition: width .28s;
    transition: width .28s;
}

.submenu-overflow {
    overflow-x: hidden;
    width: 100%;
}

.el-menu {
    width: 100%;
}
</style>