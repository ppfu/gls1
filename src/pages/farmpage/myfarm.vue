<template>
  <div id="myfarm">
    <mt-header fixed title="我的农场">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item :selected="selected == 0" @on-item-click="tabindex=0">开垦机</tab-item>
        <tab-item :selected="selected == 1" @on-item-click="tabindex=1" id="tabtow">土地</tab-item>
        <tab-item :selected="selected == 2" @on-item-click="tabindex=2">种子</tab-item>
        <tab-item :selected="selected == 3" @on-item-click="tabindex=3">肥料</tab-item>
      </tab>
      <!-- 开垦机 -->
      <div v-if="tabindex==0" class="tab-swiper vux-center">
        <div class="myfarm_con">
          <div v-for="kaitem in data" :key="kaitem.id" class="myfarm_list">
            <div class="myfarm_img">
              <img :src="kaitem.img" />
            </div>
            <div class="myfarm_info">
              <div class="info_list">
                <span>{{kaitem.name}}</span>
                <button @click="showDialogkai(kaitem.id)">去开垦</button>
              </div>
              <div class="info_list">
                <span class="gufen">{{kaitem.total}}</span>
                <button class="jiayou" @click="showDialoggu(kaitem.id,kaitem.name)">谷分加油</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 土地 -->
      <div v-if="tabindex==1" class="tab-swiper vux-center">
        <div class="land_con">
          <div class="land_list" v-for="landitem in landList" :key="landitem.id">
            <div class="land_img">
              <span>{{landitem.name}}</span>
              <img v-if="landitem.type==1" src="../../assets/img/td-huang.png" />
              <img v-else-if="landitem.type==2" src="../../assets/img/td-hei.png" />
              <img v-else-if="landitem.type==3" src="../../assets/img/td-jin.png" />
            </div>
            <span class="number">{{landitem.count}}</span>
          </div>
        </div>
      </div>
      <!-- 种植种子 -->
      <div v-if="tabindex==2" class="tab-swiper vux-center">
        <div class="land_con">
          <div class="land_list" v-for="seeditem in seedList" :key="seeditem.id">
            <div class="land_img">
              <span>{{seeditem.name}}</span>
              <img @click="gotoPlant(seeditem.id)" :src="seeditem.img" />
            </div>
            <span class="number">{{seeditem.number}}</span>
          </div>
        </div>
      </div>
      <!-- 化肥 -->
      <div v-if="tabindex==3" class="tab-swiper vux-center">
        <div class="land_con">
          <div class="land_list" v-for="feiitem in feiList" :key="feiitem.id">
            <div class="land_img">
              <span>{{feiitem.name}}</span>
              <img :src="feiitem.img" />
            </div>
            <span class="number">{{feiitem.number}}</span>
          </div>
        </div>
      </div>
    </div>
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialogkai"></span>
        <h4>开垦土地</h4>
        <p>确定要开垦土地吗？</p>
        <!-- <div class="number">
          <input id="checked" @click="check" type="checkbox" value="tudi" />
          <span>
            我同意
            <a @click="showDialogxie">《土地开垦协议》</a>
          </span>
        </div> -->
        <button id="accept" @click="reclamation">确定</button>
      </div>
    </x-dialog>
    <x-dialog v-model="lang_dlggu" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialoggu"></span>
        <h4>谷分加油</h4>
        <div class="gufen">
          <span>开垦机类型：</span>
          <span>{{name}}</span>
        </div>
        <div class="gufen">
          <span>加油金额：</span>
          <input type="text" v-model="total" />
          <span>谷分</span>
        </div>
        <button @click="oiling">确定</button>
      </div>
    </x-dialog>
    <x-dialog v-model="lang_dlgxie" hide-on-blur>
      <div class="dialogxie">
        <span class="iconfont icon-tabguanbi" @click="closeDialogxie"></span>
        <div v-html="agreement"></div>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Toast, Indicator } from "mint-ui";

