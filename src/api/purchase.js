//
//采购单接口

import request from '@/utils/request'

// 保存采购需求POST
export function SavePurchaseDemand(data) {
    return request({
        url: 'SupplierDemand/SavePurchaseDemand',
        method: 'post',
        data:data
    })
}
// 根据商品编码 获取商品信息 GET
export function GetGoodsInfoByNo(data) {
    return request({
        url: 'SupplierDemand/GetGoodsInfoByNo',
        method: 'get',
        params:data
    })
}

// 获取需求列表 GET
export function GetDemandList(data) {
    return request({
        url: 'SupplierDemand/DemandList',
        method: 'get',
        params:data
    })
}
// 获取需求明细 GET 
export function GetDemandOrderDetail(data) {
    return request({
        url: 'SupplierDemand/DemandOrderDetail',
        method: 'get',
        params:data
    })
}

// 供应商确认订单 POST 
export function ConfirmPurchaseDemand(data) {
    return request({
        url: 'SupplierDemand/ConfirmPurchaseDemand',
        method: 'POST',
        data:data
    })
}

// 供应商订单发货 POST 
export function ConfirmDelivery(data) {
    return request({
        url: 'SupplierDemand/ConfirmDelivery',
        method: 'POST',
        data:data
    })
}

// 采购放弃订单 POST 
export function QuitPurchaseDemand(data) {
    return request({
        url: 'SupplierDemand/QuitPurchaseDemand',
        method: 'POST',
        data:data
    })
}

// 采购单列表 GET 
export function GetPurchaseList(data) {
    return request({
        url: 'SupplierDemand/PurchaseList',
        method: 'get',
        params:data
    })
}

// 发货单列表 GET 
export function GetDeliveryList(data) {
    return request({
        url: 'SupplierDemand/DeliveryList',
        method: 'get',
        params:data
    })
}

// 发货单列表 GET 
export function GetDeliveryDetail(data) {
    return request({
        url: 'SupplierDemand/DeliveryDetail',
        method: 'get',
        params:data
    })
}


// 保存发货单 POST 
export function SaveDeliveryNote(data) {
    return request({
        url: 'SupplierDemand/SaveDeliveryNote',
        method: 'POST',
        data:data
    })
}

// 入库确认 POST 
export function ConfirmInStock(data) {
    return request({
        url: 'SupplierDemand/ConfirmInStock',
        method: 'POST',
        data:data
    })
}

// 供应商出库 
export function CreateOutOrder(data) {
    return request({
        url: 'SupplierDemand/CreateOutOrder',
        method: 'POST',
        data:data
    })
}

//供应商出库单列表 
export function SupplierOutList(data) {
    return request({
        url: 'SupplierDemand/SupplierOutList',
        method: 'GET',
        params:data
    })
}

//供应商出库单详情 GET 
export function SupplierOutDetail(data) {
    return request({
        url: 'SupplierDemand/SupplierOutDetail',
        method: 'GET',
        params:data
    })
}

//供应商采购单明细GET 

export function PurchaseDetail(data) {
    return request({
        url: 'SupplierDemand/PurchaseDetail',
        method: 'GET',
        params:data
    })
}