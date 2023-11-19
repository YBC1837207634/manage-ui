<template>
  <div class="app-container">
    <!-- 顶部搜索区 -->
    <div class="top">
      <div class="item">
        <span>标题</span>
        <el-input class="top-item" v-model.trim="params.title" size="medium" clearable>
        </el-input>
      </div>
      <div class="item">
        <span>业务类型</span>
        <el-select v-model="params.businessType" placeholder="选择类型" class="top-item" size="medium"
          :popper-append-to-body="false">
          <el-option v-for="item in businessOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span>操作状态</span>
        <el-select v-model="params.status" placeholder="选择状态" class="top-item" size="medium"
          :popper-append-to-body="false">
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
      <el-button size="small" plain type="danger" icon="el-icon-search" :disabled="!$hasPermi(['system:operLog:del'])"
        @click="handleDeleteOperLogs">
        删除
      </el-button>
      <el-button size="small" plain type="danger" icon="el-icon-search" :disabled="!$hasPermi(['system:operLog:del'])"
        @click="handleDeleteAll">
        清空
      </el-button>
    </div>

    <el-table :data="tableData" size="medium" :header-cell-style="{ background: '#F8F8F9', color: '#000' }"
      style="font-size: 15px;" @selection-change="selectOperLog">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="日志编号" width="100" align="center"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="businessType" label="业务类型">
        <template slot-scope="scope">
          <el-tag :type="businessView[scope.row.businessType].tag" size="medium">
            {{ businessView[scope.row.businessType].name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="requestMethod" label="请求方式"></el-table-column>
      <el-table-column prop="operName" label="操作人员"></el-table-column>
      <el-table-column prop="operIp" label="主机地址"></el-table-column>
      <el-table-column prop="operLocation" label="操作地点"></el-table-column>
      <el-table-column label="操作状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="medium">
            {{ scope.row.status ? "正常" : "异常" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operTime" width="200" label="操作时间"></el-table-column>
      <el-table-column prop="costTime" label="消耗时间"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="showInfo(scope.$index, scope.row)" type="text" style="font-size: 16px"
            :disabled="!$hasPermi(['system:operLog:list'])">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background style="text-align: center; padding-top: 20px" @current-change="nextPage"
      @size-change="handleSizeChange" :page-size="params.pageSize" :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]" layout="total, prev, pager, next, sizes, jumper" :total="total">
    </el-pagination>
    <!-- Dialog -->
    <el-dialog title="详情" :visible.sync="dialog" :modal="false">
      <div class="logDetails">
        <form class="el-form">
          <div class="el-row">
            <div class="el-col el-col-12">
              <div class="el-form-item el-form-item--mini">
                <label class="el-form-item__label" style="width: 100px;">操作模块：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.title }}</div>
              </div>
              <div class="el-form-item el-form-item--mini">
                <label class="el-form-item__label" style="width: 100px;">登录信息：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.operLocation }}</div>
              </div>
            </div>
            <div class="el-col el-col-12">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">请求地址：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.operUrl }}</div>
              </div>
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">请求方式：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.requestMethod }}</div>
              </div>
            </div>
            <div class="el-col el-col-24">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">操作方法：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                  {{ logDetails.method }}</div>
              </div>
            </div>
            <div class="el-col el-col-24">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">请求参数：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.operParam }}</div>
              </div>
            </div>
            <div class="el-col el-col-24">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">返回参数：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.jsonResult }}</div>
              </div>
            </div>
            <div class="el-col el-col-6">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">操作状态：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">
                  <div>{{ logDetails.status == 1 ? '正常' : '异常' }}</div>
                </div>
              </div>
            </div>
            <div class="el-col el-col-8">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">消耗时间：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.costTime }}</div>
              </div>
            </div>
            <div class="el-col el-col-10">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">操作时间：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.operTime }}</div>
              </div>
            </div>
            <div class="el-col el-col-8">
              <div class="el-form-item el-form-item--mini"><label class="el-form-item__label"
                  style="width: 100px;">错误信息：</label>
                <div class="el-form-item__content" style="margin-left: 100px;">{{ logDetails.errorMsg }}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <el-button @click="dialog = false">关闭</el-button>
    </el-dialog>

  </div>
</template>

<script>
import {
  pages,
  removeOperLog,
  removeOperLogAll
} from "@/api/operLog";

export default {
  name: "OperLog",
  data() {
    return {
      // dialog
      dialog: false,
      currentPage: 1,
      // 列表信息
      tableData: [],
      logDetails: {},
      clicked: [],
      // 搜索条件
      params: {
        page: 1,
        pageSize: 10,
      },
      pageSize: 10,
      timeList: [],
      total: 0,
      // 状态
      statusOptions: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 0,
          label: "异常",
        },
      ],
      // 业务类型
      businessOptions: [
        {
          value: 0,
          label: "其他",
        },
        {
          value: 1,
          label: "插入",
        },
        {
          value: 2,
          label: "修改"
        },
        {
          value: 3,
          label: "删除"
        },
      ],
      businessView: [
        {
          name: '其他',
          tag: "info",
        },
        {
          name: '插入',
          tag: '',
        },
        {
          name: '修改',
          tag: "warning"
        },
        {
          name: '删除',
          tag: "danger"
        },
      ]
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
    // 重置查询条件
    reset() {
      this.params = {
        page: 1,
        pageSize: this.pageSize
      };
      this.currentPage = 1
      this.timeList = []
      this.getList()
    },
    // 选择一页显示数据数量
    handleSizeChange(val) {
      this.params.pageSize = this.pageSize = val;
      this.getList()
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
        }).catch(e => e);
    },
    // 下一页
    nextPage(currentPage) {
      this.params.page = currentPage;
      this.getList();
    },
    showInfo(index) {
      this.logDetails = this.tableData[index]
      this.dialog = true
    },
    // 多选
    selectOperLog(val) {
      this.checked = val.map((item) => Object.freeze(item.id));
    },
    // 批量删除
    handleDeleteOperLogs() {
      if (this.checked.length != 0)
        this.$confirm(`选中${this.checked.length}条数据，是否删除`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.deleteOperLog(this.checked);
        }).catch((e) => e);
    },
    handleDeleteAll() {
      this.$confirm(`是否删除所有记录`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        removeOperLogAll().then((res) => {
          this.getList();
          this.$message.success(res.data.msg);
        }).catch((e) => this.$message.error(e));
      }).catch((e) => e);
    },
    // 删除登陆记录
    deleteOperLog(ids) {
      removeOperLog(ids)
        .then((res) => {
          this.clicked = []
          this.getList();
          this.$message.success(res.data.msg);
        }).catch((e) => this.$message.error(e));
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

.top>.item {
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

::v-deep .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: silver;
  border-radius: 3px;
}

::v-deep .el-table--scrollable-x .el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::v-deep .el-select-dropdown__wrap.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}
</style>
