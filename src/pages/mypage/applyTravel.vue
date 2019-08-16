<template>
  <div id="travel">
    <mt-header fixed title="申请旅游">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="fruit">
        <div class="apply_con">
          <div class="fruit_list" v-for="(item,index) in tourismList" :key="index">
            <div class="fruit_img">
              <img :src="item.img" />
            </div>
            <div class="fruit_con">
              <div class="fruit_title">
                <h4>{{item.name}}</h4>
                <span class="apply_status" v-if="item.apply_status == 1">已申请</span>
                <span
                  v-if="item.status == 0 && item.apply_status == 0"
                  @click="showDialog(item.status,item.id,item.spend)"
                >申请</span>
                <span
                  v-if="item.status == 1 && item.apply_status == 0"
                  @click="applyTravel(item.status,item.id)"
                >申请</span>
              </div>
              <span class="tr_time">出行时间：{{item.trip_time}}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="no-data" v-if="tourismList.length == 0">
        <img src="../../assets/img/nodata.png" />
      </div>
      <div style="height:50px;"></div>
    </div>
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog_app">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>确认信息</h4>
        <p>抱歉！您还不符合免费旅游的条件</p>
        <h5>本旅游项目需要支付{{spend}}元红包，确定要参加本次旅游吗？</h5>
        <div class="number">
          <span>交易密码</span>
          <input type="password" v-model="payment_password" name placeholder="请输入交易密码" />
        </div>
        <button @click="applyTravel(status, id)">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { XInput, XDialog } from "vux";
export default {
  components: {
    XInput,
    XDialog,
    Indicator,
    Toast
  },
  data() {
    return {
      lang_dlg: false,
      index: 0,
      travelIndex: this.$route.query.travelIndex,
      tourismList: [], //申请旅游列表
      spend: "", //花费
      id: "", //旅游id
      payment_password: "", //交易密码
      status: "" //
    };
  },
  mounted: function() {
    let that = this;
    that.getTourismList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    showDialog: function(status, id, spend) {
      var that = this;
      that.spend = spend;
      that.id = id;
      that.status = status;
      that.lang_dlg = true;
    },
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
    },
    //获取申请旅游列表
    getTourismList() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Tourism/tourismList",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.tourismList = res.data.data; //列表
          } else {
            //失败
            // Toast(res.data.msg);
            Toast.loading({
              duration: 1500, // 持续展示 toast
              forbidClick: true, // 禁用背景点击
              loadingType: "spinner",
              message: res.data.msg
            });
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
    //申请旅游
    applyTravel(status, id) {
      let that = this;
      // that.$router.push({
      // 	path: '/travel',
      // 	query: {
      // 		travelIndex: 1
      // 	}
      // })
      var jsonData;
      console.log(status);
      if (status == 0) {
        //不满足免费条件
        if (!that.payment_password || that.payment_password == null) {
          Toast("请输入交易密码");
        } else {
          jsonData = {
            token: localStorage.getItem("token"),
            id: that.id,
            payment_password: that.payment_password
          };
          that.httpSubmit(jsonData);
        }
      } else if (status == 1) {
        //满足免费条件
        jsonData = {
          token: localStorage.getItem("token"),
          id: id
        };
        that.httpSubmit(jsonData);
      }
    },
    // 提交 请求
    httpSubmit(jsonData) {
      let that = this;
      Indicator.open({
        text: "提交中..."
      });
      that
        .$http({
          url: "Tourism/tourismAction",
          method: "post",
          data: jsonData
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            //成功回调
            Toast(res.data.msg);
            that.closeDialog();
            that.$router.push({
              path: "/travel",
              query: {
                travelIndex: 1
              }
            });
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(function(error) {});
    }
  }
};
</script>

<style scoped="scoped">
#travel {
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

#farmdetail .mint-tab-item-label {
  font-size: 0.3rem;
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

.fruit_list {
  display: flex;
  height: 1.4rem;
  margin-top: 0.2rem;
}

.fruit_list .fruit_img {
  width: 26%;
  height: 100%;
}

.fruit_list .fruit_img img {
  width: 100%;
  height: 100%;
}

.fruit_list .fruit_con {
  margin-left: 0.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fruit_list .fruit_con .tr_time {
  font-size: 0.26rem;
  color: #666;
}

.fruit_list .fruit_con .fruit_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fruit_list .fruit_con .fruit_title h4 {
  font-size: 0.3rem;
  color: #333;
  font-weight: normal;
}

.fruit_list .fruit_con .fruit_title span {
  width: 1rem;
  height: 0.5rem;
  text-align: center;
  border-radius: 0.1rem;
  line-height: 0.5rem;
  border: 1px solid #ef6213;
  font-size: 0.26rem;
  color: #ef6213;
}
.fruit_list .fruit_con .fruit_title span.apply_status {
  background: #fff;
}
.dialog_app {
  width: 90%;
  margin: 0 auto;
  padding: 0.2rem 0;
}

.dialog_app p {
  color: #ef6213;
  font-size: 0.26rem;
  padding-top: 0.2rem;
}

.dialog_app span.iconfont {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

.dialog_app h4 {
  font-size: 0.3rem;
  font-weight: normal;
}

.dialog_app h5 {
  font-weight: normal;
  margin-top: 0.2rem;
  text-align: left;
}

.dialog_app .number {
  margin: 0.2rem 0;
  width: 100%;
}

.dialog_app .number span {
  font-size: 0.28rem;
}

.dialog_app .number input {
  width: 76%;
  border: 1px solid #e8e8e8;
  height: 0.6rem;
  padding-left: 0.1rem;
}

.dialog_app button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.4rem;
  border: none;
  border-radius: 0.1rem;
}

/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 1rem;
  transition: all 0.2s;
}

#no-data > img {
  width: 40%;
  height: auto;
}
</style>
