<template>
  <div id="marketAfterSale">
    <mt-header fixed title="申请售后">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="apply">
        <div class="apply_list">
          <div class="apply_content">
            <div class="apply_img">
              <img src="../../assets/img/6.jpg" />
            </div>
            <div class="apply_con">
              <div class="apply_title">
                <h4>{{sale.name}}</h4>
              </div>
              <div class="redpack">
                <span>{{sale.price}}元红包+{{sale.integral}}谷分</span>
                <span>X{{sale.number}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="refund_re">
          <h4>退款原因</h4>
          <textarea v-if="sale.refund_status == 0" v-model="reason" placeholder="请填写退款原因"></textarea>
          <textarea v-if="sale.refund_status == 1" placeholder>{{sale.reason}}</textarea>
        </div>
        <div class="refund_am">
          <span>退款金额：</span>
          <span>{{sale.refund_price}}元红包+{{sale.refund_integral}}谷分</span>
        </div>
        <!-- 未申请 -->
        <div class="before_sale" v-if="sale.refund_status == 0">
          <button class="btn" @click="submitSale">提交</button>
        </div>
        <!-- 已申请 -->
        <div class="after_sale" v-if="sale.refund_status == 1">
          <button class="btn">申请中</button>
          <button class="btn" @click="cancelPlay">取消</button>
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
      id: this.$route.query.id, //订单id
      sale: [], //售后信息
      reason: "" //申请售后理由
    };
  },
  mounted() {
    let that = this;
    that.getAfterSale();
    console.log(this.$route.query.id);
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取申请售后信息
    getAfterSale() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "goods_orderpj/afterSale",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.sale = res.data.data;
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
    //提交售后申请
    submitSale() {
      let that = this;
      let reason = that.reason;
      Indicator.open({
        text: "提交中..."
      });
      if (!reason || reason == null) {
        Toast("请填写申请理由");
      } else {
        that
          .$http({
            url: "goods_orderpj/afterSaleActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              id: that.id,
              reason: reason
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast("提交申请成功");
              that.getAfterSale();
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
    },
    //取消退款操作
    cancelPlay() {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });

      that
        .$http({
          url: "goods_orderpj/revokeAfterSale",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast("取消成功");
            that.back();
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
#marketAfterSale {
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

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.apply {
  margin-top: 0.2rem;
  width: 90%;
  margin: 0 auto;
}

.apply_content {
  display: flex;
  height: 1.4rem;
  align-items: center;
  margin-top: 0.2rem;
}

.apply_list {
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #e8e8e8;
}

.apply_list .apply_img {
  height: 100%;
  width: 26%;
}

.apply_list .apply_img img {
  width: 100%;
  height: 100%;
}

.apply_list .apply_con {
  margin-left: 0.2rem;
  flex: 1;
}

.apply_list .apply_con .apply_title h4 {
  font-size: 0.26rem;
  color: #333;
}

.apply_list .apply_con .redpack {
  padding-top: 0.2rem;
}

.apply_list .apply_con .redpack span {
  font-weight: normal;
  font-size: 0.22rem;
  color: #ef6213;
}

.apply_list .apply_con .redpack span:nth-child(2) {
  color: #333;
  padding-left: 0.2rem;
}

.refund_re h4 {
  padding: 0.2rem 0;
  font-weight: normal;
  font-size: 0.28rem;
}

.refund_re textarea {
  width: 100%;
  height: 2rem;
  padding-left: 0.1rem;
  padding-top: 0.1rem;
  font-size: 0.26rem;
  color: #555;
}

.refund_am {
  font-size: 0.28rem;
}

.refund_am span:nth-child(1) {
  color: #333;
}

.refund_am span:nth-child(2) {
  color: #ef6213;
}

.before_sale {
  text-align: center;
  margin-top: 2rem;
}

.before_sale button,
.after_sale button {
  font-size: 0.3rem;
  width: 6rem;
  height: 0.8rem;
  color: #fff;
  border: none;
  margin-top: 0.3rem;
  border-radius: 0.2rem;
  background: #ef6213;
}

.after_sale {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.after_sale button {
  width: 40%;
}

.after_sale button:nth-child(1) {
  background: #999;
}

.after_sale button:nth-child(2) {
  background: none;
  border: 1px solid #ef6213;
  color: #ef6213;
}
</style>
