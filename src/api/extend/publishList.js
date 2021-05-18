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
    url: '/bi/push.list',
    method: 'get',
    params
  })
}
