<template>
    <div class="app-container">
        <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;"/>
            <el-tree
                ref="subjectTree"
                :data="subjectListdata"
                :props="defaultProps"
                :filter-node-method="filterNode"
                class="filter-tree"
                default-expand-all/>
    </div>
</template>
<script>
import subject from '@/api/edu/subject'
export default {
    data() {
            return {
                filterText: '',
                subjectListdata: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
            }
            }
        },
    watch: {
        filterText(val) {
            this.$refs.subjectTree.filter(val)
        }
    },
    created() {
        this.getallSubject()
    },
    methods: {
        getallSubject() {
            subject.getAllsubjectlist().
            then(res => {
                this.subjectListdata = res.data.list
            })
        },
        filterNode(value, data) {
            if (!value) return true
            return data.title.indexOf(value) !== -1
        }
    }
}
</script>