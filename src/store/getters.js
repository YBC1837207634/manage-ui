
export default {
    asideRouter: state => state.permissions.asideNavRoutes,
    purview: state => state.user.purview,
    isLogin: state => state.user.isLogin,
    token: state => state.user.token,
    activeMenu: state => state.user.activeMenu,
    tags: state => state.permissions.tags,
    currentTag: state => state.permissions.currentTag
}