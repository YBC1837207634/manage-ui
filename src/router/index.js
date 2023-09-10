import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth';
import Layout from '@/pages/Layout'

/**
 * 
 *  路由配置
 *  noAuth： true 不需要验证
 * 
 */
const routes = [
    {
        path: '',
        redirect: '/index',
        component: ()=> import('@/pages/Layout'),
        meta: {isAuth: true},
        children: [
            {
                path: 'index', 
                name: '默认页',
                component: () => import('@/pages/DefaultPage'), 
                meta: {}
            },
            // {path: 'chatRoom', component: ChatRoom, meta: {isAuth: true}}
            
        ]
    },
    
    {
        path: '/404',
        name: '404',
        component: () => import('@/pages/NotFound'),
        meta: {}
    },

    {
        path: '/login',
        name: '登陆',
        meta: {noAuth: true},
        component: () => import('@/pages/LoginPage')
    },
    {
        path: '/register',
        name: '注册',
        meta: {noAuth: true},
        component: () => import('@/pages/RegisterPage')

    },
    {
        path: '/user',
        redirect: '/404',
        component: Layout,
        meta: {},
        children: [
            {
                path: 'space',
                component: () => import('@/pages/UserSpace'),
                meta: {}
            }
        ]
    },
    {
        path: '/system',
        name: 'System',
        component: Layout,
        redirect: '/404',
        meta: {}
    },

    /* 解决hash 白屏 */
    {
        path: '*',
        redirect: '/index'
    }
]


var router = new VueRouter({
    routes
}) 

// 防止重复点击路由 
let routerPush = VueRouter.prototype.push;
// push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

// 全局前置路由守卫
router.beforeEach((to, from, next)=>{
    if (to.meta.noAuth == undefined || to.meta.noAuth == null || to.meta.noAuth == false) {
        let token = getToken()
        if (token == null || token =='') {
            next({replace: true, path: '/login'})
        } 
    } 
    next()
})

/* 配置路由 */
export default router