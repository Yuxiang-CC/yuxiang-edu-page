import request from '@/utils/request'

export default {

    // 获取直播列表，根据分类
    getLives(category) {
        return request({
            url: '/api/vod/live/list',
            method: 'get',
            params: { "category": category }
        })
    },
    // 获取直播间播放地址
    getLiveInfo(id) {
        return request({
            url: `/api/vod/live/live/${id}`,
            method: 'get'
        })
    },
    // 获取直播间人员信息
    getLiveMembersInfo(liveId) {
        return request({
            url: `/api/mms/chatroom/auth/member/${liveId}`,
            method: 'get'
        })
    }
}