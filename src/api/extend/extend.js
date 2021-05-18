import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/bi/works/gather',
//     method: 'get',
//     params
//   })
// }
export function getList(params) {
  return request({
    url: '/bi/spread/app',
    method: 'get',
    params
  })
}

export function getGather(params) {
  return request({
    url: '/bi/spread/gather',
    method: 'get',
    params
  })
}
