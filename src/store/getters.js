
export default {

    asideRouter: state => state.permissions.asideNavRoutes,
    purview: state => state.user.purview,
    isLogin: state => state.user.isLogin,
    token: state => state.user.token
}