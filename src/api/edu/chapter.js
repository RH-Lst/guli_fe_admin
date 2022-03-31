import request from '@/utils/request'


export default{

    getChapterVideo(courseId){
        return request({
            url: `/eduservice/chapter/getChapterAndVideo/${courseId}`,
            method: 'get'
          })
    },

    addChapter(eduChapter){
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data:eduChapter
          })
    },

    selectChapterbyId(chapterid){
        return request({
            url: `/eduservice/chapter/selectChapterbyId/${chapterid}`,
            method: 'get',
          })
    },

    updateChapter(eduChapter){
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method: 'post',
            data:eduChapter
          })
    },

    deleteChapter(chapterid){
        return request({
            url: `/eduservice/chapter/${chapterid}`,
            method: 'delete',
          })
    },
}
