<template>
  <div id="turntable">
    <mt-header fixed title="摇钱树">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <span slot="right" @click="gotoResult">结果</span>
    </mt-header>
    <div class="con-wrapper">
      <div class="lucky-wheel">
        <p class="game_money">已投: {{gameMoney}} 米粒</p>
        <img class="game_tree" :src="clickedPrize?imgActive:imgUnactive" />
        <div class="click_prize" @click="startGameFun">
          <span>点击摇大奖</span>
        </div>
        <div class="invite">
          <button
            type="button"
            v-clipboard:copy="inviteLink"
            v-clipboard:success="inviteFun"
            v-clipboard:error="onError"
          >邀请多人摇</button>
        </div>
      </div>
      <div class="toast" v-show="toast_control">
        <div class="toast-container">
          <img :src="toast_pictrue" class="toast-picture" />
          <div class="close" @click="close_toast()" v-show="index != 4"></div>
          <div class="toast-title">{{toast_title}}</div>
          <div class="toast-btn">
            <div class="toast-cancel" @click="close_toast" v-show="index != 4">关闭</div>
          </div>
        </div>
      </div>
      <div class="toast-mask" v-show="toast_control"></div>
    </div>
    <x-dialog v-model="confirmGame" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="close_dialog"></span>
        <h4>确认信息</h4>
        <span class="haufei">
          游戏需要
          <a>{{gameSpend}}米粒</a>, 确定要抽奖吗?
        </span>
        <button @click="rotate_handle()">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XNumber, XInput, XDialog } from "vux";
