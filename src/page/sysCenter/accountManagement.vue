<template>
<div class="content-box">
  <div class="container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="账号名称：">
          <el-input v-model="listQuery.username" placeholder="请输入账号名称" class="filter-item"  />
        </el-form-item>
        <el-form-item label="角色：">
            <el-select class="w-100" v-model="listQuery.roleId"  placeholder="请输入角色">
              <el-option v-for="(item,k) in roleList" :key="k" :label="item.roleName" :value="item.id"/>
            </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
          v-model="listQuery.timeRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="账号持有人：">
          <el-input v-model="listQuery.realName" placeholder="请输入账号持有人" class="filter-item"  />
        </el-form-item>
        <el-form-item label="员工编号：">
          <el-input v-model="listQuery.staffNo" placeholder="请输入员工编号" class="filter-item"  />
        </el-form-item>
      
      </el-form>
      <el-button  class="filter-item" type="primary" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" @click="$common.resetArgs(listQuery);fetchData()">
        重置
      </el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate">
        新增
      </el-button>

    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                @sort-change="changeSort"
                border>
        <el-table-column :label="titleList[0]" align="center"  width="50px">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column :label="titleList[1]" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column :label="titleList[2]" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[3]" align="center">
          <template slot-scope="scope">{{scope.row.realName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[4]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.staffNo}}</template>
        </el-table-column>
        <el-table-column :label="titleList[5]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[6]" align="center">
          <template slot-scope="scope">{{scope.row.updatedName}}</template>
        </el-table-column>
        <el-table-column :label="titleList[7]" align="center" sortable>
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column :label="titleList[8]" align="center">
          <template @click="test" slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom">
              <div @click="changeStatus(scope.row)">
                {{ $common.statusType[scope.row.status - 1 ]}}
                <el-button type="text">
                  <i class="el-icon-edit-outline"></i>
                </el-button>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="titleList[9]" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom">
              <el-button class="text-20" type="text" @click="handleUpdate(scope.row)">
                <i class="el-icon-edit-outline"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="编辑IP白名单" placement="bottom">
              <el-button class="text-20" type="text" @click="handleIPUpdate(scope.row)">
                <i class="el-icon-location-outline"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip content="重置密钥" placement="bottom">
              <el-button class="text-20" type="text" @click="resetPw(scope.row)">
                <i class="el-icon-key"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div v-if="list.length > 0" class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,20,50,100]"
        :total="total">
      </el-pagination>
    </div>

    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="m-t-20 w-100 float-l" ref="dataForm" :rules="rules" :model="modiArgs" label-position="right">
        <el-form-item class="float-l w-input" label-width="130px"  label="账号名称：" prop="username">
          <el-input :disabled='isDisabled' v-model="modiArgs.username" placeholder="请输入账号名称"  />
        </el-form-item>

        <el-form-item v-if="dialogStatus == 'create'" class="float-l w-input" label-width="130px"  label="密码：" prop="password">
          <el-input v-model="modiArgs.password" placeholder="请输入密码" type="password" show-password/>
        </el-form-item>
        <el-form-item v-else class="float-l w-input" label-width="130px"  label="密码：">
          <el-input v-model="modiArgs.password" placeholder="请输入密码" type="password" show-password/>
        </el-form-item>

        <el-form-item class="float-l w-input" label-width="130px"  label="角色权限：" prop="roleId">
          <el-select class="w-100" v-model="modiArgs.roleId"  clearable placeholder="请选择角色权限">
            <el-option v-for="(item,k) in roleList" :key="k" :label="item.roleName" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item class="float-l w-input" label-width="130px"  label="账号持有人：">
          <el-input v-model="modiArgs.realName" placeholder="请输入账号持有人" />
        </el-form-item>

        <el-form-item class="float-l w-input" label-width="130px"  label="员工编号：">
          <el-input v-model="modiArgs.staffNo" placeholder="请输入员工编号"  />
        </el-form-item>
        <el-form-item class="float-l w-input" label-width="130px"  label="状态：" prop="status">
          <el-select class="w-100" v-model="modiArgs.status"  placeholder="请选择状态">
            <el-option v-for="(item,k) in $common.statusType" :key="k" :label="item" :value="k + 1"/>
          </el-select>
        </el-form-item>

        <el-form-item class="float-l w-100" label-width="130px"  label="IP白名单：" prop="whiteIps">
          <el-input :rows="4" type="textarea" v-model="modiArgs.whiteIps" placeholder="请输入多个IP白名单以英文“,”分割" class="w-50" />
        </el-form-item>
        <el-form-item class="float-l w-100" label-width="130px"  label="备注：">
          <el-input :rows="4" type="textarea" v-model="modiArgs.remark" placeholder="请输入备注" class="w-50" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          保存
        </el-button>
      </div>
    </el-dialog>


    <!-- IP编辑 -->
    <el-dialog title="IP白名单编辑" :visible.sync="dialogIPFormVisible">
      <el-form  ref="dataIPForm" :rules="IPRules" :model="modiIPArgs" label-position="right">
          <el-form-item class="w-100" label-width="150px"  label="IP白名单：" prop="whiteIps">
            <el-input :rows="4" type="textarea" v-model="modiIPArgs.whiteIps" placeholder="（多个IP白名单以英文“,”分割）" class="w-50" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogIPFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createIPData()">
          保存
        </el-button>
      </div>
    </el-dialog>


    <googleCode ref="googleCode" @myevent="receiveCode"></googleCode>
  </div>
