import Cookies from 'js-cookie'

const authKey = 'user_auth_key' // token的缓存
const TokenKey = 'vue_admin_template_token' // token的缓存
const SiteKey = 'site_list'// 站点数据的缓存
const OutSiteKey = 'out_site_list'// 渠道数据的缓存
const SectionKey = 'section_list'// 频道数据的缓存
const ClassKey = 'class_list'// 分类数据的缓存
const HistorySearchListKey = 'history_search_list'// 筛选条件及数据的缓存（报表）
const BookDataKey = 'book_data_list' // 书籍数据页选中列的缓存
const BookRecomKey = 'book_recom_list' // 书籍推荐页选中列的缓存
const BookCostKey = 'book_cost_list_key' // 书籍消费页选中列的缓存
const BookActKey = 'book_act_list_key' // 书籍互动页选中列的缓存
const PayDataKey = 'pay_data_list' // 充值数据页选中列的缓存
const PayUserKey = 'pay_user_list' // 充值用户页选中列的缓存
const CostDataKey = 'cost_data_list' // 消费数据页选中列的缓存
const CostUserKey = 'cost_user_list' // 消费用户页选中列的缓存
const PvEchartKey = 'pv_echart_data' // 书籍pv页图表的缓存
const PvExtendKey = 'pv_extend_data' // App推广数据
const PvLifeUserKey = 'day_momth_life_user'  //日活月活列表
const PvPublishKey = 'publish_list_list'  // 推送列表
const PvUvRankingKey = 'uv_ranking_list' //uv排行榜
const PvGrowThRateKey = 'pv_grow_th_rate_list' //增幅排行榜
const PvexclusiveBeanKey = 'ex_clusive_bean_list' // 专属魔豆
const PvRechargeStaticsKey = 'recharge_statics_key_list'  //充值统计项
const PvKeyWordStaticsKey = 'key_word_statics_key_list' //关键词
const PvBookStaticKey = 'book_static_key_list'  //作品分析
const operationalKey = 'operational_key_list'  //运营数据
const chapterPvKey = 'chapter_pv_key_list'  //章节pv
// token
// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
//权限
export function getUserAuth() {
  return localStorage.getItem(authKey)
}

export function setUserAuth(data) {
  return localStorage.setItem(authKey, data)
}

export function removeUserAuth() {
  return localStorage.removeItem(authKey)
}

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

// 筛选条件及数据的缓存（报表）
export function getHistorySearchList() {
  var arr = localStorage.getItem(HistorySearchListKey)
  return arr ? JSON.parse(arr) : []
}

export function setHistorySearchList(data) {
  var dataStr = JSON.stringify(data)
  return localStorage.setItem(HistorySearchListKey, dataStr)
}

export function removeHistorySearchList() {
  return localStorage.removeItem(HistorySearchListKey)
}

// 站点数据的缓存
export function getSite() {
  var arr = localStorage.getItem(SiteKey)
  return arr ? JSON.parse(arr) : []
}

export function setSite(data) {
  var dataStr = JSON.stringify(data)
  return localStorage.setItem(SiteKey, dataStr)
}

export function removeSite() {
  return localStorage.removeItem(SiteKey)
}

// 渠道数据的缓存
export function getOutSite() {
  var arr = localStorage.getItem(OutSiteKey)
  return arr ? JSON.parse(arr) : []
}

export function setOutSite(data) {
  var dataStr = JSON.stringify(data)
  return localStorage.setItem(OutSiteKey, dataStr)
}

export function removeOutSite() {
  return localStorage.removeItem(OutSiteKey)
}

// 频道数据的缓存
export function getSection() {
  var arr = localStorage.getItem(SectionKey)
  return arr ? JSON.parse(arr) : []
}

export function setSection(data) {
  var dataStr = JSON.stringify(data)
  return localStorage.setItem(SectionKey, dataStr)
}

export function removeSection() {
  return localStorage.removeItem(SectionKey)
}

// 分类数据的缓存
export function getClass() {
  var arr = localStorage.getItem(ClassKey)
  return arr ? JSON.parse(arr) : []
}

export function setClass(data) {
  var dataStr = JSON.stringify(data)
  return localStorage.setItem(ClassKey, dataStr)
}

export function removeClass() {
  return localStorage.removeItem(ClassKey)
}

// 书籍数据
export function getBookList() {
  var arr = localStorage.getItem(BookDataKey)
  return arr ? arr.split(',') : []
}

export function setBookList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(BookDataKey, dataStr)
}

export function removeBookList() {
  return localStorage.removeItem(BookDataKey)
}
// 书籍推荐
export function getBookRecomList() {
  var arr = localStorage.getItem(BookRecomKey)
  return arr ? arr.split(',') : []
}

export function setBookRecomList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(BookRecomKey, dataStr)
}

export function removeBookRecomList() {
  return localStorage.removeItem(BookRecomKey)
}

// 章节pv
export function getChapterPvList() {
  var arr = localStorage.getItem(chapterPvKey)
  return arr ? arr.split(',') : []
}

export function setChapterPvList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(chapterPvKey, dataStr)
}

