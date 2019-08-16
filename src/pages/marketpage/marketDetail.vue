<template>
  <div id="marketDetail">
    <!-- 头部 -->
    <mt-header fixed :title="title">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <a id="tore-right" slot="right">
        <svg
          t="1562572508084"
          class="icon shop_cart"
          @click="gotoCar"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2723"
          width="200"
          height="200"
        >
          <path
            d="M347.136 783.36q19.456 0 36.864 7.168t30.72 19.968 20.48 30.208 7.168 36.864-7.168 36.864-20.48 30.208-30.72 20.48-36.864 7.68q-20.48 0-37.376-7.68t-30.208-20.48-20.48-30.208-7.168-36.864 7.168-36.864 20.48-30.208 30.208-19.968 37.376-7.168zM773.12 785.408q19.456 0 37.376 7.168t30.72 19.968 20.48 30.208 7.68 36.864-7.68 36.864-20.48 30.208-30.72 20.48-37.376 7.68-36.864-7.68-30.208-20.48-20.48-30.208-7.68-36.864 7.68-36.864 20.48-30.208 30.208-19.968 36.864-7.168zM945.152 203.776q28.672 0 44.544 7.68t22.528 18.944 6.144 24.064-3.584 22.016-12.8 37.888-22.016 62.976-24.064 68.096-17.92 53.248q-13.312 40.96-33.792 56.832t-50.176 15.872l-34.816 0-66.56 0-87.04 0-95.232 0-253.952 0 15.36 92.16 516.096 0q49.152 0 49.152 41.984 0 20.48-9.728 35.328t-38.4 14.848l-49.152 0-95.232 0-117.76 0-119.808 0-98.304 0-56.32 0q-20.48 0-34.304-9.216t-23.04-24.064-14.848-32.256-8.704-32.768q-1.024-6.144-5.632-29.696t-11.264-58.88-14.848-78.848-16.384-87.552q-19.456-103.424-44.032-230.4l-76.8 0q-15.36 0-25.6-7.68t-16.896-18.432-9.216-23.04-2.56-22.528q0-20.48 13.824-33.792t37.376-13.312l22.528 0 20.48 0 25.6 0 34.816 0q20.48 0 32.768 6.144t19.456 15.36 10.24 19.456 5.12 17.408q2.048 8.192 4.096 23.04t4.096 30.208q3.072 18.432 6.144 38.912l700.416 0z"
            fill="#ffffff"
            p-id="2724"
          />
        </svg>
        <svg
          t="1562572794722"
          class="icon shop_cart"
          @click="gotoMine"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4402"
          width="200"
          height="200"
        >
          <path
            d="M512 64h248.9v248.9c0 137.5-111.4 248.9-248.9 248.9S263.1 450.4 263.1 312.9 374.5 64 512 64zM288 611.6h448c96.2 0 174.2 78 174.2 174.2v24.9c0 82.5-66.9 149.3-149.3 149.3H263.1c-82.5 0-149.3-66.9-149.3-149.3v-24.9c-0.1-96.2 77.9-174.2 174.2-174.2z"
            fill="#ffffff"
            p-id="4403"
          />
        </svg>
      </a>
    </mt-header>
    <!-- 轮播 -->
    <div class="con-wrapper">
      <div class="swipe">
        <mt-swipe :auto="4000">
          <mt-swipe-item v-for="(item,index) in banner" :key="index">
            <img :src="item" />
          </mt-swipe-item>
        </mt-swipe>
        <div class="search">
          <input type="search" placeholder="请输入商品名称" v-model="name" @blur="onRefresh"/>
          <button :disabled="name == ''" @click="onRefresh">
            <i class="iconfont icon-tabsearch"></i>
          </button>
        </div>
      </div>
      <!-- 内容 -->
      <div class="scroll_div">
        <van-pull-refresh
          v-model="updateLoading"
          pulling-text="下拉刷新"
          loosing-text="释放更新"
          loading-text="正在加载..."
          @refresh="onRefresh"
        >
          <van-list
            v-model="moreloading"
            :finished="finished"
            :immediate-check="false"
            finished-text="————— 已经没有更多了 —————"
            @load="onLoad"
          >
            <div class="content">
              <div class="content-con">
                <div
                  class="content_list"
                  v-for="item in shopList"
                  :key="item.id"
                  @click="gotoComd(item)"
                >
                  <img :src="item.img" />
                  <div class="text-box">
                    <div class="con-title">
                      <h3>{{item.name}}</h3>
                    </div>
                    <div class="con-title3">
                      <span>售价：{{item.price}}</span>
                    </div>
                    <div class="con-title2">
                      <h3>会员价：{{item.integral}}元</h3>
                      <img src="../../assets/img/car2.png" @click.stop="addCar(item.id)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Indicator, Toast } from "mint-ui";
