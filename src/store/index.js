import Vue from "vue";
import Vuex from 'vuex';
import permissions from "./modules/permissions";
import user from "./modules/user";
import getters from "./getters";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      isCollapse: false,   // 侧边栏是否折叠
    },
    actions: {

    },
    mutations: {
      asideSwitch(state) {
        state.isCollapse = !state.isCollapse
      },

    },
    getters,
    modules: {
      permissions,
      user,
    }
  })

export default store;
