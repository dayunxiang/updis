import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  //项目管理
  {
    path: '',
    component: Layout,
    redirect: 'project-manager',
    children: [{
      path: 'project-manager',
      component: _import('project-manager/index'),
      name: 'project-manager',
      meta: { title: '项目管理', icon: 'tab' , noCache: true }
    }]
  },
  // 首页
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    hidden:true,
    children: [
      {
        path: 'index',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /**
   * 地理信息管理
   */
  {
    path: '/infoManager',
    component: Layout,
    redirect: '/infoManager/complex-table',
    meta: {
      title: '地理信息管理',
      icon: 'table'
    },
    children: [
      // 点管理
      {
        path: 'point-manager',
        component: () => import('@/views/table/pointManager/index'),
        name: 'pointManager',
        meta: {
          title: '点管理',
          icon: 'documentation',
          noCache: true
        }
      },
      // 线管理
      {
        path: 'drag-table',
        component: () => import('@/views/table/lineManager/index'),
        name: 'DragTable',
        meta: {
          title: '线管理',
          icon: 'documentation',
          noCache: true
        }
      },
      // 块管理
      {
        path: 'block-manager',
        component: () => import('@/views/table/blockManager/index'),
        name: 'InlineEditTable',
        meta: {
          title: '块管理',
          icon: 'documentation',
          noCache: true
        }
      },
      {
        path: ' company-manager',
        component: () => import('@/views/table/companyManager/index'),
        name: 'InlineEditTable',
        meta: {
          title: '企业管理',
          icon: 'documentation',
          noCache: true
        }
      }

    ]
  },
  /**
   * 统计分析
   */
  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: '统计分析',
      icon: 'chart'
    },
    children: [
      {
        path: 'keyboard',
        component: _import('charts/keyboard'),
        name: 'keyboard',
        meta: {
          title: '项目进度表',
          noCache: true
        }
      },
      {
        path: 'figure',
        component: _import('charts/figure'),
        name: 'figure',
        meta: {
          title: '项目统计分析图',
          noCache: true
        }
      }
    ]
  },
  /**
   * 系统管理
   */
  {
    path: '/nested',
    component: Layout,
    redirect: 'departmentManage',
    name: 'systemManagement',
    meta: {
      title: '设置',
      icon: 'systemManagement'
    },
    children: [
      {
        path: 'departmentManage',
        component: _import('jurisdiction/departmentManage'),
        name: 'departmentManage',
        meta: {
          title: '部门管理',
          icon: 'documentation',
          noCache: true
        }
      },
      {
        path: 'roleManage',
        component: _import('jurisdiction/roleManage'),
        name: 'roleManage',
        meta: {
          title: '角色管理',
          icon: 'documentation',
          noCache: true
        }
      }
    ]
  },
  /**
   * 工具箱
   */
  {
    path: '/tools',
    component: Layout,
    redirect: 'coordinate',
    name: 'tools',
    meta: {
      title: '工具箱',
      icon: 'table'
    },
    children: [
      {
        path: 'coordinate',
        component: _import('Tools/coordinate'),
        name: 'coordinate',
        meta: {
          title: 'Gis坐标转换',
          icon: 'documentation',
          noCache: true
        }
      },
      {
        path: 'coordinate',
        component: _import('Tools/coordinate'),
        name: 'coordinate',
        meta: {
          title: 'Gis坐标转换',
          icon: 'documentation',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
