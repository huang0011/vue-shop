<template>
  <div class="login_container">
    <div class="login_box">
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>

      <el-form
        label-width="10px"
        class="loginForm"
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginRules"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="toLogin">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    toLogin() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const res = await this.$http.post("login", this.loginForm);
        /*   console.log(res); */
        const { data: loginInfo, meta } = res.data;
        console.log(loginInfo);
        //登录成功
        if (meta.status === 200) {
          this.$message.success(meta.msg);
          //保存token
          let token = window.sessionStorage.setItem("token", loginInfo.token);
          this.$router.push("/home");
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;

    .logo {
      width: 130px;
      height: 130px;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.loginForm {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>