import request from '@/utils/request'


export default{

    addVideo(eduVideo){
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data:eduVideo
          })
    },

    deleteVideo(videoId){
        return request({
            url: `/eduservice/video/${videoId}`,
            method: 'delete',
          })
    },

    selectVideoById(videoId){
        return request({
            url: `/eduservice/video/selectVideoById/${videoId}`,
            method: 'get',
          })
    },

    updateVideo(eduVideo){
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data:eduVideo
          })
    },

    deleteAlilyunVideo(id){
        return request({
            url: `/eduvod/video/deleteAliyunVideo/${id}`,
            method: 'delete',
          })
    }
}
