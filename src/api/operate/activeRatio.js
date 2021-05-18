import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/recharge/active',
    method: 'get',
    params
  })
}

export function getActiveType(params) {
  return request({
    url: '/bi/active.eventType',
    method: 'get',
    params
  })
}

export function getActiveList(params) {
  return request({
    url: '/bi/active.activeList',
    method: 'get',
    params
  })
}

