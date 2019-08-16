<template>
  <div id="phone">
    <mt-header fixed title="修改手机号">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="rech_con">
        <div class="rech_list">
          <span>原手机号</span>
          <span>{{old_phone}}</span>
        </div>
        <div class="rech_list">
          <span>新手机号</span>
          <input type="text" v-model="account" placeholder="请输入新手机号" />
        </div>
        <div class="rech_list">
          <span>验证码</span>
          <input type="text" v-model="code" placeholder="请输入验证码" />
          <span class="phone-code" @click="sendCode">{{codeMsg}}</span>
        </div>
        <mt-button type="default" @click="EditAccount">确认</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast
  },
  data() {
    return {
      codeMsg: "获取验证码",
      time: 60,
      old_phone: localStorage.getItem("account"),
      account: "", //新账号
      code: "" //验证码
    };
  },
  mounted: function() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //	发送验证码
    sendCode() {
      let that = this;
      var account = that.account;
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
        that
          .$http({
            url: "Register/code",
            method: "post",
            data: {
              account: account
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
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
    //修改密码
    EditAccount() {
      let that = this;
      if (!that.account || that.account == null) {
        Toast("请输入新手机号");
      } else if (!that.code || that.code == null) {
        Toast("请输入验证码");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "Personal/editAccount",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              account: that.account,
              code: that.code
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
              localStorage.setItem("account", that.account);
              that.$router.go(-1);
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
      }
    }
  }
};
</script>

<style scoped="scoped">
#phone {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - .8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: .8rem;
}

.rech_con {
  width: 100%;
  padding: 0 0.2rem;
}
.rech_con .rech_list {
  display: flex;
  align-items: center;
  padding-top: 0.2rem;
}
.rech_con .rech_list span {
  width: 22%;
  color: #333;
  font-size: 0.28rem;
}
.rech_con .rech_list {
  position: relative;
}
.rech_con .rech_list span.phone-code {
  position: absolute;
  right: 0.1rem;
  line-height: 0.8rem;
  color: #ef6213;
  text-align: right;
}

.rech_con .rech_list input {
  flex: 1;
  height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}

.rech_con .mint-button {
  display: block;
  margin: auto;
  font-size: 0.3rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
}
</style>
