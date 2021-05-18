import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/active.statistics',
    method: 'get',
    params
  })
}

