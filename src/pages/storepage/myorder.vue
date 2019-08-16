<template>
  <div id="myorder">
    <mt-header fixed title="我的订单">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab
        class="tab"
        :line-width="2"
        bar-active-color="#ef6213"
        active-color="#ef6213"
        :scroll-threshold="6"
        v-model="orderIndex"
      >
        <tab-item @click.native="navTap(0)">全部</tab-item>
        <tab-item @click.native="navTap(1)">待付款</tab-item>
        <tab-item @click.native="navTap(2)">待发货</tab-item>
        <tab-item @click.native="navTap(3)">待收货</tab-item>
        <tab-item @click.native="navTap(4)">已成功</tab-item>
        <tab-item @click.native="navTap(5)">已取消</tab-item>
      </tab>
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
            <div v-show="orderIndex==0" class="fruit">
              <div class="fruit_list" v-for="(orderitem ,index) in orderList" :key="index">
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                      <span v-show="orderitem.status==1" @click="cancelOrder(orderitem.id)">取消订单</span>
                      <span v-show="orderitem.status==3" @click="gotoAfter(orderitem.id)">申请售后</span>
                      <span v-show="orderitem.evaluate_status ==0" @click="gotoEval(orderitem.id)">去评价</span>
                      <span v-show="orderitem.evaluate_status ==1">已评价</span>
                      <span v-show="orderitem.status== 0">已取消</span>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                      <span
                        class="btn"
                        v-show="orderitem.status== 1"
                        @click="showDialog(orderitem.id)"
                      >立即付款</span>
                      <span
                        class="btn"
                        v-show="orderitem.status== 2"
                        @click="RemindDelivery(orderitem.id)"
                      >提醒发货</span>
                      <span
                        class="btn"
                        v-show="orderitem.status== 3"
                        @click="Receipt(orderitem.id)"
                      >确认收货</span>
                      <span class="btn" v-show="orderitem.status== 4">已完成</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="orderIndex==1" class="fruit">
              <div class="fruit_list" v-for="(orderitem ,index) in orderList" :key="index">
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                      <span @click="cancelOrder(orderitem.id)">取消订单</span>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                      <span class="btn" @click="showDialog(orderitem.id)">立即付款</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="orderIndex==2" class="fruit">
              <div class="fruit_list" v-for="(orderitem ,index) in orderList" :key="index">
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                      <span class="btn" @click="RemindDelivery(orderitem.id)">提醒发货</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="orderIndex==3" class="fruit">
              <div class="fruit_list" v-for="(orderitem ,index) in orderList" :key="index">
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                      <span v-show="orderitem.refund_status== 0" @click="gotoAfter(orderitem.id)">申请售后</span>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                      <span class="btn" @click="Receipt(orderitem.id)">确认收货</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="orderIndex==4" class="fruit">
              <div class="fruit_list" v-for="(orderitem ,index) in orderList" :key="index">
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                      <span v-show="orderitem.evaluate_status ==0" @click="gotoEval(orderitem.id)">去评价</span>
                      <span v-show="orderitem.evaluate_status ==1">已评价</span>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="orderIndex==5" class="fruit">
              <div
                class="fruit_list"
                v-show="orderitem.status==0"
                v-for="(orderitem ,index) in orderList"
                :key="index"
              >
                <div class="fruit_tit">
                  <span>订单号：{{orderitem.order}}</span>
                  <span>{{orderitem.time}}</span>
                </div>
                <div class="fruit_content">
                  <div class="fruit_img" @click="gotoOrderDetail(orderitem.id)">
                    <img :src="orderitem.img" />
                  </div>
                  <div class="fruit_con">
                    <div class="fruit_title">
                      <h4>{{orderitem.name}}</h4>
                      <span v-show="orderitem.status==0">已取消</span>
                    </div>
                    <h5>{{orderitem.price}}元红包+{{orderitem.integral}}谷分</h5>
                    <div class="qixian">
                      <span>数量: {{orderitem.number}}</span>
                      <span v-show="orderitem.specs != ''">规格: {{orderitem.specs}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
    <!-- 付款 -->
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>确认付款</h4>
        <span class="haufei">请在下方输入交易密码</span>
        <div class="number">
          <p>交易密码</p>
          <input type="password" v-model="payment_password" name placeholder="请输入交易密码" />
        </div>
        <button @click="SubmitPayment">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { Tab, TabItem, XDialog } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    Indicator,
    Toast,
    XDialog
  },
  data() {
    return {
      isMine: this.$route.query.isMine, // 从mine页面进来
      pageindex: 1, // 第一页
      orderIndex: 0,
      orderList: [], //我的订单列表
      orderListTotal: 0, // 订单总数量
      lang_dlg: false, //弹窗隐藏
      payment_password: "", //支付密码
      current_id: "", //当前订单id
      status: "", //订单状态
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  activated() {
    this.$nextTick(() => {
      this.orderIndex = 0;
      this.pageindex = 1;
      this.lif = true;
      this.nif = false;
      this.loading = false;
      this.getMyorder(1);
    });
  },
  mounted() {
    let that = this;
    sessionStorage.setItem("goBackMine", this.isMine);
    that.getMyorder();
  },
  methods: {
    back() {
      if (this.isMine == 1) {
        this.$router.go(-1); //返回上一层
      } else {
        this.$router.go(-2); //返回上一层
      }
    },
    //去申请退货
    gotoAfter(id) {
      this.$router.push({
        path: "/applyAfterSale",
        query: {
          id: id //订单id
        }
      });
    },
    //订单详情
    gotoOrderDetail(id) {
      this.$router.push({
        path: "/orderDetail",
        query: {
          id: id //订单id
        }
      });
    },
    //去评价
    gotoEval(id) {
      this.$router.push({
        path: "/evaluate",
        query: {
          id: id //订单id
        }
      });
    },
    //选择相应的tab，初始化数据
    navTap(i) {
      let that = this;
      that.orderIndex = i;
      that.name = name;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.orderList = [];
      that.getMyorder(0);
    },
    // 下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.orderList = [];
      that.orderListTotal = 0;
      that.getMyorder(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getMyorder(1);
    },

    //获取我的订单
    getMyorder(type) {
      let that = this;
      let orderIndex = that.orderIndex;
      that.status =
        orderIndex == 0 ? "" : orderIndex == 1 ? 1 : orderIndex == 2 ? 2
          : orderIndex == 3
          ? 3
          : orderIndex == 4
          ? 4
          : 0;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "goods_order/index",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            status: that.status,
            p: that.pageindex
          }
        })
        .then((res)=> {
          Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.orderList = res.data.data.list;
                that.orderListTotal = res.data.data.count;
                if (that.orderList.length >= that.orderListTotal) {
                  //全部数据已加载
                  that.finished = true;
                }
              } else {
                that.finished = true;
              }
              that.updateLoading = false;
            } else {
              that.moreloading = false;
              if (res.data.data.list != "") {
                that.orderList = that.orderList.concat(res.data.data.list);
                that.orderListTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.orderList.length >= that.orderListTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
          } else {
            //失败
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
    //付款
    SubmitPayment() {
      let that = this;
      Indicator.open({
        text: "支付中..."
      });
      if (that.payment_password == "") {
        Toast("请输入交易密码");
      } else {
        that
          .$http({
            url: "goods_order/paymentOrder",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              id: that.current_id,
              payment_password: that.payment_password
            }
          })
          .then(function(res) {
            Indicator.close();
            if (res.data.code == 0) {
              Toast(res.data.msg);
              that.payment_password = "";
              that.closeDialog();
              that.getMyorder();
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
      }
    },
    //提醒发货
    RemindDelivery(id) {
      let that = this;
      that
        .$http({
          url: "goods_order/remindShipment",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            Toast("已提醒发货");
            that.getMyorder();
          } else {
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
    //确认收货
    Receipt(id) {
      let that = this;
      that
        .$http({
          url: "goods_order/receivingGoods",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            Toast("已确认收货");
          } else {
            Toast(res.data.msg);
            that.getMyorder();
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
    //取消订单
    cancelOrder(id) {
      let that = this;
      that
        .$http({
          url: "goods_order/cancelOrder",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            Toast("已取消订单");
            that.getMyorder();
          } else {
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
    //弹出确认弹窗
    showDialog: function(id) {
      var that = this;
      that.current_id = id;
      that.lang_dlg = true;
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
    }
  }
};
</script>

<style scoped="scoped">
#myorder {
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
.scroll_div {
  width: 100%;
}
.mint-header {
  background: #ef6213;
}

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.fruit {
  width: 100%;
  padding: 0 0.2rem;
}

.fruit .fruit_tit {
  padding: 0.2rem 0;
  font-size: 0.26rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9e9;
}
.fruit_content {
  display: flex;
  height: 1.4rem;
  align-items: center;
  margin-top: 0.2rem;
}
.fruit_list .fruit_img {
  height: 100%;
  width: 26%;
}
.fruit_list .fruit_img img {
  width: 100%;
  height: 100%;
}
.fruit_list .fruit_con {
  margin-left: 0.2rem;
  flex: 1;
}
.fruit_list .fruit_con .fruit_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fruit_list .fruit_con .fruit_title h4 {
  font-size: 0.26rem;
  color: #333;
}
.fruit_list .fruit_con .fruit_title span {
  width: 1.4rem;
  height: 0.5rem;
  text-align: center;
  line-height: 0.5rem;
  border: 1px solid #e8e8e8;
  font-size: 0.24rem;
  border-radius: 0.1rem;
}
.fruit_list .fruit_con h5 {
  font-weight: normal;
  font-size: 0.22rem;
  color: #ef6213;
}
.fruit_list .fruit_con .qixian {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.fruit_list .fruit_con .qixian span {
  font-size: 0.26rem;
  color: #666;
}
.fruit_list .fruit_con .qixian .btn {
  width: 1.4rem;
  height: 0.5rem;
  text-align: center;
  line-height: 0.5rem;
  background: #ef6213;
  font-size: 0.22rem;
  border-radius: 0.1rem;
  color: #fff;
}
.dialog {
  width: 90%;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 0.2rem;
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

.dialog .haufei {
  padding-top: 0.4rem;
  font-size: 0.28rem;
}
.dialog .number {
  width: 90%;
  margin: 0.3rem 0;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  font-size: 0.26rem;
}
.dialog .number p {
  width: 30%;
}
.dialog .number input {
  width: 70%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
  border-radius: 0.1rem;
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
