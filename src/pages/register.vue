<template>
  <div class="login">
    <mt-header fixed title="立即注册">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>

    <div class="con-wrapper">
      <div class="logo">
        <img src="../assets/img/logo.jpg" />
      </div>
      <div class="login_con">
        <div class="login_info">
          <span class="iconfont icon-tabwode"></span>
          <input type="number" v-model="account" placeholder="请输入手机号" />
        </div>
        <div class="login_info">
          <span class="iconfont icon-tabsuo"></span>
          <input type="password" v-model="password" @blur="hintPassFun" placeholder="请输入至少6位数字和字母组合" />
        </div>
        <div class="login_info">
          <span class="iconfont icon-tabsuo"></span>
          <input type="password" v-model="repassword" @blur="hintRepassFun" placeholder="请再次输入登录密码" />
        </div>
        <div class="login_info">
          <span class="iconfont icon-tabsecurityCode-b"></span>
          <input type="text" v-model="code" placeholder="请输入验证码" />
          <span class="send" @click="sendCode">{{codeMsg}}</span>
        </div>
        <div class="login_info">
          <span class="iconfont icon-tabyaoqingmatianchong"></span>
          <input
            type="text"
            v-model="invitation_code"
            v-debounce="getArea"
            placeholder="请输入邀请码（选填）"
          />
        </div>
        <div class="login_info">
          <span class="iconfont icon-tabfuwuquyu"></span>
          <select class="selectpicker" v-model="area_id">
            <option
              v-for="areaItem in data"
              :key="areaItem.id"
              :value="areaItem.id"
            >{{areaItem.name}}</option>
          </select>
        </div>
        <div class="checket">
          <van-checkbox v-model="checked" id="checked" @click="check" checked-color="#EF6213"></van-checkbox>
          <p>
            我已阅读并同意
            <span @click="gotoAgree">《平台注册协议》</span>
          </p>
        </div>
        <div class="login_btn">
          <button id="accept" @click="register" disabled="disabled">确定</button>
        </div>
        <div class="re_num">
          <span>已有账号？</span>
          <span @click="gotologin">立即登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
