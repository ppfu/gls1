<template>
  <div id="addmember">
    <mt-header fixed title="申请办卡">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item @on-item-click="cadindex=0" :selected="cadindex==0">会员卡</tab-item>
        <tab-item @on-item-click="cadindex=1" :selected="cadindex==1" id="tabtow">谷联卡</tab-item>
      </tab>
      <!-- tab-container -->
      <div v-if="cadindex==0" class="rech_con">
        <div class="rech_list">
          <span>年费：</span>
          <span>{{card.fee}}元</span>
        </div>
        <div class="rech_list">
          <span>卡费：</span>
          <span>{{card.spend}}元</span>
        </div>
        <div class="rech_list">
          <span>交易密码：</span>
          <input type="password" v-model="payment_password" name placeholder="请输入交易密码" />
        </div>
        <mt-button type="default" @click="applyCard">确认</mt-button>
      </div>

      <div v-if="cadindex==1" class="rech_con">
        <div class="rech_list">
          <span>交易密码：</span>
          <input type="password" name v-model="payment_password" placeholder="请输入交易密码" />
        </div>
        <mt-button type="default" @click="applyCard">确认</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import { Indicator, Toast } from "mint-ui";

export default {
  components: {
    Tab,
    TabItem,
    Indicator,
    Toast
  },
  data() {
    return {
      cadindex: this.$route.query.cadindex, //默认会员卡
      selected: 0,
      card: [], //办卡页面信息
      payment_password: "", //交易密码
      type: "" //办卡类型
    };
  },
  mounted: function() {
    let that = this;
    that.getApplyCard();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取办卡页面信息
    getApplyCard() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "card_bag/applyCard",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.card = res.data.data;
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
    //办卡
    applyCard() {
      let that = this;
      that.type = that.cadindex == 0 ? 1 : 2;
      if (!that.payment_password || that.payment_password == null) {
        Toast("请输入交易密码");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "card_bag/applyCardActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              type: that.type,
              payment_password: that.payment_password
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
              that.payment_password = "";
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

<style>
#addmember {
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
#farmdetail .mint-tab-item-label {
  font-size: 0.3rem;
}
.mint-header {
  background: #ef6213;
}

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.rech_con {
  width: 100%;
  padding: 0 0.2rem;
}

.rech_con .rech_list {
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
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
