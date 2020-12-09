import request from '~/utils/request'
export default {
    // 支付宝支付
    aliPay(orderNo) {
        return request({
            url: `/api/trade/pay/auth/pay`,
            method: 'post',
            data: { orderNo }
        })
    }

}