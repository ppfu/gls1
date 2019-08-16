<template>
  <div id="payrecord">
    <mt-header fixed title="付款记录">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
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
            :immediate-check="true"
            finished-text="————— 已经没有更多了 —————"
            @load="onLoad"
          >
            <div class="pay_con">
              <div class="pay_list" v-for="(item,index) in payList" :key="index">
                <div class="pay_re">
                  <span>{{item.name}}</span>
                  <span>识别码: {{item.code}}</span>
                  <span>{{item.money}}</span>
                </div>
                <div class="pay_time">
                  <span>{{item.type}}</span>
                  <span>{{item.time}}</span>
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
import { Toast, Indicator } from "mint-ui";
import { LoadMore } from "vux";
export default {
  components: {
    Toast,
    LoadMore,
    Indicator
  },
  data() {
    return {
			payList: [],
			payListTotal: 0, // 总数量
      pageindex: 1,
      updateLoading: false, //下拉刷新
      moreloading: false, // 加载更多
      finished: false // 全部加载
    };
  },
  mounted: function() {
    let that = this;
    that.getPayList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //下拉刷新
    onRefresh() {
      let that = this;
      that.updateLoading = true;
      that.moreloading = false;
      that.finished = false;
      that.pageindex = 1;
      that.payList = [];
      that.payListTotal = 0;
      that.getPayList(0);
    },
    //上拉加载更多
    onLoad() {
      let that = this;
      that.pageindex += 1;
      that.moreloading = true;
      that.getPayList(1);
    },
    //获取领养消费记录
    getPayList(type) {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Subscribe/underShopLog",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            p: that.pageindex
          }
        })
        .then(function(res) {
					Indicator.close();
          if (res.data.code == 0) {
            if (type == 0) {
              if (res.data.data.list.length > 0) {
                that.payList = res.data.data.list;
                that.payListTotal = res.data.data.count;
                if (that.payList.length >= that.payListTotal) {
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
                that.payList = that.payList.concat(res.data.data.list);
                that.payListTotal = res.data.data.count;
              } else {
                that.finished = true;
              }
              if (that.payList.length >= that.payListTotal) {
                //全部数据已加载
                that.finished = true;
              }
            }
          } else {
            Toast("获取信息失败");
          }
          
        })
        .catch(function(error) {
          Indicator.close();
        });
    }
  }
};
</script>

<style scoped="scoped">
#adoptRecord {
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
.pay_con .pay_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}
.pay_con .pay_re {
  padding-bottom: 0.16rem;
  display: flex;
  justify-content: space-between;
}
.pay_con .pay_re span {
  display: inline-block;
  color: #333;
  width: 33.33%;
}
.pay_con .pay_re span:nth-last-child(1) {
  text-align: right;
}
.pay_con .pay_time {
  display: flex;
  justify-content: space-between;
}
.pay_con .pay_time span:nth-child(2) {
  color: #777777;
}
.pay_con .pay_time span:nth-child(1) {
  color: #ef6213;
}
</style>
