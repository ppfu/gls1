<template>
  <div id="farmdetail">
    <mt-header fixed title="农场收益明细">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item selected @on-item-click="index=0">田园</tab-item>
        <tab-item @on-item-click="index=1">果园</tab-item>
        <tab-item @on-item-click="index=2">牧场</tab-item>
      </tab>
      <div v-if="index==0" class="detail_con">
        <scroller
          lock-x
          height="100%"
          @on-scroll-bottom="onScrollBottom"
          ref="scrollerBottom"
          :scroll-bottom-offst="200"
        >
          <div class="box2">
            <div class="detail_list">
              <div class="detail_re">
                <span>提现金额</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>提现米宝</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>提现余额</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>充值红包</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>扣减余额</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>充值余额</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <load-more tip="加载更多"></load-more>
          </div>
        </scroller>
      </div>
      <!-- tab-container -->
      <div v-if="index==1" class="detail_con">
        <scroller
          lock-x
          height="100%"
          @on-scroll-bottom="onScrollBottom"
          ref="scrollerBottom"
          :scroll-bottom-offst="200"
        >
          <div class="box2">
            <div class="detail_list">
              <div class="detail_re">
                <span>黑土地收益</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>黄土地收益</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>金土地收益</span>
                <span>+100.00</span>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <load-more tip="加载更多"></load-more>
          </div>
        </scroller>
      </div>
      <div v-if="index==2" class="detail_con">
        <scroller
          lock-x
          height="100%"
          @on-scroll-bottom="onScrollBottom"
          ref="scrollerBottom"
          :scroll-bottom-offst="200"
        >
          <div class="box2">
            <div class="detail_list">
              <div class="detail_re">
                <span>黑土地收益</span>
                <div class="nuum">
                  <span>金额：</span>
                  <span>￥600.00</span>
                  <span>数量：</span>
                  <span>-50</span>
                </div>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>黑土地收益</span>
                <div class="nuum">
                  <span>金额：</span>
                  <span>￥600.00</span>
                  <span>数量：</span>
                  <span>-50</span>
                </div>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <div class="detail_list">
              <div class="detail_re">
                <span>黑土地收益</span>
                <div class="nuum">
                  <span>金额：</span>
                  <span>￥600.00</span>
                  <span>数量：</span>
                  <span>-50</span>
                </div>
              </div>
              <div class="detail_time">2019-05-10 08:12:03</div>
            </div>
            <load-more tip="加载更多"></load-more>
          </div>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, Scroller, LoadMore, TabItem } from "vux";
export default {
  components: {
    Tab,
    TabItem,
    Scroller,
    LoadMore
  },
  data() {
    return {
      selected: "1",
      index: 0,
      scrollTop: 0,
      onFetching: false,
      bottomCount: 20
    };
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    }
  }
};
</script>

<style scoped="scoped">
#farmdetail {
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

.mint-tab-item-label {
  font-size: 0.3rem;
}

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.detail_con {
  width: 90%;
  margin: 0 auto;
  margin-top: 0.1rem;
}

.detail_con .detail_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}

.detail_con .detail_list .nuum span:nth-child(2) {
  margin-right: 0.2rem;
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
  text-align: right;
  color: #777777;
}

.detail_con .mint-button--normal {
  /* height: 0.8rem; */
  padding: 0 0.4rem;
}

.mint-button {
  height: 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.26rem;
  background: #ef6213;
}
</style>
