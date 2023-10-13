import request from "@/utils/request";

// 菜单列表
export function menuList() {
    return request({
        method: 'get',
        url: '/system/menu/list',
        isToken: true,

    })
}

export function getMenu(id) {
    return request({
        method: 'get',
        url: `/system/menu/${id}`,
        isToken: true,
    })
}

// 新增菜单
export function addMenu(data) {
    return request({
        method: 'post',
        url: '/system/menu',
        isToken: true,
        data
    })
}

// 删除菜单
export function removeMenu(id) {
    return request({
        method: 'delete',
        url: `/system/menu/${id}`,
        isToken: true,
    }) 
}

// 选择菜单树
export function getMenuTreeSelect(id) {
    return request({
        method: 'get',
        url: `/system/menu/menuTreeSelect/${id}`,
        isToken: true,
    })
}

// 菜单树
export function getMenuTree() {
    return request({
        method: 'get',
        url: `/system/menu/menuTree`,
        isToken: true,
    })
}

// 更新菜单
export function updateMenu(data) {
    return request({
        method: 'put',
        url: '/system/menu',
        isToken: true,
        data
    })
}

