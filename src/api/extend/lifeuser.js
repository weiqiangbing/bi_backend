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
    url: '/bi/user/active',
    method: 'get',
    params
  })
}

export function getOperationList(params) {
  return request({
    url: '/bi/spread/keep',
    method: 'get',
    params
  })
}


export function getGather(params) {
  return request({
    url: '/bi/user/keep',
    method: 'get',
    params
  })
}

export function getAddData(params) {
  return request({
    url: '/bi/user/reguserUser',
    method: 'get',
    params
  })
}

export function getReturnModelData(params) {
  return request({
    url: '/bi/user/payback',
    method: 'get',
    params
  })
}

// export function getBookMsgList(params) {
//   return request({
//     url: '/common/book/equal_ids',
//     method: 'get',
//     params
//   })
// }
