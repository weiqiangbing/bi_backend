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
    url: '/bi/works/uv_incr_ranking',
    method: 'get',
    params
  })
}

// 获取书籍标题
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
