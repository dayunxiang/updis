import request from '@/utils/request'
import { param } from '@/utils'

export function roleMenuAllDelete(data) {
  return request({
    url: '/role_menus/delete/batch',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    data,
    transformRequest: param
  })
}

export function roleMenuNew(data) {
  return request({
    url: '/role_menus/create/batch',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    method: 'post',
    data: {
      params: data
    },
    transformRequest: param
  })
}

export function roleMenu(query) {
  return request({
    url: '/role_menus',
    method: 'get',
    params: {
      pageSize: 10000,
      filters: {
        'role_menu': {
          'roleId': {
            equalTo: query
          }
        }
      },
      'includes': {
        'menu': {
          includes: ['menu_id']
        }
      }
    }
  })
}
