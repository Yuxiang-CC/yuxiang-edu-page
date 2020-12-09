import axios from 'axios'
import { Message } from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:9600',
    timeout: 20000, // 请求超时时间
})

// http request 拦截器
service.interceptors.request.use(
    config => {
        // 连接请求，当获取到浏览器token信息时，将token放到header中随请求发送到服务端
        if (cookie.get('Yuxiang-edu-token')) {
            config.headers['Yuxiang-edu-token'] = cookie.get('Yuxiang-edu-token')
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data

        // 42333 在后端定义为：用token解析用户信息失败【即token是错误的】
        if (res.code === 42333) {
            // 清除cookie
            cookie.set('Yuxiang-edu-token', '', { domain: 'localhost' })
            Message({
                message: res.message || 'error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('error')
        } else if (res.code === 42222) {
            // 跳转到登录界面
            window.location.href = "/login"
            return Promise.reject('error')
        } else if (res.code === 22222) {
            // 跳转到首页
            cookie.set('Yuxiang-edu-token', res.data.token, { domain: 'localhost' })
            window.location.href = "/"
            return Promise.reject('error')
        } else if (res.code !== 20000) {
            Message({
                message: res.message || 'error',
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err：' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service