import { Tab, TabItem, LoadMore, XDialog } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    LoadMore,
    Indicator,
    XDialog
  },
  data() {
    return {
      // disabled: true, //开垦土地没有勾选同意协议禁止点击
      selected: this.$route.query.numType || 0, //tab默认选中
      tabindex: this.$route.query.numType || 0, //tab下内容默认
      lang_dlg: false, //开垦弹窗
      lang_dlggu: false, // 谷分加油弹窗
      lang_dlgxie: false, //协议
      data: [], //开垦机数据
      landList: [], //土地数据
      seedList: [], //种子数据
      feiList: [], //化肥数据，
      agreement: "", //开垦协议
      activeId: "", //当前开垦机id
      name: "", //当前开垦机类型
      total: "" //谷分加油金额
    };
  },
  created: function() {
    this.getkaiken(); //开垦机数据
    this.getLand(); //土地数据
    this.getSeed(); //种子数据
    this.getfertilizerList(); //化肥数据
    this.getAgreement(); //开垦协议
  },
  mounted: function() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //弹出开垦弹窗
    showDialogkai: function(id) {
      var that = this;
      that.activeId = id;
      this.lang_dlg = true;
    },
    //关闭开垦弹窗
    closeDialogkai: function() {
      var that = this;
      this.lang_dlg = false;
    },
    //弹出谷分弹窗
    showDialoggu: function(id, name) {
      var that = this;
      that.activeId = id;
      that.name = name;
      this.lang_dlggu = true;
    },

    //关闭谷分弹窗
    closeDialoggu: function() {
      var that = this;
      this.lang_dlggu = false;
    },
    //弹出协议弹窗
    showDialogxie: function() {
      var that = this;
      this.lang_dlgxie = true;
    },
    //关闭协议弹窗
    closeDialogxie: function() {
      var that = this;
      this.lang_dlgxie = false;
    },
    //判断注册协议是否选择
    check() {
      if ($("#checked").is(":checked")) {
        $("#accept").prop("disabled", false);
        $("#accept").css("background", "#EF6213");
      } else {
        $("#accept").prop("disabled", true);
        $("#accept").css("background", "#c6c6c6");
      }
    },
    //去种植
    gotoPlant(id) {
      this.$router.push({
        path: "/tabs/farm",
        query: {
          id: window.localStorage.setItem("seed_id", id)
        }
      });
    },
    //获取开垦机
    getkaiken() {
      let that = this;
      that
        .$http({
          url: "my_farm/machineList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.data = res.data.data;
            if (res.data.data.length != 0) {
              function sortBy(field) { //数字类型的比较
                return function(a,b) {
                  return a[field] - b[field];
                }
              }
              that.data.sort(sortBy("type"));
            }
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
    //获取开垦协议
    getAgreement() {
      let that = this;
      that
        .$http({
          url: "my_farm/reclAgreement",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.agreement = res.data.data;
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
    //去开垦土地
    reclamation() {
      let that = this;
      that
        .$http({
          url: "my_farm/reclamation",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.activeId
          }
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast("开垦成功");
            that.lang_dlg = false;
            for (let i = 0; i < that.data.length; i++) {
              if (that.data[i].id == that.activeId) {
                that.$store.commit("areaTypeFun", that.data[i].type);
                that.$router.push({
                  path: "tabs/farm"
                });
              }
            }
            // that.getkaiken(); // 刷新开垦机
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
    //谷分加油
    oiling() {
      let that = this;
      let total = that.total;
      if (!total || total == null) {
        Toast("请输入谷分");
      } else {
        that
          .$http({
            url: "my_farm/oiling",
            method: "post",
            data: {
              token: localStorage.getItem("token"),
              id: that.activeId,
              total: total
            }
          })
          .then(function(res) {
            var msg = res.data.msg;
            if (res.data.code == 0) {
              Toast("加油成功");
              that.lang_dlggu = false;
              that.getkaiken(); // 刷新开垦机
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
    },
    //获取土地
    getLand() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "my_farm/landList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            that.landList = res.data.data;
            console.log(that.landList);
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
    //获取种子
    getSeed() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "my_farm/seedList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            that.seedList = res.data.data;
            console.log(that.seedList);
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

    //获取化肥
    getfertilizerList() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "my_farm/fertilizerList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            that.feiList = res.data.data;
            console.log(that.feiList);
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
    }
  }
};
</script>

<style scoped="scoped">
#myfarm {
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
.myfarm_con {
  width: 100%;
  padding: 0 0.2rem;
}
.myfarm_con .myfarm_list {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0.2rem 0;
}
.myfarm_con .myfarm_list .myfarm_img {
  width: 22%;
  background: #f7f7f7;
  text-align: center;
}
.myfarm_con .myfarm_list .myfarm_img img {
  width: 88%;
}
.myfarm_con .myfarm_list .myfarm_info {
  flex: 1;
  margin-left: 0.2rem;
}
.myfarm_con .myfarm_list .myfarm_info .info_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myfarm_con .myfarm_list .myfarm_info .info_list span {
  padding: 0.2rem 0;
  font-size: 0.29rem;
}
.myfarm_con .myfarm_list .myfarm_info .info_list span.gufen {
  font-size: 0.24rem;
  color: #f2544b;
  font-weight: bold;
}
.myfarm_con .myfarm_list .myfarm_info button {
  width: 1.5rem;
  height: 0.5rem;
  background: #259b24;
  border: none;
  border-radius: 0.1rem;
  color: #fff;
}
.myfarm_con .myfarm_list .myfarm_info button.jiayou {
  background: #ff9800;
}
.dialog,
.dialogxie {
  width: 80%;
  margin: 0 auto;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.2rem;
}
.dialogxie {
  height: 7rem;
}
.dialog span.iconfont,
.dialogxie span.iconfont {
  position: absolute;
  top: .2rem;
  right: .2rem;
}
.dialogxie > div {
  overflow-y: auto;
  margin-top: 0.4rem;
  text-align: start;
  text-indent: 0.6rem;
}
.dialog h4 {
  font-size: 0.3rem;
  font-weight: normal;
  margin-bottom: 0.4rem;
}
.dialog span {
  font-size: 0.3rem;
}
.dialog p {
  font-size: 0.3rem;
  padding: 0.6rem 0;
}
.dialog .number {
  margin-top: 0.2rem;
  display: flex;
  font-size: 0.26rem;
  align-items: center;
}

.dialog .number input {
  width: 0.32rem;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  margin-right: 0.1rem;
}
.dialog .number span {
  font-size: 0.26rem;
}
.dialog .number a {
  color: #ef6213;
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
.dialog .gufen {
  display: flex;
  margin: 0.12rem 0;
  align-items: center;
}
.dialog .gufen span:nth-child(1) {
  margin-right: 0.3rem;
}
.dialog .gufen input {
  width: 1.1rem;
  height: 0.5rem;
  margin-left: 0.26rem;
  margin-right: 3px;
  border: 1px solid #d8d8d8;
}
/* 	土地 */
.land_con {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
}
.land_list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  margin: 0.16rem 0;
}
.land_list .land_img {
  height: 2.2rem;
  width: 100%;
  /* display: block; */
  background: url(../../assets/img/wd-bg.png) no-repeat center top;
  background-size: 110%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.land_list .land_img img {
  width: 0.44rem;
  height: 0.5rem;
}
.land_list .land_img span {
  font-size: 0.24rem;
  padding-right: 1px;
  color: #e5b13d;
}
.land_list .number {
  /* width: 0.5rem;
		height: 0.5rem;
		display: inline-block; */
  padding: 0.08rem 0.176rem;
  border-radius: 50%;
  background: #ff9459;
  color: #fff;
}
button.myf_btn {
  width: 3rem;
  height: 0.7rem;
  background: #c6c6c6;
  border: none;
  color: #fff;
  border-radius: 0.1rem;
}
</style>
