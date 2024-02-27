import { getRouter } from "@/api/system/user"
import router, { resetRouter } from "@/router"
import Layout from '@/pages/layout'
import ParentView from '@/components/ParentView';

const state = {
    // 动态路由
    dynamicRoutes: [],
    // 侧边栏路由
    asideNavRoutes: [],
    // 缓存组件名称
    caches: [],
    parentCache: [],
    tags: [{ name: 'Index',  title: '首页' , path: '/index' }],
    currentTag: '/index'
}

const actions = {
    InitRoutes(context) {
        getRouter().then((response)=>{
            let dynamicRoutes = filterRouter(JSON.parse(JSON.stringify(response.data.data)))   
            let asideNavRoutes = filterRouter(JSON.parse(JSON.stringify(response.data.data)))  
            // 重置路由
            resetRouter(router)
            // 动态导入路由
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
        context.commit('ADD_CACHE', cacheName)
    },
    // 打开一个页签
    OpenTag({ commit }, route) {
        commit('ADD_TAG', route)
    },
    // 关闭页签
    CloseTag({ commit, state }, tag) {
        var i = 0;
        state.tags.forEach((item, index)=> {
            if (item.path === tag.path) {
                i = index
                return ;
            }
        })
        commit('CLOSE_TAG', {tag, index: i})
    },
    // 切换标签
    SwitchTag({ commit }, tag) {
        commit('SWITCH_TAG', tag)
    },
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
        if (!state.caches.some(i=> i === cache))
            state.caches.push(cache)
    },
    REMOVE_CHCHE(state, name) {
        let index = state.caches.indexOf(name);
        if (index != -1) {
            state.caches.splice(index, 1)
        } else {
            console.log("RemoveCache(context, cacheName) 出现错误");
        }
    },
    REMOVE_ROUTER(state) {
        state.dynamicRoutes = []
        // 侧边栏路由
        state.asideNavRoutes = []
        // 缓存组件名称
        state.caches = []
    },
    ADD_TAG(state, tag) {
        if (tag.path === '/login') return 
        // 如果当前页签列表中没有页签就添加进去
        if (!state.tags.some(e => e.path === tag.path)) {
            state.tags.push(tag)
            if (tag.cache && tag.cache != null && tag.cache != 0) {
                this.commit('permissions/ADD_CACHE', tag.name)
            }
        }
        // 当跳转路由时切换页签。
        // state.currentTag = path
        this.commit('permissions/SWITCH_TAG', tag)
    },
    SWITCH_TAG(state, tag) {
        // 避免多次点击
        if (state.currentTag != tag.path) {
            // 切换显示焦点
            state.currentTag = tag.path
             // 切换路由
            if (tag.params && tag.params != null) {
                router.push({name: tag.name, params: tag.params})
            } else {
                router.push(tag.path)
            }
        }
    },
    CLOSE_TAG(state, payload) {
        // 判断需要关闭的标签path是否是当前已经选中的标签
        if (payload.tag.path == state.currentTag) {
            if (payload.index == 0) {
                return 
            }
            // this.switchTag(this.tags[index - 1])    
            this.commit('permissions/SWITCH_TAG', state.tags[payload.index-1])
        }
        // 如果要关闭的页签是缓存的就删除该缓存
        if (payload.tag.cache && payload.tag.cache != null && payload.tag.cache === 1) {
            // 将关闭的组件移除缓存
            this.commit('permissions/REMOVE_CHCHE', payload.tag.name)
        }
        state.tags.splice(payload.index, 1)

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
    childrenMap.forEach((el) => {
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