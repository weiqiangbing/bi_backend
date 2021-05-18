import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/topup.statistics',
    method: 'get',
    params
  })
}

