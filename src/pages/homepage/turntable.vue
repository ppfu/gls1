<template>
  <div id="turntable">
    <mt-header fixed title="大转盘">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <span slot="right" @click="gotoResult">结果</span>
    </mt-header>
    <div class="con-wrapper">
      <div class="turn_con">
        <div class="container">
          <div class="lucky-wheel">
            <div class="lucky-title"></div>
            <div class="wheel-main">
              <div class="wheel-pointer-box">
                <button
                  :disabled="!click_flag"
                  class="wheel-pointer"
                  @click="startGameFun"
                  :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"
                ></button>
              </div>
              <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">
                <div class="prize-list">
                  <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
                    <div class="prize-pic">
                      <!-- <img :src="item.icon"> -->
                    </div>
                    <!-- <div class="prize-count" v-if="item.count">{{item.count}}</div> -->
                    <div class="prize-type">{{item.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="main">
            <div class="main-bg"></div>
            <div class="bg-p"></div>
            <div class="content">
              <!-- <div class="lottery_ticket">今日免费抽奖次数： {{ lottery_ticket}}</div> -->
            </div>
            <div class="tip">
              <div class="tip-title">幸运大转盘</div>
              <div class="tip-content">
                <p>1.幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘。</p>
                <p>2.幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘。</p>
                <p>3.幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘幸运大转盘</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast" v-show="toast_control">
      <div class="toast-container">
        <img :src="toast_pictrue" class="toast-picture" />
        <div class="close" @click="close_toast()"></div>
        <div class="toast-title">{{toast_title}}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="close_toast" v-show="index != 4">关闭</div>
          <div class="toast-cancel" @click="againGameFun" v-show="index == 4">再来一次</div>
        </div>
      </div>
    </div>
    <div class="toast-mask" v-show="toast_control"></div>
    <x-dialog v-model="confirmGame" class="de_dialog lang_dialog" hide-on-blur>
      <div class="dialog">
        <span class="iconfont icon-tabguanbi" @click="close_dialog"></span>
        <h4>确认信息</h4>
        <span class="haufei">
          游戏需要
          <a>{{gameSpend}}</a>, 确定要抽奖吗?
        </span>
        <button @click="rotate_handle()">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { TransferDomDirective as TransferDom } from "vux";
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
      prize_list: [
        {
          icon: require("../../assets/img/bean_500.png"), // 奖品图片
          count: 10, // 奖品数量
          name: "易趣豆", // 奖品名称
          isPrize: 1 // 该奖项是否为奖品
        },
        {
          icon: require("../../assets/img/bean_five.png"),
          count: 5,
          name: "豆",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/bean_one.png"),
          count: 10,
          name: "易趣豆",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/point_five.png"),
          count: 5,
          name: "积分",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/point_ten.png"),
          count: 10,
          name: "积分",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/bean_500.png"),
          count: 10,
          name: "易趣豆",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/give_up.png"),
          count: 0,
          name: "未中奖",
          isPrize: 0
        },
        {
          icon: require("../../assets/img/bean_500.png"),
          count: 10,
          name: "易趣豆",
          isPrize: 1
        }
      ], //奖品列表
      toast_control: false, //抽奖结果弹出框控制器
      hasPrize: false, //是否中奖
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      start_rotating_degree_pointer: 0, //指针初始旋转角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
      rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
      click_flag: true, //是否可以旋转抽奖
      index: 0,
      disabled: false,
      confirmGame: false, // 确认抽奖弹窗
      gameSpend: "", // 抽奖花费
      gameAgain: "" // 抽中再来一次
    };
  },
  directives: {
    TransferDom
  },
  created() {
    // this.init_prize_list();
  },
  mounted() {
    this.turntableInfoFun(); //获取转盘信息
  },
  computed: {
    toast_title() {
      return this.hasPrize
        ? "恭喜您，获得" + " " + this.prize_list[this.index].name
        : "未中奖";
    },
    toast_pictrue() {
      return this.hasPrize
        ? require("../../assets/img/congratulation.png")
        : require("../../assets/img/sorry.png");
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
          result: 0
        }
      });
    },
    startGameFun() {
      // 弹出确认抽奖框
      if (this.gameAgain == 1) {
        this.rotate_handle();
      } else {
        this.confirmGame = true;
      }
    },
    rotate_handle() {
      //开始游戏
      let that = this;
      that.confirmGame = false;
      that.$http
        .post("Active/turntableAction", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.index = res.data.data.id - 1; //指定每次旋转到的奖品下标
            that.rotating();
            // that.click_flag = false; // 旋转结束前，不允许再次触发
          } else if (res.data.code == -1) {
            Toast({
              message: res.data.msg,
              position: "center",
              duration: 3000
            });
          }
        });
    },
    turntableInfoFun() {
      //获取转盘信息
      let that = this;
      that.$http
        .post("Active/turntable", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            for (let i = 0; i < that.prize_list.length; i++) {
              that.prize_list[i].name = res.data.data.prize[i].name;
              if (
                res.data.data.prize[i].type == 10 ||
                res.data.data.prize[i].type == 11
              ) {
                that.prize_list[i].isPrize = 0;
              } else {
                that.prize_list[i].isPrize = 1;
              }
              that.gameSpend = res.data.data.spend;
              that.gameAgain = res.data.data.status;
            }
          } else {
            Toast(res.data.msg);
          }
        })
        .catch(function(err) {
          Toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    rotating() {
      if (!this.click_flag) return;
      var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
      var during_time = 5; // 默认为1s
      var random = Math.floor(Math.random() * 7);
      var result_index = this.index; // 最终要旋转到哪一块，对应prize_list的下标
      var result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
      var rand_circle = 6; // 附加多转几圈，2-3
      this.click_flag = false; // 旋转结束前，不允许再次触发
      if (type == 0) {
        // 转动盘子
        var rotate_angle =
          this.start_rotating_degree +
          rand_circle * 360 +
          result_angle[result_index] -
          (this.start_rotating_degree % 360);
        this.start_rotating_degree = rotate_angle;
        this.rotate_angle = "rotate(" + rotate_angle + "deg)";
        // // //转动指针
        // this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
        // this.start_rotating_degree_pointer =360*rand_circle;
        var that = this;
        // 旋转结束后，允许再次触发
        setTimeout(function() {
          that.click_flag = true;
          that.game_over();
        }, during_time * 1000 + 1500); // 延时，保证转盘转完
      } else {
        //
      }
    },
    //此方法为处理奖品数据
    init_prize_list() {
      console.log(this.index);
    },
    againGameFun() {
      this.toast_control = false;
      this.rotate_handle();
    },
    game_over() {
      this.toast_control = true;
      this.hasPrize = this.prize_list[this.index].isPrize;
      this.init_prize_list();
      this.turntableInfoFun(); //刷新是否是再来一次
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
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 40px;
}

.mint-header {
  position: relative;
  background: #ef6213;
}

.container {
  width: 100%;
}
.lucky-wheel {
  width: 100%;
  height: 10.3625rem;
  background: rgb(252, 207, 133) url("../../assets/img/color_pillar.png")
    no-repeat center bottom;
  background-size: 100%;
  padding-top: 0.5625rem;
}
.lucky-title {
  width: 100%;
  height: 2.625rem;
  background: url("../../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}
.wheel-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.wheel-bg {
  width: 6.4375rem;
  height: 6.4375rem;
  background: url("../../assets/img/draw_wheel.png") no-repeat center top;
  transform: rotate(90deg);
  background-size: 100%;
  color: #fff;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  transition: transform 3s ease;
}
.wheel-pointer-box {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -60%);
  width: 2.3125rem;
  height: 2.3125rem;
}
.wheel-pointer {
  width: 2.3125rem;
  height: 2.3125rem;
  background: url("../../assets/img/draw_btn.png") no-repeat center top;
  background-size: 100%;
  transform-origin: center 60%;
  border: none;
  outline: none;
}
.wheel-bg div {
  text-align: center;
  padding-top: 0.25rem;
  width: 1.825rem;
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.prize-list .prize-item {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}
.prize-list .prize-item:first-child {
  top: 0;
  left: 3.0125rem;
  transform: rotate(20deg);
}
.prize-list .prize-item:nth-child(2) {
  top: 1rem;
  left: 3.9rem;
  transform: rotate(67deg);
}
.prize-list .prize-item:nth-child(3) {
  top: 2.42rem;
  left: 3.988rem;
  transform: rotate(-250deg);
}
.prize-list .prize-item:nth-child(4) {
  top: 3.384rem;
  left: 2.9425rem;
  transform: rotate(-210deg);
}
.prize-list .prize-item:nth-child(5) {
  top: 3.4125rem;
  left: 1.644rem;
  transform: rotate(-160deg);
}
.prize-list .prize-item:nth-child(6) {
  top: 2.3475rem;
  left: 0.6rem;
  transform: rotate(-111deg);
}
.prize-list .prize-item:nth-child(7) {
  top: 1.1rem;
  left: 0.8125rem;
  transform: rotate(-69deg);
}
.prize-list .prize-item:nth-child(8) {
  top: 0.1rem;
  left: 1.6rem;
  transform: rotate(-20deg);
}
.prize-item {
  width: 1.875rem;
  height: 3rem;
}

.prize-pic img {
  width: 1.2625rem;
  height: 0.7rem;
  margin-top: 0.4625rem;
}
.prize-count {
  font-size: 0.26rem;
}
.prize-type {
  font-size: 0.28rem;
}
.main {
  position: relative;
  width: 100%;
  min-height: 4.25rem;
  background: rgb(243, 109, 86);
  padding-bottom: 0.6875rem;
}
.main-bg {
  width: 100%;
  height: 3.2625rem;
  position: absolute;
  top: -0.2375rem;
  left: 0;
  background: url("../../assets/img/luck_bg.png") no-repeat center top;
  background-size: 100%;
}
.bg-p {
  width: 100%;
  height: 0.95rem;
  background: rgb(252, 207, 133);
}
.content {
  position: absolute;
  left: 0;
  background: rgb(243, 109, 86);
  width: 100%;
  height: 2.1875rem;
  font-size: 0.26rem;
  color: #ffeb39;
  padding-left: 2.4rem;
}
.content div {
  text-align: left;
}
.tip {
  position: relative;
  margin: 0.5rem auto 0;
  width: 5rem;
  border: 1px solid #fbc27f;
}
.tip-title {
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 0.28rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.425rem;
}
.tip-content {
  padding: 0.4625rem 0.325rem;
  font-size: 0.26rem;
  color: #fff8c5;
  line-height: 1.5;
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
