import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/user/gather',
    method: 'get',
    params
  })
}

export function getChapterList(params) {
  return request({
    url: '/bi/works/visit/chapters',
    method: 'get',
    params
  })
}
