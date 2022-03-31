import request from '@/utils/request'


export default{

    //课程分类查询
    getAllsubjectlist(){
        return request({
            url: `/eduservice/subject/getAllsubject`,
            method: 'get',
          })
    },
}
