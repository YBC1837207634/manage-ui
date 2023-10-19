<template>
    <div class="container">
        <div class="img">
            <img src="../../assets/404Img.svg" width="500">
        </div>
        <div class="info">
            <h1>404</h1>
            <h3>访问的页面不存在</h3>
            <el-button round type="primary" @click="goHome" size="medium">回到首页</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            goHome() {
                this.$router.replace('/index')
            }
        }
    }
</script>

<style scoped>
.container {
    padding: 20px 20px;
}
.img {
    display: flex;
    
}
.img > img {
    margin: auto;
}
.info {
    text-align: center;
}
/* .info {
    display: flex;
}
.info > * {
    margin: auto;
} */
</style>