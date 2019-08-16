<template>
  <div id="storehome">
    <!-- 头部 -->
    <mt-header fixed title="创客商城"></mt-header>
    <!-- 轮播 -->
    <div class="con-wrapper">
      <div class="swipe">
        <mt-swipe :auto="4000">
          <mt-swipe-item
            v-for="(item,index) in banner"
            :key="index"
            @click.native="linkTo(item.url, item.parameter)"
          >
            <img :src="item.link" />
          </mt-swipe-item>
        </mt-swipe>
        <div class="search">
          <input type="search" placeholder="请输入店铺名称" v-model="name" @blur="onRefresh" />
          <button :disabled="name == ''" @click="onRefresh">
            <i class="iconfont icon-tabsearch"></i>
          </button>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content">
        <div class="nav">
          <ul :style="{width: percentage + '%'}">
            <li
              v-for="(item,index) in shopKey"
              :key="index"
              :class="{'shop-key-active': shopNavId == item.id}"
              :style="{width: 100 / shopKey.length + '%'}"
              @click="shopNavFun('',item.id)"
            >
              <a>{{item.name}}</a>
            </li>
          </ul>
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
              <div class="content-con">
                <div
                  class="content_list"
                  @click="gotoStore(item)"
                  v-for="(item,index) in shopList"
                  :key="index"
                >
                  <img :src="item.img" />
                  <div class="con-title">
                    <h3>{{item.name}}</h3>
                    <!-- 蓝钻 -->
                    <span v-if="item.level < 4 && item.level > 0" class="blue-zuan"></span>
                    <span v-if="item.level == 2 || item.level == 3" class="blue-zuan"></span>
                    <span v-if="item.level ==3" class="blue-zuan"></span>
                    <!-- 黄钻 -->
                    <span v-if="item.level < 7 && item.level >= 4" class="yellow-zuan"></span>
                    <span v-if="item.level < 7 && item.level > 4" class="yellow-zuan"></span>
                    <span v-if="item.level == 6" class="yellow-zuan"></span>
                    <!-- 蓝冠-->
                    <span v-if="item.level < 10 && item.level >= 7" class="blue-guan"></span>
                    <span v-if="item.level < 10 && item.level > 7" class="blue-guan"></span>
                    <span v-if="item.level == 9" class="blue-guan"></span>
                    <!-- 皇冠 -->
                    <span v-if="item.level < 13 && item.level >= 10" class="yellow-guan"></span>
                    <span v-if="item.level < 13 && item.level > 10" class="yellow-guan"></span>
                    <span v-if="item.level == 12" class="yellow-guan"></span>
                    <!-- 金冠 -->
                    <span v-if="item.level == 13" class="gold-guan"></span>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, Toast, SwipeItem, Indicator } from "mint-ui";
export default {
  components: {
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem,
    Toast
  },
  data() {
    return {
      pageindex: 1,
      banner: [], //轮播图
      shopKey: [], //店铺筛选条件（关键字）
      shopList: [], //店铺列表
      shopListTotal: 0, // 店铺总数量
      percentage: "", // 店铺列表动态宽
      shopNavId: "", //行业ID
      name: "", //搜索名称
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  watch: {},
  mounted() {
    let that = this;
    that.getShopData();
  },
  methods: {
    //选择相应的tab，初始化数据 //选中行业
    shopNavFun(name, id) {
      let that = this;
      that.shopNavId = id;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.shopList = [];
      that.getShopList(0);
    },
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
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getShopList(1);
    },
    // 获取创客商城首页信息
    getShopData() {
      let that = this;
      Indicator.open({
        spinnerType: "fading-circle"
      });
      that
        .$http({
          url: "Ckshop/index",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            that.banner = res.data.data.banner;
            that.shopKey = res.data.data.industry;
            that.shopKey.unshift({
              id: 0,
              name: "全部"
            });
            that.shopNavId = that.shopKey[0].id; //默认行业id
            if (that.shopKey.length >= 4) {
              that.percentage = 20 * that.shopKey.length;
            } else {
              that.percentage = 100;
            }
            if (res.data.data.shop.list.length > 0) {
              that.shopList = res.data.data.shop.list;
              that.shopListTotal = res.data.data.shop.count;
              if (that.shopList.length >= that.shopListTotal) {
                //全部数据已加载
                that.finished = true;
              }
            } else {
              that.finished = true;
            }
            that.updateLoading = false;
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
    getShopList(type) {
      // 获取商家列表 type:0刷新 1加载
      let that = this;
      Indicator.open({
        spinnerType: "fading-circle"
      });
      that
        .$http({
          url: "Ckshop/shopList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            name: that.name,
            industry_id: that.shopNavId,
            p: that.pageindex
          }
        })
        .then(res => {
          Indicator.close();
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
              if (res.data.data.list.length > 0) {
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
    // 进入店铺
    gotoStore(item) {
      this.$router.push({
        path: "/store",
        query: {
          name: item.name,
          storeId: item.id
        }
      });
    },
    linkTo(url) {
      this.$router.push({
        path: url
      });
    }
  }
};
</script>
<style scoped="scoped">
#storehome {
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
#storehome .mint-header {
  background: #ef6213;
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

.content {
  width: 100%;
}
.content .nav {
  width: 100%;
  overflow-x: scroll;
}
.content .nav ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  text-align: center;
  white-space: nowrap;
}
.content .nav ul li {
  padding: 0.2rem 0;
  font-size: 0.28rem;
  border-bottom: 1px solid #e9e9e9;
}
.content .nav ul li a {
  color: #999;
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
  padding: 0.2rem 0.1rem;
  border-top: 1px solid #eee;
}
.content_list .con-title h3 {
  font-size: 0.28rem;
  font-weight: 600;
  display: inline-block;
  line-height: 0.4rem;
  vertical-align: top;
}
.content_list .con-title > span {
  display: block;
  line-height: 0.4rem;
  float: right;
  width: 0.4rem;
  height: 0.4rem;
}
.content_list .con-title img {
  width: 0.48rem;
  height: 0.48rem;
}
.content_list .con-title2 {
  margin-top: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.content_list .con-title2 h3 {
  font-size: 0.24rem;
  font-weight: normal;
  color: #ef6213;
}
.content_list .con-title2 img {
  width: 0.36rem;
  height: 0.36rem;
}
.blue-zuan {
  background: url(../../assets/img/lz.png) no-repeat center center / 0.34rem
    0.28rem;
}
.yellow-zuan {
  background: url(../../assets/img/hz.png) no-repeat center center / 0.34rem
    0.28rem;
}
.blue-guan {
  background: url(../../assets/img/lg.png) no-repeat center center / 0.34rem
    0.28rem;
}
.yellow-guan {
  background: url(../../assets/img/hg.png) no-repeat center center / 0.34rem
    0.28rem;
}
.gold-guan {
  background: url(../../assets/img/jg.png) no-repeat center center / 0.34rem
    0.28rem;
}
.shop-key-active {
  border-color: #ef6213 !important;
}
.shop-key-active > a {
  color: #ef6213 !important;
}
body >>> .mint-indicator-mask {
  background: rgba(0, 0, 0, 0.5);
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
