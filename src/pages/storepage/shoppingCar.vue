<template>
  <div id="shoppingCar">
    <mt-header fixed title="购物车">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper" v-if="shopList.length != 0">
      <div class="sh_content">
        <div class="shapping_list" v-for="(item,index) in shopList" :key="index">
          <div class="check">
            <label :for="item.idname">
              <input type="checkbox" :id="item.idname" class="dis-none" v-model="item.ischeck" />
              <div class="checkboxdiv"></div>
            </label>
          </div>
          <img :src="item.img" />
          <div class="shopping_info">
            <div class="shop_tit">
              <span>{{item.name}}</span>
              <span class="iconfont icon-tabshanchu" @click="dele(index,item.id)"></span>
            </div>
            <div class="shop_num">
              <span v-show="item.specs != ''">规格: {{item.specs}}</span>
              <span v-show="item.specs == ''"></span>
              <van-stepper v-model="item.number" :min="1" input-width="1rem" button-size="0.4rem" />
            </div>
            <h3>{{item.price}}元红包+{{item.integral}}谷分</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="close_ac">
      <div class="check">
        <label for="test1">
          <input type="checkbox" v-model="checkAll" id="test1" />
          <div class="checkboxdiv"></div>
        </label>
        <span>全选</span>
      </div>
      <h4>合计：{{allMoney}}元红包+{{allGufen}}谷分</h4>
      <button @click="pay" :disabled="disabled">结算</button>
    </div>
    <div id="no-data" v-if="shopList.length == 0">
      <img src="../../assets/img/nodata.png" />
    </div>
  </div>
</template>

<script>
import { InlineXNumber } from "vux";
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    InlineXNumber
  },
  data() {
    return {
      shopList: [], //购物车列表
      checkAll: false, //是否全选
      checkSome: false, //部分选中
      disabled: true, //结算按钮是否可以点击
      allMoney: "0.00", //合计 红包
      allGufen: "0" //合计股份
    };
  },
  // 监听
  watch: {
    checkAll(val, oldVal) {
      //普通的watch监听
      if (val == true) {
        $.each(this.shopList, function(index, item) {
          item.ischeck = true;
        });
        this.disabled = false;
      } else if (val == false) {
        if (!this.checkSome) {
          $.each(this.shopList, function(index, item) {
            item.ischeck = false;
          });
          this.disabled = true;
        }
      }
    },
    shopList: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        // 计算 总钱数
        if (val.length == 0) {
          this.allMoney = "0.00";
          this.allGufen = "0";
          this.disabled = true;
          this.checkAll = false;
        } else {
          var money = 0;
          var gufen = 0;
          $.each(val, function(index, item) {
            if (item.ischeck) {
              money += Number(item.price) * item.number;
              gufen += Number(item.integral) * item.number;
            }
          });
          this.allMoney = money.toFixed(2);
          this.allGufen = gufen;
          var trueNum = 0; //记录选中多少条
          $.each(val, function(index, item) {
            if (item.ischeck == true) {
              trueNum += 1;
            }
          });
          if (trueNum == 0) {
            this.checkAll = false;
            this.disabled = true;
            this.checkSome = false;
          } else if (trueNum == val.length) {
            this.checkAll = true;
            this.disabled = false;
            this.checkSome = false;
          } else {
            this.checkAll = false;
            this.disabled = false;
            this.checkSome = true;
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    let that = this;
    that.getCarList();
  },
  methods: {
    //获取购物车列表
    getCarList() {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Goods/goods_shopping",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            if (res.data.data.length != 0) {
              var arr = [];
              $.each(res.data.data, function(index, item) {
                item["ischeck"] = false;
                item["idname"] = "test1" + index;
                arr.push(item);
              });
              that.shopList = arr;
            } else {
              that.shopList = [];
            }
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
    },
    // 删除购物车
    dele(index, id) {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Goods/del_shopping",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast({
              message: res.data.msg,
              position: "bottom",
              duration: 2000
            });
            that.shopList.splice(index, 1);
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
    },
    // 结算
    pay() {
      let that = this;
      var arr = [];
      $.each(that.shopList, function(index, item) {
        if (item.ischeck == true) {
          arr.push(item);
        }
      });
      window.sessionStorage.setItem("orderList", JSON.stringify(arr));
      that.$router.push({
        path: "/closeAccount"
      });
    },
    //   返回
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoClose() {
      this.$router.push({
        path: "/closeAccount"
      });
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
}

#test,
#test1 {
  display: none;
}
.dis-none {
  display: none;
}
.checkboxdiv {
  width: 0.36rem;
  height: 0.36rem;
  display: inline-block;
  background-color: gray;
  border: 2px solid #c8c8c8;
  border-radius: 4px;
  background: #fff;
  margin-right: 0.1rem;
  vertical-align: middle;
}

.dis-none:checked ~ .checkboxdiv {
  background: url("../../assets/img/checkbox_icon.png") no-repeat center;
  background-size: 100% 100%;
  border: 2px solid #ef6213;
}
#test1:checked ~ .checkboxdiv {
  background: url("../../assets/img/checkbox_icon.png") no-repeat center;
  background-size: 100% 100%;
  border: 2px solid #ef6213;
}

.mint-header {
  background: #ef6213;
}

.sh_content {
  width: 100%;
  padding: 0 0.2rem;
}

.shapping_list {
  width: 100%;
  padding: 0.2rem 0;
  border-bottom: 1px dashed #ddd;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
}

.shapping_list .check {
  display: flex;
  align-items: center;
}

.shapping_list .check input {
  margin-right: 0.1rem;
}

.shapping_list img {
  width: 24%;
  height: 1.6rem;
}

.shopping_info {
  padding-left: 0.1rem;
  font-size: 0.28rem;
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.shopping_info .shop_tit {
  font-size: 0.28rem;
  display: flex;
  justify-content: space-between;
}

.shopping_info .shop_num {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.1rem 0;
  font-size: 0.26rem;
}

.shopping_info h3 {
  font-weight: normal;
  font-size: 0.24rem;
  color: #ef6213;
  padding-top: 0.2rem;
}

.close_ac {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  padding: 0.2rem;
  font-size: 0.28rem;
  background: #fff;
  border-top: 1px solid #ddd;
}
.close_ac h4 {
  font-weight: normal;
  color: #ef6213;
}

.close_ac button {
  width: 1.6rem;
  height: 0.6rem;
  background: #ef6213;
  border-radius: 0.1rem;
  color: #fff;
  border: none;
}
.close_ac button:disabled {
  background: #ddd;
}
/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 4rem;
  transition: all 0.2s;
}
#no-data > img {
  width: 40%;
  height: auto;
}
</style>
