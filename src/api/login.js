import request from '@/utils/request'

// 登录
export function Login(data) {
  return request({
    url: 'SupplierLogin/Login',
    method: 'post',
    data: data
  })
}

// 获取路由信息
export function GetFunction(data) {
  return request({
    url: 'SupplierLogin/GetFunction',
    method: 'get',
    params: { token: data, supplier_flag: '1' }
  })
}

// 更改密码GET /api/SupplierLogin/ChangePassword
export function ChangePassword(data) {
  return request({
    url: 'SupplierLogin/ChangePassword',
    method: 'get',
    params: data
  })
}
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

