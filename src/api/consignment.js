//
//寄售管理

import request from '@/utils/request'

// 获取商品库存
export function ConsignmentGoodsList(data) {
    return request({
        url: 'SupplierConsignment/ConsignmentGoodsList',
        method: 'get',
        params:data
    })
}
// 获取流水GET 
export function ConsignmentGoodsStockRecordList(data){
    return request({
        url: 'SupplierConsignment/ConsignmentGoodsStockRecordList',
        method: 'get',
        params:data
    })
}
// 获取采购单库存
export function GoodsInfoList(data) {
    return request({
        url: 'SupplierDemand/GoodsInfoList',
        method: 'get',
        params:data
    })
}
