import request from '@/utils/request'
import { param } from '@/utils'

export function roleMenuAllDelete(data) {
  return request({
    url: '/role_functions/delete/batch',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data: data,
    transformRequest: param
  })
}

export function roleMenuNew(data) {
  return request({
    url: '/role_functions/new',
    method: 'post',
    data
  })
}

export function roleMenu(query) {
  return request({
    url: '/role_functions',
    method: 'get',
    params: query
  })
}
