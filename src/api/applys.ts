import request from '@/utils/request'

export const getApplys = (params: any) =>
  request({
    url: '/admin/apply/index',
    method: 'post',
    data: params
  })

export const getApply = (id: number | string) =>
  request({
    // url: `/applys/${id}`,
    url: '/admin/apply/applyInfo',
    method: 'get',
    params: {
      apply_id: id
    }
  })

export const checkPass = (id: number | string) => {
  return request({
    url: '/admin/Apply/checkPass',
    method: 'get',
    params: {
      apply_id: id
    }
  })
}

export const sendBack = (data: any) => {
  return request({
    url: '/admin/Apply/sendBack',
    method: 'post',
    data
  })
}

export const getWeChatList = (data: any) => {
  return request({
    url: '/admin/SubmitWeChat/index',
    method: 'post',
    data
  })
}

export const toReg = (id: number | string) => {
  return request({
    url: '/admin/SubmitWeChat/toReg',
    method: 'get',
    params: {
      apply_id: id
    }
  })
}
