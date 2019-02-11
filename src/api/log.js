import request from '@/utils/request'

// 日志GET /api/Supplier/GetHistory/{id}
export function logList(query) {
  return request({
    url: 'Supplier/GetHistory',
    method: 'get',
    params: query
  })
}