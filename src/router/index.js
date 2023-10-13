import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth';
import Layout from '@/pages/layout'
import store from '@/store';

/**
 * 
 *  路由配置
 *  noAuth： true 不需要验证
 * 
 */
export const basicRoutes = [
    {
        path: '',
        redirect: '/index',
        component: ()=> import('@/pages/layout'),
        meta: {isAuth: true, aside: false},
        children: [
            {
                path: 'index', 
                name: 'Index',
                component: () => import('@/pages'), 
                meta: {aside: true, title: '首页', cache: 1}
            },
        ]
    },
    
    {
        path: '/404',
        name: '404',
        component: () => import('@/pages/error/404'),
        meta: {aside: false,}
    },

    {
        path: '/login',
        name: '登陆',
        meta: {noAuth: true, aside: false},
        component: () => import('@/pages/login')
    },
    {
        path: '/register',
        name: '注册',
        meta: {noAuth: true, aside: false},
        component: () => import('@/pages/register')

    },
    {
        path: '/user',
        redirect: 'noRedirect',
        component: Layout,
        meta: {aside: false},
        children: [
            {
                path: 'space',
                component: () => import('@/pages/user/space'),
                meta: {aside: false, title: '个人中心'}
            }
        ]
    },
]

// 防止重复点击路由 
let routerPush = VueRouter.prototype.push;
let routerReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(err => err)
}
VueRouter.prototype.replace = function Replace(location) {
    return routerReplace.call(this, location).catch(err => console.log(err))
}

// 创建路由实例
var router = new VueRouter({
    routes: basicRoutes
}) 


// 全局前置路由守卫
router.beforeEach((to, from, next)=>{
    // 已经登陆
    if (getToken()) {
        // 加载动态路由
        if (!store.state.user.isLogin) {
            store.state.user.isLogin = true
            store.commit('user/SET_TOKEN', getToken())
            store.dispatch('permissions/InitRoutes')  
        }
        // 重定向到主页
        if (to.path == '/login') {
            next({replace: true, path: '/index'})
        } else {
            next()
        }
        // 没有登陆
    } else {
        // 所去的路由需要登陆
        if (to.meta.noAuth == undefined || to.meta.noAuth == null || to.meta.noAuth == false) {
            let token = getToken()
            if (token == null || token =='') {
                next({replace: true, path: '/login'})
            } 
        } else {
            // 不需要登陆
            next()
        }
    }
    
})

/* 配置路由 */
export default router

// 重置路由
let createRouter = () => new VueRouter({
    routes: basicRoutes, // 路由路径
    scrollBehavior: () => ({ y: 0 }) // 在切换时定位路由滚动条的位置
});
  
  
export function resetRouter (router) { //清空路由的方法
    const newRouter = createRouter()
    router.matcher = newRouter.matcher 
}
