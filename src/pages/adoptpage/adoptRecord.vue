<template>
  <div id="adoptRecord">
    <mt-header fixed title="领养记录">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <tab :line-width="2" style="position: fixed;width: 100%;" bar-active-color="#ef6213" active-color="#ef6213" :scroll-threshold="5">
        <tab-item selected @on-item-click="index=0">消费记录</tab-item>
        <tab-item @on-item-click="index=1">返利记录</tab-item>
      </tab>
      <div v-if="index==0" class="tab-swiper vux-center" style="margin-top: 44px">
        <div class="record_con">
          <div class="record_list" v-for="list1 in recordList" :key="list1.id">
            <div class="record_re">
              <span>{{list1.title}}</span>
              <span>{{list1.total}}</span>
            </div>
            <div class="record_time">
              <span>{{list1.type}}</span>
              <span>{{list1.time}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="index==1" class="tab-swiper vux-center" style="margin-top: 44px">
        <div class="record_con">
          <div class="record_list" v-for="list2 in rebateList" :key="list2.id">
            <div class="record_re">
              <span>{{list2.title}}</span>
              <span>{{list2.total}}</span>
            </div>
            <div class="record_time">
              <span>{{list2.type}}</span>
              <span>{{list2.time}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
// import { PullRefresh } from "vant";
import { Tab, TabItem, LoadMore } from "vux";
// Vue.use(Vant);
export default {
  components: {
    Tab,
    TabItem,
    LoadMore
  },
  data() {
    return {
      selected: 0,
      index: "",
      tabindex: this.$route.query.tabindex,
      scrollTop: 0,
      onFetching: false,
      // bottomCount: 20,
      recordList: [],
      rebateList: []
    };
  },

  created: function() {
    this.getRecordList();
    this.getRebateList();
  },

  mounted: function() {},
  methods: {
    // 	back() {
    // 	this.$router.go(-1); //返回上一层
    // },
    back() {
      let that = this;
      that.$router.push({
        path: "/tabs/adopt",
        query: {
          tabindex: that.tabindex
        }
      });
    },
    //获取领养消费记录
    getRecordList() {
      let that = this;
      that
        .$http({
          url: "Adopt/recordList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            type: 1
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.recordList = res.data.data;
          } else {
            Toast("获取信息失败");
          }
        })
        .catch(function(error) {});
    },
    //获取返利记录
    getRebateList() {
      let that = this;
      that
        .$http({
          url: "Adopt/recordList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            type: 2
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.rebateList = res.data.data;
          } else {
            Toast("获取信息失败");
          }
        })
        .catch(function(error) {});
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
  height: calc(100% - .8rem);
  overflow-x: hidden;
  overflow-y: scroll;
  top: .8rem;
}

.mint-header {
  background: #ef6213;
}
.record_con {
  width: 100%;
  padding: 0 0.2rem;
}
.record_con .record_list {
  border-bottom: 1px solid #e9e9e9;
  padding: 0 0.2rem;
  font-size: 0.26rem;
  padding: 0.2rem 0;
}

.record_con .record_re {
  padding-bottom: 0.16rem;
  display: flex;
  justify-content: space-between;
}

.record_con .record_re span {
  color: #333;
}

.record_con .record_time {
  display: flex;
  justify-content: space-between;
}
.record_con .record_time span:nth-child(2) {
  color: #777777;
}
</style>
