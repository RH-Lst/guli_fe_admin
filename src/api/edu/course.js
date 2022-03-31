import request from '@/utils/request'


export default{

    //添加课程
    addCourse(courseInfo){
        return request({
            url: `/eduservice/course/addCourse`,
            method: 'post',
            data: courseInfo
          })
    },

        //查询所有讲师
        findAll(){
            return request({
                url: `/eduservice/teacher/findAll`,
                method: 'get',
              })
        },

        //获取课程信息，回显数据
        getCourseInfo(id){
            return request({
                url: `/eduservice/course/getCourseInfo/${id}`,
                method: 'get',
              })
        },
        //修改课程信息
        updateCourseInfo(courseInfo){
            return request({
                url: `/eduservice/course/updateCourseInfo`,
                method: 'post',
                data:courseInfo
              })
        },

        getPublishCourseInfo(id){
            return request({
                url: `/eduservice/course/getPublishCourseInfo/${id}`,
                method: 'get'
              })

        },

        publishCourse(id){
            return request({
                url: `/eduservice/course/publishCourse/${id}`,
                method: 'post'
              })

        },

        getPagelist(current,limit,courseQuery){
            return request({
                url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
                method: 'post',
                data:courseQuery
              })
        },
        deleteCourseById(courseid){
            return request({
                url: `/eduservice/course/${courseid}`,
                method: 'delete',
              })
        }
    
}
