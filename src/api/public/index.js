import request from '@/utils/request'

export function getSiteList() {
  return request({
    url: '/common/config/sites',
    method: 'get'
  })
}

export function getOutsitesList() {
  return request({
    url: '/common/config/outsites',
    method: 'get'
  })
}

export function getSectionList() {
  return request({
    url: '/common/config/section',
    method: 'get'
  })
}

export function getClassList() {
  return request({
    url: '/common/config/class',
    method: 'get'
  })
}

export function searchMyGroup(params) {
  return request({
    url: '/common/query/searches/my',
    method: 'get',
    params
  })
}

export function mergeTableData(url,params) {
  // console.log('3334',url);
  return request({
    url: url,
    method: 'get',
    params
  })
}

// 保存报表
export function saveReportData(data) {
  return request({
    url: '/bi/report/create',
    method: 'post',
    data
  })
}

export function updateReportData(data) {
  return request({
    url: '/bi/report/update',
    method: 'post',
    data
  })
}

export function getReportData(params) {
  return request({
    url: '/bi/report/list',
    method: 'get',
    params
  })
}

export function commonGet(url,params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function addIndicators(data) {
  return request({
    url: '/bi/indicators/create',
    method: 'post',
    data
  })
}