import request from "@/utils/request";

// 登陆接口
export function login (username, password) {
    let data = {
        username,password
    }
    return request({
        method: 'post',
        url: '/login',
        data,
        isToken: false,
    })
}


// 注册接口
export function register(data) {
    return request({
        method: 'post',
        url: '/register',
        isToken: true,
        data
    })
}

// 用户信息接口
export function getInfo() {
    return request({
        method: 'get',
        url: '/getInfo',
        isToken: true,
        
    })
}

// 更新用户基本信息
export function updateUserSpace(data) {
    return request({
        method: 'put',
        url: 'system/user/space',
        isToken: true,
        data
    })

}

export function updateUserPwd(password) {
    return request({
        method: 'put',
        url: 'system/user/updatePwd',
        isToken: true,
        data: {
            password
        }
    })
}
