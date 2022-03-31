<template>
    <div class="app-container">
        <el-form label-width="120px">
            <el-form-item label="讲师名称">
            <el-input v-model="teacher.name"/>
            </el-form-item>
            <el-form-item label="讲师排序">
            <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
            </el-form-item>
            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                <!--
                数据类型一定要和取出的json中的一致，否则没法回填因此，这里value使用动态绑定的值，保证其数据类型是number
                -->
                    <el-option :value="1" label="高级讲师"/>
                    <el-option :value="2" label="首席讲师"/>
                </el-select>
            </el-form-item>
            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career"/>
            </el-form-item>
            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
            </el-form-item>
            <!-- 讲师头像：TODO -->

            <!-- 讲师头像 -->
            <el-form-item label="讲师头像">
            <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload"
                    @click="imagecropperShow=true">更换头像
                </el-button>
                <image-cropper
                    v-show="imagecropperShow"
                    :width="300"
                    :height="300"
                    :key="imagecropperKey"
                    :url="BASE_API+'/eduoss/fileoss'"
                    field="file"
                    @close="close"
                    @crop-upload-success="cropSuccess"/>
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import teacher from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: { ImageCropper, PanThumb },
    data(){
        return{
            teacher: {
            name: '',
            sort: 0,
            level: 1,
            career: '',
            intro: '',
            avatar: ''
            } ,
            saveBtnDisabled: false ,// 保存按钮是否禁用,
            imagecropperShow:false,
            imagecropperKey:0,
            BASE_API:process.env.BASE_API
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
        if (this.$route.params && this.$route.params.id) {
            const id = this.$route.params.id
            this.getinfo(id)
        }else{
            this.teacher = {}
        }
        },

        //回显数据
        getinfo(id){
            teacher.getTeacherinfo(id)
            .then(res => {
                this.teacher = res.data.teacher
            })
        },

        saveOrUpdate() {
            if(this.teacher.id){
                this.updateTeacher()
            }else{
                this.saveTeacher()
            }
            
        },
        // 保存
        saveTeacher() {
            teacher.addTeacher(this.teacher)
            .then(res => {
                this.$message({
                type: 'success',
                message: '保存成功!'
                })
            })
            .then(res =>{
                this.$router.push({path :'/edu/teacher/table'})
            })
        },

        //修改
        updateTeacher(){
            teacher.updateTeacher(this.teacher)
            .then(res => {
                this.$message({
                type: 'success',
                message: '修改成功!'
                })
            })
            .then(res =>{
                this.$router.push({path :'/edu/teacher/table'})
            })
        },

        //关闭上传头像弹窗
        close(){
            this.imagecropperShow=false
            this.imagecropperKey=this.imagecropperKey+1
        },
        //上传头像成功
        cropSuccess(data){
            this.imagecropperShow=false
            this.teacher.avatar=data.url
            this.imagecropperKey=this.imagecropperKey+1
        }
    }
}
</script>