export default {
  data() {
    return {
      disabled: true,
      checked: false,
      account: "",
      password: "",
      repassword: "",
      invitation_code: "",
      code: "",
      area_id: "",
      data_id: "",
      codeMsg: "获取验证码",
      time: 60,
      data: []
    };
  },
  created: function() {
    this.getArealist();
  },
  directives: {
    debounce: {
      inserted: function (el, binding) {
        let timer
        el.addEventListener('keyup', () => {
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            binding.value()
          }, 400)
        })
      }
    }
  },
  //数据保存到session
  watch: {
    account(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("account", val);
      }
    },
    password(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("password", val);
      }
    },
    repassword(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("repassword", val);
      }
    },
    invitation_code(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("invitation_code", val);
      }
    },
    code(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("code", val);
      }
    },
    area_id(val) {
      if (val || val != null || val != undefined) {
        sessionStorage.setItem("area_id", val);
      }
    }
  },
  mounted: function() {
    this.getData();
  },

  methods: {
    // 刷新页面数据
    getData() {
      this.account = sessionStorage.getItem("account");
      this.password = sessionStorage.getItem("password");
      this.repassword = sessionStorage.getItem("repassword");
      this.invitation_code = sessionStorage.getItem("invitation_code");
      this.code = sessionStorage.getItem("code");
      this.area_id = sessionStorage.getItem("area_id");
    },
    //判断注册协议是否选择
    check() {
      let that = this;
      if (that.checked == false) {
        $("#accept").prop("disabled", false);
        $("#accept").css("background", "#EF6213");
      } else {
        $("#accept").prop("disabled", true);
        $("#accept").css("background", "#c6c6c6");
      }
    },
    hintPassFun() {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password)) { // 密码包含大小写字母数字不能纯字母纯数字
        Toast("密码输入有误");
      }
    },
    hintRepassFun() {
      if (this.password !== this.repassword) {
        Toast("两次密码不一致");
      }
    },
    //注册
    register() {
      let that = this;
      let account = that.account;
      let password = that.password;
      let repassword = that.repassword;
      let invitation_code = that.invitation_code;
      let code = that.code;
      let area_id = that.area_id;
      if (!account || account == null) {
        Toast("请输入手机号码");
      } else if (
        account.trim().length != 11 ||
        !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)
      ) {
        Toast("手机号格式错误");
      } else if (!password || password == null) {
        Toast("密码不能为空");
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(password)) { // 密码包含大小写字母数字不能纯字母纯数字
        Toast("密码输入有误");
      } else if (password !== repassword) {
        Toast("两次输的密码不同");
      } else if (!code || code == null) {
        Toast("验证码不能为空");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that.$http
          .post("Register/userReg", {
            account: account,
            password: password,
            repassword: repassword,
            code: code,
            invitation_code: invitation_code,
            area_id: area_id
          })
          .then(function(res) {
            Indicator.close();
            let code = res.data.code;
            if (code == 0) {
              Toast("注册成功请登录");
              that.account = sessionStorage.getItem("");
              that.password = sessionStorage.getItem("");
              that.repassword = sessionStorage.getItem("");
              that.invitation_code = sessionStorage.getItem("");
              that.code = sessionStorage.getItem("");
              that.area_id = sessionStorage.getItem("");
              that.$router.push({
                path: "/"
              });
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
    //获取区域列表
    getArealist() {
      let that = this;
      that.$http
        .post("Register/areaList", {})
        .then(function(res) {
          if (res.data.code == 0) {
            that.data = res.data.data;
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
    },
    //	发送验证码
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
              Toast("验证码发送成功");
              that.code = res.data.data;
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
    },
    //输入邀请码显示区域
    getArea() {
      let that = this;
      if (that.invitation_code == "") {
        return;
      }
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "Register/userArea",
          method: "post",
          data: {
            invitation_code: that.invitation_code
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.area_id = res.data.data;
          } else {
            //失败
            Toast(res.data.msg);
          }
          Indicator.close();
        })
        .catch(function(error) {
          Indicator.close();
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },

    back() {
      this.$router.go(-1); //返回上一层
    },
    gotologin() {
      let that = this;
      that.$router.push({
        path: "/"
      });
    },
    gotoAgree() {
      let that = this;
      that.$router.push({
        path: "/agreement"
      });
    }
  }
};
</script>

<style scoped="scoped">
.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 0.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
}
.disabled {
  pointer-events: none;
}
.logo {
  height: 2.5rem;
  width: 150%;
  margin-left: -25%;
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
  margin-top: 0.4rem;
  background: #fff;
  border-radius: 0.1rem;
  padding-bottom: 0.3rem;
}
.login_con p {
  font-size: .24rem;
  color: #888;
  line-height: 1.8;
}
.login_info {
  width: 100%;
  height: 0.8rem;
  border: 1px solid #d6d6d6;
  border-radius: 0.1rem;
  line-height: 0.8rem;
  display: flex;
  align-items: center;
  margin-top: 0.22rem;
  position: relative;
}

.login_info span {
  padding: 0 0.2rem;
  font-size: 0.36rem;
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
  height: 0.76rem;
  border: none;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}

.login_info select {
  flex: 1;
  height: 0.7rem;
  border-radius: 0.1rem;
  color: #555555;
  border: none;
  background: #fff;
  appearance: none;
  -moz-appearance: none;
  /* Firefox */
  -webkit-appearance: none;
  /* Safari 和 Chrome */
}

.re_xiyi {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 0.2rem 0;
  font-size: 0.26rem;
}

.re_xiyi input {
  width: 0.6rem;
}

.re_xiyi span:nth-child(3) {
  color: #ef6213;
}

.re_num {
  text-align: center;
  font-size: 0.26rem;
  padding-top: 0.2rem;
}

.re_num span:nth-child(2) {
  color: #ef6213;
}

.checket {
  display: flex;
  justify-content: center;
  font-size: 0.26rem;
  color: #555;
  padding: 0.2rem 0;
}

.checket span {
  color: #ef6213;
}

.checket p {
  padding-left: 0.1rem;
}

.login_btn {
  margin: 0 auto;
}

.login_btn button {
  width: 100%;
  height: 0.8rem;
  background: #c6c6c6;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}
</style>
