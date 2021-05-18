import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/works/uv_ranking',
    method: 'get',
    params
  })
}


