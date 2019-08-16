<template>
  <div id="travel">
    <mt-header fixed title="实地旅游">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
      <p slot="right" class="iconfont icon-tabtianjia" @click="gotoApply"></p>
    </mt-header>
    <div class="con-wrapper">
      <div class="fruit">
        <tab
          :line-width="2"
          bar-active-color="#ef6213"
          active-color="#ef6213"
          :scroll-threshold="5"
        >
          <tab-item @on-item-click="settravelIndex(0)" :selected="travelIndex==0">待出行</tab-item>
          <tab-item @on-item-click="settravelIndex(1)" :selected="travelIndex==1">待审核</tab-item>
          <tab-item @on-item-click="settravelIndex(2)" :selected="travelIndex==2">已完成</tab-item>
        </tab>
        <!-- tab-container -->
        <div v-if="travelIndex==0" class="trav_con">
          <div class="fruit_list" v-for="(item,index) in travelList" :key="index">
            <div class="fruit_img">
              <img :src="item.img" />
            </div>
            <div class="fruit_con">
              <div class="fruit_title">
                <h4>{{item.name}}</h4>
              </div>
              <div class="qixian">
                已报名
                <span>{{item.enroll}}</span>
                总名额
                <span>{{item.quota}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="travelIndex==1" class="trav_con">
          <div class="fruit_list" v-for="(item,index) in travelList" :key="index">
            <div class="fruit_img">
              <img :src="item.img" />
            </div>
            <div class="fruit_con">
              <div class="fruit_title">
                <h4>{{item.name}}</h4>
                <span>待审核</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="travelIndex==2" class="trav_con">
          <div class="fruit_list" v-for="(item,index) in travelList" :key="index">
            <div class="fruit_img">
              <img :src="item.img" />
            </div>
            <div class="fruit_con">
              <div class="fruit_title">
                <h4>{{item.name}}</h4>
                <span>已完成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="no-data" v-if="travelList.length == 0">
        <img src="../../assets/img/nodata.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem } from "vux";
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Tab,
    TabItem,
    Indicator,
    Toast
  },
  data() {
    return {
      selected: this.$route.query.travelIndex,
      travelIndex: this.$route.query.travelIndex,
      travelList: [], //旅游列表
      status: "" //旅游状态
    };
  },
  mounted: function() {
    let that = this;
    that.getTourismApplyList();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    gotoApply() {
      let that = this;
      that.$router.push({
        path: "/applyTravel",
        query: {
          travelIndex: that.travelIndex
        }
      });
    },
    //审核，待出行，已完成
    settravelIndex(index) {
      let that = this;
      if (index != that.travelIndex) {
        that.travelIndex = index;
        that.getTourismApplyList();
      }
    },
    //获取申请旅游列表
    getTourismApplyList() {
      let that = this;
      // status = 0 =>审核, status= 1 =>待出行,status = 2 =>已完成
      that.status = that.travelIndex == 0 ? 1 : that.travelIndex == 1 ? 0 : 2;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Tourism/tourismApplyList",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            status: that.status
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.travelList = res.data.data; //列表
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
#travel {
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

#farmdetail .mint-tab-item-label {
  font-size: 0.3rem;
}

.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.fruit {
  width: 100%;
}
.trav_con {
  width: 100%;
  padding: 0 0.2rem;
}
.fruit_list {
  display: flex;
  margin-top: 0.2rem;
}

.fruit_list .fruit_img {
  width: 26%;
  height: 100%;
}

.fruit_list .fruit_img img {
  width: 100%;
}
.fruit_list .fruit_con {
  margin-left: 0.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fruit_list .fruit_con .fruit_title {
  display: flex;
  justify-content: space-between;
}

.fruit_list .fruit_con .fruit_title h4 {
  font-size: 0.3rem;
  color: #333;
  font-weight: normal;
}

.fruit_list .fruit_con .fruit_title span {
  font-size: 0.26rem;
  color: #ef6213;
}

.fruit_list .fruit_con .qixian {
  display: flex;
  align-items: center;
  padding-top: 0.7rem;
  justify-content: flex-end;
  font-size: 0.26rem;
  color: #666;
}

.fruit_list .fruit_con .qixian span {
  padding: 0 0.1rem;
  color: #ef6213;
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
