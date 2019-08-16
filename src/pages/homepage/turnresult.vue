<template>
  <div id="turnresult">
    <mt-header fixed title="结果详情">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="result_content">
        <div class="result_info">
          <div class="result_list" v-for="item in resultList" :key="item.id">
            <span>{{item.title}}</span>
            <span>{{item.money}}</span>
            <span>{{item.time}}</span>
          </div>
        </div>
        <div class="bottomt"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: this.$route.query.result,
      resultList: "" // 结果
    };
  },
  components: {},
  mounted() {
    this.turnresult(); //获取中奖信息
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    turnresult() {
      let that = this;
      if (that.result == 0) { // 大转盘结果
        that.$http
        .post("Active/turntableRecord", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.resultList = res.data.data;
          } else if (res.data.code == -1) {
            Toast({
              message: res.data.msg,
              position: "center",
              duration: 3000
            });
          }
        });
      } else if (that.result == 1) { // 摇钱树
        that.$http
        .post("Active/treeLog", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.resultList = res.data.data;
          } else if (res.data.code == -1) {
            Toast({
              message: res.data.msg,
              position: "center",
              duration: 3000
            });
          }
        });
      } else if (that.result == 2) { // 抽奖
        that.$http
        .post("Active/luckdrawRecord", {
          token: localStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.resultList = res.data.data;
          } else if (res.data.code == -1) {
            Toast({
              message: res.data.msg,
              position: "center",
              duration: 3000
            });
          }
        });
      }
    }
  }
};
</script>

<style scoped="scoped">
#turnresult {
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
  background: rgb(252, 207, 133) url("../../assets/img/color_pillar.png")
    no-repeat 100% 100%;
  background-size: 100%;
}

.result_info {
  padding: 0 0.2rem;
}

.result_list {
  padding-top: 0.2rem;
  font-size: 0.28rem;
  display: flex;
  justify-content: space-between;
}

.result_list span:nth-last-child(1) {
  color: #888;
}

.bottomt {
  width: 100%;
  height: 3rem;
  background: url(../../assets/img/luck_bg.png) no-repeat center bottom;
  background-size: 100%;
  position: fixed;
  bottom: 0;
}

.mint-header {
  background: #ef6213;
}
</style>
