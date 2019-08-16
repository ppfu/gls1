<template>
  <div id="alipay">
    <mt-header fixed title="支付宝">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="rech_con">
        <h5 class="y_auton" v-if="useMsg.alipay !== ''">您已绑定支付宝！</h5>
        <h5 class="w_auton" v-if="useMsg.alipay == ''">请填写您的支付宝号进行绑定！</h5>
        <div class="rech_list">
          <span>支付宝号：</span>
          <input
            v-if="useMsg.alipay !== ''"
            type="text"
            v-model="useMsg.alipay"
            name
            disabled="disabled"
          />
          <input
            v-if="useMsg.alipay == ''"
            type="text"
            v-model="alipay"
            name
            placeholder="请输入您的支付宝号"
          />
        </div>
        <mt-button v-if="useMsg.alipay !== ''" type="default" @click="back">返回</mt-button>
        <mt-button v-if="useMsg.alipay == ''" type="default" @click="subAlipay">确认</mt-button>
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
      alipay: "", //支付宝号
      useMsg: []
    };
  },
  mounted: function() {
    let that = this;
    that.getUserMsg();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
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
    //绑定支付宝
    subAlipay() {
      let that = this;
      if (!that.alipay || that.alipay == null) {
        Toast("请输入支付宝号");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "Personal/alipayActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              alipay: that.alipay
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
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
#alipay {
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
.rech_con h5 {
  text-align: center;
  font-weight: normal;
  font-size: 0.26rem;
  padding-top: 0.2rem;
}
.rech_con h5.y_auton {
  color: #259b24;
}
.rech_con h5.w_auton {
  color: #ef6213;
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
.rech_con .rech_list input {
  flex: 1;
  height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
  background: #fff;
}
.rech_con .mint-button {
  display: block;
  margin: auto;
  font-size: 0.28rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
}
</style>
