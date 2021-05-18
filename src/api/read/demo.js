import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/works/read/users',
    method: 'get',
    params
  })
}
