<template>
  <div>
    <div class="login-container">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">{{ $t('login.title') }}</h3>
          <lang-select class="set-language" />
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="loginForm.username" :placeholder="$t('login.username')" name="username" type="text" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$t('login.password')" name="password" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
      </el-form>
    </div>
    <el-dialog :title="$t('login.changepassword')" :visible.sync="dialogTableVisible" :append-to-body="true">
      <el-form :model="detail" :rules="detailrules" ref="detail" label-width="150px" class="demo-ruleForm">
        <el-form-item :label="$t('login.oldpassword')" prop="oldpassword">
          <el-input v-model="detail.oldpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.newpassword')" prop="newpassword">
          <el-input v-model="detail.newpassword" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitdetail('detail')">{{$t('button.submit')}}</el-button>
          <el-button @click="resetdetail('detail')">{{$t('button.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ChangePassword } from "@/api/login";
import LangSelect from "@/components/LangSelect";
export default {
  name: "Login",
  components: { LangSelect },
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined,
      dialogTableVisible: false,
      detail: {
        oldpassword: "",
        newpassword: ""
      }
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {},
  computed: {
    loginRules: function() {
      var rules = {
        username: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.usernamemessage")
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: this.$t("login.passwordmessage")
          }
        ]
      };
      return rules;
    },
    detailrules: function() {
      var checknewpassword = (rule, value, callback) => {
        setTimeout(() => {
          if (this.detail.oldpassword == this.detail.newpassword) {
            callback(new Error(this.$t("login.samepassword")));
          } else {
            callback();
          }
        }, 100);
      };
      var rules = {
        oldpassword: [
          {
            required: true,
            message: this.$t("login.oldpasswordmessage"),
            trigger: "blur"
          }
        ],
        newpassword: [
          {
            required: true,
            message: this.$t("login.newpasswordmessage"),
            trigger: "blur"
          },
          {
            validator: checknewpassword,
            trigger: "blur"
          }
        ]
      };
      return rules;
    }
  },

  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(res => {
              if (res.data.res_status_code == 0) {
                this.$router.push({ path: this.redirect || "/" });
              } else if (res.data.res_status_code == "50007") {
                this.dialogTableVisible = true;
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitdetail(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {};
          data.login_id = this.loginForm.username;
          data.origin_pwd = this.detail.oldpassword;
          data.pwd = this.detail.newpassword;
          ChangePassword(data).then(response => {
            if (response.data.res_status_code == 0) {
              this.$message({
                type: "success",
                message: this.$t("login.succeemessage")
              });
              this.dialogTableVisible = false;
              this.loginForm.password = "";
              this.loading = false;
            } else {
              this.loading = false;
              this.$message({
                type: "error",
                message: response.data.res_message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 清空form
    resetdetail(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