export default {
  components: {
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem,
    Indicator,
    Toast
  },
  data() {
    return {
      pageindex: 1,
      name: "", //店铺名称
      banner: [], //轮播图
      shopList: [], //商品列表
      shopListTotal: 0, // 商品总数量
      industry_id: "",
      title: this.$route.query.name, //店铺名称
      shopId: this.$route.query.storeId, //店铺id
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted() {
    this.getBanner();
    this.getShopList(0);
  },
  methods: {
    //下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.shopList = [];
      that.shopListTotal = 0;
      that.getShopList(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getShopList(1);
    },
    // 获取 商品列表
    getShopList(type) {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Pjshop/goodList",
          method: "post",
          data: {
            id: that.shopId,
            name: that.name,
            p: that.pageindex
          }
        })
        .then((res)=> {
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.shopList = res.data.data.list;
                that.shopListTotal = res.data.data.count;
                if (that.shopList.length >= that.shopListTotal) {
                  //全部数据已加载
                  that.finished = true;
                }
              } else {
                that.finished = true;
              }
              that.updateLoading = false;
            } else {
              that.moreloading = false;
              if (res.data.data.list != "") {
                that.shopList = that.shopList.concat(res.data.data.list);
                that.shopListTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.shopList.length >= that.shopListTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
          } else {
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
    // 获取banner 图
    getBanner() {
      let that = this;
      that
        .$http({
          url: "Pjshop/banner",
          method: "post",
          data: {
            id: that.shopId
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.banner = res.data.data;
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
    // 加入购物车
    addCar(id) {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Goodspj/addShopping",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            goods_id: id,
            number: 1
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            Toast("购物车添加成功！");
          } else {
            Toast(res.data.msg);
          }
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
    back() {
      this.$router.go(-1); //返回上一层
    },
    // 进入商品详情页
    gotoComd(item) {
      let that = this;
      sessionStorage.setItem("shopName", item.name); //商品名称
      sessionStorage.setItem("shopImg", item.img); //商品图片
      this.$router.push({
        path: "/proDetail",
        query: {
          name: item.name,
          storeId: item.id
        }
      });
    },
    gotoCar() {
      this.$router.push({
        path: "/marketShopcar"
      });
    },
    gotoMine() {
      this.$router.push({
        path: "/marketMine"
      });
    },
    gotoClose() {
      this.$router.push({
        path: "/marketClose"
      });
    }
  }
};
</script>

<style scoped="scoped">
#marketDetail {
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
.shop_cart {
  width: 0.8rem;
  height: 0.8rem;
  padding: 0.2rem;
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

.scroll_div {
  width: 100%;
}
.content-con {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  width: 100%;
  padding: 0 0.2rem;
}
.content_list {
  display: inline-block;
  margin-top: 0.2rem;
  width: 3.45rem;
  line-height: 0;
  border: 1px solid #eee;
  border-radius: 0.1rem;
  overflow: hidden;
}
.content_list:nth-child(2n + 1) {
  margin-right: 0.2rem;
}
.content_list img {
  width: 100%;
  height: 3rem;
}
.content_list .con-title {
  padding: 0 0.2rem;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}
.content_list .con-title3 {
  padding: 0 0.2rem;
}
.content_list .con-title3 span {
  font-size: 0.24rem;
  line-height: 0.24rem;
  color: #666;
}
.content_list .con-title h3 {
  /* width: calc(100% - 3rem); */
  font-size: 0.28rem;
  line-height: 0.48rem;
  height: 0.48rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
.content_list .con-title img {
  width: 0.48rem;
  height: 100%;
}
.content_list .con-title2 {
  padding: 0 0.22rem;
  margin-top: 0.02rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content_list .con-title2 h3 {
  width: calc(100% - 0.36rem);
  font-size: 0.24rem;
  line-height: 0.36rem;
  height: 0.36rem;
  overflow: hidden;
  font-weight: normal;
  color: #ef6213;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
.content_list .con-title2 img {
  width: 0.36rem;
  height: 0.36rem;
}
.button-style {
  height: 40px;
}
.button-style >>> .mint-button-icon {
  width: 35px;
  text-align: center;
}

#marketDetail >>> .is-right {
  font-size: 0;
}
#marketDetail >>> .mint-header-button > a > button:nth-child(1) > span {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
#marketDetail >>> .mint-header-button > a > button:nth-child(2) > span {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.button-style >>> .mintui {
  display: inline-block !important;
  font-size: 20px !important;
  line-height: 35px !important;
}
.text-box {
  border-top: 1px solid #ddd;
  padding: 0.2rem 0;
}
/* 暂无数据 */
#no-data {
  width: 100%;
  text-align: center;
  padding-top: 1rem;
  transition: all 0.2s;
}
#no-data > img {
  width: 40%;
  height: auto;
}
</style>
