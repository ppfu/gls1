<template>
  <div class="login">
    <mt-header fixed title="忘记密码">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="logo">
      <img src="../assets/img/logo.jpg" />
    </div>
    <div class="login_con">
      <div class="login_info">
        <span class="iconfont icon-tabshouji"></span>
        <input type="text" v-model="account" placeholder="请输入手机号" />
      </div>
      <div class="login_info">
        <span class="iconfont icon-tabxinxi"></span>
        <input type="text" v-model="code" placeholder="请输入验证码" />
        <span class="send" @click="sendCode">{{codeMsg}}</span>
      </div>
      <div class="login_info">
        <span class="iconfont icon-tabsuo"></span>
        <input type="password" v-model="password" placeholder="请输入至少6位数字和字母组合" />
      </div>
      <div class="login_info">
        <span class="iconfont icon-tabsuo"></span>
        <input type="password" v-model="repassword" placeholder="请输入确认新登录密码" />
      </div>
      <div class="login_btn">
        <button @click="fogetBtn">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      account: "",
      code: "",
      password: "",
      repassword: "",
      codeMsg: "获取验证码",
      time: 60
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    // 密码提交
    fogetBtn() {
      let that = this;
      let account = that.account;
      let password = that.password;
      let repassword = that.repassword;
      let code = that.code;
      if (!account || account == null) {
        Toast("请输入手机号码");
      } else if (
        account.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)
      ) {
        Toast("手机号格式错误");
      } else if (!password || password == null) {
        Toast("密码不能为空");
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(password)) {
        Toast("密码输入错误");
      } else if (password !== repassword) {
        Toast("两次密码不一致");
      } else if (!code || code == null) {
        Toast("验证码不能为空");
      } else {
        that.$http
          .post("Register/forgotPassword", {
            account: account,
            password: password,
            repassword: repassword,
            code: code
          })
          .then(function(res) {
            let code = res.data.code;
            if (code == 0) {
              Toast("密码修改成功，请返回登录页登录");
            } else {
              Toast(res.data.msg);
            }
          })
          .catch(function(err) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    },
    //发送验证码
    sendCode() {
      let that = this;
      var account = that.account;
      var code = that.code;
      if (!account || account == null) {
        Toast("请输入手机号码");
      } else if (
        account.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)
      ) {
        Toast("手机号格式错误");
      } else {
        if (that.codeMsg != "获取验证码" && that.codeMsg != "重新发送") return;
        var time = that.time;
        that.$http
          .post("Register/code", {
            account: account
          })
          .then(function(res) {
            var code = res.data.code;
            if (code == 0) {
              that.code = res.data.data;
              Toast("验证码发送成功");
              var interval = setInterval(function() {
                time--;
                that.codeMsg = time + "s";
                if (time <= 0) {
                  clearInterval(interval);
                  that.codeMsg = "重新发送";
                }
              }, 1000);
            } else {
              Toast(msg);
            }
          })
          .catch(function(err) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    }
  }
};
</script>

<style scoped="scoped">
.mint-header {
  background: #ef6213;
}
.disabled {
  pointer-events: none;
}
.logo {
  margin-top: 0.8rem;
  height: 3.4rem;
  width: 150%;
  margin-left: -1.8rem;
  background: #ef6213;
  border-radius: 0 0 50% 50%;
  text-align: center;
}

.logo img {
  margin-top: 0.5rem;
  width: 1.6rem;
  border-radius: 50%;
}

.login_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 1rem;
}

.login_info {
  width: 100%;
  height: 0.8rem;
  border: 1px solid #c6c6c6;
  border-radius: 0.1rem;
  line-height: 0.8rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.login_info span {
  padding: 0 0.2rem;
  font-size: 0.4rem;
  color: #888;
}
.login_info span.send {
  font-size: 0.28rem;
  color: #ef6213;
  line-height: 0.8rem;
  position: absolute;
  right: 0.1rem;
}

.login_info input {
  flex: 1;
  height: 0.7rem;
  border: none;
}

.login_btn {
  margin: 0 auto;
}

.login_btn button {
  width: 100%;
  height: 0.8rem;
  background: #ef6213;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}
</style>
