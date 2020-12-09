import request from '@/utils/request'
export default {

    getMemberInfo() {
        return request({
            baseURL: 'http://localhost:9999',
            url: `/api/ucenter/member/info`,
            method: 'get'
        })
    }

}