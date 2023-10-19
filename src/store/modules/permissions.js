import { getRouter } from "@/api/user"
import router, { basicRoutes, resetRouter } from "@/router"
import Layout from '@/pages/layout'
import ParentView from '@/components/ParentView';

const state = {
    // 动态路由
    dynamicRoutes: [],
    // 侧边栏路由
    asideNavRoutes: [],
    // 缓存组件名称
    caches: [],
    parentCache: []
}

const actions = {
    InitRoutes(context) {
        getRouter().then((response)=>{
            let dynamicRoutes = filterRouter(JSON.parse(JSON.stringify(response.data.data)))   
            let asideNavRoutes = filterRouter(JSON.parse(JSON.stringify(response.data.data)))  
            // 动态导入路由
            resetRouter(router)
            dynamicRoutes.push({path: '*', redirect: '/404'})
            dynamicRoutes.forEach(element => router.addRoute(element))
            context.commit('SET_DYNAMIC_ROUTES', dynamicRoutes)
            context.commit('SET_ASIDE_ROUTES', asideNavRoutes)
        }).catch((reason)=> {console.log(reason);})
    },
    RemoveCache(context, cacheName) {
        let index = context.state.caches.indexOf(cacheName);
        if (index != -1) {
            context.state.caches.splice(index, 1)
        } else {
            console.log("RemoveCache(context, cacheName) 出现错误");
        }
    },
    AddCache(context, cacheName) {
        if (!context.state.caches.some(i=> i === cacheName))
        context.commit('ADD_CACHE', cacheName)
    }
}

const mutations = {
    SET_DYNAMIC_ROUTES(state, dynamicRoutes) {
        state.dynamicRoutes = dynamicRoutes
    },
    SET_ASIDE_ROUTES(state, asideNavRoutes) {
        state.asideNavRoutes = asideNavRoutes
    },
    SET_CACHES(state, caches) {
        state.caches = caches
    },
    ADD_CACHE(state, cache) {
        state.caches.push(cache)
    },
    REMOVE_ROUTER(state) {
        state.dynamicRoutes = []
        // 侧边栏路由
        state.asideNavRoutes = []
        // 缓存组件名称
        state.caches = []
    }
}

// 将所有路由都进行组件的配置
function filterRouter(routes) {
    return filterChildren(routes).filter(route=>{
        if (route.component === 'Layout') {
            route.component = Layout
        } else if (route.component == "parentMenu") {
            route.component = ParentView
        } else if (route.component === null || route.component == '') {
            route.component = undefined
        } else {
             // 如果不是layout就动态导入
             route.component = loadView(route.component)
        }
        // 是否有子路由
        if (route.children != null && route.children && route.children.length) {
            // 递归子路由
            route.children = filterRouter(route.children)
        }
        // 是否需要缓存
        if (route.meta.cache && route.meta.cache != null && route.meta.cache != 0) {
            if (!state.caches.some(item=> item === route.name)) {
                state.caches.push(route.name)
            }
        }
        return true
    })
}

function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
      if (el.children && el.children.length) {
        if (el.component === 'ParentView' && !lastRouter) {
          el.children.forEach(c => {
            c.path = el.path + '/' + c.path
            if (c.children && c.children.length) {
              children = children.concat(filterChildren(c.children, c))
              return
            }
            children.push(c)
          })
          return
        }
      }
      if (lastRouter) {
        el.path = lastRouter.path + '/' + el.path
      }
      children = children.concat(el)
    })
    return children
  }


// 动态加载模块
function loadView (view) {
    if (process.env.NODE_ENV === 'development') {
        return (resolve) => require([`@/pages/${view}`], resolve)
    } else {
        // 使用 import 实现生产环境的路由懒加载
        return () => import(`@/pages/${view}`)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}