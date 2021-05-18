import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/books/bookVisit',
    method: 'get',
    params
  })
}

