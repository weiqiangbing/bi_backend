import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bi/works/recommend',
    method: 'get',
    params
  })
}

// export function getChapterList(params) {
//   return request({
//     url: '/bi/works/visit/chapters',
//     method: 'get',
//     params
//   })
// }

// export function getBookMsgList(params) {
//   return request({
//     url: '/common/book/equal_ids',
//     method: 'get',
//     params
//   })
// }
