//
// 公共接口

import request from '@/utils/request'

// 添加收藏
export function AddToMyFavorite(data) {
  return request({
    url: 'MyFavorite/AddToMyFavorite',
    method: 'post',
    data: data
  })
}
// 获取收藏列表
export function GetMyFavorites(data) {
  return request({
    url: 'MyFavorite/GetMyFavorites',
    method: 'get',
    params: data
  })
}
// 删除收藏
export function DeleteFromMyFavorite(data) {
  return request({
    url: 'MyFavorite/DeleteFromMyFavorite',
    method: 'post',
    data: data
  })
}
// 获取供应商
export function GetSupplierList(data) {
  return request({
    url: 'ApiCommon/SupplierList',
    method: 'get'
  })
}

// 获取币种GET
export function GetBaseDataByCodetype(data) {
  return request({
    url: 'ApiCommon/GetBaseDataByCodetype',
    method: 'get',
    params: data
  })
}

// 获取仓库GET
export function GetRoleWarehouseList() {
  return request({
    url: 'SupplierDemand/GetRoleWarehouseList',
    method: 'get'
  })
}

// 获取银行账户
export function SupplierBankAccountList(data) {
  console.log(data)
  return request({
    url: 'ApiCommon/SupplierBankAccountList',
    method: 'get',
    params: data
  })
}
