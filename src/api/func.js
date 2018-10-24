import request from '@/utils/request'

export function funcList(query) {
  return request({
    url: 'function_authorities',
    method: 'get',
    params: query
  })
}

export function funcEdit(data) {
  return request({
    url: '/function_authorities/' + data.function_authority_id + '/edit',
    method: 'post',
    data
  })
}
