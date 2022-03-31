<template>
    <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="课程最终发布"/>
        </el-steps>

            <el-button type="text" @click="openChapterdialog">添加章节</el-button>
            <!-- 章节 -->
            <ul class="chanpterList">
                <li
                    v-for="chapter in chaptervideolist"
                    :key="chapter.id">
                    <p>
                        {{ chapter.title }}
                        <span class="acts">
                            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
                            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                        </span>
                    </p>
                <!-- 视频 -->
                <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>
                        {{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                    </span>
                    </p>
                </li>
                </ul>
                </li>
            </ul>

        <el-form label-width="120px">
            <el-form-item>
                <el-button @click="previous">上一步</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
            </el-form-item>
        </el-form>

        <!-- 添加和修改章节表单 -->
            <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
                <el-form :model="chapter" label-width="120px">
                <el-form-item label="章节标题">
                    <el-input v-model="chapter.title"/>
                </el-form-item>
                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
                </div>
            </el-dialog>


            <!-- 添加和修改课时表单 -->
            <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
                <el-form :model="video" label-width="120px">
                    <el-form-item label="课时标题">
                        <el-input v-model="video.title"/>
                    </el-form-item>
                    <el-form-item label="课时排序">
                        <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                    </el-form-item>
                    <el-form-item label="是否免费">
                        <el-radio-group v-model="video.free">
                        <el-radio :label="true" >免费</el-radio>
                        <el-radio :label="false">默认</el-radio>
                        </el-radio-group>
                    </el-form-item>

                <el-form-item label="上传视频">
                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API+'/eduvod/video/uploadAliVideo'"
                        :limit="1"
                        class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
                </el-form-item>


                </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
            </div>
            </el-dialog>

    </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
    data(){
        return{
            saveBtnDisabled:false,
            courseId:'',
            chaptervideolist:[],
            chapter:{
                title: '',
                sort: 0
            },
            dialogChapterFormVisible:false,
            saveVideoBtnDisabled: false, // 课时按钮是否禁用
            dialogVideoFormVisible: false, // 是否显示课时表单
            chapterId: '', // 课时所在的章节id
            video: {// 课时对象
            title: '',
            sort: 0,
            free: 0,
            videoSourceId: '',
            videoOriginalName:''
            },
            fileList: [],//上传文件列表
            BASE_API: process.env.BASE_API // 接口API地址
        }
    },
    created(){
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getChapterVideo()
        }
    },
    methods:{
//=================小节操作部分======================//

        //删除前确认
        beforeVodRemove(file,fileList){
            return this.$confirm(`确定移除 ${file.name}?`)
        },
        //确认删除调用
        handleVodRemove(file,fileList){
            video.deleteAlilyunVideo(this.video.videoSourceId)
            .then(res =>{
                this.$message({
                        type: 'success',
                        message: '删除视频成功!'
                        });
                //清空文件列表
                this.fileList={}
                //清空视频id
                this.video.videoSourceId=''
                //清空视频名称
                this.video.videoOriginalName=''
            })
        },
        //成功回调
        handleVodUploadSuccess(response, file, fileList) {
        this.video.videoSourceId = response.data.vdeioid
        this.video.videoOriginalName = file.name
        },
        //视图上传多于一个视频
        handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },

        editVideo(videoId){
            this.dialogVideoFormVisible = true
            video.selectVideoById(videoId)
            .then(res => {
                this.video = res.data.eduVideo
            })
        },

        deleteVideo(videoId){
            this.$confirm('此操作将永久删除该小节记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    video.deleteVideo(videoId)
                    .then(res =>{
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    this.getChapterVideo()
                    })
        })
        },

        openVideo(chapterid){

            this.dialogVideoFormVisible = true

            this.video={
                title: '',
                sort: 0,
                free: 0,
                videoSourceId: '',
            }


            this.video.chapterId = chapterid

            this.video.courseId = this.courseId

        },

        addVideo(){
            this.video.courseId = this.courseId
            video.addVideo(this.video)
            .then(res => {
            //关闭弹窗
            this.dialogVideoFormVisible = false
            //提示信息
                this.$message({
                type: 'success',
                message: '添加成功'
                })
            //刷新页面
            this.getChapterVideo() 
            })
        },

        updateVideo(){
            this.video.courseId = this.courseId
            video.updateVideo(this.video)
            .then(res => {
            //关闭弹窗
            this.dialogVideoFormVisible = false
            //提示信息
                this.$message({
                type: 'success',
                message: '修改成功'
                })
            //刷新页面
            this.getChapterVideo() 
            })
        },
        saveOrUpdateVideo(){
            if(this.video.id){
                this.updateVideo()
            }else{
                this.addVideo()
            }
            
        },
//=================章节操作部分======================//
        removeChapter(chapterid){
            this.$confirm('此操作将永久删除该章节记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    chapter.deleteChapter(chapterid).then(res =>{
                        this.$message({
                        type: 'success',
                        message: '删除成功!'
                        });
                    this.getChapterVideo()
                    })
        })
        },

        editChapter(chapterid){
            this.dialogChapterFormVisible = true
            chapter.selectChapterbyId(chapterid)
            .then(res => {
                this.chapter = res.data.eduChapter
            })
        },

        //打开弹窗
        openChapterdialog(){
            this.dialogChapterFormVisible = true
            this.chapter={
                title: '',
                sort: 0
            }
        },

        addChapter(){
            //加入课程id
            this.chapter.courseId = this.courseId
            chapter.addChapter(this.chapter)
            .then(res => {
            //关闭弹窗
            this.dialogChapterFormVisible = false
            //提示信息
                this.$message({
                type: 'success',
                message: '添加成功'
                })
            //刷新页面
            this.getChapterVideo() 
            })
        },
        updateChapter(){
            chapter.updateChapter(this.chapter)
            .then(res => {
            //关闭弹窗
            this.dialogChapterFormVisible = false
            //提示信息
                this.$message({
                type: 'success',
                message: '修改成功'
                })
            //刷新页面
            this.getChapterVideo() 
            })
        },
        saveOrUpdate(){
            if(this.chapter.id){
                this.updateChapter()
            }else{
                this.addChapter()
            }
            
        },

        previous(){
            this.$router.push({path : '/edu/course/info/'+this.courseId})
        },

        next(){
            this.$router.push({path : '/edu/course/publish/'+this.courseId})
        },

        getChapterVideo(){
            chapter.getChapterVideo(this.courseId).
            then(res => {
                this.chaptervideolist = res.data.list
            })
        }

    }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
    position: relative;
}
.chanpterList p{
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}
.videoList{
    padding-left: 50px;
}
.videoList p{
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
}
</style>