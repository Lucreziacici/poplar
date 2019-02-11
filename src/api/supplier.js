//供应商接口
import request from '@/utils/request'

//获取首页信息
export function GetHomepageStatistics() {
    return request({
        url: 'Supplier/GetHomepageStatistics',
        method: 'get',
    })
}

// 获取供应商信息
export function GetSupplierInfo(data) {
    return request({
        url: 'Supplier/GetSupplierInfo',
        method: 'get',
        params: data
    })
}

// 获取供应商品牌信息
export function GetSupplierBrandInfo(data) {
    return request({
        url: 'Supplier/GetSupplierBrandInfo',
        method: 'get',
        params: data
    })
}

// 获取供应商品牌列表
export function GetAuthorizeBrandList() {
    return request({
        url: '/Supplier/GetAuthorizeBrandList',
        method: 'get',
    })
}
// 获取供应商商品列表
export function GetSupplierProductList(data) {
    return request({
        url: '/Supplier/GetSupplierProductList',
        method: 'get',
        params: data
    })
}

// 获取供应商商品详情
export function GetSupplierProductInfo(data) {
    return request({
        url: 'Supplier/GetSupplierProductInfo',
        method: 'get',
        params: data
    })
}


// 审核品牌GET 
export function AuditingSupplierBrand(data) {
    return request({
        url: 'Supplier/AuditingSupplierBrand',
        method: 'get',
        params: data
    })
}

// 获取供应商列表GET
export function GetSupplierList(data) {
    return request({
        url: 'Supplier/GetSupplierList',
        method: 'get',
        params: data
    })
}
// 审核供应商 GET
export function AuditingSupplier(data) {
    return request({
        url: 'Supplier/AuditingSupplier',
        method: 'get',
        params: data
    })
}

// 保存供应商信息
export function SaveSupplierBaseInfo(data) {
    return request({
        url: 'Supplier/SaveSupplierBaseInfo',
        method: 'post',
        data: data
    })
}

// 保存供应商品牌信息
export function SaveSupplierBrandInfo(data) {
    return request({
        url: 'Supplier/SaveSupplierBrandInfo',
        method: 'post',
        data: data
    })
}

