import request from '@/utils/request'

export function roleList(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: {
      pageSize: 10000
    }
  })
}

export function roleEdit(data) {
  request({
    url: '/roles/' + data.role_id + '/edit',
    method: 'post',
    data
  })
}
