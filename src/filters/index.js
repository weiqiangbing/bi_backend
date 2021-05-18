/**
 * 2020.1.9
 * 小白
 * 表格字段过滤为文字
 */
import { getOutSite, getSection, getClass, getSite } from '@/utils/auth' // 从缓存中读取数据（渠道，频道，分类）

export function outSiteText(num) {
  const outSiteData = getOutSite()
  let value = '~'
  for (const item of outSiteData) {
    if (item.outsite === num) {
      value = item.outsite_name
    }
  }
  return value
}

export function sectionText(num) {
  const sectionData = getSection()
  let value = '~'
  for (const item of sectionData) {
    if (item.section_id === num) {
      value = item.section_name
    }
  }
  return value
}

export function classText(num) {
  const classData = getClass()
  let value = '~'
  for (const item of classData) {
    if (item.class_id === num) {
      value = item.class_name
    }
  }
  return value
}

export function siteText(num) {
  const siteData = getSite()
  let value = '~'
  for (const item of siteData) {
    if (item.site_id === num) {
      value = item.site_name
    }
  }
  return value
}
