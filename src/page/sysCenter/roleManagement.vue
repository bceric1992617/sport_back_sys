<template>
<div class="content-box">
  <div class="container">
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="角色名称：">
        <el-input v-model="listQuery.roleName" placeholder="请输入角色名称" class="filter-item"  />
      </el-form-item>
    </el-form>
    <el-button  class="filter-item" type="primary" @click="handleFilter">
      查询
    </el-button>
    <el-button  class="filter-item" @click="$common.resetArgs(listQuery);fetchData()">
      重置
    </el-button>
    <el-button class="filter-item" type="primary" @click="handleCreate">
      创建角色
    </el-button>

    <div class="table-container">
      <el-table ref="Table1"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column label="序列号" align="center"  width="70px">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">{{scope.row.roleName}}</template>
        </el-table-column>
        <el-table-column label="最后更新人" align="center">
          <template slot-scope="scope">{{scope.row.updatedName}}</template>
        </el-table-column>
        <el-table-column label="最后更新时间" align="center">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="bottom">
              <el-button class="text-20" type="text" @click="handleUpdate(scope.row)">
                <i class="el-icon-edit-outline"></i>
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
      <el-form  ref="dataForm" :rules="rules" :model="modiArgs" label-position="right">
          <el-form-item class="w-input"  label-width="100px"  label="角色名称：" prop="roleName">
            <el-input v-model="modiArgs.roleName" placeholder="请输入角色名称"  />
          </el-form-item>
      </el-form>

      <div class="authMenu">
        <div v-for="item,k in authList" :key='k' >
          <div v-if="Object.keys(authList[k].children).length > 0" class="authMenuList">
            <el-checkbox-group class="level1" v-model="checkedAuthList[k].checkList"  >
              <el-checkbox @change="checkStatus($event, k)" :label="authList[k].id">{{ authList[k].name }}</el-checkbox>
            </el-checkbox-group>
          
            <el-checkbox-group class="level2" v-model="checkedAuthList[k].checkAuthList">
              <el-checkbox @change="checkChildStatus($event, k)" v-for="value,index in authList[k].children" :key='index' :label="value.id">{{ value.name }}</el-checkbox>
            </el-checkbox-group>
          </div>

        </div>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</div>
</template>

<script>
import * as API from '@/api/sysCenter'

export default {

  data(){
    return{
      listQuery: {
        pageNum: 1,
        pageSize: this.$common.defaultPage,
        roleName: "",
      },
      modiArgs: {
        permissionIds : '',
        roleId : '',
        roleName : '',
      },
      rules: { 
        roleName: [{ required: true, message: '必填', trigger: 'blur' }],
      },
      textMap: {
        update: '编辑',
        create: '新增',
      },
      dialogStatus: '',
      dialogFormVisible: false,

      list: [],
      authList: [],
      checkedAuthList:[],
      total: 0,
      listLoading: true,
      
    }
  },
  created() {
    this.fetchData();
    this.getAllAuth();
  },
  methods:{
    checkStatus(e,k) {
      if(!e) {
        this.$set(this.checkedAuthList[k],'checkList',[])
        this.$set(this.checkedAuthList[k],'checkAuthList',[])
      }
    },
    checkChildStatus(e,k) {
      if(e) {
        this.checkedAuthList[k]['checkList'].push(this.authList[k].id)
      } else {
        if(this.checkedAuthList[k]['checkAuthList'].length == 0) {
          this.$set(this.checkedAuthList[k],'checkList',[])
        }
      }
    },
    createData() {
      this.$refs.dataForm.validate(vaild => {
        if(vaild) {
          this.modiArgs.permissionIds = ''
          for(var i in this.checkedAuthList) {
            if(this.checkedAuthList[i]['checkList'].length > 0) {
              this.modiArgs.permissionIds += "," + this.checkedAuthList[i]['checkList'].join(',')
            }

            if(this.checkedAuthList[i]['checkAuthList'].length > 0) {
              this.modiArgs.permissionIds += "," + this.checkedAuthList[i]['checkAuthList'].join(',')
            }
          }


          this.modiArgs.permissionIds = this.modiArgs.permissionIds.slice(1)
          if(this.modiArgs.permissionIds == '') {
            this.$message.error("请勾选权限!")
            return
          }
          
          var args = this.$common.transferToSearchParams(this.modiArgs)

          API.savePerms(args).then(res => {
            if(res.code == 0) {
              this.listQuery.pageNum = 1
              this.fetchData();
              this.dialogFormVisible = false
              this.$message.success(res.message)

            } else {
              this.modiArgs.permissionIds = ''
              this.$message.error(res.message)
            }
          })
        }
      })
    },

    handleUpdate(row) {
      var newRow = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      this.modiArgs.roleName = newRow.roleName
      this.modiArgs.roleId = newRow.id

      this.setCheckList()

      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      let args = new URLSearchParams()
      args.append('roleId', newRow.id)
      API.getPermsByRoleId(args).then(res => {

        for(var i in this.authList) {
          if(res.data.indexOf(this.authList[i].id + '') != -1) {
            this.checkedAuthList[i]['checkList'].push(this.authList[i].id)
          }
          
          if(Object.keys(this.authList[i]['children']).length > 0) {
            for(var j in this.authList[i]['children']) {
              if(res.data.indexOf(this.authList[i]['children'][j]['id'] + '') != -1) {
                this.checkedAuthList[i]['checkAuthList'].push(this.authList[i]['children'][j]['id'])
              }
            }
          }
          
        }
      })

    },


    handleCreate() { //添加
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })

      this.modiArgs = {
        permissionIds : '',
        roleId : '',
        roleName : '',
      }
      this.setCheckList()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
      this.fetchData()
    },

    getAllAuth() {
      API.getAllPerms().then(res => {
        this.listLoading = false
        if(res.code == 0) {
          this.authList = res.data
          this.setCheckList()
        }
      })
    },
    setCheckList() {
      for(var i = 0; i < this.authList.length; i++) {
        this.$set(this.checkedAuthList,i,[])
        this.$set(this.checkedAuthList[i],"checkList",[])
        this.$set(this.checkedAuthList[i],"checkAuthList",[])
      }
    },
    fetchData() {
      this.listLoading = true
      let args = this.$common.transferToSearchParams(this.listQuery)

      API.getRoleList(args).then(res => {
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
.authMenu {
  margin-left: 10px;
  width: 85%;
  overflow: auto;
  min-height:150px;
  max-height:500px;
}
.authMenu .authMenuList{
  margin-top:20px;
  border:1px solid #DCDFE6;
}

.authMenuList .level1 {
  font-weight: 600;
  color:#fff;
  padding:5px;
}

.authMenuList .level2 {
  display: inline-block;
  padding:5px 10px;
}

</style>




