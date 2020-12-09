import request from '@/utils/request'

export default {

    getList(page = 1, size = 8) {
        return request({
            url: `/api/core/teacher/list/${page}/${size}`,
            method: 'get'
        })
    },

    getById(id) {
        return request({
            url: `/api/core/teacher/get/${id}`,
            method: 'get'
        })
    },
    getSimpleById(id) {
        return request({
            url: `/api/core/teacher/get-simple/${id}`,
            method: 'get'
        })
    }
}