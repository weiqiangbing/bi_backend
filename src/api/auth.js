import request from '@/utils/authRequest'

export function getPermission(data) {
  return request({ 
    url: '/guardian.path.list',
    method: 'post',
    data
  })
}


export function getBtnPermiss(data) {
  return request({ 
    url: '/guardian.verify',
    method: 'post',
    data
  })
}
