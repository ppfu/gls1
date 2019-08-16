<template>
  <div id="withdetail">
    <mt-header fixed title="推广收益明细">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="detail_con">
        <div class="detail_list" v-for="(item,index) in invitation" :key="index">
          <div class="detail_re">
            <span>用户{{item.phone}}</span>
            <span>{{item.money}}</span>
          </div>
          <div class="detail_time">{{item.time}}</div>
        </div>
      </div>
      <div id="no-data" v-if="invitation.length == 0">
        <img src="../../assets/img/nodata.png" />
      </div>
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
      invitation: [],
      pageIndex: 1,
      count: "" //总数据
    };
  },
  mounted: function() {
    let that = this;
    that.getInvitation();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取推广收益明细
    getInvitation() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "Personal/invitationLog",
          method: "post",
          data: {
            token: localStorage.getItem("token"),
            p: that.pageIndex
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.invitation = that.invitation.concat(res.data.data.list);
            that.count = res.data.data.count;
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
    },
    //获取更多
    getMore() {
      let that = this;
      that.pageIndex++;
      that.getInvitation();
    }
  }
};
</script>

<style scoped="scoped">
#withdetail {
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

.detail_con {
  width: 100%;
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
  text-align: right;
  color: #777777;
}
.get_more {
  text-align: center;
  padding-top: 0.2rem;
  border-top: 1px solid #e8e8e8;
  font-size: 0.26rem;
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
