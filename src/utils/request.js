import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import _ from 'lodash'

// 创造一个axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

service.defaults.paramsSerializer = function(params) {
  return _.join(_.map(_.keys(params), key => {
    if (params[key]) {
      return key + '=' + encodeURIComponent(typeof params[key] === 'string' ? params[key] : JSON.stringify(params[key]))
    } else {
      return key + '=' + encodeURIComponent(JSON.stringify({}))
    }
  }), '&')
}

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['X-Auth-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
