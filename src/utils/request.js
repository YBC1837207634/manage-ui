import axios from "axios"
import { getToken } from "./auth"
import code from '@/config/code'
import config from '@/config'
import { Message } from "element-ui"
import store from "@/store"
import { tansParams } from "./commonUtils"

function createRequest(baseUrl = config.baseUrl) {
  var req = axios.create({
    // baseURL: '/',
    baseURL: baseUrl,
    timeout: 10000,
  })
  req.interceptors.request.use(function (config){
    
    if (config.isToken && getToken()) {
      config.headers.token = getToken()
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
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
            store.dispatch('user/Exit').then(()=>{
              location.href = '/login';
            })
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

}

export default createRequest(config.baseUrl)

