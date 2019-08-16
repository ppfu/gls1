<template>
  <div id="message">
    <mt-header fixed title="平台资讯">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab
        :line-width="2"
        bar-active-color="#ef6213"
        active-color="#ef6213"
        :scroll-threshold="5"
        v-model="messageIndex"
      >
        <tab-item selected @on-item-click="setmessageIndex(0)">新闻</tab-item>
        <tab-item @on-item-click="setmessageIndex(1)">报道</tab-item>
        <tab-item @on-item-click="setmessageIndex(2)">公告</tab-item>
        <tab-item @on-item-click="setmessageIndex(3)">活动专区</tab-item>
      </tab>
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
            <div v-if="messageIndex==0" class="tab-swiper vux-center">
              <div class="news">
                <div
                  class="news_list"
                  @click="gotoNewDetail(messageitem)"
                  v-for="(messageitem,index) in list"
                  :key="index"
                >
                  <div class="news_img">
                    <img :src="messageitem.img" />
                  </div>
                  <div class="news_info">
                    <p>{{messageitem.title}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="messageIndex==1" class="tab-swiper vux-center">
              <div class="news">
                <div
                  class="news_list"
                  @click="gotoNewDetail(messageitem)"
                  v-for="(messageitem,index) in list"
                  :key="index"
                >
                  <div class="news_img">
                    <img :src="messageitem.img" />
                  </div>
                  <div class="news_info">
                    <p>{{messageitem.title}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="messageIndex==2" class="tab-swiper vux-center">
              <div class="news">
                <div
                  class="news_list"
                  @click="gotoNewDetail(messageitem)"
                  v-for="(messageitem,index) in list"
                  :key="index"
                >
                  <div class="news_img">
                    <img :src="messageitem.img" />
                  </div>
                  <div class="news_info">
                    <p>{{messageitem.title}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="messageIndex==3" class="tab-swiper vux-center">
              <div class="activity_news">
                <!-- <load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
                <load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>-->
                <div
                  class="news_list"
                  @click="gotoNewDetail(actitem)"
                  v-for="(actitem,index) in activityList"
                  :key="index"
                >
                  <div class="news_img">
                    <img :src="actitem.img" />
                  </div>
                  <div class="news_info">
                    <p>{{actitem.title}}</p>
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
import { Indicator, Toast } from "mint-ui";
import { Tab, TabItem } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    Indicator,
    Toast
  },
  data() {
    return {
      messageIndex: 0,
      pageindex: 1, // 第一页
      activityList: [], //活动
      list: [], //列表
      listTotal: 0, // 总数量
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted: function() {
    let that = this;
    that.getListFun();
    that.getActivityList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoNewDetail(item) {
      let that = this;
      window.sessionStorage.setItem("message_type", item.type);
      window.sessionStorage.setItem("news_id", item.id);
      that.$router.push({
        path: "/newsDetail",
        query: {
          storeId: item.id
        }
      });
    },
    setmessageIndex(i) {
      let that = this;
      that.messageIndex = i;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.list = [];
      that.getListFun(1);
    },
    // 下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.list = [];
      that.listTotal = 0;
      that.getListFun(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getListFun(1);
      that.getActivityList(); //活动
    },
    //获取新闻资讯
    getListFun(type) {
      let that = this;
      let typem = that.messageIndex == 0 ? 1 : that.messageIndex == 1 ? 2 : 3;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/noticeList",
          method: "post",
          data: {
            type: typem,
            p: that.pageindex
          }
        })
        .then((res)=> {
          Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.list = res.data.data.list;
                that.listTotal = res.data.data.count;
                if (that.list.length >= that.listTotal) {
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
                that.list = that.list.concat(res.data.data.list);
                that.listTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.list.length >= that.listTotal) {
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
    //获取活动
    getActivityList(type) {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/noticeList",
          method: "post",
          data: {
            type: 4
          }
        })
        .then((res)=> {
          Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.activityList = res.data.data.list;
                that.activityListTotal = res.data.data.count;
                if (that.activityList.length >= that.activityListTotal) {
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
                that.activityList = that.activityList.concat(res.data.data.list);
                that.activityListTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.activityList.length >= that.activityListTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
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
    }
  }
};
</script>

<style scoped="scoped">
#message {
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
  background: #ef6213;
}

.scroll_div {
  width: 100%;
  padding: 0 0.2rem;
}
.news {
  height: 100%;
}
.activity_news {
  margin-top: 0.2rem;
}

.news_list {
  margin: 0.2rem 0;
  display: flex;
  justify-content: space-between;
}

.news_list .news_img {
  width: 24%;
}

.news_list .news_img img {
  width: 100%;
}

.news_list .news_info {
  margin-left: 0.2rem;
  font-size: 0.26rem;
}
</style>
