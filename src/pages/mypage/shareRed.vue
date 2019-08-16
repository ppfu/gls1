<template>
  <div id="sharered">
    <mt-header fixed title="分享领红包">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="sharered_con">
        <div class="shar_title">
          <div class="shar_num">
            <span>红包数量&nbsp;&nbsp;&nbsp;</span>
            <span class="shar_number">{{count}}个</span>
          </div>
          <div class="shar_card">
            <van-checkbox v-model="checked" id="checked" checked-color="#EF6213"></van-checkbox>
            <p class="many_c" @click="gotoMcard">
              <img src="../../assets/img/many.png" />
              <span>多倍卡&nbsp;&nbsp;&nbsp;</span>
              <span class="shar_number">{{multiple}}张</span>
            </p>
          </div>
        </div>
        <div class="open_redpack">
          <div class="open">
            <img @click="openHongbao" src="../../assets/img/kj.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast
  },
  data() {
    return {
      id: this.$route.query.id, //红包id
      count: this.$route.query.count, //红包个数
      checked: false,
      multiple: "" //多倍卡数量
    };
  },
  mounted: function() {
    let that = this;
    that.getMultiple();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },

    gotoMcard() {
      this.$router.push({
        path: "/manycard"
      });
    },
    //开红包 ,不使用多倍卡
    openHongbao() {
      let that = this;
      var jsonData;
      if (that.checked == false) {
        //不使用多倍卡
        jsonData = {
          token: localStorage.getItem("token"),
          id: that.id,
          type: 0
        };
      } else if (that.checked == true) {
        //使用多倍卡
        jsonData = {
          token: localStorage.getItem("token"),
          id: that.id,
          type: 1
        };
      }
      that.httpSubmit(jsonData);
    },
    // 提交 请求
    httpSubmit(jsonData) {
      let that = this;
      Indicator.open({
        text: "正在打开..."
      });
      that
        .$http({
          url: "hong_bao/lotteryActive",
          method: "post",
          data: jsonData
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            Toast(res.data.msg);
            that.getMultiple();
          } else {
            //失败
            Toast(res.data.msg);
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
    //获取多倍卡数量
    getMultiple() {
      let that = this;
      that
        .$http({
          url: "hong_bao/multiplePage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.multiple = res.data.data.multiple;
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
    }
  }
};
</script>

<style scoped="scoped">
#sharered {
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
  background: #ef6213;
}

.sharered_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.2rem;
}

.shar_title {
  display: flex;
  justify-content: space-between;
  font-size: 0.28rem;
  align-items: center;
}

.shar_title .iconfont {
  font-size: 0.4rem;
  color: red;
}

.shar_title .shar_number {
  color: #ef6213;
}

.shar_card,
.many_c {
  display: flex;
  align-items: center;
}

.many_c {
  margin-left: 0.1rem;
}

.shar_card img {
  width: 0.4rem;
}

.open_redpack {
  width: 100%;
  height: 100vh;
  background: url(../../assets/img/openb.png) no-repeat center top;
  background-size: 100%;
  position: relative;
}

.open_redpack .open {
  position: absolute;
  left: 2.68rem;
  top: 5.2rem;
}

.open_redpack .open img {
  width: 1.2rem;
}
</style>
