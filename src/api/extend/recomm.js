import request from '@/utils/request'

export function getListData(params) {
  return request({
    url: '/bi/cost/tj',
    method: 'get',
    params
  })
}


export function getRecomData(params) {
  return request({
    url: '/bi/cost/tj.list',
    method: 'get',
    params
  })
}

