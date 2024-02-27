<template>
  <div class="app-container">
    <!-- 顶部搜索区 -->
    <div class="top">
      <div class="item">
          <span>用户账号</span>
          <el-input
              class="top-item"
              v-model.trim="params.userName"
              size="medium"
              placeholder="帐号"
              clearable>
          </el-input>
        </div>
      <div class="item">
        <span>登陆状态</span>
        <el-select v-model="params.status" placeholder="选择登陆状态" class="top-item" size="medium" :popper-append-to-body="false">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="demonstration">操作时间</span>
        <el-date-picker v-model="timeList" size="medium" type="daterange" range-separator="至" value-format="yyyy-MM-dd"
          start-placeholder="开始日期" end-placeholder="结束日期" class="top-item" style="width: 300px">
        </el-date-picker>
      </div>
      <div class="item">
        <el-button type="primary" size="medium" @click="search"
          :disabled="!$hasPermi(['system:operLog:list'])">搜索</el-button>
        <el-button size="medium" @click="reset" :disabled="!$hasPermi(['system:operLog:list'])">重置</el-button>
      </div>
    </div>
    <div class="import-div">
      <el-button
        size="small"
        plain
        type="danger"
        icon="el-icon-search"
        :disabled="!$hasPermi(['system:operLog:del'])"
        @click="handleDeleteLogininfors">
        删除
        </el-button>
        <el-button
        size="small"
        plain
        type="danger"
        icon="el-icon-search"
        :disabled="!$hasPermi(['system:operLog:del'])"
        @click="handleDeleteAll">
        清空
        </el-button>
    </div>

    <el-table
        style="font-size: 15px;"
        :data="tableData"
        size="medium"
        :header-cell-style="{ background: '#F8F8F9', color: '#000' }"
        @selection-change="selectLogininfor"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="userName" label="用户账号"></el-table-column>
        <el-table-column prop="ipaddr" label="登录IP地址"></el-table-column>
        <el-table-column prop="loginLocation" label="登录地点"></el-table-column>
        <el-table-column prop="browser" label="浏览器类型"></el-table-column>
        <el-table-column prop="os" label="操作系统"></el-table-column>
        <el-table-column label="登录状态" prop="status"  align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'" size="medium">
              {{ scope.row.status === '1' ? "成功" : "失败" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="提示消息"></el-table-column>
        <el-table-column prop="loginTime" sortable label="访问时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        background
        style="text-align: center; padding-top: 20px"
        @current-change="nextPage"
        @size-change="handleSizeChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next, sizes, jumper"
        :total="total">
    </el-pagination>

  </div>
</template>

<script>
  import {
    pages,
    removeLogininfor,
    removeLogininforAll
  } from "@/api/system/logininfor";

  export default {
    name: "Logininfor",
    data() {
      return {
        // dialog
        dialog: false,
        // 选中的登陆记录
        checked: [],
        PageSize: 10,
        // 列表信息
        tableData: [],
        // 搜索条件
        params: {
          page: 1,
          pageSize: 10,
        },
        // 当前页数
        currentPage: 1,
        timeList: [],
        total: 0,
        // 表单校验
        rules: {},
        // 状态
        statusOptions: [
          {
            value: 1,
            label: "成功",
          },
          {
            value: 0,
            label: "失败",
          },
        ],
      };
    },
    created() {
      this.getList();
    },
    methods: {
      // 根据条件分页查询
      search() {
        this.params.page = 1;
        this.getList();
      },
      // 重置搜索条件
      reset() {
        this.params = {
          page: 1,
          pageSize: this.pageSize
        };
        this.currentPage = 1;
        this.timeList = [];
        this.getList();
      },
      getList() {
        Object.keys(this.params).forEach((key) => {
          if (this.params[key] === "") {
            this.params[key] = null;
          }
        });
        // 起止日期
        if (this.timeList instanceof Array && this.timeList.length > 1) {
          (this.params.beginTime = this.timeList[0]),
              (this.params.endTime = this.timeList[1]);
        }
        pages(this.params)
            .then((response) => {
              this.tableData = response.data.data.record;
              this.total = response.data.data.total;
            })
            .catch(e=>e);
      },
      // 下一页
      nextPage(currentPage) {
        this.params.page = currentPage;
        this.getList();
      },
      // 选择一页显示数据数量
      handleSizeChange(val) {
        console.log(val);
        this.params.pageSize = this.pageSize = val;
        this.getList()
      },
      // 多选
      selectLogininfor(val) {
        this.checked = val.map((item) => Object.freeze(item.id));
      },
      // 批量删除
      handleDeleteLogininfors() {
        if (this.checked.length != 0)
          this.$confirm(`选中${this.checked.length}条数据，是否删除`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
              this.deleteLogininfor(this.checked);
            }).catch((e) => e);
      },
      // 删除登陆记录
      deleteLogininfor(ids) {
        removeLogininfor(ids)
            .then((res) => {
              this.clicked = []
              this.getList();
              this.$message.success(res.data.msg);
            }).catch((e) => this.$message.error(e));
      },
      handleDeleteAll() {
        this.$confirm(`是否删除所有记录`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            removeLogininforAll().then((res) => {
              this.getList();
              this.$message.success(res.data.msg);
          }).catch((e) => this.$message.error(e));
            }).catch((e) => e);
      },
      }
  };
</script>
<style  scoped>
  .top {
    /* margin: 20px 0; */
    font-size: 12px;
    font-weight: bold;
  }

  .top > .item {
    display: inline;
    padding: 0px 10px;
  }

  .top-item {
    /* float: left; */
    width: 200px;
    margin-left: 8px;
  }

  .import-div {
    margin: 20px 0;
    font-size: 12px;
  }

  .upload-demo {
    margin: 0 8px !important;
  }

  ::v-deep .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::v-deep
  .el-table--scrollable-x
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: silver;
    border-radius: 3px;
  }

  ::v-deep
  .el-table--scrollable-x
  .el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  ::v-deep .el-select-dropdown__wrap.el-scrollbar__wrap {
    margin-bottom: 0 !important;
  }
</style>
@/api/system/logininfor