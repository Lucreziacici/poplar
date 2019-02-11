import { GetFunction, logout, Login } from '@/api/login'
import { GetSupplierInfo } from "@/api/supplier";
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录50007
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        Login({ user_name: username, login_id: username, login_pwd: userInfo.password }).then(response => {
          if (response.data.res_status_code == 0) {
            commit('SET_TOKEN', response.data.res_content.token)
            setToken(response.data.res_content.token)
            resolve(response)
          } else if (response.data.res_status_code == '50007') {
            resolve(response)
          } else {
            Message({
              message: response.data.res_message,
              type: 'error',
            })
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        GetFunction(state.token).then(response => {
          const data = response.data.res_content
          const roles = []
          for (var i = 0; i < response.data.res_content.roles.length; i++) {
            roles.push(response.data.res_content.roles[i].role_code)
          }
          if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.user_name)

          GetSupplierInfo({ supplier_id: "" }).then(response => {
            if (response.data.res_status_code == 0) {
              if (response.data.res_content.logo) {
                commit('SET_AVATAR', response.data.res_content.logo)
              } else {
                commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
              }
            }

          }).catch(error => {
            reject(error)
          })


          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
