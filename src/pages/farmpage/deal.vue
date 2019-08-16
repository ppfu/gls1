<template>
  <div id="deal">
    <mt-header fixed title="交易">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="deal_content">
        <div class="deal_title">
          <div class="deal_area">
            <span>当前交易区</span>
            <select class="selectpicker" v-model="area_id" @change="selectChange($event)">
              <option
                v-for="areaitem in area"
                :key="areaitem.id"
                :value="areaitem.id"
              >{{areaitem.name}}</option>
            </select>
          </div>
          <p @click="gotoRanking">本期排名<br /><span v-show="ranking_time != ''">第{{ranking_time}}期</span></p>
        </div>
        <div class="mili">
          <tab
            :line-width="2"
            bar-active-color="#ef6213"
            active-color="#ef6213"
            :scroll-threshold="5"
          >
            <tab-item @on-item-click="setDealIndex(0)" :selected="dealindex==0">受让米粒</tab-item>
            <tab-item @on-item-click="setDealIndex(1)" id="tabtow" :selected="dealindex==1">出让米粒</tab-item>
            <tab-item @on-item-click="setDealIndex(2)" :selected="dealindex==2">加工谷粒</tab-item>
          </tab>
          <div v-if="dealindex==0" class="tab-swiper vux-center">
            <div class="mili_con">
              <div class="mili_left">
                <div class="mili_input">
                  <span>受让单价：</span>
                  <input type="text" v-model="price" placeholder="请输入受让单价" />
                </div>
                <div class="mili_input">
                  <span>受让数量：</span>
                  <input type="text" v-model="number" placeholder="请输入受让数量" />
                  <!-- <span>最多可受让{{buy_mili_max}}</span> -->
                </div>
                <div class="mili_input">
                  <span>交易密码：</span>
                  <input type="password" v-model="payment_password" placeholder="请输入交易密码" />
                </div>
                <div class="mili_input"></div>
                <button @click="purchase">受让</button>
              </div>
              <div class="mili_right">
                <ul class="maichu">
                  <li v-for="sellMitem in sell_list" :key="sellMitem.id">
                    <span>{{sellMitem.name}}</span>
                    <span>{{sellMitem.price}}</span>
                    <span>{{sellMitem.number}}</span>
                  </li>
                </ul>
                <ul class="mairu">
                  <li v-for="buyMitem in buy_list" :key="buyMitem.id">
                    <span>{{buyMitem.name}}</span>
                    <span>{{buyMitem.price}}</span>
                    <span>{{buyMitem.number}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="dealindex==1" class="tab-swiper vux-center">
            <div class="mili_con">
              <div class="mili_left">
                <div class="mili_input">
                  <span>出让单价：</span>
                  <input type="text" v-model="price" placeholder="请输入出让单价" />
                </div>
                <div class="mili_input">
                  <span>出让数量：</span>
                  <input type="text" v-model="number" placeholder="请输入出让数量" />
                  <!-- <span>最多可出让{{sell_mili_max}}</span> -->
                </div>
                <div class="mili_input">
                  <span>交易密码：</span>
                  <input type="password" v-model="payment_password" placeholder="请输入交易密码" />
                </div>
                <div class="mili_input">
                  <!-- <span>交易费：{{sell_mili_rate}}</span> -->
                </div>
                <button @click="purchase" class="churang">出让</button>
              </div>
              <div class="mili_right">
                <ul class="maichu">
                  <li v-for="sellMitem in sell_list" :key="sellMitem.id">
                    <span>{{sellMitem.name}}</span>
                    <span>{{sellMitem.price}}</span>
                    <span>{{sellMitem.number}}</span>
                  </li>
                </ul>
                <ul class="mairu">
                  <li v-for="buyMitem in buy_list" :key="buyMitem.id">
                    <span>{{buyMitem.name}}</span>
                    <span>{{buyMitem.price}}</span>
                    <span>{{buyMitem.number}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 出让谷粒 -->
          <div v-if="dealindex==2" class="tab-swiper vux-center">
            <div class="mili_con">
              <div class="mili_left">
                <div class="mili_input">
                  <span>加工单价：</span>
                  <input type="text" readonly v-model="guli_price" placeholder="请输入出让单价" />
                </div>
                <div class="mili_input">
                  <span>加工数量：</span>
                  <input type="text" v-model="number" placeholder="请输入加工数量" />
                  <!-- <span>最多可出让{{max}}</span> -->
                </div>
                <div class="mili_input">
                  <span>交易密码：</span>
                  <input type="password" v-model="payment_password" placeholder="请输入交易密码" />
                </div>
                <div class="mili_input">
                  <!-- <span>加工费：{{rate}}</span> -->
                </div>
                <button @click="purchase" class="churang">加工</button>
              </div>
              <div class="mili_right">
                <ul class="maichu">
                  <li v-for="sellitem in sell_list" :key="sellitem.id">
                    <span>{{sellitem.name}}</span>
                    <span>{{sellitem.price}}</span>
                    <span>{{sellitem.number}}</span>
                  </li>
                </ul>
                <ul class="mairu">
                  <li v-for="buyitem in buy_list" :key="buyitem.id">
                    <span>{{buyitem.name}}</span>
                    <span>{{buyitem.price}}</span>
                    <span>{{buyitem.number}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 	成交与挂单 -->
      <div class="mineorder">
        <tab
          :line-width="2"
          bar-active-color="#ef6213"
          active-color="#ef6213"
          :scroll-threshold="5"
        >
          <tab-item selected @on-item-click="setOrderIndex(0)">我的成交</tab-item>
          <tab-item @on-item-click="setOrderIndex(1)" id="tabtow">我的挂单</tab-item>
        </tab>
        <!-- 我的成交 -->
        <div v-if="mineindex==0" class="tab-swiper vux-center">
          <div class="order">
            <div>
              <table style="border-collapse:collapse;">
                <tr class="or_title">
                  <th>成交时间</th>
                  <th>类型</th>
                  <th>成交价格</th>
                  <th>成交数量</th>
                  <th>手续费</th>
                  <th>成交金额</th>
                </tr>
                <tr v-for="tradeitem in trade_list" :key="tradeitem.id" class="or_td">
                  <td>{{tradeitem.time}}</td>
                  <td>{{tradeitem.type}}</td>
                  <td>{{tradeitem.price}}</td>
                  <td>{{tradeitem.number}}</td>
                  <td>{{tradeitem.fee}}</td>
                  <td>{{tradeitem.total}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <!-- 我的挂单 -->
        <div v-if="mineindex==1" class="tab-swiper vux-center">
          <div class="order">
            <div>
              <table style="border-collapse:collapse;">
                <tr class="or_title">
                  <th>委托时间</th>
                  <th>类型</th>
                  <th>委托价格</th>
                  <th>委托数量</th>
                  <th>操作</th>
                </tr>
                <tr v-for="entryitem in trade_list" :key="entryitem.id" class="or_td">
                  <td>{{entryitem.time}}</td>
                  <td>{{entryitem.type}}</td>
                  <td>{{entryitem.price}}</td>
                  <td>{{entryitem.number}}</td>
                  <td class="repeal" @click="repealOrder(entryitem.id)">撤销</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, LoadMore } from "vux";
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    Tab,
    TabItem,
    LoadMore,
    Toast,
    Indicator
  },
  data() {
    return {
      selected: this.$route.query.dealindex, //默认选中tab（出让谷粒）
      dealindex: this.$route.query.dealindex, //默认选中（出让谷粒内容）
      mineindex: 0,
      area: [], //首页区域列表
      area_id: "", //首页当前区域id
      ranking_time: "", //当前第几期
      buy_list: [], //首页右侧买单列表
      max: "", //首页最大交易数量
      rate: "", //首页手续费
      sell_list: [], //首页右侧卖单列表
      trade_list: [], //首页下部我的成交
      buyMiList: [], // 获取米粒买单
      sellMiList: [], // 获取米粒卖单
      buy_mili_max: "", //受让米粒最大交易数量
      sell_guli_max: "", //出让谷粒最大交易数量
      sell_guli_rate: "", //出让谷粒加工费
      sell_mili_max: "", //出让米粒最大交易数量
      sell_mili_rate: "", //出让米粒加工费
      guli_price: "", // 谷粒加工价格
      number: "", //出让/受让(米粒/谷粒)数量
      price: "", //出让/受让(米粒/谷粒)价格
      payment_password: "", //支付密码
    };
  },
  mounted: function() {
    // window.setInterval(() => {
    // 	setTimeout(
    // 	this.getBargain(), //获取成交记录
    // 	this.getOrders(), //右侧 (挂单)
    // 	this.getDealNum(), //获取区域交易数
    // 	)
    // },50000);
    let that = this;
    that.getDealIndex(); //首页数据
    // that.getBargain(); //获取成交记录
    // that.getOrders(); //右侧 (挂单)
    // that.getDealNum(); //获取区域交易数
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoRanking() {
      let that = this;
      that.$router.push({
        path: "/dealranking",
        query: {
          areaid: that.area_id,
          area: that.area
        }
      });
    },
    // 切换受让，米粒  出让米粒 出让谷粒
    setDealIndex(index) {
      // console.log(index);
      let that = this;
      if (index != that.dealindex) {
        that.dealindex = index;
        that.getOrders();
        that.getBargain();
      }
    },
    //切换我的成交 与 我的挂单
    setOrderIndex(index) {
      // console.log(index);
      let that = this;
      if (index != that.mineindex) {
        that.mineindex = index;
        that.getBargain();
      }
    },
    //选择区域
    selectChange(e) {
      let that = this;
      var selectIndex = Number(e.target.value);
      that.area_id = selectIndex;
      that.getOrders(); //选择区域获取 当前区域 挂单数据
      that.getDealNum(); //选择区域获取当前区域交易参数(最大交易数，手续费)
      that.getBargain(); //获取成交记录
    },
    // 获取首页（默认为出让谷粒）交易数据
    getDealIndex() {
      let that = this;
      that
        .$http({
          url: "Trade/homePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          // console.log(res)
          if (res.data.code == 0) {
            that.area = res.data.data.area; //区域列表
            that.area_id = res.data.data.area_id; //当前区域id
            that.buy_list = res.data.data.buy_list; //右侧买单列表
            that.max = res.data.data.max; //最大交易数量
            that.guli_price = res.data.data.guli_price; //手续费
            that.rate = res.data.data.rate; //手续费
            that.sell_list = res.data.data.sell_list; //右侧卖单列表
            that.trade_list = res.data.data.trade_list; //下部我的成交
            that.getDealNum();
          } else {
            Toast("获取信息失败");
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
    //获取 右侧 挂单记录
    getOrders() {
      let that = this;
      // type(1) => 谷粒  type(2) => 米粒
      var type = that.dealindex == 2 ? 1 : 2;
      that
        .$http({
          url: "Trade/tradeList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            area_id: that.area_id,
            assets_type: type
          }
        })
        .then(function(res) {
          // console.log(res)
          if (res.data.code == 0) {
            that.buy_list = res.data.data.buy_list;
            that.sell_list = res.data.data.sell_list;
          } else {
            Toast("获取信息失败");
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
    //获取区域交易参数(最大交易数，手续费)
    getDealNum() {
      let that = this;
      that
        .$http({
          url: "Trade/tradeConfig",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            area_id: that.area_id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.buy_mili_max = res.data.data.buy_mili_max; //受让米粒最大交易数量
            that.sell_guli_max = res.data.data.sell_guli_max; //出让谷粒最大交易数量
            that.sell_guli_rate = res.data.data.sell_guli_rate; //出让谷粒加工费
            that.sell_mili_max = res.data.data.sell_mili_max; //出让米粒最大交易数量
            that.sell_mili_rate = res.data.data.sell_mili_rate; //出让米粒加工费
            that.max = that.sell_guli_max; //首页中默认数据等于选中区域数据
            that.rate = that.sell_guli_rate; //首页中默认数据等于选中区域数据
            that.ranking_time = res.data.data.ranking_time; // 第几期
          } else {
            Toast("获取信息失败");
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
    //获取我的成交 (米粒)
    getBargain() {
      let that = this;
      //typeo(1) => 我的订单 type(2) =>我的挂单
      //type(2) => 米粒  type(1) => 谷粒
      var typeo = that.mineindex == 1 ? 2 : 1;
      var type = that.dealindex == 2 ? 1 : 2;
      that
        .$http({
          url: "Trade/orderList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            area_id: that.area_id,
            assets_type: type, // 米粒/谷粒
            type: typeo //  订单/挂单
          }
        })
        .then(function(res) {
          // console.log(res)
          if (res.data.code == 0) {
            that.trade_list = res.data.data;
          } else {
            Toast("获取信息失败");
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
    //撤销挂单
    repealOrder(id) {
      let that = this;
      that
        .$http({
          url: "Trade/cancelTrade",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast(msg);
            that.getOrders();
            that.getBargain();
            that.getDealNum();
          } else {
            Toast(msg);
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
    //受让米粒 ，出让米粒/谷粒
    purchase() {
      let that = this;
      // type (2)=> 受让 type(1)出让
      var type = that.dealindex == 0 ? 2 : 1;
      //typea(2) => 米粒  typea(1) => 谷粒
      var typea = that.dealindex == 2 ? 1 : 2;
      // if (that.dealindex != 2) {
        
      // }
      if (that.dealindex != 2 && !that.price) {
        Toast('请输入交易单价');
        return;
      }
      if (!that.number || that.number == null) {
        Toast('请输入交易数量');
      } else if (!that.payment_password || that.payment_password == null) {
        Toast('请输入交易密码');
      } else {
        that
          .$http({
            url: "Trade/tradeActive",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              type: type,
              area_id: that.area_id,
              number: that.number,
              price: that.dealindex == 2 ? that.guli_price : that.price,
              payment_password: that.payment_password,
              assets_type: typea
            }
          })
          .then(function(res) {
            var msg = res.data.msg;
            if (res.data.code == 0) {
              Toast("交易成功");
              that.getOrders();
              that.getBargain();
              that.getDealNum();
              that.number = "";
              that.price = "";
              that.payment_password = "";
            } else {
              Toast(msg);
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
#deal {
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

.deal_content {
  width: 100%;
  padding: 0 0.2rem;
}

.deal_title {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
  font-size: 0.28rem;
  align-items: center;
}

.deal_title .deal_area {
  color: #555;
}

.deal_title .deal_area select {
  height: 0.56rem;
  border: 1px solid #c8c8c8;
  border-radius: 0.1rem;
  color: #555;
  margin-left: 0.1rem;
}

.deal_title p {
  color: #ef6213;
  text-align: center;
  font-size: .24rem;
}
.deal_title p span {
  color: #ef6213;
  font-size: .24rem;
}

.mili_con {
  display: flex;
  justify-content: space-between;
  padding-top: 0.2rem;
}

.mili_con .mili_left {
  width: 60%;
}

.mili_con .mili_left .mili_input {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.2rem;
}

.mili_con .mili_left .mili_input span {
  padding: 0.1rem 0;
  font-size: 0.28rem;
  color: #333;
}

.mili_con .mili_left .mili_input input {
  height: 0.66rem;
  padding-left: 0.2rem;
}

.mili_con .mili_left button {
  width: 100%;
  height: 0.66rem;
  border: none;
  background: #e8494e;
  color: #fff;
}

.mili_con .mili_left button.churang {
  background: #259b24;
}

.mili_con .mili_right {
  width: 35%;
}

.mili_right .maichu {
  border-bottom: 1px solid #c8c8c8;
  padding-bottom: 0.2rem;
}

.mili_right .maichu li,
.mili_right .mairu li {
  padding: 0.13rem 0;
  font-size: 0.26rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.mili_right .mairu {
  padding-top: 0.2rem;
}

.mili_right .maichu li span,
.mili_right .mairu li span {
  display: inline-block;
  color: #76c076;
  width: 33%;
}

.mili_right .mairu li span {
  color: #e8494e;
}
.mili_right .maichu li span:nth-child(2) {
  text-align: center;
}

.mili_right .mairu li span:nth-child(2) {
  text-align: center;
}
.mili_right .maichu li span:nth-child(3) {
  color: #888;
  text-align: right;
}

.mili_right .mairu li span:nth-child(3) {
  color: #888;
  text-align: right;
}

.order {
  display: flex;
  justify-content: flex-start;
  white-space: nowrap;
  overflow-x: auto;
  margin-top: 0.2rem;
}

.order > div {
  width: 200%;
}

.order table {
  width: 100%;
  text-align: center;
}

.order .or_title {
  width: 100%;
  border-bottom: 1px solid #c8c8c8;
}

.order .or_title th {
  margin: 0;
  border: none;
  font-size: 0.28rem;
  font-weight: normal;
  font-size: 0.26rem;
  padding: 0.16rem 0.34rem;
}

.order tr td {
  font-size: 0.25rem;
  padding: 0.14rem 0.2rem;
}

.order .repeal {
  color: #e8494e;
}
</style>
