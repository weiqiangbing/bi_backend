import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/common/query/list',
    method: 'get',
    params
  })
}
export function delArticle(params) {
  return request({
    url: '/common/query/delete/' + params,
    method: 'post',
    data: params
  })
}
