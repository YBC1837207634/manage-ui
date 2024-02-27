<template>
    <div class="page-container">
        <el-form :inline="true" :model="queryParams" label-width="68px" style="font-weight: 600">
            <el-form-item label="表名称" >
                <el-input
                    v-model="queryParams.tableName" 
                    placeholder="请输入表名称"
                    clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="创建时间" >
                <el-date-picker
                    v-model="timeList"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    class="top-item">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="handlerQuery"
                    :disabled="!$hasPermi(['tool:generator:list'])">
                    搜索</el-button>
                <el-button 
                    @click="resetQuery" 
                    :disabled="!$hasPermi(['tool:generator:list'])">
                    重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作列 -->
        <el-row :gutter="10">
            <el-col :span="1.5">
                <el-button
                    type="warning"
                    plain
                    icon="el-icon-upload2"
                    size="mini"
                    @click="openShow"
                    v-if="$hasPermi(['tool:generator:add'])">
                    导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="success"
                    plain
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleEdit(ids[0])"
                    :disabled="ids.length!=1"
                    v-if="$hasPermi(['tool:generator:edit'])">
                    修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="el-icon-delete"
                    size="mini"
                    @click="handleDeletes"
                    :disabled="!(ids.length>0)"
                    v-if="$hasPermi(['tool:generator:del'])">
                    删除</el-button>
            </el-col>
        </el-row>   
        <!-- 数据展示 -->
        <el-table
            :data="tableData"
            size="mini"
            :header-cell-style="{ background: '#F8F8F9', color: '#000'}"
            @selection-change="handlerSelect"
            style="font-size: 14px; padding-top: 10px;">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="tableId" label="序号" align="center"></el-table-column>
            <el-table-column prop="tableName" align="center" label="表名"></el-table-column>
            <el-table-column prop="tableComment" label="描述信息" align="center"></el-table-column>
            <el-table-column prop="className" label="实体类" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center" width="180"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="handlerPreview(scope.row.tableId)"
                    type="text"
                    style="font-size: 14px"
                    v-if="$hasPermi(['tool:generator:preview'])">
                    预览</el-button>
                <el-button
                    size="mini"
                    @click="handleEdit(scope.row.tableId, scope.row.tableName)"
                    type="text"
                    style="font-size: 14px"
                    v-if="$hasPermi(['tool:generator:edit'])">
                    编辑</el-button>
                <el-button
                    size="mini"
                    type="text"
                    style="font-size: 14px"
                    @click="handleDelete(scope.row)"
                    v-if="$hasPermi(['tool:generator:del'])">
                    删除</el-button>
                <el-button
                    size="mini"
                    type="text"
                    style="font-size: 14px"
                    @click="handleGenCode(scope.row.tableId)"
                    v-if="$hasPermi(['tool:generator:gen'])">
                    生成代码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            background
            style="text-align: center; padding-top: 20px"
            @current-change="getList"
            @size-change="getList"
            :page-size="queryParams.pageSize"
            :current-page.sync="queryParams.page"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next, sizes, jumper"
            hide-on-single-page
            :total="total">
        </el-pagination>

        <!-- 代码预览 -->
        <el-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body>
            <el-tabs v-model="preview.activeName" style="max-height: 70vh; overflow: auto;">
                <el-tab-pane
                    v-for="(value, key) in preview.data"
                    :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
                    :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
                    :key="key"
                >
                <el-link :underline="false" icon="el-icon-document-copy" v-clipboard:copy="value"  v-clipboard:success="clipboardSuccess">复制</el-link>
                <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 导入 -->
        <ImportTable @success="handlerQuery" ref="import"/>
    </div>
</template>

<script>
import { getGenTableList, removeGenTables, previewGenCode, downloadGenCode } from '@/api/tool/generator'
import ImportTable from './importTable.vue'
import { mapActions } from 'vuex';
import { Message } from 'element-ui'
import { saveAs } from 'file-saver';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import java from 'highlight.js/lib/languages/java';
import vue from 'highlight.js/lib/languages/vbscript-html'

