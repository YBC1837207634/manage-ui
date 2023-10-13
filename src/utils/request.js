import axios from "axios"
import { getToken } from "./auth"
import code from '@/config/code'
import config from '@/config'
import { Message } from "element-ui"
import store from "@/store"

export default (function() {
  var req = axios.create({
    // baseURL: '/',
    baseURL: config.baseUrl,
    timeout: 10000,
  })

  req.interceptors.request.use(function (config){
    if (config.isToken && getToken()) {
      config.headers.token = getToken()
    }
    return config
  })

  req.interceptors.response.use((res) => {
      if (res.status != 200) {
        Message({type: 'error', message: "error"})
        return Promise.reject('error')
      }
      let state = res.data.code
      let msg = res.data.msg
      if (state === code.SUCCESS || res.data instanceof Blob) {
        return res
        // 登陆失效
      } else if (state === code.UNAUTHORIZED) { 
        // 防止多次退出
          if(store.getters.isLogin) {
            // removeToken()
            store.dispatch('user/Exit')
            // location.href = config.jumpLogin;
            Message({type: 'error', message: msg})
            // '令牌失效，请重新登录！'
          }
      }else if (state === code.FORBIDDEN) {
        Message({type: 'error', message: msg})
      } else {
          return Promise.reject(msg)
      } 
  })
  
  return req

}())

