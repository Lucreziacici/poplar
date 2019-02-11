//
//公共接口

import request from '@/utils/request'

// 获取供应商
export function GetSupplierList(data) {
    return request({
        url: 'ApiCommon/SupplierList',
        method: 'get',
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
        method: 'get',
    })
}

// 获取银行账户
export function SupplierBankAccountList(data){
    console.log(data)
    return request({
        url: 'ApiCommon/SupplierBankAccountList',
        method: 'get',
        params: data
    })
}