<template>
  <div id="my">
    <mt-header fixed title="我的">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="content">
        <div class="head-por">
          <img src="../../assets/img/logo.jpg" />
          <div class="name">
            <span>{{mineInfo.name}}</span>
          </div>
          <span>{{mineInfo.phone}}</span>
        </div>
        <div class="my-content">
          <div class="my-yue">
            <span>余额</span>
            <span>{{mineInfo.balance}}</span>
          </div>

          <div class="balance">
            <div class="ba_tit" @click="gotoOrder">
              <h4>我的订单</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoAdd">
              <h4>地址管理</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoEnter">
              <h4>谷联超市入驻</h4>
              <img src="../../assets/img/more.png" />
            </div>
          </div>
          <div class="balance">
            <div class="ba_tit" @click="gotoMember">
              <h4>我的会员卡</h4>
              <img src="../../assets/img/more.png" />
            </div>
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
      mineInfo: []
    };
  },
  mounted() {
    let that = this;
    that.getMineInfo();
  },
  methods: {
    //获取商城我的页面
    getMineInfo() {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Pjshop/myMsg",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.mineInfo = res.data.data;
          } else {
            //失败
            Toast(res.data.msg);
          }
          Indicator.close();
        })
        .catch(function(error) {
          Indicator.close();
        });
    },
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoOrder() {
      this.$router.push({
        path: "/marketOrder",
        query: {
          isMine: 1
        }
      });
    },
    gotoAdd() {
      this.$router.push({
        path: "/marketAddress"
      });
    },
    gotoEnter() {
      this.$router.push({
        path: "/superEnter"
      });
    },
    gotoMember() {
      this.$router.push({
        path: "/memberDetail"
      });
    }
  }
};
</script>

<style scoped="scoped">
.mint-header {
  position: relative;
  background: #ef6213;
}

.mint-header img {
  position: absolute;
  right: 0.3rem;
  top: 0.2rem;
  width: 0.44rem;
}

#my {
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

.head-por {
  width: 100%;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.26rem;
}

.head-por img {
  width: 1.6rem;
  margin: 0.1rem 0;
}

.head-por span:nth-child(3) {
  margin-top: 0.1rem;
}

.my-content {
  width: 100%;
  padding: 0.3rem 0.2rem 0;
}
.my-content .my-btn {
  display: flex;
  justify-content: space-around;
}
.my-content .my-btn .mint-button {
  height: 0.54rem;
  font-size: 0.26rem;
  background: none;
}
.my-yue {
  text-align: center;
  font-size: 0.3rem;
}
.my-yue span {
  padding: 0 0.2rem;
}
.my-yue span:nth-child(2) {
  color: #ef6213;
}

.balance {
  margin-top: 0.26rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #e9e9e9;
}
.name {
  position: relative;
}
.name img {
  width: 0.44rem;
  margin-left: 0.1rem;
}
.name .jibie {
  display: flex;
  align-items: center;
  position: absolute;
  width: 3rem;
  top: -0.1rem;
  left: 1rem;
}
.balance h4 {
  font-size: 0.28rem;
  font-weight: normal;
  color: #777;
  padding-bottom: 0.1rem;
}

.balance .ba_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.balance .stat .stat-list span:nth-child(2) {
  padding-top: 4px;
}
.balance .ba_tit img {
  width: 0.28rem;
}
</style>
