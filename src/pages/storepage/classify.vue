<template>
  <div id="classify">
    <mt-header fixed title="分类">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="class_con">
        <div class="class_left">
          <mt-navbar v-model="selected">
            <mt-tab-item id="a">全部</mt-tab-item>
            <mt-tab-item
              v-for="(item,index) in shopKey"
              :key="index"
              @click.native="setIndustryData(item.id)"
              :id="item.id"
            >{{item.name}}</mt-tab-item>
          </mt-navbar>
        </div>
        <div class="class_right">
          <!-- tab-container -->
          <mt-tab-container>
            <mt-tab-container-item>
              <div class="content-con">
                <div
                  class="content_list"
                  @click="gotoStore(item)"
                  v-for="(item,index) in shopList"
                  :key="index"
                >
                  <img :src="item.img" />
                  <div class="con-title">
                    <h3
                      :class="{'h-width':item.level == 0,'h-width2':item.level == 2 || item.level == 5 || item.level == 8 || item.level == 11,'h-width1':item.level == 1 || item.level == 7 || item.level == 4 || item.level == 13 || item.level == 10,'h-width3':item.level == 3 || item.level == 9 || item.level == 6 || item.level == 12}"
                    >{{item.name}}</h3>
                    <!-- 蓝钻 -->
                    <span v-if="item.level < 4 && item.level > 0" class="blue-zuan"></span>
                    <span v-if="item.level == 2 || item.level == 3" class="blue-zuan"></span>
                    <span v-if="item.level ==3" class="blue-zuan"></span>
                    <!-- 黄钻 -->
                    <span v-if="item.level < 7 && item.level >= 4" class="yellow-zuan"></span>
                    <span v-if="item.level < 7 && item.level > 4" class="yellow-zuan"></span>
                    <span v-if="item.level == 6" class="yellow-zuan"></span>
                    <!-- 蓝冠 -->
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
            </mt-tab-container-item>
          </mt-tab-container>
          <div id="no-data" v-if="shopList.length == 0">
            <img src="../../assets/img/nodata.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Navbar, TabItem, Indicator } from "mint-ui";
export default {
  components: {
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem,
    Navbar: Navbar,
    TabItem: TabItem
  },
  data() {
    return {
      selected: "a",
      shopKey: [], //店铺筛选条件（关键字）
      shopList: [], //店铺列表
      industry_id: "" //行业ID
    };
  },
  mounted() {
    let that = this;
    that.getShopData();
  },
  methods: {
    // 返回上一页
    back() {
      this.$router.go(-1); //返回上一层
    },
    // 获取 全部 店铺 信息
    getShopData() {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Ckshop/index",
          method: "post"
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            //成功回调
            that.shopKey = res.data.data.industry;
            that.shopList = res.data.data.shop.list;
            that.selected = "a";
          } else {
            //失败
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
    // 选择行业
    setIndustryData(id) {
      let that = this;
      Indicator.open({
        // text: "加载中...",
        //文字
        spinnerType: "fading-circle"
        //样式
      });
      that
        .$http({
          url: "Ckshop/shopList",
          method: "post",
          data: {
            name: that.name,
            industry_id: id
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.shopList = res.data.data.list;
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
    // 进入店铺
    gotoStore(item) {
      window.sessionStorage.setItem("title", item.name);
      window.sessionStorage.setItem("storeId", item.id);
      this.$router.push({
        path: "/store"
      });
    }
  }
};
</script>

<style scoped="scoped">
#classify {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#classify >>> .mint-tab-item-label {
  font-size: 0.3rem;
}
.con-wrapper {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  top: 40px;
}

.mint-header {
  position: relative;
  background: #ef6213;
}
.class_con {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  height: 100%;
}
.class_con .class_left {
  width: 22%;
  padding-top: 10px;
  box-shadow: 0 0 0.05rem rgba(0, 0, 0, 0.2);
}
.class_con .class_left .mint-navbar {
  display: flex;
  flex-direction: column;
}
.mint-tab-item-label {
  font-size: 0.28rem;
}
.mint-navbar .mint-tab-item {
  padding: 0.2rem 0;
  border-color: transparent;
}
.mint-navbar .mint-tab-item.is-selected {
  transition: all 0.2s;
  color: #ef6213;
  background: #eee;
}
.class_right {
  flex: 1;
  padding: 0 0.2rem;
  overflow-y: auto;
  padding-top: 10px;
}
.content-con {
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: space-between;
}
.content_list {
  width: 48%;
  padding-bottom: 0.4rem;
  font-size: 0;
}
.content_list img {
  width: 100%;
  height: 2rem;
}
.content_list .con-title {
  padding: 0.1rem;
  border: 1px solid #eee;
  border-top: none;
}
.content_list .con-title h3 {
  display: inline-block;
  font-size: 0.28rem;
  font-weight: 600;
  line-height: 0.4rem;
  height: 0.4rem;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /*规定段落中的文本不进行换行 */
}
.h-width {
  width: 100%;
}
.h-width1 {
  width: calc(100% - 0.4rem);
}
.h-width2 {
  width: calc(100% - 0.8rem);
}
.h-width3 {
  width: calc(100% - 1.2rem);
}
.content_list .con-title > span {
  display: block;
  line-height: 0.4rem;
  float: right;
  width: 0.4rem;
  height: 0.4rem;
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
