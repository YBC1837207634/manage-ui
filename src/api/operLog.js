import request from "@/utils/request";


// 操作日志查询
export function pages(params) {
    return request.request({
        method: 'get',
        url: 'monitor/operLog/list',
        isToken:true,
        params
    })
}


// 删除操作日志
export function removeOperLog(ids) {
    return request.request({
        method: 'delete',
        url: `monitor/operLog/${ids}`,
        isToken:true,
    })
}

// 删除所有
export function removeOperLogAll() {
    return request.request({
        method: 'delete',
        url: `monitor/operLog`,
        isToken:true,
    })
}



