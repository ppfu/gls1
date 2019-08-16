<template>
  <div id="localshop">
    <mt-header fixed title="线下商户">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <p slot="right" @click="gotoPay">付款记录</p>
    </mt-header>
    <div class="con-wrapper">
      <div class="yipin_se">
        <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
          <option
            v-for="(areaitem, index) in areaList"
            :key="index"
            :value="areaitem.id"
          >{{areaitem.name}}</option>
        </select>
        <div class="search">
          <input
            type="search"
            placeholder="请输入名称进行搜索"
            style="border: 1px solid #c8c8c8; color: #333;"
            @blur="search"
            v-model="name"
          />
          <button :disabled="name == ''" @click="search">
            <i class="iconfont icon-tabsearch"></i>
          </button>
        </div>
      </div>
      <div class="scroll_div">
        <van-pull-refresh
          v-model="updateLoading"
          pulling-text="下拉刷新"
          loosing-text="释放更新"
          loading-text="正在加载..."
          @refresh="onRefresh"
        >
          <van-list
            v-model="moreloading"
            :finished="finished"
            :immediate-check="false"
            finished-text="————— 已经没有更多了 —————"
            @load="onLoad"
          >
            <div class="local_content">
              <div class="local">
                <div
                  class="content_list"
                  @click="showDialog(localitem.code,localitem.name)"
                  v-for="(localitem,index) in localshop"
                  :key="index"
                >
                  <img :src="localitem.img" />
                  <div class="con-title">
                    <h3>{{localitem.name}}</h3>
                    <div class="address">
                      <span class="iconfont icon-tabaddress"></span>
                      <span>{{localitem.address}}</span>
                    </div>
                  </div>
                </div>
                <!-- <div class="more">查看更多>></div> -->
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <!-- 购买 -->
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>红包付款</h4>
        <div class="number">
          <span>红包金额(元)</span>
          <input type="text" v-model="money" name="money" placeholder="请输入红包金额" />
        </div>
        <div class="number">
          <span>商家识别号</span>
          <input type="text" v-model="code" name="code" disabled="disabled" />
        </div>
        <div class="number">
          <span>商家名称</span>
          <span>{{name1}}</span>
        </div>
        <div class="number">
          <span>交易密码</span>
          <input type="password" v-model="payment_password" name="pass" placeholder="请输入交易密码" />
        </div>
        <h5>备注：付款成功后请注意给线下商户展示</h5>
        <button @click="payMoney">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog, LoadMore } from "vux";
