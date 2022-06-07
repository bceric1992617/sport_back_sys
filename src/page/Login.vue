<template>
    <div class="login-wrap">
        <!-- <div class="top">
            <p>
                <img src="@/assets/img/publicPics/logo.png" alt="">
            </p>
            <p>PLAYS中控管理</p>
        </div> -->
        <div class="ms-login">
            <div class="ms-title">
                <p>
                    <img src="@/assets/img/publicPics/logo.png" alt="">
                </p>
                <p>PLAYS中控管理</p>
            </div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="输入账号">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" style="margin-top:25px;">
                    <el-input type="password" placeholder="登录密码" v-model="param.password" show-password>
                        <el-button slot="prepend" icon="el-icon-lock" ></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    
                    <p v-if="param.password == '' || param.userName == '' " class="loginBtn btnDisable" > 
                        <b>登录</b>
                    </p>
                    <p v-else class="loginBtn btnEnable" @click="submitForm" > 
                        <b>登录</b>
                    </p>
                </div>
            </el-form>
        </div>

        <el-dialog title="重置密码" :visible.sync="setPWForm" width="650px">
            <el-form  ref="setPwdForm" :rules="rules" :model="modiArgs" label-position="right">
                <el-form-item  label-width="130px"  label="新密码：" prop="newPassword">
                    <el-input type="password"  v-model="modiArgs.newPassword" class="w-70" placeholder="请输入新密码"/>
                </el-form-item>
                <el-form-item  label-width="130px"  label="确认新密码：" prop="confirmPassword">
                    <el-input type="password"  v-model="modiArgs.confirmPassword" class="w-70" placeholder="请输入确认新密码"/>
                </el-form-item>
                <el-form-item  label-width="130px"  label="生成谷歌key：" prop="googleKey">
                    <el-input  v-model="modiArgs.googleKey" class="w-70 m-r-10" placeholder="请输入生成谷歌key"/>
                    <el-button type="text" @click="getGoogleKey" v-bind:disabled="keyStatus">生成key</el-button>
                    <el-button type="text" @click="$common.copyFn(modiArgs.googleKey)">复制</el-button>
                </el-form-item>
                <el-form-item  label-width="130px"  label="谷歌验证码：" prop="googleCode">
                    <el-input   v-model="modiArgs.googleCode" class="w-70" placeholder="请输入谷歌验证码"/>
                </el-form-item>
            </el-form>
            <div class="w-100 text-c">
                <button class="submitBtn" @click="saveData()">提交</button>
            </div>
            <div class="w-100 notice">  
                <p class="title">温馨提示：</p>
                <p class="text">用户首次进入后台时，为了保证您的账号和财产安全，请自行设置登录密码并妥善保管，请勿将账户信息泄露给他人，以免给您的财产造成不必要的损失！</p>
            </div>
        </el-dialog>

        <googleCode ref="googleCode" @myevent="receiveCode"></googleCode>

    </div>
</template>

<script>
import * as API from '@/api/login'
import md5 from 'js-md5';