import { Toast, Indicator } from "mint-ui";
export default {
  components: {
    XNumber,
    XInput,
    XDialog,
    Toast,
    Indicator
  },
  data() {
    return {
      toast_control: false, //抽奖结果弹出框控制器
      click_flag: true, //是否可以摇奖
      index: 0,
      disabled: false,
      confirmGame: false, // 确认抽奖弹窗
      gameMoney: "", //已投金额
      gameSpend: "", // 游戏花费
      prize: "", //奖品
      inviteLink: "123456", // 邀请链接
      isMe: true,
      imgActive: require("../../assets/img/moneyTree1.gif"),
      imgUnactive: require("../../assets/img/moneyTree1.png"),
      clickedPrize: false,
    };
  },
  created() {
    // this.init_prize_list();
  },
  mounted() {
    this.turntableInfoFun(); //获取转盘信息

    // console.log(this.$route.query.id);
    // console.log(!this.$route.query.id);
    if (!this.$route.query.id) {
      // 判断是否是本人
      this.isMe = true;
    } else {
      this.isMe = false;
      this.friendsId = this.$route.query.id;
    }
  },
  computed: {
    toast_title() {
      return "恭喜您，获得" + " " + this.prize;
    },
    toast_pictrue() {
      return require("../../assets/img/congratulation.png");
    }
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoResult() {
      this.$router.push({
        path: "/turnresult",
        query: {
          result: 1
        }
      });
    },
    startGameFun() {
      // 弹出确认抽奖框
      if (this.clickedPrize == true) {
        return;
      }
      this.confirmGame = true;
    },
    rotate_handle() {
      //开始游戏
      let that = this;
      if (that.clickedPrize == true) {
        return;
      }
      that.confirmGame = false;
      if (that.isMe) {
        that.$http
          .post("Active/drawLottery", {
            token: localStorage.getItem("token")
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.clickedPrize = true;
              setTimeout(() => {
                that.toast_control = true;
                that.prize = res.data.data + "米粒";
                that.clickedPrize = false;
                that.turntableInfoFun(); //刷新已投金额
              }, 3000);
            } else if (res.data.code == -1) {
              Toast({
                message: res.data.msg,
                position: "center",
                duration: 3000
              });
            }
          });
      } else {
        that.$http
          .post("Active/invitationLottery", {
            token: localStorage.getItem("token"),
            id: that.friendsId
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.turntableInfoFun(); //刷新已投金额
              Toast({
                message: res.data.msg,
                position: "center",
                duration: 3000
              });
            } else if (res.data.code == -1) {
              Toast({
                message: res.data.msg,
                position: "center",
                duration: 3000
              });
            }
          });
      }
    },
    turntableInfoFun() {
      //获取摇钱树信息
      let that = this;
      if (that.isMe) {
        //是自己
        that.$http
          .post("Active/moneyTree", {
            token: localStorage.getItem("token")
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.gameMoney = res.data.data.total;
              that.gameSpend = res.data.data.spend;
            }
          })
          .catch(function(err) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
        that.$http
          .post("Active/invitationUser", {
            token: localStorage.getItem("token")
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.inviteLink = res.data.data;
            }
          });
      } else {
        that.$http
          .post("Active/invitationWeb", {
            token: localStorage.getItem("token"),
            id: that.friendsId
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.gameMoney = res.data.data.total;
              that.gameSpend = res.data.data.spend;
            }
          })
          .catch(function(err) {
            Toast({
              message: "网络连接失败",
              position: "bottom",
              duration: 5000
            });
          });
      }
    },
    onError() {
      // 移动端走的失败
      // alert(navigator.userAgent);
      // if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   if (/ baiduboxapp/i.test(navigator.userAgent)) {
      //     window.location.replace(
      //       "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
      //     );
      //   } else {
      //     window.location.replace("http://weixin://");
      //   }
      // } else {
      //   window.location.replace("http://weixin://");
      // }
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    },
    inviteFun() {
      // web走的成功
      // 邀请
      // let that = this;
      // if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      //   if (/ baiduboxapp/i.test(navigator.userAgent)) {
      //     window.location.replace(
      //       "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
      //     );
      //   } else {
      //     window.location.replace("http://weixin://");
      //   }
      // } else {
      //   window.location.replace("http://weixin://");
      // }
      Toast({
        message: "链接复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    },
    //关闭弹窗
    close_toast() {
      this.toast_control = false;
    },
    close_dialog() {
      this.confirmGame = false;
    }
  }
};
</script>

<style scoped="scoped">
#turntable {
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

.mint-header {
  position: relative;
  background: #ef6213;
}

.lucky-wheel {
  position: relative;
  width: 100%;
  height: 10.3625rem;
  height: 100%;
  background: rgb(252, 207, 133) url("../../assets/img/moneyTreeBg.png")
    no-repeat 0 0 / 100% 100%;
}
.game_money {
  height: 0.4rem;
  color: rgba(239, 98, 19, 1);
  font-size: 0.28rem;
  font-family: PingFangSC-regular;
  padding: 0.4rem 0 0 0.6rem;
}
.game_tree {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 1rem;
  margin: auto;
  width: 100%;
  height: 75%;
  padding: 0 0.2rem;
}
.click_prize {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.8rem;
  width: 4rem;
  height: 1.2rem;
  margin: auto;
  border-radius: 0.4rem;
  background: rgba(231, 224, 221, 0.3);
  text-align: center;
}
.click_prize > span {
  display: inline-block;
  font-weight: 900;
  outline: none;
  width: 3.8rem;
  height: 0.92rem;
  border-radius: 0.3rem;
  color: #fafc5e;
  font-size: 0.4rem;
  line-height: 1rem;
  margin-top: 0.1rem;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  background-color: #ff6b13;
  box-shadow: 0px 0.08rem 0px 0px rgba(174, 34, 5, 0.7);
}
.invite {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.8rem;
  text-align: center;
}
.invite button {
  display: inline-block;
  width: 120px;
  height: 36px;
  line-height: 36px;
  border-radius: 10px;
  background-color: rgba(171, 171, 174, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  outline: 0 none;
  border: 0 none;
  text-align: center;
  font-family: Arial;
  box-shadow: 0px 0.08rem 0px 0px rgba(128, 126, 126, 0.7);
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 4.8375rem;
  background: #fff;
  border-radius: 0.1125rem;
  padding: 0.2125rem;
  background-color: rgb(252, 244, 224);
}
.toast-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dotted #fccc6e;
}
.toast-picture {
  position: absolute;
  top: -1.5rem;
  left: -0.5rem;
  width: 5.75rem;
  height: 2.0625rem;
}
.toast-pictrue-change {
  position: absolute;
  top: -0.5rem;
  left: -0.375rem;
  width: 17.5rem;
  height: 3.125rem;
}
.toast-title {
  padding: 1.0125rem 0;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}
.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3375rem;
}
.toast-btn div {
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );

  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 2.8875rem;
  height: 0.875rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 0.875rem;
  color: #fff;
}
.close {
  position: absolute;
  top: -0.4375rem;
  right: -0.4375rem;
  width: 0.8rem;
  height: 0.8rem;
  background: url("../../assets/img/close_store.png") no-repeat center top;
  background-size: 100%;
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
  padding-top: 1rem;
  font-size: 0.28rem;
}

.dialog .haufei a {
  color: #ef6213;
}
.dialog button {
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );

  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 50%;
  height: 0.6rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 0.6rem;
  color: #fff;
  margin-top: 1rem;
  outline: none;
  border: none;
}
</style>
