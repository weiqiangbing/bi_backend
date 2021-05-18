import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/cost/book',
    method: 'get',
    params
  })
}