</div>
</template>

<script>
import * as API from '@/api/sysCenter'

export default {
  data(){
    return{
      isDisabled : false,
      titleList: [
        "序号",
        "账号",
        "角色",
        "账号持有人信息",
        "员工编号",
        "创建时间",
        "最后更新人",
        "最后编辑时间",
        "状态",
        "操作",
      ],

      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        createTimeBy: "",
        staffNoBy : '',
        updateTimeBy : '',
        timeRange:'',
        createStartTime : '',
        createEndTime : '',
        realName : '',
        roleId : '',
        staffNo : '',
        username : '',
      },
      roleList:[],
      dialogStatus: '',
      dialogFormVisible: false,
      dialogIPFormVisible: false,
      list: [],
      total: 0,
      listLoading: true,
      textMap: {
        update: '编辑',
        create: '新增',
      },
      rules: { 
        username: [{ required: true, message: '必填', trigger: 'blur' }],
        password: [{ required: true, message: '必填', trigger: 'blur' }],
        roleId: [{ required: true, message: '必填', trigger: 'blur' }],
        status: [{ required: true, message: '必填', trigger: 'blur' }],
        whiteIps: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
      },
      modiArgs: {
        googleCode: '',
        id: '',
        operate: '',
        password: '',
        realName: '',
        remark: '',
        roleId: '',
        roleName: '',
        staffNo: '',
        status: '',
        username: '',
        whiteIps: '',
      },
      IPRules: {
        whiteIps: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(\,{0,}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}\.{1}[0-9]{1,3}){1,}$/, message: "请输入正确IP和英文逗号隔开", trigger: 'blur'}
        ],
      },
      modiIPArgs: {
        whiteIps : '',
        id : '',
      },
    }
  },
  created() {
    this.fetchData();
    this.getRolesList();
  },
  methods:{
    receiveCode(code) {
        this.modiArgs.googleCode = code
        this.getRoleName()
        let args = this.$common.transferToSearchParams(this.modiArgs)

        API.addAndEditAdmin(args).then(res => {
          if(res.code == 0) {
            this.listQuery.pageNum = 1
            this.fetchData();
            this.dialogFormVisible = false
            this.$refs.googleCode.dialogFormVisible = false
            this.$message.success(res.message)

          } else {
            this.$message.error(res.message)
          }
        })
    },

    getRoleName() {
      for(var i in this.roleList) {
        if(this.roleList[i].id == this.modiArgs.roleId) {
          this.modiArgs.roleName = this.roleList[i].roleName
        }
      }
    },

    createData() {
      this.$refs.dataForm.validate(vaild => {
        if(vaild) {
          this.$refs.googleCode.dialogFormVisible = true
        }
      })
    },

    createIPData() {
      this.$refs.dataIPForm.validate(valid => {
        if(valid) {
          let args = this.$common.transferToSearchParams(this.modiIPArgs)
          API.setWhiteIps(args).then(res => {
            if(res.code == 0) {
              this.listQuery.pageNum = 1
              this.fetchData()
              this.dialogIPFormVisible = false
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      }) 
    },

    handleIPUpdate(row) {
      let newRow = JSON.parse(JSON.stringify(row))
      this.modiIPArgs.whiteIps = newRow.whiteIps
      this.modiIPArgs.id = newRow.id
      this.dialogIPFormVisible = true;
    },
    resetPw(row) {
      var text = "确定重置密钥吗？一旦操作立即生效";
      this.$confirm(text,"提示", {
        cancelButtonText : "取消",
        confirmButtonText : "确定",
        type : 'warning'
      }).then(() => {
        let args =  new URLSearchParams();
        args.append("id", row.id);
        API.resetGoogleKey(args).then(res => {
          if(res.code == 0) {
            this.listQuery.pageNum = 1
            this.fetchData()
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    changeSort(column) { //上架时间排序
      this.listQuery.createTimeBy = ""
      this.listQuery.staffNoBy = ""
      this.listQuery.updateTimeBy = ""

      var args = {
        "descending" : "desc",
        "ascending" : "asc",
      }

      if(column.column.label == this.titleList[4]) {
        this.listQuery.staffNoBy = args[column.order]
      } else if(column.column.label == this.titleList[5]) {
        this.listQuery.createTimeBy = args[column.order]
      } else if(column.column.label == this.titleList[7]) {
        this.listQuery.updateTimeBy = args[column.order]
      }
      
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    changeStatus(row){
      if(row.status == 2) {
        var status = 1;
        var text = "确定启用吗？一旦操作立即生效";
      } else {
        var status = 2;
        var text = "确定禁用吗？一旦操作立即生效";
      }

      this.$confirm(text,"提示", {
        cancelButtonText : "取消",
        confirmButtonText : "确定",
        type : 'warning'
      }).then(() => {
        let args =  new URLSearchParams();
        args.append("id", row.id);
        args.append("status", status);
        API.updateStatus(args).then(res => {
          if(res.code == 0) {
            row.status = status
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },

    handleUpdate(row) {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.dialogFormVisible = true
      this.isDisabled = true
      this.dialogStatus = 'update'

      var nowRow = JSON.parse(JSON.stringify(row))
      this.modiArgs  = nowRow
      this.modiArgs.operate = 2
      this.modiArgs.id = row.id
      
    },

    
    handleCreate() { //添加
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })

      this.modiArgs = {
        googleCode: '',
        id: '',
        operate: 1, //新增
        password: '',
        realName: '',
        remark: '',
        roleId: '',
        roleName: '',
        staffNo: '',
        status: 1, //1启用 2禁用
        username: '',
        whiteIps: '',
      },

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.isDisabled = false
    },



    handleSizeChange(val) {  // 改变列表显示条数
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {  // 改变列表显示页数
      this.listQuery.pageNum = val;
      this.getList();
    },


    handleFilter() { //搜索
      this.listQuery.pageNum = 1
      if(this.listQuery.timeRange != '') {
        this.listQuery.createStartTime = this.listQuery.timeRange[0]
        this.listQuery.createEndTime = this.listQuery.timeRange[1]
      }
      this.fetchData()
    },


    getRolesList() {
      API.getAllRoles().then(res => {
        if(res.code == 0) {
          this.roleList = res.data
        }
      })
    },


    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getAdminManagePage(args).then(res => {
        this.listLoading = false
        if(res.code == 0) {
          this.list = res.data.records
          this.total = res.data.total
        }
      })
    },
  }
}
</script>

<style scoped>


</style>




