import request from "@/utils/request";


/**
 * 查询已导入的表
 * @param {查询条件} params 
 * @returns 
 */
export function getGenTableList(params) {
    return request.request({
        method: 'get',
        url: 'tool/generator/table/list',
        isToken:true,
        params
    })
}

/**
 * 从数据库中获取未导入的表
 * @param {} params 
 * @returns 
 */
export function getTableList(params) {
    return request.request({
        method: 'get',
        url: 'tool/generator/db/list',
        isToken:true,
        params
    })
}

/**
 * 通过表id获取列信息
 * @param {*} tableId 
 * @returns 
 */
export function getGenTable(tableId) {
    return request.request({
        method: 'get',
        url: `tool/generator/table/${tableId}`,
        isToken:true,
    })
}

/**
 * 导入表
 * @param {} tableNameList 
 * @returns 
 */
export function importTable(params) {
    return request.request({
        method: 'get',
        url: `tool/generator/table/imp`,
        isToken:true,
        params
    })
}

/**
 * 根据id批量删除
 * @param {ids} params 
 * @returns 
 */
export function removeGenTables(ids) {
    return request.request({
        method: 'delete',
        url: `tool/generator/table/${ids}`,
        isToken:true,
    })
}

/**
 * 预览生成的代码
 * @param {talbeid} tableId 
 * @returns 
 */
export function previewGenCode(tableId) {
    return request.request({
        method: 'get',
        url: `tool/generator/gen/preview/${tableId}`,
        isToken:true,
    })
}

/**
 * 更新表
 * @param {} data 
 * @returns 
 */
export function updateGenTable(data) {
    return request.request({
        method: 'put',
        url: `tool/generator`,
        isToken:true,
        data
    })
}

/**
 * 下载代码
 * @param {} tableName 
 * @returns 
 */
export function downloadGenCode(tableId) {
    return request.request({
        method: 'get',
        url: `tool/generator/download/${tableId}`,
        isToken:true,
        responseType: 'blob',
    })
}