import request from '@/utils/request'

export function getBookSumList(params) {
  return request({
    url: '/bi/translate/gather',
    method: 'get',
    params
  })
}

