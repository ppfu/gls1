<template>
  <div id="index">
    <div>
      <mt-header fixed title="首页"></mt-header>
      <!-- 内容 -->
      <div class="con-wrapper">
        <div class="swipe">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in data" :key="item.id" @click.native="linkTo(item.url, item.parameter)">
              <img :src="item.link" />
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="table_con">
          <div class="table_list" @click="gotoStoreH">
            <img src="../../assets/img/bus.png" />
            <span>创客商城</span>
          </div>
          <div class="table_list" @click="gotoCount">
            <img src="../../assets/img/one.png" />
            <span>合作田园</span>
          </div>
          <div class="table_list" @click="gotoFrouit">
            <img src="../../assets/img/orch_garden.png" />
            <span>合作果园</span>
          </div>
          <div class="table_list" @click="gotoRan">
            <img src="../../assets/img/pasture.png" />
            <span>合作牧场</span>
          </div>
          <div class="table_list" @click="gotoSuperM">
            <img src="../../assets/img/super.png" />
            <span>谷联超市</span>
          </div>
          <div class="table_list" @click="gotoYipin">
            <img src="../../assets/img/ypyd.png" />
            <span>一品一地</span>
          </div>
          <div class="table_list" @click="gotoLocal">
            <img src="../../assets/img/perfruit.png" />
            <span>本地店铺</span>
          </div>
          <div class="table_list" @click="gotoVideo">
            <img src="../../assets/img/video.png" />
            <span>在线视频</span>
          </div>
          <div class="table_list" @click="gotoFarm">
            <img src="../../assets/img/farm.png" />
            <span>我的农场</span>
          </div>
          <div class="table_list" @click="gotoRecre">
            <img src="../../assets/img/recre.png" />
            <span>我的娱乐</span>
          </div>
          <div class="table_list" @click="gotoRech">
            <img src="../../assets/img/rech.png" />
            <span>在线充值</span>
          </div>
          <div class="table_list" @click="gotoMess">
            <img src="../../assets/img/infor.png" />
            <span>平台资讯</span>
          </div>
        </div>
        <div class="img_src">
          <img v-for="item in bottomLink" :key="item.id" @click="linkTo(item.url, item.parameter)" :src="item.link">
        </div>
      </div>
    </div>
    <div v-if="guidePage == ''" class="guide_page">
      <van-swipe @change="onChange" :loop="false">
        <van-swipe-item v-for="(item, index) in data" :key="index">
          <img :src="item" alt="">
          <span @click="hideFun" v-if="data[data.length - 1] == item">立即体验</span>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from "mint-ui";
export default {
  components: {
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem
  },
  data() {
    return {
      data: [], //轮播图数据
      bottomLink: [], // 底部连接
      guidePage: localStorage.getItem("guidePage") || true,
    };
  },
  created: function() {
    this.getIndexBanner();
    if (localStorage.getItem("guidePage")) {
      localStorage.setItem("guidePage", false);
      this.guidePage = localStorage.getItem("guidePage");
    }
  },
  methods: {
    onChange() { //引导页

    },
    hideFun() {
      localStorage.setItem("guidePage", false);
      this.guidePage = false;
    },
    linkTo(url) {
      this.$router.push({
        path: url
      });
    },
    //获取首页轮播图
    getIndexBanner() {
      let that = this;
      that
        .$http({
          url: "Home/index",
          method: "post"
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            that.data = res.data.data;
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
      that
        .$http({
          url: "Home/index2",
          method: "post"
        })
        .then(function(res) {
          var msg = res.data.msg;
          if (res.data.code == 0) {
            that.bottomLink = res.data.data;
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
    },
    gotoStoreH() {
      this.$router.push({
        path: "/tabs/storeHome"
      });
    },
    gotoSuperM() {
      this.$router.push({
        path: "/supermarket"
      });
    },
    gotoYipin() {
      this.$router.push({
        path: "/yipinyidi"
      });
    },
    gotoVideo() {
      this.$router.push({
        path: "/video"
      });
    },
    gotoRecre() {
      this.$router.push({
        path: "/recreation"
      });
    },
    gotoMess() {
      this.$router.push({
        path: "/message"
      });
    },
    gotoRech() {
      this.$router.push({
        path: "/recharge"
      });
    },
    gotoLocal() {
      this.$router.push({
        path: "/localshop"
      });
    },
    //我的农场
    gotoFarm() {
      this.$router.push({
        path: "/tabs/farm"
      });
    },
    gotoCount() {
      this.$router.push({
        path: "/tabs/adopt",
        query: {
          tabindex: 0
        }
      });
    },
    gotoFrouit() {
      this.$router.push({
        path: "/tabs/adopt",
        query: {
          tabindex: 1
        }
      });
    },
    gotoRan() {
      this.$router.push({
        path: "/tabs/adopt",
        query: {
          tabindex: 2
        }
      });
    },

    onScroll(pos) {
      this.scrollTop = pos.top;
    }
  }
};
</script>

<style scoped="scoped">
#index {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 1.8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: 0.8rem;
}

/* 轮播图 */
.mint-swipe {
  width: 100%;
  height: 4.4rem;
}
.mint-swipe img {
  display: block;
  width: 100%;
  height: 100%;
}

.table_con {
  width: 94%;
  margin: 0 auto;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.table_con .table_list {
  width: 16%;
  height: 1.5rem;
  margin: 0.1rem 0.3rem;
  text-align: center;
}
.table_con .table_list img {
  width: 90%;
}
.table_con .table_list span {
  font-size: 0.24rem;
  color: #999;
}
.tabber {
  height: 1rem;
  z-index: 9999;
}

.img_src {
  width: 100%;
  padding: 0.2rem;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.img_src img {
  width: 3.45rem;
  height: 2.346rem;
  border: 1px solid #e5e5e5;
  margin-bottom: 0.2rem;
}
.img_src img:nth-last-child(1), .img_src img:nth-last-child(2) {
  margin-bottom: 0;
}

.guide_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 99999999999;
  width: 100%;
  height: 100%;
}
.van-swipe {
  width: 100%;
  height: 100%;
  background: white;
}
.van-swipe-item span {
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1rem;
  margin: auto;
  z-index: 1;
  width: 3rem;
  height: 0.6rem;
  font-size: .28rem;
  color: #ef6213;
  line-height: 0.6rem;
  text-align: center;
  border-radius: 0.3rem;
  background: rgba(168, 140, 140, 0.3);
}
</style>