export function removeChapterPvList() {
  return localStorage.removeItem(chapterPvKey)
}

// 书籍消费
export function getBookCostList() {
  var arr = localStorage.getItem(BookCostKey)
  return arr ? arr.split(',') : []
}

export function setBookCostList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(BookCostKey, dataStr)
}

export function removeBookCostList() {
  return localStorage.removeItem(BookCostKey)
}

// 书籍互动
export function getBookActList() {
  var arr = localStorage.getItem(BookActKey)
  return arr ? arr.split(',') : []
}

export function setBookActList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(BookActKey, dataStr)
}

export function removeBookActList() {
  return localStorage.removeItem(BookActKey)
}

// 充值数据
export function getPayList() {
  var arr = localStorage.getItem(PayDataKey)
  return arr ? arr.split(',') : []
}

export function setPayList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PayDataKey, dataStr)
}

export function removePayList() {
  return localStorage.removeItem(PayDataKey)
}
// 充值用户
export function getPayUserList() {
  var arr = localStorage.getItem(PayUserKey)
  return arr ? arr.split(',') : []
}

export function setPayUserList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PayUserKey, dataStr)
}

export function removePayUserList() {
  return localStorage.removeItem(PayUserKey)
}
// 消费数据
export function getCostList() {
  var arr = localStorage.getItem(CostDataKey)
  return arr ? arr.split(',') : []
}

export function setCostList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(CostDataKey, dataStr)
}

export function removeCostList() {
  return localStorage.removeItem(CostDataKey)
}
// 消费用户
export function getCostUserList() {
  var arr = localStorage.getItem(CostUserKey)
  return arr ? arr.split(',') : []
}

export function setCostUserList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(CostUserKey, dataStr)
}

export function removeCostUserList() {
  return localStorage.removeItem(CostUserKey)
}

// App推广数据
export function getExtendList() {
  var arr = localStorage.getItem(PvExtendKey)
  return arr ? arr.split(',') : []
}
export function setExtendList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvExtendKey, dataStr)
}
export function removeExtendList() {
  return localStorage.removeItem(PvExtendKey)
}

// 推送列表
export function getPulishList() {
  var arr = localStorage.getItem(PvPublishKey)
  return arr ? arr.split(',') : []
}
export function setPublishList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvPublishKey, dataStr)
}
export function removePublishList() {
  return localStorage.removeItem(PvPublishKey)
}

// 日活月活列表
export function getLifeUserList() {
  var arr = localStorage.getItem(PvLifeUserKey)
  return arr ? arr.split(',') : []
}
export function setLifeUserList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvLifeUserKey, dataStr)
}
export function removeLifeUserList() {
  return localStorage.removeItem(PvLifeUserKey)
}

// uv排行榜
export function getuvRankingList() {
  var arr = localStorage.getItem(PvUvRankingKey)
  return arr ? arr.split(',') : []
}
export function setuvRankingList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvUvRankingKey, dataStr)
}
export function removeuvRankingList() {
  return localStorage.removeItem(PvUvRankingKey)
}

// 增幅排行榜
export function getGrowThRateList() {
  var arr = localStorage.getItem(PvGrowThRateKey)
  return arr ? arr.split(',') : []
}
export function setGrowThRateList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvGrowThRateKey, dataStr)
}
export function removeGrowThRateList() {
  return localStorage.removeItem(PvGrowThRateKey)
}

// 专属魔豆
export function getExclusiveBeanList() {
  var arr = localStorage.getItem(PvexclusiveBeanKey)
  return arr ? arr.split(',') : []
}
export function setExclusiveBeanList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvexclusiveBeanKey, dataStr)
}
export function removeExclusiveBeanList() {
  return localStorage.removeItem(PvexclusiveBeanKey)
}

// 充值统计项
export function getRechargeStaticsList() {
  var arr = localStorage.getItem(PvRechargeStaticsKey)
  return arr ? arr.split(',') : []
}
export function setRechargeStaticsList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvRechargeStaticsKey, dataStr)
}
export function removeRechargeStaticsList() {
  return localStorage.removeItem(PvRechargeStaticsKey)
}

// 关键词
export function getKeyWordStaticsList() {
  var arr = localStorage.getItem(PvKeyWordStaticsKey)
  return arr ? arr.split(',') : []
}
export function setKeyWordStaticsList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvKeyWordStaticsKey, dataStr)
}
export function removeKeyWordStaticsList() {
  return localStorage.removeItem(PvKeyWordStaticsKey)
}

// 作品分析
export function getBookStaticList() {
  var arr = localStorage.getItem(PvBookStaticKey)
  return arr ? arr.split(',') : []
}
export function setBookStaticList(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(PvBookStaticKey, dataStr)
}
export function removeBookStaticList() {
  return localStorage.removeItem(PvBookStaticKey)
}

// 运营数据
export function getOperationalist() {
  var arr = localStorage.getItem(operationalKey)
  return arr ? arr.split(',') : []
}
export function setOperationalist(data) {
  var dataStr = data.join(',')
  return localStorage.setItem(operationalKey, dataStr)
}
export function removeOperationalist() {
  return localStorage.removeItem(operationalKey)
}