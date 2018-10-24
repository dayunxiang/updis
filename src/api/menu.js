import request from '@/utils/request'

export function menuList(query) {
  return request({
    url: 'menus',
    method: 'get',
    params: {
      pageSize: 1000,
      sortItem: 'rank',
      sortOrder: 'asc'
    }
  })
}
