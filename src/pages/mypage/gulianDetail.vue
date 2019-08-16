<template>
  <div id="cardBag">
    <mt-header fixed title="谷联卡详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="card_con">
        <div class="huiyuan_card">
          <div class="card">
            <div class="card_num">
              <span>{{gulianDetails.card_number}}</span>
            </div>
          </div>
        </div>
        <div class="card_deta">
          <div class="deta-list">
            <span class="span1">余额：</span>
            <span>{{gulianDetails.money}}元</span>
          </div>
          <div class="deta-list">
            <span class="span1">办理时间：</span>
            <span>{{gulianDetails.time}}</span>
          </div>
          <div class="deta-button">
            <button @click="gotoRech">充值</button>
            <button @click="showDialog">转增</button>
            <button @click="gotoCon">兑换</button>
          </div>
        </div>
        <div class="consumer">
          <h4>消费明细</h4>
          <div class="detail_con">
            <div class="detail_list" v-for="(item,index) in record" :key="index">
              <div class="detail_re">
                <span>{{item.title}}</span>
                <span>{{item.money}}</span>
              </div>
              <div class="detail_re">
                <span>{{item.trade_user}}</span>
                <span class="detail_time">{{item.time}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
        <div class="dialog">
          <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
          <h4>谷联卡转增</h4>
          <div class="number">
            <p>对方账号</p>
            <input type="text" v-model="phone" name placeholder="请输入对方账号" />
          </div>
          <div class="number">
            <p>转增金额</p>
            <input type="text" v-model="money" name placeholder="请输入转增金额" />
          </div>
          <button @click="gulianGive">确定</button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { XDialog } from "vux";
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    XDialog,
    Indicator,
    Toast
  },
  data() {
    return {
      gulianDetails: [], //谷联卡详情
      record: [], //消费明细
      lang_dlg: false,
      phone: "", //账号
      money: "" //转增金额
    };
  },
  mounted: function() {
    let that = this;
    that.getGulianDetails();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoBlac() {
      this.$router.push({
        path: "/blackDetail"
      });
    },
    gotoRech() {
      this.$router.push({
        path: "/recharge"
      });
    },
    gotoCon() {
      this.$router.push({
        path: "/conver"
      });
    },
    showDialog: function() {
      var that = this;
      that.lang_dlg = true;
    },
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
    },
    //获取谷联卡详情
    getGulianDetails() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "card_bag/gulianDetails",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.gulianDetails = res.data.data;
            that.record = res.data.data.record;
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
    //转增
    gulianGive() {
      let that = this;
      if (!that.phone || that.phone == null) {
        Toast("请输入转增账号");
      } else if (!that.money || that.money == null) {
        Toast("请输入转增金额");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "card_bag/gulianGive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              phone: that.phone,
              money: that.money
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              Toast(res.data.msg);
              that.lang_dlg = false;
              that.phone = "";
              that.money = "";
              that.getGulianDetails();
            } else {
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
#cardBag {
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
  background: #ef6213;
}

.card_con {
  width: 100%;
  padding: 0.2rem;
}

.card {
  position: relative;
  width: 100%;
  height: 2.5rem;
  padding: 0.2rem;
  border-radius: 0.1rem;
  color: #fff;
  margin-bottom: 0.2rem;
  background: url("../../assets/img/glCard.png") 0 0 no-repeat / 100% 100%;
}

.card .card-tit {
  padding: 0.1rem 0;
  font-size: 0.26rem;
}

.card .card-tit span:nth-child(2) {
  margin-left: 1rem;
}

.card h4 {
  font-size: 0.4rem;
  text-align: center;
}

.card .card_num {
  position: absolute;
  right: 0.2rem;
  bottom: 0.2rem;
  font-size: 0.24rem;
  line-height: 0.24rem;
  color: #c39b5a;
}

.card_deta .deta-list {
  font-size: 0.26rem;
  padding: 0.1rem 0;
}

.card_deta .deta-list .span1 {
  display: inline-block;
  width: 22%;
}

.deta-button {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-around;
}

.deta-button button {
  width: 1.4rem;
  background: #ef6213;
  border: none;
  border-radius: 0.1rem;
  height: 0.5rem;
  color: #fff;
  font-size: 0.26rem;
}

.consumer {
  margin-top: 0.4rem;
}

.consumer h4 {
  display: inline-block;
  font-size: 0.26rem;
  border-bottom: 3px solid #ef6213;
}

.detail_con .detail_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}

.detail_con .detail_re {
  padding: 0.05rem;
  display: flex;
  justify-content: space-between;
}

.detail_con .detail_re span {
  color: #333;
}

.detail_con .detail_time {
  color: #777777;
}

.dialog {
  width: 90%;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.2rem 0;
}

.dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

.dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
}

.dialog h5 {
  font-weight: normal;
}

.dialog .number {
  /* 	width: 90%; */
  margin: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  font-size: 0.28rem;
  align-items: center;
}

.dialog .number span {
  font-size: 0.28rem;
}

.dialog .number input {
  width: 70%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
}

.dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.4rem;
  border: none;
  border-radius: 0.1rem;
}
</style>
