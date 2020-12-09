import request from '@/utils/request'
import cookie from 'js-cookie'
export default {

    // 发送手机登录验证码
    sendPhoneLoginMessage(phone) {
        return request({
            baseURL: `http://localhost:9999`,
            url: `/api/sms/send-login-code/${phone}`,
            method: 'Get',
        })
    },
    // 会员账号密码登录
    login(member) {
        return request({
            baseURL: 'http://localhost:9999',
            url: '/api/ucenter/member/login',
            method: 'Post',
            data: member,
        })
    },
    // 会员手机验证码登录
    phoneCodeLogin(member) {
        return request({
            baseURL: 'http://localhost:9999',
            url: '/api/ucenter/member/phone-code-login',
            method: 'Post',
            data: member,
        })
    },
    getUserInfoByToken() {
        return request({
            baseURL: 'http://localhost:9999',
            url: '/api/ucenter/member/auth/token-info',
            method: 'get',
        })
    },
    weiboLogin() {
        return request({
            baseURL: 'http://localhost:9999',
            url: '/api/ucenter/member/weibo/login',
            method: 'get',
        })
    }
}