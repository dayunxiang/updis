import request from '@/utils/request'

export function departments(query) {
  return request({
    url: '/departments',
    method: 'get',
    params: query
  })
}
export function delDepartments(department_id) {
  return request({
    url: `/departments${department_id}/delete`,
    method: 'post'
  })
}
export function editUser(hm_user_id) {
  return request({
    url: `/hm_users/${hm_user_id}/edit`,
    method: 'post'
  })
}
