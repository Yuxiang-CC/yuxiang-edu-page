import request from '@/utils/request'
export default {

    // 获取广告推荐，根据广告分类ID【1330418893629464578：首页广告】
    getAdByAdTypeId() {
        return request({
            url: '/api/ams/ad/list/1330418893629464578',
            method: 'Get'
        })
    },
    // 获取首页展示信息
    getIndexData() {
        return request({
            url: '/api/core/index/hot',
            method: 'get'
        })
    }
}