import axios from "axios"
import { getToken } from "./auth"
import code from '@/config/code'
import config from '@/config'
import ElementUI from "element-ui"

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
      // 登陆失效
      if (res.data.code === code.UNAUTHORIZED) {
        sessionStorage.removeItem("token")
        location.href = config.jumpLogin;
        ElementUI.Message({
          type: 'error',
          message: '令牌失效，请重新登录！'
        })
        return null
      } 
      return res
  })
  return req

}())

