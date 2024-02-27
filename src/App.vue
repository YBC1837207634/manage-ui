<template>
  <div id="app" class="full-screen">
    <keep-alive include="Layout">   
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>


export default {
    name: 'App',
}
</script>

<style>

/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
    display: none;
}
/*隐藏 > */
.el-menu--collapse  .el-icon-arrow-right {
    display: none;
}

.el-scrollbar__wrap {
  overflow-x: hidden ; 
}



</style>
