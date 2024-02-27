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

// 用户空间接口
export function userSpace() {
    return request({
        method: 'get',
        url: '/system/user/space',
        isToken: true,
    })
}

// 用户权限路由表
export function getRouter() {
    return request({
        method: 'get',
        url: '/getRouter',
        isToken: true
    })
}


// 更新用户自己基本信息
export function updateUserSpace(data) {
    return request({
        method: 'put',
        url: '/system/user/space',
        isToken: true,
        data
    })

}

// 修改密码
export function updateUserPwd(password) {
    return request({
        method: 'put',
        url: '/system/user/updatePwd',
        isToken: true,
        data: {
            password
        }
    })
}

// 新增用户
export function saveUser(data) {
    return request({
        method: 'post',
        url: 'system/user',
        isToken: true,
        data
    })
}

// 修改用户基本信息
export function updateUser(data) {
    return request({
        method: 'put',
        url: 'system/user',
        isToken: true,
        data
    })
}

// 通过用户id
export function geyUserById(id) {
    return request({
        method: 'get',
        url: `system/user/${id}`,
        isToken: true
    }) 
}

// 分页查询
export function pages(params) {
    return request.request({
        method: 'get',
        url: 'system/user/list',
        isToken:true,
        params
    })
}

// 删除用户
export function remove(ids) {
    return request.request({
        method: 'delete',
        url: `system/user/${ids}`,
        isToken:true,
    })
}

// 导出用户
export function exportUser() {
    return request.request({
        method: 'get',
        url: 'system/user/export',
        isToken:true,
        responseType: 'blob',
    })
}