import request from '@/utils/request'
export default {

    // 发送手机验证码
    sendPhoneMessage(phone) {
        return request({
            url: `/api/sms/send-register-code/${phone}`,
            method: 'Get',
        })
    },
    // 发送邮箱验证码
    sendMailMessage(mail) {
        return request({
            url: `/api/sms/send-register-mail-code/${mail}`,
            method: 'Get',
        })
    },

    // 会员注册
    register(member) {
        return request({
            baseURL: 'http://localhost:9999',
            url: '/api/ucenter/member/register',
            method: 'Post',
            data: member,
        })
    }
}