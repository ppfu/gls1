<template>
  <div id="reserecord">
    <mt-header fixed title="预定记录">
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
        v-model="resereIndex"
      >
        <tab-item selected @on-item-click="setresereIndex(0)">已预订</tab-item>
        <tab-item @on-item-click="setresereIndex(1)">待收货</tab-item>
        <tab-item @on-item-click="setresereIndex(2)">已收货</tab-item>
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
            <div v-if="resereIndex==0" class="tab-swiper vux-center">
              <div class="comm_de">
                <div class="yipin_list" v-for="(item,index) in resereList" :key="index">
                  <div class="yipin_img">
                    <img :src="item.img" />
                  </div>
                  <div class="yipin_con">
                    <div>
                      <div>
                        <h4 class="yipin_title">{{item.title}}</h4>
                        <p class="spend">
                          <span>
                            单价:
                            <span>{{item.spend}} 元</span>
                          </span>
                          <span>数量:{{item.number}}</span>
                        </p>
                        <h5 class="yipin_time">预售时间:{{item.time}}</h5>
                        <h5 class="yipin_time">出售时间:{{item.sell_time}}</h5>
                      </div>
                      <span class="yipin_btn">已预订</span>
                    </div>
                    <h5
                      class="yipin_time"
                    >地址:{{item.province + item.city + item.area + item.address_detail}}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="resereIndex==1" class="tab-swiper vux-center">
              <div class="comm_de">
                <div class="yipin_list" v-for="(item,index) in resereList" :key="index">
                  <div class="yipin_img">
                    <img :src="item.img" />
                  </div>
                  <div class="yipin_con">
                    <div>
                      <div>
                        <h4 class="yipin_title">{{item.title}}</h4>
                        <p class="spend">
                          <span>
                            单价:
                            <span>{{item.spend}} 元</span>
                          </span>
                          <span>数量:{{item.number}}</span>
                        </p>
                        <h5 class="yipin_time">预售时间:{{item.time}}</h5>
                        <h5 class="yipin_time">出售时间:{{item.sell_time}}</h5>
                      </div>
                      <span class="yipin_btn yipin_btn_active" @click="confirm(item.id)">确认收货</span>
                    </div>
                    <h5
                      class="yipin_time"
                    >地址:{{item.province + item.city + item.area + item.address_detail}}</h5>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="resereIndex==2" class="tab-swiper vux-center">
              <div class="comm_de">
                <div class="yipin_list" v-for="(item,index) in resereList" :key="index">
                  <div class="yipin_img">
                    <img :src="item.img" />
                  </div>
                  <div class="yipin_con">
                    <div>
                      <div>
                        <h4 class="yipin_title">{{item.title}}</h4>
                        <p class="spend">
                          <span>
                            单价:
                            <span>{{item.spend}} 元</span>
                          </span>
                          <span>数量:{{item.number}}</span>
                        </p>
                        <h5 class="yipin_time">预售时间:{{item.time}}</h5>
                        <h5 class="yipin_time">出售时间:{{item.sell_time}}</h5>
                      </div>
                      <span class="yipin_btn">已收货</span>
                    </div>
                    <h5
                      class="yipin_time"
                    >地址:{{item.province + item.city + item.area + item.address_detail}}</h5>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- 	<load-more tip="加载更多"></load-more> -->
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { Tab, TabItem, LoadMore } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    Indicator,
    Toast,
    LoadMore
  },
  data() {
    return {
      resereIndex: 0,
      pageindex: 1, // 第一页
      shopId: this.$route.query.storeId, //商品id
			resereList: [], //列表
			resereListTotal: 0, // 店铺总数量
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted: function() {
    let that = this;
    that.getresereList();
  },
  activated() {
    this.$nextTick(() => {
      this.resereIndex = 0;
      this.pageindex = 1;
      this.lif = true;
      this.nif = false;
      this.loading = false;
      this.getresereList(1);
    });
  },
  methods: {
    back() {
      this.$router.push({
        path: "/yipinyidi"
      });
    },
    //选中相应的nav 初始化数据
    setresereIndex(i) {
      let that = this;
      that.resereIndex = i;
      that.loading = false;
      that.nif = false;
      that.pageindex = 1;
      that.resereList = [];
      that.getresereList(1);
    },
    // 下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.resereList = [];
      that.resereListTotal = 0;
      that.getresereList(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getresereList(1);
    },
    //获取列表
    getresereList(type) {
      let that = this;
      let typem = that.resereIndex == 0 ? 1 : that.resereIndex == 1 ? 2 : 3;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "subscribe/subscribeLog",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            status: typem,
            p: that.pageindex
          }
        })
        .then(function(res) {
					Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.resereList = res.data.data.list;
                that.resereListTotal = res.data.data.count;
                if (that.resereList.length >= that.resereListTotal) {
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
                that.resereList = that.resereList.concat(res.data.data.list);
                that.resereListTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.resereList.length >= that.resereListTotal) {
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
    },
    //确认收货
    confirm(id) {
      let that = this;
      Indicator.open({
        spinnerType: "fading-circle"
      });
      that
        .$http({
          url: "subscribe/setSubscribeReceive",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            id: id
          }
        })
        .then(function(res) {
          Indicator.close();
          if (res.data.code == 0) {
            //成功回调
            that.getresereList();
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
#reserecord {
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
.scroll_div {
  width: 100%;
  height: calc(100% - 0.8rem);
}

.comd_img {
  width: 100%;
  height: auto;
}

.comm_de {
  width: 100%;
  padding: 0.2rem;
  height: 100%;
}

.yipin_list {
  margin: 0.2rem 0;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
}

.yipin_img {
  width: 2rem;
  height: 2rem;
}

.yipin_img img {
  width: 2rem;
  height: 2rem;
}

.yipin_con {
  margin-left: 0.2rem;
  width: 4.9rem;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.yipin_con > div {
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  -webkit-flex-direction: row;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
}

.yipin_con > div > div {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.yipin_title {
  font-size: 0.28rem;
  color: #333;
}

.yipin_time {
  font-weight: normal;
  color: #555;
  line-height: 0.4rem;
  font-size: 0.24rem;
}

.yipin_btn {
  width: 1rem;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.24rem;
  background-color: rgba(217, 217, 217, 1);
  color: rgba(255, 255, 255, 1);
  border-radius: 50%;
  text-align: center;
}

.yipin_btn_active {
  background-color: #ef6213;
  padding: 0.2rem;
  line-height: 0.3rem;
}

.spend span {
  font-size: 0.24rem;
  color: #666;
}

.spend span > span {
  padding-right: 0.2rem;
  font-size: 0.24rem;
  color: #ef6213;
}
</style>
