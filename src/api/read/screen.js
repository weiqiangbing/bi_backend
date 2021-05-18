import request from '@/utils/request'

export function getHandles(params) {
  return request({
    url: '/common/query/handles',
    method: 'get',
    params
  })
}

export function getHandleInfo(params) {
  return request({
    url: '/common/query/handle_info',
    method: 'get',
    params
  })
}

export function searchMyFilter(params) {
  return request({
    url: '/common/query/search',
    method: 'post',
    data: params
  })
}

export function searchMyFilters(params) {
  return request({
    url: '/common/query/searches',
    method: 'post',
    data: params
  })
}

export function postMyFilter(params) {
  return request({
    url: '/common/query/save_searches',
    method: 'post',
    data: params
  })
}
