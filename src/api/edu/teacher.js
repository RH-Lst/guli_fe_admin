import request from '@/utils/request'


export default{

    //讲师列表分页条件查询
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            data:teacherQuery
          })
    },
    
    //删除讲师
    deleteTeacherById(id){
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete',
          })
    },

    //添加讲师
    addTeacher(eduTeacher){
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data:eduTeacher
          })
    },

    //讲师信息回显
    getTeacherinfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get',
          })
    },

    //修改讲师
    updateTeacher(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data:teacher
          })
    },
    getList(){
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get',
          })
    }
}
