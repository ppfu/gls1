<template>
  <div id="cultivators">
    <mt-header fixed title="开垦机">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="cult_con">
        <div v-for="item in data" :key="item.id" class="cult_list">
          <div class="cult_img">
            <img :src="item.img" />
          </div>
          <div class="cult_info">
            <div class="info_left">
              <span>{{item.name}}</span>
              <span>{{item.price}} 谷分</span>
            </div>
            <!-- 购买 -->
            <button
              class="buy_btn"
              id="buy_btn"
              @click="showDialog(item.id,item.price,item.name)"
            >购买</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 购买开垦机 -->
    <x-dialog v-model="lang_dlg" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>购买开垦机</h4>
        <div class="ktype">
          <span>类型</span>
          <span>{{name}}</span>
        </div>
        <div class="ktype">
          <span>价格</span>
          <span>{{price * num}} 谷分</span>
        </div>
        <div class="ktype">
          <span>数量</span>
          <van-stepper v-model="num" :min="1" input-width="1rem" button-size="0.5rem" />
        </div>
        <button @click="Buycultivator">确定</button>
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
      lang_dlg: false, //购买开垦机弹窗
      data: [], //获取开垦机数据
      activeId: "", //点击当开垦机id
      price: "", //开垦机价格
      name: "", //开垦机类型
      num: 1,
    };
  },
  created: function() {
    this.getkaiken();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //弹出确认弹窗
    showDialog(id, price, name) {
      var that = this;
      that.activeId = id;
      that.price = price;
      that.name = name;
      that.lang_dlg = true;
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
    },
    //获取开垦机
    getkaiken() {
      let that = this;
      Indicator.open({
        text: "数据加载中..."
      });
      that
        .$http({
          url: "Farm/machineList",
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
    //购买开垦机
    Buycultivator() {
      let that = this;
      that
        .$http({
          url: "Farm/machineBuy",
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
            Toast(res.data.msg);
            that.lang_dlg = false;
            that.$router.push({
              path: "myfarm",
              query: {
                numType: 0
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
#cultivators {
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
  position: relative;
  background: #ef6213;
}

.cult_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.5rem;
}

.cult_con .cult_list {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.cult_con .cult_list .cult_img {
  width: 22%;
  background: #f7f7f7;
  text-align: center;
}

.cult_con .cult_list .cult_img img {
  width: 88%;
}

.cult_con .cult_list .cult_info {
  flex: 1;
  display: flex;
  margin-left: 0.3rem;
  justify-content: space-between;
  align-items: center;
}

.cult_con .cult_list .cult_info .info_left {
  display: flex;
  flex-direction: column;
}

.cult_con .cult_list .cult_info .info_left span {
  padding: 0.1rem 0;
  font-size: 0.3rem;
}

.cult_con .cult_list .cult_info .info_left span:nth-child(2) {
  font-size: 0.24rem;
  color: #f2544b;
  font-weight: bold;
}

.cult_con .cult_list .cult_info button.buy_btn {
  width: 1.2rem;
  height: 0.54rem;
  background: #259b24;
  border: none;
  border-radius: 0.1rem;
  color: #fff;
}
.cult_con .cult_list .cult_btn {
  display: none;
}
.cult_con .cult_list .cult_btn button {
  display: block;
  margin: 4px 0;
  height: 0.5rem;
  width: 1.2rem;
  border: none;
  color: #fff;
  font-size: 0.26rem;
  border-radius: 0.1rem;
}
.cult_con .cult_list .cult_btn button:nth-child(1) {
  background: #259b24;
}
.cult_con .cult_list .cult_btn button:nth-child(2) {
  background: #ef6213;
}
.dialog {
  width: 80%;
  margin: 0 auto;
  padding: 0.2rem 0;
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
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  padding: 0.1rem 0;
  font-size: 0.28rem;
}

.dialog .ktype span:nth-child(1) {
  padding: 0 0.5rem;
}

.dialog .haufei a {
  color: #ef6213;
}

.dialog .number {
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.26rem;
  align-items: center;
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
