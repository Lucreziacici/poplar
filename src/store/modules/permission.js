import { asyncRouterMap, constantRouterMap } from '@/router'
// import { constantRouterMap, routerComponents } from '@/router'
import { GetFunction } from '@/api/login'
import { getToken } from '@/utils/auth' // getToken from cookie
import Layout from '@/views/layout/Layout'
const map={
  supplierInfo:()=>import('@/views/supplier/InfoList'),
  addSupplierinfo:()=>import('@/views/supplier/Add'),
  brandList:()=>import('@/views/supplier/BrandList'),
  commodityList:()=>import('@/views/commodity/MainList'),
  requirementList:()=>import('@/views/purchase/RequirementList'),
  purchaseAdd:()=>import('@/views/purchase/Add'),
  purchaselist:()=>import('@/views/purchase/List'),
  outboundList:()=>import('@/views/purchase/OutboundList'),
  outboundDetail:()=>import('@/views/purchase/OutboundDetail'),
  deliverlist:()=>import('@/views/purchase/DeliverList'),
  deliverydetail:()=>import('@/views/purchase/DeliveryDetail'),
  requestList:()=>import('@/views/requestandbid/RequestList'),
  bidList:()=>import('@/views/requestandbid/BidList'),
  bidDetail:()=>import('@/views/requestandbid/BidDetail'),
  purchaseInventory:()=>import('@/views/consignment/PurchaseInventory'),
  commodityInventory:()=>import('@/views/consignment/CommodityInventory'),
 }

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if(tmp.component === 'Layout'){
        tmp.component = Layout
      }
      else{
        tmp.component = map[route.name] 
      }
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit },data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        let token=getToken();
        GetFunction(token).then(response => {
          response.data.res_content.functions.push({ path: '*', redirect: '/401', hidden: true })
          accessedRouters = filterAsyncRouter(response.data.res_content.functions, roles)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
}

export default permission
