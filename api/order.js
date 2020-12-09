import request from '~/utils/request'
export default {
    // 创建订单
    createOrder(courseId) {
        return request({
            url: `/api/trade/order/auth/create/${courseId}`,
            method: 'Post'
        })
    },
    // 获取订单信息
    getById(orderId) {
        return request({
            url: `/api/trade/order/auth/get/${orderId}`,
            method: 'get'
        })
    },
    // 是否购买
    isBuy(courseId) {
        return request({
            url: `/api/trade/order/auth/is-buy/${courseId}`,
            method: 'get'
        })
    },
    getList() {
        return request({
            url: '/api/trade/order/auth/list',
            method: 'get'
        })
    },
    removeById(orderId) {
        return request({
            url: `/api/trade/order/auth/remove/${orderId}`,
            method: 'delete'
        })
    }
}