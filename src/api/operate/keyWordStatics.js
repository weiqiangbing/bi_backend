import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/keyword.list',
    method: 'get',
    params
  })
}

