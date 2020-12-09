import request from '@/utils/request'
export default {

    addCollect(courseId) {
        return request({
            url: `/api/core/course-collect/auth/add/${courseId}`,
            method: 'Post',
        })
    },
    cancelCollect(courseId) {
        return request({
            url: `/api/core/course-collect/auth/cancel/${courseId}`,
            method: 'Delete',
        })
    },
    getCollectList() {
        return request({
            url: '/api/core/course-collect/auth/list',
            method: 'get',
        })
    },
    isCollect(courseId) {
        return request({
            url: `/api/core/course-collect/auth/is-collect/${courseId}`,
            method: 'get',
        })
    }

}