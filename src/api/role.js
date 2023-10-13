import request from "@/utils/request";

// 角色列表接口
export function getRoleList (params) {
    return request({
        method: 'get',
        url: '/system/role/list',
        isToken: true,
        params
    })
}

export function getRole(id) {
    return request({
        method: 'get',
        url: `/system/role/${id}`,
        isToken: true,
    })
}

// 更新角色
export function updateRole(data) {
    return request({
        method: 'put',
        url: '/system/role',
        isToken: true,
        data
    }) 
}

// 删除角色
export function removeRole(ids) {
    return request.request({
        method: 'delete',
        url: `system/role/${ids}`,
        isToken:true,
    })
}

// 新增用户
export function saveRole(data) {
    return request({
        method: 'post',
        url: 'system/role',
        isToken: true,
        data
    })
}