export default {

    data: function() {
        return {
            keyStatus: false,
            setPWForm: false,
            param: {
                userName: 'baicai',
                password: '123456'
            },
            rules: {
                userName: [{ required: true, message: '必填', trigger: 'blur' }],
                password: [{ required: true, message: '必填', trigger: 'blur' }],
                confirmPassword: [{ required: true, message: '必填', trigger: 'blur' }],
                googleCode: [{ required: true, message: '必填', trigger: 'blur' }],
                googleKey: [{ required: true, message: '必填', trigger: 'blur' }],
                id: [{ required: true, message: '必填', trigger: 'blur' }],
                newPassword: [{ required: true, message: '必填', trigger: 'blur' }]
            },
            modiArgs : {
                confirmPassword: "",
                newPassword: "",
                googleCode: "",
                googleKey: "",
                id: 0,
            }
        };
    },
    created() {

    },
    methods: {
        receiveCode(code) {
            let args = new URLSearchParams()
            args.append('id', this.modiArgs.id)
            args.append('googleCode', code)
            
            API.verifyGoogleCode(args).then(res => {
                if(res.code == 0) {
                localStorage.setItem('ms_username', this.param.userName);
                localStorage.setItem('token', "Bearer " + res.data.token);
                this.$router.push("/")
                this.$message.success(res.message)
                } else {
                this.$message.error(res.message)
                }
            })
        },

        getGoogleKey() {
            API.generateGoogleKey().then(res => {
                if(res.code == 0) {
                    this.$message.success(res.message)
                    this.modiArgs.googleKey = res.data
                } else {
                    this.$message.error(res.message)
                }
            })
        },
        saveData() {
            this.$refs.setPwdForm.validate(valid => {
                if(valid) {
                    let args = new URLSearchParams();
                    args.append('confirmPassword', md5(this.param.userName + this.modiArgs.confirmPassword))
                    args.append('newPassword', md5(this.param.userName + this.modiArgs.newPassword))
                    args.append('id', this.modiArgs.id)
                    args.append('googleKey', this.modiArgs.googleKey)
                    args.append('googleCode', this.modiArgs.googleCode)


                    API.firstEnter(args).then(res => {
                        if(res.code == 0) {
                            localStorage.setItem('ms_username', this.param.userName);
                            localStorage.setItem('token', "Bearer " + res.data.token);
                            this.$router.push("/")

                            this.$message.success(res.message)
                        } else {
                            this.$message.error(res.message)
                        }
                    })
                }
            })
        },
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {

                    let args = new URLSearchParams()
                    args.append('userName', this.param.userName)
                    args.append('password', md5(this.param.userName + this.param.password))
                    API.login(args).then(res => {
                        if(res.code == 0) {
                            this.modiArgs.id = res.data.id
                            if(res.data.googleSwitch == 1) {  
                                if(res.data.googleKey == '') {
                                    this.modiArgs = {
                                        confirmPassword: "",
                                        googleCode: "",
                                        googleKey: "",
                                        id: 0,
                                        newPassword: "",
                                    }
                                    this.setPWForm = true
                                } else {
                                    this.$refs.googleCode.dialogFormVisible = true
                                }
                            } else {
                                localStorage.setItem('ms_username', this.param.userName);
                                localStorage.setItem('token', "Bearer " + res.data.token);
                                this.$router.push("/")
                            }

                       } else {
                           this.$message.error(res.message)
                       }
                    })
                }
            });
        }

        
    }
};
</script>

<style scoped>


.submitBtn {
    border:none;
    cursor: pointer;
    background-color:#409EFF;
    color:#fff;
    border-radius: 5px;
    line-height:30px;
    height:30px;
    width:150px;
    font-weight: 600;
    
}
.notice p{
    margin-top:10px
}

.notice .text{
    font-size: 12px;
    color: #B8741A
}

.login-wrap {
    position: absolute;
    width: 100%;
    height: 100%; 
    /* background-size:100% 100%; */
    background: url('../assets/img/publicPics/bg.png');
    background-repeat:no-repeat;
    background-position: 0 -1px
}

.top img {
    width:60px;
    height:60px;
    
}

.top p {
    color:#fff;
    width:200px;
    text-align: center;
}

.top {
    padding-top:50px
}





.ms-title {
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    margin: 25px 0px 15px;

}
.ms-title p {
    display: inline-block;
    margin-right:10px;
}

.ms-title img {
    width:50px;
    height:50px;
    vertical-align: middle;

}
.ms-login {
    position: relative;
    width: 450px;
    height: 335px;
    max-width: 90%;
    margin: 250px auto;
    border-radius: 5px;
    background: white;
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    margin-top: 10%;
}
.login-btn button {
    width: 100%;
    height: 36px;
    text-align: center;
    margin-bottom: 10px;
}


</style>
