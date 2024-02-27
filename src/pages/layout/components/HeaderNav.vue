<template>
    <div style="height: 100%;">
        <!-- 头部上半部分  -->
        <div class="header-top clear-fiex clear-fiex">
            <span class="icon-click left-float" @click="asideSwith">
                <i :class="iconName" style="padding: 0px 15px; font-size: 20px;"></i>
            </span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="track, index in breadcrumb" :key="index"
                    :to="track.path == '/index' ? '/index' : ''">{{ track.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 右侧头像区域 -->
            <div class="top-right-item right-float">
                <span class="userName ">{{ userInfo.nickname }}</span>
                <!-- 右侧头像区域 -->
                <el-avatar :src="avatar" :size="42" shape="square" class="head-icon">
                </el-avatar>
                <!-- 下拉菜单 -->
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="$router.push('/user/space')">个人中心</el-dropdown-item>
                        <el-dropdown-item >设置</el-dropdown-item>
                        <el-dropdown-item @click.native="userExit" divided>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <!-- 头部下半部分 -->
        <div class="header-bottom">
            <div class="tags">
                <div v-for="tag, index in $store.getters.tags" :key="index" :class="'tag ' + `${$store.getters.currentTag === tag.path ? 'tag-active' : ''}`"
                    @click="$store.commit('permissions/SWITCH_TAG', tag)">
                    <div class="tag-content">
                        <span>{{ tag.title }}</span>
                        <i v-if="tag.path != '/index'" style="margin-left: 4px; font-size: 15px;" class="el-icon-close"
                            @click.stop="$store.commit('permissions/CLOSE_TAG', {tag, index})"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            iconStyle: {
                true: 'el-icon-s-unfold',
                false: 'el-icon-s-fold'
            },
            breadcrumb: [],
            tags: [{ name: 'Index', meta: { title: '首页' }, path: '/index' }],
            current: '/index',
        }
    },
    created() {
        // 更新面包屑导航
        this.UpdateBreadcrumb(this.$route)
        this.updateTagsNav(this.$route)
    },
    watch: {
        $route(route) {
            // 获取面包屑导航
            this.UpdateBreadcrumb(route)
            this.updateTagsNav(route)
        }
    },
    methods: {
        // 收缩侧边栏
        asideSwith() {
            this.$store.commit('asideSwitch')
        },
        userExit() {
            this.$store.dispatch('user/Exit').then(()=>{
                location.href = '/index'
            })
            this.$message({
                type: 'success',
                message: '已退出帐号!'
            })
        },
        // 更新面包屑导航
        UpdateBreadcrumb(route) {
            this.breadcrumb = [{ meta: { title: '首页' }, path: '/index' }]
            let first = route.matched[0].path;
            if (first && first.path != '') {
                this.breadcrumb = this.breadcrumb
                    .concat(route.matched.filter(e => e.meta && e.meta.title && e.meta.title != ''))
            }
        },
        updateTagsNav(route) {
            this.OpenTag({ name: route.name, path: route.path, title: route.meta.title, cache: route.meta.cache, params: route.params })
        },
        
        ...mapActions('permissions', ['OpenTag'])
    },
    computed: {
        iconName() {
            return this.iconStyle[this.$store.state.isCollapse]
        },
        avatar() {
            return this.userInfo?.avatar
        },
        ...mapState('user', ['userInfo']),
    }
}
</script>

<style scoped>
/* 头部区域 */
.header-top {
    height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.el-breadcrumb {
    float: left;
    line-height: 50px;
}

.header-bottom {
    padding: 2px 0;
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
}

.tags {
    height: 26px;
    display: flex;
}

.tag {
    margin-right: 5px;
    padding: 0 8px;
    border: 1px solid #d8dce5;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 26px;
    text-align: center;
    background: #fff;
    transition: all .4s, color .4s;
    border-radius: 3px;
}

.tag-active>.tag-content::before {
    content: "";
    background: #fff;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 2px;

}

.tag-active {
    display: flex;
    justify-content: center; /* 水平居中对齐 */
    align-items: center; /* 垂直居中对齐 */
    /* width: 100px; */
    /* background-color: #42b983; */
    color: #fff;
    border-color: #4a95ff;
    background-color: #4a95ff;
}   

.tag:hover {
    cursor: pointer;
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
    height: 50px;
}

@media (max-width: 300px) {
    .top-right-item {
        display: none;
    }
}</style>