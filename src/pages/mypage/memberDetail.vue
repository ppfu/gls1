<template>
  <div id="cardBag">
    <mt-header fixed title="会员卡详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="card_con">
        <div class="huiyuan_card">
          <div class="card">
            <div class="card_num">
              <span>{{memberDetails.card_number}}</span>
            </div>
          </div>
        </div>
        <div class="card_deta">
          <div class="deta-list">
            <div class="yue">
              <span>余额：</span>
              <span>{{memberDetails.money}}元</span>
            </div>
            <button @click="gotoRech">充值</button>
          </div>
          <div class="deta-list">
            <span class="span1">年费：</span>
            <span>{{memberDetails.fee}}元</span>
          </div>
          <div class="deta-list">
            <span class="span1">办理时间：</span>
            <span>{{memberDetails.time}}</span>
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
              <div class="detail_time">{{item.time}}</div>
            </div>
          </div>
        </div>
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
      selected: "1",
      memberDetails: [], //会员卡详情
      record: [] //消费明细
    };
  },
  mounted: function() {
    let that = this;
    that.getMemberDetails();
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
    //获取会员卡详情
    getMemberDetails() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "card_bag/memberDetails",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.memberDetails = res.data.data;
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
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 40px;
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
  background: url("../../assets/img/vipCard.png") 0 0 no-repeat / 100% 100%;
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
  width: 20%;
}

.card_deta .deta-list:nth-child(1) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card_deta .deta-list .yue {
  width: 80%;
}

.card_deta .deta-list .yue span:nth-child(1) {
  display: inline-block;
  width: 25%;
}

.card_deta .deta-list button {
  width: 1.4rem;
  background: #ef6213;
  border: none;
  border-radius: 0.1rem;
  height: 0.5rem;
  color: #fff;
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
  padding-bottom: 0.1rem;
  display: flex;
  justify-content: space-between;
}

.detail_con .detail_re span {
  color: #333;
}

.detail_con .detail_time {
  text-align: right;
  color: #777777;
}
</style>
