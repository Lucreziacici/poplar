import request from '@/utils/request'

//保存询价单列表POST 
export function SaveQuotationRequest(data) {
  return request({
    url: 'SupplierQuotation/SaveQuotationRequest',
    method: 'post',
    data: data
  })
}

//获取询价单
export function QuotationRequestList(data) {
  return request({
    url: 'SupplierQuotation/QuotationRequestList',
    method: 'get',
    params: data
  })
}

//生成报价单POST 

export function SaveBid(data) {
  return request({
    url: 'SupplierQuotation/SaveBid',
    method: 'post',
    data: data
  })
}

// 获取报价单列表 GET 
export function GetBidList(data) {
  return request({
    url: 'SupplierQuotation/BidList',
    method: 'get',
    params: data
  })
}

// 采纳报价 POST 
export function ConfirmBid(data) {
  return request({
    url: 'SupplierQuotation/ConfirmBid',
    method: 'post',
    data: data
  })
}
// 拒绝报价 POST 
export function RefuseBid(data) {
  return request({
    url: 'SupplierQuotation/RefuseBid',
    method: 'post',
    data: data
  })
}