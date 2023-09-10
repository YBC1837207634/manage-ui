import Vue from "vue";
import Vuex from 'vuex';



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
    getters: {

    }
  })

export default store;
