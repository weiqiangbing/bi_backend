import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/works/bookact.list',
    method: 'get',
    params
  })
}