// Then register the languages you need
hljs.registerLanguage("java", java);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("vue", vue);
hljs.registerLanguage("javascript", javascript);
// hljs.registerLanguage("sql", sql);


export default {
    name: "Generator",
    components: {
        ImportTable
    },
    data() {
        return {
            // dialog
            dialogVisible: false,
            // 起止时间列表
            timeList: [],
            // 数据
            tableData: [],
            // 数据总数
            total: 0,
            // 选中行
            ids: [],
            queryParams: {
                tableName: null,
                page: 1,
                pageSize: 10
            },
            preview: {
                open: false,
                title: "代码预览",
                data: {},
                activeName: "controller.java"
            }

        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.setDateRange()
            getGenTableList(this.queryParams).then((res)=>{
                this.tableData = res.data.data.record
                this.total = res.data.total
            })
        },
        resetParams() {
            this.queryParams = {
                tableName: null,
                beginTime: null,
                endTime: null,
                page: 1,
                pageSize: 10
            }
        },
        setDateRange() {
            // 起止日期
            if (this.timeList instanceof Array && this.timeList.length > 1) {
                (this.queryParams.beginTime = this.timeList[0]),
                (this.queryParams.endTime = this.timeList[1]);
            }
        },
        // 搜索
        handlerQuery() {
            this.queryParams.page = 1
            this.getList()
        },
        // 重置搜索条件
        resetQuery() {
            this.timeList = []
            this.resetParams()
            this.getList()
        },
        // 多选
        handlerSelect(val) {
            this.ids = val.map((item) => Object.freeze(item.tableId))
        },
        handleEdit(tableId, tableName) {
            this.OpenTag({name: 'GenEdit', path: '/tool/gen-edit/index/'+tableId, title: "修改[" + tableName + "]配置", params: {tableId}} )
            // this.$router.push({name: "GenEdit", params:{tableId}})
        },
        // 删除单个
        handleDelete({tableId}) {
            this.$confirm(`是否删除`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }).then(() => {
                    removeGenTables(tableId).then(()=>{
                        Message.success("删除成功")
                        this.handlerQuery()
                    })
                }).catch((e) => e);
        },
        // 批量删除
        handleDeletes() {
            this.$confirm(`选中${this.ids.length}条数据，是否删除`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                }).then(() => {
                    removeGenTables(this.ids.join(',')).then(()=>{
                        Message.success("删除成功")
                        this.handlerQuery()
                    })
                }).catch((e) => e);
        },
        // 打开导入对话框
        openShow() {
            this.$refs.import.show()
        },
        // 预览代码
        handlerPreview(tableId) {
            previewGenCode(tableId).then(res=>{
                this.preview.data = res.data.data
                this.preview.activeName = "controller.java"
                this.preview.open = true
            })
        },
        // 提示
        clipboardSuccess() {
            this.$message.success("复制成功");
        },
        // 生成代码压缩包文件
        handleGenCode(tableId) {
            downloadGenCode(tableId).then(response => {
               if (response.headers['Content-Type'] !== 'application/json') {
                // 解析成对象失败，说明是正常的文件流
                let blob = new Blob([response.data], {
                    //这里的type要和后端一致
                    // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                saveAs(blob, "code.zip")
               } else {
                    this.$message.error(response.data.msg);
               }
            })
        },
        // 高亮显示
        highlightedCode(code, key) {
            const vmName = key.substring(key.lastIndexOf("/") + 1, key.indexOf(".vm"));
            var language = vmName.substring(vmName.indexOf(".") + 1, vmName.length);
            const result = hljs.highlight(language, code || "", true);
            return result.value || '&nbsp;';
        },
        ...mapActions('permissions', ['OpenTag'])
    }
}
</script>

<style scoped>
.page-container {
    height: 100%;
    width: 100%;
}

</style>