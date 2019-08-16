<template>
  <div id="seed">
    <mt-header fixed title="种子">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="seed_con">
        <div v-for="item in data" :key="item.id" class="seed_list">
          <div class="seed_img" @click="gotoSeedDetail(item.id)">
            <img :src="item.img" />
          </div>
          <div class="seed_info">
            <div class="info_left">
              <span>{{item.name}}</span>
              <span>{{item.price}} 谷分</span>
            </div>
            <button @click="showDialog(item.id,item.price,item.name)">购买</button>
          </div>
        </div>
      </div>
    </div>
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>购买种子</h4>
        <div class="number">
          <span>类型:</span>
          <span>{{name}}</span>
        </div>
        <div class="number">
          <span>价格:</span>
          <span>{{price * num}} 谷分</span>
        </div>
        <div class="number">
          <span>数量:</span>
          <van-stepper v-model="num" :min="1" input-width="1rem" button-size="0.5rem" />
        </div>
        <button @click="BuySeed">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from "vux";
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    XDialog,
    Toast,
    Indicator
  },
  data() {
    return {
      lang_dlg: false, //购买种子弹窗
      data: [], //种子数据
      price: "", //种子价格
      activeId: "", //点击当前种子id
      name: "", //种子类型
      num: 1 // 数量
    };
  },
  created: function() {
    this.getSeed();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoSeedDetail(id) {
      this.$router.push({
        path: "/seedDetail",
        query: {
          id: id
        }
      });
    },
    //弹出确认弹窗
    showDialog: function(id, price, name) {
      var that = this;
      that.activeId = id;
      that.price = price;
      that.name = name;
      this.lang_dlg = true;
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      this.lang_dlg = false;
    },
    //获取种子
    getSeed() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "Farm/seedList",
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
    //购买种子
    BuySeed() {
      let that = this;

      that
        .$http({
          url: "Farm/seedBuy",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: that.activeId,
            number: that.num
          }
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            Toast(msg);
            that.lang_dlg = false;
            that.$router.push({
              path: "myfarm",
              query: {
                numType: 2
              }
            });
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

<style scoped="scoped">
#seed {
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
  position: relative;
  background: #ef6213;
}

.seed_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.5rem;
}
.seed_con .seed_list {
  display: flex;
  align-items: center;
  /* height: 1.4rem; */
  margin-bottom: 0.3rem;
}
.seed_con .seed_list .seed_img {
  width: 22%;
  height: 100%;
  background: #f7f7f7;
  text-align: center;
}
.seed_con .seed_list .seed_img img {
  width: 0.74rem;
  height: 0.86rem;
}
.seed_con .seed_list .seed_info {
  flex: 1;
  display: flex;
  margin-left: 0.3rem;
  justify-content: space-between;
  align-items: center;
}
.seed_con .seed_list .seed_info .info_left {
  display: flex;
  flex-direction: column;
}
.seed_con .seed_list .seed_info .info_left span {
  padding: 0.1rem 0;
  font-size: 0.3rem;
}
.seed_con .seed_list .seed_info .info_left span:nth-child(2) {
  font-size: 0.24rem;
  color: #f2544b;
  font-weight: bold;
}
.seed_con .seed_list .seed_info button {
  width: 1.2rem;
  height: 0.54rem;
  background: #259b24;
  border: none;
  border-radius: 0.1rem;
  color: #fff;
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
