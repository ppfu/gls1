<template>
  <div id="shoppingCar">
    <mt-header fixed title="结算">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="sh_content">
        <div class="shop_address">
          <div class="address_list">
            <span>收货人：{{address.name}}</span>
            <span>{{address.phone}}</span>
          </div>
          <div class="address_list" @click="gotoAddress">
            <div class="add_img">
              <span class="iconfont icon-tabaddress"></span>
              <span>收货地址：</span>
              <span>{{address.address}}</span>
            </div>
            <span class="iconfont icon-tabgengduo"></span>
          </div>
        </div>
        <div class="list-box">
          <div class="shapping_list">
            <img :src="shopList.img" />
            <div class="shopping_info">
              <div class="shop_tit">
                <span>{{shopList.title}}</span>
              </div>
              <div class="redpack">
                <h3>{{shopList.price}} 元</h3>
                <span>X{{shopList.number}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="close_footer">
      <div class="close_ac">
        <h4>合计：{{shopList.price * shopList.number}} 元</h4>
        <button @click="showDialog">提交预定</button>
      </div>
    </div>
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>{{is_book==0?'预定确认':"再次预定确认"}}</h4>
        <div class="number">
          <span>产品:</span>
          <span>{{shopList.title}}</span>
        </div>
        <div class="number">
          <span>单价:</span>
          <span>{{shopList.price}} 元</span>
        </div>
        <div class="number">
          <span>数量:</span>
          <span>{{shopList.number}}</span>
        </div>
        <div class="number">
          <span>总价:</span>
          <span>{{shopList.price * shopList.number}} 元</span>
        </div>
        <div class="number">
          <span>交易密码:</span>
          <input type="password" v-model="password" placeholder="请输入交易密码" />
        </div>
        <button @click="submitOrder">确定</button>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
import { XDialog } from "vux";
export default {
  components: {
    XDialog,
    Indicator,
    Toast
  },
  data() {
    return {
      lang_dlg: false, //购买弹窗
      shopList: JSON.parse(sessionStorage.getItem("orderList")) || [],
      id: this.$route.query.id,
      address: [],
      address_id: "", //地址id
      is_book: 0, //是否是再次预定
      totalNumber: "", //数量
      price: "", //价格
      password: ""
    };
  },
  mounted() {
    this.getClearshop();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoAddress() {
      this.$router.push({
        path: "/marketAddress"
      });
    },
    // 获取默认地址
    getClearshop() {
      let that = this;
      that
        .$http({
          url: "subscribe/activeView",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.address = res.data.data.address;
            that.address_id = res.data.data.address.id;
            that.is_book = res.data.data.is_book; // 0首次预定1再次预定
          } else {
            //失败
            Toast(res.data.msg);
          }
        });
    },
    //弹出确认弹窗
    showDialog() {
      if (this.address_id == undefined) {
        Toast("请选择收货地址");
      } else {
        this.lang_dlg = true;
      }
    },
    //关闭确认弹窗
    closeDialog: function() {
      this.lang_dlg = false;
    },
    //提交订单
    submitOrder(jsonData) {
      let that = this;
      if (that.password == "") {
        Toast("请输入交易密码");
      } else {
        Indicator.open({
          text: "提交中..."
        });
        that
          .$http({
            url: "subscribe/subscribeActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              id: that.id,
              number: that.shopList.number,
              price: that.shopList.price * that.shopList.number,
              address_id: that.address_id,
              password: that.password
            }
          })
          .then(function(res) {
            Indicator.close();
            if (res.data.code == 0) {
              //成功
              Toast(res.data.msg);
              that.lang_dlg = false;
              that.$router.push({
                path: "/reserecord"
              });
            } else {
              //失败
              Toast(res.data.msg);
              // Toast({
              //   message: res.data.msg,
              //   duration: 50000
              // });
            }
          })
          .catch(function(error) {
            Indicator.close();
          });
      }
    }
  }
};
</script>

<style scoped="scoped">
#shoppingCar {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 1.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
  padding-bottom: 1rem;
}

.mint-header {
  background: #ef6213;
}

.sh_content {
  width: 100%;
}

