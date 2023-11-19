<template>
  <div class="app-container">
    <!-- 顶部搜索区 -->
    <div class="top">
      <div class="item">
        <span>用户名</span>
        <el-input
          class="top-item"
          v-model.trim="params.username"
          size="medium"
          placeholder="输入用户名称"
          clearable
        >
        </el-input>
      </div>
      <div class="item">
        <span>手机号</span>
        <el-input
          class="top-item"
          v-model.trim="params.phone"
          size="medium"
          placeholder="输入手机号"
          clearable
        >
        </el-input>
      </div>
      <div class="item">
        <span>状态</span>
        <el-select
          v-model="params.status"
          placeholder="选择状态"
          class="top-item"
          size="medium"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="demonstration">创建时间</span>
        <el-date-picker
          v-model="timeList"
          size="medium"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="top-item"
          style="width: 300px"
        >
        </el-date-picker>
      </div>
      <div class="item">
        <el-button
          type="primary"
          size="medium"
          @click="search"
          :disabled="!$hasPermi(['system:user:list'])"
          >搜索</el-button
        >
        <el-button size="medium" @click="reset" :disabled="!$hasPermi(['system:user:list'])">重置</el-button>
      </div>
    </div>
    <div class="import-div">
      <el-button
        size="small"
        plain
        type="primary"
        icon="el-icon-search"
        :disabled="!$hasPermi(['system:user:add'])"
        @click="handleSaveUser"
        >新增</el-button
      >
      <el-button
        size="small"
        plain
        type="danger"
        icon="el-icon-search"
        :disabled="!$hasPermi(['system:user:del'])"
        @click="handleDeleteUsers"
        >删除</el-button
      >
      <el-upload
        style="display: inline-block; margin: 0 5px"
        class="upload-demo"
        :disabled="!$hasPermi(['system:user:import'])"
        :action="uploadUrl"
        :show-file-list="false"
        :headers="{ token }"
        :on-success="uploadSuccess"
      >
        <el-button
          size="small"
          plain
          type="primary"
          icon="el-icon-search"
          :disabled="!$hasPermi(['system:user:import'])"
          >导入</el-button
        >
      </el-upload>
      <el-button
        size="small"
        plain
        type="primary"
        icon="el-icon-search"
        @click="download"
        :disabled="!$hasPermi(['system:user:export'])"
        >导出</el-button
      >
    </div>

    <el-table
      :data="tableData"
      size="medium"
      :header-cell-style="{ background: '#F8F8F9', color: '#000' }"
      @selection-change="selectUser"
      style="font-size: 15px;"
    >
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户编号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="mail" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="$hasPermi(['system:user:edit'])"
            v-model.number="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
          <el-tag v-else :type="scope.row.status ? '' : 'info'">{{
            scope.row.status ? "启用" : "停用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            type="text"
            style="font-size: 14px"
            v-if="scope.row.userType != 'S'"
            :disabled="!$hasPermi(['system:user:edit'])"
            >编辑</el-button
          >
          <el-button
            size="small"
            type="text"
            style="font-size: 14px"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.userType != 'S'"
            :disabled="!$hasPermi(['system:user:del'])"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      style="text-align: center; padding-top: 20px"
      @current-change="nextPage"
      @size-change="handleSizeChange"
      :page-size="params.pageSize"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next, sizes, jumper"
      :total="total">
    </el-pagination>
    <!-- Dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="dialogUpdateFormVisible"
      :modal="false"
      width="500px"
    >
      <el-form :model="user" label-width="80px" :rules="rules">
        <el-form-item label="用户昵称">
          <el-input
            v-model.trim="user.nickname"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model.number="user.gender">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model.trim="user.phone"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model.trim="user.mail"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="user.roleIds"
            multiple
            placeholder="选择角色"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value + '@'"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model.number="user.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogSaveFormVisible"
      :modal="false"
      width="500px"
    >
      <el-form :model="form" label-width="80px" :rules="rules">
        <el-form-item label="用户昵称">
          <el-input
            v-model.trim="form.nickname"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model.number="form.gender">
            <el-radio :label="'男'">男</el-radio>
            <el-radio :label="'女'">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model.trim="form.phone"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model.trim="form.mail"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="form.username"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model.trim="form.password"
            autocomplete="off"
            class="dialog-input"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="选择角色"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value + '@@'"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model.number="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  pages,
  updateUser,
  exportUser,
  geyUserById,
  remove,
  saveUser,
} from "@/api/user";
import { getRoleList } from "@/api/role";
import { mapState } from "vuex";
import code from "@/config/code";

export default {
  name: "SysUser",
  data() {
    return {
      // dialog
      dialogUpdateFormVisible: false,
      dialogSaveFormVisible: false,
      uploadUrl: "http://localhost:8080/system/user/upload",
      // 选中的用户
      checked: [],
      // 用户信息
      user: {},
      // 列表信息
      tableData: [],
      // 表单所需角色信息
      roleOptions: [],
      // 新增角色表单
      form: {},
      // 搜索条件
      params: {
        page: 1,
        pageSize: 10,
      },
      pageSize: 10,
      currentPage: 1,
      timeList: [],
      total: 0,
      // 表单校验
      rules: {},
      // 状态
      statusOptions: [
        {
          value: 1,
          label: "启用",
        },
        {
          value: 0,
          label: "停用",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 提交用户表单
    update() {
      updateUser(this.user)
        .then((res) => this.$message.success(res.data.msg))
        .catch(() => this.$message.error("更新失败"));
      this.dialogUpdateFormVisible = false;
    },
    // 根据条件分页查询
    search() {
      this.params.page = 1;
      this.getList();
    },
    // 添加用户
    save() {
      saveUser(this.form)
        .then(() => {
          this.$message.success("保存成功！");
          this.getList();
        })
        .catch((e) => this.$message.error(e));
      this.dialogSaveFormVisible = false;
    },
    // 重置参数
    reset() {
      this.params = {
        page: 1,
        pageSize: this.pageSize,
      };
      this.currentPage = 1;
      this.timeList = [];
      this.getList();
    },
    resetForm() {
      this.form = {
        gender: '男',
        status: 1
      }
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
    // 获取角色列表
    rouleList() {
      getRoleList()
        .then((res) => {
          this.roleOptions = [];
          let roles = res.data.data.record;
          roles.forEach((role) =>
            this.roleOptions.push({ value: role.id, label: role.name })
          );
        })
        .catch((e) => console.log(e));
    },
    // 下一页
    nextPage(currentPage) {
      this.params.page = currentPage;
      this.getList();
    },
    // 选择一页显示数据数量
    handleSizeChange(val) {
      this.params.pageSize = this.pageSize = val;
      this.getList()
    },
    // 多选
    selectUser(val) {
      this.checked = val.map((item) => Object.freeze(item.id));
    },
    // 新增按钮
    handleSaveUser() {
      this.resetForm()
      this.rouleList();
      this.dialogSaveFormVisible = true;
    },
    // 编辑按钮
    handleEdit(index, row) {
      this.resetForm()
      // 获取单个用户信息
      geyUserById(row.id)
        .then((res) => {
          this.rouleList();
          let roles = [];
          this.user = this.roleOptions = roles;
          this.user = res.data.data;
          this.user.roles.forEach((role) => roles.push(role.id));
          this.user.roles = null;
          this.$set(this.user, "roleIds", roles);
        })
        .catch((e) => this.$message.error(e));
        this.dialogUpdateFormVisible = true;
    },
    // 删除单个用户
    handleDelete(index, row) {
      this.$confirm(`是否删除该用户`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteUser(row.id);
        })
        .catch((e) => e);
    },
    // 批量删除用户
    handleDeleteUsers() {
      if (this.checked.length != 0)
        this.$confirm(`选中${this.checked.length}条数据，是否删除`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.deleteUser(this.checked);
          })
          .catch((e) => e);
    },
    // 删除用户
    deleteUser(ids) {
      remove(ids)
        .then((res) => {
          this.clicked = []
          this.getList();
          this.$message.success(res.data.msg);
        })
        .catch((e) => this.$message.error(e));
    },
    // 修改用户状态
    changeStatus(row) {
      let text = row.status == 1 ? "启用" : "停用";
      this.$confirm(`是否${text}该用户`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateUser({ id: row.id, status: row.status })
            .then((res) => {
              this.$message({
                type: "success",
                message: res.data.msg,
              });
            })
            .catch(() => {
              row.status = row.status == 0 ? 1 : 0;
            });
        })
        .catch(() => {
          row.status = row.status == 0 ? 1 : 0;
        });
    },
    // 上传成功调用
    uploadSuccess(response) {
      if (response.code === code.SUCCESS) {
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
    },
    // 用户信息导出
    download() {
      exportUser()
        .then((response) => {
          let reader = new FileReader();
          let _this = this;
          reader.readAsText(response.data);
          reader.onload = function (result) {
            try {
              let resData = JSON.parse(result.target.result); // 解析对象成功，说明是json数据
              _this.$message.error(resData.msg);
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              let blob = new Blob([response.data], {
                //这里的type要和后端一致
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              let url = URL.createObjectURL(blob); //生成一个url
              window.open(url);
            }
          };
        })
        .catch((e) => console.error(e));
    },
  },
  computed: {
    ...mapState("user", ["userInfo", "token"]),
  },
};
</script>
<style  scoped>
.app-container {

}

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