import { Indicator } from "mint-ui";
export default {
  components: {
    Indicator,
    XDialog
  },
  data() {
    return {
      pageindex: 1,
      area_id: 1, //区域id
      name: "", //商铺名称
      name1: "", //
      localshop: [], //商铺数据
      localshopTotal: 0, // 店铺总数量
      areaList: [], //区域列表
      lang_dlg: false, //购买弹窗
      payment_password: "", //支付密码
      money: "", //金额
      code: "", //商户识别码
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted: function() {
    let that = this;
    that.getLocalShop();
    that.getAreaList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoPay() {
      this.$router.push({
        path: "/payrecord"
      });
    },
    //选择区域
    selectChange(i) {
      let that = this;
      that.area_id = Number(i.target.value);
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.localshop = [];
      that.localshopTotal = 0;
      that.getLocalShop(0);
    },
    //弹出确认弹窗
    showDialog: function(code, name) {
      var that = this;
      that.code = code;
      that.name1 = name;
      that.lang_dlg = true;
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
      that.money = "";
    },
    //下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.localshop = [];
      that.localshopTotal = 0;
      that.getLocalShop(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getLocalShop(1);
    },
    //获取线下商户
    getLocalShop(type) {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/underShop",
          method: "post",
          data: {
            area_id: that.area_id,
            name: that.name,
            p: that.pageindex
          }
        })
        .then(res => {
          Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.localshop = res.data.data.list;
                that.localshopTotal = res.data.data.count;
                if (that.localshop.length >= that.localshopTotal) {
                  //全部数据已加载
                  that.finished = true;
                }
              } else {
                that.finished = true;
              }
              that.updateLoading = false;
            } else {
              that.moreloading = false;
              if (res.data.data.list.length > 0) {
                that.localshop = that.localshop.concat(res.data.data.list);
                that.localshopTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.localshop.length >= that.localshopTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
          } else {
            Toast(res.data.msg);
          }
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
    //搜索
    search() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.shopList = [];
      that.shopListTotal = 0;
      that.getLocalShop(0);
    },
    //获取地址列表
    getAreaList() {
      let that = this;
      that
        .$http({
          url: "Register/areaList",
          method: "post"
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.areaList = res.data.data;
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
    //付款
    payMoney() {
      let that = this;
      if (!that.money || that.money == null) {
        Toast("请输入红包金额");
      } else if (!that.payment_password || that.payment_password == null) {
        Toast("请输入交易密码");
      } else {
        that
          .$http({
            url: "Subscribe/underShopActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              code: that.code,
              money: that.money,
              payment_password: that.payment_password
            }
          })
          .then(function(res) {
            if (res.data.code == 0) {
              //成功回调
              Toast("付款成功");
              that.closeDialog();
              that.payment_password = "";
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
    }
  }
};
</script>

<style scoped="scoped">
#localshop {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 0.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
}

.mint-header {
  background: #ef6213;
}
#localshop p {
  right: 1rem;
}
.mint-toast {
  z-index: 99999 !important;
}
.yipin_se {
  display: flex;
  display: -webkit-flex;
  width: 100%;
  margin: 0 auto;
  padding: 0.2rem;
  position: relative;
}
.scroll_div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 0.2rem;
}
.yipin_se select {
  width: 2rem;
  height: 0.6rem;
  border: 1px solid #c8c8c8;
  border-radius: 1rem;
  color: #333;
  background: white;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding: 0 0.28rem 0.05rem 0.1rem;
  line-height: 0.6rem;
  background: url("../../assets/img/downArrows.png") no-repeat 1.7rem center /
    0.2rem 25%;
}
.yipin_se select option {
  line-height: 0.6rem !important;
}

.yipin_se .search {
  position: relative;
  margin-left: 0.2rem;
  width: 100%;
  top: 0;
  left: 0;
}
.search input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.local {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.local .content_list {
  width: 3.45rem;
}

.local .content_list img {
  width: 3.45rem;
  height: 3.45rem;
}

.local .content_list .con-title {
  padding: 0.2rem 0;
}

.local .content_list .con-title h3 {
  font-size: 0.28rem;
  font-weight: 600;
}

.local .content_list .address {
  padding: 0.1rem 0;
  font-size: 0.26rem;
  color: #ef6213;
}

.local .more {
  margin: 0.8rem 0;
  color: #555;
  font-size: 0.28rem;
}
#localshop .dialog {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
}

#localshop .dialog span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

#localshop .dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
}

#localshop .dialog .haufei {
  padding-top: 0.4rem;
  font-size: 0.28rem;
}

#localshop .dialog .haufei a {
  color: #ef6213;
}

#localshop .dialog .number {
  margin: 0.2rem 0;
  display: flex;
  font-size: 0.26rem;
  align-items: center;
}
#localshop .dialog h5 {
  padding-bottom: 0.2rem;
  font-size: 0.24rem;
  font-weight: normal;
  color: #ef6213;
}
#localshop .dialog .number span {
  width: 30%;
  text-align: start;
}
#localshop .dialog .number input {
  width: 70%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
  background: #fff;
}

#localshop .dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin: 0 auto;
  /* margin: 0.4rem 0; */
  border: none;

  border-radius: 0.1rem;
}

/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 2rem;
  transition: all 0.2s;
}

#no-data > img {
  width: 40%;
  height: auto;
}
</style>
