import store from '@/store';

/**
 * 判断权限标识
 * @param {} value 
 * @returns 
 */
export function hasPermi(value) {
    if (value && value instanceof Array && value.length > 0) {
        let permissions = store.getters && store.getters.purview
        const permissionDatas = value
        const allPermission = "*:*:*";
        // 查看当前角色是否具有权限。
        const hasPermission = permissions.some(permission => 
                allPermission === permission || permissionDatas.includes(permission)
            )
        if (!hasPermission) {
          return false
        }
        return true
      } else {
        console.error(`未提供提供权限标识`)
        return false
      }
}