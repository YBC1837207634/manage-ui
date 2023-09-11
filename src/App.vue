<template>
  <div id="app" class="full-screen">
    <keep-alive include="Layout">   
        <router-view></router-view>
    </keep-alive>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>

export default {
    name: 'App',
}
</script>

<style>


</style>
