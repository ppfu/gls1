<template>
  <div id="orchard">
    <mt-header fixed title="我的牧场">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="detail_con">
        <div class="detail_list" v-for="(item,index) in pastureList" :key="index">
          <div class="detail_list1">
            <span>{{item.title}}</span>
            <div class="nuum">
              <span>{{item.time}}</span>
            </div>
          </div>
          <div class="detail_pe">
            <div class="pe_name">
              <span v-if="item.type==1">预计代售券</span>
              <!-- <span v-if="item.type==2">预计代售券</span> -->
              <span class="bonus">{{item.bonus}}</span>
            </div>
            <div class="stext">
              <span>期限&nbsp;&nbsp;&nbsp;{{item.term}}</span>
              <h5 clsss="mo">{{item.statusText}}</h5>
            </div>
          </div>
        </div>
      </div>
      <!-- <load-more tip="加载更多"></load-more> -->
      <div id="no-data" v-if="pastureList.length == 0">
        <img src="../../assets/img/nodata.png" />
      </div>
      <div style="height:50px;"></div>
    </div>
  </div>
</template>
<script>
import { Indicator, Toast } from "mint-ui";
export default {
  components: {
    Indicator,
    Toast
  },
  data() {
    return {
      pastureList: []
    };
  },
  mounted: function() {
    let that = this;
    that.getMypasture();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取我的田园
    getMypasture() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Adopt/adoptMy",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            type: 3
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            //成功回调
            that.pastureList = res.data.data;
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
#orchard {
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
.mint-navbar .mint-tab-item.is-selected {
  color: #ef6213;
  border-bottom: 2px solid #ef6213;
}

.detail_con {
  width: 100%;
  padding: 0 0.2rem;
}

.detail_con .detail_list {
  border-bottom: 1px solid #e9e9e9;
  font-size: 0.26rem;
  padding-top: 0.2rem;
}

.detail_con .detail_list1,
.detail_con .detail_pe {
  padding-bottom: 0.2rem;
  display: flex;
  justify-content: space-between;
}
.detail_con .pe_name {
  font-size: 0.22rem;
}
.detail_con .pe_name span:nth-child(2) {
  padding-right: 0.4rem;
  color: red;
}

.detail_con .detail_pe h5 {
  font-weight: normal;
  color: #ef6213;
}
.detail_con .detail_pe .stext {
  display: flex;
}

.detail_con .detail_pe .stext span {
  font-size: 0.22rem;
  padding-right: 0.4rem;
}
.detail_con .detail_list1 span,
.detail_con .detail_pe span {
  color: #333;
}
.detail_con .detail_time {
  text-align: right;
  color: #777777;
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
