<template>
    <div class="app-container">
            <div class="top">
          <div class="item">
            <span>角色名称</span>
            <el-input
                class="top-item"
                v-model.trim="params.name"
                size="medium"
                placeholder="输入"
                clearable>
            </el-input>
          </div>
          <div class="item">
            <span>角色标识</span>
            <el-input
                class="top-item"
                v-model.trim="params.key"
                size="medium"
                placeholder="输入"
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
                :disabled="!$hasPermi(['system:role:list'])">
              搜索
            </el-button>
            <el-button size="medium" @click="reset" :disabled="!$hasPermi(['system:role:list'])" >重置</el-button>
          </div>
        </div>
        <div class="import-div">
          <el-button
              size="small"
              plain
              type="primary"
              icon="el-icon-search"
              :disabled="!$hasPermi(['system:role:add'])"
              @click="handleSave">
            新增
          </el-button>
          <el-button
              size="small"
              plain
              type="danger"
              icon="el-icon-search"
              :disabled="!$hasPermi(['system:role:del'])"
              @click="handleDeleteRoles">
            删除
          </el-button>
          <!-- <el-upload
              style="display: inline-block; margin: 0 5px"
              class="upload-demo"
              :disabled="!$hasPermi(['system:role:import'])"
              :action="uploadUrl"
              :show-file-list="false"
              :headers="{ token }"
              :on-success="uploadSuccess">
            <el-button
                size="small"
                plain
                type="primary"
                icon="el-icon-search"
                :disabled="!$hasPermi(['system:role:import'])"
            >导入</el-button>
          </el-upload>
          <el-button
              size="small"
              plain
              type="primary"
              icon="el-icon-search"
              @click="download"
              :disabled="!$hasPermi(['system:role:export'])"
          >导出</el-button> -->
        </div>
        <el-table
        :data="tableData"
        size="medium"
        style="font-size: 15px;"
        :header-cell-style="{ background: '#F8F8F9', color: '#000' }"
        @selection-change="selectRole">
      <el-table-column align="center" type="selection" width="55">
      </el-table-column>
        <el-table-column
          prop="id"
          label="角色id"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="key" label="角色标识"></el-table-column>
        <el-table-column label="状态 " prop="status" align="center">
          <template slot-scope="scope">
            <el-switch
              v-if="$hasPermi(['system:role:edit'])"
              v-model.number="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="changestatus(scope.row)">
            </el-switch>
            <el-tag v-else :type="scope.row.status ? '' : 'info'">
              {{ scope.row.status ? "启用" : "停用" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者"></el-table-column>
        <el-table-column prop="updateBy" label="修改者"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
              type="text"
              style="font-size: 14px"
              v-if="scope.row.key != 'admin'"
              :disabled="!$hasPermi(['system:role:edit'])"
          >编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            style="font-size: 14px"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.key != 'admin'"
            :disabled="!$hasPermi(['system:role:del'])"
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
        <el-dialog title="菜单更新" :visible.sync="dialogUpdateFormVisible" :modal="false" width="600px">
            <el-form :model="role">
                <el-form-item label="角色名称">
                    <el-input v-model.trim="role.name" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="角色标时">
                    <el-input v-model.trim="role.key" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model.trim="role.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <span>菜单权限</span>
                <div style="padding: 5px 5px; border: 1px #D3D3D3 solid; border-radius: 5px;" >
                    <el-tree 
                    :data="menuTree" 
                    show-checkbox 
                    node-key="id" 
                    :default-checked-keys="clickId"
                    check-strictly
                    ref="tree"></el-tree>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUpdateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog
            title="新增角色"
            :visible.sync="dialogSaveFormVisible"
            :modal="false"
            width="500px">
        <el-form :model="form" label-width="80px" :rules="rules">
        <!-- 表单 -->
            <el-form-item label="角色名称">
                <el-input v-model.trim="form.name" autocomplete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="角色标时">
                <el-input v-model.trim="form.key" autocomplete="off" class="dialog-input"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model.trim="form.status">
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <span>菜单权限</span>
            <div style="padding: 5px 5px; border: 1px #D3D3D3 solid; border-radius: 5px;" >
                <el-tree 
                :data="menuTree" 
                show-checkbox 
                node-key="id" 
                :default-checked-keys="form.menuAssignment"
                check-strictly
                ref="tree"></el-tree>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSaveFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { getRoleList, updateRole, getRole, removeRole, saveRole } from '@/api/system/role';
import { getMenuTree, getMenuTreeSelect } from '@/api/system/menu';

export default {
    name: 'Role',
    data() {
        return {
            // dialog
            dialogUpdateFormVisible: false,
            dialogSaveFormVisible: false,
            uploadUrl: "http://localhost:8080/system/role/upload",
            isExpand: false,
            // 新增表单
            form: {},
            role: {},
            menuTree: [],
            // 选择的菜单id
            clickId: [],
            tableData: [],
            value: '',
            defaultProps: {
                children: 'children',
                label: 'label'
            },
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

        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 角色修改
        handleEdit(index, row) {
            this.resetForm()
            getRole(row.id).then(res => {
                this.role = res.data.data
            }).catch(error => error)
            getMenuTreeSelect(row.id).then(res=> {
                this.menuTree = Object.freeze(res.data.data.items)
                this.clickId = Object.freeze(res.data.data.clickId)
            }).catch(e=>e)
            this.dialogUpdateFormVisible = true
        },
        // 角色更新
        update() {
            let checked = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
            updateRole({...this.role, menuAssignment: checked}).then(res => {
                this.$message.success(res.data.msg)
            }).catch(e=>this.$message.error(e))
            this.dialogUpdateFormVisible = false
        },
        // 修改角色状态
        changestatus(row) {
            let text = row.status == 1 ? "启用" : "停用";
            this.$confirm(`是否${text}该角色`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            }).then(() => {
                updateRole({ id: row.id, status: row.status })
                    .then((res) => {
                    this.$message({
                        type: "success",
                        message: res.data.msg,
                    });
                    }).catch(() => {
                    row.status = row.status == 0 ? 1 : 0;
                    });
                }).catch(() => {
                row.status = row.status == 0 ? 1 : 0;
                });
        },
        // 新增按钮
        handleSave() {
            this.resetForm()
            getMenuTree().then(res=> {
                this.menuTree = Object.freeze(res.data.data)
            }).catch(error=>error)
            this.dialogSaveFormVisible = true;
        },
        // 添加角色
        save() {
            let checked = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
            this.form.menuAssignment = checked
            saveRole(this.form)
                .then(() => {
                    this.getList();
                    this.$message.success("保存成功！");
                })
                .catch((e) => this.$message.error(e));
            this.form = {}
            this.dialogSaveFormVisible = false;
        },
        // 分页查询，获取角色信息
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
            getRoleList(this.params)
                .then((response) => {
                    this.tableData = response.data.data.record;
                    this.total = response.data.data.total;
                })
                .catch(e => e);
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
        selectRole(val) {
            this.checked = val.map((item) => Object.freeze(item.id));
        },
        // 删除单个
        handleDelete(index, row) {
            this.$confirm(`是否删除该角色`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.deleteRole(row.id);
            }).catch((e) => e);
        },
        // 批量删除
        handleDeleteRoles() {
            if (this.checked.length != 0)
                this.$confirm(`选中${this.checked.length}条数据，是否删除`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.deleteRole(this.checked);
                }).catch((e) => e);
        },
        // 删除角色
        deleteRole(ids) {
            removeRole(ids)
                .then((res) => {
                    this.clicked = []
                    this.getList();
                    this.$message.success(res.data.msg);
                }).catch((e) => this.$message.error(e));
        },
        // 根据条件分页查询
        search() {
            this.params.page = 1;
            this.getList();
        },
        // 重置参数
        reset() {
            this.params = {
                page: 1,
                pageSize: this.pageSize,
            };
            this.timeList = []
            this.currentPage
            this.getList()
        },
        resetForm() {
            this.form = {
                status: 1
            }
            this.menuTree = [],
            // 选择的菜单id
            this.clickId = []
        },
    },
   

}
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
  @/api/system/menu@/api/system/role