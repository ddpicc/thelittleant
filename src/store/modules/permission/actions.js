import { asyncRouterMap, constantRouterMap } from '../../../router/index';

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
      return route.meta.role.indexOf(roles) >= 0;
    } else {
      return true;
    }
  }
  
  /**
   * 递归过滤异步路由表，返回符合用户角色权限的路由表
   * @param asyncRouterMap
   * @param roles
   */
  function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
      if (hasPermission(roles, route)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, roles);
        }
        return true;
      }
      return false;
    })
    return accessedRouters
  }

export default {
  GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        let accessedRouters;
        
        accessedRouters = filterAsyncRouter(asyncRouterMap, roles)          
        
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    },
 
}