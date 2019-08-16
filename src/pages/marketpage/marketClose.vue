<template>
  <div id="marketClose">
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
          <div class="shapping_list" v-for="(item,index) in shopList" :key="index">
            <img :src="item.img" />
            <div class="shopping_info">
              <div class="shop_tit">
                <span>{{item.name}}</span>
              </div>
              <div class="shop_num" v-show="item.specs != ''">
                <span>规格: {{item.specs}}</span>
              </div>
              <div class="redpack">
                <h3>
                  <span>售价: {{item.price}}元</span>
                  <span>会员价: {{item.integral}}元</span>
                </h3>
                <span>X{{item.number}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="invoice">
          <span>发票类型</span>
          <select
            id="test"
            v-model="invoice_type"
            @change="gradeChange($event)"
            class="selectpicker"
          >
            <option v-for="(item,index) in options" :key="index" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="invoice_info" v-show="fainfo">
          <h4>发票信息</h4>
          <div class="invoice_radio">
            <input type="radio" v-model="invoice_user" @click="resultone" value="1" id="paixu1" />
            <label for="paixu1" style="cursor:pointer">个人</label>
            <input type="radio" v-model="invoice_user" @click="resulttwo" value="2" id="paixu2" />
            <label for="paixu2" style="cursor:pointer">公司</label>
          </div>
          <div class="rise" id="person" v-show="showper">
            <!-- 个人 -->
            <div class="rise_list">
              <span>发票抬头</span>
              <input
                type="text"
                v-model="invoice_header"
                name
                placeholder="个人 (不可修改)"
                disabled="disabled"
              />
            </div>
            <div class="rise_list">
              <span>手机号</span>
              <input type="text" v-model="invoice_phone" name placeholder="请输入手机号" />
            </div>
          </div>
          <div class="rise" id="gongsi" v-show="gongsi">
            <!-- 公司 -->
            <div class="rise_list">
              <span>发票抬头</span>
              <input type="text" v-model="invoice_header" name placeholder="请输入发票抬头" />
            </div>
            <div class="rise_list">
              <span>手机号</span>
              <input type="text" v-model="invoice_phone" name placeholder="请输入手机号" />
            </div>
            <div class="rise_list">
              <span>识别号</span>
              <input type="text" v-model="invoice_code" name placeholder="请输入纳税人识别号或统一社会信用代码" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="close_footer">
      <div class="cl_radio">
        <input type="radio" v-model="type" value="0" id="paixu3" />
        <label for="paixu3" style="cursor:pointer">非会员</label>
        <input type="radio" v-model="type" value="1" id="paixu4" />
        <label for="paixu4" style="cursor:pointer">会员</label>
      </div>
      <div class="close_ac">
        <h4>
          合计：
          <span v-if="type==0">售价:{{allMoney}}元</span>
          <span v-if="type==1">会员价:{{allGufen}}元</span>
        </h4>
        <button @click="submitOrder">提交订单</button>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
import { Group, Cell, InlineXNumber } from "vux";
export default {
  components: {
    Group,
    Cell,
    InlineXNumber,
    Indicator,
    Toast
  },
  data() {
    return {
      fainfo: false, //发票信息隐藏
      showper: true, //个人发票显示
      gongsi: false, //公司发票隐藏
      type: 0, //会员非会员
      invoice_user: 1, //个人发票
      invoice_type: 1, //发票类型 （不开发票）
      invoice_header: "", //发票抬头
      invoice_phone: "", //发票手机号
      invoice_code: "", //发票识别号
      options: [
        {
          //发票类型
          id: 1,
          name: "不开发票"
        },
        {
          id: 2,
          name: "电子发票"
        },
        {
          id: 3,
          name: "纸质发票"
        }
      ],
      shopList: JSON.parse(sessionStorage.getItem("orderList")) || [],
      address: [],
      allMoney: "0", //合计 售价
      allGufen: "0" //合计 会员价
    };
  },
  mounted() {
    let that = this;
    that.getClearshop();
    var money = 0;
    var gufen = 0;
    $.each(that.shopList, function(index, item) {
      money += Number(item.price) * item.number;
      gufen += Number(item.integral) * item.number;
    });
    this.allMoney = money;
    this.allGufen = gufen;
  },
  methods: {
    back() {
      sessionStorage.removeItem("addressIndex");
      this.$router.go(-1); //返回上一层
    },
    gotoSuborder() {
      this.$router.push({
        path: "/submitOrder"
      });
    },
    gotoAddress() {
      this.$router.push({
        path: "/marketAddress"
      });
    },
    // 获取默认地址
    getClearshop() {
      let that = this;
      var shopArr = [];
      $.each(that.shopList, function(i, item) {
        shopArr.push([item.id, item.number]); //数组形式[[2（购物车ID）,2（商品数量）],[1,3]]
      });
      if (sessionStorage.getItem("addressIndex")) {
        var index = Number(sessionStorage.getItem("addressIndex"));
        var addressList = JSON.parse(sessionStorage.getItem("address"));
        that.address = addressList[index];
      } else {
        that
          .$http({
            url: "Goodspj/clear_shopping",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              data: shopArr
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              that.address = res.data.data.address;
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
      }
    },
    //提交订单
    submitOrder() {
      let that = this;
      let address_id = that.address.id;
      let invoice_header = that.invoice_header;
      let invoice_phone = that.invoice_phone;
      let invoice_code = that.invoice_code;
      let invoice_type = that.invoice_type;
      let invoice_user = that.invoice_user;
      let type = that.type;
      var jsonData;
      let comArr = [];
      // console.log(that.shopList);
      // return;
      $.each(that.shopList, function(i, item) {
        comArr.push([item.goods_id, item.number, item.specs]); //数组形式[[2（商品ID）,2（商品数量）],[1,3]]
      });

      if (type == 0) {
        //非会员
        if (invoice_type == 1) {
          // 不开发票
          jsonData = {
            token: localStorage.getItem("token"),
            address_id: address_id,
            data: comArr,
            invoice_type: 1,
            type: type
          };
        } else if (invoice_type == 2) {
          //电子发票
          if (invoice_user == 1) {
            //个人
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 2,
              invoice_header: "个人",
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              type: type
            };
          } else if (invoice_user == 2) {
            //公司
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 2,
              invoice_header: invoice_header,
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              invoice_code: invoice_code,
              type: type
            };
          }
        } else if (invoice_type == 3) {
          //纸质发票
          if (invoice_user == 1) {
            // 个人
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 3,
              invoice_header: "个人",
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              type: type
            };
          } else if (invoice_user == 2) {
            // 公司
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 3,
              invoice_header: invoice_header,
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              invoice_code: invoice_code,
              type: type
            };
          }
        }
      } else if (type == 1) {
        //会员
        if (invoice_type == 1) {
          // 不开发票
          jsonData = {
            token: localStorage.getItem("token"),
            address_id: address_id,
            data: comArr,
            invoice_type: 1,
            type: type
          };
        } else if (invoice_type == 2) {
          //电子发票
          if (invoice_user == 1) {
            //个人
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 2,
              invoice_header: "个人",
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              type: type
            };
          } else if (invoice_user == 2) {
            //公司
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 2,
              invoice_header: invoice_header,
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              invoice_code: invoice_code,
              type: type
            };
          }
        } else if (invoice_type == 3) {
          //纸质发票
          if (invoice_user == 1) {
            // 个人
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 3,
              invoice_header: "个人",
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              type: type
            };
          } else if (invoice_user == 2) {
            // 公司
            jsonData = {
              token: localStorage.getItem("token"),
              address_id: address_id,
              data: comArr,
              invoice_type: 3,
              invoice_header: invoice_header,
              invoice_phone: invoice_phone,
              invoice_user: invoice_user,
              invoice_code: invoice_code,
              type: type
            };
          }
        }
      }
      that.httpSubmit(jsonData);
    },
    // 提交 请求
    httpSubmit(jsonData) {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "goods_orderpj/generateOrder",
          method: "post",
          data: jsonData
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功
            Toast("提交成功,在我的订单中付款");
            that.$router.push({
              path: "/marketOrder"
            });
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
    // 发票信息显示
    showFa: function() {
      var that = this;
      that.fainfo = true;
    },
    //发票信息隐藏
    hideFa: function() {
      var that = this;
      that.fainfo = false;
    },
    //判断选中的是那种发票类型
    gradeChange: function(e) {
      let that = this;
      var selectIndex = e.target.value;
      that.invoice_type = selectIndex;
      if (that.invoice_type == 2 || that.invoice_type == 3) {
        that.showFa();
      } else {
        that.hideFa();
      }
    },
    //判断选中的是个人还是公司
    resultone: function() {
      let that = this;
      let paixu1 = $("#paixu1");
      if (paixu1.is(":checked")) {
        that.showper = true;
        that.gongsi = false;
      } else {
        that.showper = false;
      }
    },
    //判断选中的是个人还是公司
    resulttwo: function() {
      let that = this;
      let paixu2 = $("#paixu2");
      if (paixu2.is(":checked")) {
        that.gongsi = true;
        that.showper = false;
      } else {
        that.gongsi = false;
      }
    }
  }
};
</script>

<style scoped="scoped">
#marketClose {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 2.4rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
  padding-bottom: 0.2rem;
}

.mint-header {
  background: #ef6213;
}

.sh_content {
  width: 100%;
  margin-top: 0.2rem;
}

.shop_address {
  padding: 0 0.2rem;
  border-bottom: 1px solid #ddd;
}

.address_list {
  font-size: 0.28rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.2rem 0;
}

.address_list:nth-child(1) {
  padding: 0;
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
  font-size: 0.26rem;
  color: #ef6213;
}
.shopping_info h3 span:nth-child(1) {
  color: #666;
  font-size: 0.24rem;
  margin-right: 0.2rem;
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
  margin-left: 0.2rem;
  font-size: 0.32rem;
}

.invoice_radio > label::before,
.cl_radio > label::before {
  display: inline-block;
  content: "";
  width: 0.32rem;
  height: 0.32rem;
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
  padding: 0.2rem;
}

.close_ac {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.28rem;
  padding: 0 0.2rem 0.2rem;
}

.close_ac h4 {
  font-weight: normal;
  color: #ef6213;
}
.close_ac h4 span:nth-child(1) {
  padding-right: 0.2rem;
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
</style>
