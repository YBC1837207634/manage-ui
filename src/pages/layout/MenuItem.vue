<template>
    <div class="left-menu">
        <template v-for="(route, index) in asideRouter" >
            <!-- && route.children.length > 0) || (route.redirect && route.redirect === 'noRedirect') -->
            <el-submenu
                v-if="(route.meta.aside === true && route.children && route.children != null)"  
                :index="route.path"
                :key="index + route.path"
                >
                <template slot="title">
                    <i :class="route.meta.icon"></i>
                    <span>{{ route.meta.title }}</span>
                </template>
                <MenuItem :asideRouter="route.children" :parentPath="route.path"></MenuItem>
            </el-submenu>
            <el-menu-item 
                v-else-if="route.meta.aside === true"
                :index="parentPath + '/' + route.path"
                :key="index + route.path"
                >
                <i :class="route.meta.icon"></i>
                <span slot="title">{{ route.meta.title }}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
    export default {
        name:'MenuItem',
        props: {
            asideRouter: Array,
            parentPath: {
                type: String,
                default: ''
            }
        }
    }
</script>

<style scoped>

.left-menu {
    /* width: 200px !important; */
    background-color: #000c17 ;
}
.el-menu-item {
    background-color: #000c17 !important ;
    border-radius: 8px;
    min-width: 180px !important;
    /* margin-top: 4px !important; */
}

.is-active {
    border-radius: 8px;
    margin: 0 5px !important;
    background-color: #1677ff !important ;
    transition: 0.5s 0s ease all;
}
.el-submenu__title {
    margin: 0 5px;
}
.el-submenu {
    margin: 0 !important; 
}
</style>