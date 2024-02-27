<template>
    <el-dialog
        title="导入表"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        width="800px"
        :before-close="handleClose">
        <el-form :inline="true" :model="queryParams" label-width="68px" style="font-weight: 600">
            <el-form-item label="表名称" >
                <el-input
                    v-model="queryParams.tableName" 
                    placeholder="请输入表名称"
                    clearable>
                </el-input>
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
        <el-table
            :data="tableData"
            size="mini"
            :header-cell-style="{ background: '#F8F8F9', color: '#000'}"
            @selection-change="handlerSelect"
            style="font-size: 14px; padding-top: 10px;">
            <el-table-column align="center" type="selection" width="55"></el-table-column>
            <el-table-column prop="tableName" align="center" label="表名"></el-table-column>
            <el-table-column prop="tableComment" label="描述信息" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="160"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" align="center" width="160"></el-table-column>
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
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="handlerImport" :disabled="!(tableNames.length > 0)" >导 入</el-button>
            <el-button size="medium" @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getTableList, importTable} from '@/api/tool/generator'
import { Message } from 'element-ui'


export default {
    name: "importTable",
    data() {
        return {
            // dialog
            dialogVisible: false,
            // 数据
            tableData: [],
            // 数据总数
            total: 0,
            // 选中行
            tableNames: [],
            queryParams: {
                tableName: null,
                page: 1,
                pageSize: 10
            },
  
        }
    },
    created() {
        
    },
    methods: {
        getList() {
            getTableList(this.queryParams).then((res)=>{
                this.tableData = res.data.data.record
                this.total = res.data.total
            })
        },
        resetParams() {
            this.queryParams = {
                tableName: null,
                page: 1,
                pageSize: 10
            }
        },
        // 搜索
        handlerQuery() {
            this.queryParams.page = 1
            this.getList()
        },
        // 重置搜索条件
        resetQuery() {
            this.resetParams()
            this.getList()
        },
        handleClose() {
            this.dialogVisible = false
            this.resetParams()
            this.tableData = []
        },
        // 多选
        handlerSelect(val) {
            this.tableNames = val.map((item) => Object.freeze(item.tableName))
            console.log(this.tableNames);
        },
        // 导入表
        handlerImport() {
            let tableNames = this.tableNames.join(",")
            importTable({tableNames}).then(res=>{
                Message.success(res.data.msg)
                this.$emit('success')
                this.handleClose()
            })
        },
        show() {
            this.getList()
            this.dialogVisible = true
        }
    }
}
</script>

<style  scoped>

</style>