<template>
    <div class="app-container">
        <div class="top">
        </div>
        <div class="top-button-div">
            <el-button 
                size="small" 
                type="primary" 
                icon="el-icon-search" 
                @click="handlerSave"
                :disabled="!$hasPermi(['system:menu:add'])">
                新增
            </el-button>
            <el-button 
                size="small" 
                type="success" 
                icon="el-icon-search" 
                @click="changeExpand()">
                展开/折叠所有
            </el-button>
        </div>
        <!-- 树状表格 -->
        <el-table 
            v-if="refreshTable"
            :data="menuData[0].children" 
            size="medium" 
            :header-cell-style="{ background: '#F8F8F9', color: '#000' }"
            style="font-size: 15px; " 
            :default-expand-all="isExpand"
            row-key="id" 
            ref="table">
            <el-table-column prop="menuName" label="菜单名称" align="center" width="250px"></el-table-column>
            <el-table-column prop="icon" label="图标" align="center">
                <template slot-scope="scope">
                    <i :class="scope.row.icon" style="font-size: 18px;"></i>
                </template>
            </el-table-column>
            <el-table-column prop="orderMenu" label="排序" align="center"></el-table-column>
            <el-table-column prop="purview" label="权限标识"></el-table-column>
            <el-table-column label="状态" prop="status" align="center">
                <template slot-scope="scope">
                    <el-switch v-if="$hasPermi(['system:menu:edit'])" v-model.number="scope.row.status" :active-value="1"
                        :inactive-value="0" @change="changestatus(scope.row)">
                    </el-switch>
                    <el-tag v-else :type="scope.row.status ? '' : 'info'">
                        {{ scope.row.status ? "启用" : "停用" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button 
                        size="small" 
                        type="text" 
                        style="font-size: 14px"
                        @click="handlerAdd(scope.row.id)"
                        :disabled="!$hasPermi(['system:menu:add'])">
                        新增
                    </el-button>
                    <el-button 
                        size="small" 
                        type="text" 
                        style="font-size: 14px"
                        @click="handlerEdit(scope.row.id)"
                        :disabled="!$hasPermi(['system:menu:edit'])">
                        编辑
                    </el-button>
                    <el-button 
                    size="small" 
                        type="text"
                        style="font-size: 14px"
                        :disabled="!$hasPermi(['system:menu:del'])"
                        @click="HandlerDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- Dialog -->
        <el-dialog :title="title" :visible.sync="dialogVisible" :modal="false" width="500px">
            <el-form :model="form">
                <!-- 树选择器 -->
                <el-form-item label="上级菜单">
                    <treeselect :options="menuData" :disable-branch-nodes="false" :show-count="true"
                        v-model.number="form.parentId" />
                </el-form-item>
                <el-form-item label="菜单名称">
                    <el-input v-model.trim="form.menuName" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-radio-group v-model.trim="form.menuType">
                        <el-radio :label="'M'">目录</el-radio>
                        <el-radio :label="'C'">菜单</el-radio>
                        <el-radio :label="'B'">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择图标" class="dialog-input" v-if="form.menuType!='B'">
                    <el-select v-model.trim="form.icon" placeholder="请选择图标" :popper-append-to-body="false">
                        <el-option v-for="(icon, index) in iconList" :key="index" :value="icon">
                            <i :class="icon" style="font-size: 30px;"></i>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="侧边栏显示" v-if="form.menuType!='B'">
                    <el-radio-group v-model.trim="form.aside">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否缓存" v-if="form.menuType=='C'">
                    <el-radio-group v-model.trim="form.cache">
                        <el-radio :label="1">缓存</el-radio>
                        <el-radio :label="0">不缓存</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路由地址" v-if="form.menuType!='B'">
                    <el-input v-model.trim="form.path" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="组件位置" v-if="form.menuType == 'C' && form.menuType!='B'">
                    <el-input v-model.trim="form.component" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="组件名称" v-if="form.menuType == 'C' && form.menuType!='B'">
                    <el-input v-model.trim="form.name" autocomplete="off" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" v-if="form.menuType!='M'">
                    <el-input v-model.trim="form.purview" autocomplete="off" class="dialog-input" placeholder="*:*:*"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="form.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        
    </div>
</template>

<script>
import { menuList, addMenu, removeMenu, updateMenu, getMenu } from '@/api/menu';
import icons from '@/config/icon'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
    name: 'Menu',
    components: {
        Treeselect
    },
    created() {
        this.getMenuList()
    },
    data() {
        return {
            // dialog
            dialogVisible: false,
            title: '',
            // 是否展开所有行
            isExpand: false,
            // 是否显示表格
            refreshTable: true,
            // 树选择器
            menuData: [{ id: 0, children: []}],  // 菜单列表
            // 新增表单
            form: {},
            menu: {},
            iconList: icons
        }
    },
    methods: {
        // 将得到的菜单列表转换为树
        getChildren(items, parentId) {
            let children = []
            if (items && items != null && items.lenght != 0) {
                items.forEach(item => {
                    // 比较当前元素的父id是否和指定父 id一样
                    if (item.parentId === parentId) {
                        children.push(item)
                        let c = this.getChildren(items, item.id)
                        if (c.length != 0) {
                            item.children = c
                        }
                    }
                })
            }
            return children
        },
        // 获取菜单列表并转化为菜单树
        getMenuList() {
            menuList().then(response => {
                let data = response.data.data
                data.forEach(item => {
                    item.label = item.menuName
                })
                this.menuData = [{ id: 0, label: '根', children: this.getChildren(data, 0) }]
            }).catch(e=>e)
        },
        submit() {
            if (this.form.id == undefined) {
                addMenu(this.form).then(res => {
                    this.$message.success(res.data.msg)
                    this.getMenuList()
                }).catch(error => this.$message.error(error))
            } else {
                updateMenu(this.form)
                .then(res=>{
                    this.$message.success(res.data.msg)
                    this.getMenuList()
                })
                .catch(error => this.$message.error(error))
            }
            this.dialogVisible = false
        },
        handlerEdit(id) {
            this.getMenuList()
            getMenu(id).then(res => {
                this.form = res.data.data
                this.dialogVisible = true
                this.title = '菜单修改'
            }).catch(e=>e)
        },
        handlerSave() {
            this.reset()
            this.getMenuList()
            this.title = '菜单添加'
            this.dialogVisible = true
        },
        handlerAdd(parentId) {
            this.handlerSave()
            this.form.parentId = parentId
        },
        // 删除单个
        HandlerDelete(index, row) {
            this.$confirm(`是否删除该菜单`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                removeMenu(row.id)
                    .then((res) => {
                        this.getMenuList();
                        this.$message.success(res.data.msg);
                    }).catch((e) => this.$message.error(e));
            }).catch((e) => e);
        },
        reset() {
            this.form = {
                id: undefined,
                parentId: 0,
                menuName: undefined,
                icon: undefined,
                path: undefined,
                component: undefined,
                aside: 1,
                menuType: "C",
                cache: 0,
                status: 1,
                purview: '',
                remark: '',
                orderMenu: undefined
            }
        },
        // 切换表格是否展开折叠
        changeExpand() {
            this.refreshTable = false;
            this.isExpand = !this.isExpand;
            // 将回调延迟到下次 DOM 更新循环之后执行
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        
    }
}
</script>

<style scoped>

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

.top-button-div {
    margin-bottom: 20px;
    font-size: 12px;

}

.dialog-input {
    width: 300px;
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