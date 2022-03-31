<template>
    <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="课程最终发布"/>
    </el-steps>
        <el-form label-width="120px">
        <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例:机器学习项目课"/>
        </el-form-item>
        <!-- 所属分类 TODO -->
        <!-- 一级分类 -->
        <el-form-item label="课程类别">
            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="请选择"
                @change="subjecOneChanged"
            >
                <el-option
                    v-for="subject in subjectOnelist"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select> 

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
            <el-option
                v-for="subject in subjectTwolist"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>

        </el-form-item>

        <!-- 课程讲师 TODO -->

        <el-form-item label="课程讲师">
            <el-select
                v-model="courseInfo.teacherId"
                placeholder="请选择">
                <el-option
                    v-for="teacher in teacherList"
                    :key="teacher.id"
                    :label="teacher.name"
                    :value="teacher.id"/>
            </el-select>
        </el-form-item>

        <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="课程总课时"/>
        </el-form-item>
        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>
        <!-- 课程封面 TODO -->

        <!-- 课程封面-->
        <el-form-item label="课程封面">
            <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/eduoss/fileoss/file'"
                class="avatar-uploader">
                <img :src="courseInfo.cover">
            </el-upload>
        </el-form-item>

        <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placehol="课程价格" />
        </el-form-item>
        <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrupdate">保存并下一步</el-button>
        </el-form-item>
        </el-form>
    </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default {
    components: { Tinymce },
    data(){
        return{
            saveBtnDisabled:false,
            courseInfo:{
                title: '',
                subjectId: '',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: 'https://edu-guli-img0216.oss-cn-beijing.aliyuncs.com/CourseImg/default/defaultimg.jpg',
                price: 0
            },
            teacherList:[],
            subjectOnelist:[],
            subjectTwolist:[],
            BASE_API: process.env.BASE_API,
            courseId:''
        }
    },
    created(){
        this.init()
    },

    watch: {
    $route(to, from) {
        this.init()
        }
    },

    methods:{

        init(){
            
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getCourseInfo()
        }else{
                this.courseInfo = {
                title: '',
                subjectId: '',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: 'https://edu-guli-img0216.oss-cn-beijing.aliyuncs.com/CourseImg/default/defaultimg.jpg',
                price: 0
            }
            this.findAllteacher()
            this.getSubject()
        }
        },

        //回显数据
        getCourseInfo(){
            course.getCourseInfo(this.courseId)
            .then(res => {
                this.courseInfo = res.data.courseinfo
                subject.getAllsubjectlist()
                .then(res =>{
                    this.subjectOnelist = res.data.list
                    for (var i = 0; i < this.subjectOnelist.length; i++) {
                        if (this.subjectOnelist[i].id === this.courseInfo.subjectParentId) {
                        this.subjectTwolist = this.subjectOnelist[i].children
                    }
                }
                })
                this.findAllteacher()
            })
        },

        addCourse(){
            course.addCourse(this.courseInfo)
            .then(res => {
                //提示信息
                this.$message({
                type: 'success',
                message: '添加课程成功'
                })
                //跳转
                this.$router.push({path : '/edu/course/chapter/'+res.data.courserId})
            })
        },

        updateCourse(){
            course.updateCourseInfo(this.courseInfo)
            .then(res => {
                //提示信息
                this.$message({
                type: 'success',
                message: '修改课程成功'
                })
                //跳转
                this.$router.push({path : '/edu/course/chapter/'+this.courseId})
            })
        },


        saveOrupdate(){
            if(this.courseInfo.id){
                this.updateCourse()
            }else{
                this.addCourse()
            }
        },

        findAllteacher(){
            course.findAll()
            .then(res => {
                this.teacherList = res.data.items
            })
        },

        getSubject(){
            subject.getAllsubjectlist()
            .then(res => {
                this.subjectOnelist = res.data.list
            })
        },
        subjecOneChanged(value){
            for (var i = 0; i < this.subjectOnelist.length; i++) {
                if (this.subjectOnelist[i].id === value) {
                    this.subjectTwolist = this.subjectOnelist[i].children
                    this.courseInfo.subjectId = ''
                }
            }
        },

        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },

        beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
        }
    }
}
</script>
<style scoped>
.tinymce-container {
line-height: 29px;
}
</style>