.shop_address {
  padding: 0.2rem;
  border-bottom: 1px solid #ddd;
}

.address_list {
  font-size: 0.28rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.1rem 0;
}

.address_list:nth-child(1) {
  padding: 0 0.3rem;
}

.address_list .iconfont {
  font-size: 0.32rem;
}

.address_list .add_img .iconfont {
  color: #ef6213;
}

.list-box {
  padding: 0 0.2rem;
}

.list-box .shapping_list:last-child {
  border: none !important;
}

.shapping_list {
  display: flex;
  width: 100%;
  padding: 0.2rem 0;
  border-bottom: 1px dashed #ddd;
}

.shapping_list img {
  width: 1.6rem;
  height: 1.6rem;
}

.shopping_info {
  padding-left: 0.2rem;
  flex: 1;
  font-size: 0.28rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shopping_info .redpack {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.shopping_info h3 {
  font-weight: normal;
  font-size: 0.28rem;
  color: #ef6213;
}

.invoice {
  display: flex;
  align-items: center;
  font-size: 0.28rem;
  padding: 0.2rem;
}

.invoice select {
  height: 0.6rem;
  flex: 1;
  border-radius: 0.1rem;
  margin-left: 0.2rem;
}

.invoice_info {
  padding: 0 0.2rem;
}

.invoice_info h4 {
  padding: 0.2rem 0;
}

.invoice_radio {
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 0.2rem;
  font-size: 0.28rem;
}

.invoice_radio > input,
.cl_radio > input {
  display: none;
}

.invoice_radio > label,
.cl_radio > label {
  position: relative;
  margin-right: 0.2rem;
}

.invoice_radio > label::before,
.cl_radio > label::before {
  display: inline-block;
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgb(219, 219, 219);
  margin-right: 0.12rem;
  vertical-align: bottom;
}

.invoice_radio > input:checked + label::before,
.cl_radio > input:checked + label::before {
  background-color: #ef6213;
}

.invoice_radio > input:checked + label::after,
.cl_radio > input:checked + label::after {
  display: inline-block;
  content: "";
  width: 0.12rem;
  height: 0.12rem;
  border-radius: 50%;
  position: absolute;
  left: 0.12rem;
  bottom: 0.12rem;
  background-color: white;
}

.invoice_radio {
  text-align: center;
}

.invoice_btn {
  display: flex;
  justify-content: space-around;
}

.invoice_btn button {
  padding: 0.1rem 0.5rem;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}

.invoice_btn button:nth-child(1) {
  background: #ef6213;
}

.rise .rise_list {
  display: flex;
  align-items: center;
  padding-top: 0.2rem;
  font-size: 0.28rem;
}

.rise .rise_list span:nth-child(1) {
  width: 24%;
}

.rise_list input {
  flex: 1;
  height: 0.6rem;
  border: none;
  background: #fff;
}

#test {
  display: block;
}

.close_footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #ddd;
}

.close_footer .cl_radio {
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem 5%;
}

.close_ac {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.28rem;
  padding: 0.2rem;
}

.close_ac h4 {
  font-weight: normal;
  color: #ef6213;
}

.close_ac button {
  width: 2rem;
  font-size: 0.28rem;
  line-height: 0.6rem;
  background: #ef6213;
  color: #fff;
  border: none;
  border-radius: 0.08rem;
}

.dialog {
  width: 80%;
  margin: 0 auto;
  /* height: 4rem; */
  padding: 0.2rem 0 0.25rem;
}

.dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

.dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
  margin-bottom: 0.2rem;
}

.dialog .ktype {
  display: flex;
  padding: 0.1rem 0;
  font-size: 0.26rem;
}
.dialog .ktype span:nth-child(1) {
  padding: 0 0.5rem;
}

.dialog .haufei a {
  color: #ef6213;
}

.dialog .number {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  padding: 0.1rem 0;
  font-size: 0.28rem;
}
.dialog .number span:nth-child(1) {
  width: 35%;
  text-align: right;
  padding-right: 5%;
}

.dialog .number span:nth-last-child(1) {
  width: 65%;
  text-align: left;
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
