import request from '@/utils/request'
export default {

    getList(searchObj) {
        return request({
            url: '/api/core/course/list',
            method: 'get',
            params: searchObj
        })
    },

    getSubjectNestedList() {
        return request({
            url: '/api/core/subject/nested-list',
            method: 'get'
        })
    },

    getById(id) {
        return request({
            url: `/api/core/course/get/${id}`,
            method: 'get'
        })
    },

    getPlayAuth(vid) {
        return request({
            url: `/api/vod/video/video-play-auth/${vid}`,
            method: 'get'
        })
    }
}