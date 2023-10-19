import { getInfo, updateUserSpace } from "@/api/user"
import config from "@/config"
import { removeToken } from "@/utils/auth"
import { Message } from "element-ui"

const state = {
    userInfo: {},
    purview: [],
    isLogin: false,
    token: '',
    activeMenu: ''
}

const actions = {
    GetUserInfo({ commit }) {
        getInfo().then((response)=> {
            commit('SET_USERINFO', response.data.data)
            commit('SET_PURVIEW', response.data.data.purview)
        }).catch((error)=> {
            console.log(error);
        })
    },
    ClearUserInfo({ commit }) {
        commit('DELETE_USERINFO')
    },
    Exit({ commit, state }){
        removeToken()
        commit('DELETE_TOKEN')
        // 清除用户信息
        commit('DELETE_USERINFO')
        // 权限路由
        commit('permissions/REMOVE_ROUTER',null, {root:true})
        state.isLogin = false
        location.href = config.jumpLogin
    },
    UpdateAvatar({commit}, avatarUrl) {
        updateUserSpace({avatar: avatarUrl}).then(()=>{
            commit('UPDATE_AVATAR', avatarUrl)
            Message.success('头像更新成功！')
        }).catch(e=>console.error(e))
    }
}

const mutations = {
    SET_USERINFO(state, userData) {
        state.userInfo = userData
    },
    SET_TOKEN(state, token) {
        state.token = token
    },
    // 设置权限标识
    SET_PURVIEW(state, purview) {
        state.purview = purview
    },
    DELETE_USERINFO(state) {
        state.userInfo = {}
    },
    DELETE_PURVIEW(state) {
        state.purview = {}
    },
    DELETE_TOKEN(state) {
        state.token = ''
    },
    SET_LOGIN(state, is) {
        state.isLogin = is 
    },
    UPDATE_AVATAR(state, url) {
        state.userInfo.avatar = url
    },
    SET_ACTIVE_MENU(state, path) {
        state.activeMenu = path
    }
}


export default {
    namespaced: true,
    state,
    actions,
    mutations
}