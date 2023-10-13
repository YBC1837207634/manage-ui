<template>
    <div style="height: 100%;">
        <!-- 头部上半部分  -->
        <div class="header-top clear-fiex clear-fiex">
            <span class="icon-click left-float" @click="asideSwith">
                <i :class="iconName" style="padding: 0px 15px; font-size: 20px;"></i>
            </span>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item> -->
                <el-breadcrumb-item v-for="track, index in breadcrumb" :key="index"
                    :to="track.path == '/index' ? '/index' : ''">{{ track.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 右侧头像区域 -->
            <div class="top-right-item right-float">
                <span class="userName ">{{ userInfo.nickname }}</span>
                <!-- 右侧头像区域 -->
                <el-avatar :src="userInfo.avatar" :size="42" shape="square" class="head-icon">
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

            <div class="tags">
                <div v-for="tag, index in tags" :key="index" :class="'tag ' + `${current === tag.name ? 'tag-active' : ''}`"
                    @click="switchTag(tag)">
                    <div class="tag-content">
                        <span>{{ tag.meta.title }}</span>
                        <i v-if="tag.path != '/index'" style="margin-left: 4px; font-size: 15px;" class="el-icon-close"
                            @click.stop="closeTag(tag, index)"></i>
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
            tags: [],
            current: 'Index',
        }
    },
    created() {
        // 更新面包屑导航
        this.UpdateBreadcrumb(this.$route)
        // 
        this.tags.push({ name: 'Index', meta: { title: '首页' }, path: '/index' })
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
        handleCommand(value) {
            if (value === 'out') {
                this.userExit()
            } else if (value === 'space') {
                this.$router.push('/user/space')
            }
        },
        userExit() {
            this.$store.dispatch('user/Exit')
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
            // 如果当前页签列表中没有页签就添加进去
            if (!this.tags.some(e => e.path === route.path)) {
                this.tags.push(route)
                if (route.meta.cache && route.meta.cache != null && route.meta.cache != 0)
                    this.AddCache(route.name)
            }
            // 当跳转路由时切换页签。
            this.current = route.name
        },
        switchTag(tag) {
            // 避免多次点击
            if (this.current != tag.name) {
                // 切换显示焦点
                this.current = tag.name
                // 切换路由
                this.$router.replace(tag.path)
            }
        },
        closeTag(tag, index) {
            if (tag.fullPath == this.$route.fullPath) {
                this.switchTag(this.tags[index - 1])
            }
            // 将关闭的组件移除缓存
            this.RemoveCache(tag.name)
            this.tags.splice(index, 1)
        },
        ...mapActions('permissions', ['RemoveCache', 'AddCache'])
    },
    computed: {
        iconName() {
            return this.iconStyle[this.$store.state.isCollapse]
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
    /* box-shadow: 2px 0 6px rgb(0 21 41 / 35%); */
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.el-breadcrumb {
    float: left;
    line-height: 50px;
}

.header-bottom {
    /* padding-top: 10px; */
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

.tags {
    height: 30px;
    display: flex;
    /* background-color: rgb(15, 249, 2); */
}

.tag {
    height: 30px;
    /* background-color: aquamarine; */
    margin-right: 5px;
    padding: 0 8px;
    /* padding: 12px 16px; */
    /* border-radius: 8px 8px 0 0; */
    border: black 1px solid;
    box-sizing: border-box;
    font-size: 15px;
    line-height: 30px;
    text-align: center;
    background: rgba(0, 0, 0, 0.02);
    transition: all .4s, color .4s;
}

.tag-active>.tag-content::before {
    content: "";
    background: #000000;
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
    margin-right: 2px;
}

.tag-active {
    /* width: 100px; */
    background-color: #67C23A;
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