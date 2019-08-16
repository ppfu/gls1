<template>
  <div id="management">
    <mt-header fixed title="农场管理">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="management_con">
        <tab
          class="management_tab"
          :line-width="2"
          bar-active-color="#ef6213"
          active-color="#ef6213"
          :scroll-threshold="6"
        >
          <tab-item selected @on-item-click="tabindex=0">开垦机</tab-item>
          <tab-item @on-item-click="tabindex=1" id="tabtow">土地</tab-item>
          <tab-item @on-item-click="tabindex=2">种子</tab-item>
          <tab-item @on-item-click="tabindex=3">施肥</tab-item>
          <tab-item @on-item-click="tabindex=4">浇水</tab-item>
          <tab-item @on-item-click="tabindex=5">收获</tab-item>
        </tab>
        <!-- 开垦机 -->
        <div v-if="tabindex==0" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>名称</th>
                <th>类型</th>
                <th>资产</th>
                <th>时间</th>
              </tr>
              <tr v-for="item in data" :key="item.id">
                <td>{{item.name}}</td>
                <td>{{item.type}}</td>
                <td>{{item.money}}</td>
                <td>{{item.time}}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 土地 -->
        <div v-if="tabindex==1" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>类型</th>
                <th>编号</th>
                <th>开垦时间</th>
              </tr>
              <tr v-for="itemland in dataland" :key="itemland.id">
                <td>{{itemland.name}}</td>
                <td>{{itemland.id}}</td>
                <td>{{itemland.time}}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 种子 -->
        <div v-if="tabindex==2" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>类型</th>
                <th>数量</th>
                <th>资金</th>
                <th>时间</th>
              </tr>
              <tr v-for="itemseed in dataSeed" :key="itemseed.id">
                <td>{{itemseed.name}}</td>
                <td>{{itemseed.number}}</td>
                <td>{{itemseed.price}}</td>
                <td>{{itemseed.time}}</td>
              </tr>
            </table>
          </div>
        </div>
        <!-- 肥料 -->
        <div v-if="tabindex==3" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>肥料</th>
                <th>类型</th>
                <th>用途</th>
                <th>备注</th>
                <th>时间</th>
              </tr>
              <tr v-for="itemfer in dataFer" :key="itemfer.id">
                <td>{{itemfer.name}}</td>
                <td>{{itemfer.type}}</td>
                <td>{{itemfer.use}}</td>
                <td>{{itemfer.remake}}</td>
                <td>{{itemfer.time}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div v-if="tabindex==4" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>类型</th>
                <th>备注</th>
                <th>浇水时间</th>
              </tr>
              <tr class="table_info" v-for="itemWater in dataWater" :key="itemWater.id">
                <td>{{itemWater.type}}</td>
                <td>{{itemWater.remake}}</td>
                <td>{{itemWater.time}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div v-if="tabindex==5" class="tab-swiper vux-center">
          <div class="management">
            <table style="border-collapse:collapse;">
              <tr class="trtitle">
                <th>作物</th>
                <th>数量</th>
                <th>备注</th>
                <th>收获时间</th>
              </tr>
              <tr v-for="itempick in datapick" :key="itempick.id">
                <td>{{itempick.name}}</td>
                <td>{{itempick.number}}</td>
                <td>{{itempick.remake}}</td>
                <td>{{itempick.time}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";
import { Tab, TabItem, LoadMore } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    LoadMore,
    Indicator
  },
  data() {
    return {
      selected: 0,
      tabindex: 0,
      data: [], //开垦机日志
      dataland: [], //土地
      dataSeed: [], //种子，
      dataFer: [], //施肥
      dataWater: [], //浇水
      datapick: [] //收获
    };
  },
  created: function() {
    this.getMachineLog(); //获取开垦机日志
    this.getLand(); //获取土地日志
    this.getSeedlog(); //获取种子日志
    this.getFertilizer(); //获取施肥数据日志
    this.getWatering(); //获取浇水日志
    this.getPickLog(); //获取收获日志
  },
  mounted: function() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取开垦机日志
    getMachineLog() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/machineLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            that.data = res.data.data;
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
    //获取土地
    getLand() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/landLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var msg = res.data.msg;
            that.dataland = res.data.data;
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
    //获取种子
    getSeedlog() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/seedLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var msg = res.data.msg;
            that.dataSeed = res.data.data;
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
    //获取施肥
    getFertilizer() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/fertilizerLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var msg = res.data.msg;
            that.dataFer = res.data.data;
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
    //获取浇水
    getWatering() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/wateringLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var msg = res.data.msg;
            that.dataWater = res.data.data;
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
    //获取收获
    getPickLog() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "farm_manage/pickLog",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            var msg = res.data.msg;
            that.datapick = res.data.data;
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
};
</script>

<style>
#management {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url(../../assets/img/fa_bg.jpg) no-repeat center bottom;
  background-size: 120%;
}

#management .con-wrapper {
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

.management_con {
  width: 100%;
  height: auto;
}
#management .vux-tab {
  background: rgba(255, 255, 255, 0.8);
}
#management .vux-tab .vux-tab-item {
  color: #333;
  font-size: 0.3rem;
}
#management .vux-tab-wrap {
  width: 100%;
  position: fixed;
  top: 0.8rem;
  z-index: 99999;
  left: 0;
}
.management {
  width: 96%;
  margin: 0 auto;
  white-space: nowrap;
  overflow-x: auto;
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.5);
}

.management table {
  width: 100%;
  text-align: center;
}
.management .trtitle {
  background: rgba(0, 0, 0, 0.5);
  color: #f1af88;
  width: 100%;
}
.management .trtitle th {
  width: 25%;
  margin: 0;
  border: none;
  font-size: 0.28rem;
  padding: 0.16rem 0.3rem;
}
.mint-header {
  position: relative;
  background: #ef6213;
}

.mint-header p {
  position: absolute;
  right: 1rem;
  top: 0.26rem;
  width: 0.44rem;
}

.management table td {
  color: #888;
  padding: 0.2rem 0.1rem;
  font-size: 0.26rem;
  color: #e5e5e5;
}
</style>
