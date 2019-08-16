<template>
  <div id="setting">
    <mt-header fixed title="设置">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="content">
        <div class="balance" @click="gotoPho">
          <div class="ba_tit">
            <h4>手机号</h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoAuto">
          <div class="ba_tit">
            <h4>
              实名认证
              <span v-if="useMsg.real_name !== ''">(已实名)</span>
            </h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoBank">
          <div class="ba_tit">
            <h4>
              银行卡
              <span v-if="useMsg.bank_user !== ''">(已绑定)</span>
            </h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoWe">
          <div class="ba_tit">
            <h4>
              微信
              <span v-if="useMsg.wechat !== ''">(已绑定)</span>
            </h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoAli">
          <div class="ba_tit">
            <h4>
              支付宝
              <span v-if="useMsg.alipay !== ''">(已绑定)</span>
            </h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoAdd">
          <div class="ba_tit">
            <h4>我的地址</h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoDealPass">
          <div class="ba_tit">
            <h4>交易密码</h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <div class="balance" @click="gotoPas">
          <div class="ba_tit">
            <h4>修改密码</h4>
            <img src="../../assets/img/more.png" />
          </div>
        </div>
        <button class="quit" @click="logout">退出登录</button>
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
      useMsg: []
    };
  },
  mounted: function() {
    let that = this;
    that.getUserMsg();
  },
  methods: {
    //获取实名认证信息
    getUserMsg() {
      let that = this;
      that
        .$http({
          url: "Personal/userMsg",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.useMsg = res.data.data;
          } else {
            //失败
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    //退出登录
    logout() {
      let that = this;
      localStorage.setItem("token", ""); //清除token
      sessionStorage.setItem("clickExit", true);
      that.$router.push({
        path: "/login"
      });
    },
    back() {
      this.$router.push("/tabs/my"); //返回上一层
    },
    gotoPho() {
      this.$router.push({
        path: "/phone"
      });
    },
    gotoAuto() {
      this.$router.push({
        path: "/autonym"
      });
    },
    gotoBank() {
      this.$router.push({
        path: "/bankcard"
      });
    },
    gotoWe() {
      this.$router.push({
        path: "/wechat"
      });
    },
    gotoAli() {
      this.$router.push({
        path: "/alipay"
      });
    },
    gotoAdd() {
      this.$router.push({
        path: "/address"
      });
    },
    gotoDealPass() {
      this.$router.push({
        path: "/dealPassword"
      });
    },
    gotoPas() {
      this.$router.push({
        path: "/changepass"
      });
    }
  }
};
</script>

<style scoped="scoped">
#setting {
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
.mint-header {
  position: relative;
  background: #ef6213;
}

.mint-header img {
  position: absolute;
  right: 0.3rem;
  top: 0.2rem;
  width: 0.44rem;
}
.content {
  width: 100%;
  padding: 0 0.2rem;
}

.balance {
  margin-top: 0.26rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #e9e9e9;
}

.balance h4 {
  font-size: 0.28rem;
  font-weight: normal;
  color: #777;
}
.balance .ba_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance .ba_tit span {
  font-size: 0.24rem;
  color: #c6c6c6;
}
.balance .ba_tit img {
  width: 0.32rem;
}
.content .quit {
  display: block;
  margin: auto;
  font-size: 0.3rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
  border: none;
}
</style>
