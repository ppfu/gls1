<template>
  <div id="receivered">
    <mt-header fixed title="所领红包">
      <a slot="left">
        <mt-button icon="back" @click="back">返回</mt-button>
      </a>
    </mt-header>
    <div class="con-wrapper">
      <div class="detail_con">
        <div class="detail_list" v-for="(item,index) in hongList" :key="index">
          <div class="detail_re">
            <span>{{item.number}}个</span>
            <span>已领{{item.receive_number}}个</span>
          </div>
          <div class="detail_time">
            <span class="red_url">红包链接：{{item.url}}</span>
            <span
              v-clipboard:copy="item.url"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >分享</span>
          </div>
        </div>
      </div>
      <div id="no-data" v-if="hongList.length == 0">
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
      hongList: [] //红包数据
    };
  },
  mounted: function() {
    let that = this;
    that.getHongbao();
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    //获取所领红包
    getHongbao() {
      let that = this;
      Indicator.open({
        text: "加载中..."
      });
      that
        .$http({
          url: "hong_bao/hongbaoPage",
          method: "post",
          data: {
            token: localStorage.getItem("token")
          }
        })
        .then(function(res) {
          if (res.data.code == 0) {
            //成功回调
            that.hongList = res.data.data;
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
    //复制失败
    onError() {
      // 移动端走的失败
      // alert(navigator.userAgent);
      if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        if (/ baiduboxapp/i.test(navigator.userAgent)) {
          window.location.replace(
            "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
          );
        } else {
          window.location.replace("weixin://");
        }
      } else {
        window.location.replace("weixin://");
      }
      Toast({
        message: "复制成功",
        position: "center",
        duration: 3000
      });
    },
    //复制成功
    onCopy() {
      // web走的成功
      // 邀请
      let that = this;
      if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        if (/ baiduboxapp/i.test(navigator.userAgent)) {
          window.location.replace(
            "bdbox://utils?action=sendIntent&minver=7.4&params=%7B%22intent%22%3A%22weixin://%23wechat_redirect%23Intent%3Bend%22%7D"
          );
        } else {
          window.location.replace("weixin://");
        }
      } else {
        window.location.replace("weixin://");
      }
      Toast({
        message: "提示复制成功，请粘贴到微信分享",
        position: "center",
        duration: 3000
      });
    }
  }
};
</script>

<style scoped="scoped">
#receivered {
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
.detail_con .detail_re {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.2rem;
}
.detail_con .detail_re span {
  color: #333;
}
.detail_con .detail_time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777777;
}
.detail_con .detail_time span:nth-child(1) {
  width: 70%;
  word-wrap: break-word;
  text-align: left;
  color: #333;
}
.detail_con .detail_time span:nth-child(2) {
  width: 1rem;
  height: 0.5rem;
  border: 1px solid #ef6213;
  color: #ef6213;
  text-align: center;
  line-height: 0.5rem;
  border-radius: 0.1rem;
}
.detail_con .detail_time span.ready {
  color: #999;
  border-color: #999;
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
