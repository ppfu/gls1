<template>
  <div id="turntable">
    <mt-header fixed title="抽奖">
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
            <div class="prize_main">
              <ul class="list">
                <li
                  class="item"
                  :class="['item' + n, {'active': index === n}]"
                  v-for="(item, n) in prize_list"
                  :key="n"
                >
                  <img class="icon" :src="item.icon" :alt="item.info" />
                  <span class="info">{{item.name}}</span>
                </li>
                <button class="game_btn" @click="startGameFun">
                  <strong class="text">立即抽奖</strong>
                </button>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast" v-show="toast_control">
      <div class="toast-container">
        <img :src="toast_pictrue" class="toast-picture" />
        <div class="close" @click="close_toast"></div>
        <div class="toast-title">
          <span v-show="prizeLinkType != 12"><span v-show="hasPrize">恭喜您获得<br /></span>{{toast_title}}</span>
          <img v-show="prizeLinkType == 12" @click="prizeLinkFun" :src="prizeImg" >
        </div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="prizeLinkFun" v-show="index != 4">{{prizeLinkType==12?"立即前往":"关闭"}}</div>
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
        <button @click="startLottery">确定</button>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { XNumber, XInput, XDialog } from "vux";
import { Toast, Indicator } from "mint-ui";
import { log } from "util";
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
      // 奖单
      prize_list: [
        {
          icon: require("../../assets/img/bean_500.png"), // 奖品图片
          count: 10, // 奖品数量
          name: "", // 奖品名称
          isPrize: 1 // 该奖项是否为奖品
        },
        {
          icon: require("../../assets/img/bean_five.png"),
          count: 5,
          name: "",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/point_five.png"),
          count: 10,
          name: "",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/give_up.png"),
          count: 5,
          name: "",
          isPrize: 0
        },
        {
          icon: require("../../assets/img/point_ten.png"),
          count: 10,
          name: "",
          isPrize: 0
        },
        {
          icon: require("../../assets/img/point_ten.png"),
          count: 10,
          name: "",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/point_ten.png"),
          count: 0,
          name: "",
          isPrize: 1
        },
        {
          icon: require("../../assets/img/give_up.png"),
          count: 10,
          name: "",
          isPrize: 0
        }
      ],
      toast_control: false,
      confirmGame: false,
      index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 80, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1, // 中奖位置
      click: true,
      prizeIndex: "",
      prizeLink: "", //中奖link
      prizeLinkType: "", //中奖类型
      prizeImg: "", //中奖图片
      hasPrize: false, //是否中奖
      gameSpend: "", // 抽奖花费
      gameAgain: "" // 抽中再来一次
    };
  },
  mounted() {
    this.getPrizeInfoFun(); //获取转盘信息
  },
  computed: {
    toast_title() {
      if (this.prizeIndex > 7) {
        this.prizeIndex = 7;
      }
      if (this.prizeLinkType == 12) {
        return this.hasPrize? this.prizeImg : "未中奖";
      } else {
        return this.hasPrize? this.prize_list[this.prizeIndex].name : "未中奖";
      }
    },
    toast_pictrue() {
      return this.hasPrize ? require("../../assets/img/congratulation.png") : require("../../assets/img/sorry.png");
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
          result: 2
        }
      });
    },
    startGameFun() {
      // 弹出确认抽奖框
      if (!this.click) {
        return;
      }
      if (this.gameAgain == 1) {
        this.startLottery();
      } else {
        this.confirmGame = true;
      }
    },
    // 开始抽奖
    startLottery() {
      if (!this.click) {
        return;
      }
      this.confirmGame = false;
      this.speed = 200;
      this.getPrizeIndex();
      // this.prizeIndex = 4;
      // this.startRoll();
      // this.prizeLink = "/marketDetail?name=哈蜜&storeId=7";
      // this.prizeLinkType = 11;
    },
    // 开始转动
    startRoll() {
      this.click = false;
      this.times += 1; // 转动次数
      this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.index) {
        clearTimeout(this.timer); // 清除转动定时器，停止转动
        this.game_over();
        this.prize = -1;
        this.times = 0;
        this.click = true;
        // console.log("你已经中奖了");
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10; // 加快转动速度
        } else if (this.times === this.cycle) {
          // 获得中奖位置
          this.prize = this.prizeIndex;
          // console.log(this.prizeIndex);
          if (this.prize > 7) {
            this.prize = 7;
          }
          // console.log(`中奖位置${this.prize}`);
        } else if (
          this.times > this.cycle + 10 &&
          ((this.prize === 0 && this.index === 7) ||
            this.prize === this.index + 1)
        ) {
          this.speed += 110;
        } else {
          this.speed += 20;
        }
        if (this.speed < 40) {
          this.speed = 40;
        }
        this.timer = setTimeout(this.startRoll, this.speed);
      }
    },
    // 每一次转动
    oneRoll() {
      let index = this.index; // 当前转动到哪个位置
      const count = this.count; // 总共有多少个位置
      index += 1;
      if (index > count - 1) {
        index = 0;
      }
      this.index = index;
    },
    getPrizeInfoFun() {
      // 获取奖品
      let that = this;
      that.$http
        .post("Active/luckdraw", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            for (let i = 0; i < res.data.data.prize.length; i++) {
              that.prize_list[i].name = res.data.data.prize[i].name;
              that.prize_list[i].url = res.data.data.prize[i].url;
              if (
                res.data.data.prize[i].type == 10 ||
                res.data.data.prize[i].type == 11
              ) {
                that.prize_list[i].isPrize = 0;
              } else {
                that.prize_list[i].isPrize = 1;
              }
            }
            that.gameSpend = res.data.data.spend;
            that.gameAgain = res.data.data.status;
          }
        });
    },
    getPrizeIndex() {
      // 获取服务器返回的中奖id
      let that = this;
      that.$http
        .post("Active/luckdrawAction", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.prizeIndex = res.data.data.id - 1;
            that.prizeLinkType = res.data.data.type;
            that.prizeImg = res.data.data.msg;
            that.prizeLink = that.prize_list[that.prizeIndex].url;
            that.startRoll();
          }else{
            Toast(res.data.msg);
          }
        });
    },
    againGameFun() {
      this.toast_control = false;
      this.getPrizeIndex();
    },
    game_over() {
      setTimeout(() => {
        this.toast_control = true;
        this.hasPrize = this.prize_list[this.prizeIndex].isPrize;
        this.click = true; // 游戏结束可以再次抽奖
        this.getPrizeInfoFun();
      }, 300);
    },
    //跳转
    prizeLinkFun() {
      if (this.prizeLinkType != 12) {
        this.toast_control = false;
      } else {
        this.$router.push({
          path: this.prizeLink
        });
      }
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
.turn_con {
  width: 100%;
  height: 100%;
}

.mint-header {
  position: relative;
  background: #ef6213;
}

.container {
  width: 100%;
  height: 100%;
}
.lucky-wheel {
  width: 100%;
  height: 100%;
  background: rgb(252, 207, 133) url("../../assets/img/color_pillar.png")
    no-repeat center bottom;
  background-size: 100%;
  padding-top: 0.5625rem;
}
.lucky-title {
  width: 100%;
  height: 2.625rem;
  background: url("../../assets/img/lucky_nine.png") no-repeat center top;
  background-size: 100%;
}
.prize_main {
  width: 6.5rem;
  height: 6.5rem;
  padding: 0.6rem;
  background: url("../../assets/img/prize.png") no-repeat 0 0/100% 100%;
  margin: auto;
}
.list {
  position: relative;
  background: #c93e20;
  width: 100%;
  height: 100%;
}
.item {
  width: 32%;
  height: 29%;
  position: absolute;
  background-color: white;
  box-shadow: 0px 0.14rem 0px 0px #f9d0c3;
  border-radius: 0.24rem;
  overflow: hidden;
  text-align: center;
  font-size: 0.24rem;
  color: #936365;
}
.item0 {
  left: 0;
  top: 0;
}
.item1 {
  left: 34%;
  top: 0;
}
.item2 {
  left: 68%;
  top: 0;
}
.item3 {
  left: 68%;
  top: 34%;
}
.item4 {
  left: 68%;
  top: 68%;
}
.item5 {
  left: 34%;
  top: 68%;
}
.item6 {
  left: 0;
  top: 68%;
}
.item7 {
  left: 0;
  top: 34%;
}
.icon {
  height: 40%;
  width: 40%;
  margin-top: 12px;
}
.info {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 0.48rem;
  width: 100%;
  line-height: 0.48rem;
  z-index: 2;
}
.active {
  background: #f9df4b;
}

.game_btn {
  display: block;
  width: 32%;
  height: 29%;
  background: #f9df4b;
  position: absolute;
  box-shadow: 0px 0.14rem 0px 0px #f9d0c3;
  left: 34%;
  top: 34%;
  font-size: 0.72rem;
  border-radius: 0.24rem;
  overflow: hidden;
  outline: none;
  border: none;
}
.text {
  height: 100%;
  width: 100%;
  font-size: 0.32rem;
  text-align: center;
  line-height: 1.76rem;
  color: #c93e20;
  font-weight: 900;
}
.mask {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.lucky-times {
  color: #000;
  font-size: 0.36rem;
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
  margin: 0.4rem 0 0.2rem;
  text-align: center;
  width: 100%;
  min-height: 2rem;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;
  -webkit-align-items: center;
}
.toast-title span {
  font-size: .36rem;
  color: #fc7939;
}
.toast-title img {
  width: 100%;
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
  font-size: 0.28rem;
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
