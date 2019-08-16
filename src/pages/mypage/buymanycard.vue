<template>
  <div id="buymanycad">
    <mt-header fixed title="多倍卡">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="buy_con">
        <div class="buy_list" v-for="(item,index) in buyMultList" :key="index">
          <div class="buy_card">
            <img src="../../assets/img/many.png" />
            <span>{{item.multiple}}倍</span>
          </div>
          <button @click="showDialog(item)">购买</button>
        </div>
      </div>
    </div>
    <!-- 购买 -->
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>确认信息</h4>
        <div class="number">
          <span>多倍卡</span>
          <span>{{multiple}}倍</span>
        </div>
        <div class="number">
          <span>价格</span>
          <span>{{price}}米粒</span>
        </div>
        <div class="number">
          <span>数量(张)</span>
          <input type="text" v-model="number" name="money" placeholder />
        </div>
        <div class="number">
          <span>交易密码</span>
          <input type="password" v-model="payment_password" name="pass" placeholder="请输入交易密码" />
        </div>
        <button @click="multipleBuy">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from "vux";
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast,
    XDialog
  },
  data() {
    return {
      buyMultList: [], //多倍卡数据
      lang_dlg: false, //购买弹窗
      payment_password: "", //交易密码
      number: "", //数量
      id: "", //多倍卡id
      price: "", //多倍卡价格
      multiple: "" //几倍卡
    };
  },
  mounted: function() {
    let that = this;
    that.getBuyMultiple();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoBuy() {
      this.$router.push({
        path: "/buymanycard"
      });
    },
    //弹出确认弹窗
    showDialog: function(item) {
      var that = this;
      that.id = item.id;
      that.price = item.price;
      that.multiple = item.multiple;
      that.lang_dlg = true;
    },
    //关闭确认弹窗
    closeDialog: function(item) {
      var that = this;

      that.lang_dlg = false;
    },
    //获取多倍卡
    getBuyMultiple() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "hong_bao/multipleList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.buyMultList = res.data.data.list;
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
    //购买
    multipleBuy() {
      let that = this;
      if (!that.number || that.number == null) {
        Toast("请输入购买数量");
      } else if (!that.payment_password || that.payment_password == null) {
        Toast("请输入交易密码");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "hong_bao/multipleBuy",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              id: that.id,
              number: that.number,
              payment_password: that.payment_password
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast(res.data.msg);
              that.number = "";
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

<style scoped="scoped">
#buymanycad {
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

.buy_con {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}
.buy_list {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.2rem 0.1rem;
}
.buy_list img {
  width: 1.4rem;
  height: 100%;
}
.buy_list .buy_card {
  position: relative;
}
.buy_list .buy_card span {
  position: absolute;
  top: 0.26rem;
  left: 0.4rem;
  color: #fff;
  font-size: 0.26rem;
}
.buy_list button {
  width: 1.2rem;
  height: 0.5rem;
  color: #fff;
  border: none;
  border-radius: 0.2rem;
  background: #ef6213;
  margin-top: 0.2rem;
}
#buymanycad .dialog {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
}

#buymanycad .dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

#localshop .dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
}

#buymanycad .dialog .haufei {
  padding-top: 0.4rem;
  font-size: 0.28rem;
}

#buymanycad .dialog .haufei a {
  color: #ef6213;
}

#buymanycad .dialog .number {
  margin: 0.2rem 0;
  display: flex;
  font-size: 0.26rem;
  align-items: center;
}
#buymanycad .dialog h5 {
  padding-bottom: 0.2rem;
  font-size: 0.24rem;
  font-weight: normal;
  color: #ef6213;
}
#buymanycad .dialog .number span {
  width: 30%;
  text-align: start;
}
#buymanycad .dialog .number input {
  width: 70%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
  background: #fff;
}

#buymanycad .dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin: 0 auto;
  /* margin: 0.4rem 0; */
  border: none;

  border-radius: 0.1rem;
}
</style>
