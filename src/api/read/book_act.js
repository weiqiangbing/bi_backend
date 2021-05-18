import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/works/act',
    method: 'get',
    params
  })
}

