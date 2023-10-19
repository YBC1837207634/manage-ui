import request from "@/utils/request";


// 登陆记录查询
export function pages(params) {
    return request.request({
        method: 'get',
        url: 'monitor/recordLogin/list',
        isToken:true,
        params
    })
}

// 删除登陆记录
export function removeLogininfor(ids) {
    return request.request({
        method: 'delete',
        url: `monitor/recordLogin/${ids}`,
        isToken:true,
    })
}


// 删除所有
export function removeLogininforAll() {
    return request.request({
        method: 'delete',
        url: `monitor/recordLogin`,
        isToken:true,
    })
}

