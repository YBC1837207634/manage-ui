<template>
    <el-form ref="basicInfoForm" :model="info" :rules="rules" label-width="150px">
        <el-row style="font-size: 14px;">
            <el-col :span="12">
                <el-form-item label="表名称" prop="tableName">
                    <el-input placeholder="请输入仓库名称" v-model="info.tableName" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="表描述" prop="tableComment">
                    <el-input placeholder="请输入" v-model="info.tableComment" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="实体类名称" prop="className">
                    <el-input placeholder="请输入" v-model="info.className" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="packageName">
                    <span slot="label">
                        生成包路径
                        <el-tooltip content="生成在哪个java包下，例如 com.example.system" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                    <el-input placeholder="请输入" v-model="info.packageName" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="moduleName">
                    <span slot="label">
                        模块名
                        <el-tooltip content="模块名，例如 /sys/user中的sys" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                    <el-input placeholder="请输入" v-model="info.moduleName" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="businessName">
                    <span slot="label">
                        业务名
                        <el-tooltip content="业务名，例如 /sys/user中的user" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                    <el-input placeholder="请输入" v-model="info.businessName" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="functionName">
                    <span slot="label">
                        功能名
                        <el-tooltip content="用作类描述，例如 用户" placement="top">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </span>
                    <el-input placeholder="请输入" v-model="info.functionName" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="作者" prop="functionAuthor">
                    <el-input placeholder="请输入" v-model="info.functionAuthor" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :rows="3" v-model="info.remark"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
  
<script>
export default {
    props: {
        info: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            rules: {
                tableName: [
                    { required: true, message: "请输入表名称", trigger: "blur" }
                ],
                tableComment: [
                    { required: true, message: "请输入表描述", trigger: "blur" }
                ],
                className: [
                    { required: true, message: "请输入实体类名称", trigger: "blur" }
                ],
                functionAuthor: [
                    { required: true, message: "请输入作者", trigger: "blur" }
                ],
                packageName: [
                    { required: true, message: "请输入生成包路径", trigger: "blur" }
                ],
                moduleName: [
                    { required: true, message: "请输入生成模块名", trigger: "blur" }
                ],
                businessName: [
                    { required: true, message: "请输入生成业务名", trigger: "blur" }
                ],
                functionName: [
                    { required: true, message: "请输入生成功能名", trigger: "blur" }
                ],
            }
        };
    }
};
</script>