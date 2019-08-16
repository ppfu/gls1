<template>
  <div id="recharge">
    <mt-header fixed title="充值">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <h6 slot="right" @click="gotoDeta">流水明细</h6>
    </mt-header>
    <div class="con-wrapper">
      <div class="recha_con">
        <div class="recha_list">
          <span>充值类型：</span>
          <select id="test" v-model="type" @change="selectChange($event)" class="selectpicker">
            <option v-for="item in options" :key="item.id" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <!-- 资产类型——余额-->
        <div class="recha_list" v-if="type == 1">
          <span>当前余额：</span>
          <span>{{rechargeList.balance}}元</span>
        </div>
        <!-- 资产类型——米宝-->
        <div class="recha_list" v-if="type == 2">
          <span>当前米宝：</span>
          <span>{{rechargeList.mibao}}元</span>
        </div>
        <!-- 资产类型——红包-->
        <div class="recha_list" v-if="type == 3">
          <span>当前红包：</span>
          <span>{{rechargeList.hongbao}}元</span>
        </div>
        <!-- 资产类型——会员卡余额-->
        <div class="recha_list" v-if="type == 4">
          <span>会员卡余额：</span>
          <span>{{rechargeList.member_card}}元</span>
        </div>
        <!-- 资产类型——谷联卡余额-->
        <div class="recha_list" v-if="type == 5">
          <span>谷联卡余额：</span>
          <span>{{rechargeList.gulian_card}}元</span>
        </div>
        <div class="recha_list">
          <span>交易金额(元)：</span>
          <input type="text" v-model="money" name="money" placeholder="请输入充值金额" />
        </div>
        <div class="recha_list">
          <span>交易密码：</span>
          <input type="password" v-model="payment_password" name="chpay" placeholder="请输入交易密码" />
        </div>
        <mt-button type="default" @click="recharge">确认</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    Toast,
    Indicator
  },
  data() {
    return {
      rechargeList: [], //我的资产
      money: "", //充值金额
      type: 1, //充值类型
      payment_password: "", //交易密码
      options: [
        {
          //充值类型
          id: 1,
          name: "余额"
        },
        {
          id: 2,
          name: "米宝"
        },
        {
          id: 3,
          name: "红包"
        },
        {
          id: 4,
          name: "会员卡"
        },
        {
          id: 5,
          name: "谷联卡"
        }
      ]
    };
  },
  mounted: function() {
    let that = this;
    that.getRecharge();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoDeta() {
      this.$router.push({
        path: "/rechDetail"
      });
    },
    //选择充值类型
    selectChange(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      that.type = selectIndex;
    },
    //获取我的资产
    getRecharge() {
      let that = this;
      that
        .$http({
          url: "Personal/rechargePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.rechargeList = res.data.data;
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
    //充值
    recharge() {
      let that = this;
      if (!that.money || that.money == null) {
        Toast("请输入充值金额");
      } else if (!that.payment_password || that.payment_password == null) {
        Toast("请输入交易密码");
      } else {
        if (that.type == 1) { // 余额充值
          window.open("https://wxpay.wxutil.com/mch/pay/h5.v2.php");
        } else {
          Indicator.open({
            text: "提交中..."
          });
          that
            .$http({
              url: "Personal/rechargeActive",
              method: "post",
              data: {
                token: localStorage.getItem("token"),
                type: that.type,
                money: that.money,
                payment_password: that.payment_password
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
  }
};
</script>

<style scoped="scoped">
.mint-header {
  position: relative;
  background: #ef6213;
}
#recharge h6{
	  font-size: 0.26rem;
	  font-weight: normal;
  }

#recharge {
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

.recha_con {
  width: 100%;
  padding: 0 0.2rem;
}

.recha_con .recha_list {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.2rem 0;
}
.recha_con .recha_list select {
  flex: 1;
  height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  color: #555555;
}
.recha_con .recha_list span {
  color: #333;
  font-size: 0.28rem;
}

.recha_con .recha_list span:nth-child(1) {
  padding-right: 0.1rem;
  width: 30%;
}

.recha_con .recha_list input {
  flex: 1;
  height: 0.8rem;
  line-height: 0.8rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  padding-left: 0.1rem;
}
.recha_con .mint-button {
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
