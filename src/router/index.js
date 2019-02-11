import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    hidden:true,
    meta: { title: "首页", icon: 'documentation', noCache: false },
    children: [
          {
            path: '',
            component: () => import('@/views/dashboard/index'),
            name: 'dashboard',
            meta: { title: '首页', icon: 'documentation', noCache: false }
          }, ]
  },
  {
    path: '/test',
    component: Layout,
    hidden:true,
    meta: { title: "首页", icon: 'documentation', noCache: false },
    children: [
          {
            path: '/test/test',
            component: () => import('@/views/purchase/test'),
            name: 'test',
            meta: { title: '首页', icon: 'documentation', noCache: false }
          }, ]
  },
  // {
  //   path: '',
  //   component: Layout,
  //   redirect: 'exampletable',
  //   name: '案例',
  //   meta: { title: "案例", icon: 'documentation', noCache: false },
  //   children: [
  //     {
  //       path: 'exampletable',
  //       component: () => import('@/views/exampletable/index'),
  //       name: 'tableexample',
  //       meta: { title: '表格案例', icon: 'documentation', noCache: false }
  //     }, {
  //       path: 'Form',
  //       component: () => import('@/views/exampletable/Form'),
  //       name: 'formexample',
  //       meta: { title: '表单案例', icon: 'documentation', noCache: false }
  //     }, {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/supplier',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'supplier',
  //   alwaysShow:true,
  //   meta: { title: "供应商入驻", icon: 'supplier', noCache: false },
  //   children: [
  //     {
  //       path: '/supplier/info',
  //       component: () => import('@/views/supplier/InfoList'),
  //       name: 'supplierInfo',
  //       meta: { title: '供应商公司信息', icon: 'list', noCache: false }
  //     },
  //     {
  //       path: '/supplier/add',
  //       component: () => import('@/views/supplier/Add'),
  //       name: 'addSupplierinfo',
  //       meta: { title: '供应商信息', icon: 'edit', noCache: false }
  //     },
  //     {
  //       path: '/supplier/brandlist',
  //       component: () => import('@/views/supplier/BrandList'),
  //       name: 'brandList',
  //       hidden: true,
  //       meta: { title: '供应商品牌信息', icon: 'list', noCache: false }
  //     },
  //   ]
  // },
  // {
  //   path: '/commodity',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'commodity',
  //   alwaysShow:true,
  //   meta: { title: " 商品信息", icon: 'commodity', noCache: false },
  //   children: [
  //     {
  //       path: '/commodity/mainList',
  //       component: () => import('@/views/commodity/MainList'),
  //       name: 'commodityList',
  //       meta: { title: '供应商商品列表', icon: 'list', noCache: false }
  //     },
  //     // {
  //     //   path: '/commodity/add',
  //     //   component: () => import('@/views/commodity/Add'),
  //     //   name: 'addCommodity',
  //     //   meta: { title: '商品提案', icon: 'edit', noCache: false }
  //     // },
  //     // {
  //     //   path: '/commodity/mainList',
  //     //   component: () => import('@/views/commodity/mainList'),
  //     //   name: 'mainList2',
  //     //   meta: { title: '商品库存', icon: 'chart', noCache: false }
  //     // },
  //   ]
  // },
  // {
  //   path: '/purchase',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'purchase',
  //   alwaysShow:true,
  //   meta: { title: "采购单信息", icon: 'purchase', noCache: false },
  //   children: [
  //     {
  //       path: '/purchase/requirementList',
  //       component: () => import('@/views/purchase/RequirementList'),
  //       name: 'requirementList',
  //       meta: { title: '采购需求列表', icon: 'list', noCache: false }
  //     },
  //     {
  //       path: '/purchase/add',
  //       component: () => import('@/views/purchase/Add'),
  //       name: 'purchaseAdd',
  //       hidden: true,
  //       meta: { title: '采购需求录入', icon: 'edit', noCache: false }
  //     },
  //     {
  //       path: '/purchase/purchaselist',
  //       component: () => import('@/views/purchase/List'),
  //       name: 'purchaselist',
  //       meta: { title: '采购单列表', icon: 'list', noCache: false }
  //     },
  //     {
  //       path: '/purchase/deliverlist',
  //       component: () => import('@/views/purchase/DeliverList'),
  //       name: 'deliverlist',
  //       meta: { title: '发货单列表', icon: 'list', noCache: false }
  //     },
  //     {
  //       path: '/purchase/deliverydetail',
  //       component: () => import('@/views/purchase/DeliveryDetail'),
  //       name: 'deliverydetail',
  //       hidden: true,
  //       meta: { title: '发货单明细', icon: 'edit', noCache: false }
  //     }
  //   ]
  // },
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})



export const asyncRouterMap = [
 


]
