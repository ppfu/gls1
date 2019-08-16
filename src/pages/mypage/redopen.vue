<template>
  <div id="redopen">
    <mt-header fixed title="分享拆红包">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="red_open">
        <p class="red_num">
          红包数量
          <span>{{redNum}}个</span>
        </p>
        <div class="red_packet">
          <img src="../../assets/img/redPacket.png" />
          <strong class="red_open_btn" @click="playGameFun">开</strong>
        </div>
      </div>
    </div>
    <x-dialog v-model="redShow" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="closeDialog"></span>
        <h4>红包</h4>
        <div class="dialog_cont">
          <span>{{redMoney}}</span>
        </div>
        <button @click="closeDialog">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog } from "vux";
import { Toast } from "mint-ui";
export default {
  components: {
    XDialog,
    Toast
  },
  data() {
    return {
      redNum: 8,
      redMoney: "", //红包
      redShow: false // 红包弹窗
    };
  },
  created() {},
  mounted() {
    this.getRedNumFun();
  },
  computed: {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    playGameFun() {
      let that = this;
      that
        .$http({
          url: "hong_baonew/lotteryActive",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.redShow = true;
            that.redMoney = res.data.data;
            that.getRedNumFun();
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
    getRedNumFun() {
      let that = this;
      that
        .$http({
          url: "hong_baonew/hongbaoPage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.redNum = res.data.data;
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
    closeDialog() {
      this.redShow = false;
    }
  }
};
</script>

<style scoped="scoped">
#redopen {
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
  z-index: 1000;
}
.red_open {
  position: relative;
  width: 100%;
  height: 100%;
}
.red_num {
  color: #333;
  font-size: 0.28rem;
  padding: 0.2rem 0 0 0.2rem;
}
.red_num > span {
  color: rgba(239, 98, 19, 1);
  margin-left: 0.2rem;
}
.red_packet {
  position: relative;
  width: 100%;
}
.red_packet > img {
  width: 100%;
  height: 100%;
}
.red_open_btn {
  position: absolute;
  top: 5.82rem;
  left: 0;
  right: 0.2rem;
  margin: auto;
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  line-height: 1rem;
  border: 0.08rem solid #fcd52b;
  text-align: center;
  font-weight: 900;
  background: #ffbe2d;
  color: white;
  font-size: 0.6rem;
}
.dialog {
  width: 90%;
  margin: 0 auto;
  height: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-bottom: 0.4rem;
}
.dialog .dialog_cont {
  width: 100%;
  height: 4rem;
  background: url("../../assets/img/moneyShow.png") no-repeat 0 0 / 100% 100%;
}
.dialog .dialog_cont span {
  display: inline-block;
  font-size: 0.5rem;
  margin-top: 1rem;
  color: #ef3435;
}
.dialog button {
  width: 50%;
  height: 0.6rem;
  background: #ef6213;
  color: #fff;
  margin-top: 0.2rem;
  border: none;
  font-size: 0.24rem;
  line-height: 0.6rem;
  border-radius: 0.1rem;
}
</style>
