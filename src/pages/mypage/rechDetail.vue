<template>
  <div id="rechdetail">
    <mt-header fixed title="流水明细">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="scroll_div">
        <van-pull-refresh
          v-model="isLoading"
          pulling-text="下拉刷新"
          loosing-text="释放更新"
          loading-text="正在加载..."
          @refresh="onRefresh"
        >
          <div
            class="div"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
          >
            <div class="detail_con">
              <div class="detail_list" v-for="(item,index) in rechList" :key="index">
                <div class="detail_re">
                  <span>{{item.typeText}}</span>
                  <span>{{item.money}}</span>
                </div>
                <div class="detail_time">
                  <span>成功</span>
                  <span>{{item.time}}</span>
                </div>
              </div>
            </div>
          </div>
          <load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
          <load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import { LoadMore } from "vux";
export default {
  components: {
    Indicator,
    Toast,
    LoadMore
  },
  data() {
    return {
      rechList: [], //充值数据
      pageindex: 1, //第一页
      load: true, //加载图标显示
      none: false, //加载图标隐藏
      lif: true, //正在加载中 显示
      nif: false, //没有更多数据了 隐藏
      loading: false, //下拉刷新
      isLoading: false //上拉加载更多
    };
  },
  mounted: function() {
    let that = this;
    that.getRechargeDetail();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //下拉刷新
    onRefresh() {
      let that = this;
      that.isLoading = true;
      that.loading = false;
      that.nif = false;
      that.pageindex = 1;
      that.rechList = [];
      that.getRechargeDetail(1);
    },
    //上拉加载更多
    loadMore() {
      let that = this;
      that.lif = true;
      that.pageindex++;
      that.getRechargeDetail(0);
    },
    //获取推广收益明细
    getRechargeDetail(i) {
      let that = this;
      if (i) {
        that.lif = true;
      }
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Personal/rechargeLog",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            p: that.pageindex
          }
        })
        .then(function(res) {
          that.lif = false;
          that.isLoading = false;
          if (res.data.code == 0) {
            //成功回调
            if (res.data.data.list != "") {
              that.rechList = that.rechList.concat(res.data.data.list);
            } else {
              that.nif = true;
              that.loading = true;
            }
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
    }
  }
};
</script>

<style scoped="scoped">
#rechdetail {
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
  height: 100%;
  padding: 0 0.2rem;
}

.detail_con .detail_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}

.detail_con .detail_re {
  padding-bottom: 0.1rem;
  display: flex;
  justify-content: space-between;
}

.detail_con .detail_re span {
  color: #333;
}

.detail_con .detail_time {
  display: flex;
  justify-content: space-between;
  color: #777777;
}

.detail_con .detail_time span:nth-child(1) {
  color: #ef6213;
}
</style>
