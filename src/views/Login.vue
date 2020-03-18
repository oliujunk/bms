<template>
  <div class="login">
    <div class="app-name">
      <p>BMS测试工具</p>
    </div>
    <div class="app-name-label">
      <p>BMS TEST TOOL</p>
    </div>
    <div class="login-container">
      <el-form ref="form" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
        <el-form-item prop="username">
          <el-input
            ref="username_input"
            class="input"
            v-model="form.username"
            placeholder="请输入用户名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="input" type="password" v-model="form.password" placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" @click="handleSubmit" type="primary" long>登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            message: '账号名不能为空',
            trigger: 'blur',
          },
        ],
        password: [
          {
            type: 'string',
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.username === 'root' && this.form.password === '1') {
            sessionStorage.setItem('username', this.form.username);
            this.$router.push('/');
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-position: center;
  background-image: url("../assets/login_background.png");
  background-size: cover;
}

.app-name-label {
  position: absolute;
  left: 50%;
  top: 30%;
  text-align: center;
  transform: translate(-50%, -50%);
  width: 28%;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 43px rgba(0, 0, 0, 0.35);
  background-position: center;
  background-image: url("../assets/app_name_label.png");
}

.app-name {
  position: absolute;
  left: 50%;
  top: 25%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.app-name p {
  font-size: 40px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 0px 43px rgba(0, 0, 0, 0.35);
}

.login-container {
  position: absolute;
  left: 50%;
  top: 70%;
  text-align: center;
  transform: translate(-50%, -50%);
  height: 20%;
  width: 20%;
}

.login-title {
  margin-bottom: 5%;
  font-size: 20px;
  font-family: "Microsoft YaHei";
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
}

.el-input /deep/ .el-input__inner {
  text-align: center;
}

.button {
  font-size: 16px !important;
  height: 40px !important;
  width: 100%;
  text-align: center;
  background: linear-gradient(180deg, rgba(78, 107, 255, 1) 0%, rgba(38, 128, 235, 1) 100%);
  border-width: 0px;
}
</style>
